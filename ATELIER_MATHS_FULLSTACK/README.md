# ATELIER MATHS — Local Full-Stack Website

**Node.js backend + HTML/CSS/JavaScript frontend + local persistent file storage.**

This is a multi-file, developer-friendly conversion of the latest supplied Atelier Maths website. The original mathematics engine, bilingual interface, embedded Al-Ahlia textbooks, Examination Builder (Cycles 2 and 3), Worksheet Builder, PowerPoint studio, Word exports, CRDP QCM and geometry tools are retained as frontend components. A new backend provides HTTP APIs, serves all files, stores saved work and saves user-uploaded textbooks/documents on the laptop.

**There is no Python, `.venv`, virtual environment, or external database service.** No `npm install` is needed, because the backend uses Node.js built-in modules only.

## How to start it on Windows (without entering commands)

1. Extract **the entire ZIP** to a normal folder. Do not open `public/index.html` directly.
2. Install **Node.js LTS** on the laptop *once* if it is not already installed. Node.js is the JavaScript backend runtime. This ZIP does **not** contain `node.exe`.
3. Double-click **`Start Atelier Maths.vbs`**. The launcher starts the backend invisibly and opens the website in your default browser.
4. Open **http://127.0.0.1:4173** on that same laptop at any time while the local backend is running.

If `.vbs` files are disabled by Windows policy, double-click **`Start Atelier Maths.cmd`** instead. It will briefly use a Windows command window; you never have to type commands.

**To stop:** end the Node.js process or sign out/shut down the computer. Closing the browser does not necessarily stop the local backend.

> Don't open `file:///.../public/index.html`: that bypasses the backend and stops API-backed storage from working. Use the launcher.

## What is inside

```text
ATELIER_MATHS_FULLSTACK/
├── Start Atelier Maths.vbs       # Windows one-click launcher (no terminal)
├── Start Atelier Maths.cmd       # Windows fallback
├── Start Atelier Maths.sh        # Mac/Linux option
├── package.json                 # no third-party runtime dependencies
├── server/
│   ├── index.js                 # local Node HTTP server and REST endpoints
│   └── storage.js               # persistent JSON state and uploaded files
├── public/
│   ├── index.html               # frontend document (about 7 KB)
│   ├── styles/                  # 18 separated stylesheets
│   ├── js/
│   │   ├── core/                # maths, exam/worksheet, diagrams, DOCX/PPTX logic
│   │   ├── studio/              # PowerPoint lesson studio
│   │   ├── data/                # curricular textbook text and Word template data
│   │   ├── vendor/              # bundled JSZip (no CDN needed for ZIP files)
│   │   └── integration/         # synchronization with local backend
│   └── assets/
│       ├── books/               # ten included Al-Ahlia textbooks (PDF)
│       └── images/              # school graphics
├── data/                        # YOUR saved data and imported PDFs (created at run time)
│   ├── state/                   # saved exams, chapters, questions, presentations
│   └── uploads/                 # user-uploaded documents and textbooks
└── scripts/                     # checks and manifest
```

The ten bundled PDFs include EB4–EB7 English textbooks and available French editions, including **EB7 French**. The files are now individually served at `/assets/books/` instead of being embedded as long Base64 strings in one HTML file. The book-viewer continues using the original book references and page mappings.

## Persistence and moving the site

Data are saved locally in the **`data/` directory on this machine**, with a browser localStorage cache for compatibility. On your next visit, the backend restores saved exercises and presentations. Uploaded PDFs/documents are stored on disk by the backend, and may be migrated from the old browser's IndexedDB when accessed.

To use the complete site on another laptop, **copy the entire extracted folder**, including `data/`, rather than copying `public/index.html`. Install Node.js LTS on the other laptop (if absent), then run the one-click launcher. The site and bundled textbooks work without an internet connection.

To move saved work from a previous *single-file* Atelier Maths website opened using `file:///...`, export a JSON backup from the old site and restore it using **Restaurer / Restore** on this new full-stack site. Browser storage tied to the previous file cannot be automatically read from the new `localhost` origin.

Copy the complete folder or at least the `data/` directory regularly as an extra backup. Saved work is not published online.

## API routes

| Method | URL | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check local server status |
| GET | `/api/status` | State sizes and uploaded-file count |
| GET | `/api/bootstrap.js` | Feed the locally saved state into existing frontend code at startup |
| GET | `/api/state/:key` | Retrieve saved data by key |
| PUT | `/api/state/:key` | Save examination, presentation or language state |
| GET | `/api/uploads/:id` | Retrieve a user-uploaded PDF/document |
| PUT | `/api/uploads/:id` | Store uploaded file data |
| DELETE | `/api/uploads/:id` | Delete user-uploaded file |
| GET | `/api/state-export` | Download a JSON copy of saved state (not PDF files) |

The local server binds only to **`127.0.0.1`** and blocks ordinary cross-origin writes. Do **not** change the bind address to `0.0.0.0` or forward port 4173 to the public internet: the app is designed for local private use and has no authentication.

## AI and other online features

The existing **Copy Prompt for ChatGPT** and **Open ChatGPT** controls remain. ChatGPT itself requires a connection to ChatGPT; opening the website locally does not make ChatGPT run offline. Gemini and Ollama controls removed in the current user version have not been reintroduced.

The optional *text extraction from teacher-imported PDFs* still tries to load Mozilla PDF.js from a CDN in the original app; if offline, the imported file is saved and can be viewed but its text extraction may not be available. Pre-indexed text for the ten included textbooks is already bundled locally.

**Never put an external service API key in `public/`**. Future integrations should be implemented through the Node backend and environment variables. This version does not require external API credentials.

## For developers

- `npm start` starts the Node.js server.
- `npm run dev` restarts it when backend source files change.
- `npm test` runs local HTTP, persistence, and resource tests.
- No transpiler, build step, database server, Python tooling, `.venv` or `npm install` is needed.

Generated Word/PPTX files are still created using the established browser-based exporters, so existing mathematics formatting and diagrams remain editable where the original exports support editability. Moving to full stack changes how the app is served and saved; it does not replace the mathematics generation algorithms with a new AI model.
