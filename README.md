# Rank Rank — CMA Final Law (Paper 13)

Daily practice for Corporate & Economic Laws: MCQs, case questions, written answers and key values, built from the shared BCCA / CMA Bhavya material and the June 2026 paper. Errors and law changes are corrected in the app, with the book’s original wording kept and a source link to verify.

## Publish on GitHub Pages
1. Create a public repository (e.g. `rank-rank`).
2. Upload everything in this folder, keeping the folders: `index.html`, `app.js`, `styles.css`, `sw.js`, `manifest.webmanifest`, `README.md`, `data/`, `icons/`, `pdfs/`.
3. Settings → Pages → Deploy from a branch → `main` / root → Save.
4. Open `https://<username>.github.io/rank-rank/`. On phones: Share → Add to Home Screen.

**Updating later:** after changing any file, change the version line at the top of `sw.js` (`const V = ...`) so installed copies refresh.

## What’s inside
| Path | What it is |
|---|---|
| `data/bank.js` | 818 questions (374 MCQs incl. June 2026 paper, 444 written — BCCA Q&A, ICMAI MQP model answers, Disha Lohana question banks) with page links, corrections and law updates |
| `data/cheat.js` | Unit-wise key values (425 lines quoted from the Concept Book), 18 “often confused” pairs, loaded only when the Cheat sheet opens |
| `pdfs/` | 37 PDFs (largest 11.7 MB, all under GitHub’s 25 MB browser-upload limit) — keep file names unchanged |
| `icons/` | App icon, maskable icon, notification badge |

App code + data ≈ 1 MB; PDFs load only when opened. Works offline after the first visit.

## Reminders
- **Google Calendar / Apple / Outlook:** works everywhere, repeats daily, links back into the app.
- **Device notifications:** on Android and desktop Chrome/Edge when the app is installed. iPhone shows web notifications only for Home Screen apps and only via a push server, so use the calendar reminder there.

Progress, highlights, starred questions and uploaded PDFs stay in each user’s browser. Settings → Export progress moves them to another device.

## Backups (no data loss)
- Progress is saved instantly in the browser and mirrored to a second internal store; if one is wiped, the app restores from the other on next open.
- **Settings → Backup & restore → Choose a backup folder** (Chrome/Edge on desktop and Android): one file, `rank-rank-backup.json`, plus an `uploaded-pdfs` folder. It is written only when something changed — on opening if 6 hours have passed, on leaving the app or finishing a session if 30 minutes have passed, and every 6 hours while open.
- Safari / iPhone can’t write to folders: use **Download backup file**; Today reminds you when one is due.
- **Restore from a backup file** also accepts old progress exports.
