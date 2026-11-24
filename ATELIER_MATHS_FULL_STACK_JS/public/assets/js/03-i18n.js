
/* i18n.js */
/* Two-way localisation: the teacher's saved material stays untouched.
   French is the default; English is an optional interface and generation language. */
(function(){'use strict';
const KEY='atelier-maths-language';
let lang;try{lang=localStorage.getItem(KEY)==='en'?'en':'fr'}catch{lang='fr'}
const originalText=new WeakMap(),originalAttrs=new WeakMap();
const translations={
// Site chrome
'Votre espace pédagogique':'Your teaching workspace','VOTRE ESPACE':'YOUR WORKSPACE',
'Vue d’ensemble':'Overview','Programme & chapitres':'Syllabus & chapters',
'Créateur d’évaluations':'Exam builder','Exercices interactifs':'Interactive exercises',
'Projets & activités':'Projects & activities','Banque de questions':'Question bank',
'Mes ressources':'My resources','Bibliothèque · 5 manuels':'Library · 5 textbooks','NIVEAUX SCOLAIRES':'GRADE LEVELS',
'✦ Espace privé':'✦ Private workspace',
'Les données sont enregistrées dans ce navigateur. Aucun compte requis.':'Your data is saved in this browser. No account is required.',
'Conçu pour une rédaction irréprochable en français.':'Designed for accurate, professional educational content.',
'● Sauvegarde locale':'● Saved locally','↧ Sauvegarder':'↧ Back up','↥ Restaurer':'↥ Restore',
'Ouvrir le menu':'Open menu','Fermer':'Close',
// Overview
'Bienvenue dans votre espace':'Welcome to your workspace',
'Les mathématiques, avec méthode.':'Teach maths with confidence.',
'Programmes issus des tables des matières des manuels Al-Ahlia fournis. Génération et adaptation en français soigné.':'Chapters organised using the contents of the supplied Al-Ahlia textbooks. Create and adapt materials in your chosen language.',
'＋ Créer une évaluation':'＋ Create an exam',
'ENSEIGNER · ÉVALUER · FAIRE PROGRESSER':'TEACH · ASSESS · SUPPORT PROGRESS',
'Une meilleure préparation,':'Better preparation,','un enseignement plus serein.':'more confident teaching.',
'Retrouvez vos chapitres, concevez des évaluations sur mesure et suivez les besoins de chaque classe, depuis un même espace.':'Find your chapters, build tailored assessments and track every class in one workspace.',
'Explorer les programmes ↗':'Explore the syllabus ↗',
'CHAPITRES COUVERTS':'CHAPTERS COVERED','ÉVALUATIONS CRÉÉES':'EXAMS CREATED',
'QUESTIONS EN BANQUE':'QUESTIONS IN BANK','ACTIVITÉS & PROJETS':'ACTIVITIES & PROJECTS',
'documents modifiables':'editable documents','réutilisables et filtrables':'reusable and filterable',
'avec grille de notation':'with assessment rubrics','Mes niveaux':'My grades',
'Accès direct aux chapitres et au suivi':'Quick access to chapters and progress',
'Progression':'Progress','Chapitres prioritaires':'Priority chapters',
'Tout voir →':'View all →','Ouvrir':'Open','Erreurs fréquentes':'Frequent errors',
'S’entraîner →':'Practise →','Aucune priorité définie':'No priority chapters yet',
'Signalez d’une étoile les chapitres à travailler en priorité depuis le programme.':'Use the star in the syllabus to highlight chapters that need extra attention.',
'Pas encore de données':'No data yet','Les erreurs apparaîtront ici après les entraînements interactifs.':'Mistakes will appear here after students complete interactive practice.',
'À revoir':'Review',
// Syllabus, unit, topic
'PROGRAMME & PROGRESSION':'SYLLABUS & PROGRESS',
'＋ Ajouter un chapitre':'＋ Add a chapter','Créer un contrôle ↗':'Create an exam ↗',
'Progression du niveau':'Grade progress',
'Le suivi est défini par vos choix : « étudié », « à approfondir » et « exercices attribués ».':'Progress is based on your selections: covered, priority and exercises assigned.',
'Rechercher un chapitre ou une notion…':'Search chapters or topics…',
'Toutes les thématiques':'All subjects','Tous les états':'All statuses',
'Déjà étudiés':'Covered','Prioritaires':'Priority','À aborder':'Not covered',
'Aucun chapitre ne correspond à ces critères.':'No chapters match these filters.',
'✓ Étudié':'✓ Covered','★ Prioritaire':'★ Priority',
'Sujet prioritaire':'Priority topic','Marquer comme étudié':'Mark as covered',
'Ouvrir →':'Open →','✎ Renommer':'✎ Rename','Créer une évaluation':'Create an exam',
'Objectifs et progression':'Objectives & progress',
'Suivez chaque notion et concentrez vos évaluations sur les points qui nécessitent une révision.':'Track each topic and focus your assessments on material requiring review.',
'★ Retirer la priorité':'★ Remove priority','☆ Marquer comme prioritaire':'☆ Mark as priority',
'✓ Chapitre étudié':'✓ Chapter covered','Notions du chapitre':'Chapter topics',
'＋ Ajouter une notion':'＋ Add a topic',
'Les premières sous-notions sont des propositions pédagogiques : adaptez-les à vos pages de cours.':'The suggested subtopics are editable. Adapt them to the textbook pages you teach.',
'Notion travaillée':'Topic covered','Non abordée':'Not covered','Fiche →':'Details →',
'Suivi pédagogique':'Teaching progress','Évaluations':'Assessments','Séries attribuées':'Assigned sets',
'＋ Attribuer des exercices':'＋ Assign exercises','Entraînement →':'Practice →',
'Points de vigilance':'Areas to review',
'Aucune erreur enregistrée pour le moment.':'No errors recorded yet.',
'Note personnelle':'Personal notes','Difficultés observées, supports, idées d’exercices…':'Observed difficulties, resources, exercise ideas…',
'Enregistrer la note':'Save note',
'← Retour au chapitre':'← Back to chapter','✓ Notion étudiée':'✓ Topic covered',
'Notion à étudier':'Topic not covered','Suivi de la notion':'Topic progress',
'Cette fiche vous permet de planifier le travail sur une notion précise et de suivre son acquisition. La progression est indépendante de celle des autres notions du chapitre.':'Use this page to plan the topic and track mastery independently of other chapter topics.',
'Marquer comme non étudiée':'Mark as not covered','Préparer la séance':'Plan the lesson',
'Objectifs, rappels et difficultés observées':'Objectives, revision and observed difficulties',
'Saisissez les objectifs de la leçon, des exemples et les erreurs à éviter…':'Enter lesson objectives, examples and common mistakes…',
'Enregistrer':'Save','Activités et évaluations':'Activities & assessments',
'Préparez une série d’exercices liés au chapitre, ou copiez une consigne pour demander au plugin une évaluation strictement ciblée sur cette notion, à partir des pages du manuel.':'Prepare a chapter exercise set or copy a prompt to request an assessment focused on this exact topic, based on the textbook pages.',
'✎ Lancer une série d’exercices':'✎ Start an exercise set',
'▧ Créer une évaluation':'▧ Create an exam',
'↗ Copier la consigne pour ChatGPT':'↗ Copy the ChatGPT prompt',
'Source de référence':'Reference source',
'Les sous-notions sont modifiables ; vérifiez leur correspondance exacte avec le manuel.':'Subtopics are editable; check that they match the textbook.',
// Exam builder
'CRÉATION SUR MESURE':'CUSTOM ASSESSMENTS',
'Composez un sujet, ajustez chaque question et exportez une version pour les élèves ou un corrigé séparé.':'Build an exam, edit each question, and export a student copy or separate answer key.',
'Paramètres de l’évaluation':'Exam settings','Titre de l’évaluation':'Exam title',
'Géométrie / construction':'Geometry / construction','Répartition des types':'Question type distribution',
'Automatique : alternance des types sélectionnés':'Automatic: rotate selected types',
'Personnalisée : nombre précis par type':'Custom: exact count per type',
'Questions par type — la somme doit correspondre au nombre total':'Questions by type — sum must equal the total number',
'Total des types':'Type total',
'Classe':'Grade','Difficulté':'Difficulty','Nombre de questions':'Number of questions',
'Barème total / points':'Total marks / points','Types de questions':'Question types',
'Chapitres à évaluer':'Chapters to assess',
'Sélectionner les chapitres prioritaires':'Select priority chapters',
'Comment fonctionne la génération ?':'How does the generator work?',
'Ce site crée automatiquement des exercices calculables et vérifiables. Pour une évaluation strictement fondée sur une page de vos PDF, utilisez le plugin ChatGPT et importez ses questions au format JSON.':'This website generates automatically checkable exercises. For questions based on specific PDF pages, use the ChatGPT plugin and import its questions as JSON.',
'✦ Générer l’évaluation':'✦ Generate exam','Copier une consigne pour ChatGPT':'Copy a ChatGPT prompt',
'🖨 Imprimer / PDF':'🖨 Print / PDF','⇩ Export Word':'⇩ Export Word',
'◉ Masquer':'◉ Hide','◌ Afficher':'◌ Show','le corrigé':'answer key',
'⇩ Corrigé séparé':'⇩ Separate answer key','Corrigé séparé':'Separate answer key',
'Dupliquer':'Duplicate','Le corrigé est visible. Il ne figurera jamais dans la version destinée aux élèves.':'The answer key is visible. It will not appear in the student version.',
'Les réponses et le barème détaillé restent masqués. Vous pouvez les afficher sur demande.':'Answers and detailed marking schemes are hidden until you choose to show them.',
'Réponse :':'Answer:','Démarche :':'Working:','Barème :':'Marking scheme:',
'À compléter par l’enseignant.':'To be completed by the teacher.',
'Création manuelle':'Created manually','Exporter le sujet →':'Export exam →',
'Réponse courte':'Short answer','Problème':'Word problem','Vrai / Faux':'True / False',
'Texte à trous':'Fill in the blanks','Facile':'Easy','Intermédiaire':'Intermediate',
'Approfondissement':'Challenging',
// Exercises
'APPRENDRE PAR LA PRATIQUE':'LEARN BY PRACTISING',
'L’élève répond d’abord ; la correction et le raisonnement ne sont dévoilés qu’après validation.':'Students answer first; corrections and explanations appear only after submission.',
'Voir la banque de questions':'View question bank',
'Niveau':'Level','Questions':'Questions','Lancer une nouvelle série':'Start a new exercise set',
'Démarrer →':'Start →','🖨 Imprimer la fiche / PDF':'🖨 Print worksheet / PDF',
'Après chaque réponse, l’élève reçoit une correction détaillée. Les réponses incorrectes alimentent le journal des erreurs.':'After submitting an answer, students see a detailed correction. Incorrect answers are added to the error log.',
'✓ Bonne réponse !':'✓ Correct answer!','✗ Réponse à revoir.':'✗ Try again.',
'Votre réponse :':'Your answer:','Bonne réponse :':'Correct answer:',
'Explication :':'Explanation:',
'Pourquoi les autres propositions sont-elles incorrectes ?':'Why are the other choices incorrect?',
'Cette proposition ne convient pas au raisonnement attendu.':'This choice does not follow the required reasoning.',
'Votre réponse':'Your answer','Écrivez votre réponse ici…':'Write your answer here…',
'Valider ma réponse':'Submit answer',
'Exercice terminé !':'Exercise complete!',
'Prêt pour une nouvelle série ?':'Ready for a new set?',
'Sélectionnez un chapitre et cliquez sur « Démarrer » pour générer une série progressive.':'Choose a chapter and click Start to generate progressive practice exercises.',
// Projects
'APPRENDRE AUTREMENT':'LEARN IN NEW WAYS',
'Des expériences concrètes adaptées à l’âge, avec objectifs, matériel et critères d’évaluation.':'Age-appropriate hands-on activities with objectives, materials and assessment criteria.',
'＋ Concevoir un projet':'＋ Create a project',
'✦ Proposer une activité':'✦ Suggest an activity','Objectif pédagogique':'Learning objective',
'Matériel':'Materials','Déroulement':'Procedure','Grille d’évaluation':'Assessment rubric',
'À renseigner':'To be completed','✎ Modifier':'✎ Edit','Imprimer / PDF':'Print / PDF',
'Supprimer':'Delete','Vos prochains projets prendront forme ici':'Your next projects will appear here',
'Sélectionnez un chapitre et générez une première proposition, puis personnalisez-la.':'Choose a chapter, generate an activity, then customise it.',
// Question bank
'RESSOURCES RÉUTILISABLES':'REUSABLE RESOURCES',
'Retrouvez vos questions, filtrez-les et utilisez-les pour préparer vos prochaines évaluations.':'Find, filter and reuse questions to prepare future assessments.',
'＋ Ajouter une question':'＋ Add question',
'Rechercher un énoncé…':'Search question text…',
'Toutes les classes':'All grades','Tous les chapitres':'All chapters',
'Filtrer par notion…':'Filter by topic…','Tous les thèmes':'All topics',
'Toutes les difficultés':'All difficulty levels','Tous les types':'All question types',
'Banque vide':'Question bank is empty',
'Générez une évaluation ou ajoutez une question manuellement.':'Generate an exam or add a question manually.',
'Les 100 premiers résultats sont affichés. Affinez vos filtres.':'Only the first 100 results are shown. Refine your filters.',
'Journal des erreurs fréquentes':'Frequent errors log','Réviser':'Review',
'Pas encore d’erreurs enregistrées. Lancez des exercices interactifs pour repérer les difficultés.':'No errors logged yet. Try interactive exercises to identify difficulties.',
'Révision rapide':'Quick review',
'Les chapitres ayant généré le plus d’erreurs apparaissent en priorité. Un clic ouvre la page d’entraînement ciblé.':'Chapters with the most mistakes appear first. Click to open targeted practice.',
'Exporter le journal (.csv)':'Export error log (.csv)',
// Resources
'MANUELS & DOCUMENTS':'TEXTBOOKS & DOCUMENTS',
'Consultez les manuels de référence et préparez les questions à partir de vos documents.':'Review the reference textbooks and create questions based on your documents.',
'Copier une consigne ChatGPT':'Copy a ChatGPT prompt','Les 5 manuels fournis':'The five supplied textbooks',
'Le classement des chapitres de ces manuels est déjà intégré à l’application. Les pages indiquées sont celles imprimées dans les ouvrages.':'The textbook chapter lists are already included. Page numbers refer to the printed pages.',
'Voir →':'View →','Ajouter vos propres fichiers':'Upload your own files',
'Importer des PDF, des documents texte ou des programmes. Les PDF sont lus dans ce navigateur seulement si le module de lecture en ligne est accessible ; sinon, le document reste référencé et peut être envoyé directement au plugin dans ChatGPT.':'Upload PDFs, text documents or curriculum files. PDFs can be read in this browser when the online reading library is available; otherwise they are listed for use with the ChatGPT plugin.',
'Confidentialité : aucune donnée n’est transmise à un serveur par ce site. Une connexion Internet est seulement utilisée, si elle est disponible, pour charger le lecteur PDF. Les extraits conservés peuvent être inclus dans une consigne copiée vers ChatGPT, sous votre contrôle.':'Privacy: this website does not upload your data to a server. If available, an internet connection is used only to load the PDF reader. You control whether extracted text is included in a prompt copied to ChatGPT.',
'Extrait texte disponible':'Text excerpt available',
'Fichier référencé, sans texte extrait':'File listed, no extracted text',
'Consigne':'Prompt',
'Importer des questions produites par votre plugin':'Import questions created by your plugin',
'Votre plugin peut vous fournir un tableau JSON de questions en français. Collez-le ci-dessous pour l’intégrer au site et à la banque de questions.':'Your plugin can provide questions as JSON in your selected language. Paste them below to add them to the website and question bank.',
'Questions JSON (un tableau d’objets)':'Questions JSON (array of objects)',
'Importer les questions':'Import questions',
'L’import accepte les champs':'The import accepts the fields',
'Les questions demeurent entièrement modifiables après import.':'Imported questions remain fully editable.',
// Dialogs, prompts and project templates
'Enregistrer':'Save','Annuler':'Cancel','Modifier la question':'Edit question',
'Énoncé':'Question text','Réponse attendue':'Expected answer',
'Correction détaillée':'Detailed solution','Choix proposés (un par ligne)':'Options (one per line)',
'Option A…':'Option A…','Option B…':'Option B…',
'Points':'Marks','Ajouter un chapitre':'Add chapter',
'Titre du chapitre':'Chapter title','Pages de référence':'Reference pages','Thématique':'Subject area',
'Ex. Les pourcentages':'E.g. Percentages','Ex. 42–47':'E.g. 42–47',
'Ajouter une notion':'Add topic','Intitulé de la notion':'Topic title',
'Ex. Comparer deux fractions':'E.g. Compare two fractions',
'Modifier la notion':'Edit topic','Intitulé':'Title','Modifier le chapitre':'Edit chapter',
'Titre':'Title','Pages':'Pages','Personnaliser le projet':'Customise project',
'Objectifs':'Objectives','Consignes et déroulement':'Instructions and procedure',
'Mes évaluations':'My exams','Évaluation de mathématiques':'Mathematics exam',
'Nouvelle question :':'New question:','À compléter':'To be completed',
'Question créée manuellement':'Question created manually',
'Question importée':'Imported question',
'À vérifier et compléter.':'To be checked and completed.',
'Notes':'Notes',
'Question modifiée et enregistrée.':'Question updated and saved.',
'Évaluation créée. Toutes les questions sont modifiables.':'Exam created. All questions can be edited.',
'Évaluation dupliquée.':'Exam duplicated.',
'Évaluation supprimée.':'Exam deleted.',
'Question remplacée.':'Question replaced.',
'Conservez au moins une question.':'Keep at least one question.',
'Chapitre ajouté.':'Chapter added.',
'Note enregistrée.':'Note saved.',
'Note de notion enregistrée.':'Topic note saved.',
'Projet généré. Personnalisez-le selon votre classe.':'Project created. Customise it for your class.',
'Projet supprimé.':'Project deleted.',
'Question retirée de la banque.':'Question removed from the bank.',
'Ressource(s) enregistrée(s) dans le navigateur. Les extraits sont facultatifs.':'Resource(s) saved in your browser. Text excerpts are optional.',
'Sauvegarde restaurée.':'Backup restored.',
'Consigne copiée.':'Prompt copied.',
'Copie indisponible dans ce navigateur.':'Copying is unavailable in this browser.',
'Une série attribuée a été ajoutée au suivi.':'One assigned exercise set was added to progress tracking.',
'Sélectionnez au moins un chapitre à évaluer.':'Select at least one chapter to assess.',
'Choisissez au moins un type de question.':'Select at least one question type.',
'Écrivez ou sélectionnez votre réponse avant de consulter la correction.':'Enter or select your answer before viewing the correction.',
'Autorisez les fenêtres contextuelles pour imprimer.':'Enable pop-up windows to print.',
'Évaluation supprimée.':'Exam deleted.',

// Categories (teacher syllabus)
'Nombres et arithmétique':'Numbers & arithmetic','Nombres décimaux':'Decimals',
'Division':'Division','Multiplication':'Multiplication','Géométrie':'Geometry',
'Proportionnalité':'Proportionality','Statistiques':'Statistics','Angles':'Angles',
'Périmètres et aires':'Perimeter & area','Temps et durées':'Time & duration',
'Mesures':'Measurement','Puissances':'Powers','Algèbre':'Algebra',
'Nombres relatifs':'Integers','Numération':'Number sense','Symétrie et transformations':'Symmetry & transformations',
'Révisions':'Revision','Révisions et problèmes':'Revision & problems','Chapitre':'Chapter',
// Default generated project material (saved content will not be overwritten)
'La cuisine des fractions':'Fraction kitchen','Une boutique à l’échelle':'A proportionality shop',
'Notre classe en chiffres':'Our class in numbers','L’atelier des formes':'Geometry workshop',
'Le plan de notre école':'Our school plan','Mission mathématique du quotidien':'Everyday maths challenge',
'Exactitude mathématique':'Mathematical accuracy',
'Démarche et justification':'Method and reasoning',
'Présentation et clarté':'Presentation and clarity','Participation / créativité':'Participation / creativity',
'Représenter et comparer des fractions dans une situation concrète.':'Represent and compare fractions in a real-world situation.',
'Utiliser la proportionnalité dans la vie courante.':'Apply proportionality to everyday situations.',
'Collecter, organiser et interpréter des données.':'Collect, organise and interpret data.',
'Reconnaître et utiliser des propriétés géométriques.':'Recognise and apply geometric properties.',
'Mobiliser les formules d’aire et de périmètre.':'Apply area and perimeter formulas.',
'Appliquer la notion étudiée et argumenter une solution.':'Apply the topic and explain a solution.',
'cartons, papier quadrillé, ciseaux, crayons de couleur':'card, graph paper, scissors, coloured pencils',
'catalogues, règle, feuilles, calculatrice':'catalogues, ruler, paper, calculator',
'questionnaire, feuilles, crayons, tableur facultatif':'questionnaire, paper, pencils, optional spreadsheet',
'règle, équerre, compas, feuilles cartonnées':'ruler, set square, compass, card',
'papier quadrillé, règle, crayons':'graph paper, ruler, pencils',
'papier, règle, crayons, calculatrice si nécessaire':'paper, ruler, pencils, calculator if needed',
'Créer des parts de pizzas en papier, représenter trois fractions, puis comparer et expliquer les résultats.':'Make paper pizza slices, represent three fractions, then compare and explain your results.',
'Préparer une liste de produits, construire un tableau de prix proportionnels et présenter les calculs.':'Prepare a product list, create a proportional pricing table, and present the calculations.',
'Réaliser un sondage anonyme, construire un tableau d’effectifs et dessiner un diagramme.':'Carry out an anonymous survey, prepare a frequency table, and draw a chart.',
'Construire des figures, indiquer leurs propriétés et expliquer les constructions à la classe.':'Construct shapes, describe their properties, and explain the constructions to the class.',
'Imaginer un plan simple, calculer le périmètre et l’aire de plusieurs espaces et justifier les unités.':'Design a simple plan, calculate the perimeter and area of several spaces, and explain the units.',
'Inventer une situation réelle en lien avec le chapitre, résoudre le problème et expliquer la démarche à l’oral.':'Invent a real-world situation related to the chapter, solve the problem, and explain the method aloud.',
// Standalone custom topics in the supplied textbooks
'Diviseurs d’un entier naturel':'Divisors of a natural number','Plus grand commun diviseur':'Greatest common divisor',
'Nombres premiers entre eux':'Coprime numbers','Écriture et simplification':'Writing and simplifying fractions',
'Fractions irréductibles':'Fractions in simplest form','Fractions décimales':'Decimal fractions',
'Tableaux de proportionnalité':'Proportionality tables','Quatrième proportionnelle':'Fourth proportional',
'Pourcentages':'Percentages','Échelles':'Scales','Lire un graphique':'Reading charts',
'Effectifs et fréquences':'Counts and frequencies','Diagrammes en barres et circulaires':'Bar charts and pie charts',
'Construction et propriétés':'Construction and properties','Triangles particuliers':'Special triangles',
'Raisonnement géométrique':'Geometric reasoning','Droites parallèles et sécantes':'Parallel and intersecting lines',
'Droites perpendiculaires':'Perpendicular lines','Distance d’un point à une droite':'Distance from a point to a line',
'Substitution':'Substitution','Calcul d’une expression littérale':'Evaluating an algebraic expression',
'Écriture littérale':'Algebraic notation','Calcul d’expressions algébriques':'Evaluating algebraic expressions',
'Égalité et inconnue':'Equality and unknowns','Résolution d’équations simples':'Solving simple equations',
'Vérification':'Checking solutions'
};
Object.assign(translations, {"ATELIER MATHS": "ATELIER MATHS", "📚 Bibliothèque": "📚 Library", "Tableau de bord": "Dashboard", "Bibliothèque": "Library", "Créateur d’examens": "Examination Builder", "Fiches d’exercices": "Worksheets", "Activités et projets": "Activities and Projects", "Documents enregistrés": "Saved Materials", "📖 Ouvrir le livre": "📖 Open book", "Fiches de révision": "Revision worksheets", "Examens et fiches": "Exams and worksheets", "Examen de Mathématiques": "Mathematics Examination", "VOTRE ESPACE PÉDAGOGIQUE": "YOUR TEACHING WORKSPACE", "CRÉATION SUR MESURE": "CUSTOM EXAM BUILDER", "Une question à la fois": "One question at a time", "Types de questions et nombre d’exercices": "Question types and exercise counts", "Nombre exact de questions": "Exact question count", "Nombre exact d’exercices": "Exact number of exercises", "Chapitres à utiliser (plusieurs choix possibles)": "Select chapters (multiple selections allowed)", "Types de questions et nombre d’exercices à droite": "Question types and counts on the right", "Répartition incorrecte": "Incorrect distribution", "Texte uniquement": "Text only", "Écris Vrai ou Faux, puis corrige les affirmations fausses.": "Write True or False, then correct the false statements.", "Écris Vrai ou Faux, puis corrige les affirmations fausses.": "Write True or False, then correct the false statements.", "Choisir le nombre de parties": "Choose number of parts", "Nombre de parties": "Number of parts", "Correcteur": "Answer key", "Fiche de Révision": "Revision Worksheet", "Générer une fiche": "Generate a worksheet", "Générer la fiche": "Generate worksheet", "Consignes": "Instructions", "Barème": "Marking scheme", "Manuel complet en PDF · consultation dans le site": "Complete PDF textbook · view in the website", "Les 5 manuels fournis": "The five supplied textbooks", "Ouvrez les manuels complets directement dans le site et préparez des documents à partir des chapitres.": "Open the complete textbooks directly in the website and prepare materials based on the chapters.", "Documents et photos ajoutés": "Uploaded documents and photos", "Aucun document français fourni pour la classe 7.": "No French textbook was provided for Grade 7.", "Ajouter le manuel français": "Upload French textbook", "Manuel français indisponible": "French textbook unavailable", "Le manuel français de 7e année manque. Ajoutez l’édition française dans la Bibliothèque.": "The French Grade 7 textbook is missing. Upload the French edition in the Library.", "Référence du livre": "Book reference", "Livres en français": "French textbooks", "Livres en anglais": "English textbooks", "Manuel en français": "French textbook", "Manuel en anglais": "English textbook", "Chapitres et manuels adaptés à la langue sélectionnée.": "Chapters and textbooks match the selected language.", "La version française de ce livre n’a pas été fournie.": "The French version of this textbook has not been provided.", "Vous pouvez ajouter votre PDF français ci-dessous.": "You can upload your French PDF below.", "Présentation PowerPoint": "PowerPoint presentation", "Exporter PowerPoint (.pptx)": "Export PowerPoint (.pptx)", "Exporter les diapositives": "Export slides", "Fiche pédagogique": "Teaching worksheet", "Exporter l’examen": "Export exam", "Examen": "Exam", "Durée (minutes)": "Duration (minutes)", "Titre de la fiche": "Worksheet title", "Langue du document": "Document language", "Langue du sujet": "Exam language", "Langue de l’interface": "Website language", "Année scolaire": "Scholastic year", "Fiche enregistrée dans Documents enregistrés.": "Worksheet saved in Saved Materials.", "Montrer les réponses": "Show answers", "Masquer les réponses": "Hide answers", "Question": "Question", "Choix": "Options", "Réponse": "Answer", "Correction": "Solution", "Vrai": "True", "Faux": "False", "Choisis Vrai ou Faux": "Choose True or False", "Proposition": "Statement", "Modifiez chaque exercice directement ici.": "Edit each exercise here.", "Choisissez le nombre d’exercices de chaque type à droite.": "Select the number of exercises per type using the dropdowns on the right.", "Les sous-notions sont modifiables ; vérifiez leur correspondance exacte avec le manuel.": "Subtopics are editable; verify they match the textbook.", "Chapitres": "Chapters", "Chapitre": "Chapter", "Saisir": "Enter", "Fermer le livre": "Close book", "Sauvegarde complète": "Full backup", "Ne pas modifier le contenu déjà saisi lors du changement de langue.": "Previously entered material is not overwritten when switching languages.", "Les fichiers ajoutés : les références cochées sont associées à la préparation du sujet, mais le moteur hors ligne ne peut pas lire automatiquement tous les PDF, Word et photos.": "Added files: selected references are associated with the exam, but the offline generator cannot automatically read every PDF, Word file or photo.", "Les fichiers ajoutés :": "Added files:", "les références cochées sont associées à la préparation du sujet, mais le moteur hors ligne ne peut pas lire automatiquement tous les PDF, Word et photos.": "selected references are associated with the exam, but the offline engine cannot automatically read every PDF, Word document or photograph.", "How does the generator work? Le moteur local propose des exercices originaux à partir des notions recensées. Vérifiez l’alignement précis avec le manuel et relisez le corrigé avant diffusion. Pour une analyse d’une page particulière, utilisez la consigne ChatGPT puis importez le JSON.": "How does the generator work? The local engine creates original exercises from the recorded topics. Check the exact textbook alignment and review every answer before sharing. For a specific textbook page, use the ChatGPT prompt and import the JSON.", "Le moteur local propose des exercices originaux à partir des notions recensées. Vérifiez l’alignement précis avec le manuel et relisez le corrigé avant diffusion. Pour une analyse d’une page particulière, utilisez la consigne ChatGPT puis importez le JSON.": "The local engine creates original exercises from the recorded topics. Verify textbook alignment and review each answer before sharing. For a specific page, use the ChatGPT prompt and import its JSON.", "Les fichiers ajoutés : les références cochées sont associées à la préparation du sujet, mais le moteur hors ligne ne peut pas lire automatiquement tous les PDF, Word et photos. How does the generator work? Le moteur local propose des exercices originaux à partir des notions recensées. Vérifiez l’alignement précis avec le manuel et relisez le corrigé avant diffusion. Pour une analyse d’une page particulière, utilisez la consigne ChatGPT puis importez le JSON.": "Selected references are associated with the exam, but the offline engine cannot automatically read every uploaded document. The local engine creates original exercises using the selected topics. Verify alignment with your textbook and check all answers. For an exact textbook page, import questions created with ChatGPT."});
const dictionaries={fr:Object.fromEntries(Object.keys(translations).map(k=>[k,k])),en:translations};
// Text rendered with variable numbers, chapter/grade references, etc.
function dynamic(input){let s=input;
// Translate combined textbook descriptions without changing teacher-entered content.
s=s.replace(/Révisions et problèmes/g,'Revision & problems');
s=s.replace(/Al-Ahlia • Mathématiques (\d+)e année/g,(_all,g)=>`Al-Ahlia • Mathematics Grade ${g}`);
s=s.replace(/· vol\. 1 et 2/g,'· vols. 1 and 2');
s=s.replace(/ · tome (\d+)/g,(_all,v)=>` · vol. ${v}`);
s=s.replace(/(\d+) chapitres •/g,(_all,n)=>`${n} chapters •`);
s=s.replace(/(\d+) entrées de la table des matières/g,(_all,n)=>`${n} table-of-contents entries`);
s=s.replace(/Les sous-notions sont modifiables ; vérifiez leur correspondance exacte avec le manuel\./g,'Subtopics are editable; check that they match the textbook.');

const rules=[
[/^ATELIER MATHS \/ (.+)$/,(_,p)=>`MATHS WORKSHOP / ${({'TABLEAU DE BORD':'DASHBOARD','PROGRAMME':'SYLLABUS','CHAPITRE':'CHAPTER','NOTION':'TOPIC','ÉVALUATIONS':'EXAMS','ENTRAÎNEMENT':'PRACTICE','PROJETS':'PROJECTS','BANQUE DE QUESTIONS':'QUESTION BANK','RESSOURCES':'RESOURCES'})[p]||p}`],
[/^Mathématiques · (\d+)e année$/,(_,g)=>`Mathematics · Grade ${g}`],
[/^(\d+)e année$/i,(_,n)=>`Grade ${n}`],
[/^(\d+)e ANNÉE$/i,(_,n)=>`GRADE ${n}`],
[/^(\d+)e$/i,(_,n)=>`G${n}`],
[/^CHAPITRE (\d+) · (\d+)e ANNÉE$/,(_,c,g)=>`CHAPTER ${c} · GRADE ${g}`],
[/^NOTION (\d+) · (\d+)e ANNÉE$/,(_,c,g)=>`TOPIC ${c} · GRADE ${g}`],
[/^(\d+) \/ (\d+) chapitres$/,(_,n,m)=>`${n} / ${m} chapters`],
[/^sur (\d+) chapitres$/,(_,n)=>`out of ${n} chapters`],
[/^(\d+) chapitres$/,(_,n)=>`${n} chapters`],
[/^(\d+) entrées de la table des matières$/,(_,n)=>`${n} table-of-contents entries`],
[/^(\d+) questions · (\d+) points$/,(_,n,m)=>`${n} questions · ${m} points`],
[/^(\d+) questions · (\d+) points · (.+)$/,(_,n,m,date)=>`${n} questions · ${m} points · ${date}`],
[/^(\d+) question\(s\) disponible\(s\)$/,(_,n)=>`${n} questions available`],
[/^(\d+) évaluation\(s\)$/,(_,n)=>`${n} exam(s)`],
[/^(\d+) série\(s\) attribuée\(s\)$/,(_,n)=>`${n} assigned exercise set(s)`],
[/^(\d+) réponse\(s\) incorrecte\(s\)$/,(_,n)=>`${n} incorrect answer(s)`],
[/^(\d+) erreur\(s\)$/,(_,n)=>`${n} errors`],
[/^(\d+) \/ (\d+) réponses validées$/,(_,n,m)=>`${n} / ${m} submitted answers`],
[/^(\d+)e année · (.+)$/,(_,g,n)=>`Grade ${g} · ${n}`],
[/^(\d+)e · (.+)$/,(_,g,n)=>`Grade ${g} · ${n}`],
[/^(.+) · (\d+) chapitres recensés\.$/,(_,a,n)=>`${a} · ${n} chapters listed.`],
[/^(.+) · pages (.+)$/,(_,a,p)=>`${a} · pages ${p}`],
[/^p\. (.+) · tome (\d+)$/,(_,p,v)=>`p. ${p} · vol. ${v}`],
[/^tome (\d+)$/,(_,v)=>`volume ${v}`],
[/^(\d+) volumes$/,(_,v)=>`${v} volumes`],
[/^1 volume$/,_=>'1 volume'],
[/^Total : (\d+) points$/,(_,n)=>`Total: ${n} points`],
[/^Exercice (\d+)$/,(_,n)=>`Exercise ${n}`],
[/^Entraînement · (.+)$/,(_,n)=>`Practice · ${n}`],
[/^Mes évaluations \((\d+)\)$/,(_,n)=>`My exams (${n})`],
[/^Mes projets \((\d+)\)$/,(_,n)=>`My projects (${n})`],
[/^(\d+) point\(s\)\.$/,(_,n)=>`${n} point(s).`],
[/^(\d+) point\(s\)$/,(_,n)=>`${n} point(s)`],
[/^(\d+) erreur\(s\) enregistrée\(s\) sur ce chapitre\.$/,(_,n)=>`${n} error(s) recorded for this chapter.`],
[/^(\d+) bonne\(s\) réponse\(s\) sur (\d+)\. Vous pouvez recommencer avec une autre série\.$/,(_,n,m)=>`${n} correct answer(s) out of ${m}. You can start another exercise set.`],
[/^Les (.+) premiers résultats sont affichés\. Affinez vos filtres\.$/,(_,n)=>`Only the first ${n} results are shown. Refine your filters.`],
[/^(.+) : (\d+) pt\(s\)$/,(_,label,points)=>`${label}: ${points} pt(s)`],
[/^(.+) : (\d+) point\(s\)$/,(_,label,points)=>`${label}: ${points} point(s)`],
[/^(.+) : (\d+) point\(s\)\.$/,(_,label,points)=>`${label}: ${points} point(s).`]
];
for(const [re,fn] of rules){if(re.test(s)){s=s.replace(re,fn);break}}return s;
}
function translate(s){if(lang!=='en')return s;if(!s.trim())return s;
const m=s.match(/^(\s*)([\s\S]*?)(\s*)$/);const prefix=m[1],core=m[2],suffix=m[3];
const books=window.MATH_DATA?.grades;let chapter=null;if(books){for(const chapters of Object.values(books)){const u=chapters.find(c=>c.title===core);if(u){chapter=u.original;break}}}
let localized=Object.prototype.hasOwnProperty.call(translations,core)?translations[core]:(chapter||dynamic(core));
// Translate compound labels such as "Grade 5 · Nombres naturels et multiples : révisions".
if(books && localized.includes(' · ')){
 const titles=Object.values(books).flat().filter(u=>u.title!==u.original).sort((a,b)=>b.title.length-a.title.length);
 for(const u of titles){if(u.title.length<7)continue;
 const pos=localized.indexOf(u.title);if(pos<0)continue;
 const before=localized.slice(0,pos),after=localized.slice(pos+u.title.length);
 if((!before||/[·:]\s*$/.test(before))&&(!after||/^\s*(?:·|[,(]|$)/.test(after))) {localized=before+u.original+after;break}
 }
}

return prefix+localized+suffix;
}
function translateNode(node){if(!originalText.has(node))originalText.set(node,node.nodeValue);
const orig=originalText.get(node),translated=translate(orig);if(node.nodeValue!==translated)node.nodeValue=translated;
}
function apply(root=document){document.documentElement.lang=lang;
document.title=lang==='fr'?'Atelier Maths · Cycles 2 et 3 · 4e à 9e année':'Maths Workshop · Cycles 2 & 3 · Grades 4–9';
const textWalker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentNode?.closest?.('script,style,textarea,[data-no-translate],.question .question-text,.question .question-statement,.question .question-answer,.question .exam-subitems,.question .exam-subchoices')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
let node;while(node=textWalker.nextNode())translateNode(node);
const elWalker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT);let el;
while(el=elWalker.nextNode()){for(const attr of ['placeholder','title','aria-label']){if(!el.hasAttribute(attr))continue;let originals=originalAttrs.get(el);if(!originals){originals={};originalAttrs.set(el,originals)}if(!(attr in originals))originals[attr]=el.getAttribute(attr);const dest=translate(originals[attr]);if(el.getAttribute(attr)!==dest)el.setAttribute(attr,dest)}}
const btn=document.getElementById('langToggle');if(btn){btn.setAttribute('aria-pressed',String(lang==='en'))}
for(const choice of document.querySelectorAll('[data-global-lang]')){const active=choice.dataset.globalLang===lang;choice.classList.toggle('is-active',active);choice.setAttribute('aria-pressed',String(active));choice.setAttribute('aria-current',active?'true':'false')}
const title=document.querySelector('#examTitle');if(title){if(lang==='en'&&['Évaluation de mathématiques','Examen de Mathématiques'].includes(title.value))title.value='Mathematics Examination';else if(lang==='fr'&&['Mathematics exam','Mathematics Examination'].includes(title.value))title.value='Examen de Mathématiques'}
}
function setLanguage(next){lang=next==='en'?'en':'fr';try{localStorage.setItem(KEY,lang)}catch{}apply(document)}
function toggle(){setLanguage(lang==='fr'?'en':'fr')}
function getLanguage(){return lang}
function displayUnit(u){if(!u)return '';if(lang!=='en')return u.title;const ref=window.MATH_DATA?.grades?.[u.grade]?.find(x=>x.id===u.id);return ref&&ref.title===u.title?u.original||u.title:u.title}
function displaySource(s,g){return lang==='en'?s.replace('Mathématiques','Mathematics').replace('et 2','and 2'):s}
window.MATH_I18N={getLanguage,setLanguage,toggle,apply,displayUnit,displaySource,translate,dictionaries};
document.addEventListener('DOMContentLoaded',()=>{
const btn=document.getElementById('langToggle');btn?.addEventListener('click',toggle);document.querySelectorAll('[data-global-lang]').forEach(b=>b.addEventListener('click',()=>{if(lang!==b.dataset.globalLang)btn?.click()}));apply(document);
let pending=false;new MutationObserver(records=>{if(lang!=='en'||pending||!records.some(r=>r.addedNodes.length))return;pending=true;queueMicrotask(()=>{pending=false;apply(document)})}).observe(document.body,{childList:true,subtree:true});
});
})();

