'use strict';

// Atelier Maths local full-stack server. Uses only Node.js built-in modules.
// It listens on 127.0.0.1:4173, NOT on public network interfaces.

const http = require('node:http');
const fs = require('node:fs');
const fsp = fs.promises;
const path = require('node:path');
const { URL } = require('node:url');
const storage = require('./storage');

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const PORT = Number(process.env.ATELIER_PORT || 4173);
const HOST = '127.0.0.1';
const LIMIT = 80 * 1024 * 1024;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.webp': 'image/webp',
};
function send(res, status, body, type='application/json; charset=utf-8', headers={}) {
  res.writeHead(status, {'Content-Type': type, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store', ...headers});
  res.end(body);
}
function json(res, status, object) { send(res, status, JSON.stringify(object)); }
function error(res, status, message) { json(res, status, { ok: false, error: message }); }
function requireLocalOrigin(req) {
  const origin = req.headers.origin;
  if (origin && !new RegExp(`^http://(127\\.0\\.0\\.1|localhost):${PORT}$`).test(origin)) {
    throw Object.assign(new Error('Requests must come from the local Atelier Maths website'), { status: 403 });
  }
  const host = req.headers.host || '';
  if (host && !new RegExp(`^(127\\.0\\.0\\.1|localhost):${PORT}$`).test(host)) {
    throw Object.assign(new Error('Local access only'), { status: 403 });
  }
}
function collectBody(req, max=LIMIT) {
  return new Promise((resolve,reject) => {
    const chunks=[];let bytes=0;
    req.on('data', c=>{
      bytes+=c.length;
      if(bytes>max) { reject(Object.assign(new Error('Request body too large'),{status:413})); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end',()=>resolve(Buffer.concat(chunks)));
    req.on('error',reject);
  });
}
async function serveFile(req,res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return error(res, 405, 'Method not allowed');
  const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
  const target=path.resolve(PUBLIC_DIR,relative);
  if (!target.startsWith(PUBLIC_DIR + path.sep) && target !== path.join(PUBLIC_DIR,'index.html')) return error(res,403,'Forbidden');
  let info;
  try { info = await fsp.stat(target); } catch { return error(res,404,'File not found'); }
  if(!info.isFile()) return error(res,404,'File not found');
  const type = MIME[path.extname(target).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200,{ 'Content-Type': type, 'Content-Length': info.size, 'X-Content-Type-Options':'nosniff', 'Cache-Control': type === 'application/pdf' ? 'public, max-age=3600':'no-cache'});
  if(req.method === 'HEAD') return res.end();
  fs.createReadStream(target).pipe(res);
}
async function handler(req,res) {
  try {
    requireLocalOrigin(req);
    const pathname=new URL(req.url,'http://127.0.0.1').pathname;
    if(pathname==='/api/health' && req.method==='GET') return json(res,200,{ok:true,app:'Atelier Maths',mode:'local-fullstack',runtime:'Node.js',version:'1.0.0'});
    if(pathname==='/api/status' && req.method==='GET') return json(res,200,{ok:true,...await storage.summarize()});
    if(pathname==='/api/bootstrap.js' && req.method==='GET') {
      const data={};
      for(const key of storage.STATE_KEYS) data[key]=await storage.stateGet(key);
      const js=`window.__ATELIER_SERVER_INITIAL_STATE__=${JSON.stringify(data).replace(/</g,'\\u003c')};window.ATELIER_LOCAL_UPLOADS=new Set(${JSON.stringify(await storage.uploadIds())});`;
      return send(res,200,js,'text/javascript; charset=utf-8');
    }
    if(pathname.startsWith('/api/state/')) {
      const key=decodeURIComponent(pathname.slice('/api/state/'.length));
      if(req.method==='GET') return json(res,200,{ok:true,key,value:await storage.stateGet(key)});
      if(req.method==='PUT'||req.method==='POST') {
        const body=JSON.parse((await collectBody(req,40*1024*1024)).toString('utf8'));
        await storage.statePut(key,body.value);
        return json(res,200,{ok:true,key});
      }
      return error(res,405,'Method not allowed');
    }
    if(pathname.startsWith('/api/uploads/')) {
      const id=decodeURIComponent(pathname.slice('/api/uploads/'.length));
      if(req.method==='GET') {
        const item=await storage.uploadGet(id);
        if(!item) return error(res,404,'File not found');
        res.writeHead(200,{'Content-Type':item.meta.contentType,'Content-Length':item.buffer.length,'X-Content-Type-Options':'nosniff','Content-Disposition':`inline; filename="${id}.bin"; filename*=UTF-8''${encodeURIComponent(item.meta.name)}`});
        return res.end(item.buffer);
      }
      if(req.method==='PUT') {
        const file=await collectBody(req);
        const name=decodeURIComponent(String(req.headers['x-file-name']||id)).replace(/[\/\\]/g,'_');
        const meta=await storage.uploadPut(id,file,String(req.headers['content-type']||'application/octet-stream').split(';')[0],name);
        return json(res,201,{ok:true,meta});
      }
      if(req.method==='DELETE'){await storage.uploadDelete(id);return json(res,200,{ok:true});}
      return error(res,405,'Method not allowed');
    }
    if(pathname==='/api/state-export'&&req.method==='GET') {
      const data={};for(const key of storage.STATE_KEYS)data[key]=await storage.stateGet(key);
      return send(res,200,JSON.stringify({format:'atelier-maths-state-v1',exportedAt:new Date().toISOString(),data},null,2),'application/json; charset=utf-8',{'Content-Disposition':'attachment; filename="atelier-maths-server-state.json"'});
    }
    if(pathname.startsWith('/api/')) return error(res,404,'API route not found');
    return await serveFile(req,res,pathname);
  } catch(e) {
    console.error('[Atelier Maths]',e.message);
    if(!res.headersSent) return error(res,e.status || (e instanceof SyntaxError ? 400:500),e.message||'Unexpected error');
    res.end();
  }
}
async function start() {
  await storage.prepare();
  const server=http.createServer(handler);
  server.listen(PORT,HOST,async ()=>{
    console.log(`Atelier Maths is running at http://${HOST}:${PORT}`);
    console.log(`Files and saved work: ${storage.DATA_DIR}`);
    try {await fsp.writeFile(path.join(storage.DATA_DIR,'server.pid'),String(process.pid));} catch {}
  });
  server.on('error',e=>{ console.error(e.message);process.exitCode=1; });
  async function shutdown() {server.close(); await fsp.rm(path.join(storage.DATA_DIR,'server.pid'),{force:true}).catch(()=>{});}
  process.on('SIGINT', shutdown);process.on('SIGTERM',shutdown);
  return server;
}
if(require.main===module)start().catch(e=>{console.error(e);process.exitCode=1});
module.exports={start,handler};
