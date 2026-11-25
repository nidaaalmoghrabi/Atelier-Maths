
/* visuals.js */
/* Original vector diagrams inspired by the simple, labelled geometry and grids in
   the user-provided Al-Ahlia textbooks. Never copied scans or diagrams. */
(function(){'use strict';
const num=(v,def=0)=>Number.isFinite(Number(v))?Number(v):def;
// Real size is defined in CENTIMETRES, independent of SVG pixels or printer DPI.
// Word and PDF exports must use the same physical width and height as the SVG.
const UNITS_PER_CM=100;
window.MATH_WORKSPACE_CM=function(q){const t=String(q?.text||'').toLowerCase();const r=t.match(/(?:rayon|radius)\s*(?:de|of)?\s*([\d.,]+)\s*cm/);if(r)return Math.min(17.5,Math.max(6,2*Number(r[1].replace(',','.'))+1.5));const dims=[...t.matchAll(/([\d.,]+)\s*cm/g)].map(m=>Number(m[1].replace(',','.'))).filter(Number.isFinite);return Math.min(15,Math.max(6,...dims.map(x=>x+2)));};
// Only genuine circle-construction tasks receive a pre-positioned centre O.
// Reading a completed circle and other geometry exercises are left untouched.
window.MATH_NEEDS_CIRCLE_CENTRE = function(q){
 if(!q||!['geometrie','construction'].includes(q.type)||q.geometryMode==='reasoning')return false;
 if(q.geometryTask==='circle'||q.visual?.kind==='start-circle')return true;
 const t=String(q.text||'');
 return /(?:construis|construire|trace|tracer|dessine|construct|draw).{0,130}(?:cercle|circle)/i.test(t)
   && /\b(?:centre|center)\s*(?:[a-zàâéèêîïôûùç]*\s*)?O\b/i.test(t);
};
// One box layout is shared by examination preview, worksheets and printable A4 output.
window.MATH_CONSTRUCTION_BOX = function(q,printing=false){
 const center=window.MATH_NEEDS_CIRCLE_CENTRE(q);
 const klass=printing?'geometry-space':'geometry-mini';
 const h=printing?`height:${window.MATH_WORKSPACE_CM(q)}cm;`:
   `min-height:${Math.min(380,Math.max(170,window.MATH_WORKSPACE_CM(q)*23))}px;`;
 const marker=center?`<svg class="construction-centre" xmlns="http://www.w3.org/2000/svg" width="56" height="42" viewBox="0 0 56 42" role="img" aria-label="Centre O / Centre O"><circle cx="28" cy="21" r="2.1" fill="#17212b"/><text x="36" y="17" font-family="Times New Roman,serif" font-size="15" fill="#17212b">O</text></svg>`:'';
 return `<div class="${klass}${center?' geometry-centre-box':''}" style="${h}" aria-label="${center?'Construction : centre O indiqué dans le cadre':'Espace de construction géométrique'}">${marker}</div>`;
};
function appropriate(q){
 if(q?.teacherKeyFigure)return q?.solutionVisual||null;
 if(q?.type==='construction')return null;
 if(window.MATH_NEEDS_CIRCLE_CENTRE(q))return null;
 if(q?.visualMode==='text'&&q?.type!=='geometrie')return null;
 if(q?.type==='geometrie'&&q?.visual)return q.visual;
 if(q?.visualMode===undefined&&q?.type!=='geometrie'&&!q?.visual)return null;
 return q?.visual||(q?.type==='geometrie'?specFor(q?.category,q?.type,q?.unitName,q?.text,q?.grade):(semanticVisual(q)||specFor(q?.category,q?.type,q?.unitName,q?.text,q?.grade)));
}

const VALID_MAX_WIDTH_CM=17.8; // A4 inner width with 1.5 cm margins and safety clearance.
const VALID_MAX_HEIGHT_CM=17.8; // Keep a dimensioned illustration comfortably inside a printed page.
const FIGURE_PAD_CM=1.15;
function measure(q){
 const v=appropriate(q);
 if(!v)return {toScale:false,widthCm:0,heightCm:0,kind:''};
 const kind=v.kind;
 if(!['circle-radius','square-side','rectangle','start-segment','triangle-sides','triangle-given','triangle-completed','completed-perpendicular','completed-bisector'].includes(kind))
  return {toScale:false,widthCm:0,heightCm:0,kind};
 const t=String(q?.text||'');
 // The exercise's stated unit governs the physical scale; metres are NEVER treated as centimetres.
 const explicitUnit=String(v.unit||'').toLowerCase();
 const detectedUnit=explicitUnit||((t.match(/\d+(?:[.,]\d+)?\s*(mm|cm|km|m)\b/i)||[])[1]||'cm').toLowerCase();
 const unitLabel=detectedUnit;
 if(!['mm','cm','m','km'].includes(unitLabel))return {toScale:false,widthCm:0,heightCm:0,kind,unavailable:true};
 const sourceUnitCm={mm:0.1,cm:1,m:100,km:100000}[unitLabel];
 let nominalWidth=0,nominalHeight=0;
 if(kind==='circle-radius')nominalWidth=nominalHeight=2*Number(v.radius);
 else if(kind==='square-side')nominalWidth=nominalHeight=Number(v.side);
 else if(kind==='rectangle'){nominalWidth=Number(v.length);nominalHeight=Number(v.width);}
 else if(kind==='start-segment'){nominalWidth=Number(v.length);nominalHeight=0.4;}
  else if(['completed-perpendicular','completed-bisector'].includes(kind)){nominalWidth=Number(v.length);nominalHeight=Math.max(3,Number(v.length)*0.55);}
  else if(['triangle-sides','triangle-given','triangle-completed'].includes(kind)){
    const a=Number(v.a),b=Number(v.b),c=Number(v.c);
    if(!(a>0&&b>0&&c>0&&a+b>c&&a+c>b&&b+c>a))return {toScale:false,kind,unavailable:true};
    const cx=(a*a+b*b-c*c)/(2*a),cy=Math.sqrt(Math.max(0,b*b-cx*cx));
    nominalWidth=Math.max(a,cx)-Math.min(0,cx);nominalHeight=cy;
  }
 if(!Number.isFinite(nominalWidth)||!Number.isFinite(nominalHeight)||nominalWidth<=0||nominalHeight<=0)
  return {toScale:false,widthCm:0,heightCm:0,kind,unavailable:true};
 // For centimetres, use 1:1 whenever possible. For metres, use a stated, exact drawing scale.
 // Never squeeze an overlarge geometry image into an arbitrary-width page or Word text box.
 const denominators=(unitLabel==='cm'||unitLabel==='mm')?[1]:[]; // Print actual sizes (1:1) only; never shrink dimensioned figures or pretend metres fit on A4.
 let scaleDenominator=0,shapeWidthCm=0,shapeHeightCm=0;
 for(const n of denominators){
  const ww=nominalWidth*sourceUnitCm/n,hh=nominalHeight*sourceUnitCm/n;
  if(ww+2*FIGURE_PAD_CM<=VALID_MAX_WIDTH_CM&&hh+2*FIGURE_PAD_CM<=VALID_MAX_HEIGHT_CM&&Math.max(ww,hh)>=0.6){
   scaleDenominator=n;shapeWidthCm=ww;shapeHeightCm=hh;break;
  }
 }
 if(!scaleDenominator)return {toScale:false,widthCm:0,heightCm:0,kind,unavailable:true};
 // A dimensioned circle, square, rectangle or segment is now a genuine mathematically scaled drawing.
 return {kind,toScale:true,widthCm:shapeWidthCm+2*FIGURE_PAD_CM,heightCm:shapeHeightCm+2*FIGURE_PAD_CM,
  shapeWidthCm,shapeHeightCm,unitLabel,scaleDenominator,
  unitsPerLabel:sourceUnitCm*UNITS_PER_CM/scaleDenominator};
}
function physicalSvg(v,m,q){
 const en=q?.lang?q.lang==='en':(typeof window!=='undefined'&&window.MATH_I18N?.getLanguage?.()==='en');
 const unit=UNITS_PER_CM,p=FIGURE_PAD_CM*unit,w=m.widthCm*unit,h=m.heightCm*unit;
 const x=p,y=p,drawUnit=m.unitsPerLabel;
 const lineWidth=3.2;
 const fmt=n=>String(n).replace('.',en?'.':',');
 const text=(value,tx,ty,anchor='middle',size=40)=>`<text x="${tx}" y="${ty}" font-family="Times New Roman,serif" font-size="${size}" text-anchor="${anchor}" fill="#17212b">${String(value).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</text>`;
 const point=(px,py)=>`<circle cx="${px}" cy="${py}" r="6" fill="#222"/>`;
 const segment=(x1,y1,x2,y2,weight=lineWidth)=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="#202830" stroke-width="${weight}"/>`;
 let picture='',description='';
 if(m.kind==='circle-radius'){
  const radius=num(v.radius)*drawUnit,cx=w/2,cy=h/2;
  picture=`<circle cx="${cx}" cy="${cy}" r="${radius}" stroke="#202830" stroke-width="${lineWidth}" fill="none"/>`+
   `<path d="M${cx} ${cy}h${radius}" stroke="#b34a52" stroke-width="4" fill="none"/>`+
   point(cx,cy)+point(cx+radius,cy)+text('O',cx-30,cy+42)+text('A',cx+radius+25,cy-9,'start')+
   text(`${fmt(v.radius)} ${m.unitLabel}`,cx+radius/2,cy-26);
  description=`${en?'Circle, actual radius':'Cercle, rayon réel'} ${fmt(v.radius)} ${m.unitLabel}`;
  }else if(['triangle-sides','triangle-given','triangle-completed'].includes(m.kind)){
    const A=num(v.a),B=num(v.b),C=num(v.c),d=m.unitsPerLabel;
    const xc=(A*A+B*B-C*C)/(2*A),yc=Math.sqrt(Math.max(0,B*B-xc*xc));
    const xShift=p-Math.min(0,xc)*d,yBottom=p+yc*d;
    const ax=xShift, bx=xShift+A*d, cx=xShift+xc*d, cy=p;
    picture=segment(ax,yBottom,bx,yBottom)+segment(ax,yBottom,cx,cy)+segment(bx,yBottom,cx,cy)+
      point(ax,yBottom)+point(bx,yBottom)+point(cx,cy)+
      text('A',ax-12,yBottom+35,'middle',35)+text('B',bx+12,yBottom+35,'middle',35)+text('C',cx,cy-18,'middle',35)+
      text(`${fmt(A)} cm`,(ax+bx)/2,yBottom+40,'middle',30)+
      text(`${fmt(B)} cm`,(ax+cx)/2-28,(yBottom+cy)/2,'middle',30)+
      text(`${fmt(C)} cm`,
         m.kind==='triangle-completed'?(bx*.24+cx*.76)+29:(bx+cx)/2+28,
         m.kind==='triangle-completed'?(yBottom*.24+cy*.76)-15:(yBottom+cy)/2,
         'middle',30);
    if(m.kind==='triangle-completed'){
      // Triangle A B C is already fully dimensioned; construct only in the KEY.
      const Bp={x:bx,y:yBottom},Cp={x:cx,y:cy},Ap={x:ax,y:yBottom};
      const feature=v.feature||'median';let Px,Py,name='M';
      if(feature==='median'){Px=(Bp.x+Cp.x)/2;Py=(Bp.y+Cp.y)/2;name='M';}
      else if(feature==='altitude'){
       const dx=Cp.x-Bp.x,dy=Cp.y-Bp.y,t=((Ap.x-Bp.x)*dx+(Ap.y-Bp.y)*dy)/(dx*dx+dy*dy);
       Px=Bp.x+t*dx;Py=Bp.y+t*dy;name='H';
      }else{
       // Angle-bisector theorem, BD:DC = AB:AC = A:B.
       Px=(B*Bp.x+A*Cp.x)/(A+B);Py=(B*Bp.y+A*Cp.y)/(A+B);name='D';
      }
      picture+=`<path d="M${ax} ${yBottom}L${Px} ${Py}" fill="none" stroke="#126b78" stroke-width="4.2"/>`+
        point(Px,Py)+text(name,Px+24,Py-22,'start',34);
      if(feature==='altitude'){
        const dx=Cp.x-Bp.x,dy=Cp.y-Bp.y,hyp=Math.hypot(dx,dy),ux=dx/hyp,uy=dy/hyp,
            vx=-uy,vy=ux,st=22;
        picture+=`<path d="M${Px+ux*st} ${Py+uy*st} L${Px+ux*st+vx*st} ${Py+uy*st+vy*st} L${Px+vx*st} ${Py+vy*st}" stroke="#126b78" stroke-width="3" fill="none"/>`;
      }
      if(feature==='median')picture+=text(`${fmt(C/2)} cm`,(Bp.x+Px)/2+18,(Bp.y+Py)/2-20,'start',27);
      description=feature==='median'?'Completed median AM':feature==='altitude'?'Completed altitude AH':'Completed angle bisector AD';
    }
    description=description||`Triangle ABC : AB ${A} cm, AC ${B} cm, BC ${C} cm`;
  }else if(['completed-perpendicular','completed-bisector'].includes(m.kind)){
    const A=num(v.length)*m.unitsPerLabel,x1=p,x2=p+A,mid=(x1+x2)/2,cy=p+Math.max(3,num(v.length)*.55)*m.unitsPerLabel/2;
    const x0=m.kind==='completed-bisector'?mid:x1;
    picture=segment(x1,cy,x2,cy)+segment(x0,cy-p*.55,x0,cy+p*.55)+point(x1,cy)+point(x2,cy)+
      text('A',x1-10,cy+35,'end',34)+text('B',x2+10,cy+35,'start',34)+
      text(`${fmt(v.length)} cm`,(x1+x2)/2,cy-20,'middle',30)+
      text('(d)',x0+24,cy-p*.54,'start',32)+
      `<path d="M${x0} ${cy-18}h18v18" stroke="#202830" stroke-width="2.8" fill="none"/>`;
    if(m.kind==='completed-bisector')picture+=text('I',mid,cy+40,'middle',34);
    description=`Perpendicular construction on segment AB = ${v.length} cm`;
 }else if(m.kind==='start-segment'){
  const L=num(v.length)*drawUnit,cx=(w-L)/2,cy=h*.42;
  picture=segment(cx,cy,cx+L,cy)+point(cx,cy)+point(cx+L,cy)+
   text('A',cx-20,cy+50,'end')+text('B',cx+L+20,cy+50,'start')+
   text(`${fmt(v.length)} ${m.unitLabel}`,cx+L/2,cy-33);
  description=`${en?'Given base segment':'Segment de base donné'} AB = ${fmt(v.length)} ${m.unitLabel}`;
 }else if(m.kind==='square-side'){
  const side=num(v.side)*drawUnit;
  picture=`<rect x="${x}" y="${y}" width="${side}" height="${side}" fill="none" stroke="#202830" stroke-width="${lineWidth}"/>`+
  text('A',x-15,y-20,'end')+text('B',x+side+14,y-20,'start')+text('C',x+side+14,y+side+49,'start')+text('D',x-15,y+side+49,'end')+
  text(`${fmt(v.side)} ${m.unitLabel}`,x+side/2,y-28)+`<path d="M${x} ${y+30}h30v-30" fill="none" stroke="#7b8992" stroke-width="2"/>`;
  description=`${en?'Actual-size square':'Carré en taille réelle'} ${fmt(v.side)} ${m.unitLabel}`;
 }else if(m.kind==='rectangle'){
  const length=num(v.length)*drawUnit,width=num(v.width)*drawUnit;
  picture=`<rect x="${x}" y="${y}" width="${length}" height="${width}" fill="none" stroke="#202830" stroke-width="${lineWidth}"/>`+
  text('A',x-14,y-23,'end')+text('B',x+length+14,y-23,'start')+text('C',x+length+14,y+width+45,'start')+text('D',x-14,y+width+45,'end')+
  text(`${fmt(v.length)} ${m.unitLabel}`,x+length/2,y-26)+text(`${fmt(v.width)} ${m.unitLabel}`,x+length+22,y+width/2,'start',37)+
  `<path d="M${x} ${y+30}h30v-30" fill="none" stroke="#7b8992" stroke-width="2"/>`;
  description=`${en?'Actual-size rectangle':'Rectangle en taille réelle'} ${fmt(v.length)} x ${fmt(v.width)} ${m.unitLabel}`;
 }
 // Do not print a scale note or a 1 cm scale bar; the SVG's physical dimensions remain exact.
 return `<svg class="math-book-diagram true-size-geometry" xmlns="http://www.w3.org/2000/svg" width="${m.widthCm}cm" height="${m.heightCm}cm" style="width:${m.widthCm}cm;height:${m.heightCm}cm;--atelier-physical-width:${m.widthCm}cm;--atelier-physical-height:${m.heightCm}cm" viewBox="0 0 ${w} ${h}" role="img" data-true-scale="1" data-width-cm="${m.widthCm}" data-height-cm="${m.heightCm}" aria-label="${description}"><rect width="100%" height="100%" fill="#fff"/>${picture}</svg>`;
}

/* A selection of "With illustration or diagram" is actionable for non-geometry
   questions too. Never introduce invented measurements or show an answer as given. */
function semanticVisual(q){
 if(!q||q.type==='construction'||q.visualMode!=='illustration')return null;
 const raw=String(q.text||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
 const en=(q.lang||window.MATH_I18N?.getLanguage()||'fr')==='en';
 if(!raw)return null;
 // A fraction model uses exactly the numerator and denominator in the question.
 const frac=raw.match(/(?:^|[^\d\w/])(\d{1,2})\s*\/\s*(\d{1,2})(?!\d)/);
 if(frac){const a=Number(frac[1]),b=Number(frac[2]);
   if(b>=2&&b<=16&&a>=0&&a<=b)return {kind:'fraction-parts',numerator:a,denominator:b};
 }
 // A proportion bar shows only the given percentage, never the unknown result.
 const pct=raw.match(/\b(\d{1,3}(?:[.,]\d+)?)\s*%/);
 if(pct){const v=Number(pct[1].replace(',','.'));
   if(Number.isFinite(v)&&v>=0&&v<=100)return {kind:'ratio-bar',part:v,total:100};
 }
 // Array from an explicit multiplication, not from arbitrary story quantities.
 const mul=raw.match(/\b(\d{1,2})\s*[×*]\s*(\d{1,2})\b/);
 if(mul){const a=Number(mul[1]),b=Number(mul[2]);
   if(a>=2&&a<=9&&b>=2&&b<=9)return {kind:'question-array',rows:a,columns:b};
 }
 // Fallback is a data diagram containing ONLY quantities actually written in
 // the student question.  It does not guess a relation or reveal a solution.
 const segments=[];const rg=/(?:\d+(?:[.,]\d+)?\s*(?:%|°|(?:cm|mm|km|kg|g|m|l|L|€|\$)\b)?)/g;
 for(const m of raw.matchAll(rg)){
  const start=m.index,end=start+m[0].length;
  const token=m[0].trim();
  if(!token||segments.some(v=>v.token===token))continue;
  const before=raw.slice(Math.max(0,start-21),start).replace(/^[^\p{L}\p{N}]+/u,'').trim();
  const after=raw.slice(end,Math.min(raw.length,end+20)).match(/^(?:\s*[\p{L}]+){0,2}/u)?.[0]?.trim()||'';
  const context=(before.split(/[,;.!?]/).pop()||'').split(/\s+/).slice(-2).join(' ');
  const label=[context,token,after].filter(Boolean).join(' ').trim();
  segments.push({token, label:label.slice(0,42)});
  if(segments.length===4)break;
 }
 if(segments.length)return {kind:'question-data',title:en?'Given information':'Données de la question',entries:segments.map(x=>x.label)};
 // For questions with no numerals, show a visual vocabulary map using ONLY
 // terminology present in the original statement, without asserting facts.
 const stop=/^(?:the|this|these|that|which|where|there|with|what|show|each|from|then|write|true|false|correct|statement|number|question|dans|quelle|quelles|pour|avec|cette|celui|sont|vrai|faux|corrige|écris|dans|chaque|donne|vérifie|proposée|proposées|suivante|suivantes|complète|réponse|calcule|number|represents)$/i;
 const words=[...raw.matchAll(/[\p{L}]{5,}/gu)].map(x=>x[0]).filter(w=>!stop.test(w));
 const uniq=[...new Set(words.map(w=>w.toLocaleLowerCase()))].slice(0,3);
 return uniq.length?{kind:'question-data',title:en?'Keywords in the question':'Notions de la question',entries:uniq}:null;
}
function specFor(cat,type,source,question,grade){
 const s=String(source||'').toLowerCase(),t=String(question||'').toLowerCase();
 if(type==='geometrie'){
  if(/pyramide|pyramid/.test(t))return {kind:'start-square'};
  if(/circle|cercle/.test(s+' '+t))return {kind:'start-circle'};
  if(/square|carré/.test(s+' '+t))return {kind:'start-rectangle'};
  if(/triangle/.test(s+' '+t))return {kind:'start-triangle'};
  if(/angle|bisector|bissectrice/.test(s+' '+t))return {kind:'start-angle'};
  if(/parallel|perpendicular|droite|line|médiatrice|perpendicular bisector/.test(s+' '+t))return {kind:'start-lines'};
  return {kind:grade<=5?'start-rectangle':'start-lines'};
 }
 if(cat==='geometry'){
  if(/pyramide|pyramid/.test(s+' '+t))return {kind:'pyramid'};
  if(/circle|cercle|diamètre|radius|rayon/.test(s+' '+t))return null;
  if(/square|carré/.test(s+' '+t))return null;
  if(/quadrilatère|quadrilateral/.test(t))return {kind:'quadrilateral'};
  if(/triangle/.test(t))return {kind:'triangle'};
  if(/parallel|perpendicular|droite|lines/.test(t))return {kind:'parallel'};
  if(/carré|square/.test(s))return null;
  if(/cube|prisme|pyramide|volume/.test(t))return {kind:'cube'};
 }
 if(cat==='fraction'){
   const m=t.match(/(\d+)\s*\/\s*(\d+)/);if(m){const den=+m[2],up=+m[1];if(den>=2&&den<=16&&up>=0&&up<=den)return {kind:'fraction',top:up,bottom:den};}
 }
 if(cat==='area'){const m=t.match(/(\d+)\s*cm.*?(\d+)\s*cm/);return m?{kind:'rectangle',length:+m[1],width:+m[2]}:null;}
 if(cat==='angles')return null;
 if(cat==='symmetry')return {kind:'symmetry'};
 if(cat==='integers')return {kind:'number-line'};
 if(cat==='numeration')return {kind:'place-value'};
 if(cat==='time')return null;
 if(cat==='measurement')return null;
 if(cat==='statistics')return null;
 if(cat==='ratio')return null;
 if(cat==='multiplication')return null;
 return null;
}
const pt=(x,y)=>`<circle cx="${x}" cy="${y}" r="2.4" fill="#151a20"/>`;
const txt=(t,x,y,anchor='middle',size=16)=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Times New Roman,serif" font-size="${size}" fill="#18222c">${String(t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</text>`;
const ln=(x1,y1,x2,y2,red=false,width=2,dash='')=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${red?'#ca4b50':'#232b34'}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
function svg(q){const v=appropriate(q);if(!v)return '';
 const size=measure(q);if(size.toScale)return physicalSvg(v,size,q);
 // Fail closed: a measurement that cannot be rendered accurately is never replaced by a guessed drawing.
 if(['circle-radius','square-side','rectangle','start-segment','triangle-sides','triangle-given','triangle-completed','completed-perpendicular','completed-bisector'].includes(v.kind))return '';
 const statedLength=/(?:\d+(?:[.,]\d+)?\s*(?:cm|mm|m)\b)/i.test(String(q?.text||''));
 if(statedLength&&q?.type==='geometrie'&&!['start-point','start-circle','start-angle'].includes(v.kind))return '';
 const k=v.kind;const a=num(v.side,5),r=num(v.radius,4);let shapes='';let label='';
 if(k==='question-data'){
  const entries=(Array.isArray(v.entries)?v.entries:[]).slice(0,4),total=entries.length;
  const title=String(v.title||'').slice(0,40);
  shapes=`<rect x="36" y="20" width="362" height="179" rx="9" fill="#f8fbfd" stroke="#b7c9d4" stroke-width="1.6"/>`+
    txt(title,217,49,'middle',16);
  const gap=8,cols=total<=2?total:2,rows=Math.ceil(total/cols),cw=cols===1?286:168,ch=rows===1?88:55;
  for(let i=0;i<total;i++){
    const col=i%cols,row=Math.floor(i/cols),left=cols===1?72:45+col*(cw+8),top=rows===1?71:62+row*(ch+7);
    shapes+=`<rect x="${left}" y="${top}" width="${cw}" height="${ch}" rx="8" fill="#fff" stroke="#6c91b1" stroke-width="1.4"/>`+
      txt(String(entries[i]).slice(0,cols===1?36:19),left+cw/2,top+ch/2+5,'middle',cols===1?15:12);
  }
  label='Visual information extracted verbatim from the question; no solution supplied';
 }
 else if(k==='question-array'){
  const rows=Math.max(1,Math.min(9,num(v.rows,2))),cols=Math.max(1,Math.min(9,num(v.columns,2)));
  const step=Math.min(30,125/Math.max(rows,cols)),x0=215-(cols-1)*step/2,y0=109-(rows-1)*step/2;
  shapes=txt(`${rows} × ${cols}`,215,34,'middle',21);
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)shapes+=`<circle cx="${x0+x*step}" cy="${y0+y*step+11}" r="${Math.min(step*.27,8)}" fill="#deecf2" stroke="#395d78" stroke-width="1.4"/>`;
  label='Array model corresponding to the two explicitly given factors';
 }
 else if(k==='completed-symmetry'){
   const cx=215,cy=120,scale=25,P=[[1,1],[4,1],[2,3]],X=p=>cx+p[0]*scale,Y=p=>cy-p[1]*scale;
   const poly=arr=>`<path d="M${arr.map(p=>`${X(p)},${Y(p)}`).join('L')}Z" fill="none" stroke="#232b34" stroke-width="2.3"/>`;
   const mirror=P.map(p=>[-p[0],p[1]]);
   shapes=ln(cx,14,cx,203,true,2,'5 5')+poly(P)+poly(mirror)+
    P.map((pt,i)=>ln(X(pt),Y(pt),X(mirror[i]),Y(mirror[i]),false,.75,'4 4')).join('')+
    P.map((pt,i)=>txt(['A','B','C'][i],X(pt)+8,Y(pt)-8)).join('')+
    mirror.map((pt,i)=>txt(["A′","B′","C′"][i],X(pt)-8,Y(pt)-8)).join('')+txt('(d)',cx+13,20);
   label='Construction correcte de la symétrie axiale par rapport à (d)';
  }
  else if(k==='circle-radius'){shapes=`<circle cx="220" cy="108" r="72" stroke="#202831" stroke-width="2" fill="none"/>${ln(220,108,292,108,true,2.7)}${pt(220,108)}${pt(292,108)}${txt('O',207,126)}${txt('A',300,102,'start')}${txt(`${r} cm`,255,96)}`;label='Cercle avec centre O et rayon OA';}
 else if(k==='start-point'){shapes=`${pt(155,111)}${txt('A',142,104)}`;label='Point A donné comme départ de la construction';}
 else if(k==='start-symmetry'){shapes=`${ln(219,20,219,198,true,2,'5 5')}<path d="M92 158L133 58L169 153Z" fill="none" stroke="#202831" stroke-width="2"/>${txt('A',79,174)}${txt('B',132,48)}${txt('C',181,171)}${txt('(d)',230,29,'start')}`;label='Triangle ABC et axe de symétrie (d), image à construire';}
 else if(k==='angle-measure'){const deg=num(v.degrees,60),x=137,y=173,len=152,rad=deg*Math.PI/180;shapes=`${ln(x,y,x+len,y)}${ln(x,y,x+len*Math.cos(rad),y-len*Math.sin(rad))}${pt(x,y)}${txt('O',124,192)}${txt('A',x+len+13,y+5)}${txt('B',x+len*Math.cos(rad)+11,y-len*Math.sin(rad)-9)}<path d="M${x+26} ${y} A26 26 0 0 0 ${x+26*Math.cos(rad)} ${y-26*Math.sin(rad)}" fill="none" stroke="#b64c68" stroke-width="1.6"/>`;label='Angle AÔB dessiné géométriquement selon la mesure donnée';}
 else if(k==='start-circle'){shapes=`${pt(220,111)}${txt('O',234,107,'start')}`;label='Point O pour construire un cercle';}
 else if(k==='square-side'){shapes=`<rect x="145" y="36" width="132" height="132" fill="none" stroke="#222c36" stroke-width="2"/>${txt('A',135,30)}${txt('B',286,30)}${txt('C',288,187)}${txt('D',133,186)}${ln(197,35,197,26,true,1.5)}${ln(197,169,197,178,true,1.5)}${ln(144,100,135,100,true,1.5)}${ln(278,100,287,100,true,1.5)}${txt(`${a} cm`,212,28)}<path d="M145 50H159V36" fill="none" stroke="#99a5b0" stroke-width="1.3"/>`;label='Carré ABCD et mesure de son côté';}
 else if(k==='rectangle'){const l=num(v.length,8),w=num(v.width,4);shapes=`<rect x="116" y="47" width="200" height="123" fill="none" stroke="#242c32" stroke-width="2"/>${txt('A',107,38)}${txt('B',325,38)}${txt('C',326,188)}${txt('D',107,188)}${txt(`${l} ${v.unit||'cm'}`,216,36)}${txt(`${w} ${v.unit||'cm'}`,336,110,'start')}<path d="M116 61H130V47" fill="none" stroke="#8d9da9" stroke-width="1.3"/>`;label='Rectangle coté';}
 else if(k==='start-square'){shapes=`<path d="M140 126L242 126L293 175L190 175Z" fill="none" stroke="#232b34" stroke-width="2"/>${txt('A',126,121)}${txt('B',254,121)}${txt('C',305,188)}${txt('D',180,190)}`;label='Base carrée ABCD servant de départ à la construction de la pyramide';}
 else if(k==='pyramid'){shapes=`<path d="M140 135L243 135L302 183L197 183Z" fill="none" stroke="#232b34" stroke-width="1.8"/>${ln(220,27,140,135)}${ln(220,27,243,135)}${ln(220,27,302,183)}${ln(220,27,197,183,false,1.2,'4 4')}${txt('S',222,20)}${txt('A',126,132)}${txt('B',253,127)}${txt('C',313,192)}${txt('D',195,203)}`;label='Pyramide SABCD à base carrée';}
 else if(k==='start-rectangle'){shapes=`${ln(105,158,292,158)}${pt(105,158)}${pt(292,158)}${txt('A',96,175)}${txt('B',301,175)}${txt('?',204,187)}`;label='Segment AB servant de base à une construction';}
 else if(k==='start-triangle'){shapes=`${ln(88,173,322,173)}${pt(88,173)}${pt(322,173)}${txt('A',83,194)}${txt('B',328,194)}`;label='Segment AB comme base du triangle à construire';}
 else if(k==='triangle'){shapes=`<path d="M95 170L211 33L333 170Z" fill="none" stroke="#202831" stroke-width="2"/>${txt('A',87,185)}${txt('B',337,185)}${txt('C',213,22)}`;label='Triangle ABC';}
 else if(k==='quadrilateral'){shapes=`<path d="M117 159L100 65L286 41L324 169Z" fill="none" stroke="#202831" stroke-width="2"/>${txt('A',101,184)}${txt('B',92,59)}${txt('C',297,34)}${txt('D',339,180)}`;label='Quadrilatère ABCD';}
 else if(k==='start-angle'){shapes=`${ln(136,164,347,164)}${pt(136,164)}${txt('O',127,184)}${txt('A',360,170)}`;label='Demi-droite [OA) de départ';}
 else if(k==='angles'){
 const given=num(v.given,40),total=num(v.total,90);
 if(total===180){shapes=`${ln(63,170,367,170)}${ln(215,170,215+127*Math.cos(Math.PI-given*Math.PI/180),170-127*Math.sin(Math.PI-given*Math.PI/180),true,2.3)}${pt(215,170)}${txt('O',215,192)}${txt('x',55,175)}${txt('y',375,175)}${txt(`${given}°`,170,131)}${txt('?',268,145)}`;label='Angle plat partagé en deux angles adjacents';}
 else{shapes=`${ln(144,170,361,170)}${ln(144,170,144,26)}${ln(144,170,144+160*Math.cos(given*Math.PI/180),170-160*Math.sin(given*Math.PI/180),true,2.3)}<path d="M144 152H162V170" fill="none" stroke="#899eac" stroke-width="1.4"/>${pt(144,170)}${txt('O',129,191)}${txt('x',369,174)}${txt('y',133,23)}${txt(`${given}°`,207,152)}${txt('?',170,80)}`;label='Angle droit partagé en deux angles adjacents';}
 }
 else if(k==='start-lines'){shapes=`${ln(81,169,359,169)}${pt(115,169)}${pt(333,169)}${txt('A',112,194)}${txt('B',336,194)}${txt('(d)',359,161)}`;label='Segment AB et droite de référence';}
 else if(k==='parallel'){shapes=`${ln(120,36,120,180)}${ln(294,36,294,180)}${ln(55,120,375,120,true,2)}<path d="M120 107H133V120 M294 107H307V120" stroke="#253441" fill="none" stroke-width="1.7"/>${txt('(d₁)',125,26)}${txt('(d₂)',298,26)}${txt('(Δ)',382,114)}`;label='Deux droites perpendiculaires à une même droite';}
 else if(k==='fraction-parts'){const n=Math.max(2,Math.min(16,num(v.denominator,4))),up=Math.max(0,Math.min(n,num(v.numerator,1))),x=56,y=80,w=320/n;for(let i=0;i<n;i++)shapes+=`<rect x="${x+i*w}" y="${y}" width="${w}" height="65" fill="${i<up?'#dae8f1':'white'}" stroke="#222d34" stroke-width="1.4"/>`;label='Parts égales représentant une fraction';}
 else if(k==='fraction'){const n=Math.max(2,Math.min(16,num(v.bottom,4))),up=Math.max(0,Math.min(n,num(v.top,1)));const x=56,y=80,w=320/n;for(let i=0;i<n;i++)shapes+=`<rect x="${x+i*w}" y="${y}" width="${w}" height="65" fill="${i<up?'#dae8f1':'white'}" stroke="#222d34" stroke-width="1.4"/>`;shapes+=txt(`${up}/${n}`,216,178);label=`Barre fractionnée en ${n} parts égales`;}
 else if(k==='number-line'){shapes+=ln(48,112,385,112);for(let i=0;i<=9;i++){const x=60+i*35;shapes+=ln(x,104,x,120,false,1.2)+txt(i-4,x,142);}shapes+=`<path d="M385 112l-11 -6v12z" fill="#18232a"/>`;label='Droite numérique graduée';}
 else if(k==='clock'){const h=num(v.hours,2),m=num(v.minutes,15),thetaM=(m/60*2*Math.PI-Math.PI/2),thetaH=((h%12+m/60)/12*2*Math.PI-Math.PI/2);shapes=`<circle cx="215" cy="110" r="79" stroke="#202a31" fill="white" stroke-width="2"/>`;for(let i=0;i<12;i++){const th=i*Math.PI/6-Math.PI/2;shapes+=ln(215+68*Math.cos(th),110+68*Math.sin(th),215+76*Math.cos(th),110+76*Math.sin(th),false,1.2);}shapes+=ln(215,110,215+55*Math.cos(thetaM),110+55*Math.sin(thetaM),true,3)+ln(215,110,215+41*Math.cos(thetaH),110+41*Math.sin(thetaH),false,3)+pt(215,110)+txt('12',215,47)+txt('3',283,116)+txt('6',215,182)+txt('9',147,116);label='Horloge avec aiguilles correspondant au temps indiqué';}
 else if(k==='ruler'){shapes=`<rect x="52" y="71" width="332" height="79" fill="#fff" stroke="#222" stroke-width="1.8"/>`;for(let i=0;i<=20;i++){const x=63+15.5*i;shapes+=ln(x,71,x,71+(i%5===0?33:16),false,1);if(i%5===0)shapes+=txt(i/2,x,119);}label='Règle graduée';}
 else if(k==='bar-chart'){const vs=Array.isArray(v.values)?v.values.map(x=>num(x,0)).slice(0,4):[4,7,5],labs=Array.isArray(v.labels)?v.labels:['A','B','C'];const max=Math.max(...vs,1);for(let i=0;i<vs.length;i++){const x=117+i*80,h=vs[i]/max*115;shapes+=`<rect x="${x}" y="${176-h}" width="38" height="${h}" fill="#dcecf0" stroke="#2a3440" stroke-width="1.6"/>`+txt(labs[i]||'',x+19,196)+txt(vs[i],x+19,165-h);}shapes+=ln(75,177,381,177);label='Diagramme en bâtons des effectifs';}
 else if(k==='proportion-table'){const top=v.top||[3,5],bottom=v.bottom||[6,'?'];shapes=`<rect x="110" y="58" width="210" height="113" fill="white" stroke="#222" stroke-width="1.8"/>${ln(110,114,320,114)}${ln(215,58,215,171)}${txt(top[0],162,94)}${txt(top[1],268,94)}${txt(bottom[0],162,150)}${txt(bottom[1],268,150)}`;label='Tableau de proportionnalité avec valeur inconnue';}
 else if(k==='ratio-bar'){const total=Math.max(1,num(v.total,100)),part=Math.max(0,Math.min(total,num(v.part,0))),w=320*part/total;shapes=`<rect x="55" y="87" width="320" height="61" fill="white" stroke="#222" stroke-width="1.8"/><rect x="55" y="87" width="${w}" height="61" fill="#dcebf1" stroke="none"/>${ln(55+w,87,55+w,148,false,1.7)}${txt(`${part} / ${total}`,215,180)}`;label='Partie représentée par rapport au total';}
 else if(k==='place-value'){const labels=['1 000','100','10','1'];shapes=`<rect x="54" y="66" width="324" height="105" fill="white" stroke="#222" stroke-width="1.6"/>${ln(54,119,378,119)}${ln(135,66,135,171)}${ln(216,66,216,171)}${ln(297,66,297,171)}`;for(let i=0;i<4;i++){shapes+=txt(labels[i],94+i*81,100)+txt('·',94+i*81,153);}label='Tableau de numération, milliers, centaines, dizaines et unités';}
 else if(k==='groups'){const centers=[118,211,304];for(const xx of centers){shapes+=`<rect x="${xx-39}" y="55" width="80" height="110" fill="none" stroke="#7a8b9b" stroke-width="1.1" rx="5"/>`;for(let j=0;j<6;j++){const x=xx-22+(j%3)*22,y=80+Math.floor(j/3)*32;shapes+=`<circle cx="${x}" cy="${y}" r="6" fill="#dcebf0" stroke="#3b596d" stroke-width="1"/>`;}}label='Groupements pour visualiser une multiplication';}
 else if(k==='symmetry'){shapes=`${ln(213,24,213,201,true,1.6,'6 5')}<path d="M85 165L151 66L177 164Z M341 165L275 66L249 164Z" fill="none" stroke="#25313a" stroke-width="2"/>${txt('(d)',223,27)}${txt('A',83,183)}${txt('A′',345,183)}`;label='Symétrie axiale par rapport à la droite d';}
 else if(k==='cube'){shapes=`<path d="M139 86L246 86L246 179L139 179Z M139 86L187 40L295 40L246 86 M246 179L295 135L295 40 M139 179L187 135L295 135" fill="none" stroke="#24313b" stroke-width="1.8"/>`;label='Cube en perspective cavalière';}
 else return '';
 const en=q?.lang?q.lang==='en':(typeof window!=='undefined'&&window.MATH_I18N?.getLanguage?.()==='en');
 return `<svg class="math-book-diagram" xmlns="http://www.w3.org/2000/svg" width="430" height="218" viewBox="0 0 430 218" role="img" aria-label="${label.replaceAll('"','')}"><rect width="430" height="218" fill="#fff"/>${shapes}</svg>`;
}
function html(q){const s=svg(q);return s?`<div class="math-figure" role="group">${s}</div>`:'';}
async function png(q){const data=svg(q);if(!data)return null;const m=measure(q);
 return await new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{
  const c=document.createElement('canvas');
  // Keep geometry pixels and its real DOCX physical dimensions in the same ratio.
  // 180 DPI preserves a smooth textbook-style line when printed on A4 paper.
  c.width=m.toScale?Math.round(m.widthCm*180/2.54):860;
  c.height=m.toScale?Math.round(m.heightCm*180/2.54):436;
  const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);
  ctx.drawImage(im,0,0,c.width,c.height);
  try{const raw=atob(c.toDataURL('image/png').split(',')[1]);const out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);resolve(out);}catch(e){reject(e)}
 };im.onerror=reject;im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(data);});}
window.MATH_VISUALS={html,svg,png,specFor,measure,isAccurateReference(q){const m=measure(q);if(m.toScale)return true;const v=appropriate(q);return Boolean(v&&['angle-measure','angles','parallel','triangle','quadrilateral','pyramid','start-symmetry','symmetry'].includes(v.kind)&&svg(q));}};
})();


