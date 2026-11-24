
/* books.js — original PDFs in both languages. Preserve the five-card dashboard. */
(function(){'use strict';
 const books=[
  {id:'g4',grade:4,volume:1,name:'Al-Ahlia-Grade-4.pdf',offset:-1},
  {id:'g5',grade:5,volume:1,name:'Al-Ahlia-Grade-5.pdf',offset:0},
  {id:'g6v1',grade:6,volume:1,name:'Al-Ahlia-Grade-6-Volume-1.pdf',offset:-2},
  {id:'g6v2',grade:6,volume:2,name:'Al-Ahlia-Grade-6-Volume-2.pdf',offset:-2},
  {id:'g7',grade:7,volume:1,name:'Al-Ahlia-Grade-7.pdf',offset:0},
   {id:'g8',grade:8,volume:1,name:'Grade-8-Teacher-Uploaded.pdf',offset:0},
   {id:'g9',grade:9,volume:1,name:'Grade-9-Teacher-Uploaded.pdf',offset:0}
 ];
 const frenchNames={g4:'Al-Ahlia_EB4_Mathematiques_FR_Integral.pdf',g5:'Al-Ahlia_EB5_Mathematiques_FR_Complet.pdf',g6v1:'Al-Ahlia_EB6_Mathematiques_FR_Tome_1.pdf',g6v2:'Al-Ahlia_EB6_Mathematiques_FR_Tome_2.pdf',g7:'Al-Ahlia_EB7_Mathematiques_FR.pdf',g8:'Manuel_Maths_EB8_FR.pdf',g9:'Manuel_Maths_EB9_FR.pdf'};
 const lang=()=>window.MATH_I18N?.getLanguage?.()==='en'?'en':'fr';
 function available(b,l=lang()){if(b.grade>=8){try{return localStorage.getItem('atelier-textbook-'+l+'-'+b.id)==='1'}catch{return false}}return true;try{return localStorage.getItem('atelier-textbook-fr-'+b.id)==='1'}catch{return false}}
 function label(b,l=lang()){if(b.grade>=8)return l==='fr'?`Manuel importé · ${b.grade}e année`:`Uploaded textbook · Grade ${b.grade}`;return l==='fr'?`Al-Ahlia · ${b.grade}e année${b.grade===6?' · Tome '+b.volume:''}`:`Al-Ahlia · Grade ${b.grade}${b.grade===6?' · Volume '+b.volume:''}`}
 for(const b of books)Object.defineProperty(b,'title',{get(){return label(b)}});
 const active=new Map();let dbPromise;
 function database(){if(!window.indexedDB)return Promise.reject(Error('IndexedDB not supported'));if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('AtelierMathsTeacherPDFs',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('pdfs'))r.result.createObjectStore('pdfs')};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return dbPromise}
 async function saveUpload(id,file){
  const response=await fetch('/api/uploads/'+encodeURIComponent(id),{method:'PUT',headers:{'Content-Type':file.type||'application/octet-stream','X-Atelier-File-Name':encodeURIComponent(file.name||'document')},body:file});
  if(!response.ok)throw Error('Upload failed: '+response.status);
  return true;
 }
 async function getUpload(id){
  try{
   const response=await fetch('/api/uploads/'+encodeURIComponent(id),{cache:'no-store'});
   if(response.ok){const blob=await response.blob();const title=response.headers.get('X-Atelier-File-Name');let fileName='document';try{fileName=decodeURIComponent(title||fileName)}catch{}return new File([blob],fileName,{type:blob.type||'application/octet-stream'});}
   if(response.status!==404)throw Error('Upload unavailable: '+response.status);
  }catch(err){console.warn('Using browser fallback for file:',id,err.message)}
  try{const db=await database();return await new Promise((resolve,reject)=>{const r=db.transaction('pdfs','readonly').objectStore('pdfs').get(id);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)});}catch{return null;}
 }
 async function deleteUpload(id){
  await fetch('/api/uploads/'+encodeURIComponent(id),{method:'DELETE'});
  try{const db=await database();await new Promise((resolve,reject)=>{const r=db.transaction('pdfs','readwrite').objectStore('pdfs').delete(id);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)});}catch{}
  if(/^textbook-(fr|en)-/.test(id))try{localStorage.removeItem('atelier-'+id)}catch{}
 }
 function get(id,l=lang()){const b=books.find(x=>x.id===id);return b?{...b,title:label(b,l),language:l,available:available(b,l),name:l==='fr'?frenchNames[id]:b.name}:null}
 function forUnit(u,l=lang()){if(!u)return null;const b=books.find(b=>b.grade===Number(u.grade)&&b.volume===(Number(u.volume)||1))||books.find(b=>b.grade===Number(u.grade));return b?get(b.id,l):null}
 function pdfPage(b,printedPage){const n=parseInt(String(printedPage||'').match(/\d+/)?.[0]||'1',10);return Math.max(1,n+(b?.offset||0))}
 function b64ToBlob(str){const parts=[],step=65536;for(let i=0;i<str.length;i+=step){const bin=atob(str.slice(i,i+step)),arr=new Uint8Array(bin.length);for(let j=0;j<bin.length;j++)arr[j]=bin.charCodeAt(j);parts.push(arr)}return new Blob(parts,{type:'application/pdf'})}
 async function url(id,l=lang()){
  const b=get(id,l);if(!b){const f=await getUpload(id);if(!f)throw Error(l==='fr'?'Ce PDF n’est plus disponible.':'This PDF is no longer available.');const key='uploaded:'+id;if(active.has(key))return active.get(key);const u=URL.createObjectURL(f);active.set(key,u);return u}
  const key=id+':'+l;if(active.has(key))return active.get(key);
  const stored=await getUpload('textbook-'+l+'-'+id).catch(()=>null);if(stored){const u=URL.createObjectURL(stored);active.set(key,u);return u}
  if(b.grade<8){const u='/books/'+encodeURIComponent(id+(l==='fr'?'-fr':''))+'.pdf';active.set(key,u);return u}
  throw Error(l==='fr'?'Le manuel français de 7e année manque. Ajoutez l’édition française dans la Bibliothèque.':'The selected textbook is unavailable. Upload the original PDF.');
 }
 async function saveLanguageBook(id,l,file){if(!books.some(b=>b.id===id)||!['fr','en'].includes(l))throw Error('Unsupported textbook');if(file.type!=='application/pdf'&&!/\.pdf$/i.test(file.name))throw Error(l==='fr'?'Veuillez choisir un PDF.':'Please select a PDF.');await saveUpload('textbook-'+l+'-'+id,file);const key=id+':'+l;if(active.has(key)){URL.revokeObjectURL(active.get(key));active.delete(key)}try{localStorage.setItem('atelier-textbook-'+l+'-'+id,'1')}catch{}}
 window.MATH_BOOKS={books,get,forUnit,pdfPage,url,saveUpload,getUpload,deleteUpload,saveLanguageBook,available:(id,l=lang())=>{const b=books.find(x=>x.id===id);return !!b&&available(b,l)},language:lang};
})();

