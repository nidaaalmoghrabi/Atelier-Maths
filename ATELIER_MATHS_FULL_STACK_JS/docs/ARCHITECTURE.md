# Atelier Maths — Local Full-Stack Architecture

## Technology

- **Frontend:** Original HTML, CSS and vanilla JavaScript, split into standalone files. The UI retains the original examination builder (Cycles 2 and 3), worksheet studio, PowerPoint creator, diagrams, Word export, bilingual UI, chapter catalogs, and embedded text excerpts.
- **Backend:** Node.js built-in `http`, `fs`, `path`, `crypto`, `stream` capabilities. **No Python, `.venv`, Express, database server, or npm dependencies.**
- **Persistence:** JSON snapshot of existing application storage in `backend/data/workspace.json`, safely written with temporary files/renames; uploaded PDFs and resources saved as files under `backend/data/uploads` with a JSON metadata index.
- **Textbooks:** 10 extracted source PDFs stored under `public/books/`; `/books` PDFs are served with HTTP byte-range support for the browser PDF viewer. The extracted PDFs match the source byte-for-byte; see `backend/book-manifest.json` for SHA-256 digests.

## Local startup

Double-click `OPEN_ATELIER_MATHS.vbs` or `START_ATELIER_MATHS.bat`. A locally installed Node.js LTS version must be available. The server listens **only** on `127.0.0.1:3210`; it does not expose the educational data to your local network, and no cloud deployment is involved.

## REST API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health information |
| GET | `/api/state` | Persisted application states |
| GET | `/api/state/:key` | Get one named app store |
| PUT / POST | `/api/state/:key` | Save named app store |
| DELETE | `/api/state/:key` | Remove named store |
| GET | `/api/backup` | Export all server metadata and app state |
| GET | `/api/uploads` | List teacher-uploaded resources |
| GET | `/api/uploads/:id` | Read a resource |
| PUT | `/api/uploads/:id` | Save a PDF/resource binary |
| DELETE | `/api/uploads/:id` | Delete a resource |

The server bridge (`public/assets/js/00-server-bridge.js`) loads saved application state before the original scripts run and sends changes to the backend. This architecture preserves the website's existing code with minimal intervention. Uploaded resources are saved via backend APIs rather than only browser IndexedDB; browser IndexedDB remains a fallback to help migrate older uploaded files.

## Data migration

Old standalone HTML versions run under a different browser origin (`file://`) than the new local Node website (`http://127.0.0.1:3210`). Browser `localStorage` values **do not automatically cross origins**. Export a backup from the old HTML's *Sauvegarder / Backup* tool and import it into the new site's *Restaurer / Restore* tool. If you have already used this full-stack version, copy `backend/data/` to the next laptop.

## Development notes

- The original UI is intentionally not rewritten in React: rewriting it would risk breaking mathematics, tables, professional Word equations, and real-size geometric diagram handling.
- CSS files are ordered as in the original HTML; avoid reorganizing cascade layers unless you deliberately restyle the site.
- Script files are ordered as in the original HTML; moving execution order can break globals such as `MATH_DATA`, `MATH_ENGINE`, `MATH_BOOKS`, `MATH_DOCX`, or `MATH_VISUALS`.
- HTTP access is loopback-only. There is no multi-user authentication, public hosting, cross-device simultaneous editing, or hosted AI service.
- Node's code runs on the **server** and JavaScript runs in the **browser**. Never put private API keys in `public/`.
