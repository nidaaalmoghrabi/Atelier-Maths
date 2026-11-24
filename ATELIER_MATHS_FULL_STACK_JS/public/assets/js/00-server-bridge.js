/* Backend synchronization for existing Atelier Maths localStorage-based modules.
 * Server state is loaded inline BEFORE the existing scripts, preserving their behavior.
 * No external package, Python service or API key required.
 */
(function(){'use strict';
 const boot=window.__ATELIER_BOOTSTRAP__||{state:{},uploads:[]};
 const nativeSet=Storage.prototype.setItem;
 const nativeRemove=Storage.prototype.removeItem;
 const nativeGet=Storage.prototype.getItem;
 const relevant=(key)=>typeof key==='string'&&/^atelier-[a-zA-Z0-9_-]{1,90}$/.test(key);
 // Disk state overrides browser cache so the same saved work appears after browser changes.
 for(const [key,value] of Object.entries(boot.state||{})){
  if(relevant(key)&&typeof value==='string'){
   try{nativeSet.call(window.localStorage,key,value)}catch(error){console.warn('Cannot restore saved data:',key,error.message)}
  }
 }
 for(const id of boot.uploads||[]){
  const match=/^textbook-(fr|en)-([a-z0-9]+)$/.exec(id);
  if(match)try{nativeSet.call(window.localStorage,'atelier-textbook-'+match[1]+'-'+match[2],'1')}catch{}
 }
 // New installs also keep pre-existing work from a previous standalone HTML version.
 const jobs=new Map(),timers=new Map(),busy=new Set();
 function sync(key,value){
  if(!relevant(key))return;
  jobs.set(key,value);
  clearTimeout(timers.get(key));
  timers.set(key,setTimeout(()=>send(key),400));
 }
 async function send(key){
  if(busy.has(key))return;
  busy.add(key);
  try{
   while(jobs.has(key)){
    const val=jobs.get(key);jobs.delete(key);
    const response=await fetch('/api/state/'+encodeURIComponent(key),val===null?{method:'DELETE'}:{method:'PUT',body:val,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    if(!response.ok)throw Error('HTTP '+response.status);
   }
  }catch(error){
   console.warn('Local backend sync is temporarily unavailable:',error.message);
   const old=nativeGet.call(window.localStorage,key);
   jobs.set(key,old);
   // Preserves the data in browser cache until the next change or reload.
  }finally{busy.delete(key)}
 }
 Storage.prototype.setItem=function(key,value){
  const result=nativeSet.call(this,key,value);
  if(this===window.localStorage)sync(String(key),String(value));
  return result;
 };
 Storage.prototype.removeItem=function(key){
  const result=nativeRemove.call(this,key);
  if(this===window.localStorage)sync(String(key),null);
  return result;
 };
 window.addEventListener('pagehide',()=>{
  // Send-beacon helps save the final change even if the page closes quickly.
  for(const [key,value] of jobs){
   if(value!==null)try{navigator.sendBeacon('/api/state/'+encodeURIComponent(key),new Blob([value],{type:'text/plain'}))}catch{}
  }
 });
 // Browser state not yet known to the server: migrate it on the first startup.
 for(let i=0;i<window.localStorage.length;i++){
  const key=window.localStorage.key(i);
  if(relevant(key)&&!Object.prototype.hasOwnProperty.call(boot.state||{},key)){
   const value=nativeGet.call(window.localStorage,key);
   if(value!==null)sync(key,value);
  }
 }
 window.ATELIER_BACKEND={mode:'local-node',health:()=>fetch('/api/health').then(r=>r.json()),backup:()=>window.open('/api/backup','_blank')};
})();
