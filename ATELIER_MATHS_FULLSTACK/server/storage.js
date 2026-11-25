'use strict';

const fs = require('node:fs');
const path = require('node:path');
const fsp = fs.promises;

const DATA_DIR = path.resolve(process.env.ATELIER_DATA_DIR || path.resolve(__dirname, '../data')); 
const STATE_DIR = path.join(DATA_DIR, 'state');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const STATE_KEYS = Object.freeze([
  'atelier-maths-fr-2026-v1',
  'atelier-maths-presentation-studio-v1',
  'atelier-maths-language',
]);

async function prepare() {
  await Promise.all([STATE_DIR, UPLOAD_DIR].map(dir => fsp.mkdir(dir, { recursive: true })));
}

function safeStateKey(key) {
  if (!STATE_KEYS.includes(key)) throw Object.assign(new Error('Unknown state key'), { status: 400 });
  return key;
}
function statePath(key) { return path.join(STATE_DIR, `${safeStateKey(key)}.json`); }
async function stateGet(key) {
  try { return (await fsp.readFile(statePath(key), 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
async function atomicallyWrite(target, payload) {
  const temp = `${target}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
  try { await fsp.writeFile(temp, payload); await fsp.rename(temp, target); }
  catch (e) { await fsp.rm(temp, { force: true }).catch(() => {}); throw e; }
}
// A queue prevents multiple near-simultaneous requests from losing a newer update.
const writeQueues = new Map();
async function serialize(key, action) {
  const previous = writeQueues.get(key) || Promise.resolve();
  const next = previous.catch(() => {}).then(action);
  writeQueues.set(key, next);
  try { return await next; }
  finally { if (writeQueues.get(key) === next) writeQueues.delete(key); }
}
async function statePut(key, value) {
  safeStateKey(key);
  if (typeof value !== 'string') throw Object.assign(new Error('State must be a string'), { status: 400 });
  if (Buffer.byteLength(value, 'utf8') > 40 * 1024 * 1024) throw Object.assign(new Error('State too large'), { status: 413 });
  if (key !== 'atelier-maths-language') {
    try { JSON.parse(value); }
    catch { throw Object.assign(new Error('Invalid JSON state'), { status: 400 }); }
  }
  await serialize(key, () => atomicallyWrite(statePath(key), value));
}
function safeUploadId(id) {
  if (!/^[a-z0-9_.-]{1,128}$/i.test(id) || id.includes('..')) {
    throw Object.assign(new Error('Invalid upload ID'), { status: 400 });
  }
  return id;
}
function uploadPaths(id) {
  safeUploadId(id);
  return { data: path.join(UPLOAD_DIR, `${id}.bin`), meta: path.join(UPLOAD_DIR, `${id}.json`) };
}
async function uploadPut(id, data, mime = 'application/octet-stream', filename = '') {
  const files = uploadPaths(id);
  if (!Buffer.isBuffer(data) || data.length > 80 * 1024 * 1024) throw Object.assign(new Error('File too large'), { status: 413 });
  // Original user-uploaded filenames are metadata only; never part of a filesystem path.
  const meta = {
    id,
    name: String(filename || id).slice(0, 240),
    contentType: /^[\w.+-]+\/[\w.+-]+$/.test(mime) ? mime : 'application/octet-stream',
    bytes: data.length,
    updatedAt: new Date().toISOString(),
  };
  await serialize(`upload:${id}`, async () => {
    await atomicallyWrite(files.data, data);
    await atomicallyWrite(files.meta, JSON.stringify(meta, null, 2));
  });
  return meta;
}
async function uploadGet(id) {
  const files = uploadPaths(id);
  try {
    const [buffer, metaRaw] = await Promise.all([
      fsp.readFile(files.data),
      fsp.readFile(files.meta),
    ]);
    return { buffer, meta: JSON.parse(metaRaw) };
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }
}
async function uploadDelete(id) {
  const files = uploadPaths(id);
  await serialize(`upload:${id}`, async () => {
    await Promise.all([fsp.rm(files.data, { force: true }), fsp.rm(files.meta, { force: true })]);
  });
}
async function uploadIds() {
  const files = await fsp.readdir(UPLOAD_DIR).catch(() => []);
  return files.filter(name => name.endsWith('.bin')).map(name => name.slice(0, -4));
}
async function summarize() {
  const result = {};
  for (const key of STATE_KEYS) {
    const state = await stateGet(key);
    result[key] = { saved: state !== null, bytes: state ? Buffer.byteLength(state) : 0 };
  }
  const files = await fsp.readdir(UPLOAD_DIR).catch(() => []);
  return { state: result, uploadCount: files.filter(n => n.endsWith('.bin')).length };
}

module.exports = { DATA_DIR, STATE_KEYS, prepare, stateGet, statePut, uploadGet, uploadPut, uploadDelete, uploadIds, summarize };
