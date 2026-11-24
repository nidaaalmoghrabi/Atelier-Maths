
/* engine.js */
(function(){
 const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
 const choose=a=>a[R(0,a.length-1)];
 const gcd=(a,b)=>b?gcd(b,a%b):a;
 const lang=()=>window.MATH_GENERATION_LANG||window.MATH_I18N?.getLanguage()||'fr';
 const T=(fr,en)=>lang()==='en'?en:fr;
 const fmt=n=>Number(n).toLocaleString(lang()==='en'?'en-GB':'fr-FR',{maximumFractionDigits:3});
 const frac=(a,b)=>`${a}/${b}`;
 const make=(text,answer,solution,wrong,kind='num')=>({text,answer:String(answer),solution,wrong:wrong||[],kind});
 /* Every 'problème' is an authentic real-life story, not a bare computation. */
 function storyProblem(cat,grade,diff,source=''){
  const k=diff==='facile'?1:diff==='moyen'?2:3;
  const low=String(source||'').toLowerCase();
  let a,b,c,d;
  switch(cat){
   case 'multiplication':{
    a=R(3,8*k);b=R(4,9*k);c=a*b;
    return make(T(`Pour la fête de l’école, Léa prépare ${a} sachets. Elle met ${b} bonbons dans chaque sachet. Combien de bonbons doit-elle prévoir en tout ?`,`For the school fair, Maya makes ${a} gift bags. She puts ${b} sweets in each bag. How many sweets does she need altogether?`),fmt(c),T(`Il y a ${a} groupes de ${b} bonbons. ${a} × ${b} = ${fmt(c)} bonbons.`,`There are ${a} groups of ${b} sweets. ${a} × ${b} = ${fmt(c)} sweets.`),[fmt(c+a),fmt(c+b),fmt(c-b)]);
   }
   case 'division':{
    b=R(3,8);c=R(5,9*k);a=b*c;
    return make(T(`La bibliothèque de l’école reçoit ${a} livres. La bibliothécaire les répartit équitablement sur ${b} étagères. Combien de livres place-t-elle sur chaque étagère ?`,`The school library receives ${a} books. The librarian shares them equally among ${b} shelves. How many books are placed on each shelf?`),fmt(c),T(`La répartition est équitable : ${a} ÷ ${b} = ${c} livres par étagère.`,`The books are shared equally: ${a} ÷ ${b} = ${c} books per shelf.`),[fmt(c+1),fmt(b),fmt(c-1)]);
   }
   case 'arith':{
    if(grade<=4||/multiples|divisib/.test(low)){
     b=choose([2,3,4,5,10]);a=R(7,15*k);c=a*b;
     return make(T(`Pour une sortie scolaire, ${c} élèves doivent monter dans des minibus pouvant accueillir ${b} élèves chacun. Combien de minibus faut-il réserver pour transporter tous les élèves, sans laisser de places vides ?`,`For a school trip, ${c} pupils must travel in minibuses holding ${b} pupils each. How many minibuses are needed to seat everyone without empty seats?`),fmt(a),T(`${c} est un multiple de ${b}. ${c} ÷ ${b} = ${a} minibus.`,`Since ${c} is a multiple of ${b}, ${c} ÷ ${b} = ${a} minibuses.`),[fmt(a+1),fmt(a-1),fmt(b)]);
    }
    if(/l\.c\.m|least common multiple|ppcm/.test(low)){
     a=choose([4,6,8]);b=choose([6,9,10]);c=a*b/gcd(a,b);
     return make(T(`Deux lumières décoratives clignotent ensemble à midi. La première clignote toutes les ${a} secondes et la seconde toutes les ${b} secondes. Après combien de secondes clignoteront-elles à nouveau ensemble pour la première fois ?`,`Two decorative lights flash together at noon. One flashes every ${a} seconds and the other every ${b} seconds. After how many seconds will they next flash together?`),fmt(c),T(`On calcule le PPCM de ${a} et ${b} : ${c}. Elles clignotent ensemble après ${c} secondes.`,`Find the LCM of ${a} and ${b}: ${c}. They flash together after ${c} seconds.`),[fmt(a+b),fmt(gcd(a,b)),fmt(c+a)]);
    }
    a=choose([24,36,48,60]);b=choose([18,30,42,54]);c=gcd(a,b);
    return make(T(`Pour une fête, on dispose de ${a} biscuits et de ${b} jus. On veut préparer le plus grand nombre possible de sachets identiques, sans rien laisser. Combien de sachets peut-on préparer ?`,`For a party, there are ${a} biscuits and ${b} juice cartons. We want to prepare the largest possible number of identical packs without leftovers. How many packs can be made?`),fmt(c),T(`Le nombre de sachets doit diviser ${a} et ${b}. PGCD(${a} ; ${b}) = ${c}. On prépare ${c} sachets.`,`The number of packs must divide both ${a} and ${b}. GCD(${a}, ${b}) = ${c}. We can make ${c} packs.`),[fmt(c+1),fmt(Math.min(a,b)),fmt(c*2)]);
   }
   case 'fraction':{
    b=choose([4,5,6,8,10]);a=R(1,b-1);c=R(3,8*k)*b;d=a*c/b;
    return Object.assign(make(T(`Pour préparer des gâteaux, Sara a acheté ${c} œufs. Elle utilise les ${a}/${b} de ses œufs pour une recette. Combien d’œufs utilise-t-elle ?`,`Sara buys ${c} eggs for baking. She uses ${a}/${b} of them for a recipe. How many eggs does she use?`),fmt(d),T(`On calcule les ${a}/${b} de ${c} : (${c} ÷ ${b}) × ${a} = ${d} œufs.`,`Find ${a}/${b} of ${c}: (${c} ÷ ${b}) × ${a} = ${d} eggs.`),[fmt(c/b),fmt(c-a),fmt(c)]),{visual:{kind:'fraction-parts',numerator:a,denominator:b}});
   }
   case 'decimal':{
    a=R(20,80*k)/10;b=R(12,45*k)/10;c=Math.round((a+b)*10)/10;
    return make(T(`Au marché, Emma achète ${fmt(a)} kg de pommes et ${fmt(b)} kg de poires. Quelle masse de fruits a-t-elle achetée en tout ?`,`At the market, Emma buys ${fmt(a)} kg of apples and ${fmt(b)} kg of pears. What is the total mass of fruit she buys?`),`${fmt(c)} kg`,T(`On additionne les masses : ${fmt(a)} + ${fmt(b)} = ${fmt(c)} kg.`,`Add the masses: ${fmt(a)} + ${fmt(b)} = ${fmt(c)} kg.`),[`${fmt(a)} kg`,`${fmt(b)} kg`,`${fmt(c+1)} kg`],'unit');
   }
   case 'ratio':{
    a=R(2,5);b=R(3,8);c=a*b;d=b*R(2,4);
    return Object.assign(make(T(`Pour une collecte, ${a} cahiers coûtent ${c} €. L’école achète ${d} cahiers au même prix unitaire. Combien doit-elle payer ?`,`For a school collection, ${a} notebooks cost €${c}. The school buys ${d} notebooks at the same unit price. How much must it pay?`),`${b*d} €`,T(`Un cahier coûte ${c} ÷ ${a} = ${b} €. Pour ${d} cahiers : ${d} × ${b} = ${b*d} €.`,`One notebook costs €${c} ÷ ${a} = €${b}. For ${d} notebooks: ${d} × ${b} = €${b*d}.`),[`${c+d} €`,`${b*d+b} €`,`${c} €`],'unit'),{visual:{kind:'proportion-table',top:[a,d],bottom:[c,'?']}});
   }
   case 'statistics':{
    a=R(8,15);b=R(5,11);c=R(3,9);d=a+b+c;
    return Object.assign(make(T(`Dans une classe, ${a} élèves préfèrent le football, ${b} le basket-ball et ${c} le tennis. Chaque élève a choisi un seul sport. Combien d’élèves ont participé au sondage ?`,`In a class survey, ${a} pupils choose football, ${b} choose basketball and ${c} choose tennis. Each pupil selects one sport. How many pupils took part?`),fmt(d),T(`On additionne les effectifs : ${a} + ${b} + ${c} = ${d} élèves.`,`Add the counts: ${a} + ${b} + ${c} = ${d} pupils.`),[fmt(a+b),fmt(d+1),fmt(a+c)]),{visual:{kind:'bar-chart',values:[a,b,c],labels:['F','B','T']}});
   }
   case 'angles':{
    a=choose([20,30,35,40,50,60]);b=90-a;
    return Object.assign(make(T(`Lors d’un atelier de construction, deux supports forment un angle droit. Une demi-droite partage cet angle en deux angles adjacents ; l’un mesure ${a}°. Quelle est la mesure de l’autre ?`,`In a model-building workshop, two supports form a right angle. A line divides this into two adjacent angles; one measures ${a}°. What is the measure of the other?`),`${b}°`,T(`Les deux angles forment 90°. L’angle inconnu mesure 90° − ${a}° = ${b}°.`,`The two angles add up to 90°. The missing angle is 90° − ${a}° = ${b}°.`),[`${a}°`,'90°',`${b+10}°`],'angle'),{visual:{kind:'angles',given:a,total:90}});
   }
   case 'geometry': case 'area':{
    if(/circle|cercle/.test(low)){
     a=R(2,6);b=2*a;
     return Object.assign(make(T(`Pour décorer la cour de l’école, on dessine un massif circulaire de rayon ${a} m. Quelle est la longueur de son diamètre ?`,`A circular flower bed in the schoolyard has a radius of ${a} m. What is its diameter?`),`${b} m`,T(`Le diamètre vaut deux fois le rayon : 2 × ${a} = ${b} m.`,`The diameter is twice the radius: 2 × ${a} = ${b} m.`),[`${a} m`,`${a*a} m`,`${b+1} m`],'unit'),{visual:{kind:'circle-radius',radius:a}});
    }
    a=R(3,7*k);b=R(2,6*k);c=a*b;
    return Object.assign(make(T(`Le jardin de l’école est rectangulaire. Il mesure ${a} m de long et ${b} m de large. Quelle est son aire en mètres carrés ?`,`The school garden is rectangular. It is ${a} m long and ${b} m wide. What is its area in square metres?`),`${c} m²`,T(`L’aire du rectangle est : ${a} × ${b} = ${c} m².`,`Area = length × width = ${a} × ${b} = ${c} m².`),[`${2*(a+b)} m²`,`${a+b} m²`,`${c+a} m²`],'unit'),{visual:{kind:'rectangle',length:a,width:b}});
   }
   case 'time':{
    a=R(1,3);b=choose([10,15,20,30,45]);c=a*60+b;
    return Object.assign(make(T(`Une famille part en randonnée à 9 h. Elle marche pendant ${a} h ${b} min. Quelle est la durée de la randonnée en minutes ?`,`A family starts a hike at 9 a.m. They walk for ${a} h ${b} min. How long is the hike in minutes?`),`${c} min`,T(`${a} h = ${a*60} min, puis ${a*60} + ${b} = ${c} min.`,`${a} h = ${a*60} min, then ${a*60} + ${b} = ${c} min.`),[`${a*100+b} min`,`${a*60} min`,`${c+15} min`],'unit'),{visual:{kind:'clock',hours:a,minutes:b}});
   }
   case 'measurement':{
    a=R(2,8*k);c=a*100;
    return make(T(`Pour préparer une course, les élèves doivent installer un ruban de ${a} m. Ils disposent d’un mètre gradué en centimètres. À combien de centimètres correspond cette longueur ?`,`Pupils need a ${a} m ribbon for a sports event. Their measuring tape is marked in centimetres. How many centimetres long is the ribbon?`),`${c} cm`,T(`Un mètre vaut 100 centimètres : ${a} × 100 = ${c} cm.`,`One metre equals 100 centimetres: ${a} × 100 = ${c} cm.`),[`${a*10} cm`,`${a} cm`,`${c+100} cm`],'unit');
   }
   case 'integers':{
    a=R(2,10*k);b=R(1,8*k);c=b-a;
    return make(T(`Un matin d’hiver, la température est de ${b} °C. Pendant la nuit suivante, elle baisse de ${a} °C. Quelle est alors la température ?`,`On a winter morning, the temperature is ${b} °C. Overnight, it drops by ${a} °C. What is the temperature afterwards?`),`${fmt(c)} °C`,T(`Une baisse de ${a} °C se traduit par une soustraction : ${b} − ${a} = ${fmt(c)} °C.`,`A drop of ${a} °C means subtracting: ${b} − ${a} = ${fmt(c)} °C.`),[`${a+b} °C`,`${fmt(a-b)} °C`,`${b} °C`],'unit');
   }
   case 'powers':{
    a=choose([2,3,4]);b=choose([2,3,4]);c=a**b;
    return make(T(`Dans une exposition, on part d’un seul objet. À chacune des ${b} étapes, on multiplie le nombre d’objets par ${a}. Combien d’objets obtient-on après la dernière étape ?`,`At an exhibition, a display starts with one item. The number of items is multiplied by ${a} at each of ${b} stages. How many items are there after the final stage?`),fmt(c),T(`On effectue ${b} multiplications par ${a} : ${a}^${b} = ${c}.`,`Multiply by ${a} a total of ${b} times: ${a}^${b} = ${c}.`),[fmt(a*b),fmt(c+a),fmt(c-1)]);
   }
   case 'algebra':{
    a=R(2,8*k);b=R(3,10*k);c=2*b+a;
    return make(T(`Pour une sortie, un bus facture ${a} € de frais fixes et ${2} € par élève. La classe paie au total ${c} €. Combien d’élèves ont participé ?`,`For a trip, a bus charges a fixed fee of €${a} plus €2 per pupil. The class pays €${c} in total. How many pupils went?`),fmt(b),T(`Si x est le nombre d’élèves, 2x + ${a} = ${c}. Donc 2x = ${2*b}, puis x = ${b}.`,`Let x be the number of pupils: 2x + ${a} = ${c}. Then 2x = ${2*b}, so x = ${b}.`),[fmt(b+1),fmt(c-a),fmt(a)]);
   }
   case 'numeration':{
    a=R(3,8*k);b=choose([10,100,1000]);c=a*b;
    return make(T(`Une imprimerie prépare ${a} paquets de ${fmt(b)} feuilles pour les cahiers de l’école. Combien de feuilles a-t-elle préparées ?`,`A print shop prepares ${a} packs of ${fmt(b)} sheets for school exercise books. How many sheets are there altogether?`),fmt(c),T(`Il y a ${a} paquets de ${fmt(b)} feuilles : ${a} × ${fmt(b)} = ${fmt(c)} feuilles.`,`There are ${a} packs of ${fmt(b)} sheets: ${a} × ${fmt(b)} = ${fmt(c)} sheets.`),[fmt(c/10),fmt(c*10),fmt(a+b)]);
   }
   case 'symmetry':{
    a=R(3,8);b=R(2,7);
    return make(T(`Sur une mosaïque, le centre d’un carreau se trouve à ${a} cm d’un axe de symétrie. À quelle distance de cet axe se trouve le centre de son image ?`,`The centre of a tile in a mosaic is ${a} cm from a line of symmetry. How far from the line is the centre of its mirror image?`),`${a} cm`,T(`La symétrie axiale conserve la distance à l’axe : ${a} cm.`,`Reflection preserves the perpendicular distance to the mirror line: ${a} cm.`),[`${2*a} cm`,`${a+b} cm`,'0 cm'],'unit');
   }
   default:return storyProblem('multiplication',grade,diff,source);
  }
 }
 function base(cat,grade,diff,kind='court',source=''){
  const k=diff==='facile'?1:diff==='moyen'?2:3;
  if(kind==='probleme')return storyProblem(cat,grade,diff,source);
  source=String(source||'').toLowerCase();
  let a,b,c,d,q,z;
  if(/priority of operations|priorit/.test(source)){
   a=R(2,7);b=R(2,8);c=R(2,7);d=a+b*c;
   return make(T(`Calcule en respectant les priorités opératoires : ${a} + ${b} × ${c}.`,`Calculate using the order of operations: ${a} + ${b} × ${c}.`),fmt(d),T(`On effectue la multiplication avant l’addition : ${b} × ${c} = ${b*c}, puis ${a} + ${b*c} = ${d}.`,`Multiply first: ${b} × ${c} = ${b*c}, then ${a} + ${b*c} = ${d}.`),[fmt((a+b)*c),fmt(a+b+c),fmt(a*b*c)]);
  }
  if(/divisors$|diviseurs$/.test(source)){
   a=choose([12,18,20,24,30]);const vals=Array.from({length:a},(_,i)=>i+1).filter(x=>a%x===0);b=choose(vals.filter(x=>x>1));
   return make(T(`Parmi les nombres ${b}, ${a+1}, ${a+2} et ${a+3}, lequel est un diviseur de ${a} ?`,`Which of ${b}, ${a+1}, ${a+2} and ${a+3} is a divisor of ${a}?`),fmt(b),T(`${a} = ${b} × ${a/b} : ${b} est donc un diviseur de ${a}.`,`${a} = ${b} × ${a/b}, so ${b} is a divisor of ${a}.`),[fmt(a+1),fmt(a+2),fmt(a+3)]);
  }
  if(/divisibility rule|divisibility by|divisibilité par/.test(source)){
   const ds=[...source.matchAll(/(?:by|par)\s+(\d+)/g)].map(x=>+x[1]);b=choose(ds.length?ds:[2,3,5,9,10]);a=R(12,65*k)*b;
   return make(T(`Lequel de ces nombres est divisible par ${b} : ${fmt(a)}, ${fmt(a+1)}, ${fmt(a+b+1)} ou ${fmt(a+2*b+1)} ?`,`Which number is divisible by ${b}: ${fmt(a)}, ${fmt(a+1)}, ${fmt(a+b+1)} or ${fmt(a+2*b+1)}?`),fmt(a),T(`${fmt(a)} = ${b} × ${a/b}. Les trois autres nombres donnent un reste de 1 dans la division par ${b}.`,`${fmt(a)} = ${b} × ${a/b}. The other three numbers give remainder 1 when divided by ${b}.`),[fmt(a+1),fmt(a+b+1),fmt(a+2*b+1)]);
  }
  if(/euclidean division|division euclidienne|remainder of the division/.test(source)){
   b=/by 3 and by 9/.test(source)?choose([3,9]):R(3,9);q=R(5,15*k);c=R(1,b-1);a=b*q+c;
   return make(T(`Détermine le reste de la division euclidienne de ${fmt(a)} par ${b}.`,`Find the remainder when ${fmt(a)} is divided by ${b}.`),fmt(c),T(`${fmt(a)} = ${b} × ${q} + ${c}, avec 0 ≤ ${c} < ${b}. Le reste est ${c}.`,`${fmt(a)} = ${b} × ${q} + ${c}, where 0 ≤ ${c} < ${b}. The remainder is ${c}.`),[fmt(q),fmt(c+b),fmt(0)]);
  }
  if(/(?:multiplying|dividing).*by 10[,; ]|(?:multiplier|diviser).*par 10/.test(source)){
   const divide=/dividing|diviser/.test(source),dec=/decimal|décimal/.test(source);b=choose([10,100,1000]);a=dec?R(15,95*k)/10:R(2,85*k);if(divide&&!dec)a*=b;d=divide?a/b:a*b;
   return make(T(`Calcule : ${fmt(a)} ${divide?'÷':'×'} ${fmt(b)}.`,`Calculate: ${fmt(a)} ${divide?'÷':'×'} ${fmt(b)}.`),fmt(d),T(`On ${divide?'divise':'multiplie'} par ${fmt(b)} : ${fmt(a)} ${divide?'÷':'×'} ${fmt(b)} = ${fmt(d)}.`,`${divide?'Divide':'Multiply'} by ${fmt(b)}: ${fmt(a)} ${divide?'÷':'×'} ${fmt(b)} = ${fmt(d)}.`),[fmt(d*10),fmt(d/10),fmt(d+1)]);
  }
  if(/dividing a decimal|decimal quotient|division of decimal|division de.*décima/.test(source)){
   b=R(2,9);q=R(11,79*k)/10;a=Math.round(b*q*10)/10;
   return make(T(`Calcule le quotient décimal exact de ${fmt(a)} par ${fmt(b)}.`,`Find the exact decimal quotient of ${fmt(a)} divided by ${fmt(b)}.`),fmt(q),T(`On vérifie par multiplication : ${fmt(q)} × ${fmt(b)} = ${fmt(a)}. Le quotient est ${fmt(q)}.`,`Check by multiplication: ${fmt(q)} × ${fmt(b)} = ${fmt(a)}. The quotient is ${fmt(q)}.`),[fmt(q*10),fmt(q/10),fmt(q+1)]);
  }
  if(/decimal fractions|fractions décimales/.test(source)){
   b=choose([10,100,1000]);a=R(1,b-1);d=a/b;
   return make(T(`Écris ${a}/${b} sous forme décimale.`,`Write ${a}/${b} as a decimal.`),fmt(d),T(`${a}/${b} = ${a} ÷ ${b} = ${fmt(d)}.`,`${a}/${b} = ${a} ÷ ${b} = ${fmt(d)}.`),[fmt(d*10),fmt(d/10),fmt(d+1)]);
  }
  if(/less than one|greater than one/.test(source)){
   b=R(3,9);a=R(1,b-1);c=b+R(1,5);return make(T(`Laquelle de ces fractions est strictement supérieure à 1 ?`,`Which fraction is strictly greater than 1?`),`${c}/${b}`,T(`Le numérateur ${c} est supérieur au dénominateur ${b}, donc ${c}/${b} > 1.`,`The numerator ${c} is greater than denominator ${b}, so ${c}/${b} > 1.`),[`${a}/${b}`,`${b}/${b}`,`1/${b}`],'fraction');
  }
  if(/length of a circle|area of a disc|perimeter.*circle/.test(source)){
   a=R(2,6);b=choose([0,1]);d=b?Math.round(3.14*a*a*100)/100:Math.round(2*3.14*a*100)/100;
   return Object.assign(make(T(`Un cercle a un rayon de ${a} cm. Calcule ${b?'l’aire du disque':'le périmètre du cercle'} en prenant π ≈ 3,14.`,`A circle has radius ${a} cm. Calculate ${b?'the area of the disc':'its circumference'} using π ≈ 3.14.`),`${fmt(d)} ${b?'cm²':'cm'}`,T(`${b?'A = π × r²':'P = 2 × π × r'} ≈ ${b?'3,14 × '+a+'²':'2 × 3,14 × '+a} ≈ ${fmt(d)} ${b?'cm²':'cm'}.`,`${b?'A = π × r²':'C = 2 × π × r'} ≈ ${b?'3.14 × '+a+'²':'2 × 3.14 × '+a} ≈ ${fmt(d)} ${b?'cm²':'cm'}.`),[`${fmt(a*2)} ${b?'cm²':'cm'}`,`${fmt(d+1)} ${b?'cm²':'cm'}`,`${fmt(d*2)} ${b?'cm²':'cm'}`],'unit'),{visual:{kind:'circle-radius',radius:a}});
  }
  switch(cat){
   case 'arith':{
    if(grade===4||/multiple|divisib/.test(source)){
      b=grade===4?choose([2,3,4,5,10]):choose([2,3,4,5,9,10]);
      const specific=[...source.matchAll(/by\s+(\d+)/g)].map(m=>Number(m[1]));if(specific.length)b=choose(specific);a=R(6,15*k);c=b*a;
      return make(T(`Quel est le plus petit multiple de ${b} strictement supérieur à ${c-b} ?`,`What is the smallest multiple of ${b} strictly greater than ${c-b}?`),fmt(c),T(`Les multiples de ${b} sont ${b}, ${b*2}, ${b*3}, … Le premier qui dépasse ${c-b} est ${c}.`,`The multiples of ${b} include ${b}, ${b*2}, ${b*3}, … The first multiple greater than ${c-b} is ${c}.`),[fmt(c+b),fmt(c-b),fmt(c+1)]);
    }
    if(/prime factor|facteurs premiers/.test(source)){
      const fact=choose([[2,2,3],[2,3,5],[3,3,2],[2,2,5]]),n=fact.reduce((x,y)=>x*y,1),factor=fact.join(' × ');
      return make(T(`Décompose ${n} en un produit de facteurs premiers.`,`Express ${n} as a product of prime factors.`),factor,T(`${n} = ${factor}. Chaque facteur est un nombre premier.`,`${n} = ${factor}. Each factor is a prime number.`),[`${n} × 1`,`${n/2} × 2`,`${n-1} × 1`],'text');
    }
    if(/prime number|nombres premiers/.test(source)){
      const prime=choose([11,13,17,19,23,29]);return make(T('Parmi les nombres suivants, lequel est premier : 12, 15, '+prime+' ou 21 ?', 'Which of the following numbers is prime: 12, 15, '+prime+' or 21?'),fmt(prime),T(`${prime} possède exactement deux diviseurs positifs : 1 et ${prime}. Les autres nombres proposés ont davantage de diviseurs.`,`${prime} has exactly two positive divisors: 1 and ${prime}. The other choices have more than two divisors.`),['12','15','21']);
    }
    a=choose([6,8,9,12,15])*R(1,k+1);b=choose([12,18,20,24,30])*R(1,k+1);
    const wantPPCM=/l\.c\.m|least common multiple|ppcm/.test(source)||(/both|common divisor and least/.test(source)&&Math.random()>.5);
    const wantPGCD=/g\.c\.d|greatest common divisor|pgcd/.test(source);
    if(!wantPPCM&&(wantPGCD||grade<7||Math.random()>.5))return make(T(`Calcule le PGCD de ${a} et ${b}.`,`Find the GCD of ${a} and ${b}.`),fmt(gcd(a,b)),T(`On recherche les diviseurs communs de ${a} et de ${b}. Leur plus grand élément est ${gcd(a,b)}.`,`List the common divisors of ${a} and ${b}. The greatest of them is ${gcd(a,b)}.`),[fmt(Math.min(a,b)+1),fmt(gcd(a,b)+1),fmt(gcd(a,b)*2)]);
    c=a*b/gcd(a,b);return make(T(`Calcule le PPCM de ${a} et ${b}.`,`Find the LCM of ${a} and ${b}.`),fmt(c),T(`On utilise la relation : PPCM(${a} ; ${b}) = (${a} × ${b}) ÷ PGCD(${a} ; ${b}) = ${fmt(c)}.`,`Use the formula: LCM(${a}, ${b}) = (${a} × ${b}) ÷ GCD(${a}, ${b}) = ${fmt(c)}.`),[fmt(a*b),fmt(gcd(a,b)),fmt(a+b)]);
   }
   case 'multiplication':{
    a=R(4,12*k);b=R(3,9*k);c=a*b;
    return make(kind==='probleme'?T(`Une classe commande ${a} boîtes contenant chacune ${b} crayons. Combien de crayons commande-t-elle ?`,`A class orders ${a} boxes containing ${b} pencils each. How many pencils does the class order?`):T(`Calcule : ${a} × ${b}.`,`Calculate: ${a} × ${b}.`),fmt(c),T(`On multiplie ${a} par ${b} : ${a} × ${b} = ${fmt(c)}.`,`Multiply ${a} by ${b}: ${a} × ${b} = ${fmt(c)}.`),[fmt(c+a),fmt(c+b),fmt(c-1)]);
   }
   case 'division':{
    b=R(3,8+k);q=R(4,12*k);a=q*b;return make(kind==='probleme'?T(`On répartit ${a} cahiers équitablement entre ${b} groupes. Combien de cahiers chaque groupe reçoit-il ?`,`A teacher shares ${a} notebooks equally among ${b} groups. How many notebooks does each group receive?`):T(`Calcule le quotient exact : ${a} ÷ ${b}.`,`Calculate the exact quotient: ${a} ÷ ${b}.`),fmt(q),T(`${a} = ${b} × ${q}, donc ${a} ÷ ${b} = ${q}.`,`${a} = ${b} × ${q}, so ${a} ÷ ${b} = ${q}.`),[fmt(q+1),fmt(b),fmt(q-1)]);
   }
   case 'fraction':{
    b=choose([4,5,6,8,10,12]);a=R(1,b-2);c=R(1,b-a-1);
    if(/compar|comparing/.test(source)){
      const sameNum=/numerator|numérateur/.test(source),aa=R(1,5),bb=R(5,9),cc=sameNum?aa:R(1,5),dd=sameNum?bb+R(1,4):bb;
      const left=aa/bb,right=cc/dd,sign=left===right?'=':left>right?'>':'<';
      return make(T(`Compare les deux fractions en complétant avec <, > ou = : ${frac(aa,bb)} … ${frac(cc,dd)}.`,`Compare the fractions using <, > or =: ${frac(aa,bb)} … ${frac(cc,dd)}.`),sign,T(`On compare les valeurs : ${frac(aa,bb)} ${sign} ${frac(cc,dd)}. ${sameNum?'À numérateur identique, le plus petit dénominateur donne la plus grande fraction.':'On peut ramener les fractions au même dénominateur pour les comparer.'}`,`Compare the values: ${frac(aa,bb)} ${sign} ${frac(cc,dd)}. ${sameNum?'With equal numerators, the smaller denominator gives the larger fraction.':'You can use a common denominator to compare the fractions.'}`),['<','>','='].filter(x=>x!==sign),'text');
    }
    if(/fraction of a number|fractions of a number|fraction d’un nombre/.test(source)){
      b=choose([3,4,5,8]);a=R(1,b-1);c=R(3,8)*b;d=a*c/b;
      return make(T(`Calcule ${frac(a,b)} de ${c}.`,`Find ${frac(a,b)} of ${c}.`),fmt(d),T(`On divise d’abord ${c} par ${b}, puis on multiplie le quotient par ${a} : (${c} ÷ ${b}) × ${a} = ${d}.`,`First divide ${c} by ${b}, then multiply by ${a}: (${c} ÷ ${b}) × ${a} = ${d}.`),[fmt(c/b),fmt(a*c),fmt(d+b)]);
    }
    if(/simplif|irreducib|equal fractions/.test(source)){
      b=choose([3,4,5,6]);a=R(2,b-1);c=R(2,5);d=gcd(a,b);
      return make(T(`Simplifie la fraction ${frac(a*c,b*c)}.`,`Simplify the fraction ${frac(a*c,b*c)}.`),frac(a/d,b/d),T(`On divise le numérateur et le dénominateur par leur PGCD, ${d*c} : ${frac(a*c,b*c)} = ${frac(a/d,b/d)}.`,`Divide the numerator and denominator by their GCD, ${d*c}: ${frac(a*c,b*c)} = ${frac(a/d,b/d)}.`),[frac(a,b*c),frac(a*c,b),frac(b/d,a/d)],'fraction');
    }
    if(/unit fraction|fractions - unit/.test(source)){b=choose([3,4,5,6,8]);return make(T(`Quel est le numérateur de la fraction unitaire ${frac(1,b)} ?`,`What is the numerator of the unit fraction ${frac(1,b)}?`),'1',T(`Une fraction unitaire possède toujours un numérateur égal à 1.`,`The numerator of a unit fraction is always 1.`),['0',fmt(b),fmt(b-1)]);} 
    if(/mixed number|nombres mixtes/.test(source)){
      b=R(2,6);a=R(1,b-1);c=R(1,4);d=c*b+a;
      return make(T(`Écris le nombre mixte ${c} + ${frac(a,b)} sous la forme d’une seule fraction.`,`Write the mixed number ${c} + ${frac(a,b)} as a single fraction.`),frac(d,b),T(`${c} = ${frac(c*b,b)}, donc ${c} + ${frac(a,b)} = ${frac(d,b)}.`,`${c} = ${frac(c*b,b)}, so ${c} + ${frac(a,b)} = ${frac(d,b)}.`),[frac(c+a,b),frac(c*b,b),frac(d,b+1)],'fraction');
    }
    if(/subtraction|soustraction/.test(source)&&!/addition and subtraction/.test(source)){
      c=R(1,b-2);a=R(c+1,b-1);d=a-c;return make(T(`Calcule : ${frac(a,b)} − ${frac(c,b)}.`,`Calculate: ${frac(a,b)} − ${frac(c,b)}.`),frac(d/gcd(d,b),b/gcd(d,b)),T(`Les fractions ont le même dénominateur : (${a} − ${c})/${b} = ${frac(d,b)}, à simplifier si nécessaire.`,`The fractions have the same denominator: (${a} − ${c})/${b} = ${frac(d,b)}. Simplify if necessary.`),[frac(d,2*b),frac(a+c,b),frac(d+1,b)],'fraction');
    }
    if(choose([0,1])===0){let gg=gcd(a+c,b),num=(a+c)/gg,den=b/gg;return make(T(`Calcule et simplifie : ${frac(a,b)} + ${frac(c,b)}.`,`Calculate and simplify: ${frac(a,b)} + ${frac(c,b)}.`),frac(num,den),T(`Les dénominateurs sont identiques : (${a} + ${c})/${b} = ${frac(a+c,b)} = ${frac(num,den)}.`,`The denominators are the same: (${a} + ${c})/${b} = ${frac(a+c,b)} = ${frac(num,den)}.`),[frac(a+c,b*2),frac(a+c+1,b),frac(a*c,b)] ,'fraction')}
    d=R(2,5);return make(T(`Complète l'égalité : ${frac(a,b)} = …/${b*d}.`,`Complete the equality: ${frac(a,b)} = …/${b*d}.`),fmt(a*d),T(`On multiplie le numérateur et le dénominateur par ${d} : ${frac(a*d,b*d)}.`,`Multiply the numerator and denominator by ${d}: ${frac(a*d,b*d)}.`),[fmt(a),fmt(b*d),fmt(a*d+1)]);
   }
   case 'decimal':{
    a=R(20,90*k)/10;b=R(11,50*k)/10;c=Math.round((a+b)*10)/10;
    if(/compar/.test(source)){
      b=Math.round((a+(choose([-3,-2,-1,1,2,3]))/10)*10)/10;const sign=a<b?'<':'>';
      return make(T(`Complète avec < ou > : ${fmt(a)} … ${fmt(b)}.`,`Insert < or >: ${fmt(a)} … ${fmt(b)}.`),sign,T(`On compare la partie entière, puis les dixièmes : ${fmt(a)} ${sign} ${fmt(b)}.`,`Compare the whole-number parts, then the tenths: ${fmt(a)} ${sign} ${fmt(b)}.`),[sign==='<'?'>':'<','=',T('Impossible à déterminer','Cannot be determined')],'text');
    }
    if(/subtraction|soustraction/.test(source)){
      const low=Math.min(a,b),hi=Math.max(a,b);c=Math.round((hi-low)*10)/10;
      return make(T(`Calcule : ${fmt(hi)} − ${fmt(low)}.`,`Calculate: ${fmt(hi)} − ${fmt(low)}.`),fmt(c),T(`On aligne les virgules : ${fmt(hi)} − ${fmt(low)} = ${fmt(c)}.`,`Align the decimal points: ${fmt(hi)} − ${fmt(low)} = ${fmt(c)}.`),[fmt(hi+low),fmt(c+.1),fmt(c+1)]);
    }
    if(/multipli/.test(source)){
      b=R(2,7);c=Math.round(a*b*10)/10;return make(T(`Calcule : ${fmt(a)} × ${b}.`,`Calculate: ${fmt(a)} × ${b}.`),fmt(c),T(`On calcule le produit puis on place la virgule au bon rang : ${fmt(a)} × ${b} = ${fmt(c)}.`,`Calculate the product, then place the decimal point correctly: ${fmt(a)} × ${b} = ${fmt(c)}.`),[fmt(a+b),fmt(c/10),fmt(c+.1)]);
    }
    return make(kind==='probleme'?T(`Une bouteille contient ${fmt(a)} L d’eau. On y ajoute ${fmt(b)} L. Quelle quantité d’eau contient-elle maintenant ?`,`A bottle contains ${fmt(a)} L of water. Another ${fmt(b)} L is added. How much water does it contain now?`):T(`Calcule : ${fmt(a)} + ${fmt(b)}.`,`Calculate: ${fmt(a)} + ${fmt(b)}.`),fmt(c),T(`On aligne les virgules : ${fmt(a)} + ${fmt(b)} = ${fmt(c)}.`,`Align the decimal points: ${fmt(a)} + ${fmt(b)} = ${fmt(c)}.`),[fmt(c+1),fmt(Math.abs(a-b)),fmt(c+.1)]);
   }
   case 'ratio':{
    a=R(2,7);b=R(3,9);q=R(2,5);c=a*q;d=b*q;
    return Object.assign(make(kind==='probleme'?T(`Le prix de ${a} cahiers identiques est ${c} €. Quel est le prix de ${b} cahiers ?`,`The price of ${a} identical notebooks is €${c}. What is the price of ${b} notebooks?`):T(`Complète le tableau de proportionnalité ci-dessous.`,`Complete the proportionality table below.`),fmt(d),T(`Le coefficient de proportionnalité est ${c} ÷ ${a} = ${q}. Ainsi, ${b} × ${q} = ${d}.`,`The proportionality coefficient is ${c} ÷ ${a} = ${q}. Thus, ${b} × ${q} = ${d}.`),[fmt(d+q),fmt(b+q),fmt(c+b)]),{visual:{kind:'proportion-table',top:[a,b],bottom:[c,'?']}});
   }
   case 'statistics':{
    if(grade===4){a=R(4,12);b=R(2,6);c=R(1,8);return Object.assign(make(T(`Le diagramme représente les préférences sportives de trois groupes d’élèves. Combien d’élèves ont participé à l’enquête ?`,`The chart represents three groups of students' sports preferences. How many students took part in the survey?`),fmt(a+b+c),T(`On additionne les trois effectifs : ${a} + ${b} + ${c} = ${a+b+c}.`,`Add the three counts: ${a} + ${b} + ${c} = ${a+b+c}.`),[fmt(a+b),fmt(a+c),fmt(a+b+c+1)]),{visual:{kind:'bar-chart',values:[a,b,c],labels:['F','B','N']}});}
    b=choose([20,40,50,100]);a=b*choose(b===50?[.1,.2,.5]:[.1,.2,.25,.5]);c=100*a/b;
    return Object.assign(make(T(`Sur ${b} élèves interrogés, ${a} ont choisi la lecture. Quel pourcentage du groupe cela représente-t-il ?`,`Of ${b} students surveyed, ${a} chose reading. What percentage of the group is that?`),`${fmt(c)} %`,T(`On calcule (${a} ÷ ${b}) × 100 = ${fmt(c)} %.`,`Calculate (${a} ÷ ${b}) × 100 = ${fmt(c)}%.`),[`${fmt(c+5)} %`,`${fmt(100-c)} %`,`${fmt(a)} %`],'percentage'),{visual:{kind:'ratio-bar',part:a,total:b}});
   }
   case 'angles':{
    a=R(2,7)*10;z=choose([90,180]);b=z-a;const word=z===90?'complémentaire':'supplémentaire';
    return Object.assign(make(T(`Sur le schéma, deux angles adjacents forment un angle ${z===90?'droit':'plat'}. L’un mesure ${a}°. Calcule l’autre.`,`In the diagram, two adjacent angles form a ${z===90?'right':'straight'} angle. One measures ${a}°. Calculate the other.`),`${b}°`,T(`Deux angles ${word}s ont une somme de ${z}°. Donc ${z}° − ${a}° = ${b}°.`,`Two ${z===90?'complementary':'supplementary'} angles add up to ${z}°. Therefore, ${z}° − ${a}° = ${b}°.`),[`${a}°`,`${a+b+10}°`,`${Math.abs(b-10)}°`],'angle'),{visual:{kind:'angles',given:a,total:z}});
   }
   case 'area':{
    a=R(3,9*k);b=R(2,8*k);const isPerim=choose([true,false]);c=isPerim?2*(a+b):a*b;
    return Object.assign(make(T(`Observe le rectangle ABCD : AB = ${a} cm et BC = ${b} cm. Calcule ${isPerim?'son périmètre':'son aire'}.`,`Look at rectangle ABCD: AB = ${a} cm and BC = ${b} cm. Calculate its ${isPerim?'perimeter':'area'}.`),`${fmt(c)} ${isPerim?'cm':'cm²'}`,isPerim?`P = 2 × (${a} + ${b}) = ${fmt(c)} cm.`:`A = ${a} × ${b} = ${fmt(c)} cm².`,[`${fmt(a*b)} cm`,`${fmt(a+b)} cm`,`${fmt(c+2)} ${isPerim?'cm':'cm²'}`],'unit'),{visual:{kind:'rectangle',length:a,width:b}});
   }
   case 'time':{
    a=R(1,3*k);b=choose([10,15,20,30,45]);c=a*60+b;
    return Object.assign(make(T(`Exprime ${a} h ${b} min en minutes.`,`Convert ${a} h ${b} min into minutes.`),`${c} min`,T(`1 h = 60 min. Donc ${a} × 60 + ${b} = ${c} min.`,`1 h = 60 min. Therefore, ${a} × 60 + ${b} = ${c} min.`),[`${a*100+b} min`,`${a*60} min`,`${c+10} min`],'unit'),{visual:{kind:'clock',hours:a,minutes:b}});
   }
   case 'measurement':{
    a=R(2,12*k);const conv=choose([{u:'m',v:'cm',f:100},{u:'kg',v:'g',f:1000},{u:'L',v:'mL',f:1000}]);c=a*conv.f;
    return make(T(`Convertis : ${a} ${conv.u} = … ${conv.v}.`,`Convert: ${a} ${conv.u} = … ${conv.v}.`),fmt(c),T(`1 ${conv.u} = ${fmt(conv.f)} ${conv.v}. On calcule ${a} × ${fmt(conv.f)} = ${fmt(c)}.`,`1 ${conv.u} = ${fmt(conv.f)} ${conv.v}. Calculate ${a} × ${fmt(conv.f)} = ${fmt(c)}.`),[fmt(a*10),fmt(a*conv.f/10),fmt(c+100)]);
   }
   case 'powers':{
    a=R(2,grade===7?5:4);b=R(2,Math.min(5,k+2));c=a**b;
    return make(T(`Calcule : ${a}^${b}.`,`Calculate: ${a}^${b}.`),fmt(c),T(`${a}^${b} signifie ${Array(b).fill(a).join(' × ')} = ${fmt(c)}.`,`${a}^${b} means ${Array(b).fill(a).join(' × ')} = ${fmt(c)}.`),[fmt(a*b),fmt(c+a),fmt(c-1)]);
   }
   case 'algebra':{
    a=R(2,8*k);b=R(3,11*k);c=a+b; const mode=grade>=7?choose([0,1]):0;
    if(mode===1)return make(T(`Résous l’équation : x + ${a} = ${c}.`,`Solve the equation: x + ${a} = ${c}.`),fmt(b),T(`On soustrait ${a} des deux côtés : x = ${c} − ${a} = ${b}.`,`Subtract ${a} from both sides: x = ${c} − ${a} = ${b}.`),[fmt(c),fmt(a),fmt(b+1)]);
    return make(T(`Calcule la valeur de A = 2x + ${a} pour x = ${b}.`,`Evaluate A = 2x + ${a} when x = ${b}.`),fmt(2*b+a),`A = 2 × ${b} + ${a} = ${2*b+a}.`,[fmt(b+a),fmt(2*(b+a)),fmt(2*b-a)]);
   }
   case 'integers':{
    a=R(3,15*k);b=R(2,10*k);c=a-b;
    return make(T(`Calcule : (+${a}) + (−${b}).`,`Calculate: (+${a}) + (−${b}).`),fmt(c),T(`Ajouter un nombre négatif revient à soustraire sa valeur absolue : ${a} − ${b} = ${fmt(c)}.`,`Adding a negative number is the same as subtracting its absolute value: ${a} − ${b} = ${fmt(c)}.`),[fmt(a+b),fmt(-a-b),fmt(b-a)]);
   }
   case 'numeration':{
    a=R(2,8*k);b=choose([10,100,1000]);c=a*b;
    return make(T(`Calcule : ${a} × ${fmt(b)}.`,`Calculate: ${a} × ${fmt(b)}.`),fmt(c),T(`On multiplie ${a} par ${fmt(b)} : le résultat est ${fmt(c)}.`,`Multiply ${a} by ${fmt(b)} to obtain ${fmt(c)}.`),[fmt(a+b),fmt(c/10),fmt(c*10)]);
   }
   case 'geometry':{
    if(/location|repérage/.test(source)){a=R(-8,8);b=R(-8,8);return make(T(`Dans un repère, A(${a} ; ${b}). Quelle est l’abscisse du point A ?`,`In a coordinate plane, A(${a}, ${b}). What is the x-coordinate of point A?`),fmt(a),T(`L’abscisse est la première coordonnée du point. Elle vaut ${a}.`,`The x-coordinate is the first coordinate of the point: ${a}.`),[fmt(b),fmt(a+1),fmt(-a)]);}
    if(/circle|cercle/.test(source)){
      a=R(2,7);return Object.assign(make(T(`Sur la figure, le cercle de centre O a un rayon de ${a} cm. Calcule son diamètre.`,`The circle shown has centre O and radius ${a} cm. Calculate its diameter.`),`${2*a} cm`,T(`Le diamètre est égal au double du rayon : ${a} × 2 = ${2*a} cm.`,`The diameter is twice the radius: ${a} × 2 = ${2*a} cm.`),[`${a} cm`,`${a*a} cm`,`${2*a+1} cm`],'unit'),{visual:{kind:'circle-radius',radius:a}});
    }
    if(/parallel|perpendicular|parallèle|droite/.test(source)){
      return make(T('Deux droites distinctes sont perpendiculaires à une même troisième droite. Quelle est leur position relative ?', 'Two distinct lines are perpendicular to the same line. What is their relative position?'),T('Elles sont parallèles','They are parallel'),T('Propriété : deux droites perpendiculaires à une même droite sont parallèles.', 'Two lines perpendicular to the same line are parallel.'),[T('Elles sont perpendiculaires','They are perpendicular'),T('Elles sont confondues','They coincide'),T('Elles sont sécantes','They intersect')],'text');
    }
    if(/congruent|isométriques/.test(source)){
      a=R(3,9);return make(T(`Les triangles ABC et DEF sont isométriques, avec A correspondant à D, B à E et C à F. Si AB = ${a} cm, combien mesure DE ?`,`Triangles ABC and DEF are congruent, with A corresponding to D, B to E, and C to F. If AB = ${a} cm, what is DE?`),`${a} cm`,T('Des triangles isométriques ont leurs côtés correspondants de même longueur : DE = AB.', 'Congruent triangles have equal corresponding sides: DE = AB.'),[`${a+1} cm`,`${2*a} cm`,`${a-1} cm`],'unit');
    }
    if(/triangle/.test(source)&&grade>=6){
      a=R(3,7);b=a+R(2,5);c=choose([a+b-1,a+b+2]);const possible=c<a+b;
      return make(T(`Peut-on construire un triangle dont les côtés mesurent ${a} cm, ${b} cm et ${c} cm ?`,`Can you construct a triangle with side lengths ${a} cm, ${b} cm and ${c} cm?`),possible?T('Oui','Yes'):T('Non','No'),T(`Un triangle est constructible si la longueur du plus grand côté est strictement inférieure à la somme des deux autres. Ici, ${c} ${possible?'<':'>'} ${a}+${b}.`,`A triangle can be constructed only if its longest side is shorter than the sum of the other two. Here, ${c} ${possible?'<':'>'} ${a}+${b}.`),[possible?T('Non','No'):T('Oui','Yes'),T('Toujours','Always'),T('Seulement s’il est rectangle','Only if it is right-angled')],'text');
    }
    if(/pyramid|pyramide/.test(source)){const tri=/triangular|triangulaire|tetrahedron/.test(source),ns=tri?4:5;return make(T(`Combien de sommets possède une pyramide à base ${tri?'triangulaire':'carrée'} ?`,`How many vertices does a pyramid with a ${tri?'triangular':'square'} base have?`),fmt(ns),T(`La base comporte ${ns-1} sommets et l’apex en ajoute un : ${ns} sommets au total.`,`The base has ${ns-1} vertices, and the apex adds one more, giving ${ns} vertices.`),[fmt(ns+1),fmt(ns-1),'8']);}
    if(/prism|prisme/.test(source)){return make(T('Combien de faces possède un prisme droit à base triangulaire ?', 'How many faces does a right triangular prism have?'), '5',T('Il possède deux faces triangulaires et trois faces latérales rectangulaires, soit cinq faces.', 'It has two triangular faces and three rectangular side faces: five faces in total.'),['3','4','6']);}
    if(/solids|volume|solides/.test(source)){a=R(2,6);return make(T(`Calcule le volume d’un cube dont l’arête mesure ${a} cm.`,`Calculate the volume of a cube with an edge length of ${a} cm.`),`${a*a*a} cm³`,T(`Le volume d’un cube est égal au cube de la longueur de son arête : ${a}³ = ${a*a*a} cm³.`,`The volume of a cube is the cube of its edge length: ${a}³ = ${a*a*a} cm³.`),[`${a*a} cm³`,`${6*a*a} cm³`,`${3*a} cm³`],'unit');}
    if(/cube|space geometry|géométrie dans l’espace/.test(source)){
      return make(T('Combien d’arêtes possède un cube ?', 'How many edges does a cube have?'), '12',T('Un cube possède 6 faces carrées, 8 sommets et 12 arêtes.', 'A cube has 6 square faces, 8 vertices and 12 edges.'),['6','8','10']);
    }
    if(/square|carré/.test(source)&&!/pyramid|pyramide/.test(source)){
      a=R(3,Math.min(12,9*k));return Object.assign(make(T(`Observe le carré ABCD dont le côté mesure ${a} cm. Calcule son périmètre.`,`Look at square ABCD, whose side measures ${a} cm. Calculate its perimeter.`),`${4*a} cm`,T(`Les quatre côtés du carré sont de même longueur : P = 4 × ${a} = ${4*a} cm.`,`All four sides of a square are equal: P = 4 × ${a} = ${4*a} cm.`),[`${a*a} cm`,`${2*a} cm`,`${a+4} cm`],'unit'),{visual:{kind:'square-side',side:a}});
    }
    if(/quadrilateral|quadrilatère/.test(source)){a=R(3,9);return Object.assign(make(T(`La figure représente un carré ABCD de côté ${a} cm. Calcule son périmètre.`,`The diagram shows a square ABCD with side length ${a} cm. Calculate its perimeter.`),`${4*a} cm`,T(`Un carré a quatre côtés égaux. P = 4 × ${a} = ${4*a} cm.`,`A square has four equal sides. P = 4 × ${a} = ${4*a} cm.`),[`${a*a} cm`,`${a*2} cm`,`${a+4} cm`],'unit'),{visual:{kind:'square-side',side:a}});}
    const shape=choose([{n:'triangle',s:3},{n:'quadrilatère',s:4},{n:'pentagone',s:5},{n:'hexagone',s:6}]);
    return make(T(`Combien de côtés possède un ${shape.n} ?`,`How many sides does a ${shape.n==='quadrilatère'?'quadrilateral':shape.n==='pentagone'?'pentagon':shape.n==='hexagone'?'hexagon':'triangle'} have?`),fmt(shape.s),T(`Par définition, un ${shape.n} possède ${shape.s} côtés.`,`By definition, a ${shape.n==='quadrilatère'?'quadrilateral':shape.n==='pentagone'?'pentagon':shape.n==='hexagone'?'hexagon':'triangle'} has ${shape.s} sides.`),[fmt(shape.s+1),fmt(shape.s-1),fmt(shape.s+2)]);
   }
   case 'symmetry':{
    a=R(1,6);b=R(1,7);
    if(/translation/.test(source)){c=R(1,4);d=R(1,4);return make(T(`Le point A(${a} ; ${b}) est translaté selon le vecteur de coordonnées (${c} ; ${d}). Quelles sont les coordonnées de son image A′ ?`,`Point A(${a}, ${b}) is translated by vector (${c}, ${d}). What are the coordinates of its image A′?`),`(${a+c} ; ${b+d})`,T(`On ajoute les coordonnées du vecteur : A′(${a} + ${c} ; ${b} + ${d}) = (${a+c} ; ${b+d}).`,`Add the vector coordinates: A′(${a} + ${c}, ${b} + ${d}) = (${a+c}, ${b+d}).`),[`(${a-c} ; ${b-d})`,`(${a+c} ; ${b})`,`(${a} ; ${b+d})`],'text');}
    if(/homothecy|homothétie/.test(source)){c=R(2,4);d=R(2,5);return make(T(`Une figure est agrandie avec un rapport d’homothétie égal à ${c}. Quelle est la longueur de l’image d’un segment de ${d} cm ?`,`A figure is enlarged by a scale factor of ${c}. What is the image length of a ${d} cm segment?`),`${c*d} cm`,T(`Le rapport d’agrandissement multiplie toutes les longueurs : ${d} × ${c} = ${c*d} cm.`,`The scale factor multiplies every length: ${d} × ${c} = ${c*d} cm.`),[`${c+d} cm`,`${d} cm`,`${d/c} cm`],'unit');}
    if(grade>=7)return make(T(`Dans un repère, A(${a} ; ${b}). Quelles sont les coordonnées du symétrique de A par rapport à l’origine O ?`,`In a coordinate plane, A(${a}, ${b}). What are the coordinates of the reflection of A in the origin O?`),`(−${a} ; −${b})`,T(`La symétrie centrale de centre O change le signe des deux coordonnées.`,`Reflection in the origin changes the signs of both coordinates.`),[`(${a} ; −${b})`,`(−${a} ; ${b})`,`(${a} ; ${b})`],'text');
    return make(T('La symétrie axiale conserve-t-elle les longueurs ?', 'Does reflection in a line preserve lengths?'),T('Oui','Yes'),T('Une symétrie axiale conserve les distances et les mesures des segments.', 'Reflection in a line preserves distances and segment lengths.'),[T('Non','No'),T('Seulement les angles','Angles only'),T('Seulement les périmètres','Perimeters only')],'text');
   }
   default:return base(choose(['multiplication','fraction','division','decimal']),grade,diff,kind,source);
  }
 }
 function matchUnit(u){const name=(u.original||u.title||'').toLowerCase();const raw=u.category||'revision';
 if(/priority of operations|priorit/.test(name))return 'algebra';
 if(/multiplying|multiplication/.test(name)&&!/integers|fraction/.test(name))return /decimal/.test(name)?'decimal':'multiplication';
 if(/division|dividing/.test(name)&&!/integers|fraction|time|divisibility|remainder of the division by 3/.test(name))return /decimal|quotient to the nearest/.test(name)?'decimal':'division';
 if(/divisibility|divisors|prime number|prime factor|greatest common divisor|least common multiple|g\.c\.d|l\.c\.m/.test(name))return 'arith';
 if(/natural numbers.*revision|numeration|million|larger numbers/.test(name))return 'numeration';
 if(/solids|space geometry|pyramid|prism|cube/.test(name))return 'geometry';
 if(/decimal fractions/.test(name))return 'fraction';
 return raw;}
 function whyWrong(cat,prompt){const why={
    arith:'Vérifie les critères de divisibilité, les multiples et les diviseurs concernés. Contrôle aussi toute condition de comparaison, comme « strictement supérieur à ».',
    fraction:'Vérifie le calcul des numérateurs, conserve le dénominateur lorsque celui-ci est commun et simplifie la fraction obtenue.',
    multiplication:'Vérifie le produit en décomposant l’un des facteurs ou en effectuant une multiplication posée.',
    division:'Vérifie le résultat par la multiplication : le quotient multiplié par le diviseur doit redonner le dividende.',
    decimal:'Aligne les chiffres selon leur rang, en particulier les virgules, puis refais l’opération.',
    ratio:'Dans une situation de proportionnalité, les grandeurs correspondantes sont liées par un même coefficient.',
    statistics:'Le pourcentage est obtenu en divisant l’effectif étudié par l’effectif total, puis en multipliant par 100.',
    angles:'La somme de deux angles complémentaires est égale à 90°, celle de deux angles supplémentaires à 180°.',
    area:'Pour un rectangle, le périmètre vaut 2 × (longueur + largeur), tandis que l’aire vaut longueur × largeur. Les unités sont différentes.',
    time:'Une heure correspond à 60 minutes et non à 100 minutes.',
    measurement:'Vérifie la relation entre les unités, puis multiplie par le bon facteur de conversion.',
    powers:'Une puissance est un produit de facteurs égaux, et non une simple multiplication de la base par l’exposant.',
    algebra:'Remplace la lettre par sa valeur et respecte les priorités opératoires.',
    integers:'Vérifie les signes et la valeur absolue de chaque terme avant de calculer.',
    numeration:'Observe le nombre de zéros : multiplier par 10, 100 ou 1 000 change la valeur de position des chiffres.',
    geometry:'Compte uniquement les côtés de la figure désignée et vérifie sa définition.',
    symmetry:'Une symétrie conserve les longueurs. Dans le cas d’une symétrie centrale par rapport à l’origine, les deux coordonnées changent de signe.'};
 if(lang()==='en'){
 const en={arith:'Check divisibility rules, multiples, divisors and any comparison condition such as strictly greater than.',fraction:'Check the numerators, keep a common denominator when appropriate, and simplify the result.',multiplication:'Check the product using decomposition or written multiplication.',division:'Check by multiplication: quotient × divisor must equal the dividend.',decimal:'Align the digits by place value, especially the decimal points, then calculate again.',ratio:'Corresponding quantities in a proportional relationship have the same constant multiplier.',statistics:'Divide the relevant count by the total, then multiply by 100 to find the percentage.',angles:'Complementary angles total 90°, while supplementary angles total 180°.',area:'A rectangle has perimeter 2 × (length + width) and area length × width. Check the units.',time:'One hour is 60 minutes, not 100 minutes.',measurement:'Check the relationship between the units and use the correct conversion factor.',powers:'An exponent indicates repeated multiplication, not simply multiplying the base by the exponent.',algebra:'Substitute the value of the variable and follow the order of operations.',integers:'Check each sign and absolute value before calculating.',numeration:'Check how multiplying by 10, 100 or 1,000 changes the place value of each digit.',geometry:'Count the sides of the specified figure and check its definition.',symmetry:'Reflection preserves lengths. Reflection in the origin changes both coordinate signs.'};return en[cat]||'Work through the steps again, then check your answer.';
 }
 return why[cat]||'Reprends le raisonnement étape par étape, puis vérifie le résultat.'}
 // Geometric question catalog: CHAPTER-MATCHED, bilingual, drawable and solvable.
 // Rotate across question archetypes to prevent repeating the same construction.
 const geometryRotation=new Map();
 function geometricConstruction(u,difficulty,grade,requestedType='geometrie'){
  const source=String(u.original||u.title||'').toLowerCase();
  const hard=difficulty==='difficile',easy=difficulty==='facile';
  const L=R(3,hard?7:6),W=R(2,Math.max(3,L-1)),angle=choose(easy?[30,45,60,90]:hard?[35,55,70,105,120]:[40,60,75,90]);
  const all=['identify','segment','triangle','square','rectangle','circle','angle','angle-measure','parallel','perpendicular','bisector','symmetry','perimeter','area','diagram','problem'];
  let pool=all;
  if(/(?:remarkable lines?|droites? remarquables?|m[eé]dianes?|altitudes?|hauteurs?|bissectrices?|angle bisectors?)/.test(source))pool=['median','altitude','angle-bisector','median','altitude','angle-bisector'];
  else if(/circle|cercle|disque|radius|rayon|diameter|diamètre/.test(source))pool=['circle','circle-read','circle','circle-read'];
  else if(/pyramid|pyramide/.test(source))pool=['pyramid','pyramid-construction'];
  else if(/triangle|triangles/.test(source))pool=['triangle','triangle','diagram','perimeter'];
  else if(/angle|bissectrice/.test(source))pool=['angle','angle-measure','angle-read','angle-measure','angle'];
  else if(/symmetry|symétrie|symetrie|reflection/.test(source))pool=['symmetry','symmetry'];
  else if(/quadrilat|quadrilateral|square|rectangle|carré|rectangl/.test(source))pool=['identify','square','rectangle','perimeter','area'];
  else if(/area|aire|surface|perimeter|périmètre/.test(source))pool=['area','perimeter','rectangle','square','problem'];
  else if(/line|droite|parallel|perpendic|bisector|médiatrice|segment|position|location/.test(source))pool=['parallel','perpendicular','bisector','segment'];
  else if(/geometry|géométrie|geometrie/.test(source))pool=grade<=5?['identify','segment','square','rectangle','circle','triangle','angle','parallel','perpendicular','perimeter','area','diagram','problem']:all;
  // Distinct generation families: a reference figure is required only for 'geometrie'.
   // Keep tasks anchored to the selected chapter rather than inserting generic circle questions.
   const withReference=new Set(['pyramid','identify','triangle','square','rectangle','circle-read','angle-measure','angle-read','parallel','perpendicular','bisector','median','altitude','angle-bisector','symmetry','perimeter','area','diagram']);
   const independent=new Set(['segment','triangle','square','rectangle','circle','angle','perpendicular','bisector','median','altitude','angle-bisector','symmetry','pyramid-construction']);
   const allowed=requestedType==='construction'?independent:withReference;
   pool=pool.filter(t=>allowed.has(t));
   if(!pool.length){
    if(/circl|cercle|disque|rayon|diam/.test(source))pool=requestedType==='construction'?['circle']:['circle-read'];
    else if(/angle/.test(source))pool=requestedType==='construction'?['angle']:['angle-measure'];
    else if(/symétr|symmet|reflect/.test(source))pool=['symmetry'];
    else if(/triangle/.test(source))pool=['triangle'];
    else if(/quadrilat|rectangle|square|carré/.test(source))pool=requestedType==='construction'?['square','rectangle']:['perimeter','area'];
    else if(/line|segment|droite|parall|perpend|médiatrice/.test(source))pool=requestedType==='construction'?['perpendicular','bisector']:['parallel'];
    else pool=requestedType==='construction'?['triangle','square','circle','bisector']:['identify','angle-measure','perimeter','area'];
   }
   const code=source+'|'+grade+'|'+difficulty+'|'+requestedType;
  const turn=geometryRotation.get(code)||0;geometryRotation.set(code,turn+1);
  const task=pool[turn%pool.length];
   const out=(fr,en,answerFr,answerEn,methodFr,methodEn,visual,toolsFr,toolsEn,mode='construction')=>{
     const without=requestedType==='construction';
     let text=T(fr,en);
     if(without){
       const edits=[
        [/À partir du point A,\s*/i,'Place un point A, puis '],
        [/Starting at A,\s*/i,'Mark point A, then '],
        [/À partir de la demi-droite \[OA\) représentée,\s*/i,'Trace d’abord la demi-droite [OA), puis '],
        [/Using the given ray OA,\s*/i,'First draw ray OA, then '],
        [/(?:À partir du|Sur le) segment \[AB\] de ([\d.,]+) cm représenté,\s*/i,'Trace d’abord un segment [AB] de $1 cm, puis '],
        [/(?:Starting from|Using) the given ([\d.,]+) cm segment AB,\s*/i,'First draw segment AB of $1 cm, then '],
        [/Complète la représentation en perspective cavalière d’une pyramide SABCD à base carrée ABCD\s*:/i,'Réalise une représentation en perspective cavalière de la pyramide SABCD à base carrée ABCD :'],
        [/Complete the oblique drawing of square-based pyramid SABCD\./i,'Draw an oblique representation of the square-based pyramid SABCD.']
       ];
       for(const [pattern,replacement] of edits)text=text.replace(pattern,replacement);
       if(['median','altitude','angle-bisector'].includes(task)){
        text=text.replace(/^Dans le triangle ABC de la figure /i,'Construis d’abord un triangle ABC ')
                 .replace(/^Dans le triangle ABC donné /i,'Construis d’abord un triangle ABC ')
                 .replace(/^Sur le triangle ABC représenté /i,'Construis un triangle ABC ')
                 .replace(/, recopie le triangle sur ta feuille, puis/i,', puis')
                 .replace(/, recopie la figure, puis/i,', puis')
                 .replace(/, puis construis/i,', puis construis')
                 .replace(/^In the given triangle ABC /i,'First construct triangle ABC ')
                 .replace(/^On the supplied triangle ABC /i,'First construct triangle ABC ')
                 .replace(/, copy the triangle and construct/i,', then construct')
                 .replace(/, reproduce the figure and construct/i,', then construct')
                 .replace(/, copy the figure and construct/i,', then construct');
       }
       if(task==='symmetry')text=T('Dans un repère orthonormé (unité : 1 cm), place A(1 ; 1), B(4 ; 1) et C(2 ; 3). Trace la droite (d) d’équation x = 0, puis construis le symétrique A′B′C′ du triangle ABC par rapport à (d).','In an orthonormal coordinate system (unit 1 cm), plot A(1, 1), B(4, 1) and C(2, 3). Draw the line d with equation x = 0, then construct the reflection A′B′C′ of triangle ABC across d.');
       // Keep requested instruments in the object for the teacher; do not add a separate
       // "Outils / Use tools" instruction to Cycle 3 exam papers.
     }
     const complete=(
       task==='circle'?{kind:'circle-radius',radius:L,unit:'cm'}:
       task==='triangle'?{kind:'triangle-sides',a:L,b:L+1,c:L+2,unit:'cm'}:
       task==='square'?{kind:'square-side',side:L,unit:'cm'}:
       task==='rectangle'?{kind:'rectangle',length:L+2,width:W,unit:'cm'}:
       task==='segment'?{kind:'start-segment',length:L,unit:'cm'}:
       task==='angle'?{kind:'angle-measure',degrees:angle}:
       task==='perpendicular'?{kind:'completed-perpendicular',length:L+2,unit:'cm'}:
       task==='bisector'?{kind:'completed-bisector',length:L+2,unit:'cm'}:
       task==='symmetry'?{kind:'completed-symmetry'}:
       task==='pyramid-construction'?{kind:'pyramid'}:
       ['median','altitude','angle-bisector'].includes(task)?{kind:'triangle-completed',a:6,b:5,c:7,unit:'cm',feature:task}:null);
     // The teacher receives the completed geometry when the student had only
     // an incomplete starting figure, never on the student's question sheet.
     const solutionVisual=(without||['triangle','square','rectangle','perpendicular','bisector','median','altitude','angle-bisector','symmetry'].includes(task))?complete:null;
     return {text,answer:without&&task==='symmetry'?T('A′(−1 ; 1), B′(−4 ; 1), C′(−2 ; 3).','A′(−1, 1), B′(−4, 1), C′(−2, 3).'):T(answerFr,answerEn),
       solution:without&&task==='symmetry'?T('Construis chaque image à la même distance perpendiculaire de l’axe x = 0, de l’autre côté. Les abscisses changent de signe, les ordonnées sont conservées. Relie A′, B′ et C′.','Mark each image at the same perpendicular distance on the opposite side of x = 0. The x-coordinates change sign; the y-coordinates stay unchanged. Join A′, B′ and C′.'):T(methodFr,methodEn),
       wrong:[],kind:without?'construction':mode,visual:without?null:visual,solutionVisual,geometryTask:task,
       geometryMode:without?'construction':(mode==='reasoning'?'reasoning':'reference'),
       tools:T(toolsFr||'Règle et compas selon le besoin.',toolsEn||'Ruler and compass as needed.')};
   };
  switch(task){
   case 'median':return out(
     'Dans le triangle ABC de la figure (AB = 6 cm, AC = 5 cm et BC = 7 cm), recopie le triangle sur ta feuille, puis construis la médiane issue de A. Nomme M le milieu de [BC].',
     'In the given triangle ABC (AB = 6 cm, AC = 5 cm and BC = 7 cm), copy the triangle and construct the median from A. Label M the midpoint of BC.',
     'BM = MC = 3,5 cm ; la médiane est [AM].','BM = MC = 3.5 cm; the median is AM.',
     'Vérifie que le triangle est constructible (5 + 6 > 7). Construis ABC si nécessaire. Marque M sur [BC] tel que BM = MC = 3,5 cm. Trace [AM] ; code les deux demi-segments égaux.',
     'Verify triangle inequality (5 + 6 > 7). Draw ABC if needed. Mark M on BC so that BM = MC = 3.5 cm. Draw AM and mark the equal half-segments.',
     {kind:'triangle-given',a:6,b:5,c:7,unit:'cm'},'Règle graduée et compas.','Ruler and compass.');
   case 'altitude':return out(
     'Dans le triangle ABC donné (AB = 6 cm, AC = 5 cm et BC = 7 cm), recopie la figure, puis trace la hauteur issue de A. Appelle H son pied sur [BC] et code l’angle droit.',
     'In the given triangle ABC (AB = 6 cm, AC = 5 cm and BC = 7 cm), reproduce the figure and construct the altitude from A. Call its foot on BC H and mark the right angle.',
     'AH ⟂ BC et H ∈ [BC].','AH is perpendicular to BC and H lies on BC.',
     'Vérifie les mesures du triangle ABC. À l’aide de l’équerre, trace la perpendiculaire à (BC) passant par A. Son intersection avec [BC] est H. Vérifie que AĤB mesure 90°.',
     'Check triangle ABC dimensions. With a set square, draw the perpendicular to BC through A. Its intersection with BC is H. Verify angle AHB is 90°.',
     {kind:'triangle-given',a:6,b:5,c:7,unit:'cm'},'Règle et équerre.','Ruler and set square.');
   case 'angle-bisector':return out(
     'Sur le triangle ABC représenté (AB = 6 cm, AC = 5 cm et BC = 7 cm), recopie la figure, puis construis la bissectrice de l’angle BÂC. Nomme D son intersection avec [BC].',
     'On the supplied triangle ABC (AB = 6 cm, AC = 5 cm and BC = 7 cm), copy the figure and construct the bisector of angle BAC. Label D its intersection with BC.',
     'BÂD = DÂC et D ∈ [BC].','Angle BAD = angle DAC and D lies on BC.',
     'Avec le compas, trace un arc de centre A coupant [AB] et [AC]. À partir de ces intersections et avec une même ouverture, trace deux arcs qui se coupent à l’intérieur de l’angle. Relie A à cette intersection : la droite coupe [BC] en D et partage BÂC en deux angles égaux.',
     'With a compass, draw an arc centred at A crossing AB and AC. Using equal radii from the two intersections, construct intersecting arcs inside the angle. Join A to their intersection: AD meets BC at D and bisects angle BAC.',
     {kind:'triangle-given',a:6,b:5,c:7,unit:'cm'},'Compas et règle.','Compass and ruler.');
   case 'pyramid':return out('Observe la pyramide SABCD à base carrée. Indique son nombre de faces, d’arêtes et de sommets.',
    'Observe square-based pyramid SABCD. State the number of faces, edges and vertices.',
    '5 faces, 8 arêtes et 5 sommets.', '5 faces, 8 edges and 5 vertices.',
    'La base ABCD est carrée : 1 face carrée et 4 faces triangulaires, soit 5 faces. Compte 4 arêtes de base et 4 arêtes latérales, soit 8 arêtes. Repère A, B, C, D et S : 5 sommets.',
    'The square base ABCD has 1 square face and 4 triangular side faces: 5 faces. Count 4 base edges and 4 lateral edges: 8 edges. A, B, C, D and S make 5 vertices.',
    {kind:'pyramid'},'Observation du solide.','Interpret the solid diagram.','reasoning');
   case 'pyramid-construction':return out('Complète la représentation en perspective cavalière d’une pyramide SABCD à base carrée ABCD : place S au-dessus de la base et trace toutes les arêtes latérales. Représente les arêtes cachées en pointillés.',
    'Complete the oblique drawing of square-based pyramid SABCD. Place vertex S above the base and draw all lateral edges. Make hidden edges dashed.',
    'S relié à A, B, C et D ; arête cachée en pointillés.',
    'S joined to A, B, C and D; hidden edge dashed.',
    'Le quadrilatère ABCD est la base carrée vue en perspective. Place S au-dessus de la base, trace [SA], [SB], [SC] et [SD] et mets en pointillés les arêtes cachées. Vérifie qu’il y a 4 faces triangulaires.',
    'Use ABCD as the square base shown in oblique projection. Place S above the base and draw SA, SB, SC and SD; draw hidden edges as dashed lines. Check for four triangular side faces.',
    {kind:'start-square'},'Outils : règle et crayon.','Tools: ruler and pencil.');
   case 'identify':return out('Observe la figure ABCD. Identifie le type de figure et indique le nombre de côtés et de sommets.',
    'Look at figure ABCD. Name the figure and state its number of sides and vertices.',
    'Quadrilatère ABCD : 4 côtés et 4 sommets.','Quadrilateral ABCD: 4 sides and 4 vertices.',
    'Compte les segments [AB], [BC], [CD] et [DA] ; repère A, B, C et D. La figure fermée possède quatre côtés : c’est un quadrilatère.',
    'Count sides AB, BC, CD and DA; identify vertices A, B, C and D. A closed four-sided polygon is a quadrilateral.',
    {kind:'quadrilateral'},'Observation de la figure.','Read the diagram.','reasoning');
   case 'segment':return out(`À partir du point A, trace à la règle un segment [AB] de ${L} cm et nomme son autre extrémité B.`,
    `Starting at A, use a ruler to draw a segment AB of length ${L} cm and label endpoint B.`,
    `AB = ${L} cm ; les deux extrémités sont A et B.`,`AB = ${L} cm; endpoints A and B.`,
    `Pose le zéro de la règle sur A ; marque B à ${L} cm ; trace le segment droit entre A et B puis vérifie sa longueur.`,
    `Place the ruler's zero at A, mark B at ${L} cm, draw the straight segment AB and check its length.`,
    {kind:'start-point'},'Outil : règle graduée.','Tool: ruler.');
   case 'triangle':{const a=L,b=L+1,c=L+2;
    return out(`À partir du segment [AB] de ${a} cm représenté, construis un triangle ABC tel que AC = ${b} cm et BC = ${c} cm. Indique les longueurs.`,
     `Using the given ${a} cm segment AB, construct triangle ABC with AC = ${b} cm and BC = ${c} cm. Label the lengths.`,
     `AB = ${a} cm, AC = ${b} cm, BC = ${c} cm.`,`AB = ${a} cm, AC = ${b} cm, BC = ${c} cm.`,
     `Vérifie l'inégalité triangulaire : ${a} + ${b} > ${c}. Trace [AB], puis un arc de centre A et de rayon ${b} cm, et un arc de centre B et de rayon ${c} cm. Leur intersection est C. Relie C à A et B.`,
     `Check the triangle inequality: ${a} + ${b} > ${c}. Draw AB; use a compass to draw an arc centred at A of radius ${b} cm and an arc centred at B of radius ${c} cm. Their intersection is C. Join C to A and B.`,
     {kind:'start-segment',length:a},'Outils : règle graduée et compas.','Tools: ruler and compass.');}
   case 'square':return out(`À partir du segment [AB] de ${L} cm représenté, construis un carré ABCD. Code ses quatre angles droits et ses côtés égaux.`,
    `Starting from the given ${L} cm segment AB, construct square ABCD. Mark its right angles and equal sides.`,
    `Carré ABCD de côté ${L} cm ; quatre angles droits et quatre côtés égaux.`,`Square ABCD with side ${L} cm, four right angles and four equal sides.`,
    `Trace les perpendiculaires à (AB) en A et B du même côté. Sur chacune, reporte ${L} cm pour placer D et C. Relie C à D ; code les angles droits et les côtés égaux.`,
    `Construct perpendiculars to AB at A and B on the same side. Measure ${L} cm on each to locate D and C. Join C and D; mark the right angles and equal sides.`,
    {kind:'start-segment',length:L},'Outils : règle, équerre et compas.','Tools: ruler, set square and compass.');
   case 'rectangle':return out(`À partir du segment [AB] de ${L+2} cm représenté, construis un rectangle ABCD tel que BC = ${W} cm. Code ses angles droits.`,
    `Starting from the given ${L+2} cm segment AB, construct rectangle ABCD with BC = ${W} cm. Mark its right angles.`,
    `Rectangle ABCD : AB = CD = ${L+2} cm et BC = AD = ${W} cm.`,`Rectangle ABCD: AB = CD = ${L+2} cm and BC = AD = ${W} cm.`,
    `Élève deux perpendiculaires à (AB) du même côté, l’une en A et l’autre en B. Marque AD = BC = ${W} cm, puis relie D à C. Vérifie les quatre angles droits.`,
    `Draw perpendiculars to AB at A and B on the same side. Mark AD = BC = ${W} cm and join D to C. Check all four right angles.`,
    {kind:'start-segment',length:L+2},'Outils : règle graduée et équerre.','Tools: ruler and set square.');
   case 'circle':return out(`Construis un cercle de centre O et de rayon ${L} cm. Place un point A sur le cercle, puis trace le segment [OA].`,
    `Construct a circle with centre O and radius ${L} cm. Place point A on the circle, then draw segment OA.`,
    `Cercle de centre O ; OA = ${L} cm.`,`Circle with centre O; OA = ${L} cm.`,
    `Marque O ; ouvre le compas à ${L} cm en utilisant la règle ; pique en O et trace le cercle sans modifier l’ouverture. Choisis A sur le cercle et trace [OA].`,
    `Mark O; set the compass opening to ${L} cm using a ruler; place the compass point at O and draw the circle without changing the opening. Choose A on the circle and draw OA.`,
    {kind:'start-circle'},'Outils : compas et règle graduée.','Tools: compass and ruler.');
   case 'circle-read':return out(`Observe le cercle de centre O et de rayon ${L} cm. Indique la longueur OA et calcule le diamètre.`,
    `Look at the circle with centre O and radius ${L} cm. State OA and calculate the diameter.`,
    `OA = ${L} cm ; diamètre = ${2*L} cm.`,`OA = ${L} cm; diameter = ${2*L} cm.`,
    `OA est un rayon car A appartient au cercle. Le diamètre est le double : 2 × ${L} = ${2*L} cm.`,
    `OA is a radius because A lies on the circle. The diameter is twice the radius: 2 × ${L} = ${2*L} cm.`,
    {kind:'circle-radius',radius:L},'Lecture d’une figure.','Interpret the diagram.','reasoning');
   case 'angle':return out(`À partir de la demi-droite [OA) représentée, construis un angle AÔB de ${angle}° à l’aide du rapporteur. Place B et nomme le sommet.`,
    `Using the given ray OA, construct angle AOB of ${angle}° with a protractor. Label B and the vertex.`,
    `AÔB = ${angle}° ; sommet O.`,`Angle AOB = ${angle}°; vertex O.`,
    `Place le centre du rapporteur sur O et son zéro le long de [OA). Repère ${angle}° sur la bonne graduation, puis trace la demi-droite [OB) par le repère ; nomme B.`,
    `Place the centre of the protractor at O and align zero with OA. Mark ${angle}° on the correct scale, then draw ray OB through the mark and label B.`,
    {kind:'start-angle'},'Outils : rapporteur et règle.','Tools: protractor and ruler.');
   case 'angle-measure':return out('À l’aide du rapporteur, mesure l’angle AÔB représenté, puis classe-le (aigu, droit ou obtus).',
    'Use a protractor to measure angle AOB in the figure, then classify it (acute, right or obtuse).',
    `${angle}° ; angle ${angle<90?'aigu':angle===90?'droit':'obtus'}.`,
    `${angle}°; ${angle<90?'acute':angle===90?'right':'obtuse'} angle.`,
    `Place le centre du rapporteur sur O et aligne le zéro sur [OA). Lis la bonne graduation passant par [OB) : ${angle}°. ${angle<90?'Il est inférieur à 90° : aigu.':angle===90?'Il mesure 90° : droit.':'Il est supérieur à 90° : obtus.'}`,
    `Place the protractor centre on O and align zero with OA. Read the scale through OB: ${angle}°. ${angle<90?'It is less than 90°: acute.':angle===90?'It is 90°: right.':'It is greater than 90°: obtuse.'}`,
    {kind:'angle-measure',degrees:angle},'Outil : rapporteur.','Tool: protractor.','reasoning');
   case 'angle-read':{const given=choose([20,30,40,50,60]);return out(`Sur le schéma, deux angles adjacents forment un angle droit. L’un mesure ${given}°. Calcule l’autre.`,
     `In the diagram, two adjacent angles make a right angle. One measures ${given}°. Find the other.`,
     `${90-given}°`,`${90-given}°`,
     `Les angles d’un angle droit totalisent 90°. On soustrait : 90° − ${given}° = ${90-given}°.`,
     `The two angles make 90° in total. Subtract: 90° − ${given}° = ${90-given}°.`,
     {kind:'angles',given,total:90},'Lecture de l’angle ; calcul.','Read the angle and calculate.','reasoning');}
   case 'parallel':return out('Sur la figure, indique les droites parallèles et donne une paire de droites perpendiculaires. Justifie ta réponse.',
    'In the diagram, identify the parallel lines and one pair of perpendicular lines. Explain your reasoning.',
    '(d₁) ∥ (d₂) ; (d₁) ⟂ (Δ) et (d₂) ⟂ (Δ).','d₁ ∥ d₂; d₁ ⟂ Δ and d₂ ⟂ Δ.',
    'Les droites (d₁) et (d₂) ont la même direction et ne se coupent pas. La droite (Δ) forme un angle droit avec chacune d’elles.',
    'Lines d₁ and d₂ have the same direction and never meet. Line Δ forms a right angle with both.',
    {kind:'parallel'},'Observation de la figure et équerre si nécessaire.','Diagram reading; set square if needed.','reasoning');
   case 'perpendicular':return out(`Sur le segment [AB] de ${L+2} cm représenté, construis la perpendiculaire (d) à (AB) passant par A. Marque l’angle droit.`,
    `Using the given ${L+2} cm segment AB, construct line d perpendicular to AB through A and mark the right angle.`,
    '(d) ⟂ (AB) en A.','d ⟂ AB at A.',
    'Place un côté de l’équerre sur (AB) et fais passer l’autre côté par A. Trace (d) le long de l’équerre et marque un petit carré pour l’angle droit.',
    'Place one edge of the set square along AB with the perpendicular edge through A. Draw line d and add a small right-angle square.',
    {kind:'start-segment',length:L+2},'Outils : règle et équerre.','Tools: ruler and set square.');
   case 'bisector':{const b=L+2;return out(`À partir du segment [AB] de ${b} cm représenté, construis sa médiatrice (d). Nomme I le point d’intersection de (d) et [AB].`,
    `Using the given ${b} cm segment AB, construct its perpendicular bisector d. Name its intersection with AB as I.`,
    `AI = IB = ${b/2} cm et (d) ⟂ (AB).`,`AI = IB = ${b/2} cm and d ⟂ AB.`,
    `Avec une ouverture de compas strictement supérieure à ${b/2} cm, trace deux arcs de centres A et B au-dessus et au-dessous du segment. Relie leurs deux intersections : c’est la médiatrice (d). Elle coupe [AB] en I, son milieu.`,
    `With a compass radius strictly greater than ${b/2} cm, draw arcs centred at A and B above and below AB. Join the two arc intersections to make d. It crosses AB at midpoint I.`,
    {kind:'start-segment',length:b},'Outils : règle graduée et compas.','Tools: ruler and compass.');}
   case 'symmetry':return out('Construis le symétrique du triangle ABC par rapport à l’axe (d). Nomme les images A′, B′ et C′.',
    'Reflect triangle ABC across line d. Label its image A′B′C′.',
    'Triangle A′B′C′ de l’autre côté de (d) ; (d) est la médiatrice de [AA′], [BB′] et [CC′].',
    'Triangle A′B′C′ on the other side of d; d perpendicularly bisects AA′, BB′ and CC′.',
    'Par A, B et C, construis les perpendiculaires à (d). Reporte la distance de chaque sommet à l’axe de l’autre côté pour obtenir A′, B′ et C′. Relie les trois images.',
    'From A, B and C, draw perpendiculars to d. Mark each reflected vertex at the same perpendicular distance on the other side, then join A′, B′ and C′.',
    {kind:'start-symmetry'},'Outils : règle, équerre et compas.','Tools: ruler, set square and compass.');
   case 'perimeter':return out(`La figure représente un carré ABCD de côté ${L} cm. Calcule son périmètre en détaillant la méthode.`,
    `Figure ABCD is a square of side ${L} cm. Calculate its perimeter and show your method.`,
    `P = 4 × ${L} = ${4*L} cm.`,`P = 4 × ${L} = ${4*L} cm.`,
    `Le périmètre est la somme des quatre côtés égaux. Donc P = ${L} + ${L} + ${L} + ${L} = ${4*L} cm.`,
    `Perimeter adds all four equal sides: P = ${L} + ${L} + ${L} + ${L} = ${4*L} cm.`,
    {kind:'square-side',side:L},'Lecture d’une figure, calcul.','Read the figure and calculate.','reasoning');
   case 'area':return out(`Le rectangle ABCD mesure ${L+2} cm de longueur et ${W} cm de largeur. Calcule son aire en cm².`,
    `Rectangle ABCD measures ${L+2} cm by ${W} cm. Calculate its area in cm².`,
    `A = ${L+2} × ${W} = ${(L+2)*W} cm².`,`A = ${L+2} × ${W} = ${(L+2)*W} cm².`,
    `L’aire d’un rectangle vaut longueur × largeur : ${L+2} × ${W} = ${(L+2)*W} cm².`,
    `Area of a rectangle = length × width: ${L+2} × ${W} = ${(L+2)*W} cm².`,
    {kind:'rectangle',length:L+2,width:W},'Lecture d’une figure, calcul.','Read the figure and calculate.','reasoning');
   case 'diagram':return out('Observe le triangle ABC. Identifie ses côtés, ses sommets et le nombre de ses angles.',
    'Examine triangle ABC. List its sides, vertices and number of angles.',
    'Côtés : [AB], [BC], [CA] ; sommets : A, B, C ; 3 angles.',
    'Sides: AB, BC, CA; vertices: A, B, C; 3 angles.',
    'Repère les trois segments du contour et leurs extrémités : un triangle possède trois côtés, trois sommets et trois angles.',
    'Identify the three boundary segments and their endpoints. Every triangle has three sides, three vertices and three angles.',
    {kind:'triangle'},'Lecture de schéma.','Read the diagram.','reasoning');
   default:return out(`Un jardin rectangulaire mesure ${L+3} m sur ${W+2} m. Détermine la longueur de clôture nécessaire, puis l’aire du jardin.`,
    `A rectangular garden measures ${L+3} m by ${W+2} m. Find the length of fencing needed and the garden's area.`,
    `P = ${2*(L+3+W+2)} m ; A = ${(L+3)*(W+2)} m².`,
    `P = ${2*(L+3+W+2)} m; A = ${(L+3)*(W+2)} m².`,
    `Clôture : P = 2 × (${L+3} + ${W+2}) = ${2*(L+3+W+2)} m. Aire : A = ${L+3} × ${W+2} = ${(L+3)*(W+2)} m².`,
    `Fencing: P = 2 × (${L+3} + ${W+2}) = ${2*(L+3+W+2)} m. Area: A = ${L+3} × ${W+2} = ${(L+3)*(W+2)} m².`,
    {kind:'rectangle',length:L+3,width:W+2,unit:'m'},'Calculs et justification.','Calculate and explain.','reasoning');
  }
 }

 function build(u,type='court',difficulty='moyen',grade=u.grade){
   let cat=matchUnit(u);if(cat==='revision')cat=choose(grade>=7?['integers','fraction','algebra','geometry']:['fraction','multiplication','geometry','decimal']);
   const b=['geometrie','construction'].includes(type)?geometricConstruction(u,difficulty,grade,type):base(cat,grade,difficulty,type,u.original||u.title);
   let text=b.text,answer=b.answer,options=[],explainWrong={};
   if(type==='trous'){text=text.includes('…')?text.replace('…','……………………'):text+T(' Réponse : ……………………',' Answer: ……………………');}
   if(type==='vrai-faux'){
    const truth=Math.random()>.5;const wrong=b.wrong.find(x=>x!==b.answer)||'0';
    text=T(`Indique si la réponse proposée est correcte. ${b.text} Réponse proposée : ${truth?b.answer:wrong}.`,`Decide whether the proposed answer is correct. ${b.text} Proposed answer: ${truth?b.answer:wrong}.`);
    answer=truth?T('Vrai','True'):T('Faux','False');options=[T('Vrai','True'),T('Faux','False')];explainWrong[truth?T('Faux','False'):T('Vrai','True')]=T('Cette réponse ne correspond pas au calcul ou à la propriété démontrée.','This choice does not match the calculation or proven property.');
   } else if(type==='qcm'){
    options=[...new Set([answer,...b.wrong.map(String)])].filter((o,i,all)=>i===0||!all.slice(0,i).some(v=>equivalentChoice(v,o))).slice(0,4);
    let n=0;while(options.length<4){const v=Number(String(answer).replace(/[^0-9.-]/g,''));let extra=Number.isFinite(v)&&String(answer).match(/\d/)?String(answer).replace(/-?\d+(?:[.,]\d+)?/, String(v+n+1)):[T('Aucune de ces réponses','None of these answers'),T('Une autre réponse','Another answer'),T('Données insuffisantes','Not enough information')][n%3];if(!options.some(v=>equivalentChoice(v,extra)))options.push(extra);n++;if(n>12)break}
    options=options.sort(()=>Math.random()-.5);
    for(const o of options)if(o!==answer)explainWrong[o]=whyWrong(cat,b.text);
   }
   const mark=(['geometrie','construction'].includes(type)?4:type==='probleme'?3:type==='court'?2:1);
   const visual=type==='construction'?null:(b.visual||window.MATH_VISUALS?.specFor(cat,type,u.original||u.title,b.text,grade)||null);
   return {geometryTask:b.geometryTask||null,geometryMode:b.geometryMode||null,tools:b.tools||null,visual,solutionVisual:b.solutionVisual||null,id:`q${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`,grade,unitId:u.id,unitName:lang()==='en'?(u.original||u.title):u.title,topic:u.topics?.[0]?.title||u.title,category:cat,source:lang()==='en'?`Al-Ahlia · p. ${u.page}${grade===6?` · vol. ${u.volume}`:''} (originally created exercise)`:`Al-Ahlia · p. ${u.page}${grade===6?` · tome ${u.volume}`:''} (chapitre, non copie littérale)`,type,difficulty,marks:mark,text,answer,options,solution:b.solution,explainWrong,lang:lang(),createdAt:new Date().toISOString()};
 }
 function normalize(s){return String(s??'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[\u202f\u00a0\s]/g,'').replace(/,/g,'.').replace(/[()]/g,'').replace(/−/g,'-').replace(/\./g,'.')}
 function equivalentChoice(x,y){const a=normalize(x),b=normalize(y);if(a===b)return true;const val=s=>{if(/^[-+]?\d+(?:\.\d+)?$/.test(s))return Number(s);const m=s.match(/^(-?\d+)\/(-?\d+)$/);return m&&+m[2]!==0?+m[1]/+m[2]:NaN;};const ax=val(a),by=val(b);return Number.isFinite(ax)&&Number.isFinite(by)&&Math.abs(ax-by)<1e-10;}
 function isCorrect(input,answer){const a=normalize(input),b=normalize(answer);if(a===b)return true;if(/^[-+]?\d+(?:\.\d+)?$/.test(a)&&/^[-+]?\d+(?:\.\d+)?$/.test(b))return Number(a)===Number(b);return false;}
 function project(u,grade){const cat=u.category;const plans={fraction:['La cuisine des fractions','cartons, papier quadrillé, ciseaux, crayons de couleur','Créer des parts de pizzas en papier, représenter trois fractions, puis comparer et expliquer les résultats.','Représenter et comparer des fractions dans une situation concrète.'],ratio:['Une boutique à l’échelle','catalogues, règle, feuilles, calculatrice','Préparer une liste de produits, construire un tableau de prix proportionnels et présenter les calculs.','Utiliser la proportionnalité dans la vie courante.'],statistics:['Notre classe en chiffres','questionnaire, feuilles, crayons, tableur facultatif','Réaliser un sondage anonyme, construire un tableau d’effectifs et dessiner un diagramme.','Collecter, organiser et interpréter des données.'],geometry:['L’atelier des formes','règle, équerre, compas, feuilles cartonnées','Construire des figures, indiquer leurs propriétés et expliquer les constructions à la classe.','Reconnaître et utiliser des propriétés géométriques.'],area:['Le plan de notre école','papier quadrillé, règle, crayons','Imaginer un plan simple, calculer le périmètre et l’aire de plusieurs espaces et justifier les unités.','Mobiliser les formules d’aire et de périmètre.']};const pfr=plans[cat]||['Mission mathématique du quotidien','papier, règle, crayons, calculatrice si nécessaire','Inventer une situation réelle en lien avec le chapitre, résoudre le problème et expliquer la démarche à l’oral.','Appliquer la notion étudiée et argumenter une solution.'];
 const projectsEn={fraction:['Fraction kitchen','card, graph paper, scissors, coloured pencils','Make paper pizza slices, represent three fractions, then compare and explain the results.','Represent and compare fractions in a real-world situation.'],ratio:['A proportionality shop','catalogues, ruler, paper, calculator','Prepare a product list, create a proportional pricing table, and present the calculations.','Apply proportionality in everyday situations.'],statistics:['Our class in numbers','questionnaire, paper, pencils, optional spreadsheet','Conduct an anonymous survey, prepare a frequency table and draw a chart.','Collect, organise and interpret data.'],geometry:['Geometry workshop','ruler, set square, compass, card','Construct figures, describe their properties and explain your constructions to the class.','Recognise and apply geometric properties.'],area:['Our school plan','graph paper, ruler, pencils','Design a simple plan, calculate perimeter and area, and explain the units used.','Apply area and perimeter formulas.']};const p=lang()==='en'?(projectsEn[cat]||['Everyday maths challenge','paper, ruler, pencils, calculator if needed','Invent a real-life situation related to this chapter, solve it and explain your reasoning aloud.','Apply the topic and explain your solution.']):pfr;return {id:`p${Date.now()}`,title:p[0],unitId:u.id,grade,topic:u.title,goal:p[3],materials:p[1],steps:p[2],rubric:[{label:T('Exactitude mathématique','Mathematical accuracy'),marks:4},{label:T('Démarche et justification','Method and reasoning'),marks:3},{label:T('Présentation et clarté','Presentation and clarity'),marks:2},{label:T('Participation / créativité','Participation / creativity'),marks:1}],total:10,lang:lang(),createdAt:new Date().toISOString()}}
 window.MATH_ENGINE={build,fmt,isCorrect,project};
})();

