# Orbit architecture and development roadmap

## Guiding principles

1. Local-first, no required server or paid services.
2. Original examination text, shared instructions, tables and diagrams must remain intact.
3. Distinguish **official**, **source-verified**, **self-assessed**, and **Orbit-authored** questions.
4. Learners and subjects must have separate state; master statistics are read-only aggregates.
5. Responsive UI first: small phones, tablets in both orientations, desktops, keyboard access.
6. Reproducible builds and auditable question provenance.

## Existing v2.6 implementation

The last verified app is a standalone HTML (~47 MiB) embedding three JSON subject banks, UI scripts, CSS and source-page images.

The bank IDs are orbit-data (Business Studies), orbit-accounting-data (Accounting) and orbit-ict-data (ICT). The first import step separates them from the HTML shell without changing execution semantics. The build command reverses this operation.

This import is **not** a rewrite. Its first acceptance test is byte-for-byte equality with the original, including 1,050 question IDs and existing progress-storage keys.

## Next stages

### Phase 1: Baseline import and licensing review
- Import v2.6 from the original local artifact.
- Verify SHA-256 and run scripts/audit.mjs.
- Review third-party content before committing source-page images publicly.
- Keep the original working offline artifact as a rollback.

### Phase 2: Modularization
- Extract styles and behavior from src/orbit.shell.html into src/styles and src/app modules.
- Normalize the lesson, question, context, source, paper, and verification schemas.
- Separate page images from question metadata; preserve original source attribution.
- Add schema migration routines, fixtures, and versioned import/export validation.

### Phase 3: Question accuracy and lesson mapping
- Use teacher-guide competency codes and page references where grounded.
- Preserve shared contexts as explicit entities with associated question IDs.
- Support single, multi-select, fill, short answer, diagram labeling.
- Flag uncertain answer keys and lesson mappings rather than silently guessing.

### Phase 4: Profiles and analytics
- Keep local multi-learner profiles, independent subject progress, and master statistics.
- Add backup round-trip tests and storage migration compatibility tests.
- Prevent a profile or subject switch from leaking in-progress answers.

### Phase 5: Performance and delivery
- Convert large embedded image sources into cacheable assets for web deployment, preserving optional single-HTML offline exports.
- Lazy-load nonactive subject banks.
- Add viewport, accessibility, reduced-motion, offline and storage-limit tests.
- Publish a release only after end-to-end tests and manual sample review.

## Proposed structure once migrated

~~~text
src/
  orbit.shell.html         # reversible initial template
  data/                    # subject banks (private until rights reviewed)
  styles/
  app/
  components/
  assets/
scripts/
tests/
docs/
dist/                     # generated, never hand-edit
~~~

## Storage contract

Never rename existing Orbit 2.6 storage keys without a tested migration. The default Main profile must preserve the legacy learner data. Other profiles must use unique namespaced keys. Treat all profiles as organizational only, not access-control boundaries.

## Public repository caveat

Paper scans, publisher diagrams, course notes and educational images may have third-party copyrights. A public source repository must not assume permission to redistribute them. Separate original app code from those resources, review licenses and permissions, and use source links or user-provided local imports where appropriate.
