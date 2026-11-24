
/* ATELIER MATHS — independent lesson-presentation workspace (November 2026).
 * It adds a dedicated workspace without replacing the existing app, database,
 * school template, textbooks, or examination/worksheet PowerPoint export.
 * Offline drafts work locally; ChatGPT remains an optional external workflow.
 */
(function(){'use strict';
const KEY='atelier-maths-presentation-studio-v1';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const lang=()=>window.MATH_I18N?.getLanguage?.()||'fr';
const tr=(fr,en)=>lang()==='fr'?fr:en;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pick=(key)=>tr(...(WORDS[key]||[key,key]));
const WORDS={
nav:['Présentations PowerPoint','PowerPoint Presentations'],eyebrow:['STUDIO PÉDAGOGIQUE · NOUVEAU','EDUCATIONAL STUDIO · NEW'],title:['Présentations PowerPoint','PowerPoint Presentations'],sub:['Des leçons mathématiques visuelles, modifiables et adaptées à vos classes.','Visual, editable mathematics lessons tailored to your classes.'],
grade:['Classe','Grade'],chapter:['Chapitre Al-Ahlia','Al-Ahlia chapter'],lessons:['Notions à traiter','Topics to cover'],pages:['Pages du manuel (facultatif)','Textbook pages (optional)'],openbook:['Ouvrir le manuel sélectionné','Open selected textbook'], missing:['Le manuel de cette langue est indisponible. Vous pouvez l’ajouter dans la Bibliothèque.','The textbook for this language is unavailable. Add it in the Library.'], source:['Passage du manuel / notes de cours (recommandé pour l’IA)','Textbook excerpt / lesson notes (recommended for AI)'], sourceHint:['Les pages lisibles des manuels fournis sont indexées localement pour l’IA. Vous pouvez ajouter vos propres notes ou un extrait pour préciser la leçon.','Readable pages from the supplied textbooks are indexed locally for AI. You can add notes or a passage to focus the lesson.'],
chapterList:['Liste des chapitres Al-Ahlia','Al-Ahlia chapters'],chapterSearch:['Rechercher un chapitre…','Search chapters…'],chapterSelect:['Cochez un ou plusieurs chapitres, comme dans le Créateur d’examens.','Tick one or more chapters, as in the Examination Builder.'],chapterNumber:['rubriques disponibles','available sections'],
promptBtn:['Copier le prompt pour ChatGPT','Copy prompt for ChatGPT'],openChatGPT:['Ouvrir l’application ChatGPT','Open ChatGPT App'],openChatGPTTitle:['Ouvrir une nouvelle conversation dans l’application ChatGPT installée','Open a new chat in the installed ChatGPT desktop app'],webFallback:['L’application ne s’ouvre pas ? Utilisez ChatGPT sur le web.','App not opening? Use ChatGPT on the web.'],promptLabel:['Prompt prêt à copier dans ChatGPT','Prompt ready to paste into ChatGPT'],promptCopied:['Prompt copié. Collez-le dans ChatGPT pour obtenir une présentation visuelle.','Prompt copied. Paste it into ChatGPT for a visual presentation.'],promptManual:['La copie automatique est indisponible. Sélectionnez et copiez le prompt affiché.','Automatic clipboard access is unavailable. Select and copy the displayed prompt.'],referenceStyle:['Studio visuel · modèle de référence','Visual studio · reference style'],
slideCount:['Nombre de diapositives','Number of slides'],difficulty:['Niveau','Level'],duration:['Durée (min)','Duration (minutes)'],style:['Style visuel','Visual style'],extra:['Éléments à inclure','Include elements'],instructions:['Consignes supplémentaires','Additional instructions'],
mode:['Génération','Generation'],offline:['Créer un brouillon hors ligne','Create offline draft'],
work:['Atelier des diapositives','Slide workspace'],slides:['Diapositives','Slides'],preview:['Aperçu','Preview'],editor:['Modifier la diapositive','Edit slide'],noSlides:['Configurez une leçon et générez un brouillon pour commencer.','Configure a lesson and generate a draft to begin.'],
generate:['Créer un brouillon','Create draft'],generateAI:['Générer avec l’IA','Generate with AI'],export:['Télécharger le PowerPoint (.pptx)','Download PowerPoint (.pptx)'],save:['Enregistrer le projet','Save presentation'],load:['Charger','Load'], remove:['Supprimer','Delete'],
slideTitle:['Titre','Title'], slideBody:['Explication / étapes','Explanation / steps'], slideFormula:['Formule / calcul','Formula / calculation'], slideAnswer:['Réponse (cachée avant révélation)','Answer (hidden until reveal)'],slideNotes:['Notes de l’enseignant','Teacher notes'], slideVisual:['Modèle visuel','Visual model'],slideKind:['Type de diapositive','Slide type'],
up:['Monter','Move up'],down:['Descendre','Move down'],add:['Ajouter une diapositive','Add slide'],delete:['Supprimer la diapositive','Delete slide'],regenerate:['Régénérer cette diapositive avec l’IA','Regenerate this slide with AI'],
review:['Vérifiez les mathématiques et les exemples avant de présenter. Les objets et figures exportés sont modifiables. Les apparitions progressives utilisent des diapositives successives (pas d’animations PowerPoint natives).','Review calculations and examples before teaching. Exported text and shapes are editable. Progressive reveals use successive slides (not native PowerPoint animations).'],saved:['Projet enregistré localement sur cet ordinateur.','Presentation saved locally on this computer.'], deleted:['Projet supprimé.','Presentation deleted.'],
require:['La sélection du chapitre et du manuel est nécessaire.','Select a chapter and an available textbook.'],
needSource:['Pour cette notion, ajoutez un extrait du manuel. Aucun contenu de chapitre ne sera inventé.','For this topic, add a textbook excerpt. Chapter contents will not be invented.'],
retry:['La génération n’a pas réussi ; vos diapositives précédentes ont été conservées.','Generation failed; your previous slides were preserved.'],
lesson:['Leçon complète','Complete lesson'],concept:['Explication d’une notion','Concept explanation'],revision:['Révision','Revision'],problems:['Résolution de problèmes','Problem solving'],interactive:['Exercices interactifs','Interactive exercises'],geometry:['Géométrie et constructions','Geometry and constructions'],exam:['Préparation à l’examen','Exam preparation'],
initial:['Initiation','Introduction'],application:['Application','Application'],advanced:['Approfondissement','Advanced'],progressive:['Progressif','Progressive'],
masterclass:['Atelier Maths · style visuel de référence','Atelier Maths · reference visual style'],modern:['Moderne et coloré','Modern and colorful'],minimal:['Élégant et minimaliste','Elegant and minimal'],playful:['Interactif et ludique','Interactive and playful'],blackboard:['Tableau mathématique','Math board'],illustrated:['Illustrations et infographies','Illustrations and infographics'],
none:['Aucune','None'],light:['Légère','Light'],steps:['Explications progressives','Progressive explanations'],advancedAnimation:['Progression détaillée','Detailed progression'],
examples:['Exemples résolus','Worked examples'],practice:['Exercices d’application','Practice exercises'],context:['Problèmes contextualisés','Word problems'],geometryFigures:['Géométrie (Figures intégrées)','Geometry (Built-in Diagrams)'],geometricConstruction:['Construction géométrique','Geometric Construction'],questions:['Questions interactives','Interactive questions'],reveal:['Réponses progressivement','Reveal answers gradually'],summary:['Synthèse','Summary'],assessment:['Évaluation finale','Final check'],notes:['Notes pour l’enseignant','Teacher notes'],
}
const OPTS={difficulty:['initial','application','advanced','progressive'],style:['masterclass','modern','minimal','playful','blackboard','illustrated'],extra:['examples','practice','context','geometryFigures','geometricConstruction','questions','reveal','summary','assessment','notes']};
const categoryFor=u=>{
 const t=((u?.original||'')+' '+(u?.title||'')).toLowerCase();
 if(/fraction|numérateur|dénominateur/.test(t))return 'fraction';
 if(/cercle|circle|diamètre|radius|rayon/.test(t))return 'circle';
 if(/multipli|multiple/.test(t))return 'multiplication';
 if(/divis|division|quotient|pgcd|gcd|ppcm|lcm|prime/.test(t))return 'division';
 if(/aire|area|périmètre|perimeter|surface/.test(t))return 'area';
 if(/triang|angle|parallel|perpendic|rectangle|carré|square|droites|polygon|géométr|geometry|segment/.test(t))return 'geometry';
 if(/proportion|ratio|pourcentage|percent/.test(t))return 'ratio';
 if(/statistic|statistique/.test(t))return 'statistics';
 if(/décimal|decimal/.test(t))return 'decimal';
 if(/time|durée|temps/.test(t))return 'time';
 if(/puissance|power/.test(t))return 'powers';
 if(/symétrie|symmetry/.test(t))return 'symmetry';
 if(/équation|equation|algèbr|algebra|littéral|literal|factor/.test(t))return 'algebra';
 if(/integer|entier|relatif|negative/.test(t))return 'integers';
 return 'unknown';};
const PREP={fr:["Découvrons", "Observons", "Comprenons", "Propriété essentielle", "Exemple guidé", "Représentation visuelle", "Application", "À vous de jouer", "Vérification", "À retenir", "Problème de la vie courante", "Résolution", "Défi final"],en:["Discover", "Observe", "Understand", "Key rule", "Guided example", "Visual representation", "Apply", "Your turn", "Check", "Takeaways", "Everyday problem", "Solution", "Final challenge"]};
// Small verified mathematical patterns, independent of textbooks. NOT represented
// as transcriptions or page-specific instructions. Inputs are teacher-reviewed.
function scenario(cat){const fr=lang()==='fr';const dict={
 fraction:{rule:['Une fraction représente des parts égales d’une unité.','A fraction represents equal parts of one whole.'],formula:['3/4 : trois parts sur quatre parts égales.','3/4: three out of four equal parts.'],question:['Colorie 3 parts sur 4, puis écris la fraction.','Shade 3 out of 4 parts, then write the fraction.'],answer:['3/4','3/4'],example:['Sur 8 parts identiques, 6 parts coloriées représentent 6/8 = 3/4.','Six out of eight equal parts represent 6/8 = 3/4.'],visual:'fraction'},
 multiplication:{rule:['Multiplier, c’est additionner plusieurs groupes égaux.','Multiplication represents repeated equal groups.'],formula:['3 × 4 = 4 + 4 + 4 = 12','3 × 4 = 4 + 4 + 4 = 12'],question:['4 boîtes contiennent 3 crayons chacune. Combien de crayons ?','Four boxes contain 3 pencils each. How many pencils?'],answer:['4 × 3 = 12 crayons','4 × 3 = 12 pencils'],example:['3 rangées de 4 points forment un tableau de 12 points.','Three rows of four dots form an array of 12 dots.'],visual:'array'},
 division:{rule:['Diviser, c’est partager en parts égales ou former des groupes égaux.','Division means equal sharing or making equal groups.'],formula:['12 ÷ 3 = 4','12 ÷ 3 = 4'],question:['12 cahiers sont répartis également entre 3 élèves. Combien chacun en reçoit-il ?','Twelve notebooks are shared equally among 3 pupils. How many does each receive?'],answer:['4 cahiers par élève','4 notebooks per pupil'],example:['On forme 3 groupes de 4 objets. 3 × 4 = 12.','Make three groups of four objects. 3 × 4 = 12.'],visual:'array'},
 circle:{rule:['Le diamètre passe par le centre et mesure deux fois le rayon.','A diameter passes through the center and is twice the radius.'],formula:['d = 2 × r','d = 2 × r'],question:['Un cercle a un rayon de 4 cm. Quel est son diamètre ?','A circle has radius 4 cm. What is its diameter?'],answer:['d = 2 × 4 = 8 cm','d = 2 × 4 = 8 cm'],example:['Si r = 3 cm, alors d = 6 cm.','If r = 3 cm, then d = 6 cm.'],visual:'circle'},
 geometry:{rule:['Une figure est décrite par ses côtés, ses angles et ses propriétés.','A figure is described by its sides, angles and properties.'],formula:['Un angle droit mesure 90°.','A right angle measures 90°.'],question:['Trace deux droites perpendiculaires et indique leur angle.','Draw two perpendicular lines and label their angle.'],answer:['Elles forment un angle de 90°.','They form a 90° angle.'],example:['Deux droites perpendiculaires se coupent en formant quatre angles droits.','Perpendicular lines intersect to form four right angles.'],visual:'geometry'},
 area:{rule:['L’aire d’un rectangle est le produit de sa longueur par sa largeur.','A rectangle’s area is length multiplied by width.'],formula:['A = L × l','A = length × width'],question:['Calcule l’aire d’un rectangle de 6 cm sur 4 cm.','Find the area of a rectangle 6 cm by 4 cm.'],answer:['A = 6 × 4 = 24 cm²','A = 6 × 4 = 24 cm²'],example:['Un quadrillage de 6 colonnes et 4 rangées compte 24 carrés.','A grid with 6 columns and 4 rows contains 24 unit squares.'],visual:'grid'},
 ratio:{rule:['Deux grandeurs sont proportionnelles si elles sont liées par un coefficient constant.','Two quantities are proportional when related by a constant multiplier.'],formula:['2 → 6 ; 3 → 9 ; coefficient 3','2 → 6; 3 → 9; multiplier 3'],question:['Si 2 cahiers coûtent 6 €, combien coûtent 5 cahiers au même prix ?','If 2 notebooks cost €6, how much do 5 cost at the same unit price?'],answer:['5 × 3 = 15 €','5 × 3 = €15'],example:['Prix unitaire = 6 ÷ 2 = 3 €.','Unit price = €6 ÷ 2 = €3.'],visual:'bars'},
 decimal:{rule:['Les chiffres après la virgule indiquent les dixièmes, centièmes, etc.','Digits after the decimal point represent tenths, hundredths, and so on.'],formula:['2,35 = 2 + 3/10 + 5/100','2.35 = 2 + 3/10 + 5/100'],question:['Place 1,5 sur une droite graduée entre 1 et 2.','Place 1.5 on a number line between 1 and 2.'],answer:['1,5 est au milieu de 1 et 2.','1.5 is halfway between 1 and 2.'],example:['1,2 < 1,5 < 1,8','1.2 < 1.5 < 1.8'],visual:'numberline'},
 statistics:{rule:['On organise les données dans un tableau ou un diagramme.','Data can be organized in a table or chart.'],formula:['Effectif total = somme des effectifs.','Total frequency = sum of frequencies.'],question:['Une enquête donne 3, 5 et 2 réponses. Combien y a-t-il de réponses en tout ?','A survey gives 3, 5 and 2 responses. How many in total?'],answer:['3 + 5 + 2 = 10','3 + 5 + 2 = 10'],example:['Construisons un diagramme à barres de hauteurs 3, 5 et 2.','Build a bar chart with heights 3, 5 and 2.'],visual:'bars'},
 time:{rule:['Pour calculer une durée, on compare l’heure de début et l’heure de fin.','Elapsed time is the difference between start and end times.'],formula:['10 h 30 − 9 h 15 = 1 h 15','10:30 − 9:15 = 1 h 15 min'],question:['Une activité commence à 9 h 15 et finit à 10 h 30. Quelle est sa durée ?','An activity starts at 9:15 and ends at 10:30. How long does it last?'],answer:['1 h 15','1 h 15 min'],example:['De 9 h 15 à 10 h 15 : 1 h ; puis 15 min.','From 9:15 to 10:15: 1 hour; then 15 minutes.'],visual:'clock'},
 powers:{rule:['Une puissance abrège une multiplication répétée du même nombre.','A power abbreviates repeated multiplication of the same number.'],formula:['2³ = 2 × 2 × 2 = 8','2³ = 2 × 2 × 2 = 8'],question:['Calcule 3².','Calculate 3².'],answer:['3² = 3 × 3 = 9','3² = 3 × 3 = 9'],example:['4² = 4 × 4 = 16','4² = 4 × 4 = 16'],visual:'none'},
 symmetry:{rule:['Deux figures symétriques sont en miroir de part et d’autre d’un axe.','Reflection creates mirror images across a line of symmetry.'],formula:['Distance à l’axe conservée.','Distance from the mirror line is preserved.'],question:['Construis le symétrique d’un point situé à 2 cm de l’axe.','Reflect a point that is 2 cm from the mirror line.'],answer:['Le point symétrique se trouve à 2 cm de l’autre côté.','Its reflection lies 2 cm on the other side.'],example:['Le segment qui joint un point à son image est perpendiculaire à l’axe.','The segment joining a point to its image is perpendicular to the axis.'],visual:'symmetry'},
 algebra:{rule:['Une lettre représente une quantité inconnue ou variable.','A letter represents an unknown or variable quantity.'],formula:['x + 3 = 8 ⟹ x = 5','x + 3 = 8 → x = 5'],question:['Résous : x + 7 = 12.','Solve: x + 7 = 12.'],answer:['x = 5','x = 5'],example:['Pour isoler x, soustrais 3 aux deux membres.','To isolate x, subtract 3 from both sides.'],visual:'equation'},
 integers:{rule:['Sur la droite graduée, les nombres augmentent vers la droite.','Numbers increase as you move right on a number line.'],formula:['−2 < 0 < 3','−2 < 0 < 3'],question:['Place −2 et 3 sur une droite graduée.','Mark −2 and 3 on a number line.'],answer:['−2 est à gauche de 0, 3 à droite.','−2 is left of zero, 3 is right.'],example:['−3 + 5 = 2','−3 + 5 = 2'],visual:'numberline'}
}; const x=dict[cat];if(!x)return null;return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,Array.isArray(v)?v[fr?0:1]:v]));}
const defaults={grade:6,unitId:'',unitIds:[],topics:[],pages:'',count:12,difficulty:'progressive',duration:45,style:'masterclass',extra:[],instructions:'',source:'',title:'',slides:[],selected:0,id:'',sourceMode:'',updatedAt:0};
let state=Object.assign({},defaults), saved=[];
try{
 const pack=JSON.parse(localStorage.getItem(KEY)||'{}');
 if(Array.isArray(pack.saved))saved=pack.saved.filter(x=>x&&Array.isArray(x.slides)).slice(0,30);
 if(pack.current){
   state={...defaults,...pack.current};
   // One-time migration: previously ticked defaults must not carry over
   // to the teacher's new opt-in selection interface. Deliberate choices
   // made after this upgrade continue to persist normally.
   if(pack.current.pptChoicesUserControlled!==true){
     state.extra=[];state.unitIds=[];state.topics=[];
   }
 }
}catch{}
state.pptChoicesUserControlled=true;
if(!Array.isArray(state.extra))state.extra=[];
if(!Array.isArray(state.unitIds))state.unitIds=[];
if(!Array.isArray(state.topics))state.topics=[];
// PowerPoint chapter ticks are teacher-only and are never restored
// automatically from an earlier session (even if the local browser stored them).
state.unitIds=[];
state.topics=[];
state.pages='';
// Migrate older saved lessons without losing their previous selection.
if(Array.isArray(state.extra)&&state.extra.includes('constructions')){
 state.extra=[...new Set(state.extra.filter(x=>x!=='constructions').concat(['geometryFigures','geometricConstruction']))];
}
let active=false,busy=false,rememberedLanguage=lang(),promptDraft='';
const units=()=>window.MATH_DATA?.grades?.[state.grade]||[];
const currentUnit=()=>units().find(u=>u.id===state.unitId)||units()[0];
const unitLabel=u=>lang()==='en'?(u.original||u.title):u.title;
function topicLabel(u,topic,i){if(lang()==='fr')return topic.title;
 const translated=window.MATH_I18N?.translate?.(topic.title)||topic.title;
 if(translated!==topic.title&&!/[éèàùêîôç]/i.test(translated))return translated;
 if((u.topics||[]).length===1)return u.original||u.title;
 return 'Lesson part '+(i+1)+' · '+(u.original||'Mathematics');}

const output=(text,type='info')=>{const a=$('#ps-notice');if(a){a.textContent=text;a.className='ps-notice ps-'+type;}};
function store(){try{localStorage.setItem(KEY,JSON.stringify({current:state,saved:saved.slice(0,25)}));}catch{output(tr('Stockage local insuffisant. Exportez vos présentations.','Local storage is full. Export your presentations.'),'error');}}
function sel(k,options,extra=''){return `<select id="ps-${k}" ${extra}>${options.map(([v,t])=>`<option value="${esc(v)}" ${String(state[k])===String(v)?'selected':''}>${esc(t)}</option>`).join('')}</select>`}
function field(k,label,content,span=''){return `<label class="ps-field ${span}"><span>${label}</span>${content}</label>`}
function tabLabel(slide,i){return `${i+1}. ${slide.title||tr('Sans titre','Untitled')}`}
function addNavigation(){const old=$('.sidebar .nav-item[data-nav="projects"]');if(!old)return;let btn=$('[data-ppt-lesson-nav]');if(!btn){btn=document.createElement('button');btn.className='nav-item';btn.type='button';btn.dataset.pptLessonNav='1';old.insertAdjacentElement('afterend',btn);}btn.innerHTML=`<span class="nav-icon" aria-hidden="true">▣</span> ${pick('nav')}`;btn.classList.toggle('active',active);}
function view(){if(!active)return;if(!units().some(x=>x.id===state.unitId))chooseUnit();if(!Array.isArray(state.unitIds))state.unitIds=[];addNavigation();const main=$('#main');if(!main)return;const u=currentUnit(),books=window.MATH_BOOKS,book=books?.forUnit?.(u,lang());const l=lang();const selectedIds=Array.isArray(state.unitIds)?state.unitIds.filter(id=>units().some(u=>u.id===id)):[];
const list=units().map(x=>[x.id,`${window.MATH_CHAPTER_REF(x,l)} · ${unitLabel(x)}${state.grade===6?' · '+(l==='fr'?'Tome ':'Volume ')+x.volume:''}`]);
const chapterTiles=list.map(([id,label])=>`<label class="ps-chapter-tile check ${selectedIds.includes(id)?'selected':''}" data-pschapter-row><input type="checkbox" data-pschapter="${esc(id)}" ${selectedIds.includes(id)?'checked':''}><span>${esc(label)}</span></label>`).join('');
const topicItems=(u?.topics||[]).map((topic,i)=>`<label class="ps-topic"><input type="checkbox" data-pstopic="${i}" ${state.topics.includes(i)?'checked':''}>${esc(topicLabel(u,topic,i))}</label>`).join('');
const extra=OPTS.extra.map(k=>`<label class="ps-chk"><input type="checkbox" data-psextra="${k}" ${state.extra.includes(k)?'checked':''}><span>${pick(k)}</span></label>`).join('');
main.innerHTML=`<div class="ps-root" data-no-translate="true"><section class="ps-hero"><div><div class="ps-eyebrow">${pick('eyebrow')}</div><h1>${pick('title')}</h1><p>${pick('sub')}</p></div><div class="ps-hero-badge">▣ PPTX <span>16:9</span></div></section><div class="ps-layout"><section class="ps-panel ps-settings"><div class="ps-panel-title"><strong>${tr('Configurer une leçon','Configure a lesson')}</strong><div class="ps-header-tools"><button type="button" data-psact="prompt" class="ps-prompt-btn ps-prompt-top">⧉ ${pick('promptBtn')}</button><a class="ps-open-chatgpt ps-prompt-top" href="codex://threads/new" title="${pick('openChatGPTTitle')}">↗ ${pick('openChatGPT')}</a><span class="ps-step">01 / 02</span></div></div>
<div class="ps-fields">${field('grade',pick('grade'),sel('grade',[4,5,6,7].map(g=>[g,lang()==='fr'?`EB${g} · ${g}e année`:`Grade ${g}`])))}
<div class="ps-field ps-wide ps-chapter-browser"><div class="ps-chapter-title"><strong>${pick('chapterList')} · ${l==='fr'?'EB'+state.grade:'Grade '+state.grade}</strong><small>${selectedIds.length} / ${list.length} ${pick('chapterNumber')}</small></div><input type="search" id="ps-chapter-search" placeholder="${pick('chapterSearch')}" autocomplete="off" aria-label="${pick('chapterSearch')}"/><div class="ps-chapter-list" role="group" aria-label="${pick('chapterList')}">${chapterTiles||`<p class="ps-alert">${tr('Aucun chapitre vérifié disponible pour cette classe. Consultez les manuels dans la Bibliothèque.','No verified chapters are available for this grade. Check the textbooks in the Library.')}</p>`}</div><small>${tr('Aucun chapitre n’est coché automatiquement. Cochez vous-même uniquement les chapitres voulus.','No chapters are ticked automatically. You choose which chapters to tick.')}</small></div>
<div class="ps-field ps-wide"><span>${pick('lessons')}</span><div class="ps-topics">${topicItems||`<small>${tr('Aucune notion répertoriée','No listed topics')}</small>`}</div></div>
<div class="ps-source-line"><span>📚 ${esc(book?.title||'Al-Ahlia')}${u?' · '+(l==='fr'?'pages ':'pages ')+esc(u.page):''}</span><button type="button" data-psact="book">↗ ${pick('openbook')}</button></div>${book&&!book.available?`<p class="ps-alert">${pick('missing')}</p>`:''}
${field('pages',pick('pages'),`<input id="ps-pages" maxlength="35" value="${esc(state.pages)}" placeholder="${esc(u?.page||'')}"/>`,'ps-wide')}
${field('count',pick('slideCount'),sel('count',[[5,'5'],[8,'8'],[10,'10'],[12,'12'],[15,'15'],[20,'20'],[25,'25'],[30,'30']]))}
${field('difficulty',pick('difficulty'),sel('difficulty',OPTS.difficulty.map(k=>[k,pick(k)])))}
${field('duration',pick('duration'),`<input id="ps-duration" type="number" min="5" max="240" value="${Number(state.duration)||45}">`)}
${field('style',pick('style'),sel('style',OPTS.style.map(k=>[k,pick(k)])))}
<div class="ps-field ps-wide"><span>${pick('extra')}</span><small>${tr('Aucune option n’est présélectionnée. Cochez uniquement les éléments que vous souhaitez dans votre présentation.','No options are preselected. Tick only the elements you want in your presentation.')}</small><div class="ps-options">${extra}</div></div>
${field('source',pick('source'),`<textarea id="ps-source" rows="3" placeholder="${tr('Collez ici une définition, un extrait ou les points de la leçon.','Paste a definition, excerpt or lesson points.')}">${esc(state.source)}</textarea><small>${pick('sourceHint')}</small>`,'ps-wide')}
${field('instructions',pick('instructions'),`<textarea id="ps-instructions" rows="2">${esc(state.instructions)}</textarea>`,'ps-wide')}
</div><div class="ps-actions"><button type="button" class="ps-primary" data-psact="draft">✦ ${pick('offline')}</button><button type="button" class="ps-prompt-btn" data-psact="prompt">⧉ ${pick('promptBtn')}</button><a class="ps-open-chatgpt" href="codex://threads/new" title="${pick('openChatGPTTitle')}">↗ ${pick('openChatGPT')}</a></div><div class="ps-prompt-panel" id="ps-prompt-panel" ${promptDraft?'':'hidden'}><label for="ps-prompt-text">${pick('promptLabel')}</label><textarea readonly id="ps-prompt-text" rows="7">${esc(promptDraft)}</textarea><button type="button" data-psact="prompt" class="ps-small">⧉ ${pick('promptBtn')}</button><div class="ps-open-fallback"><a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">${pick('webFallback')}</a></div></div></section>
<section class="ps-panel ps-workspace"><div class="ps-panel-title"><strong>${pick('work')}</strong><span class="ps-step">02 / 02</span></div>
<div id="ps-notice" class="ps-notice" role="status">${pick('review')}</div>
${state.slides.length?`<div class="ps-slides-top"><span>${state.slides.length} ${pick('slides').toLowerCase()} · ${esc(state.sourceMode==='ai'?tr('Ancienne présentation','Earlier presentation'):tr('Brouillon vérifiable','Reviewable draft'))}</span><button data-psact="save" type="button" class="ps-small">▣ ${pick('save')}</button></div><div class="ps-slide-grid"><div class="ps-thumbs">${state.slides.map((s,i)=>`<button class="ps-thumb ${i===state.selected?'selected':''}" type="button" data-psslide="${i}"><b>${i+1}</b><span>${esc(s.title||'')}</span><small>${esc(s.kind||'')}</small></button>`).join('')}</div><div class="ps-slide-center"><div class="ps-visual" id="ps-visual"></div><div class="ps-preview-actions"><button data-psact="up">↑ ${pick('up')}</button><button data-psact="down">↓ ${pick('down')}</button><button data-psact="add">＋ ${pick('add')}</button><button data-psact="delete">× ${pick('delete')}</button></div><div class="ps-editor"><strong>${pick('editor')}</strong>${['title','body','formula','answer','notes'].map(k=>field(k,({title:pick('slideTitle'),body:pick('slideBody'),formula:pick('slideFormula'),answer:pick('slideAnswer'),notes:pick('slideNotes')})[k],`<textarea rows="${k==='body'?3:2}" data-psedit="${k}">${esc(state.slides[state.selected]?.[k]||'')}</textarea>`)).join('')}${field('visual',pick('slideVisual'),`<select data-psedit="visual">${['none','fraction','fractionCompare','circle','array','geometry','grid','bars','numberline','clock','equation','symmetry','groups','decomposition','calculation','algorithm','areaModel','challenge'].map(v=>`<option value="${v}" ${state.slides[state.selected]?.visual===v?'selected':''}>${esc(v)}</option>`).join('')}</select>`)}</div></div></div><div class="ps-export"><button type="button" data-psact="export" class="ps-primary">⇩ ${pick('export')}</button><button type="button" data-psact="save" class="ps-secondary">▣ ${pick('save')}</button></div>`:`<div class="ps-empty">▣<h3>${pick('noSlides')}</h3><p>${tr('Créez une présentation hors ligne ou utilisez le prompt ChatGPT.','Create an offline presentation or use the ChatGPT prompt.')}</p></div>`}
<div class="ps-saved"><strong>${tr('Mes présentations enregistrées','My saved presentations')}</strong>${saved.length?`<div>${saved.slice(0,10).map(v=>`<div class="ps-save-row"><span>${esc(v.title||tr('Leçon','Lesson'))} <small>EB${v.grade} · ${(v.slides||[]).length} ${tr('diapos','slides')}</small></span><button type="button" data-psload="${esc(v.id)}">${pick('load')}</button><button type="button" data-psremove="${esc(v.id)}">×</button></div>`).join('')}</div>`:`<p>${tr('Aucun projet enregistré.','No saved presentations yet.')}</p>`}</div></section></div></div>`;
 $('#crumb').textContent='ATELIER MATHS / '+pick('nav').toUpperCase();paintSlide();}
/* Reimagined slide canvas: each lesson step is a distinct, large-format math visualization. */
function studioSceneType(s,ix){
 if(ix===0||s.kind==='title')return 'cover';
 const k=String(s.kind||''),v=String(s.visual||'');
 if(k==='summary')return 'summary';
 if(k==='practice'||k==='challenge')return 'quiz';
 if(k==='solution')return 'solution';
 if(v==='areaModel')return 'area';
 if(v==='algorithm')return 'algorithm';
 if(v==='fractionCompare')return 'fractionCompare';
  if(v==='fraction')return ix%2?'fraction':'fractionCompare';
 if(v==='decomposition')return 'placevalue';
 if(v==='groups'||v==='array'||v==='grid')return ix%2?'array':'visual';
 if(v==='bars')return 'statistics';
 if(v==='circle'||v==='symmetry'||v==='geometry')return 'geometry';
 if(v==='numberline'||v==='clock')return 'timeline';
 if(k==='problem')return 'context';
 if(v==='calculation'||v==='equation')return 'steps';
 return ['spotlight','context','steps','visual'][ix%4];
}
function studioVisual(s){
 const m=s.model||{},v=s.visual,ef=(n)=>esc(n),n=(k,d)=>Number.isFinite(+m[k])?+m[k]:d;
 const to=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
 if(v==='groups'||v==='grid'||v==='array'){
  const r=to(Math.round(n('rows',4)),1,10),c=to(Math.round(n('cols',6)),1,12),filled=to(Math.round(n('filled',r*c)),0,r*c);
  return `<div class="psv-matrix" style="--col:${c}">${Array.from({length:r*c},(_,i)=>`<i class="${i<filled?'is-on':''}"></i>`).join('')}</div><div class="psv-diagram-label">${v==='grid'?`${filled} / ${r*c}`:`${r} × ${c} = ${r*c}`}</div>`;
 }
 if(v==='decomposition'){
  const parts=Array.isArray(m.parts)?m.parts:[10,3];return `<div class="psv-big-number">${ef(m.a||parts.reduce((a,b)=>+a+(+b||0),0))}</div><div class="psv-place-bars">${parts.map((p,i)=>`<span class="psv-segment p${i%3}" style="flex:${to(+p||0,1,100)}">${ef(p)}</span>`).join('')}</div><div class="psv-diagram-label">${ef(parts.join(' + '))}</div>`;
 }
 if(v==='areaModel'){
  const a=n('a',23),b=n('b',14),a10=Math.floor(a/10)*10||a,a1=a-a10,b10=Math.floor(b/10)*10||b,b1=b-b10;
  const arr=[[a10,b10],[a1,b10],[a10,b1],[a1,b1]], vals=arr.map(([j,k])=>j&&k?`${j} × ${k}<br><strong>${j*k}</strong>`:'');
  return `<div class="psv-area"><div class="psv-cell">${vals[0]}</div><div class="psv-cell">${vals[1]}</div><div class="psv-cell">${vals[2]}</div><div class="psv-cell">${vals[3]}</div></div><div class="psv-diagram-label">${a} × ${b} = ${a*b}</div>`;
 }
 if(v==='algorithm'){
  const a=n('a',23),b=n('b',14),stage=n('stage',3);return `<div class="psv-algorithm"><div>${a}</div><div>× ${b}</div><hr><div class="rose">${a*(b%10)}</div>${stage>=2?`<div class="teal">${a*(b-b%10)}</div>`:''}${stage>=3?`<hr><div class="purple">${a*b}</div>`:''}</div>`;
 }
 if(v==='fraction'){
  const d=to(Math.round(n('d',4)),2,16),nu=to(Math.round(n('n',1)),0,d);
  return `<div class="psv-fraction-bar">${Array.from({length:d},(_,i)=>`<i class="${i<nu?'filled':''}"></i>`).join('')}</div><div class="psv-big-number">${nu}/${d}</div>`;
 }
  if(v==='fractionCompare'){
   const fraction=(n,d)=>{d=to(Math.round(+d||4),2,16);n=to(Math.round(+n||0),0,d);return `<div class="psv-compare-row"><div class="psv-fraction-bar" style="--den:${d}">${Array.from({length:d},(_,i)=>`<i class="${i<n?'filled':''}"></i>`).join('')}</div><strong>${n}/${d}</strong></div>`;};
   const a=(+m.n||0)/(+m.d||1),b=(+m.n2||0)/(+m.d2||1);
   return `<div class="psv-compare">${fraction(m.n,m.d)}<div class="psv-big-number">${a===b?'=':a>b?'&gt;':'&lt;'}</div>${fraction(m.n2,m.d2)}</div>`;
  }
 if(v==='bars'){
  const a=Array.isArray(m.values)?m.values:[3,5,2,4],max=Math.max(...a,1);return `<div class="psv-bars">${a.map((v,i)=>`<span><i style="height:${Math.max(5,v/max*85)}%;--i:${i}"></i><b>${ef(v)}</b></span>`).join('')}</div>`;
 }
 if(v==='numberline'||v==='integers'){
  const min=n('min',-2),max=n('max',3);return `<div class="psv-numberline">${Array.from({length:7},(_,i)=>`<span>${ef(+(min+(max-min)*i/6).toFixed(1))}</span>`).join('')}</div>`;
 }
 if(v==='circle')return `<div class="psv-circle"><span class="psv-circle-line"></span><span class="psv-center">O</span></div><div class="psv-diagram-label">${m.radius?`r = ${ef(m.radius)} cm`:''}</div>`;
 if(v==='clock')return `<div class="psv-clock"><span></span><i></i></div><div class="psv-diagram-label">${String(n('hour',10)).padStart(2,'0')}:${String(n('minute',15)).padStart(2,'0')}</div>`;
 if(v==='symmetry')return '<div class="psv-symmetry"><i>A</i><span></span><b>A′</b></div>';
 if(v==='geometry')return '<div class="psv-rightangle"><i></i><b>90°</b></div>';
 if(v==='equation')return `<div class="psv-big-number">${ef(m.expression||s.formula||'')}</div>`;
 return `<div class="psv-formula-focus">${ef(s.formula||'')}</div>`;
}
function paintSlide(){
 const target=$('#ps-visual');if(!target||!state.slides?.length)return;
 const s=state.slides[state.selected],ix=state.selected,scene=studioSceneType(s,ix),l=lang(),en=l==='en';
 const E=x=>esc(x||''),title=E(s.title),body=E(s.body).replace(/\n/g,'<br>'),formula=E(s.formula).replace(/\n/g,'<br>');
 const dg=`<div class="psv-model">${studioVisual(s)}</div>`;
 const q=(enWord,frWord)=>en?enWord:frWord;
 const formatBox=(text,bg='lav')=>`<div class="psv-formula-box ${bg}">${text}</div>`;
 const header=`<div class="psv-head"><div><b>ATELIER</b> <strong>MATHS</strong></div><i>${en?'GRADE ':'EB'}${state.grade}</i></div><div class="psv-h1">${title}</div>`;
 let content='';
 if(scene==='cover'){
  content=`<div class="psv-cover-orb orb-one"></div><div class="psv-cover-orb orb-two"></div><div class="psv-cover-body"><span class="psv-pill">ATELIER MATHS · ${en?'GRADE ':'EB'}${state.grade}</span><h2>${title}</h2><p>${body}</p>${formatBox(formula,'cover')}</div><div class="psv-cover-figure">${dg}</div>`;
 }else if(scene==='visual'||scene==='array'){
  content=`${header}<div class="psv-two"><section class="psv-white psv-diagram-block">${dg}</section><section class="psv-lav psv-sidecard"><label>${q('LOOK AT THE MODEL','OBSERVE LE MODÈLE')}</label><p>${body}</p>${formatBox(formula,'white')}</section></div>`;
 }else if(scene==='placevalue'){
  content=`${header}<div class="psv-full psv-white"><p>${body}</p>${dg}${formatBox(formula)}</div>`;
 }else if(scene==='steps'){
  const lines=String(s.formula||'').split('\n').filter(Boolean);let parts=lines.length>1?lines:[s.formula||s.body];
  content=`${header}<div class="psv-full psv-white"><label>${q('STEP BY STEP','ÉTAPE PAR ÉTAPE')}</label><div class="psv-stepgrid">${parts.slice(0,3).map((v,i)=>`<div class="psv-step p${i}"><b>0${i+1}</b><strong>${E(v)}</strong></div>`).join('')}${parts.length===1?`<div class="psv-step p1"><strong>${body}</strong></div>`:''}</div></div>`;
 }else if(scene==='area'||scene==='algorithm'||scene==='geometry'||scene==='statistics'||scene==='timeline'){
  content=`${header}<div class="psv-two"><section class="psv-white psv-diagram-block">${dg}</section><section class="psv-lav psv-sidecard"><label>${scene==='area'?q('AREA MODEL','MODÈLE D’AIRE'):scene==='algorithm'?q('WRITTEN METHOD','TECHNIQUE OPÉRATOIRE'):q('VISUALIZE','VISUALISE')}</label><p>${body}</p>${formatBox(formula,'white')}</section></div>`;
 }else if(scene==='fraction'||scene==='fractionCompare'){
  content=`${header}<div class="psv-full psv-white psv-centered-card"><label>${q('EQUAL PARTS','PARTS ÉGALES')}</label>${dg}<p>${body}</p></div>`;
 }else if(scene==='quiz'){
  content=`${header}<div class="psv-quiz">${formatBox(formula,'quiz')}<div class="psv-white psv-quiz-bottom"><div><label>${q('YOUR TURN • THINK FIRST','À TOI DE JOUER • RÉFLÉCHIS')}</label><p>${body}</p></div>${Array.isArray(s.model?.choices)&&s.model.choices.length===4?`<div class="psv-choices">${s.model.choices.map((c,i)=>`<div><b>${'ABCD'[i]}</b>${E(c)}</div>`).join('')}</div>`:'<b>?</b>'}</div></div>`;
 }else if(scene==='solution'){
  const lines=String(s.formula||'').split('\n').filter(Boolean);
  content=`${header}<div class="psv-full psv-white"><label>${q('CHECK THE REASONING','VÉRIFIE LE RAISONNEMENT')}</label>${lines.length>1?`<div class="psv-stepgrid">${lines.slice(0,3).map((v,i)=>`<div class="psv-step p${i}"><b>0${i+1}</b><strong>${E(v)}</strong></div>`).join('')}</div>`:`<div class="psv-side-solution"><p>${body}</p>${formatBox(formula)}</div>`}<small>${q('CORRECT ANSWER','RÉPONSE CORRECTE')}</small></div>`;
 }else if(scene==='summary'){
  const steps=String(s.body||'').split(/\s*•\s*|[.;]\s+|\s{2,}/).map(x=>x.trim()).filter(Boolean).slice(0,3);while(steps.length<3)steps.push(q('Apply','J’applique'));
  content=`${header}<div class="psv-full psv-white"><label>${q('THREE THINGS TO REMEMBER','TROIS POINTS À RETENIR')}</label><div class="psv-stepgrid">${steps.map((x,i)=>`<div class="psv-step p${i}"><b>0${i+1}</b><strong>${E(x)}</strong></div>`).join('')}</div>${formatBox(formula,'navy')}</div>`;
 }else{
  content=`${header}<div class="psv-two"><section class="psv-white psv-sidecard"><p>${body}</p>${formatBox(formula)}</section><section class="psv-white psv-diagram-block">${dg}</section></div>`;
 }
 target.className=`ps-visual psv-canvas psv-${scene}`;
 target.innerHTML=`${content}<div class="psv-slide-number">${String(ix+1).padStart(2,'0')} / ${String(state.slides.length).padStart(2,'0')}</div>`;
}

function chooseUnit(){const u=currentUnit();if(u){state.unitId=u.id;state.unitIds=[];state.topics=[];state.pages='';}}
function buildTwoDigitMultiplication(){
 const fr=lang()==='fr',u=currentUnit();
 // This is an ORIGINAL verified 24 × 13 lesson, matching the user's previous design
 // reference. It does not purport to reproduce or quote an Al-Ahlia book page.
 const data=fr?[
 ['LA MULTIPLICATION À DEUX CHIFFRES','Je comprends • Je décompose • Je calcule','24 × 13 = 312','title','groups'],
 ['Multiplier, c’est compter des groupes égaux','4 groupes de 6 éléments donnent 24 éléments.','6 + 6 + 6 + 6 = 4 × 6 = 24','discovery','groups'],
 ['Un nouveau défi : 24 × 13','Une école prépare 13 lots de 24 cartes. Combien de cartes faut-il ?','24 × 13 = ?','problem','groups'],
 ['Je décompose 13 en 10 + 3','Je sépare les dizaines et les unités du multiplicateur.','13 = 10 + 3','decompose','decomposition'],
 ['Je calcule les deux produits','Je multiplie 24 par chaque partie de 13.','24 × 10 = 240\n24 × 3 = 72','calculation','calculation'],
 ['Un rectangle pour voir le calcul','Chaque zone du rectangle représente un produit.','200 + 40 + 60 + 12 = 312','area','areaModel'],
 ['La multiplication posée · étape 1','Je commence par les unités : 3 × 24.','24 × 3 = 72','algorithm','algorithm'],
 ['La multiplication posée · étape 2','Je multiplie ensuite par la dizaine : 10 × 24.','24 × 10 = 240','algorithm','algorithm'],
 ['La multiplication posée · étape 3','J’additionne les deux produits partiels.','72 + 240 = 312','solution','algorithm'],
 ['À toi de jouer !','Une classe prépare 14 lots de 32 cartes. Combien de cartes en tout ?','32 × 14 = ?','practice','challenge'],
 ['Correction guidée','32 × 10 = 320 ; 32 × 4 = 128. Puis 320 + 128 = 448.','32 × 14 = 448','solution','calculation'],
 ['Je retiens les 3 étapes','1. Je décompose.  2. Je calcule les produits.  3. J’additionne.','24 × 13 = 312','summary','decomposition']
 ]:[
 ['MULTIPLYING BY TWO-DIGIT NUMBERS','I understand • I decompose • I calculate','24 × 13 = 312','title','groups'],
 ['Multiplication means equal groups','Four groups of six objects make 24 objects.','6 + 6 + 6 + 6 = 4 × 6 = 24','discovery','groups'],
 ['A new challenge: 24 × 13','A school prepares 13 packs of 24 cards. How many cards in total?','24 × 13 = ?','problem','groups'],
 ['Split 13 into 10 + 3','Separate the multiplier into tens and ones.','13 = 10 + 3','decompose','decomposition'],
 ['Calculate the two products','Multiply 24 by each part of 13.','24 × 10 = 240\n24 × 3 = 72','calculation','calculation'],
 ['An area model makes it clear','Each part of the rectangle represents a product.','200 + 40 + 60 + 12 = 312','area','areaModel'],
 ['Column multiplication · step 1','Start with the ones: 3 × 24.','24 × 3 = 72','algorithm','algorithm'],
 ['Column multiplication · step 2','Now multiply by the ten: 10 × 24.','24 × 10 = 240','algorithm','algorithm'],
 ['Column multiplication · step 3','Add the two partial products.','72 + 240 = 312','solution','algorithm'],
 ['Your turn!','A class prepares 14 packs of 32 cards. How many cards are there?','32 × 14 = ?','practice','challenge'],
 ['Guided correction','32 × 10 = 320; 32 × 4 = 128. Then 320 + 128 = 448.','32 × 14 = 448','solution','calculation'],
 ['Remember the three steps','1. Split into tens and ones.  2. Multiply each part.  3. Add.','24 × 13 = 312','summary','decomposition']
 ];
 // Respect EXACT slide count, compact when fewer than 12, extend with new examples
 // rather than padding with identical filler slides when more than 12 are requested.
 let rows=data;
 if(state.count<data.length){const mandatory=[0,1,2,3,4,5,8,9,10,11];const inds=state.count<=5?[0,3,5,9,11].slice(0,state.count):Array.from({length:state.count},(_,i)=>Math.round(i*(data.length-1)/(state.count-1)));rows=[...new Set(inds)].map(i=>data[i]);while(rows.length<state.count)rows.push(data[rows.length]);}
 if(state.count>rows.length){rows=data.slice();const more=fr?[
 ['Entraînement : décomposer','Pour calculer 18 × 12, sépare 12 en 10 + 2.','18 × (10 + 2)','practice','calculation'],
 ['Je trouve les produits partiels','18 × 10 = 180 et 18 × 2 = 36.','180 + 36 = 216','solution','calculation'],
 ['Nouveau défi','Calcule 27 × 14 à l’aide de la décomposition.','27 × 14 = ?','practice','challenge'],
 ['Correction du défi','27 × 10 = 270 et 27 × 4 = 108.','270 + 108 = 378','solution','calculation'],
 ['Vérification','Vérifie l’ordre de grandeur avant de calculer.','24 × 13 ≈ 20 × 10 = 200','concept','calculation']
 ]:[
 ['Practice: split the multiplier','To calculate 18 × 12, split 12 into 10 + 2.','18 × (10 + 2)','practice','calculation'],
 ['Find the partial products','18 × 10 = 180 and 18 × 2 = 36.','180 + 36 = 216','solution','calculation'],
 ['Another challenge','Use decomposition to find 27 × 14.','27 × 14 = ?','practice','challenge'],
 ['Check the challenge','27 × 10 = 270 and 27 × 4 = 108.','270 + 108 = 378','solution','calculation'],
 ['Estimate your answer','Estimate a reasonable size before calculating.','24 × 13 ≈ 20 × 10 = 200','concept','calculation']
 ];let extraIndex=0;while(rows.length<state.count){rows.push(more[extraIndex%more.length]);extraIndex++;}}
 const slides=rows.map((r,i)=>({id:'visual-mult-'+i,title:r[0],body:r[1],formula:r[2],kind:r[3],visual:r[4],answer:r[3]==='practice'?(r[2].includes('32')?'448':'378'):'',notes:fr?'Exemple original : contrôler l’alignement avec le chapitre choisi.':'Original worked example: check correspondence to the selected chapter.',model:{a:24,b:13},source:u?.id}));
 state.slides=slides;state.slideLang=lang();state.selected=0;state.sourceMode='offline-visual-masterclass';state.title=slides[0].title;state.updatedAt=Date.now();store();view();output(tr('Leçon visuelle construite : version éditable inspirée de votre modèle précédent.','Visual lesson created: editable version inspired by your earlier reference.'),'ok');
}
/* SMART, CHAPTER-AWARE OFFLINE PRESENTATION PLANS.
   Curated original examples are deliberately DIFFERENT on each slide.
   Never call these textbook excerpts. Unsupported chapters require notes or AI.
*/
function smartFamily(u){
 const t=String((u?.original||'')+' '+(u?.title||'')).toLowerCase();
 if(/multipli.*d[ée]cimal|d[ée]cimal.*multipli|division.*d[ée]cimal|d[ée]cimal.*division/.test(t))return 'decimal';
 if(/divisibilit[ée]|crit[èe]re de divisibilit[ée]|multiples? \(|multiples?|nombres? premiers?|diviseurs?/.test(t))return 'multiples';
 if(/fraction|num[ée]rateur|d[ée]nominateur/.test(t))return 'fraction';
 if(/division|diviser|quotient|partage/.test(t))return 'division';
 if(/multiplication|multiplying|multiplier|product/.test(t))return 'multiplication';
 if(/proportion|pourcentage|percent|ratio|[ée]chelle/.test(t))return 'ratio';
 if(/statist|diagramme/.test(t))return 'statistics';
 if(/d[ée]cimaux|d[ée]cimal|decimal/.test(t))return 'decimal';
 if(/aire|area|surface|p[ée]rim[èe]tre|perimeter/.test(t))return 'area';
 if(/cercle|circle|diam[èe]tre|rayon|radius/.test(t))return 'circle';
 if(/sym[ée]trie|symmetry|translation/.test(t))return 'symmetry';
 if(/temps|dur[ée]e|time|clock/.test(t))return 'time';
 if(/[ée]quation|expression litt[ée]rale|algebra|factoris|factoriz/.test(t))return 'algebra';
 if(/angle|triangle|droite|line|polygon|geom|g[ée]om[ée]trie|rectangle|carr[ée]|square/.test(t))return 'geometry';
 return 'unknown';
}
function smartPlan(family,unit,variation=0){
 const fr=lang()==='fr',L=(f,e)=>fr?f:e;
 const s=(title,body,formula,kind,visual,model={},answer='')=>({id:'p-'+Math.random().toString(36).slice(2,10),title:L(...title),body:L(...body),formula:L(...formula),kind,visual,model,answer:L(...(Array.isArray(answer)?answer:[answer,answer])),notes:L('Exemple pédagogique original. Vérifier la progression du chapitre Al-Ahlia sélectionné.','Original educational example. Check the selected Al-Ahlia chapter progression.'),source:unit.id});
 const p=[];
 if(family==='multiplication'){
 const a=23+variation*2,b=14; const a10=Math.floor(a/10)*10,a1=a%10,b10=10,b1=b-10;
 const total=a*b,partial1=a*b10,partial2=a*b1;
 p.push(
 s(['LA MULTIPLICATION À DEUX CHIFFRES','TWO-DIGIT MULTIPLICATION'],['Des groupes, des rectangles et une technique qui ont le même sens.','Equal groups, area models and the written method tell one mathematical story.'],['3 × 5 = 15','3 × 5 = 15'],'title','array',{rows:3,cols:5}),
 s(['Des paquets bien organisés','Make equal groups'],['Cinq paquets contiennent chacun sept jetons ; observe le total.','Five packets contain seven counters each; study the total.'],['5 × 7 = 35','5 × 7 = 35'],'discovery','groups',{rows:5,cols:7}),
 s(['La commande de la bibliothèque','The library order'],[`Une école commande ${b} lots de ${a} marque-pages. Combien de marque-pages faut-il ?`, `A school orders ${b} packs of ${a} bookmarks. How many bookmarks are needed?`],[`${b} × ${a} = ?`,`${b} × ${a} = ?`],'problem','challenge',{a,b},[`${total}`,`${total}`]),
 s(['Une dizaine et des unités','Tens and ones'],[`Je décompose ${b} en 10 + ${b1}.`, `Split ${b} into 10 + ${b1}.`],[`${b} = ${b10} + ${b1}`,`${b} = ${b10} + ${b1}`],'decompose','decomposition',{a:b,parts:[b10,b1]}),
 s(['Deux produits, pas un seul','Two partial products'],[`Je multiplie ${a} par chacune des deux parties.`, `Multiply ${a} by each part.`],[`${a} × ${b10} = ${partial1}\n${a} × ${b1} = ${partial2}`,`${a} × ${b10} = ${partial1}\n${a} × ${b1} = ${partial2}`],'calculation','calculation',{a,b}),
 s(['Le rectangle révèle 4 produits','Four rectangles reveal the result'],['On décompose les DEUX facteurs en dizaines et unités.','Split BOTH factors into tens and ones.'],[`${a10*b10} + ${a1*b10} + ${a10*b1} + ${a1*b1} = ${total}`,`${a10*b10} + ${a1*b10} + ${a10*b1} + ${a1*b1} = ${total}`],'visual','areaModel',{a,b}),
 s(['Je pose la multiplication : unités','Written multiplication: ones'],[`Je calcule ${a} × ${b1}.`, `Calculate ${a} × ${b1}.`],[`${a} × ${b1} = ${partial2}`,`${a} × ${b1} = ${partial2}`],'algorithm','algorithm',{a,b,stage:1}),
 s(['Puis je multiplie par 10','Next, multiply by ten'],[`Le chiffre ${Math.floor(b/10)} représente ${b10} unités.`, `The digit ${Math.floor(b/10)} means ${b10} ones.`],[`${a} × ${b10} = ${partial1}`,`${a} × ${b10} = ${partial1}`],'algorithm','algorithm',{a,b,stage:2}),
 s(['J’additionne les produits partiels','Add the partial products'],['Je vérifie le calcul à l’aide du rectangle.','Compare your sum with the area model.'],[`${partial1} + ${partial2} = ${total}`,`${partial1} + ${partial2} = ${total}`],'solution','algorithm',{a,b,stage:3}),
 s(['À toi de choisir la bonne stratégie','Choose your strategy'],['Trouve 32 × 15. Utilise un rectangle ou la multiplication posée.','Find 32 × 15 using an area model or the written method.'],['32 × 15 = ?','32 × 15 = ?'],'practice','challenge',{a:32,b:15,choices:['480','450','510','520']},['480','480']),
 s(['Une correction expliquée','Check your working'],['Je calcule deux produits et je les additionne.','Calculate the two partial products, then add.'],['32 × 10 = 320\n32 × 5 = 160\n320 + 160 = 480','32 × 10 = 320\n32 × 5 = 160\n320 + 160 = 480'],'solution','calculation',{a:32,b:15},['480','480']),
 s(['Deuxième défi : billets de spectacle','Another challenge: event tickets'],['12 rangées comportent 41 sièges chacune. Combien de sièges ?','There are 12 rows of 41 seats each. How many seats?'],['41 × 12 = ?','41 × 12 = ?'],'problem','array',{rows:4,cols:6},['492','492']),
 s(['Vérification avec la distributivité','Verify using the distributive property'],['Je sépare 12 en 10 + 2.','Split 12 into 10 + 2.'],['41 × 10 = 410\n41 × 2 = 82\n410 + 82 = 492','41 × 10 = 410\n41 × 2 = 82\n410 + 82 = 492'],'solution','calculation',{a:41,b:12},['492','492']),
 s(['Les trois outils à retenir','Three ways to explain multiplication'],['Groupes égaux • décomposition • rectangle et calcul posé.','Equal groups • place value • area model and written method.'],['23 × 14 = 322','23 × 14 = 322'],'summary','areaModel',{a:23,b:14}));
 }
 else if(family==='fraction')p.push(
 s(['LES FRACTIONS PRENNENT FORME','FRACTIONS YOU CAN SEE'],['Une même quantité peut se représenter de plusieurs façons.','The same amount can be represented in different ways.'],['1/2 = 2/4','1/2 = 2/4'],'title','fraction',{n:2,d:4}),
 s(['Le chocolat est partagé','Sharing chocolate'],['Une tablette est partagée en quatre parties égales. On en choisit une.','A chocolate bar has four equal pieces. One is selected.'],['1/4','1/4'],'discovery','fraction',{n:1,d:4}),
 s(['Colorions trois parts sur huit','Shade three out of eight'],['Toutes les parts doivent avoir la même taille.','All eight pieces must be equal.'],['3/8','3/8'],'visual','fraction',{n:3,d:8}),
 s(['Deux nombres, deux rôles','Numerator and denominator'],['Le dénominateur indique le nombre total de parts égales ; le numérateur indique les parts choisies.','The denominator counts equal parts; the numerator counts selected parts.'],['3/5','3/5'],'concept','fraction',{n:3,d:5}),
 s(['Deux fractions égales','Two names for one amount'],['Une demi-tablette équivaut à deux quarts.','One half is the same amount as two quarters.'],['1/2 = 2/4','1/2 = 2/4'],'visual','fractionCompare',{n:1,d:2,n2:2,d2:4}),
 s(['Plaçons 3/4 sur une droite','Locate three quarters'],['Découpe l’intervalle de 0 à 1 en quatre segments égaux.','Divide the interval from 0 to 1 into four equal segments.'],['0 < 3/4 < 1','0 < 3/4 < 1'],'visual','numberline',{min:0,max:1,step:.25,marker:.75}),
 s(['Des fractions que l’on additionne','Add like denominators'],['En regroupant un quart et deux quarts, on obtient trois quarts.','Combine one quarter with two quarters.'],['1/4 + 2/4 = 3/4','1/4 + 2/4 = 3/4'],'calculation','fraction',{n:3,d:4}),
 s(['Une fraction de la collection','A fraction of a collection'],['Un club possède 24 badges. Il distribue 3/8 de ses badges. Combien en distribue-t-il ?','A club has 24 badges and gives away 3/8 of them. How many?'],['(24 ÷ 8) × 3 = ?','(24 ÷ 8) × 3 = ?'],'problem','groups',{rows:3,cols:8},['9','9']),
 s(['Je calcule les badges distribués','Work out the distributed badges'],['Je trouve un huitième, puis trois huitièmes.','Find one eighth, then three eighths.'],['24 ÷ 8 = 3\n3 × 3 = 9','24 ÷ 8 = 3\n3 × 3 = 9'],'solution','calculation',{},['9','9']),
 s(['Mini-défi : quelle fraction ?','Quick challenge: which fraction?'],['Colorie cinq parts d’une figure divisée en six parts égales.','Shade five parts of a shape divided into six equal pieces.'],['? / 6','? / 6'],'practice','fraction',{n:5,d:6},['5/6','5/6']),
 s(['L’image donne la solution','The diagram gives the answer'],['Cinq parties colorées sur six parties égales.','Five shaded parts out of six equal parts.'],['5/6','5/6'],'solution','fraction',{n:5,d:6},['5/6','5/6']),
 s(['Comparons deux fractions','Which fraction is greater?'],['Compare 3/4 et 2/3 en utilisant des douzièmes.','Compare 3/4 and 2/3 using twelfths.'],['3/4 ? 2/3','3/4 ? 2/3'],'challenge','fraction',{n:3,d:4},['3/4 > 2/3','3/4 > 2/3']),
 s(['La comparaison expliquée','Explain the comparison'],['Je transforme les deux fractions en fractions de dénominateur 12.','Write both fractions with denominator 12.'],['3/4 = 9/12\n2/3 = 8/12\n9/12 > 8/12','3/4 = 9/12\n2/3 = 8/12\n9/12 > 8/12'],'solution','fractionCompare',{n:3,d:4,n2:2,d2:3},['3/4 > 2/3','3/4 > 2/3']),
 s(['Les fractions en trois images','Fractions in three pictures'],['Partager équitablement • représenter • comparer.','Equal parts • representations • comparison.'],['1/2 = 2/4','1/2 = 2/4'],'summary','fraction',{n:2,d:4}));
 else if(family==='division')p.push(
 s(['LA DIVISION : PARTAGER ET REGROUPER','DIVISION: SHARING AND GROUPING'],['Nous allons chercher le nombre de groupes et la taille de chaque groupe.','We will explore how many equal groups can be made.'],['48 ÷ 6 = 8','48 ÷ 6 = 8'],'title','groups',{rows:6,cols:8}),
 s(['24 billes pour 4 équipes','24 marbles for four teams'],['Chaque équipe reçoit autant de billes.','Each team receives the same number of marbles.'],['24 ÷ 4 = ?','24 ÷ 4 = ?'],'discovery','groups',{rows:4,cols:6},['6','6']),
 s(['Je compte les parts','Count each equal share'],['Les 24 billes forment 4 groupes de 6.','Twenty-four marbles form four groups of six.'],['4 × 6 = 24\n24 ÷ 4 = 6','4 × 6 = 24\n24 ÷ 4 = 6'],'solution','groups',{rows:4,cols:6}),
 s(['Division et multiplication se répondent','Division reverses multiplication'],['Une famille d’opérations contient trois nombres liés.','A fact family connects three numbers.'],['7 × 8 = 56\n56 ÷ 7 = 8','7 × 8 = 56\n56 ÷ 7 = 8'],'concept','array',{rows:7,cols:8}),
 s(['Tout ne se partage pas exactement','Not every share is exact'],['27 crayons pour 4 trousses : chaque trousse reçoit 6 crayons, et 3 restent.','Share 27 pencils among four cases: six in each, with three left.'],['27 = 4 × 6 + 3','27 = 4 × 6 + 3'],'visual','groups',{rows:4,cols:6}),
 s(['Un calcul plus grand : 96 ÷ 12','A larger division: 96 ÷ 12'],['Je cherche combien de fois 12 donne 96.','How many groups of 12 make 96?'],['12 × 8 = 96','12 × 8 = 96'],'calculation','calculation',{}),
 s(['Décomposer 84 en deux groupes','Split 84 into two parts'],['On peut calculer 84 ÷ 7 en partageant 70 et 14.','Divide 84 by 7 by splitting 84 into 70 and 14.'],['(70 + 14) ÷ 7 = 10 + 2 = 12','(70 + 14) ÷ 7 = 10 + 2 = 12'],'visual','decomposition',{a:84,parts:[70,14]}),
 s(['Un problème de bibliothèque','A library word problem'],['75 étiquettes sont réparties dans 5 boîtes identiques. Combien par boîte ?','Seventy-five labels are shared equally among five boxes. How many in each?'],['75 ÷ 5 = ?','75 ÷ 5 = ?'],'problem','challenge',{},['15','15']),
 s(['La correction avec une vérification','Check with multiplication'],['Je vérifie que mon quotient redonne le nombre de départ.','Multiply your quotient to check.'],['75 ÷ 5 = 15\n15 × 5 = 75','75 ÷ 5 = 15\n15 × 5 = 75'],'solution','calculation',{},['15','15']),
 s(['À toi : 132 ÷ 11','Your turn: 132 ÷ 11'],['Trouve le quotient et explique ta méthode.','Find the quotient and explain the method.'],['132 ÷ 11 = ?','132 ÷ 11 = ?'],'practice','challenge',{},['12','12']),
 s(['Pourquoi le quotient est 12','Why the quotient is 12'],['Le résultat vérifié donne le dividende initial.','Check the result against the dividend.'],['11 × 12 = 132','11 × 12 = 132'],'solution','calculation',{},['12','12']),
 s(['Le sens de la division','Division in one picture'],['Partager ou grouper équitablement ; vérifier par multiplication.','Share or group equally; check by multiplying.'],['Dividende = diviseur × quotient + reste','Dividend = divisor × quotient + remainder'],'summary','groups',{rows:4,cols:6}));
 else if(family==='multiples')p.push(
 s(['LES MULTIPLES ET LES DIVISEURS','MULTIPLES AND DIVISORS'],['Distinguer une liste de multiples et une règle de divisibilité.','Explore multiples and divisibility rules.'],['6 × 4 = 24','6 × 4 = 24'],'title','array',{rows:4,cols:6}),
 s(['Comptons de six en six','Count in sixes'],['Avec six jetons par groupe, le total augmente régulièrement.','Every new group adds six counters.'],['6, 12, 18, 24, 30','6, 12, 18, 24, 30'],'discovery','groups',{rows:4,cols:6}),
 s(['Une propriété à observer','A property to investigate'],['24 est un multiple de 6 car 24 = 6 × 4.','24 is a multiple of 6 because 24 = 6 × 4.'],['24 ÷ 6 = 4','24 ÷ 6 = 4'],'concept','array',{rows:4,cols:6}),
 s(['Pairs et impairs','Even and odd numbers'],['Un nombre entier naturel est divisible par 2 si son dernier chiffre est pair.','A whole number is divisible by 2 when its last digit is even.'],['18, 42, 106 → pairs','18, 42, 106 → even'],'visual','calculation'),
 s(['Le test de 5 et de 10','Tests for 5 and 10'],['Observe les chiffres des unités de 35, 120 et 47.','Inspect the last digits of 35, 120 and 47.'],['35 ÷ 5 = 7\n120 ÷ 10 = 12','35 ÷ 5 = 7\n120 ÷ 10 = 12'],'calculation','calculation'),
 s(['La somme des chiffres compte','Digit sums matter'],['Un entier est divisible par 3 lorsque la somme de ses chiffres est divisible par 3.','An integer is divisible by 3 if its digit sum is divisible by 3.'],['234 → 2 + 3 + 4 = 9','234 → 2 + 3 + 4 = 9'],'visual','decomposition',{a:9,parts:[2,3,4]}),
 s(['Choisis le bon ensemble','Choose the correct set'],['Parmi 18, 25 et 33, quels nombres sont multiples de 3 ?','Which of 18, 25 and 33 are multiples of 3?'],['18 ; 25 ; 33','18; 25; 33'],'practice','challenge',{},['18 et 33','18 and 33']),
 s(['Vérifions le défi','Verify the challenge'],['Le total des chiffres est divisible par 3 pour 18 et 33.','The digit sums for 18 and 33 are divisible by 3.'],['1+8 = 9\n3+3 = 6','1+8 = 9\n3+3 = 6'],'solution','calculation'),
 s(['Un jeu de paquets identiques','Packaging challenge'],['Peut-on répartir 42 cartes en 6 paquets identiques sans reste ?','Can 42 cards be put into six equal packs without a remainder?'],['42 ÷ 6 = ?','42 ÷ 6 = ?'],'problem','groups',{rows:6,cols:7},['7','7']),
 s(['On contrôle avec la multiplication','Check using multiplication'],['Chaque paquet contient 7 cartes.','Each pack contains 7 cards.'],['6 × 7 = 42','6 × 7 = 42'],'solution','array',{rows:6,cols:7}),
 s(['Défi final : 147','Final challenge: 147'],['Le nombre 147 est-il divisible par 3 ? Justifie.','Is 147 divisible by 3? Explain.'],['1 + 4 + 7 = ?','1 + 4 + 7 = ?'],'challenge','challenge',{},['Oui, somme 12.','Yes, digit sum 12.']),
 s(['Explication du défi','Challenge explained'],['La somme des chiffres vaut 12, multiple de 3.','The digit sum is 12, a multiple of 3.'],['147 ÷ 3 = 49','147 ÷ 3 = 49'],'solution','calculation'),
 s(['Je retiens la méthode','Remember the method'],['Observer • calculer • vérifier une propriété.','Observe • calculate • check a property.'],['24 = 6 × 4','24 = 6 × 4'],'summary','array',{rows:4,cols:6}));
 else if(family==='decimal')p.push(
 s(['LES DÉCIMAUX EN IMAGES','DECIMALS IN PICTURES'],['Relions les fractions décimales, la droite graduée et le calcul.','Connect place value, number lines and calculations.'],['1,25 = 1 + 0,2 + 0,05','1.25 = 1 + 0.2 + 0.05'],'title','grid',{rows:10,cols:10,filled:25}),
 s(['Un carré partagé en cent','A hundred-square grid'],['25 petites cases sur 100 représentent 0,25.','Twenty-five squares out of 100 represent 0.25.'],['25/100 = 0,25','25/100 = 0.25'],'discovery','grid',{rows:10,cols:10,filled:25}),
 s(['Dixièmes et centièmes','Tenths and hundredths'],['Un dixième correspond à dix centièmes.','One tenth equals ten hundredths.'],['0,1 = 0,10','0.1 = 0.10'],'concept','grid',{rows:10,cols:10,filled:10}),
 s(['Les chiffres ont une place','Every digit has a place'],['Dans 3,47 : 3 unités, 4 dixièmes et 7 centièmes.','In 3.47 there are 3 ones, 4 tenths and 7 hundredths.'],['3,47 = 3 + 4/10 + 7/100','3.47 = 3 + 4/10 + 7/100'],'visual','decomposition',{a:47,parts:[40,7]}),
 s(['Entre 1 et 2','Between one and two'],['Place le nombre 1,5 au milieu de l’intervalle.','Place 1.5 halfway between one and two.'],['1 < 1,5 < 2','1 < 1.5 < 2'],'visual','numberline',{min:1,max:2,step:.1,marker:1.5}),
 s(['Quel nombre est le plus grand ?','Which number is larger?'],['Compare 2,08 et 2,8 en alignant les dixièmes et les centièmes.','Compare 2.08 and 2.8 by aligning place values.'],['2,08 < 2,80','2.08 < 2.80'],'calculation','calculation'),
 s(['On additionne par colonnes','Align before adding'],['Place les virgules sur la même colonne.','Line up decimal points.'],['3,25 + 1,40 = 4,65','3.25 + 1.40 = 4.65'],'visual','calculation'),
 s(['Au marché','At the market'],['Un article coûte 2,75 € et un autre 1,60 €. Calcule le total.','One item costs €2.75 and another €1.60. Find the total.'],['2,75 + 1,60 = ?','2.75 + 1.60 = ?'],'problem','challenge',{},['4,35 €','€4.35']),
 s(['Corrige le ticket de caisse','Check the receipt'],['On additionne les centièmes, puis les dixièmes et unités.','Add hundredths, tenths and ones.'],['2,75 + 1,60 = 4,35','2.75 + 1.60 = 4.35'],'solution','calculation'),
 s(['Petit défi sur la droite','Quick number-line challenge'],['Place 0,75 sur l’intervalle [0 ; 1].','Mark 0.75 between 0 and 1.'],['0,75 = 3/4','0.75 = 3/4'],'practice','numberline',{min:0,max:1,step:.25,marker:.75},['0,75','0.75']),
 s(['Une autre façon de le voir','Show three quarters in a grid'],['75 cases sur 100 correspondent à 0,75.','Seventy-five squares out of 100 are 0.75.'],['75/100 = 0,75','75/100 = 0.75'],'solution','grid',{rows:10,cols:10,filled:75}),
 s(['La règle visuelle','A visual reminder'],['Le chiffre et sa position donnent la valeur.','The value of a digit depends on its position.'],['0,3 = 3/10 = 30/100','0.3 = 3/10 = 30/100'],'summary','grid',{rows:10,cols:10,filled:30}));
 else if(family==='circle')p.push(
 s(['LE CERCLE : RAYON ET DIAMÈTRE','CIRCLES: RADIUS AND DIAMETER'],['Un centre, des points, deux longueurs à comparer.','One center, many points, two measurements to compare.'],['d = 2 × r','d = 2 × r'],'title','circle',{radius:3}),
 s(['Un compas et un point O','A compass and center O'],['Choisis un centre O et trace un cercle de rayon 3 cm.','Choose center O and draw a circle of radius 3 cm.'],['r = 3 cm','r = 3 cm'],'discovery','circle',{radius:3}),
 s(['Le rayon : du centre au bord','The radius: center to circumference'],['Tout rayon de ce cercle mesure 3 cm.','Every radius in this circle measures 3 cm.'],['OA = OB = 3 cm','OA = OB = 3 cm'],'concept','circle',{radius:3}),
 s(['Le diamètre traverse le centre','A diameter goes through the center'],['Un diamètre est formé de deux rayons alignés.','A diameter consists of two radii in a straight line.'],['d = 2 × 3 = 6 cm','d = 2 × 3 = 6 cm'],'visual','circle',{radius:3}),
 s(['Changeons de rayon','Try another radius'],['Lorsque le rayon vaut 5 cm, que vaut le diamètre ?','If the radius is 5 cm, what is the diameter?'],['d = 2 × 5 = ?','d = 2 × 5 = ?'],'practice','circle',{radius:5},['10 cm','10 cm']),
 s(['Vérifions notre réponse','Check the diameter'],['Le diamètre est le double du rayon.','The diameter is twice the radius.'],['d = 10 cm','d = 10 cm'],'solution','calculation'),
 s(['Construisons un nouveau cercle','Draw another circle'],['Marque un point A à 4 cm de O et trace le cercle.','Mark A four centimeters from O and draw the circle.'],['OA = 4 cm','OA = 4 cm'],'visual','circle',{radius:4}),
 s(['Un problème de jardin','A garden problem'],['Un bassin circulaire a un diamètre de 12 m. Quel est son rayon ?','A circular pond has a diameter of 12 m. What is its radius?'],['r = 12 ÷ 2 = ?','r = 12 ÷ 2 = ?'],'problem','challenge',{},['6 m','6 m']),
 s(['Du diamètre au rayon','Find the radius'],['Je divise le diamètre par deux.','Divide the diameter by two.'],['12 ÷ 2 = 6 m','12 ÷ 2 = 6 m'],'solution','calculation'),
 s(['Deux points à relier','Connect two points'],['Construis un segment qui relie deux points du cercle et passe par O.','Connect two points on the circle with a line passing through O.'],['[AB] : diamètre','[AB]: diameter'],'visual','circle',{radius:4}),
 s(['Dernière question','Final question'],['Le rayon est 7 cm. Le diamètre est-il 14 cm ? Justifie.','The radius is 7 cm. Is the diameter 14 cm? Explain.'],['7 × 2 = ?','7 × 2 = ?'],'challenge','circle',{radius:7},['14 cm','14 cm']),
 s(['Rayon, diamètre : à retenir','Remember radius and diameter'],['Centre O • rayon r • diamètre d • d = 2r.','Center O • radius r • diameter d • d = 2r.'],['d = 2r','d = 2r'],'summary','circle',{radius:3}));
 else if(family==='ratio')p.push(
 s(['LA PROPORTIONNALITÉ EN ACTION','PROPORTIONAL REASONING'],['Même prix unitaire, quantités différentes.','The same unit price for different quantities.'],['2 cahiers → 6 €','2 notebooks → €6'],'title','bars',{values:[2,4,6,8]}),
 s(['Deux cahiers coûtent 6 €','Two notebooks cost €6'],['Que coûtent 4 cahiers au même prix ?','What is the cost of four notebooks at the same rate?'],['2 → 6 ; 4 → ?','2 → 6; 4 → ?'],'discovery','bars',{values:[2,4]}),
 s(['Le prix d’un seul cahier','Price of one notebook'],['On passe de deux cahiers à un cahier en divisant par deux.','Divide the price of two notebooks by two.'],['6 ÷ 2 = 3 €','6 ÷ 2 = €3'],'calculation','calculation'),
 s(['Le tableau de proportionnalité','A proportionality table'],['Chaque quantité est multipliée par le même coefficient.','Each quantity is multiplied by the same factor.'],['1 → 3 ; 2 → 6 ; 5 → 15','1 → 3; 2 → 6; 5 → 15'],'visual','bars',{values:[3,6,9,15]}),
 s(['Le coefficient constant','The constant multiplier'],['On retrouve toujours le même prix pour une unité.','The price per unit stays constant.'],['3 € × quantité = prix','€3 × quantity = price'],'rule','calculation'),
 s(['Un plan de classe','A classroom plan'],['Si 3 tables accueillent 12 élèves, combien de places pour 7 tables identiques ?','If 3 tables seat 12 students, how many places do 7 identical tables seat?'],['12 ÷ 3 × 7 = ?','12 ÷ 3 × 7 = ?'],'problem','challenge',{},['28','28']),
 s(['La correction en deux étapes','Two-step solution'],['Trouve d’abord le nombre d’élèves par table.','First find seats per table.'],['12 ÷ 3 = 4\n4 × 7 = 28','12 ÷ 3 = 4\n4 × 7 = 28'],'solution','calculation'),
 s(['Le graphique grandit régulièrement','The graph grows steadily'],['Compare les prix pour 1, 2, 3 et 4 cahiers.','Compare the costs for one, two, three, four notebooks.'],['3, 6, 9, 12','3, 6, 9, 12'],'visual','bars',{values:[3,6,9,12]}),
 s(['À toi : billets de cinéma','Your turn: cinema tickets'],['Cinq billets coûtent 40 €. Combien coûtent trois billets ?','Five tickets cost €40. How much are three tickets?'],['40 ÷ 5 × 3 = ?','40 ÷ 5 × 3 = ?'],'practice','challenge',{},['24 €','€24']),
 s(['Un autre coefficient','Another unit price'],['Le prix d’un billet est de 8 €.','One ticket costs €8.'],['8 × 3 = 24 €','8 × 3 = €24'],'solution','calculation'),
 s(['Ce qui reste toujours vrai','What always stays true'],['Dans une situation proportionnelle, le rapport reste constant.','A proportional relationship has a constant multiplier.'],['prix / quantité = constante','price / quantity = constant'],'summary','bars',{values:[3,6,9,12]}));
 else if(family==='statistics')p.push(
 s(['LES DONNÉES RACONTENT UNE HISTOIRE','DATA TELLS A STORY'],['Observons une enquête réalisée en classe.','Explore a simple classroom survey.'],['4, 7, 3, 6','4, 7, 3, 6'],'title','bars',{values:[4,7,3,6]}),
 s(['Quelle activité préfères-tu ?','What activity do you prefer?'],['Les réponses sont réparties entre quatre activités.','Students choose among four activities.'],['4 ; 7 ; 3 ; 6','4; 7; 3; 6'],'discovery','bars',{values:[4,7,3,6]}),
 s(['Organisons les résultats','Organize the results'],['Chaque barre indique le nombre d’élèves d’une catégorie.','Each bar shows the number of students in a category.'],['A: 4 · B: 7 · C: 3 · D: 6','A: 4 · B: 7 · C: 3 · D: 6'],'visual','bars',{values:[4,7,3,6]}),
 s(['Combien de réponses en tout ?','Total number of responses'],['Additionne les effectifs des quatre catégories.','Add the frequencies of the four categories.'],['4 + 7 + 3 + 6 = 20','4 + 7 + 3 + 6 = 20'],'calculation','calculation'),
 s(['La catégorie la plus populaire','The most popular category'],['Quelle est la barre la plus haute ?','Which bar is the tallest?'],['B = 7','B = 7'],'visual','bars',{values:[4,7,3,6]}),
 s(['Une nouvelle enquête','Another survey'],['Voici les votes : 5, 8, 4 et 3. Quelle catégorie gagne ?','The votes are 5, 8, 4 and 3. Which group wins?'],['5 ; 8 ; 4 ; 3','5; 8; 4; 3'],'practice','bars',{values:[5,8,4,3]},['B','B']),
 s(['On lit le graphique','Read the graph'],['B a le plus grand effectif : huit réponses.','B has the highest frequency: eight.'],['B = 8','B = 8'],'solution','bars',{values:[5,8,4,3]}),
 s(['Les données dans la vie réelle','Data in everyday life'],['14 élèves choisissent le sport, 6 la lecture. Quel total ?','Fourteen students choose sports and six choose reading. What is the total?'],['14 + 6 = ?','14 + 6 = ?'],'problem','challenge',{},['20','20']),
 s(['Additionnons et vérifions','Add and verify'],['La classe compte 20 réponses.','There are 20 responses in the class.'],['14 + 6 = 20','14 + 6 = 20'],'solution','calculation'),
 s(['Je sais lire un diagramme','I can read a bar chart'],['Titre • catégories • effectifs • conclusion.','Title • categories • counts • conclusion.'],['4 + 7 + 3 + 6 = 20','4 + 7 + 3 + 6 = 20'],'summary','bars',{values:[4,7,3,6]}));
 else if(family==='area')p.push(
 s(['MESURER UNE SURFACE','MEASURING AREA'],['La surface compte combien de carrés-unités couvrent une figure.','Area measures how many unit squares cover a shape.'],['4 × 6 = 24 unités²','4 × 6 = 24 square units'],'title','grid',{rows:4,cols:6,filled:24}),
 s(['Des carrés bien rangés','Count unit squares'],['Une grille de 4 rangées et 6 colonnes contient 24 carrés.','Four rows and six columns give 24 unit squares.'],['4 × 6 = 24','4 × 6 = 24'],'discovery','grid',{rows:4,cols:6,filled:24}),
 s(['Aire d’un rectangle','Area of a rectangle'],['Multiplie la longueur par la largeur.','Multiply length by width.'],['8 × 5 = 40 cm²','8 × 5 = 40 cm²'],'rule','grid',{rows:5,cols:8,filled:40}),
 s(['Le contour n’est pas la surface','Perimeter is not area'],['Le périmètre mesure le bord ; l’aire mesure l’intérieur.','Perimeter measures the boundary; area measures the inside.'],['P = 2 × (8 + 5) = 26 cm','P = 2 × (8 + 5) = 26 cm'],'concept','grid',{rows:5,cols:8,filled:40}),
 s(['Autre rectangle, autre résultat','A new rectangle'],['Un rectangle mesure 7 cm sur 3 cm.','A rectangle is 7 cm long and 3 cm wide.'],['7 × 3 = 21 cm²','7 × 3 = 21 cm²'],'visual','grid',{rows:3,cols:7,filled:21}),
 s(['Aménager une classe','Floor space challenge'],['Une salle rectangulaire mesure 9 m sur 6 m. Calcule sa surface.','A rectangular classroom is 9 m by 6 m. Find its area.'],['9 × 6 = ?','9 × 6 = ?'],'problem','challenge',{},['54 m²','54 m²']),
 s(['On calcule l’aire','Find the area'],['La longueur et la largeur sont exprimées dans la même unité.','Both measurements use the same unit.'],['9 × 6 = 54 m²','9 × 6 = 54 m²'],'solution','calculation'),
 s(['Un rectangle découpé','Break apart a rectangle'],['On peut séparer 13 × 6 en 10 × 6 et 3 × 6.','Split 13 × 6 into 10 × 6 and 3 × 6.'],['60 + 18 = 78','60 + 18 = 78'],'visual','areaModel',{a:13,b:6}),
 s(['À toi : 12 cm par 4 cm','Your turn: 12 cm by 4 cm'],['Détermine l’aire du rectangle.','Calculate the area of the rectangle.'],['12 × 4 = ?','12 × 4 = ?'],'practice','grid',{rows:4,cols:12,filled:48},['48 cm²','48 cm²']),
 s(['Une réponse que l’on peut compter','A countable answer'],['Le rectangle comporte 48 carrés de 1 cm².','The rectangle contains 48 squares of 1 cm².'],['12 × 4 = 48 cm²','12 × 4 = 48 cm²'],'solution','calculation'),
 s(['Quelle unité choisir ?','Choose the right unit'],['L’aire s’exprime en unités carrées, pas en unités simples.','Area is expressed in square units.'],['cm² ; m²','cm²; m²'],'summary','grid',{rows:4,cols:6,filled:24}));
 else if(family==='symmetry')p.push(
 s(['LA SYMÉTRIE : UN EFFET MIROIR','SYMMETRY: A MIRROR EFFECT'],['Les points images sont à la même distance de l’axe.','Reflected points stay the same distance from the mirror line.'],['A ↔ A′','A ↔ A′'],'title','symmetry'),
 s(['Un axe, deux points','One axis, two points'],['Place deux points situés de part et d’autre d’un axe.','Place a point and its reflection on opposite sides of an axis.'],['AA′ ⟂ (d)','AA′ ⟂ (d)'],'discovery','symmetry'),
 s(['L’axe coupe le segment au milieu','The mirror line bisects'],['L’axe de symétrie est la médiatrice de [AA′].','The line of symmetry is the perpendicular bisector of [AA′].'],['IA = IA′','IA = IA′'],'concept','symmetry'),
 s(['Trois étapes au compas','Three steps with a ruler'],['Trace une perpendiculaire, reporte la distance puis marque l’image.','Draw a perpendicular, transfer the distance and mark the reflected point.'],['A → A′','A → A′'],'visual','symmetry'),
 s(['Regardons un segment','Reflect a segment'],['Chaque extrémité du segment possède une image.','Both endpoints of a segment have reflected points.'],['[AB] ↔ [A′B′]','[AB] ↔ [A′B′]'],'visual','symmetry'),
 s(['Un point à 2 cm de l’axe','A point 2 cm from the axis'],['À quelle distance de l’axe est son symétrique ?','How far from the axis is its reflected point?'],['2 cm → ?','2 cm → ?'],'practice','symmetry',{},['2 cm','2 cm']),
 s(['La distance est conservée','Distance stays the same'],['Le symétrique se trouve à 2 cm de l’autre côté.','The reflection lies 2 cm on the opposite side.'],['2 cm = 2 cm','2 cm = 2 cm'],'solution','symmetry'),
 s(['Défi sur papier quadrillé','Grid-paper challenge'],['Dessine un motif puis reproduis-le par symétrie.','Draw a pattern and reflect it across a line.'],['A, B, C → A′, B′, C′','A, B, C → A′, B′, C′'],'challenge','symmetry'),
 s(['Un miroir qui ne déforme pas','A mirror preserves shape'],['Les longueurs et les angles sont conservés par la symétrie.','Reflection preserves lengths and angles.'],['AB = A′B′','AB = A′B′'],'summary','symmetry'));
 else if(family==='time')p.push(
 s(['LES DURÉES EN PRATIQUE','WORKING WITH TIME'],['Lire l’heure, calculer un écart, vérifier ses unités.','Read the time, calculate elapsed minutes, check units.'],['1 h = 60 min','1 h = 60 min'],'title','clock',{hour:9,minute:15}),
 s(['Le rendez-vous commence','The meeting starts'],['Une activité commence à 9 h 15.','An activity begins at 9:15.'],['9 h 15','9:15'],'discovery','clock',{hour:9,minute:15}),
 s(['Une heure plus tard','One hour later'],['De 9 h 15 à 10 h 15, une heure s’est écoulée.','From 9:15 to 10:15, one hour passes.'],['60 min','60 min'],'concept','clock',{hour:10,minute:15}),
 s(['Encore quinze minutes','Fifteen minutes later'],['De 10 h 15 à 10 h 30, on ajoute 15 min.','From 10:15 to 10:30, add 15 minutes.'],['60 + 15 = 75 min','60 + 15 = 75 min'],'visual','clock',{hour:10,minute:30}),
 s(['Calculons une durée','Calculate elapsed time'],['De 9 h 15 à 10 h 30, il s’écoule 1 h 15.','The time from 9:15 to 10:30 is 1 hour 15 minutes.'],['10 h 30 − 9 h 15 = 1 h 15','10:30 − 9:15 = 1 h 15 min'],'calculation','calculation'),
 s(['À toi : un atelier créatif','Your turn: a creative workshop'],['Un atelier commence à 14 h 20 et se termine à 15 h 05. Quelle est sa durée ?','A workshop runs from 14:20 to 15:05. How long is it?'],['? min','? min'],'problem','clock',{hour:15,minute:5},['45 min','45 min']),
 s(['Le bon chemin pour calculer','Break elapsed time into steps'],['De 14 h 20 à 15 h : 40 min, puis 5 min.','From 14:20 to 15:00 is 40 min, then 5 min.'],['40 + 5 = 45 min','40 + 5 = 45 min'],'solution','calculation'),
 s(['Mini-défi : 90 minutes','Mini-challenge: 90 minutes'],['Exprime 90 minutes en heures et minutes.','Write 90 minutes in hours and minutes.'],['90 min = ?','90 min = ?'],'challenge','clock',{hour:1,minute:30},['1 h 30','1 h 30 min']),
 s(['L’astuce du nombre 60','The 60-minute rule'],['60 min font 1 h, les 30 min restantes font une demi-heure.','60 minutes make one hour; 30 minutes remain.'],['90 min = 1 h 30','90 min = 1 h 30 min'],'solution','calculation'),
 s(['Pour ne plus se tromper','Remember elapsed time'],['Convertis les heures en minutes si nécessaire.','Convert hours into minutes when needed.'],['1 h 15 = 75 min','1 h 15 = 75 min'],'summary','clock',{hour:10,minute:30}));
 else if(family==='algebra')p.push(
 s(['LES ÉQUATIONS : TROUVER LA VALEUR','EQUATIONS: FIND THE UNKNOWN'],['Une égalité permet de retrouver une valeur inconnue.','An equality helps us find an unknown value.'],['x + 3 = 8','x + 3 = 8'],'title','equation',{expression:'x + 3 = 8'}),
 s(['Une boîte mystérieuse','A mystery box'],['Une boîte contient un nombre inconnu. Avec 3 de plus, on obtient 8.','A box contains a number. Add three, and you get eight.'],['x + 3 = 8','x + 3 = 8'],'discovery','equation',{expression:'x + 3 = 8'}),
 s(['Défaire une addition','Undo addition'],['Soustrais 3 des deux côtés.','Subtract three from both sides.'],['x = 8 − 3','x = 8 − 3'],'calculation','equation',{expression:'x = 8 − 3'}),
 s(['Vérifions x = 5','Check x = 5'],['On remplace x par 5 et on recalcule.','Substitute five for x and check.'],['5 + 3 = 8','5 + 3 = 8'],'solution','calculation'),
 s(['Une équation multiplicative','A multiplication equation'],['Quatre boîtes contiennent chacune x objets ; il y en a 28.','Four boxes hold x objects each, giving 28 in total.'],['4 × x = 28','4 × x = 28'],'visual','groups',{rows:4,cols:7}),
 s(['Diviser pour isoler x','Divide to isolate x'],['Divise les deux membres par 4.','Divide both sides by four.'],['x = 28 ÷ 4 = 7','x = 28 ÷ 4 = 7'],'calculation','calculation'),
 s(['À toi de résoudre','Your equation to solve'],['Trouve la valeur inconnue.','Find the unknown value.'],['x − 6 = 11','x − 6 = 11'],'practice','equation',{expression:'x − 6 = 11'},['x = 17','x = 17']),
 s(['La réponse justifiée','Explain the answer'],['On ajoute six aux deux membres.','Add six to both sides.'],['x = 11 + 6 = 17','x = 11 + 6 = 17'],'solution','calculation'),
 s(['Problème : billets de cinéma','Word problem: cinema tickets'],['Trois billets coûtent 27 €. Quel est le prix d’un billet ?','Three tickets cost €27. What is the price of one?'],['3x = 27','3x = 27'],'problem','challenge',{},['x = 9','x = 9']),
 s(['Un billet coûte 9 €','A ticket costs €9'],['Je vérifie le prix des trois billets.','Check the total price of three tickets.'],['27 ÷ 3 = 9 €','27 ÷ 3 = €9'],'solution','calculation'),
 s(['On garde l’égalité','Keep the equation balanced'],['Effectuer la même opération sur les deux membres conserve l’égalité.','Do the same operation on both sides to preserve equality.'],['x + 3 = 8 ⇔ x = 5','x + 3 = 8 ⇔ x = 5'],'summary','equation',{expression:'x = 5'}));
 else if(family==='geometry')p.push(
 s(['GÉOMÉTRIE : OBSERVER ET CONSTRUIRE','GEOMETRY: EXPLORE AND CONSTRUCT'],['Une figure mathématique s’appuie sur des propriétés vérifiables.','Geometric constructions follow precise properties.'],['A, B, C, (d)','A, B, C, (d)'],'title','geometry'),
 s(['Un segment et ses extrémités','A segment and its endpoints'],['Trace un segment [AB] de longueur 6 cm.','Draw a segment [AB] of length 6 cm.'],['AB = 6 cm','AB = 6 cm'],'discovery','geometry'),
 s(['Droites parallèles','Parallel lines'],['Deux droites parallèles ne se coupent pas.','Parallel lines never meet.'],['(d) // (e)','(d) // (e)'],'visual','geometry'),
 s(['Droites perpendiculaires','Perpendicular lines'],['Un angle droit mesure 90°.','A right angle measures 90°.'],['(d) ⟂ (e)','(d) ⟂ (e)'],'concept','geometry'),
 s(['Un triangle à trois sommets','Three vertices of a triangle'],['Un triangle possède trois côtés et trois angles.','A triangle has three sides and three angles.'],['A, B, C','A, B, C'],'visual','geometry'),
 s(['Le carré et les angles droits','Squares and right angles'],['Un carré possède quatre côtés égaux et quatre angles droits.','A square has four equal sides and four right angles.'],['4 × 90° = 360°','4 × 90° = 360°'],'concept','grid',{rows:4,cols:4,filled:16}),
 s(['Une construction à réaliser','Construction challenge'],['Trace un rectangle de longueur 6 cm et de largeur 3 cm.','Draw a rectangle 6 cm long and 3 cm wide.'],['6 cm × 3 cm','6 cm × 3 cm'],'practice','grid',{rows:3,cols:6,filled:18}),
 s(['Comment vérifier ?','How do we check?'],['Les côtés opposés sont parallèles et les quatre angles droits.','Opposite sides are parallel, and all four angles are right angles.'],['4 angles = 90°','4 angles = 90°'],'solution','grid',{rows:3,cols:6,filled:18}),
 s(['Dans la classe','Geometry in the classroom'],['Repère deux objets qui montrent des lignes parallèles.','Find two classroom objects showing parallel lines.'],['(d) // (e)','(d) // (e)'],'problem','geometry'),
 s(['Les symboles à retenir','Geometry symbols to remember'],['Segment [AB] ; droite (d) ; perpendicularité ⟂ ; parallélisme //.','Segment [AB]; line (d); perpendicular ⟂; parallel //.'],['[AB], (d), ⟂, //','[AB], (d), ⟂, //'],'summary','geometry'));
 return p;
}
function extraSmartSlides(family,seed,unit){
 const tr2=(fr,en)=>lang()==='fr'?fr:en;
 const mk=(title,body,formula,kind,visual,model={},answer='')=>({id:'extra-'+seed+'-'+kind,title:tr2(...title)+` · ${seed+1}`,body:tr2(...body),formula:tr2(...formula),kind,visual,model,answer,source:unit.id,notes:tr2('Question supplémentaire originale à relire.','Additional original problem to review.')});
 const n=seed+2;
 if(family==='multiplication'){const a=11+2*n,b=12+n,sum=a*b;return [mk(['Nouveau calcul à explorer','Explore another multiplication'],[`Calcule ${a} × ${b} avec deux produits partiels.`,`Calculate ${a} × ${b} using partial products.`],[`${a} × ${b} = ?`,`${a} × ${b} = ?`],'practice','challenge',{a,b},String(sum)),mk(['Corrige ce nouveau calcul','Check this new calculation'],[`Décompose ${b} en 10 + ${b-10}.`,`Split ${b} into 10 + ${b-10}.`],[`${a} × 10 = ${a*10}\n${a} × ${b-10} = ${a*(b-10)}\nTotal = ${sum}`,`${a} × 10 = ${a*10}\n${a} × ${b-10} = ${a*(b-10)}\nTotal = ${sum}`],'solution','areaModel',{a,b},String(sum))];}
 if(family==='fraction'){const d=[4,5,6,8][seed%4],k=1+(seed*3)%(d-1);return [mk(['Défi : trouve la fraction','Challenge: name the fraction'],[`Quelle fraction représente ${k} parties colorées sur ${d} ?`,`What fraction has ${k} shaded parts out of ${d}?`],[`${k} / ${d} = ?`,`${k} / ${d} = ?`],'practice','fraction',{n:k,d},`${k}/${d}`),mk(['Vérifie la fraction','Check the fraction'],[`Il y a ${k} parts colorées sur ${d} parts égales.`,`There are ${k} shaded parts out of ${d} equal parts.`],[`${k}/${d}`,`${k}/${d}`],'solution','fraction',{n:k,d},`${k}/${d}`)];}
 if(family==='division'||family==='multiples'){const b=4+seed,a=b*(6+seed);return [mk(['Partage à résoudre','Sharing puzzle'],[`Répartis ${a} objets en ${b} groupes égaux.`,`Split ${a} objects into ${b} equal groups.`],[`${a} ÷ ${b} = ?`,`${a} ÷ ${b} = ?`],'practice','challenge',{},String(a/b)),mk(['Vérification par multiplication','Check using multiplication'],['Le quotient correspond à la taille de chaque groupe.','The quotient is the number per group.'],[`${a} ÷ ${b} = ${a/b}\n${a/b} × ${b} = ${a}`,`${a} ÷ ${b} = ${a/b}\n${a/b} × ${b} = ${a}`],'solution','calculation',{},String(a/b))];}
 if(family==='decimal'){const a=1+seed,b=(3+seed)%10;const val=lang()==='fr'?`${a},${b}`:`${a}.${b}`;return [mk(['Défi : valeur décimale','Decimal value challenge'],[`Décompose ${val} en unités et dixièmes.`,`Split ${val} into ones and tenths.`],[`${val} = ?`,`${val} = ?`],'practice','grid',{rows:10,cols:10,filled:b*10},val),mk(['Correction par la valeur de position','Check place value'],['Un chiffre après la virgule représente des dixièmes.','One digit after the decimal point counts tenths.'],[`${val} = ${a} + ${b}/10`,`${val} = ${a} + ${b}/10`],'solution','grid',{rows:10,cols:10,filled:b*10},val)];}
 if(family==='ratio'){
 const unitPrice=2+seed,quantity=4+seed,total=unitPrice*quantity;
 return [mk([`Prix de ${quantity} objets`,`Price for ${quantity} objects`],[`Chaque objet coûte ${unitPrice} €. Calcule le prix de ${quantity} objets.`,`Each item costs €${unitPrice}. Find the total for ${quantity} items.`],[`${quantity} × ${unitPrice} = ?`,`${quantity} × ${unitPrice} = ?`],'practice','bars',{values:[unitPrice,2*unitPrice,3*unitPrice,total]},String(total)),mk([`Calcul du prix total`,`Find the total cost`],[`Le coefficient de proportionnalité est ${unitPrice}.`,`The unit price is ${unitPrice}.`],[`${quantity} × ${unitPrice} = ${total}`,`${quantity} × ${unitPrice} = ${total}`],'solution','calculation',{},String(total))];}
 if(family==='statistics'){
 const vals=[3+seed,5+seed,2+seed,4+seed],sum=vals.reduce((a,b)=>a+b,0);
 return [mk([`Lis quatre nouvelles barres`,`Read four new bars`],[`Les effectifs sont ${vals.join(', ')}. Calcule l’effectif total.`,`The counts are ${vals.join(', ')}. Find the total frequency.`],[`${vals.join(' + ')} = ?`,`${vals.join(' + ')} = ?`],'practice','bars',{values:vals},String(sum)),mk([`Vérifions les effectifs`,`Check the frequencies`],[`La somme des quatre valeurs donne ${sum}.`,`The four values total ${sum}.`],[`${vals.join(' + ')} = ${sum}`,`${vals.join(' + ')} = ${sum}`],'solution','calculation',{},String(sum))];}
 if(family==='area'){
 const a=6+seed%6,b=4+seed%4,total=a*b;
 return [mk([`Une surface de ${a} sur ${b}`,`Area of ${a} by ${b}`],[`Calcule l’aire d’un rectangle de ${a} cm sur ${b} cm.`,`Find the area of a rectangle ${a} cm by ${b} cm.`],[`${a} × ${b} = ? cm²`,`${a} × ${b} = ? cm²`],'practice','grid',{rows:b,cols:a,filled:total},String(total)),mk([`Le rectangle est recouvert`,`Count all the squares`],[`Il y a ${total} carrés-unités.`,`There are ${total} unit squares.`],[`${a} × ${b} = ${total} cm²`,`${a} × ${b} = ${total} cm²`],'solution','grid',{rows:b,cols:a,filled:total},String(total))];}
 if(family==='circle'){
 const r=3+seed;return [mk([`Le diamètre d’un autre cercle`,`Another circle diameter`],[`Le rayon vaut ${r} cm. Détermine le diamètre.`,`The radius is ${r} cm. Find the diameter.`],[`d = 2 × ${r} = ?`, `d = 2 × ${r} = ?`],'practice','circle',{radius:r},String(r*2)),mk([`Le diamètre vaut ${2*r} cm`,`Diameter is ${2*r} cm`],['Un diamètre est deux rayons alignés.','A diameter consists of two radii in a straight line.'],[`2 × ${r} = ${2*r} cm`,`2 × ${r} = ${2*r} cm`],'solution','circle',{radius:r},String(r*2))];}
 if(family==='symmetry'){
 const dist=2+seed;return [mk([`Le point A à ${dist} cm de l’axe`,`Point A ${dist} cm from the line`],[`À quelle distance sera son image A′ ?`,`How far will its reflection A′ be from the line?`],[`${dist} cm → ?`,`${dist} cm → ?`],'practice','symmetry',{},`${dist} cm`),mk([`Même distance des deux côtés`,`Same distance on both sides`],[`Le point image est à ${dist} cm de l’autre côté.`,`The reflected point is ${dist} cm on the opposite side.`],[`IA = IA′ = ${dist} cm`,`IA = IA′ = ${dist} cm`],'solution','symmetry',{},`${dist} cm`)];}
 if(family==='time'){
 const start=8+seed%7,mins=15+5*(seed%6),dur=30+5*(seed%4),endM=mins+dur;const endH=start+Math.floor(endM/60),m=endM%60;
 const clock=(h,mm)=>`${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
 return [mk([`Du début à la fin : ${dur} minutes`,`From start to finish: ${dur} minutes`],[`Une séance commence à ${clock(start,mins)} et finit à ${clock(endH,m)}. Calcule sa durée.`,`A session begins at ${clock(start,mins)} and finishes at ${clock(endH,m)}. Find its length.`],[`${clock(start,mins)} → ${clock(endH,m)}`,`${clock(start,mins)} → ${clock(endH,m)}`],'practice','clock',{hour:endH,minute:m},`${dur} min`),mk([`La séance dure ${dur} min`,`The session lasts ${dur} min`],['On compte les minutes entre les deux horaires.','Count elapsed minutes between the times.'],[`${dur} min`,`${dur} min`],'solution','calculation',{},`${dur} min`)];}
 if(family==='algebra'){
 const a=3+seed,b=8+2*seed,x=b-a;
 return [mk([`Quelle est la valeur de x ?`,`What is x?`],[`Résous l’équation x + ${a} = ${b}.`,`Solve x + ${a} = ${b}.`],[`x + ${a} = ${b}`,`x + ${a} = ${b}`],'practice','equation',{expression:`x + ${a} = ${b}`},`x = ${x}`),mk([`Une soustraction suffit`,`Subtract to solve`],[`On enlève ${a} à chacun des deux membres.`,`Subtract ${a} from each side.`],[`x = ${b} − ${a} = ${x}`,`x = ${b} − ${a} = ${x}`],'solution','equation',{expression:`x = ${x}`},`x = ${x}`)];}
 if(family==='geometry'){
 const side=3+seed%6,perimeter=4*side;
 return [mk([`Un carré de côté ${side} cm`,`A square with side ${side} cm`],[`Construis un carré de côté ${side} cm. Calcule son périmètre.`,`Draw a square with side ${side} cm. Find its perimeter.`],[`P = 4 × ${side} = ?`, `P = 4 × ${side} = ?`],'practice','grid',{rows:side,cols:side,filled:side*side},`${perimeter} cm`),mk([`Le périmètre vaut ${perimeter} cm`,`The perimeter is ${perimeter} cm`],['Les quatre côtés du carré sont égaux.','All four square sides are equal.'],[`4 × ${side} = ${perimeter} cm`,`4 × ${side} = ${perimeter} cm`],'solution','calculation',{},`${perimeter} cm`)];}
 const a=2+seed,b=3+seed;return [mk(['Une nouvelle question','A fresh question'],[`Utilise la notion « ${unitLabel(unit)} » pour résoudre cet exercice.`,`Use the concept “${unitLabel(unit)}” to solve this example.`],['Explique ton raisonnement.','Explain your reasoning.'],'practice','none'),mk(['Justifie ta méthode','Explain your method'],['Cette diapositive doit être complétée avec la solution vérifiée de la classe.','Complete this slide with your verified solution.'],['À compléter par l’enseignant.','Teacher to complete.'],'solution','none')];
}
/* The Geometry / Construction checkbox is one pedagogical option with two parts:
   show a correct visual model AND propose a practical construction when relevant.
   Other chapters must not receive unrelated geometry filler. */
function selectedGeometryConstructionSlide(family){
 const s=(fr,en)=>tr(fr,en);
 const core={id:'geometry-construction-'+Date.now(),kind:'practice',answer:'',notes:''};
 if(family==='circle')return {...core,
  title:s('À construire : cercle et rayon','Construct: circle and radius'),
  body:s('1. Marque le centre O. 2. Ouvre le compas à 3 cm. 3. Trace le cercle. 4. Place A sur le cercle et trace [OA].',
         '1. Mark centre O. 2. Set the compass to 3 cm. 3. Draw the circle. 4. Mark A on it and draw OA.'),
  formula:'OA = 3 cm',visual:'none',model:{},
  notes:s('Matériel : compas et règle. Faire vérifier l’ouverture du compas avant le tracé.',
          'Materials: compass and ruler. Check the compass setting before drawing.')};
 if(family==='geometry')return {...core,
  title:s('Construction : un rectangle précis','Construction: an accurate rectangle'),
  body:s('1. Trace [AB] de 6 cm. 2. Trace en A et B deux perpendiculaires à [AB]. 3. Reporte 3 cm sur chacune. 4. Relie les extrémités et code les angles droits.',
         '1. Draw AB = 6 cm. 2. Construct perpendiculars at A and B. 3. Mark 3 cm on each. 4. Join the new endpoints and mark all right angles.'),
  formula:'AB = 6 cm · BC = 3 cm',visual:'none',model:{},
  notes:s('Matériel : règle et équerre. Contrôler quatre angles droits et les côtés opposés égaux.',
          'Materials: ruler and set square. Check four right angles and equal opposite sides.')};
 if(family==='symmetry')return {...core,
  title:s('Construction : le symétrique de A','Construct the reflection of A'),
  body:s('1. Trace un axe (d) et place A hors de l’axe. 2. Trace la perpendiculaire à (d) passant par A. 3. Reporte la même distance de l’autre côté pour obtenir A′.',
         '1. Draw a mirror line d and a point A. 2. Draw a perpendicular from A to d. 3. Mark A′ at the same distance on the opposite side.'),
  formula:'IA = IA′',visual:'none',model:{},
  notes:s('Matériel : règle et équerre. Vérifier que [AA′] est perpendiculaire à l’axe et coupé en son milieu.',
          'Materials: ruler and set square. Check that AA′ is perpendicular to the mirror line and bisected by it.')};
 if(family==='area')return {...core,
  title:s('À construire : rectangle et aire','Construct: rectangle and area'),
  body:s('1. Construis un rectangle de 6 cm sur 3 cm avec la règle et l’équerre. 2. Trace un quadrillage de carrés de 1 cm de côté. 3. Compte les carrés et vérifie l’aire.',
         '1. Construct a 6 cm by 3 cm rectangle with a ruler and set square. 2. Draw a 1 cm square grid inside. 3. Count the squares to verify the area.'),
  formula:'A = L × l',visual:'none',model:{},
  notes:s('Matériel : règle et équerre ; le dessin sur PowerPoint illustre le quadrillage, pas une longueur physique à l’écran.',
          'Materials: ruler and set square; the slide grid illustrates the area, not an on-screen physical measurement.')};
 return null;
}
function buildOffline(){
 const selected=(Array.isArray(state.unitIds)?state.unitIds:[]).map(id=>units().find(u=>u.id===id)).filter(Boolean);
 if(!selected.length)throw Error(pick('require'));
 const parts=[];const missing=[];
 selected.forEach((u,i)=>{const family=smartFamily(u);let p=smartPlan(family,u,i);if(!p.length){missing.push(unitLabel(u));return;}parts.push({unit:u,family,slides:p});});
 if(missing.length)throw Error(tr('Aucun modèle hors ligne vérifié pour : ','No verified offline lesson model for: ')+missing.join(', ')+'. '+tr('Utilisez le prompt pour ChatGPT en joignant les pages du manuel.','Use the ChatGPT prompt with the relevant textbook pages.'));
 let result=[];
 if(parts.length===1){
 const pool=parts[0].slides.slice(),summary=pool[pool.length-1]?.kind==='summary'?pool.pop():null;
 if(state.count>=pool.length+(summary?1:0)){
  result=pool.slice();let ext=0;
  
  while(result.length+(summary?1:0)<state.count){const next=extraSmartSlides(parts[0].family,ext++,parts[0].unit);const left=state.count-result.length-(summary?1:0);if(left===1){const checked={...next[0],title:tr('Exemple supplémentaire résolu','Additional worked example'),body:next[1].body,formula:next[1].formula,answer:'',kind:'visual',visual:next[1].visual,model:next[1].model};result.push(checked);}else result.push(...next.slice(0,left));}
  if(summary)result.push(summary);
 }else if(summary){
  const indices=state.count<=5?[0,2,4,8]:state.count===8?[0,2,3,5,8,9,10]:state.count===10?[0,1,2,3,4,5,8,9,10]:state.count===12?[0,1,2,3,4,5,6,7,8,9,10]:null;
  if(indices&&pool.length>Math.max(...indices)){result=indices.slice(0,state.count-1).map(i=>pool[i]).filter(Boolean);}
  else{const k=state.count-1;const chosen=Array.from({length:k},(_,i)=>Math.round(i*(pool.length-1)/Math.max(1,k-1)));result=[...new Set(chosen)].map(i=>pool[i]);while(result.length<k){const extra=pool.find(s=>!result.includes(s));if(!extra)break;result.push(extra);}}
  result=result.slice(0,state.count-1).concat(summary);
 }else{result=pool.slice(0,state.count);}
 if(result.length>=5&&!result.some(s=>s.kind==='solution')){const solution=pool.find(s=>s.kind==='solution');if(solution)result[Math.max(1,result.length-2)]=solution;}
 }else{
 const selectedCount=parts.length;const capacities=parts.map((p,i)=>Math.floor(state.count/selectedCount)+(i<state.count%selectedCount?1:0));
 parts.forEach((p,j)=>{let a=p.slides.slice();let ext=0;while(a.length<capacities[j])a.push(...extraSmartSlides(p.family,ext++,p.unit));const slice=a.slice(0,capacities[j]);if(j>0&&slice[0])slice[0].title=tr('Chapitre : ','Chapter: ')+unitLabel(p.unit);result.push(...slice);});result=result.slice(0,state.count);
 }
 if(!result.length)throw Error(pick('needSource'));
 // Make the selected option affect ACTUAL slides, never merely prompt text.
 // Geometry visuals already occur naturally in geometric chapters; add a
 // clearly separate, hands-on construction task within the exact slide count.
 const geoPart=parts.find(p=>['circle','geometry','symmetry','area'].includes(p.family));
 if(geoPart && state.extra.includes('geometryFigures') && result.length>=3){
   const family=geoPart.family;
   const diagram=(family==='circle'?{visual:'circle',model:{radius:3},label:'O, A'}:
     family==='symmetry'?{visual:'symmetry',model:{}}:
     family==='area'?{visual:'geometry',model:{}}:{visual:'geometry',model:{}});
   const refSlide={kind:'visual',title:tr('Géométrie : figure de référence','Geometry: reference figure'),
     body:family==='circle'?tr('Observe le cercle de centre O et de rayon 3 cm. Identifie le rayon et détermine le diamètre.','Observe the circle centred at O with radius 3 cm. Identify its radius and find its diameter.'):
       family==='symmetry'?tr('Observe la figure de départ et son axe de symétrie. Décris les distances conservées.','Study the given figure and mirror axis. Describe the preserved distances.'):
       tr('Observe les droites et les angles indiqués dans la figure. Justifie la relation géométrique visible.','Study the lines and angles in the reference figure. Justify the visible geometric relationship.'),
     formula:family==='circle'?'d = 2 × r = 6 cm':tr('Justifie ta réponse.','Explain your answer.'),
     ...diagram,answer:'',notes:tr('La figure de référence est fournie ; la correction ne doit pas déjà montrer les nouvelles constructions demandées.','This is a supplied starting figure; do not reveal any additional student construction.')};
   result[Math.min(result.length-2,Math.max(1,Math.round(result.length*.36)))]=refSlide;
 }
 if(geoPart && state.extra.includes('geometricConstruction') && result.length>=3){
   const task=selectedGeometryConstructionSlide(geoPart.family);
   if(task){let idx=Math.min(result.length-2,Math.max(1,Math.round(result.length*.70)));
     // When both are selected, use two different slide slots.
     if(state.extra.includes('geometryFigures')&&idx===Math.round(result.length*.36))idx=Math.min(result.length-2,idx+1);
     result[idx]={...task,visual:'none',model:{},formula:task.formula==='A = 6 × 3 = 18 cm²'?'A = L × l':task.formula};
   }
 }
 // An explicit, separate correction slide may show the completed construction;
 // never reveal it on the student instruction slide itself.
 if(geoPart && state.extra.includes('geometricConstruction') && state.extra.includes('reveal') && result.length>=5){
   const idx=Math.min(result.length-2,Math.max(2,Math.round(result.length*.82)));
   const family=geoPart.family;
   const answers={
    circle:{visual:'circle',model:{radius:3},body:tr('Le cercle est centré en O ; A appartient au cercle et OA mesure 3 cm.','The circle is centred at O; A lies on it and OA measures 3 cm.'),formula:'OA = 3 cm'},
    geometry:{visual:'geometry',model:{},body:tr('Le rectangle terminé a quatre angles droits et des côtés opposés égaux.','The completed rectangle has four right angles and equal opposite sides.'),formula:'AB = CD = 6 cm · BC = AD = 3 cm'},
    symmetry:{visual:'symmetry',model:{},body:tr('L’axe (d) est la médiatrice de [AA′] ; les distances sont conservées.','The mirror line d perpendicularly bisects AA′; distances are preserved.'),formula:'IA = IA′'},
    area:{visual:'grid',model:{rows:3,cols:6,filled:18},body:tr('Le quadrillage du rectangle terminé comprend 18 carrés unités.','The finished rectangle grid contains 18 unit squares.'),formula:'A = 6 × 3 = 18 cm²'}
   };
   const a=answers[family];if(a)result[idx]={kind:'solution',title:tr('Corrigé de la construction','Construction answer reveal'),body:a.body,formula:a.formula,visual:a.visual,model:a.model,notes:tr('Cette diapositive est le corrigé réservé à l’enseignant : ne pas projeter avant la réalisation des élèves.','Teacher correction slide: do not display before students complete their construction.')};
 }
 state.slides=result.map((s,i)=>({...s,id:'smart-'+Date.now()+'-'+i}));state.slideLang=lang();state.selected=0;state.sourceMode='offline-curated-varied';state.title=unitLabel(parts[0].unit);state.updatedAt=Date.now();store();view();output(tr('Leçon originale créée : exemples variés, schémas adaptés et progression non répétitive. Vérifiez les notions exactes du manuel.','Original lesson created with varied examples, adaptive diagrams and non-repeating progression. Check the precise textbook concepts.'),'ok');
}

function chatGPTPrompt(){
 const chosenUnits=(Array.isArray(state.unitIds)?state.unitIds:[]).map(id=>units().find(u=>u.id===id)).filter(Boolean);
 if(!chosenUnits.length)throw Error(pick('require'));
 const u=chosenUnits[0],b=window.MATH_BOOKS?.forUnit?.(u,lang());
 const L=lang()==='fr'?'French (academically impeccable)':'English (natural and academically correct)';
 const topicNames=state.topics.map(i=>u.topics?.[i]&&topicLabel(u,u.topics[i],i)).filter(Boolean);
 const grade=lang()==='fr'?'EB'+state.grade:'Grade '+state.grade;
 const content=window.ATELIER_LESSON_EXCERPT?.(u,lang(),state.pages)?.text||'';
 const unitName=unitLabel(u),source=state.source.trim();
 const chosen=chosenUnits;
 const chapterEditionNote=lang()==='fr'?'the original French edition':'the original English edition';
 return `ACT AS: Senior AI Prompt Engineer + Mathematics Teacher (Lebanese Al-Ahlia, grades 4–7) + Educational Instructional Designer + Professional Visual PowerPoint Designer.

CREATE AN ACTUAL HIGH-QUALITY, FULLY EDITABLE POWERPOINT (.pptx), NOT JUST A SLIDE OUTLINE. The aesthetic must match the elegant Atelier Maths reference quality (without requiring or implying access to a removed example file). Ask me to attach the RELEVANT AL-AHLIA TEXTBOOK CHAPTER OR PAGES: the files embedded in my local website are NOT automatically attached to ChatGPT. Study the actual chapter before creating content. Use visual storytelling, mathematical reasoning, and distinct slide layouts; NEVER recycle the same worked calculation across the deck. Use widescreen 16:9 slides, a beautiful elegant purple/navy title cover, sophisticated pastel lavender and white lesson slides, turquoise, amber, pink, and blue accents, strong visual hierarchy, LARGE mathematics diagrams, readable number arrays, and step-by-step explanation. Avoid plain paragraph slides. Include mathematically correct diagrams built as EDITABLE PowerPoint shapes, not flattened page screenshots. Make every slide useful and visually distinct. Use successive slides for reliable step-by-step reveal when native animation is unavailable.

SELECTED SETTINGS:
• Output language: ${L}. Every student-facing slide must use ONLY this language.
• Grade: ${grade}.
• Curriculum/source: Al-Ahlia ${b?.title||'Mathematics'}, volume ${u.volume||1}; use ${chapterEditionNote} (${b?.available?'available on my local Atelier Maths website, but NOT attached here unless I upload it':'edition unavailable — request the matching textbook pages'}).
• Verified selected chapters: ${chosen.map(x=>`${unitLabel(x)} (${window.MATH_CHAPTER_REF(x,lang())}; ${lang()==="fr"?"tome":"volume"} ${x.volume||1})`).join("; ")}.
• Verified chapter page-range label (NOT necessarily same across editions): ${u.page||'not verified'}.
• Teacher selected page range: ${state.pages||'not specified'}.
• Topics: ${topicNames.join('; ')||unitName}.
• Level: ${pick(state.difficulty)}; duration: ${state.duration} minutes.
• EXACT slide count: ${state.count}; design: ${pick(state.style)}.
• OPTIONAL ELEMENTS (ONLY those explicitly selected by the teacher): ${state.extra.length?state.extra.map(k=>pick(k)).join(', '):'None selected — do not assume that optional elements are requested'}. Do NOT automatically tick, add or promise any other optional element.
• Geometry (Built-in Diagrams): ${state.extra.includes('geometryFigures')?'SELECTED. Provide a mathematically accurate EDITABLE starting or reference figure directly in the student slides. Correct vertices, measurements, angle marks and right-angle coding; students may analyse, calculate, reproduce, or complete the STARTING figure. NEVER draw the additional parts that the pupils must construct.':'Not additionally selected.'}
• Geometric Construction: ${state.extra.includes('geometricConstruction')?'SELECTED. Create a written, numbered independent construction programme with all necessary measurements and conditions. Do NOT insert a completed figure or a starter sketch into any student construction slide. Only reveal the full diagram in teacher notes or a separate explicit correction slide.':'Not additionally selected.'}
• These two options are INDEPENDENT and may both be selected. Apply only to relevant chosen Al-Ahlia chapters. Figures must be verified, clear, proportional, and editable native PowerPoint shapes. Complete construction methods and partial-credit criteria belong in teacher notes.
• Teacher's additional instructions: ${state.instructions||'None'}.
• Use original varied examples with different numbers and contexts on every learning phase. NEVER reuse the same calculation, problem statement or diagram across unrelated slides.
• Choose the right pedagogical sequence FOR THE SPECIFIC CHAPTER; do not impose recurring slide headings like Observe / Understand / Key Rule / Guided Example. No mechanical templates.

VISUAL STORYTELLING (design a chapter-specific sequence, not a checklist): vary the cover, real-world discovery, hands-on experiment, number array, area model, number line, a SHORT rule only where needed, column algorithm revealed step by step, a FRESH applied example, a separate challenge and correction, and an exit ticket. NEVER alternate the same observation / rule / guided-example template. For a 10-slide multiplication example, use distinct numbers such as 5×7 for groups, 23×14 for the area model, 32×15 for practice, and 41×12 for a word problem. For fractions, use distinct shaded bars, chocolate parts, number-line marks and comparisons. Distinct shapes and mathematics on every slide. The cover, diagram cards, split comparisons, full-width models, and challenge slides must have meaningfully DIFFERENT compositions. Student solutions must appear on subsequent slides, not on their questions. Use original age-appropriate math examples and distinguish wrong answers from correct ones. Check every calculation independently. Favor distinctive geometry or fraction visualizations where relevant.

NON-NEGOTIABLE: No invented Al-Ahlia chapter names or page numbers; do not pretend unprovided textbook content has been read. Respect verified chapter structure, grade, and notation. Equations, figures and labels must be accurate. Everything must be editable in Microsoft PowerPoint: text, diagrams, shapes, and tables as far as technically possible. Do not use a generic auto-generated, text-heavy PPT design. Maintain the exact requested slide count.
${content?'\nEXCERPT FROM INDEXED TEXTBOOK PAGES (verify scan/OCR where necessary):\n'+content.slice(0,14000):''}
${source?'\nADDITIONAL PRIMARY LESSON NOTES SUPPLIED BY THE TEACHER:\n'+source.slice(0,11000):''}

Deliver the ACTUAL editable .pptx file and ensure it opens, not just a prompt, image, or description. All lesson slides must be professionally illustrated with editable PowerPoint shapes. Professional original math visuals, not cloned screenshots. If you cannot access the corresponding textbook pages, explicitly say so instead of inventing information.`;
}
function cleanSlides(raw,n){let parsed;try{parsed=JSON.parse(String(raw).replace(/^```(?:json)?\s*/i,'').replace(/```\s*$/,''));}catch{throw Error(tr('Réponse IA non valide (JSON). Réessayez.','Invalid AI JSON response. Try again.'));}
 const arr=Array.isArray(parsed)?parsed:parsed.slides;if(!Array.isArray(arr)||arr.length!==n)throw Error(tr(`Nombre de diapositives incorrect : ${arr?.length??0} au lieu de ${n}.`,`Incorrect slide count: ${arr?.length??0} instead of ${n}.`));
 return arr.map((x,i)=>{if(typeof x!=='object'||!x||!String(x.title||'').trim()||!String(x.body||'').trim())throw Error(tr('Une diapositive est incomplète.','A slide is incomplete.'));let visual=['fraction','fractionCompare','circle','array','geometry','grid','bars','numberline','clock','equation','symmetry','groups','decomposition','calculation','algorithm','areaModel','challenge','none'].includes(x.visual)?x.visual:'none';return {id:'ai-'+Date.now()+'-'+i,title:String(x.title).slice(0,150),body:String(x.body).slice(0,700),formula:String(x.formula||'').slice(0,150),answer:String(x.answer||'').slice(0,320),notes:String(x.notes||'').slice(0,500),kind:String(x.kind||'lesson').slice(0,35),visual,model:(x.model&&typeof x.model==='object'&&!Array.isArray(x.model))?Object.fromEntries(Object.entries(x.model).filter(([k,v])=>['a','b','rows','cols','n','d','radius','filled','min','max','step','marker','hour','minute','stage','parts','values','expression'].includes(k)&&((typeof v==='number'&&Number.isFinite(v))||(typeof v==='string'&&v.length<80)||(Array.isArray(v)&&v.length<=20&&v.every(z=>Number.isFinite(Number(z))))))):{}};});}
function verifyArithmetic(slides){
 // Automated spot-check for simple numeric equalities; more complex mathematics
 // and textbook-specific reasoning still require teacher verification.
 const pattern=/(-?\d+(?:[.,]\d+)?)\s*([+−\-×÷])\s*(-?\d+(?:[.,]\d+)?)\s*=\s*(-?\d+(?:[.,]\d+)?)/g;
 for(let i=0;i<slides.length;i++){
  const slide=slides[i];for(const part of [slide.formula||'',slide.answer||'',slide.body||'']){
   for(const match of String(part).matchAll(pattern)){
    const a=Number(match[1].replace(',','.')),b=Number(match[3].replace(',','.')),actual=Number(match[4].replace(',','.'));
    const expected=match[2]==='+'?a+b:match[2]==='-'||match[2]==='−'?a-b:match[2]==='×'?a*b:b===0?NaN:a/b;
    if(!Number.isFinite(expected)||Math.abs(expected-actual)>0.011)throw Error(tr('Calcul à vérifier dans la diapositive ','Check arithmetic in slide ')+(i+1)+': '+match[0]);
   }
  }
 }
}
function saveDeck(){if(!state.slides.length)return;const copy=JSON.parse(JSON.stringify(state));if(!copy.id)copy.id='deck-'+Date.now();copy.title=copy.title||currentUnit()?.title||tr('Leçon','Lesson');copy.language=lang();copy.updatedAt=Date.now();saved=saved.filter(p=>p.id!==copy.id);saved.unshift(copy);saved=saved.slice(0,25);state.id=copy.id;store();view();output(pick('saved'),'ok');}
function matchBook(){const u=currentUnit(),b=window.MATH_BOOKS?.forUnit?.(u,lang());if(!b?.available)throw Error(pick('missing'));return b;}
async function openBook(){const b=matchBook();const u=await window.MATH_BOOKS.url(b.id,lang());window.open(u,'_blank','noopener,noreferrer');}
function changeConfig(e){const x=e.target,id=x?.id||'';if(id.startsWith('ps-')){
 const name=id.slice(3); if(name==='grade'){state.grade=+x.value;state.unitId='';chooseUnit();state.slides=[];promptDraft='';view();store();return;}
 if(name in state){const prior=state[name];state[name]=['count','duration'].includes(name)?Number(x.value):x.value;if(name==='count'&&Number.isFinite(state.count)){state.count=Math.min(30,Math.max(5,state.count));}if(prior!==state[name]){store();if(name==='style')paintSlide();}return;}}
 if(x.id==='ps-chapter-search'){const q=x.value.trim().toLocaleLowerCase();$$('[data-pschapter-row]').forEach(row=>{row.hidden=!row.textContent.toLocaleLowerCase().includes(q)});return;}
 if(x.matches('[data-pschapter]')){const id=x.dataset.pschapter,now=Array.isArray(state.unitIds)?state.unitIds.slice():[];state.unitIds=x.checked?[...new Set([...now,id])]:now.filter(v=>v!==id);state.unitId=state.unitIds[0]||id;const u=currentUnit();state.topics=[];state.pages=state.unitIds.length?String(u?.page||''):'';promptDraft='';store();view();if(!state.unitIds.length)output(tr('Cochez le ou les chapitres à utiliser avant de générer.','Select the chapters you want before generating.'),'info');return;}
 if(x.matches('[data-pstopic]')){const i=Number(x.dataset.pstopic);state.topics=x.checked?[...new Set([...state.topics,i])]:state.topics.filter(v=>v!==i);store();return;}
 if(x.matches('[data-psextra]')){const k=x.dataset.psextra;state.extra=x.checked?[...new Set([...state.extra,k])]:state.extra.filter(v=>v!==k);store();return;}
 if(x.hasAttribute('data-psedit')){const prop=x.dataset.psedit;if(state.slides[state.selected]){state.slides[state.selected][prop]=x.value;state.updatedAt=Date.now();store();paintSlide();}}
}
function actions(e){ const act=e.target.closest('[data-psact]')?.dataset.psact;if(act){e.preventDefault();if(busy)return;(async()=>{try{switch(act){case 'book':await openBook();break;case 'prompt':{promptDraft=chatGPTPrompt();const panel=$('#ps-prompt-panel'),area=$('#ps-prompt-text');if(panel)panel.hidden=false;if(area){area.value=promptDraft;area.focus();area.select();}let ok=false;try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(promptDraft);ok=true;}}catch{}if(!ok&&area){try{ok=document.execCommand('copy')}catch{}}output(ok?pick('promptCopied'):pick('promptManual'),ok?'ok':'info');break;}case 'draft':if(!state.unitIds?.length)throw Error(pick('require'));matchBook();buildOffline();break;case 'export':if(!state.slides.length)throw Error(pick('noSlides'));if(state.slideLang&&state.slideLang!==lang())throw Error(tr('Cette présentation a été rédigée dans une autre langue. Revenez à sa langue ou régénérez-la pour éviter une exportation bilingue.','This presentation was written in another language. Switch back or regenerate to avoid mixed-language exports.'));verifyArithmetic(state.slides);if(!window.MATH_PPTX?.exportLesson)throw Error('PPTX export engine unavailable');window.MATH_PPTX.exportLesson(state.slides,{grade:state.grade,title:state.title||currentUnit()?.title,lang:lang(),style:state.style,animate:'steps',source:currentUnit()?.page,notes:state.extra.includes('notes')});output(tr('Fichier PowerPoint créé.','PowerPoint file created.'),'ok');break;case 'save':saveDeck();break;
 case 'up':case 'down':{const from=state.selected,to=from+(act==='up'?-1:1);if(to>=0&&to<state.slides.length){[state.slides[from],state.slides[to]]=[state.slides[to],state.slides[from]];state.selected=to;store();view();}break;}
 case 'add':{state.slides.splice(state.selected+1,0,{title:tr('Nouvelle diapositive','New slide'),body:'',formula:'',notes:'',answer:'',kind:'lesson',visual:'none'});state.selected++;store();view();break;}
 case 'delete':{if(!confirm(tr('Supprimer cette diapositive ?','Delete this slide?')))return;state.slides.splice(state.selected,1);state.selected=Math.max(0,Math.min(state.selected,state.slides.length-1));store();view();break;}
 }}catch(err){output(String(err.message||err),'error')}finally{busy=false;}})();return;}
 const slide=e.target.closest('[data-psslide]');if(slide){state.selected=Number(slide.dataset.psslide);store();view();return;}
 const load=e.target.closest('[data-psload]');if(load){const deck=saved.find(x=>x.id===load.dataset.psload);if(deck){state={...defaults,...JSON.parse(JSON.stringify(deck))};store();view();}return;}
 const del=e.target.closest('[data-psremove]');if(del){if(!confirm(tr('Supprimer cette présentation enregistrée ?','Delete this saved presentation?')))return;saved=saved.filter(x=>x.id!==del.dataset.psremove);store();view();output(pick('deleted'),'ok');}
}
function init(){if(!units().some(x=>x.id===state.unitId))chooseUnit();const btnCreate=()=>{addNavigation();const button=$('[data-ppt-lesson-nav]');if(button&&!button.dataset.ready){button.dataset.ready='1';button.addEventListener('click',(event)=>{event.stopPropagation();
if(!active){
  state.unitIds=[];
  state.topics=[];
  state.pages='';
  promptDraft='';
  store();
}
active=true;$$('.sidebar .nav-item').forEach(n=>n.classList.toggle('active',n===button));view();if(innerWidth<781)$('#sidebar')?.classList.remove('open');window.scrollTo({top:0,behavior:'auto'});});}}
 btnCreate();document.addEventListener('click',e=>{if(e.target.closest('.sidebar [data-nav]')){if(active){active=false;addNavigation();}}},true);
 document.addEventListener('change',e=>{if(active&&e.target.closest('.ps-root'))changeConfig(e)});document.addEventListener('input',e=>{if(active&&e.target.closest('.ps-root')&& (e.target.matches('[data-psedit]')||e.target.matches('#ps-source,#ps-instructions,#ps-pages,#ps-chapter-search')))changeConfig(e)});
 document.addEventListener('click',e=>{if(active&&e.target.closest('.ps-root'))actions(e)});
 document.addEventListener('click',e=>{if(e.target.closest('[data-global-lang],#langToggle'))setTimeout(()=>{if(rememberedLanguage!==lang()){rememberedLanguage=lang();addNavigation();if(active)view();}},0)},true);
 // A language switch in the older application can re-render #main; restore only
 // our own view when it remains the active sidebar workspace.
 const main=$('#main');if(main)new MutationObserver(()=>{
  if(active&&!main.querySelector('.ps-root'))queueMicrotask(()=>{if(active&&!main.querySelector('.ps-root'))view();});
 }).observe(main,{childList:true});
 // Expose debug-usable state, no changes to the app's persistent namespace.
 window.ATELIER_PRESENTATIONS={open:()=>{btnCreate();$('[data-ppt-lesson-nav]')?.click()},getState:()=>JSON.parse(JSON.stringify(state)),getSaved:()=>saved.length,generateDraft:()=>{buildOffline()}};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

