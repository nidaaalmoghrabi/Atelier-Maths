
/* interactive-visuals.js */
/* Offline, interactive mathematics manipulatives for the interactive-practice tab.
   Original SVG drawings, aligned to Al-Ahlia chapter themes (not textbook scans).
   They intentionally do not show the exercise solution before validation.
   Printed geometry still uses visuals.js with physical centimetre dimensions. */
(function(){'use strict';
const language=()=>window.MATH_I18N?.getLanguage?.()==='en'?'en':'fr';
const tr=(fr,en)=>language()==='en'?en:fr;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number(v)||0));
const nfmt=(n)=>language()==='en'?String(n):String(n).replace('.',',');
const line=(x1,y1,x2,y2,col='#283949',sw=2,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${sw}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const dot=(x,y,r=4,col='#283949')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
const text=(s,x,y,size=15,anchor='middle',col='#283949')=>`<text x="${x}" y="${y}" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" text-anchor="${anchor}" fill="${col}">${esc(s)}</text>`;
const titleSvg=s=>text(s,260,24,17);
const radiusFromQuestion=q=>{const t=String(q.text||'');let m=t.match(/(?:rayon|radius)\s*(?:de|of|=)?\s*(\d+(?:[,.]\d+)?)\s*cm/i);return m?clamp(+m[1].replace(',','.'),1,8):null};
const cmFromText=(t,rx)=>{const m=t.match(rx);return m?Number(m[1].replace(',','.')):null};
function modeFor(q){const cat=q.category||'',s=(String(q.unitName||'')+' '+String(q.topic||'')+' '+String(q.text||'')).toLowerCase();
 if(/cercle|circle|rayon|radius|diamètre|diameter|disque|disc/.test(s))return 'circle';
 if(/carré|square/.test(s))return 'square';
 if(/rectangle|surface|périmètre|perimeter|area|aire/.test(s)&&['geometry','area'].includes(cat))return 'rectangle';
 if(/triangle|triangl|pyramide|pyramid|cube|prism/.test(s))return 'triangle';
 if(/angle|bissect|bisect/.test(s)||cat==='angles')return 'angle';
 if(/symétr|symmetr|translation|homoth/.test(s)||cat==='symmetry')return 'symmetry';
 if(/parall|perpend|line|droite|médiatrice|bisector|segment/.test(s)&&cat==='geometry')return 'lines';
 if(cat==='geometry')return q.grade<=5?'rectangle':'triangle';
 if(cat==='fraction')return 'fraction';
 if(cat==='statistics')return q.visual?.kind==='ratio-bar'?'percentage':'bars';
 if(cat==='time')return 'clock';
 if(cat==='ratio')return 'ratio';
 if(cat==='integers'||/relative|signed number/.test(s))return 'numberline';
 if(cat==='decimal')return 'decimal';
 if(cat==='numeration'||cat==='powers'||cat==='algebra')return 'placevalue';
 if(cat==='measurement')return /volume|capacity|mass|capac|volume|litre/.test(s)?'measuring':'ruler';
 if(cat==='arith')return /divis|multiple|pgcd|gcd|ppcm|lcm|premier|prime/.test(s)?'multiples':'numberline';
 if(cat==='multiplication'||cat==='division')return 'groups';
 return 'groups';
}
function config(mode,q){const raw=String(q.text||'');const pairs=[...raw.matchAll(/(\d+)\s*\/\s*(\d+)/g)].filter(m=>+m[2]>0&&+m[2]<=24);
 const cm=radiusFromQuestion(q),side=cmFromText(raw,/(?:côté|side)\s*(?:de|of|=)?\s*(\d+(?:[,.]\d+)?)\s*cm/i);
 const defs={
  circle:{label:tr('Cercle : rayon et diamètre','Circle: radius and diameter'),controls:[['r',tr('Rayon','Radius'),1,8,cm||4,'cm']]},
  square:{label:tr('Carré : côtés et carreaux','Square: sides and unit tiles'),controls:[['s',tr('Côté','Side'),1,8,side||4,'cm']]},
  rectangle:{label:tr('Rectangle : longueur et largeur','Rectangle: length and width'),controls:[['l',tr('Longueur','Length'),1,10,6,'cm'],['w',tr('Largeur','Width'),1,8,3,'cm']]},
  fraction:{label:tr('Fractions : colorier des parts égales','Fractions: shade equal parts'),controls:[['n',tr('Numérateur colorié','Shaded numerator'),0,12,pairs[0]?Math.min(+pairs[0][1],12):2,''],['d',tr('Dénominateur','Denominator'),2,12,pairs[0]?Math.min(+pairs[0][2],12):5,'']]},
  numberline:{label:tr('Droite graduée : nombres relatifs','Number line: positive and negative'),controls:[['x',tr('Position du point A','Position of point A'),-8,8,-3,'']]},
  decimal:{label:tr('Droite graduée : dixièmes','Number line: tenths'),controls:[['x',tr('Dixièmes','Tenths'),0,20,7,'']]},
  angle:{label:tr('Angles : tourner une demi-droite','Angles: rotate a ray'),controls:[['a',tr('Mesure explorée','Angle to explore'),0,180,60,'°']]},
  triangle:{label:tr('Triangle : déplacer le sommet','Triangle: move the vertex'),controls:[['x',tr('Position horizontale de C','Horizontal position of C'),1,9,5,''],['h',tr('Hauteur de C','Height of C'),2,8,6,'']]},
  symmetry:{label:tr('Symétrie : déplacer un point et son image','Reflection: move a point and its image'),controls:[['x',tr('Distance à l’axe','Distance from axis'),1,8,4,''],['y',tr('Hauteur du point','Point height'),1,8,5,'']]},
  lines:{label:tr('Droites : observer parallélisme et perpendicularité','Lines: parallel and perpendicular'),controls:[['a',tr('Inclinaison','Inclination'),0,70,20,'°']]},
  groups:{label:tr('Groupements : addition répétée et partage','Groups: repeated addition and division'),controls:[['g',tr('Nombre de groupes','Number of groups'),1,7,3,''],['u',tr('Objets par groupe','Objects in each group'),1,9,4,'']]},
  multiples:{label:tr('Multiples : compter par bonds','Multiples: count by jumps'),controls:[['m',tr('Pas','Step size'),2,10,4,''],['k',tr('Nombre de bonds','Number of jumps'),1,8,4,'']]},
  bars:{label:tr('Statistiques : modifier les effectifs','Statistics: change frequencies'),controls:[['a',tr('Groupe A','Group A'),0,10,4,''],['b',tr('Groupe B','Group B'),0,10,7,''],['c',tr('Groupe C','Group C'),0,10,5,'']]},
  percentage:{label:tr('Pourcentages : colorier les élèves interrogés','Percentages: shade the surveyed students'),controls:[['n',tr('Élèves sélectionnés','Selected students'),0,100,q.visual?.part??10,''],['t',tr('Effectif total','Total students'),10,100,q.visual?.total??50,'',10]]},
  clock:{label:tr('Horloge : déplacer les aiguilles','Clock: move the hands'),controls:[['h',tr('Heure','Hour'),0,11,3,'h'],['m',tr('Minutes','Minutes'),0,55,15,'min',5]]},
  ratio:{label:tr('Proportionnalité : faire varier les quantités','Proportionality: vary quantities'),controls:[['n',tr('Nombre d’articles','Number of items'),1,8,3,''],['p',tr('Unités par article','Units per item'),1,6,4,'']]},
  placevalue:{label:tr('Numération : tableau de position','Place value: base-ten chart'),controls:[['m',tr('Milliers','Thousands'),0,9,1,''],['c',tr('Centaines','Hundreds'),0,9,3,''],['d',tr('Dizaines','Tens'),0,9,4,''],['u',tr('Unités','Ones'),0,9,6,'']]},
  ruler:{label:tr('Longueurs : mesurer sur une règle','Length: measure on a ruler'),controls:[['x',tr('Longueur choisie','Selected length'),0,12,5,'cm']]},
  measuring:{label:tr('Capacité : remplir une éprouvette graduée','Capacity: fill a measuring cylinder'),controls:[['x',tr('Niveau du liquide','Liquid level'),0,10,6,'L']]}
 };return defs[mode];
}
function drawing(mode,v){let g='',note='';const paper='#fff',navy='#233b52',green='#2c847c',fill='#d9ebf4',coral='#bc6f60';
 if(mode==='circle'){
  const r=v.r*13.8,cx=260,cy=128;g=`<circle cx="${cx}" cy="${cy}" r="${r}" stroke="${navy}" stroke-width="2.3" fill="none"/>${line(cx-r,cy,cx+r,cy,'#a1b0bd',1.3,'6 5')}${line(cx,cy,cx+r,cy,coral,3.5)}${dot(cx,cy)}${dot(cx+r,cy)}${text('O',cx-17,cy+23)}${text('A',cx+r+13,cy-10)}${text('B',cx-r-12,cy-10)}${text(tr('rayon OA','radius OA'),cx+r/2,cy-14,14)}`;
  note=tr('Déplace le curseur : OA est un rayon, BA est un diamètre.','Move the slider: OA is a radius; BA is a diameter.');
 }else if(mode==='square'||mode==='rectangle'){
  const n=mode==='square'?v.s:v.l,m=mode==='square'?v.s:v.w;const cell=Math.min(23,198/Math.max(n,m)),w=n*cell,h=m*cell,x=260-w/2,y=125-h/2;
  g+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#eff7fb" stroke="${navy}" stroke-width="2.4"/>`;
  for(let i=1;i<n;i++)g+=line(x+i*cell,y,x+i*cell,y+h,'#b9d0df',1.2);
  for(let j=1;j<m;j++)g+=line(x,y+j*cell,x+w,y+j*cell,'#b9d0df',1.2);
  g+=text('A',x-12,y-11)+text('B',x+w+12,y-11)+text('C',x+w+12,y+h+21)+text('D',x-12,y+h+21)+text(`${n} cm`,260,y-12)+text(`${m} cm`,x+w+20,y+h/2,'12','start');
  note=tr('Chaque carreau représente une unité carrée. Observe les rangées et les colonnes.','Each tile represents one square unit. Observe rows and columns.');
 }else if(mode==='fraction'){
  const d=v.d,n=clamp(v.n,0,d);const tile=390/d,y=97,x=65,h=88;
  for(let i=0;i<d;i++)g+=`<rect class="vis-part" data-vis-part="${i}" x="${x+i*tile}" y="${y}" width="${tile}" height="${h}" fill="${i<n?'#aedccf':'#fff'}" stroke="${navy}" stroke-width="1.5"/>`;
  g+=text(`${n}/${d}`,260,211,22)+text(tr('Clique sur une case pour changer la partie coloriée.','Click a tile to change the shaded fraction.'),260,59,14);
  note=tr('Toutes les parts ont la même taille ; le numérateur indique les parts coloriées.','All parts are equal; the numerator counts the shaded parts.');
 }else if(mode==='numberline'||mode==='decimal'){
  const start=mode==='numberline'?-8:0,end=mode==='numberline'?8:2,div=mode==='numberline'?16:20;
  const y=139,x=55,w=410;g+=line(x,y,x+w,y,navy,2)+`<path d="M${x+w} ${y}l-10 -6v12z" fill="${navy}"/>`;
  for(let i=0;i<=div;i++){
   const px=x+w*i/div;g+=line(px,y-8,px,y+8,'#5c7385',1.2);
   if(mode==='numberline'||i%5===0)g+=text(mode==='numberline'?i-8:nfmt(i/10),px,y+29,12);
  }
  const px=mode==='numberline'?x+(v.x+8)*w/16:x+v.x*w/20;
  g+=line(px,y-44,px,y-2,coral,2.4)+dot(px,y,6,coral)+text('A',px,y-51,19);
  note=tr('Déplace A et repère sa position par rapport à zéro.','Move A and compare its position with zero.');
 }else if(mode==='angle'){
  const a=v.a*Math.PI/180,ox=250,oy=190,rayLength=135,rx=rayLength*Math.cos(a),ry=rayLength*Math.sin(a);g+=line(ox-10,oy,440,oy,navy,2.4)+line(ox,oy,ox+rx,oy-ry,coral,3)+dot(ox,oy)+text('O',ox-15,oy+27)+text('x',452,oy+4)+text('y',ox+rx+11,oy-ry-6)+`<path d="M${ox+53} ${oy} A53 53 0 ${a>Math.PI?'1':'0'} 0 ${ox+53*Math.cos(a)} ${oy-53*Math.sin(a)}" fill="none" stroke="${green}" stroke-width="3"/>`;
  note=tr('Un angle se mesure à partir d’un côté, autour de son sommet O.','Measure an angle by turning around its vertex O.');
 }else if(mode==='triangle'){
  const ax=100,ay=205,bx=425,by=205,cx=100+v.x*32,cy=207-v.h*20;
  g+=`<path d="M${ax} ${ay}L${bx} ${by}L${cx} ${cy}Z" fill="#f4f9fc" stroke="${navy}" stroke-width="2.4"/>`+dot(ax,ay)+dot(bx,by)+dot(cx,cy,6,coral)+text('A',ax-13,ay+24)+text('B',bx+13,by+24)+text('C',cx,cy-14)+line(cx,cy,cx,ay,'#8eabb9',1.2,'5 5');
  note=tr('Déplace C. Les trois côtés et les angles du triangle changent.','Move C. The three sides and angles of the triangle change.');
 }else if(mode==='symmetry'){
  const cy=130+(4-v.y)*16,x1=260-v.x*18,x2=260+v.x*18;g+=line(260,38,260,220,coral,2,'7 5')+text('(d)',275,34)+line(x1,cy,x2,cy,'#9db5c1',1,'5 5')+dot(x1,cy,6,navy)+dot(x2,cy,6,green)+text('A',x1-13,cy-10)+text("A′",x2+15,cy-10)+text('H',260,cy+20);g+=`<path d="M250 ${cy}v-11h10 M270 ${cy}v-11h-10" fill="none" stroke="#8197a7" stroke-width="1"/>`;
  note=tr('A et A′ restent à la même distance de l’axe (d).','A and A′ stay equally far from the reflection axis d.');
 }else if(mode==='lines'){
  const a=v.a*Math.PI/180,rayLength=65,dx=rayLength*Math.cos(a),dy=rayLength*Math.sin(a);
  g+=line(260-dx,100-dy,260+dx,100+dy,navy,2.7)+line(260-dx,175-dy,260+dx,175+dy,navy,2.7);
  g+=line(230,35,290,220,coral,1.5,'5 6')+text('(d)',440,100)+text('(e)',440,187);
  note=tr('Les droites (d) et (e) gardent la même direction : elles sont parallèles.','Lines d and e maintain the same direction: they are parallel.');
 }else if(mode==='groups'){
  const groups=v.g,each=v.u,box=420/groups,x0=50;for(let i=0;i<groups;i++){
   const bx=x0+i*box+3,by=58;g+=`<rect x="${bx}" y="${by}" rx="8" width="${box-8}" height="148" fill="#fff" stroke="${navy}" stroke-width="1.4"/>`;
   for(let j=0;j<each;j++){const cols=3,xx=bx+14+(j%cols)*(box-32)/cols,yy=90+Math.floor(j/cols)*31;g+=`<circle cx="${xx+5}" cy="${yy}" r="6.8" fill="${i%2?'#f0d8ac':'#aadad6'}" stroke="#3d5a70" stroke-width="1"/>`;}
   g+=text(String(i+1),bx+(box-8)/2,47,13);
  }
  note=tr('Compte les objets par groupe, puis observe la répétition des groupes.','Count objects in each group, then observe the repeated groups.');
 }else if(mode==='multiples'){
  const step=v.m,k=v.k,unit=420/(step*k+1);const x0=52,y=157;g+=line(52,y,469,y,navy,2);
  for(let i=0;i<=k*step;i++){const x=x0+i*unit;g+=line(x,y-5,x,y+7,'#7b98a7',1);if(i%step===0)g+=text(i,x,y+24,12);}
  for(let i=0;i<k;i++){const x1=x0+i*step*unit,x2=x0+(i+1)*step*unit;g+=`<path d="M${x1} ${y-12}Q${(x1+x2)/2} ${y-69} ${x2} ${y-12}" fill="none" stroke="${i%2?coral:green}" stroke-width="2.2"/>`;}
  note=tr('Chaque arc représente un bond du même pas sur la droite.','Each arc is a jump of equal size along the line.');
 }else if(mode==='percentage'){
  const total=Math.max(10,Math.min(100,v.t)),part=Math.max(0,Math.min(total,v.n));
  const cols=10,rows=Math.ceil(total/10),side=Math.min(18,150/rows);const left=260-5*side,top=115-rows*side/2;
  for(let i=0;i<total;i++){const x=left+(i%10)*side,y=top+Math.floor(i/10)*side;g+=`<rect x="${x}" y="${y}" width="${side}" height="${side}" fill="${i<part?'#a5d8cf':'#fff'}" stroke="#607e91" stroke-width="1.1"/>`;}
  g+=text(`${part} / ${total}`,260,226,19);
  note=tr('Une case représente un élève. Compare les cases coloriées à l’effectif total.','One tile represents one student. Compare shaded tiles with the total.');
 }else if(mode==='bars'){
  const vals=[v.a,v.b,v.c],names=['A','B','C'];g+=line(84,203,448,203,navy,2)+line(84,38,84,203,navy,2);for(let i=0;i<vals.length;i++){
   const h=vals[i]*14,x=132+i*105;g+=`<rect x="${x}" y="${203-h}" width="54" height="${h}" fill="${['#b3dbd7','#eacaa2','#bad5ea'][i]}" stroke="${navy}" stroke-width="1.4"/>`+text(names[i],x+27,225,15)+text(vals[i],x+27,193-h,15);
  }for(let n=0;n<=10;n+=2){let y=203-n*14;g+=line(77,y,84,y,'#7b93a0',1)+text(n,71,y+4,12,'end');}
  note=tr('Déplace les curseurs pour comparer visuellement les effectifs A, B et C.','Move the sliders to compare groups A, B and C.');
 }else if(mode==='clock'){
  const cx=260,cy=127,r=96;g+=`<circle cx="${cx}" cy="${cy}" r="${r}" stroke="${navy}" stroke-width="2.4" fill="#fff"/>`;
  for(let i=0;i<12;i++){const a=i*Math.PI/6-Math.PI/2;g+=line(cx+80*Math.cos(a),cy+80*Math.sin(a),cx+92*Math.cos(a),cy+92*Math.sin(a),navy,1.7);}
  const minute=(v.m/60*2*Math.PI-Math.PI/2),hour=((v.h+v.m/60)/12*2*Math.PI-Math.PI/2);
  g+=line(cx,cy,cx+77*Math.cos(minute),cy+77*Math.sin(minute),coral,3)+line(cx,cy,cx+55*Math.cos(hour),cy+55*Math.sin(hour),navy,4)+dot(cx,cy,5)+text('12',cx,52)+text('3',349,132)+text('6',cx,214)+text('9',170,132);
  note=tr('La petite aiguille indique les heures ; la grande indique les minutes.','The short hand shows hours; the long hand shows minutes.');
 }else if(mode==='ratio'){
  const n=v.n,p=v.p,x0=46,w=428/n;for(let i=0;i<n;i++){
   const x=x0+i*w+3;g+=`<rect x="${x}" y="58" width="${w-7}" height="145" fill="#f4f9fb" stroke="${navy}" stroke-width="1.2" rx="6"/>`;
   for(let j=0;j<p;j++){const px=x+12+(j%2)*(w-30)/2,py=84+Math.floor(j/2)*34;g+=dot(px,py,5.5,i%2?green:coral);}
  }
  note=tr('Quand le nombre d’articles augmente, les quantités augmentent de manière proportionnelle.','When the item count increases, the quantities increase proportionally.');
 }else if(mode==='placevalue'){
  const vals=[v.m,v.c,v.d,v.u],labels=tr(['Milliers','Centaines','Dizaines','Unités'],['Thousands','Hundreds','Tens','Ones']);
  for(let i=0;i<4;i++){
   const x=58+i*110;g+=`<rect x="${x}" y="45" width="108" height="166" fill="${i%2===0?'#f4fafc':'#fff'}" stroke="#758c9e" stroke-width="1.4"/>`+text(labels[i],x+54,65,14)+text(String(vals[i]),x+54,100,27);
   for(let j=0;j<vals[i];j++)g+=dot(x+25+(j%3)*29,125+Math.floor(j/3)*25,5.6,i===3?coral:green);
  }
  note=tr('Dans chaque colonne, un chiffre représente une valeur de position différente.','Each digit has a different place value depending on its column.');
 }else if(mode==='ruler'){
  g+=`<rect x="48" y="85" width="424" height="97" fill="#fbf6e9" stroke="${navy}" stroke-width="2"/>`;
  for(let i=0;i<=12;i++){const x=60+33.1*i;g+=line(x,85,x,85+(i%2?24:39),navy,i%2?1.3:1.8)+text(i,x,146,13);}
  g+=line(60,192,60+33.1*v.x,192,coral,5)+dot(60+33.1*v.x,192,5,coral);
  note=tr('La graduation zéro doit être alignée avec l’origine de la longueur mesurée.','Align the zero graduation with the start of the measured length.');
 }else if(mode==='measuring'){
  const y=215-v.x*15;g+=`<path d="M205 55V211Q205 220 222 220H302Q320 220 320 211V55" fill="none" stroke="${navy}" stroke-width="2.7"/>`;
  g+=`<path d="M208 ${y}H317V208Q317 218 300 218H224Q208 218 208 207Z" fill="#b6dff3" stroke="none"/>`;
  for(let i=0;i<=10;i++){const yy=215-i*15;g+=line(208,yy,228,yy,navy,1.2)+text(i,187,yy+5,13);}
  note=tr('Observe le niveau de liquide sur les graduations.','Read the liquid level against the graduations.');
 }
 const vector=`<svg xmlns="http://www.w3.org/2000/svg" class="vis-live-svg" viewBox="0 0 520 245" role="img" aria-label="${esc(tr('Schéma mathématique interactif','Interactive mathematical diagram'))}"><rect x="1" y="1" width="518" height="243" rx="8" fill="${paper}" stroke="#e0e8ed"/>${g}</svg>`;
 return {svg:vector,note};
}
function html(q,i){const mode=modeFor(q),cfg=config(mode,q);if(!cfg)return '';
 const values=Object.fromEntries(cfg.controls.map(c=>[c[0],c[4]]));if(mode==='fraction'&&values.n>values.d)values.n=values.d;if(mode==='percentage'&&values.n>values.t)values.n=values.t;
 const diagram=drawing(mode,values);
 const controls=cfg.controls.map(c=>{let [key,label,min,max,val,unit,step]=c;val=values[key];return `<label class="vis-control"><span class="vis-control-name">${esc(label)} <output data-lab-value="${key}">${esc(nfmt(val))}${unit?' '+unit:''}</output></span><input type="range" data-lab-axis="${key}" min="${min}" max="${max}" step="${step||1}" value="${val}" aria-label="${esc(label)}"><span class="vis-ends"><span>${min}${unit?' '+unit:''}</span><span>${max}${unit?' '+unit:''}</span></span></label>`;}).join('');
 return `<section class="vis-math-lab" data-lab-mode="${mode}" data-lab-index="${i}" aria-label="${esc(cfg.label)}"><div class="vis-lab-top"><div><span class="vis-lab-kicker">◈ ${esc(tr('VISUALISER LES MATHÉMATIQUES','VISUALIZE THE MATH'))}</span><h4>${esc(cfg.label)}</h4></div><span class="vis-lab-badge">${esc(tr('À manipuler','Interactive'))}</span></div><div class="vis-lab-layout"><div class="vis-lab-canvas">${diagram.svg}</div><div class="vis-lab-controls"><div class="vis-slider-grid">${controls}</div><button type="button" class="vis-lab-reset" data-vis-reset="1">↺ ${esc(tr('Recommencer la manipulation','Reset exploration'))}</button></div></div><p class="vis-lab-note" data-vis-note>${esc(diagram.note)}</p><p class="vis-lab-disclaimer">${esc(tr('Exploration interactive des propriétés ; pour mesurer une longueur réelle, utilisez la figure imprimée à 100 %. Cette manipulation ne révèle pas le corrigé.','Interactive exploration of properties; use the figure printed at 100% to measure physical lengths. This does not reveal the answer.'))}</p></section>`;
}
function update(lab){if(!lab)return;const mode=lab.dataset.labMode;const entries=[...lab.querySelectorAll('input[data-lab-axis]')];const v=Object.fromEntries(entries.map(x=>[x.dataset.labAxis,Number(x.value)]));if(mode==='fraction'&&v.n>v.d){v.n=v.d;const input=lab.querySelector('[data-lab-axis="n"]');if(input)input.value=v.n;}if(mode==='percentage'&&v.n>v.t){v.n=v.t;const input=lab.querySelector('[data-lab-axis="n"]');if(input)input.value=v.n;}
 for(const x of entries){const o=lab.querySelector(`[data-lab-value="${x.dataset.labAxis}"]`);if(o){const unit=mode==='circle'?'cm':mode==='square'?'cm':mode==='rectangle'?'cm':mode==='angle'?'°':mode==='clock'?(x.dataset.labAxis==='h'?'h':'min'):mode==='ruler'?'cm':mode==='measuring'?'L':'';o.textContent=nfmt(x.value)+(unit?' '+unit:'');}}
 const d=drawing(mode,v);const stage=lab.querySelector('.vis-lab-canvas');if(stage)stage.innerHTML=d.svg;const note=lab.querySelector('[data-vis-note]');if(note)note.textContent=d.note;
}
// Event delegation survives every app.js re-render without duplicate listeners.
document.addEventListener('input',e=>{if(!e.target.matches('input[data-lab-axis]'))return;update(e.target.closest('.vis-math-lab'));});
document.addEventListener('click',e=>{
 const tile=e.target.closest('[data-vis-part]');if(tile){const lab=tile.closest('.vis-math-lab');if(lab?.dataset.labMode==='fraction'){const val=+tile.dataset.visPart+1;const input=lab.querySelector('[data-lab-axis="n"]');if(input){input.value=input.valueAsNumber===val?val-1:val;update(lab);}}return;}
 const btn=e.target.closest('[data-vis-reset]');if(btn){const lab=btn.closest('.vis-math-lab');if(!lab)return;lab.querySelectorAll('input[data-lab-axis]').forEach(inp=>inp.value=inp.defaultValue);update(lab);}
});
window.MATH_INTERACTIVE_VISUALS={html,modeFor,config,drawing};
})();


