# Orbit — GCE A/L Study Companion

A local-first learning application for Sri Lankan GCE A/L **Business Studies, Accounting, and ICT**.

## Development status

The latest verified local application is **Orbit 2.6** (23 November 2026). This repository is now the source of truth **for development going forward**.

**Migration is in progress.** The existing 48 MB Orbit 2.6 standalone HTML has **not** been published in this repository. It contains embedded source-page images and third-party educational material whose redistribution permissions require review. Do not mistake this repository's migration tools for a completed hosted release.

### Existing Orbit 2.6 features

- 1,050 exercises across three subjects.
- Question-focused original-paper images and linked shared contexts.
- Separate learner profiles, separate subject progress, and a master dashboard.
- Paper practice, answer-key scoring, self-assessed written responses, and reports.
- Offline notes, reading search, adaptive revision, AMOLED mode, sounds, and responsive UI.

## Getting started with the repository

Requires **Node.js 20 or later**. No package installation, cloud account, paid runner, or build service is required.

1. Clone this repository.
2. Download the existing Orbit 2.6 HTML from the original ChatGPT project conversation.
3. Put that HTML at a path on your computer. Do not commit it to a public repository until its content and licenses have been reviewed.
4. Run the following in the repository:

~~~sh
npm run import:legacy -- "/path/to/Orbit_2_6_Profiles_Studio_Offline.html"
npm run build
npm run audit
npm test
~~~

The importer splits the exact HTML into a template and three JSON subject banks. The builder reconstructs a single offline file in dist/orbit.html. After importing the unchanged original, its SHA-256 must match the source artifact's hash (see docs/MIGRATION.md).

**Expected original SHA-256:**
ea498976009184e48bfebe73c35682d5012ada300a2d5f41b29e34e9937fc718

## Repository layout

- scripts/lib/legacy.mjs — reversible extraction and bank validation
- scripts/import-legacy.mjs — one-time import from an existing HTML build
- scripts/build.mjs — produces a standalone HTML
- scripts/audit.mjs — checks question IDs, keys, and contexts
- tests/legacy.test.mjs — executable pipeline tests
- docs/ARCHITECTURE.md — target architecture and storage design
- docs/MIGRATION.md — import instructions, limitations, and safeguards

Generated source banks and dist/ are ignored for now, pending a content-rights review. Existing Orbit 2.6 remains usable separately.

## Development rules

- Preserve the original question wording, source provenance, and shared information.
- Never auto-grade a question with an unverified answer.
- Keep all learners and all subjects' progress isolated.
- Export/import backups before migrations.
- Keep the interface usable on small phones, tablets, and desktops.
- Make changes testable and document what was **actually** verified.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the next development steps.


## GitHub Pages — deployed launcher

**Site:** https://induwaralasindu.github.io/GCE-A-L-Study-Companion/

GitHub Pages deployment succeeded on 2026-11-23 using [Deploy Orbit Pages](.github/workflows/deploy-pages.yml). The public page is a **local-first launcher**, not a public distribution of third-party exam scans. On each device, select your original, verified `Orbit_2_6_Profiles_Studio_Offline.html` once. The browser checks the pinned SHA-256 and runs the entire app without uploading that file. Browser storage may preserve it between visits.

See [GitHub Pages setup, privacy, and limitations](docs/PAGES.md).

**Privacy:** Learner progress and profiles remain browser-local; they do not automatically sync between devices. Export progress from the previous offline app and import it on the hosted origin to migrate data.
