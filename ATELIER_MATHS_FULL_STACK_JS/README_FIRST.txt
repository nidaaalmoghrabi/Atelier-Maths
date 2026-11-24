ATELIER MATHS — FULL-STACK LOCAL WEBSITE (WINDOWS)
=================================================

This is a REAL frontend + backend project, not a single HTML file.
No Python, .venv, pip or npm install is needed.
The only prerequisite is Node.js version 18 or newer (LTS recommended).

FIRST USE:
1. Install Node.js (only once) from https://nodejs.org/ if it is not already installed.
2. Extract this ENTIRE ZIP folder to your computer (e.g. Desktop).
3. Double-click OPEN_ATELIER_MATHS.vbs to launch without a terminal window.
   Alternatively double-click START_ATELIER_MATHS.bat for status/error messages.
4. Your browser opens automatically at http://127.0.0.1:3210/
5. You do NOT have to publish, deploy or create an internet account.

WHEN TRANSFERRING TO ANOTHER LAPTOP:
- Copy the ENTIRE extracted folder, including backend/data after using it.
- Do not copy just index.html. The backend and books must stay alongside it.
- Data saved on the old website browser can be imported through the existing
  Backup/Restore function, or will migrate automatically if previously opened
  in the same browser origin (but file:// and http:// origins are different).
- To keep new work when transferring, copy backend/data with the other files.

HOW IT IS ORGANIZED:
  public/index.html             HTML user interface (all original sections)
  public/assets/css/           CSS files (design and responsive styles)
  public/assets/js/            Existing JS tools + backend bridge
  public/books/                10 original EN/FR textbook PDFs, incl. EB7 French
  backend/server.js            Node.js server + local REST API
  backend/data/workspace.json  Automatically created database on first save
  backend/data/uploads/        Teacher-uploaded files
  backend/book-manifest.json    List and hashes of embedded textbooks
  START_ATELIER_MATHS.bat      Windows launcher with terminal/error messages
  OPEN_ATELIER_MATHS.vbs       Quiet double-click Windows launcher

LOCAL API:
  GET /api/health                    server health
  GET /api/state                     saved website state
  GET /api/state/:key                saved section
  PUT /api/state/:key                update section
  GET /api/backup                    download backend JSON backup
  GET /api/uploads                   uploaded files catalog
  PUT /api/uploads/:id               save PDF/resource
  GET /api/uploads/:id               read PDF/resource
  DELETE /api/uploads/:id            remove PDF/resource

SECURITY AND CONNECTIVITY:
- Backend listens ONLY on 127.0.0.1 (your computer); no other device on
  the network can reach it.
- Textbooks, offline exercise generation, Word exports, slides and saved files
  can run locally without publishing your data to any server.
- Opening ChatGPT needs an internet connection. Optional PDF.js online lookup
  is retained from the original website; embedded PDFs open using the browser.
- There is no Gemini or Ollama integration, no private API key in browser code.
- If changing code, keep the separation between public/ and backend/.

SHUT DOWN: In the tray or Task Manager close Node.js, or close the Command
Prompt window if you used START_ATELIER_MATHS.bat.
Never delete backend/data when replacing files with a newer version.

SOURCE: Derived from the most recent Atelier Maths version with unchecked PowerPoint chapter selectors.
