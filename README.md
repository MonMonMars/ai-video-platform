# AI Video Platform

Public home for **Everything AI** — a Netflix-style web app for AI-generated video (episodes, features, and creator monetization). The runnable demo lives in [`app/`](./app/).

> **Note:** This repo is seeded for public launch. When the private [`everything-ai`](https://github.com/MonMonMars/everything-ai) source is linked to the Cloud Agent, sync the full `app/` tree from `main` or `cursor/founding-fan-remaining-a644` (Founding Fan) and `cursor/trending-genre-tabs-56f7` (Trending). The current build is a self-contained public preview with the same product surfaces (browse, watch, Founding Fan wallet/badges, Trending daily/weekly + genres).

## Stack

- **React 19** + **TypeScript**
- **Vite 8** (dev server & production build)
- **react-router-dom** for client routing
- **vite-plugin-pwa** — installable PWA shell (service worker in production builds)

## Run locally

```bash
cd app
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

### Production build

```bash
cd app
npm run build
npm run preview
```

Local `npm run dev` and a default `npm run build` use Vite `base` **`/`** (site root).

To build the same way CI does for GitHub Pages:

```bash
cd app
GITHUB_PAGES=true VITE_BASE_PATH=/ai-video-platform/ npm run build
npm run preview -- --base /ai-video-platform/
```

Optional override: set **`VITE_BASE_PATH`** to any path (with or without trailing slash). When **`GITHUB_PAGES=true`**, the default base is **`/ai-video-platform/`** if `VITE_BASE_PATH` is unset.

## Live demo (GitHub Pages)

**Demo URL:** [https://monmonmars.github.io/ai-video-platform/](https://monmonmars.github.io/ai-video-platform/)

Pushes to **`main`** run [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml), which builds `app/` and publishes `app/dist` via GitHub Actions.

### One-time repo setup (Mon)

1. Open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
3. After the first successful workflow run on `main`, the demo URL above should load the app.

Routing uses **React Router `BrowserRouter`** with a **`404.html`** copy of `index.html` so deep links (e.g. `/watch/…`) work on project Pages.

## Product tour (demo)

| Area | Route | What it does |
|------|--------|----------------|
| Home | `/` | Featured hero, trending row, launch campaign CTA |
| Trending | `/trending` | **Daily / Weekly** tabs + **genre** chips |
| Founding Fan | `/founding-fan` | Join campaign, **wallet welcome credit**, **badges** |
| Wallet | `/wallet` | Local **ledger** (demo credits / tips) |
| Watch | `/watch/:id` | Title detail + demo player + tip creator |

Wallet state is stored in `localStorage` only — no backend in this public seed.

## Demo video files

Place episode files under `app/public/media/` if you have them. Large `.mp4` / `.mov` / `.webm` files are **gitignored** by default so clones stay lightweight; the watch screen shows a placeholder until media is added.

## Repository layout

```
app/          # Vite React PWA (primary codebase)
README.md     # This file
.gitignore
```

## License

Add a license file when you choose a public license for the product code.
