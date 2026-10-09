# 08 · Repository Setup & Publication

## Repository location

- **Owner:** `mcfruitpunch`
- **Name:** `Regen-civilization-quests`
- **Default branch:** `main`
- **Visibility:** Public as created by owner on 2026-10-09.
- **Status:** Early concept and offline demonstration, not a deployed civic platform.

## Directory orientation

- `README.md`, `REGEN_Full_Framework_v0.1.md`: entry point and combined concept.
- `docs/`: charter, game mechanics, quest engine, institutional Bridge Protocol, governance, roadmap, architecture, and research questions.
- `data/quests.json`: source of 12 fictional illustrative quests.
- `schema/quest.schema.json`: quest authoring contract.
- `web/index.html`: generated offline browser demo.
- `web/template.html`: source template for the demo.
- `tests/`: Python validation and deterministic HTML generation.
- `.github/workflows/validate.yml`: basic automated checks.

## Local verification

1. Install Python 3.12 or newer and `jsonschema` version 4.
2. Run `python tests/test_project.py` to validate the 12 illustrative quests.
3. Run `python tests/build_prototype.py`; check that `web/index.html` did not change.
4. Open `index.html` locally in a browser. Verify quests and local-only tracking.
5. After GitHub Actions runs, review the foundation checks and resolve failures.

## Publish a preview only when ready

For a public GitHub Pages preview, select Settings → Pages → Deploy from a branch → `main` → `/(root)`. The root `index.html` redirects into `web/index.html`. Browser storage holds demo completion state; it is not server-based verification. GitHub Pages deployment is a separate owner decision and must be checked before claiming the site is live.

## Publishing boundaries

No accounts, evidence upload, precise location collection, institution scoring, or targeted political campaigns belong in this release. The entire project is currently public on GitHub, so do not store personal information, private project partner notes, secrets, identifying evidence, or sensitive allegations in commits or issue discussions.

## Unresolved decisions

No software/content license selected. Contribution and conduct documents remain drafts. There is no approved live moderation capacity, validated effectiveness evidence, or consented community pilot. Owner decisions must be explicitly recorded before activating live social features.
