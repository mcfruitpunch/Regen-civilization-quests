# REGEN v0.2 · Quest Pathway Engine

**Status:** offline proof of concept; not a civic operations service or verified-impact platform.

## What changed

REGEN now has a small, deterministic and explainable pathway engine in `web/quest-engine.js`, integrated into the `My pathway` screen. It recommends up to three quests using only chosen topic, chosen skill, maximum available minutes, participation setting, the public illustrative seed catalog, and privately marked completion IDs.

The engine checks the quest graph for duplicate or missing IDs, cross-scope dependencies, and cycles. It does not use machine learning, participant profiles, geolocation, private messages, attendance records, ideology, or behavioral telemetry.

## How a quest becomes suggested

1. The quest is marked `illustrative_only` in the fictional demo library. **Draft, under-review, retired, or other states do not appear in recommendations.** This is a demo visibility rule, not a pathway to real-world approval.
2. The quest is not already self-reported as complete.
3. Earlier **suggested** quest IDs listed in `prerequisite_ids` have been self-reported complete.
4. The quest matches the participant's optional topic, skill interest, maximum minutes, and home/community preferences.
5. Candidates sort by smaller scope, shorter estimated time, then stable quest ID. The engine displays plain-language reasons. No hidden score, rewards for ideology, or social ranking is used.

`prerequisite_ids` are **advisory**: a participant may open, inspect, and mark any illustrative quest, even when prior suggested learning steps are unfinished. This deliberately preserves non-linear and disability-accessible participation.

## Examples

- `first-spark` → `neighborhood-assets` → `accessible-path` (community discovery).
- `skill-compass` → `repair-first` → `shared-repair` (learning and low-risk repair).
- `food-systems-101` → `food-waste-baseline` → `food-waste-pilot` (safe food systems).
- `public-information` → `public-meeting` → `bridge-compact` (civic process and institutional dialogue).

Each is a *suggestion for learning*, not a checklist authorizing work at a real site. The later quests require explicit consent and compliance with relevant rules. The Bridge Protocol prohibits deception, targeted persuasion, harassment, and covert infiltration.

## Data and privacy

The demo still uses the v0.1 local browser completion key, so an existing participant does not silently lose markers. No server or login is used. Optional export downloads a small JSON file with only the schema identifier, version, `self_report_only` evidence label, and completed quest IDs. Unknown IDs are filtered. No names, location, reflections, proof, or timestamps are included.

Browser storage may be unavailable or cleared at any time. Exported files are controlled by the person who downloads them, and are not submitted to REGEN automatically. Do not upload them to public GitHub issues.

## Tests

Run:

```bash
python -m pip install 'jsonschema>=4,<5'
python tests/test_project.py
python tests/build_data.py
node --check web/quest-engine.js
node --test tests/quest_engine.test.cjs
python tests/build_prototype.py
git diff --exit-code -- web/index.html
```

The GitHub Actions validation workflow runs these checks on pushes and pull requests.

## Unresolved questions for v0.3

- Human-reviewed real-world quest publication and revocation workflow.
- Affected-community review, appeal, operational support, and safety escalation.
- Accessible user testing (keyboard, screen readers, cognition, mobile and low-bandwidth).
- Secure optional localization and community-defined need without profiling.
- Atlas node identifiers and consented project links.
- Versioned imports and recovery; v0.2 only exports.
- Institutional claims verification; self-report is not evidence of impact.

## Project governance boundary

Public visibility does not mean the project is licensed for public reuse. See `LICENSE_DECISION.md` and issues #1–#3. Do not invite code/content contributions until license, conduct, and review policies have been decided and the maintainer can honor them.
