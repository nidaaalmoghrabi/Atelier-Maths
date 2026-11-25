'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const fsp = fs.promises;
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const port = 20000 + Math.floor(Math.random() * 20000);
const base = `http://127.0.0.1:${port}`;
let processNode;
let dataDir;

test.before(async () => {
  dataDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'atelier-server-test-'));
  processNode = spawn(process.execPath, [path.join(root, 'server/index.js')], {
    cwd: root, env: { ...process.env, ATELIER_PORT: String(port), ATELIER_DATA_DIR: dataDir },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  processNode.stderr.on('data', t=>console.error('Server stderr:',t.toString()));
  for (let i=0;i<60;i++) {
    try { const response = await fetch(base + '/api/health'); if(response.ok) return; }
    catch { /* still starting */ }
    await new Promise(r=>setTimeout(r,75));
  }
  throw new Error('Test server failed to start');
});
test.after(async () => {
  if (processNode) processNode.kill();
  if (dataDir) await fsp.rm(dataDir, { recursive: true, force: true });
});

test('homepage and separated assets are served without a build step', async () => {
  let r=await fetch(base+'/');
  assert.equal(r.status,200);
  let html=await r.text();
  assert.match(html,/\/js\/core\/app\.js/);
  assert.match(html,/\/js\/studio\/presentation-studio\.js/);
  assert.match(html,/\/api\/bootstrap\.js/);
  assert.doesNotMatch(html,/JVBERi0x/); // PDF Base64 is no longer embedded in HTML.
  r=await fetch(base+'/styles/16-studio-cobalt.css');assert.equal(r.status,200); assert.match(await r.text(),/studio-cobalt|\.sidebar|\.ps-root/);
  r=await fetch(base+'/js/core/engine.js');assert.equal(r.status,200);assert.match(await r.text(),/MATH_ENGINE/);
});

test('all ten embedded textbooks are available as proper PDFs',async()=>{
  const files=await fsp.readdir(path.join(root,'public/assets/books'));
  assert.equal(files.filter(n=>n.endsWith('.pdf')).length,10);
  for(const id of ['g4','g5','g6v1','g6v2','g7','g7-fr']) {
    const response=await fetch(base+`/assets/books/${id}.pdf`,{method:'HEAD'});
    assert.equal(response.status,200, id);
    assert.equal(response.headers.get('content-type'),'application/pdf');
    assert.ok(Number(response.headers.get('content-length'))>100000);
  }
});

test('saved exam / PowerPoint state persists and is injected on reload',async()=>{
  const values={
    'atelier-maths-fr-2026-v1':JSON.stringify({units:{7:[]},exams:[{id:'exam-1',cycle:3}],questions:[]}),
    'atelier-maths-presentation-studio-v1':JSON.stringify({current:{grade:5},saved:[]}),
    'atelier-maths-language':'fr'
  };
  for(const [key,value] of Object.entries(values)) {
    const r=await fetch(base+'/api/state/'+encodeURIComponent(key),{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value})});
    assert.equal(r.status,200);
  }
  const js=await (await fetch(base+'/api/bootstrap.js')).text();
  for(const [key,value] of Object.entries(values)){ assert.ok(js.includes(JSON.stringify(key).slice(1,-1)),key);assert.ok(js.includes(JSON.stringify(value)),key); }
  const status=await (await fetch(base+'/api/status')).json();
  assert.equal(status.uploadCount,0);
  assert.equal(status.state['atelier-maths-fr-2026-v1'].saved,true);
});

test('teacher-uploaded files persist on the backend',async()=>{
  const data=Buffer.from('%PDF-1.4\n% local textbook test\n');
  const url=base+'/api/uploads/textbook-fr-g8';
  const saved=await fetch(url,{method:'PUT',headers:{'Content-Type':'application/pdf','X-File-Name':encodeURIComponent('Mathématiques EB8.pdf')},body:data});
  assert.equal(saved.status,201);
  const download=await fetch(url);
  assert.equal(download.status,200);
  assert.deepEqual(Buffer.from(await download.arrayBuffer()),data);
  const boot=await (await fetch(base+'/api/bootstrap.js')).text();
  assert.match(boot,/textbook-fr-g8/);
  assert.equal((await fetch(url,{method:'DELETE'})).status,200);
  assert.equal((await fetch(url)).status,404);
});

test('local-only protection blocks cross-origin data writes',async()=>{
  const blocked=await fetch(base+'/api/state/atelier-maths-language',{
    method:'PUT',headers:{'Content-Type':'application/json','Origin':'https://example.org'},body:'{"value":"en"}'
  });
  assert.equal(blocked.status,403);
  const traversal=await fetch(base+'/api/uploads/..%2Fprivate',{method:'GET'});
  assert.ok([400,404].includes(traversal.status));
});
