'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const fsp=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const net=require('node:net');
const ROOT=path.resolve(__dirname,'..');
async function availablePort(){return new Promise((resolve,reject)=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p))});s.on('error',reject)})}
async function request(url,options){return fetch(url,options)}

test('backend API and static textbooks work without external packages',async t=>{
 const port=await availablePort(),temp=await fsp.mkdtemp(path.join(os.tmpdir(),'atelier-maths-smoke-'));
 const child=spawn(process.execPath,[path.join(ROOT,'backend/server.js'),'--no-browser'],{cwd:ROOT,env:{...process.env,ATELIER_PORT:String(port),ATELIER_DATA_DIR:temp},stdio:'ignore'});
 t.after(async()=>{child.kill();await fsp.rm(temp,{recursive:true,force:true})});
 const base=`http://127.0.0.1:${port}`;
 let health;for(let i=0;i<50;i++){
  try{health=await request(base+'/api/health');if(health.ok)break}catch{}
  await new Promise(r=>setTimeout(r,100));
 }
 assert.equal(health?.status,200);
 assert.equal((await health.json()).platform,'Node.js');
 const page=await request(base+'/');const html=await page.text();
 assert.match(html,/ATELIER MATHS/);assert.doesNotMatch(html,/ATELIER_STATE_INJECTION/);
 const js=await request(base+'/assets/js/14-app.js');assert.equal(js.status,200);
 const pdf=await request(base+'/books/g7-fr.pdf',{headers:{Range:'bytes=0-7'}});
 assert.equal(pdf.status,206);assert.equal((await pdf.text()).startsWith('%PDF-'),true);
 const key='atelier-smoke-example',payload='{"unit":"fractions","count":3}';
 assert.equal((await request(base+'/api/state/'+key,{method:'PUT',body:payload})).status,200);
 const saved=await request(base+'/api/state/'+key);assert.equal((await saved.json()).value,payload);
 const bytes=Buffer.from('%PDF-1.7\nSMOKE TEST\n%%EOF\n');
 assert.equal((await request(base+'/api/uploads/qa-file',{method:'PUT',body:bytes,headers:{'Content-Type':'application/pdf','X-Atelier-File-Name':'qa.pdf'}})).status,200);
 const uploaded=await request(base+'/api/uploads/qa-file');assert.equal(uploaded.headers.get('content-type'),'application/pdf');assert.deepEqual(Buffer.from(await uploaded.arrayBuffer()),bytes);
 assert.equal((await request(base+'/api/uploads/qa-file',{method:'DELETE'})).status,200);
 assert.equal((await request(base+'/api/backup')).status,200);
 const state=JSON.parse(await fsp.readFile(path.join(temp,'workspace.json'),'utf8'));
 assert.equal(state.state[key],payload);
});
