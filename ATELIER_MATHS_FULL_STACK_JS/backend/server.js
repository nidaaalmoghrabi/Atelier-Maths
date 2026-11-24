'use strict';
/**
 * ATELIER MATHS — localhost-only Node.js backend.
 * Requires Node.js >=18. No Python, virtual environment, npm or third-party package.
 * Serves the existing frontend and textbooks, persists schoolwork and uploaded PDFs.
 */
const http = require('node:http');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawn} = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, 'public');
const DATA = process.env.ATELIER_DATA_DIR ? path.resolve(process.env.ATELIER_DATA_DIR) : path.join(__dirname, 'data');
const UPLOADS = path.join(DATA, 'uploads');
const JSON_PATH = path.join(DATA, 'workspace.json');
const PUBLIC_HOST = '127.0.0.1';
const PORT = Number(process.env.ATELIER_PORT || 3210);
const MAX_JSON = 12 * 1024 * 1024;
const MAX_UPLOAD = 90 * 1024 * 1024;
const mimetypes = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.pdf':'application/pdf','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
fs.mkdirSync(UPLOADS,{recursive:true});
let workspace = {schema:1,updatedAt:null,state:{},uploads:{}};
try {
 const raw = JSON.parse(fs.readFileSync(JSON_PATH,'utf8'));
 if(raw && typeof raw === 'object') workspace = {schema:1,updatedAt:raw.updatedAt||null,state:raw.state||{},uploads:raw.uploads||{}};
} catch(error){if(error.code!=='ENOENT')console.error('Saved workspace read failed:', error.message)}
let writeQueue = Promise.resolve();
function persist(){
 const snapshot=JSON.stringify({...workspace,updatedAt:new Date().toISOString()});
 writeQueue=writeQueue.catch(()=>{}).then(async()=>{
  const tmp=JSON_PATH+'.tmp';await fsp.writeFile(tmp,snapshot,'utf8');await fsp.rename(tmp,JSON_PATH);
 });
 return writeQueue;
}
function json(res,status,payload){const b=Buffer.from(JSON.stringify(payload));res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Content-Length':b.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(b)}
function fail(res,status,message){json(res,status,{error:message})}
function isValidKey(k){return typeof k==='string'&&/^atelier-[a-zA-Z0-9_-]{1,90}$/.test(k)}
function isValidId(k){return typeof k==='string'&&/^[a-zA-Z0-9_-]{1,140}$/.test(k)}
function uploadPath(id){return path.join(UPLOADS,crypto.createHash('sha256').update(id).digest('hex')+'.bin')}
function readBody(req, limit){return new Promise((resolve,reject)=>{
 const chunks=[];let bytes=0;
 req.on('data',b=>{bytes+=b.length;if(bytes>limit){reject(Object.assign(new Error('Request is too large'),{status:413}));req.destroy();return}chunks.push(b)});
 req.on('end',()=>resolve(Buffer.concat(chunks)));req.on('error',reject);
})}
function validateSameOrigin(req){
 const origin=req.headers.origin;
 if(!origin)return true;
 try{return new URL(origin).hostname === PUBLIC_HOST && Number(new URL(origin).port || 80) === PORT}catch{return false}
}
function displayURL(){return `http://${PUBLIC_HOST}:${PORT}/`}
function openBrowser(){if(process.argv.includes('--no-browser'))return;
 let cmd, args;
 if(process.platform==='win32'){cmd='cmd.exe';args=['/c','start','',''+displayURL()]}
 else if(process.platform==='darwin'){cmd='open';args=[displayURL()]}
 else {cmd='xdg-open';args=[displayURL()]}
 try{const child=spawn(cmd,args,{windowsHide:true,detached:true,stdio:'ignore'});child.on('error',()=>{});child.unref()}catch{}
}
async function fileResponse(req,res,filename,options={}){
 let stats;try{stats=await fsp.stat(filename);if(!stats.isFile())throw Error('Not a file')}catch{return fail(res,404,'File not found')}
 const mime=options.mime||mimetypes[path.extname(filename).toLowerCase()]||'application/octet-stream';
 const headers={'Content-Type':mime,'Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff','Cache-Control':'private, max-age=300'};
 if(options.name)headers['X-Atelier-File-Name']=encodeURIComponent(options.name);
 if(req.headers.range){
  const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
  if(!m)return fail(res,416,'Invalid byte range');
  let start= m[1]?Number(m[1]):null, end=m[2]?Number(m[2]):null;
  if(start===null){if(!end||end<=0)return fail(res,416,'Invalid suffix');start=Math.max(0,stats.size-end);end=stats.size-1}
  else{end=end===null?stats.size-1:Math.min(end,stats.size-1)}
  if(start> end||start>=stats.size)return fail(res,416,'Range out of bounds');
  headers['Content-Range']=`bytes ${start}-${end}/${stats.size}`;
  headers['Content-Length']=end-start+1;
  res.writeHead(206,headers);
  if(req.method==='HEAD'){res.end();return}
  fs.createReadStream(filename,{start,end}).pipe(res);
  return;
 }
 headers['Content-Length']=stats.size;
 res.writeHead(200,headers);
 if(req.method==='HEAD'){res.end();return}
 fs.createReadStream(filename).pipe(res);
}
async function handle(req,res){
 const url=new URL(req.url,displayURL());
 const pathname=decodeURIComponent(url.pathname);
 if(!validateSameOrigin(req) && !['GET','HEAD'].includes(req.method)) return fail(res,403,'Local website only');
 if(pathname==='/api/health'&&req.method==='GET')return json(res,200,{ok:true,app:'atelier-maths',platform:'Node.js',port:PORT,storage:'local-disk'});
 if(pathname==='/api/state'&&req.method==='GET')return json(res,200,{state:workspace.state,updatedAt:workspace.updatedAt});
 if(pathname==='/api/backup'&&req.method==='GET'){
  const body=JSON.stringify(workspace,null,2);res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Content-Disposition':'attachment; filename="atelier-maths-backup.json"'});res.end(body);return;
 }
 if(pathname.startsWith('/api/state/')){
  const key=pathname.slice('/api/state/'.length);
  if(!isValidKey(key))return fail(res,400,'Invalid storage key');
  if(req.method==='GET')return json(res,200,{value:workspace.state[key]??null});
  if(['POST','PUT'].includes(req.method)){
   const value=(await readBody(req,MAX_JSON)).toString('utf8');
   // Store raw localStorage text (may be JSON, a language code or a textbook flag).
   workspace.state[key]=value;await persist();return json(res,200,{saved:true,key});
  }
  if(req.method==='DELETE'){delete workspace.state[key];await persist();return json(res,200,{removed:true})}
  return fail(res,405,'Method not allowed');
 }
 if(pathname==='/api/uploads'&&req.method==='GET')return json(res,200,{items:Object.entries(workspace.uploads).map(([id,m])=>({id,name:m.name,size:m.size,type:m.type}))});
 if(pathname.startsWith('/api/uploads/')){
  const id=pathname.slice('/api/uploads/'.length);
  if(!isValidId(id))return fail(res,400,'Invalid upload ID');
  const target=uploadPath(id);
  if(req.method==='GET'){
   const meta=workspace.uploads[id];if(!meta)return fail(res,404,'Upload not found');
   await fileResponse(req,res,target,{mime:meta.type,name:meta.name});
   // fileResponse sends headers already: filename lives in workspace API listing; browser can use the ID.
   return;
  }
  if(req.method==='PUT'){
   const payload=await readBody(req,MAX_UPLOAD);
   const type=String(req.headers['content-type']||'application/octet-stream').slice(0,100);
   const rawName=String(req.headers['x-atelier-file-name']||id);
   let name=id;try{name=decodeURIComponent(rawName).slice(0,180)}catch{}
   if(!name||/[/\\\x00-\x1F]/.test(name))name=id;
   await fsp.writeFile(target+'.tmp',payload);await fsp.rename(target+'.tmp',target);
   workspace.uploads[id]={name,size:payload.length,type,updatedAt:new Date().toISOString()};
   await persist();return json(res,200,{saved:true,id,bytes:payload.length});
  }
  if(req.method==='DELETE'){
   delete workspace.uploads[id];await fsp.rm(target,{force:true});await persist();return json(res,200,{removed:true});
  }
  return fail(res,405,'Method not allowed');
 }
 if(pathname.startsWith('/api/'))return fail(res,404,'Unknown API endpoint');
 if(req.method!=='GET'&&req.method!=='HEAD')return fail(res,405,'Method not allowed');
 if(pathname==='/'||pathname==='/index.html'){
  let page=await fsp.readFile(path.join(WEB,'index.html'),'utf8');
  const data={state:workspace.state,uploads:Object.keys(workspace.uploads),version:1};
  const embedded=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  page=page.replace('/*ATELIER_STATE_INJECTION*/',embedded);
  const result=Buffer.from(page,'utf8');
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Content-Length':result.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?null:result);return;
 }
 // Prevent traversal, symlink escapes, and access to backend files.
 const relative=pathname.replace(/^\/+/, '');
 const filename=path.resolve(WEB,relative);
 if(!filename.startsWith(WEB+path.sep))return fail(res,403,'Forbidden');
 return fileResponse(req,res,filename);
}
const server=http.createServer((req,res)=>{
 Promise.resolve().then(()=>handle(req,res)).catch(err=>{
  console.error('Request failed:',err.message);
  if(res.headersSent){res.destroy();return}
  fail(res,err.status||500,err.status===413?'File too large':'Server request failed');
 });
});
server.on('error',err=>{
 if(err.code==='EADDRINUSE'){
  console.error('The port is busy. If Atelier Maths is already open, use the existing window.');
  http.get(displayURL()+'api/health',r=>{if(r.statusCode===200)openBrowser();else console.error('Change ATELIER_PORT to another port.')}).on('error',()=>{});
 }else console.error(err.message);
 process.exitCode=1;
});
server.listen(PORT,PUBLIC_HOST,()=>{console.log('ATELIER MATHS full-stack website running locally:', displayURL());console.log('To stop it, close this window or press Ctrl+C.');openBrowser()});
