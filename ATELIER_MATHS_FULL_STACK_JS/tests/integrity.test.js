'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const www=path.join(root,'public');

test('all frontend entrypoint resources exist and are readable JavaScript/CSS files',()=>{
 const index=fs.readFileSync(path.join(www,'index.html'),'utf8');
 assert.match(index,/ATELIER MATHS/);
 assert.match(index,/ATELIER_STATE_INJECTION/);
 for(const [,uri] of index.matchAll(/(?:src|href)="(\/assets\/(?:js|css)\/[^\"]+)"/g)){
  const local=path.resolve(www,'.'+uri);
  assert.ok(local.startsWith(www+path.sep));
  assert.ok(fs.statSync(local).size>0,`missing or empty ${uri}`);
 }
 const scripts=Array.from(index.matchAll(/<script src="(\/assets\/js\/[^\"]+)"/g));
 assert.equal(scripts.length,18,'original 17 scripts plus server synchronization bridge');
 assert.ok(scripts[0][1].includes('00-server-bridge.js'));
 assert.ok(index.includes('atelier-ppt-lesson-js'));
});

test('textbook PDFs have intact binary hashes, including EB7 French',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'backend/book-manifest.json'),'utf8'));
 assert.equal(Object.keys(manifest).length,10);
 assert.ok(manifest['g7-fr']);
 for(const [id,entry] of Object.entries(manifest)){
  const file=fs.readFileSync(path.join(www,entry.file));
  assert.equal(file.subarray(0,5).toString('utf8'),'%PDF-');
  assert.equal(file.length,entry.bytes,id+' byte count');
  assert.equal(crypto.createHash('sha256').update(file).digest('hex'),entry.sha256,id+' checksum');
 }
});
