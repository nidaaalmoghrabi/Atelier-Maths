/* Mark allocation uses integer quarter points, with a teacher-editable criterion. */
window.MATH_MARKING=function(q,lang){
 const en=lang==='en',t=Math.round((Number(q.marks)||0)*4),fmt=n=>String(n/4).replace('.',en?'.':',');
 if(q.markingText)return q.markingText;
 if(q.type==='crdp_qcm'){const response=Math.floor(t*.4),justification=t-response;return en?`${q.items?.length||0} questions (${fmt(t)} marks total): correct letters ${fmt(response)} marks, mathematical justifications ${fmt(justification)} marks. Award partial marks for valid reasoning even if the final letter is wrong.`:`${q.items?.length||0} questions (${fmt(t)} points au total) : lettres correctes ${fmt(response)} pt ; justifications mathématiques ${fmt(justification)} pt. Accorder des points partiels pour un raisonnement valable même si la lettre finale est incorrecte.`;}
 if(q.items?.length&&['geometrie','construction'].includes(q.type))return en?
  `${q.items.length} parts (${fmt(t)} marks total). For each part, award partial credit for the correct method, construction steps or reasoning (approximately 50%) and accurate measurements, labels, units and result (approximately 50%).`:
  `${q.items.length} parties (${fmt(t)} points au total). Pour chaque partie, attribuer des points partiels pour la méthode, les étapes de construction ou le raisonnement (environ 50 %) et pour les mesures, codages, unités et résultat exacts (environ 50 %).`;
 if(q.items?.length)return `${q.items.length} ${en?'parts':'parties'} : ${fmt(t)} pt ${en?'in total':'au total'}.`;
 if(q.type==='qcm'||q.type==='vrai-faux'||t===1)return `${en?'Correct response':'Réponse correcte'} : ${fmt(t)} pt.`;
 const method=Math.floor(t/2),answer=t-method;
 if(['geometrie','construction'].includes(q.type))return q.type==='geometrie'?`${en?'Figure interpretation and reasoning':'Interprétation de la figure et raisonnement'} : ${fmt(method)} pt ; ${en?'Correct calculations, units and justification':'Calculs, unités et justification'} : ${fmt(answer)} pt.`:`${en?'Construction steps and appropriate tools':'Étapes de construction et outils adaptés'} : ${fmt(method)} pt ; ${en?'Measurements, labels and accurate final figure':'Mesures, codage et précision de la figure finale'} : ${fmt(answer)} pt.`;
 return `${en?'Correct method, justified by the working':'Démarche correcte et calculs justifiés'} : ${fmt(method)} pt ; ${en?'Correct final answer, including the unit where required':'Réponse finale correcte, avec l’unité si nécessaire'} : ${fmt(answer)} pt.`;
};

/* document-export.js */
/* Dependency-free, offline OOXML (.docx) exporter. School heading comes from
   the owner's uploaded Bon Pasteur - Examen Word template; retain logos.
   Every page: A4, 1.5 cm margins, original Georgia 14 pt school table; Times New Roman 12 pt body and 14 pt bold question headers. */
(function(){'use strict';
const ENCODE=new TextEncoder();const et=x=>String(x??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const dotted='................................................................................';
function blanks(x){return String(x??'').replace(/(?:_){2,}/g,'................').replace(/(?:-{5,})/g,'................').replace(/(?<!\.)\.{3}(?!\.)/g,'................').replace(/…+/g,'................').replace(/\[\s*\]/g,'................')}
function style(fontSize=24,bold=false){return `<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/>${bold?'<w:b/>':''}</w:rPr>`}
/* Microsoft Word: native editable Office Math (OMML, professional layout).
   Do not render fractions, radicals or powers as plain linear text or pictures.
   Preserve normal question prose, school heading and all page styles. */
const MATH_NS='http://schemas.openxmlformats.org/officeDocument/2006/math';
const SUPER_TO_ASCII={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁺':'+','⁻':'−','⁽':'(','⁾':')','ⁿ':'n','ⁱ':'i'};
const VULGAR_FRACTIONS={'½':['1','2'],'⅓':['1','3'],'⅔':['2','3'],'¼':['1','4'],'¾':['3','4'],'⅕':['1','5'],'⅖':['2','5'],'⅗':['3','5'],'⅘':['4','5'],'⅙':['1','6'],'⅚':['5','6'],'⅛':['1','8'],'⅜':['3','8'],'⅝':['5','8'],'⅞':['7','8']};
function mRun(s,size=24){return `<m:r><m:rPr><m:sty m:val="p"/></m:rPr><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/><w:sz w:val="${size}"/></w:rPr><m:t xml:space="preserve">${et(s)}</m:t></m:r>`}
function readGroup(s,start,open='{',close='}'){
 if(s[start]!==open)return null;
 let depth=0;
 for(let p=start;p<s.length;p++){
  if(s[p]===open)depth++;
  if(s[p]===close&&!--depth)return {value:s.slice(start+1,p),end:p+1};
 }
 return null;
}
function readMathAtom(s,pos){
 if(s[pos]==='('){const g=readGroup(s,pos,'(',')');return g&&{value:g.value,end:g.end,group:true};}
 const m=/^(?:[+−-]?(?:\d+(?:[.,]\d+)?|[A-Za-zα-ωΑ-Ω]{1,2}))/.exec(s.slice(pos));
 if(m&&s[pos]==='π'&&m[0].length>1)return {value:'π',end:pos+1,group:false};
 return m?{value:m[0],end:pos+m[0].length,group:false}:null;
}
function readSup(s,start){
 if(s[start]==='^'){
  if(s[start+1]==='{'){const g=readGroup(s,start+1);return g&&{value:g.value,end:g.end};}
  if(s[start+1]==='('){const g=readGroup(s,start+1,'(',')');return g&&{value:g.value,end:g.end};}
  const m=/^[+−-]?(?:\d+|[A-Za-zα-ωΑ-Ω]+)/.exec(s.slice(start+1));
  return m?{value:m[0],end:start+1+m[0].length}:null;
 }
 const m=/^[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁽⁾ⁿⁱ]+/.exec(s.slice(start));
 return m?{value:[...m[0]].map(c=>SUPER_TO_ASCII[c]||c).join(''),end:start+m[0].length}:null;
}
function mathParts(s,size=24,depth=0){
 if(depth>6)return mRun(s,size);
 let out='',last=0;
 for(let i=0;i<s.length;){
  const match=matchMath(s,i,size,depth);
  if(!match){i++;continue;}
  if(i>last)out+=mRun(s.slice(last,i),size);
  out+=match.xml;i=match.end;last=i;
 }
 if(last<s.length)out+=mRun(s.slice(last),size);
 return out||mRun('',size);
}
// All fractions are 14 pt in Word, regardless of surrounding body text size.
const WORD_FRACTION_PT=14, WORD_FRACTION_HALF_POINTS=WORD_FRACTION_PT*2;
function mathFraction(n,d,size,depth){const fs=WORD_FRACTION_HALF_POINTS;
 // A mathematical answer blank must remain visually empty: the whitespace
 // gives the horizontal bar a writable width without dots or underscores.
 const rawNum=String(n??'').trim();
 const emptyNum=rawNum===''||/^[._…?□]+$/.test(rawNum)||/^\\phantom\s*\{[^}]*\}$/.test(rawNum);
 const numerator=emptyNum?mRun('\u2003\u2003\u2003',fs):mathParts(n,fs,depth+1);
 return `<m:f><m:fPr><m:type m:val="bar"/><m:ctrlPr><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/><w:sz w:val="${fs}"/><w:szCs w:val="${fs}"/></w:rPr></m:ctrlPr></m:fPr><m:num>${numerator}</m:num><m:den>${mathParts(d,fs,depth+1)}</m:den></m:f>`;
}
function mathRadicand(expr,index,size,depth){return `<m:rad><m:radPr><m:degHide m:val="${index?'0':'1'}"/></m:radPr><m:deg>${index?mathParts(index,size,depth+1):''}</m:deg><m:e>${mathParts(expr,size,depth+1)}</m:e></m:rad>`}
function mathPower(base,exponent,size,depth,group=false){const baseXml=group?`<m:d><m:dPr><m:begChr m:val="("/><m:endChr m:val=")"/></m:dPr><m:e>${mathParts(base,size,depth+1)}</m:e></m:d>`:mathParts(base,size,depth+1);return `<m:sSup><m:e>${baseXml}</m:e><m:sup>${mathParts(exponent,size,depth+1)}</m:sup></m:sSup>`}
function matchMath(s,i,size=24,depth=0){
 if(depth>6)return null;
 const c=s[i],prev=s[i-1]||'',after=(j)=>s[j]||'';
 // LaTeX-style mathematics generated by the lesson / exam builders.
 if(c==='\\'){
  const f=/^\\(?:dfrac|tfrac|frac)/.exec(s.slice(i));
  if(f){let p=i+f[0].length;while(s[p]===' ')p++;
   const n=readGroup(s,p);if(n){p=n.end;while(s[p]===' ')p++;const d=readGroup(s,p);
    if(d){let end=d.end,xml=mathFraction(n.value,d.value,size,depth);const pow=readSup(s,end);
     if(pow){xml=mathPower(s.slice(i,end),pow.value,size,depth);end=pow.end;}
     return {end,xml};}
   }
  }
  const r=/^\\sqrt(?:\[([^\]]+)\])?/.exec(s.slice(i));
  if(r){let p=i+r[0].length;while(s[p]===' ')p++;const e=readGroup(s,p);
   if(e)return {end:e.end,xml:mathRadicand(e.value,r[1]||'',size,depth)};
  }
 }
 // Square root, cube root and ordinary text sqrt(…) notation.
 if(c==='√'||c==='∛'||s.slice(i,i+4).toLowerCase()==='sqrt'){
  if(c==='s'&&/[\w]/.test(prev))return null;
  const p0=i+(c==='√'||c==='∛'?1:4);let p=p0;
  while(s[p]===' ')p++;
  const expr=readGroup(s,p,'(',')')||readGroup(s,p,'{','}')||readMathAtom(s,p);
  if(expr)return {end:expr.end,xml:mathRadicand(expr.value,c==='∛'?'3':'',size,depth)};
 }
 // A sequence of dots/underscores before /denominator is a math ANSWER
 // PLACEHOLDER, not punctuation and not a grading field. The preprocessing
 // normalizes conventional blanks to dots before the scanner runs.
 if(c==='.'&&(i===0||s[i-1]!=='.')){
  const blank=/^\.{3,}[ \t]*\/[ \t]*/.exec(s.slice(i));
  if(blank){const start=i+blank[0].length,den=readMathAtom(s,start);
   if(den&&!(s[den.end]&&/[\w/]/.test(s[den.end]))){
    return {end:den.end,xml:mathFraction('',den.value,size,depth)};
   }
  }
 }
 // Unicode single-character fraction symbols, e.g. ½ or ⅜.
 if(VULGAR_FRACTIONS[c])return {end:i+1,xml:mathFraction(...VULGAR_FRACTIONS[c],size,depth)};
 // Numeric/algebraic fractions (including grouped numerator and denominator).
 const n=readMathAtom(s,i);
 if(!n)return null;
 let p=n.end;while(s[p]===' ')p++;
 if(s[p]==='/'){
  p++;while(s[p]===' ')p++;
  const d=readMathAtom(s,p);
  if(d&&prev!=='/'&&after(d.end)!=='/'&&after(d.end)!==':'&&after(d.end)!=='\\'&&
     !(i>0&&/[\w/@.]/.test(prev))&&!(after(d.end)&&/[A-Za-z]/.test(after(d.end)))){
   const dSup=readSup(s,d.end);
   return {end:dSup?dSup.end:d.end,xml:mathFraction(n.value,dSup?d.value+(s.slice(d.end,dSup.end)):d.value,size,depth)};
  }
 }
 // Superscripts are Office Math structures, not baseline characters.
 const sup=readSup(s,n.end);
 if(sup&&!(i>0&&/[A-Za-zα-ωΑ-Ω_]/.test(prev)&&prev!=='π'))return {end:sup.end,xml:mathPower(n.value,sup.value,size,depth,!!n.group)};
 return null;
}
function run(s,size=24,bold=false,allowMath=true){
 const value=allowMath?blanks(s):String(s??'');
 // Assessment point allocations and marking schemes are literal text; unlike
 // the exercise content, they must never be parsed as mathematical fractions.
 if(!allowMath)return `<w:r>${style(size,bold)}<w:t xml:space="preserve">${et(value)}</w:t></w:r>`;
 let result='',last=0;
 for(let i=0;i<value.length;){
  const math=matchMath(value,i,size);
  if(!math){i++;continue;}
  if(i>last)result+=`<w:r>${style(size,bold)}<w:t xml:space="preserve">${et(value.slice(last,i))}</w:t></w:r>`;
  result+=`<m:oMath xmlns:m="${MATH_NS}">${math.xml}</m:oMath>`;
  i=math.end;last=i;
 }
 if(last<value.length||!result)result+=`<w:r>${style(size,bold)}<w:t xml:space="preserve">${et(value.slice(last))}</w:t></w:r>`;
 return result;
}
function para(s='',opts={}){const props=[opts.center?'<w:jc w:val="center"/>':'',opts.indent?`<w:ind w:left="${opts.indent}"/>`:'',opts.after===undefined?'<w:spacing w:after="100"/>':`<w:spacing w:after="${opts.after}"/>`,opts.keep?'<w:keepNext/>':''].join('');return `<w:p><w:pPr>${props}</w:pPr>${run(s,opts.size||24,!!opts.bold,opts.math!==false)}</w:p>`}
function multipart(parts,opts={}){const num=opts.numId?`<w:numPr><w:ilvl w:val="0"/><w:numId w:val="${opts.numId}"/></w:numPr>`:'';return `<w:p><w:pPr><w:spacing w:before="${opts.before??0}" w:after="${opts.after??100}"/>${num}${opts.keep?'<w:keepNext/>':''}</w:pPr>${parts.join('')}</w:p>`}
function dottedLine(opts={}){const pos=10206,indent=opts.indent??720;return `<w:p><w:pPr><w:ind w:left="${indent}"/><w:spacing w:after="${opts.after??100}"/><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="${pos}"/></w:tabs>${opts.keep?'<w:keepNext/>':''}</w:pPr><w:r>${style(24)}<w:tab/></w:r></w:p>`;}
function tfDocInstruction(lang){return lang==='en'?'Write True or False, then correct the false statements.':'Écris Vrai ou Faux, puis corrige les affirmations fausses.';}
function trueFalseChoices(lang){const t=lang==='en'?['True','False']:['Vrai','Faux'];const box='<w:r><w:rPr><w:rFonts w:ascii="DejaVu Sans" w:hAnsi="DejaVu Sans"/><w:sz w:val="24"/></w:rPr><w:t>☐</w:t></w:r>';return `<w:p><w:pPr><w:ind w:left="800"/><w:spacing w:after="65"/></w:pPr>${box}${run(' '+t[0]+'    ',24)}${box}${run(' '+t[1],24)}</w:p>`;}
function cell(t){return `<w:tc><w:tcPr><w:tcW w:w="5050" w:type="dxa"/></w:tcPr>${para(t,{after:30})}</w:tc>`}
function infoTable(lines){return `<w:tbl><w:tblPr><w:tblW w:w="10100" w:type="dxa"/><w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="5050"/><w:gridCol w:w="5050"/></w:tblGrid>${lines.map(row=>`<w:tr>${cell(row[0])}${cell(row[1])}</w:tr>`).join('')}</w:tbl>`}
function imagePar(){const cx=6260000,cy=Math.round(cx*115/720);return `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="95"/></w:pPr><w:r><w:drawing><wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="1" name="School heading and logos" descr="Collège des Sœurs du Bon Pasteur – Hammana; school logos"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="school-header.jpeg"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`}
function templateXml(extraXml, ex, lang, onlyKey=false){
 const t=window.MATH_ORIGINAL_WORD_TEMPLATE;
 if(!t?.xml)throw Error('Original school Word template not loaded');
 const w='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
 const doc=new DOMParser().parseFromString(t.xml,'application/xml');
 if(doc.querySelector('parsererror'))throw Error('Malformed school template');
 // Preserve every original Arabic heading character; reduce the original textbox's font and spacing to avoid clipping in alternate renderers.
 for(const box of [...doc.getElementsByTagNameNS(w,'txbxContent')]){
  if(!box.textContent.includes('راهبات'))continue;
  for(const tag of ['sz','szCs'])for(const n of box.getElementsByTagNameNS(w,tag))n.setAttributeNS(w,'w:val','18');
  for(const rp of box.getElementsByTagNameNS(w,'rPr'))for(const n of rp.getElementsByTagNameNS(w,'spacing'))n.setAttributeNS(w,'w:val','0');
  for(const p of box.getElementsByTagNameNS(w,'p')){const pp=p.getElementsByTagNameNS(w,'pPr')[0];if(!pp)continue;let sp=[...pp.children].find(n=>n.localName==='spacing');if(!sp){sp=doc.createElementNS(w,'w:spacing');pp.insertBefore(sp,pp.firstChild)}for(const [k,v] of Object.entries({before:'0',after:'0',line:'200',lineRule:'exact'}))sp.setAttributeNS(w,'w:'+k,v);}
  const shape=box.parentElement?.parentElement;if(shape)for(const n of shape.getElementsByTagNameNS('http://schemas.microsoft.com/office/word/2010/wordprocessingShape','bodyPr'))for(const k of ['tIns','bIns','lIns','rIns'])n.setAttribute(k,'0');
 }
 const body=doc.getElementsByTagNameNS(w,'body')[0];
 const tbl=body.getElementsByTagNameNS(w,'tbl')[0];
 if(!tbl)throw Error('The official school header table is missing');
 const rows=[...tbl.getElementsByTagNameNS(w,'tr')];
 const cell=(r,c)=>rows[r]?.getElementsByTagNameNS(w,'tc')[c];
 const texts=(r,c)=>[...(cell(r,c)?.getElementsByTagNameNS(w,'t')||[])];
 const replaceCell=(r,c,newText)=>{const nodes=texts(r,c);if(!nodes.length)return;nodes[0].textContent=newText;nodes[0].setAttribute('xml:space','preserve');nodes.slice(1).forEach(node=>node.textContent='')};
 const replaceDashes=(r,c)=>texts(r,c).forEach(node=>{if(node.textContent.includes('-'))node.textContent=node.textContent.replace(/-/g,'.')});
 // Keep original page's title, exactly as the teacher supplied it.
 replaceDashes(1,0);replaceDashes(2,0);
 // Keep the original table, cells and typefaces; change only variable values.
 const english=lang==='en';
 const label=(fr,en)=>english?en:fr;
 const isWorksheet=ex.kind==='worksheet',isProject=ex.kind==='project';
 const docTitle=isProject?label('Projets et Activités','Projects and Activities'):(isWorksheet&&['Fiche de Révision','Revision Worksheet'].includes(ex.title)?label('Fiche de Révision','Revision Worksheet'):(ex.title|| (isWorksheet?label('Fiche de Révision','Revision Worksheet'):label('Examen de Mathématiques','Mathematics Examination'))));
 replaceCell(0,0,docTitle);
 replaceCell(1,0,label('Nom','Name')+' : .....................................');
 replaceCell(2,0,label('Date','Date')+' : .....................................');
 replaceCell(2,2,label('Classe','Grade')+' : '+(english?String(ex.grade):'EB '+ex.grade));
 replaceCell(3,2,isWorksheet||isProject?'':(label('Durée','Time')+' : '+(ex.duration?String(ex.duration)+' min':'          ')));
 /* Date field remains blank in the owner's original institutional table. */
 replaceCell(1,1,label('Année scolaire','Scholastic year')+' : '+(ex.year||'2026–2027'));
 // Preserve the required original 14 pt Georgia in every table cell, including the duration.
 {const n=texts(3,2)[0],run=n?.parentElement;if(run){let rp=run.getElementsByTagNameNS(w,'rPr')[0];if(!rp){rp=doc.createElementNS(w,'w:rPr');run.insertBefore(rp,run.firstChild)}let sz=rp.getElementsByTagNameNS(w,'sz')[0];if(!sz){sz=doc.createElementNS(w,'w:sz');rp.appendChild(sz)}sz.setAttributeNS(w,'w:val','28');}}
 // The grading field stays a literal /20 (or the configured /total).
 // Do not apply exercise mathematical-fraction formatting to assessment marks.
 replaceCell(4,2,isWorksheet||isProject?'':label('Note','Mark')+' : /'+String(ex.total??20).replace('.',english?'.':','));
 for(const r of rows)for(const rNode of r.getElementsByTagNameNS(w,'r')){let rp=[...rNode.children].find(x=>x.localName==='rPr');if(!rp){rp=doc.createElementNS(w,'w:rPr');rNode.insertBefore(rp,rNode.firstChild)}let fonts=[...rp.children].find(x=>x.localName==='rFonts');if(!fonts){fonts=doc.createElementNS(w,'w:rFonts');rp.insertBefore(fonts,rp.firstChild)}for(const k of ['ascii','hAnsi','eastAsia','cs'])fonts.setAttributeNS(w,'w:'+k,'Georgia');for(const szName of ['sz','szCs']){let sz=[...rp.children].find(x=>x.localName===szName);if(!sz){sz=doc.createElementNS(w,'w:'+szName);rp.appendChild(sz)}sz.setAttributeNS(w,'w:val','28');}}
 // Table paragraphs have explicit Georgia too; body paragraphs and numbering retain Times New Roman.
 for(const p of tbl.getElementsByTagNameNS(w,'p')){let pp=[...p.children].find(x=>x.localName==='pPr');if(!pp){pp=doc.createElementNS(w,'w:pPr');p.insertBefore(pp,p.firstChild)}let rp=[...pp.children].find(x=>x.localName==='rPr');if(!rp){rp=doc.createElementNS(w,'w:rPr');pp.appendChild(rp)}let fonts=[...rp.children].find(x=>x.localName==='rFonts');if(!fonts){fonts=doc.createElementNS(w,'w:rFonts');rp.appendChild(fonts)}for(const k of ['ascii','hAnsi','eastAsia','cs'])fonts.setAttributeNS(w,'w:'+k,'Georgia');for(const k of ['sz','szCs']){let sz=[...rp.children].find(x=>x.localName===k);if(!sz){sz=doc.createElementNS(w,'w:'+k);rp.appendChild(sz)}sz.setAttributeNS(w,'w:val','28');}}
 // IMPORTANT: Theme-font attributes override direct fonts in Word. Keep the original school table,
 // but make Georgia the sole possible font for ALL title and information-table text.
 for(const fonts of [...tbl.getElementsByTagNameNS(w,'rFonts')]){
  for(const a of [...fonts.attributes])if(/theme/i.test(a.localName))fonts.removeAttributeNS(a.namespaceURI||w,a.localName);
  for(const key of ['ascii','hAnsi','eastAsia','cs'])fonts.setAttributeNS(w,'w:'+key,'Georgia');
 }
 const sect=[...body.children].find(n=>n.localName==='sectPr');
 const margins=sect?.getElementsByTagNameNS(w,'pgMar')[0];
 // Preserve the agreed 1.5 cm margin from all sides (850 twentieths of a point).
 const pageSize=sect?.getElementsByTagNameNS(w,'pgSz')[0];if(pageSize){pageSize.setAttributeNS(w,'w:w','11906');pageSize.setAttributeNS(w,'w:h','16838');}
 if(margins)for(const side of ['top','bottom','left','right'])margins.setAttributeNS(w,'w:'+side,'850');
 // Remove only the unused blank paragraphs after the information table.
 const children=[...body.children];const tblIndex=children.indexOf(tbl);const sectIndex=children.indexOf(sect);
 for(let i=tblIndex+1;i<sectIndex;i++)if(children[i].localName==='p')body.removeChild(children[i]);
 const headerGap='<w:p><w:pPr><w:spacing w:before="0" w:after="0"/><w:contextualSpacing w:val="0"/></w:pPr><w:r><w:rPr><w:sz w:val="28"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r></w:p>';
 const snippet=new DOMParser().parseFromString('<root xmlns:w="'+w+'">'+headerGap+extraXml+'</root>','application/xml');
 if(snippet.getElementsByTagName('parsererror').length)throw Error('Invalid exam contents');
 // Cycle 2 examinations and all worksheets: 1.5 line and paragraph spacing.
 // This is applied to the actual OOXML paragraphs (not merely the browser preview).
 // Preserve the school's original header table, its blank separating line, and all
 // measured diagrams/construction boxes at their original physical dimensions.
 const spaciousBody=isWorksheet||(!isProject&&Number(ex.cycle)!==3);
 for(const node of [...snippet.documentElement.children]){
  const imported=doc.importNode(node,true);
  if(spaciousBody&&imported.localName==='p'&&!imported.getElementsByTagNameNS(w,'drawing').length){
   let pPr=[...imported.children].find(n=>n.localName==='pPr');
   if(!pPr){pPr=doc.createElementNS(w,'w:pPr');imported.insertBefore(pPr,imported.firstChild);}
   let spacing=[...pPr.children].find(n=>n.localName==='spacing');
   if(!spacing){spacing=doc.createElementNS(w,'w:spacing');pPr.appendChild(spacing);}
   spacing.setAttributeNS(w,'w:line','360'); // OOXML: 360/240 = 1.5 lines
   spacing.setAttributeNS(w,'w:lineRule','auto');
   // Increase existing paragraph-before/after spacing by the same factor.
   // A zero value remains zero, preserving intentional zero-spacing elements.
   for(const side of ['before','after']){
    const value=spacing.getAttributeNS(w,side);
    if(value!==null&&/^\d+$/.test(value))spacing.setAttributeNS(w,'w:'+side,String(Math.round(Number(value)*1.5)));
   }
  }
  body.insertBefore(imported,sect);
 }
 return new XMLSerializer().serializeToString(doc);
}
function figurePar(relId,idx,q){
 const measure=window.MATH_VISUALS?.measure(q)||{toScale:false};
 const cx=measure.toScale?Math.round(measure.widthCm*360000):3920000;
 const cy=measure.toScale?Math.round(measure.heightCm*360000):1987000;return `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="45" w:after="70"/><w:keepNext/></w:pPr><w:r><w:drawing><wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${40+idx}" name="Diagram ${idx}" descr="Original textbook-style educational mathematical figure"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${40+idx}" name="mathematical-diagram-${idx}.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
}
function crdpWordTable(q,lang){
 // The school Word template is A4 with 850-twip margins: usable width 10206 twips.
 // The numbered question starts at a 720-twip text indent. Extend the table
 // from that SAME left edge to the right content margin (up to 9486 twips available).
 const widths=[560,5480,1100,1100,1120],tableWidth=widths.reduce((sum,n)=>sum+n,0);
 const title=lang==='en'?['No','Question','a','b','c']:['No','Question','a','b','c'];
 const cell=(value,width,head=false,col=0)=>{
  const align=col===1?'left':'center';
  const p=`<w:p><w:pPr><w:bidi w:val="0"/><w:jc w:val="${align}"/><w:spacing w:after="85"/></w:pPr>${run(String(value??''),head?26:24,head)}</w:p>`;
  return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/><w:vAlign w:val="center"/>${head?'<w:shd w:fill="EDF0F8"/>':''}</w:tcPr>${p}</w:tc>`;
 };
 const row=values=>`<w:tr><w:trPr><w:cantSplit/></w:trPr>${values.map((v,k)=>cell(v,widths[k],false,k)).join('')}</w:tr>`;
 const header=`<w:tr><w:trPr><w:tblHeader/></w:trPr>${title.map((v,k)=>cell(v,widths[k],true,k)).join('')}</w:tr>`;
 return `<w:tbl><w:tblPr><w:tblW w:w="${tableWidth}" w:type="dxa"/><w:tblInd w:w="720" w:type="dxa"/><w:jc w:val="left"/><w:bidiVisual w:val="0"/><w:tblLayout w:type="fixed"/><w:tblBorders>${['top','left','bottom','right','insideH','insideV'].map(side=>`<w:${side} w:val="single" w:sz="5" w:color="53627C"/>`).join('')}</w:tblBorders></w:tblPr><w:tblGrid>${widths.map(w=>`<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>${header}${(q.items||[]).map((it,i)=>row([i+1,it.text,...(it.options||[]).slice(0,3)])).join('')}</w:tbl>`;
}
function examXml(ex,lang,withKey=false,onlyKey=false,diagramRefs={}){
 let result='';
 if(onlyKey)result+=para(lang==='en'?'Answer key':'Corrigé',{center:true,after:140,size:24});
 for(let i=0;i<(ex.questions||[]).length;i++){
  const q=ex.questions[i];
  const instruction=q.type==='vrai-faux'?tfDocInstruction(lang):window.MATH_CYCLE3_QUESTION_TEXT(q,ex);
  result+=multipart([run((onlyKey?(lang==='en'?'Answer to question: ':'Réponse à la question : '):'')+instruction,28,true),run(ex.kind==='worksheet'?'':` (${lang==='en'?q.marks:String(q.marks).replace('.',',')} pt${q.marks===1?'':'s'})`,24,false,false)],{numId:100,before:i===0?0:340,after:115,keep:true});
  if(!onlyKey){
   if(q.type==='crdp_qcm'){result+=crdpWordTable(q,lang);if(withKey){for(const [j,it] of q.items.entries()){result+=para(`${j+1}. ${window.MATH_CRDP_LETTER(it)} — ${it.answer}`,{bold:true});result+=para(`${lang==='en'?'Justification':'Justification'} : ${it.solution}`);}}continue;}
   if(diagramRefs[i])result+=figurePar(diagramRefs[i],i+1,q);
   if(q.items?.length){
    q.items.forEach((it,j)=>{
     result+=multipart([run(window.MATH_CYCLE3_PART_TEXT(q,it),28,true)],{numId:200+i,before:75,after:70,keep:true});
     if(diagramRefs[`${i}-${j}`])result+=figurePar(diagramRefs[`${i}-${j}`],100+i*12+j,{...q,...it});
     if(q.type==='qcm')for(const [k,o] of (it.options||[]).entries())result+=para(`${String.fromCharCode(65+k)}. ${o}`,{after:40,indent:960});
     else if(q.type==='vrai-faux'){
      if(!window.MATH_IS_CYCLE3_EXAM(ex)){result+=dottedLine({after:80,indent:1150});result+=dottedLine({after:100,indent:1150});}
     }else if(['geometrie','construction'].includes(q.type)){
      if(!window.MATH_IS_CYCLE3_EXAM(ex)){if((it.geometryMode||q.geometryMode)!=='reasoning')result+=drawBox({...q,...it});result+=dottedLine({after:100,indent:1150});}
     }else{
      const count=q.type==='probleme'?3:q.type==='trous'?2:1;
      if(!window.MATH_IS_CYCLE3_EXAM(ex))for(let n=0;n<count;n++)result+=dottedLine({after:80,indent:1150});
     }
    });
   } else if(q.type!=='vrai-faux'&&q.options?.length){q.options.forEach((o,j)=>result+=para(`${String.fromCharCode(65+j)}. ${o}`,{after:50,keep:j<q.options.length-1}));}
   else if(['geometrie','construction'].includes(q.type)){if(!window.MATH_IS_CYCLE3_EXAM(ex)){if(q.geometryMode!=='reasoning')result+=drawBox(q);result+=dottedLine({after:100});}}
   else if(q.type==='vrai-faux'){
      if(!window.MATH_IS_CYCLE3_EXAM(ex)){result+=dottedLine({after:80});result+=dottedLine({after:100});}
   }else if(!window.MATH_IS_CYCLE3_EXAM(ex))for(let n=0;n<(q.type==='probleme'?3:q.type==='trous'?2:1);n++)result+=dottedLine({after:85});
  }
  if(withKey){
   if(q.type==='crdp_qcm'){q.items.forEach((it,j)=>{result+=para(`${j+1}. ${window.MATH_CRDP_LETTER(it)} — ${it.answer}`,{bold:true,after:35});result+=para(`${lang==='en'?'Explanation':'Explication'} : ${it.solution}`,{after:55});});}
   else if(q.items?.length){q.items.forEach((it,j)=>{result+=para(`${String.fromCharCode(97+j)}. ${lang==='en'?'Answer':'Réponse'} : ${it.answer}`,{bold:true,after:35});result+=para(`${lang==='en'?'Explanation':'Explication'} : ${it.solution}`,{after:55});if(diagramRefs[`key-${i}-${j}`])result+=figurePar(diagramRefs[`key-${i}-${j}`],500+i*12+j,{...q,...it,teacherKeyFigure:true});});}
   else{result+=para((lang==='en'?'Answer: ':'Réponse : ')+q.answer,{bold:true});result+=para((lang==='en'?'Working: ':'Démarche : ')+(q.solution||''));if(diagramRefs[`key-${i}`])result+=figurePar(diagramRefs[`key-${i}`],500+i,{...q,teacherKeyFigure:true});}
   result+=para((lang==='en'?'Marking scheme: ':'Barème : ')+window.MATH_MARKING(q,lang),{after:160,math:false});
  }
 }
 return result;
}
function drawBox(q){
 const circle=window.MATH_NEEDS_CIRCLE_CENTRE(q);
 // Center the single given point using table-cell vertical alignment and centred paragraph.
 // O is a label on the provided point, not a completed circle or a suggested radius.
 const mark=circle?`<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="0"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="23"/></w:rPr><w:t>•</w:t></w:r><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="22"/><w:vertAlign w:val="subscript"/></w:rPr><w:t xml:space="preserve"> O</w:t></w:r></w:p>`:'<w:p/>';
 return `<w:tbl><w:tblPr><w:tblW w:w="9700" w:type="dxa"/><w:tblBorders><w:top w:val="dotted" w:sz="4" w:color="A8AFB6"/><w:left w:val="dotted" w:sz="4" w:color="A8AFB6"/><w:bottom w:val="dotted" w:sz="4" w:color="A8AFB6"/><w:right w:val="dotted" w:sz="4" w:color="A8AFB6"/></w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="9700"/></w:tblGrid><w:tr><w:trPr><w:cantSplit/><w:trHeight w:val="${Math.round(window.MATH_WORKSPACE_CM(q)*567)}" w:hRule="atLeast"/></w:trPr><w:tc><w:tcPr><w:tcW w:w="9700" w:type="dxa"/>${circle?'<w:vAlign w:val="center"/>':''}</w:tcPr>${mark}</w:tc></w:tr></w:tbl>`;
}
function projectXml(p,lang){
 const en=lang==='en',items=String(p.steps||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
 let x=para(p.title,{center:true,bold:true,after:160});
 for(const [label,val] of [[en?'Learning objectives':'Objectifs pédagogiques',p.goal],[en?'Materials':'Matériel',p.materials]]){x+=para(label,{bold:true});x+=para(val)}
 if(p.duration)x+=para(`${en?'Suggested duration':'Durée indicative'} : ${p.duration} min`);
 x+=para(en?'Step-by-step instructions':'Consignes et déroulement',{bold:true});
 items.forEach((step,i)=>{x+=para(`${i+1}. ${step}`,{after:100})});
 if(p.product){x+=para(en?'Expected outcome':'Production attendue',{bold:true});x+=para(p.product)}
 x+=para(en?'Assessment rubric':'Grille d’évaluation',{bold:true});
 for(const a of (p.rubric||[]))x+=para(`• ${a.label} : ${a.marks} point(s).`,{math:false});
 return x;
}
function decode(b64){const str=atob(b64),a=new Uint8Array(str.length);for(let i=0;i<str.length;i++)a[i]=str.charCodeAt(i);return a}
let crcTable;function crc(bytes){if(!crcTable)crcTable=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);return c>>>0});let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0}
function zip(files){let chunks=[],central=[],offset=0;const b16=(v)=>{let b=new Uint8Array(2);new DataView(b.buffer).setUint16(0,v,true);return b};const b32=v=>{let b=new Uint8Array(4);new DataView(b.buffer).setUint32(0,v,true);return b};const cat=(...arr)=>{const n=arr.reduce((a,x)=>a+x.length,0),o=new Uint8Array(n);let i=0;for(const a of arr){o.set(a,i);i+=a.length}return o};for(const [name,v] of Object.entries(files)){const bytes=typeof v==='string'?ENCODE.encode(v):v,nameBytes=ENCODE.encode(name),check=crc(bytes);const local=cat(b32(0x04034b50),b16(20),b16(0),b16(0),b16(0),b16(0),b32(check),b32(bytes.length),b32(bytes.length),b16(nameBytes.length),b16(0),nameBytes,bytes);chunks.push(local);central.push(cat(b32(0x02014b50),b16(20),b16(20),b16(0),b16(0),b16(0),b16(0),b32(check),b32(bytes.length),b32(bytes.length),b16(nameBytes.length),b16(0),b16(0),b16(0),b16(0),b32(0),b32(offset),nameBytes));offset+=local.length}const centralData=cat(...central),end=cat(b32(0x06054b50),b16(0),b16(0),b16(central.length),b16(central.length),b32(centralData.length),b32(offset),b16(0));return new Blob([...chunks,centralData,end],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})}

function setupNumbering(parts,ex){
 const xmlPath='word/numbering.xml';const bytes=parts[xmlPath];if(!bytes)throw Error('Original template numbering styles are missing');
 const w='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
 const doc=new DOMParser().parseFromString(new TextDecoder().decode(bytes),'application/xml');
 if(doc.getElementsByTagName('parsererror').length)throw Error('Invalid original template numbering definitions');
 const root=doc.documentElement,parse=markup=>{const d=new DOMParser().parseFromString(`<root xmlns:w="${w}">${markup}</root>`,'application/xml');if(d.getElementsByTagName('parsererror').length)throw Error('Invalid Word numbering');return doc.importNode(d.documentElement.firstElementChild,true)};
 for(const [absId,fmt,token,left,hang,size,bold] of [[100,'decimal','%1.',720,400,28,true],[101,'lowerLetter','%1.',1150,400,28,true]]){
  root.appendChild(parse(`<w:abstractNum w:abstractNumId="${absId}"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="${fmt}"/><w:lvlText w:val="${token}"/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="${left}"/></w:tabs><w:ind w:left="${left}" w:hanging="${hang}"/></w:pPr><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="${size}"/>${bold?'<w:b/>':''}</w:rPr></w:lvl></w:abstractNum>`));
 }
 root.appendChild(parse('<w:num w:numId="100"><w:abstractNumId w:val="100"/></w:num>'));
 for(let i=0;i<(ex.questions||[]).length;i++)if(ex.questions[i].items?.length){root.appendChild(parse(`<w:num w:numId="${200+i}"><w:abstractNumId w:val="101"/><w:lvlOverride w:ilvl="0"><w:startOverride w:val="1"/></w:lvlOverride></w:num>`));}
 parts[xmlPath]=ENCODE.encode(new XMLSerializer().serializeToString(doc));
}
function save(content,name,ex,lang='fr',diagrams={}){
 const template=window.MATH_ORIGINAL_WORD_TEMPLATE;if(!template)throw Error('Original Word template unavailable');
 const parts={};for(const [path,b64] of Object.entries(template.parts))parts[path]=decode(b64);
 parts['word/document.xml']=templateXml(content,ex,lang);setupNumbering(parts,ex);
 if(Object.keys(diagrams).length){
  const D=new TextDecoder();const xmlRel=D.decode(parts['word/_rels/document.xml.rels']);
  const relEntries=Object.entries(diagrams).map(([i,img])=>`<Relationship Id="rIdMath${i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/maths-diagram-${i}.png"/>`).join('');
  parts['word/_rels/document.xml.rels']=xmlRel.replace('</Relationships>',relEntries+'</Relationships>');
  const types=D.decode(parts['[Content_Types].xml']);
  parts['[Content_Types].xml']=(/Extension="png"/i.test(types)?types:types.replace('</Types>','<Default Extension="png" ContentType="image/png"/></Types>'));
  for(const [i,img] of Object.entries(diagrams))parts[`word/media/maths-diagram-${i}.png`]=img;
 }
 const b=zip(parts),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},5000)
}
function visModeForDoc(q){if(q?.type==='construction')return 'text';if(q?.type==='geometrie')return 'illustration';return q?.visualMode==='text'?'text':q?.visualMode==='illustration'?'illustration':'text'}
async function exportExam(ex,lang,withKey=false,onlyKey=false){
 lang=lang==='en'?'en':'fr';
  const diagrams={},refs={};
  for(let i=0;i<(ex.questions||[]).length;i++){
    const q=ex.questions[i];
    if(!onlyKey&&visModeForDoc(q)!=='text'){
      try{
       if(!q.items?.length&&window.MATH_VISUALS?.svg(q)){
         const bytes=await window.MATH_VISUALS.png(q);if(bytes){diagrams[i]=bytes;refs[i]=`rIdMath${i}`;}
       }
       for(let j=0;j<(q.items||[]).length;j++){
         const it={...q,...q.items[j]};if(!window.MATH_VISUALS.svg(it))continue;
         const key=`${i}-${j}`;const bytes=await window.MATH_VISUALS.png(it);
         if(bytes){diagrams[key]=bytes;refs[key]=`rIdMath${key}`;}
       }
      }catch(err){console.warn('Student diagram rendering failed',err);}
    }
    if(withKey||onlyKey){
     const entries=q.items?.length?q.items.map((it,j)=>[`key-${i}-${j}`,{...q,...it,teacherKeyFigure:true}]):[[`key-${i}`,{...q,teacherKeyFigure:true}]];
     for(const [key,fig] of entries){
       try{if(!window.MATH_VISUALS.svg(fig))continue;const bytes=await window.MATH_VISUALS.png(fig);
         if(bytes){diagrams[key]=bytes;refs[key]=`rIdMath${key}`;}}
       catch(err){console.warn('Teacher construction diagram failed',err);}
     }
    }
  }
 return save(examXml(ex,lang,withKey,onlyKey,refs),`${onlyKey?'corrige':ex.kind==='worksheet'?'fiche-revision':'evaluation'}-maths-${ex.grade}.docx`,ex,lang,diagrams);
}
window.MATH_ZIP=zip;window.MATH_DOCX={exportExam,exportProject:(p,lang)=>save(projectXml(p,lang),`projet-maths-${p.grade}.docx`,{kind:'project',grade:p.grade,total:p.total||10},lang),blanks};
})();


