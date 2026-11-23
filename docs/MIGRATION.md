# Importing the Orbit 2.6 standalone application

## Status

The current GitHub repository contains build/import/test tooling. **The complete Orbit 2.6 bank and UI have not yet been imported into GitHub.** Import only a verified copy of the last working HTML from the ChatGPT project or your own backup.

Reference file: Orbit_2_6_Profiles_Studio_Offline.html

Expected SHA-256: ea498976009184e48bfebe73c35682d5012ada300a2d5f41b29e34e9937fc718

## Import

~~~sh
node --version
npm run import:legacy -- "/path/to/Orbit_2_6_Profiles_Studio_Offline.html"
npm run build
npm run audit
npm test
~~~

The importer produces:
- src/orbit.shell.html
- src/data/orbit-data.json
- src/data/orbit-accounting-data.json
- src/data/orbit-ict-data.json
- src/data/import-manifest.json

The builder produces dist/orbit.html, and checks it against the source artifact hash in the import manifest. A matching hash means the build is byte-identical to the input file, **not** that every exam answer has been manually verified.

## Do not publish third-party material without review

The subject-bank JSON files embed actual question-page images, diagrams and notes. They are ignored by Git in the initial public-repository setup. Before committing them, verify reuse/redistribution rights or redesign deployment to keep them in user-supplied local packs.

## Backup and rollback

Before using a new build, export existing Orbit profile backups from the old version. Keep the original v2.6 file unchanged. Profiles are local, not password-protected. A changed file URL or browser can use a different storage area; import the exported bundle when necessary.

## Validation checklist

- Input is the actual functioning v2.6 HTML, not a stub or earlier version.
- SHA-256 matches the reference above, or explain intentional divergence.
- import → build → SHA-256 passes.
- Bank audit: 770 Business Studies, 130 Accounting, 150 ICT exercises.
- Run the provided Node tests.
- Manually test phone, tablet, desktop and all three subjects in a browser.
- Verify answer-key privacy before submission and profile data isolation.

Do not label a build released solely because it passes schema tests.
