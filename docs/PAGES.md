# Orbit on GitHub Pages

## Site

Expected site after GitHub Pages has been enabled and deployed:
https://induwaralasindu.github.io/GCE-A-L-Study-Companion/

This is a **publicly hosted launcher**, not a public copy of all 1,050 question assets. It avoids publishing scans, diagrams and other third-party educational content with unverified redistribution rights.

## Setup

GitHub repository → Settings → Pages → Build and deployment → **GitHub Actions**.

The workflow at `.github/workflows/deploy-pages.yml` publishes the `docs/` folder on pushes to `main`. If automatic Pages setup fails, the repository administrator must enable GitHub Actions as the Pages source manually and rerun the workflow.

## Using Orbit

1. Download the original `Orbit_2_6_Profiles_Studio_Offline.html` from the project conversation.
2. Open the Pages site in Chrome, Edge, or another supported browser.
3. Select that local HTML file. The browser verifies its SHA-256 before running it.
4. The full application (three subjects, profiles, sessions, scores, reports) runs on the Pages origin. The large app content is stored in IndexedDB if permitted.
5. To return to the setup screen, visit the same site with `?setup=1` at the end of the URL.

Expected original SHA-256:
`ea498976009184e48bfebe73c35682d5012ada300a2d5f41b29e34e9937fc718`

## Privacy, storage and limitations

- All imported material stays inside the device's browser. The import control does **not** upload the file.
- Saved learner profiles and scores remain local to that browser and origin. They are not synchronized between devices.
- Existing progress saved by the old `file://` URL does not move automatically to GitHub Pages; use Orbit's progress export/import workflow.
- Browser storage may reject a 48MB file (particularly in private mode). In that case, launch from the local file each session.
- The launcher accepts only the pinned original Orbit 2.6 HTML hash. New versions need a reviewed hash update and a fresh deployment.
- Installation of a PWA or availability while offline is browser-dependent. Service-worker caching covers the small launcher; the app itself is stored separately.

## Roadmap

Replace the monolithic launcher with a modular, rights-reviewed distribution of original application code, user-supplied content packs and appropriately licensed question sources.
