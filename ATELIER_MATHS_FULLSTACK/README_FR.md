# ATELIER MATHS — Site local Full Stack

Cette version sépare votre site en fichiers **HTML, CSS et JavaScript**, avec un **serveur local Node.js** et un dossier de données persistantes. Aucun Python, `.venv` ou déploiement Internet n'est nécessaire.

**Pour lancer sur Windows :** décompressez le ZIP complet, installez Node.js LTS une seule fois si nécessaire, puis double-cliquez sur **`Start Atelier Maths.vbs`**. Le navigateur s'ouvrira sur **http://127.0.0.1:4173**. Si Windows refuse les fichiers VBS, utilisez `Start Atelier Maths.cmd`.

**Important :** ne double-cliquez pas sur `public/index.html`, car les sauvegardes fonctionnent via le serveur local. Pour déplacer le site sur un autre ordinateur, copiez tout le dossier **y compris `data/`**. Les PDF originaux, dont le manuel français EB7, sont inclus dans `public/assets/books/`.

Les évaluations Cycle 2 et Cycle 3, les fiches, les présentations, les exercices de géométrie, les exportations Word/PowerPoint et le site bilingue sont conservés. Les données sont enregistrées en local dans `data/` et dans un cache navigateur.

Pour récupérer les travaux enregistrés dans l'ancienne version HTML, exportez une sauvegarde JSON de l'ancien site, puis importez-la avec **Restaurer / Restore** sur la nouvelle version.

ChatGPT nécessite Internet, mais le site local n'en a pas besoin pour ses fonctions principales. L'extraction de texte des nouveaux PDF peut nécessiter la bibliothèque PDF.js en ligne ; les manuels fournis ont déjà leur index local. Les boutons Gemini et Ollama restent supprimés.
