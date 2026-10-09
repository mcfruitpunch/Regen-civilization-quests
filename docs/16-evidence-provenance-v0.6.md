# 16 · REGEN v0.6 — Evidence, Provenance, Corrections and Honest Claims

**Status: working synthetic evidence laboratory, NOT a real-world impact or verification system.** No submissions, real participants, source uploads, organizational ratings or public approvals are implemented.

## Why this exists

Regenerative participation may produce an activity, an artifact, a change, or unintended harm. Those are different classes of statement. A quest marked complete should never automatically turn into evidence that people, institutions, or ecosystems are better off.

| Layer | What a record can honestly establish (with appropriate evidence) | What it does not automatically establish |
| --- | --- | --- |
| Activity | An action is recorded or self-reported | That it was safe, equitable or effective |
| Output | Something is produced (notes, lessons, a proposed process) | That circumstances changed |
| Outcome | A measured condition changed in a defined population and period | That a quest caused the change |
| Harm | A possible or observed adverse condition needs investigation | That an unverified accusation is true |
| Assumption | A hypothesis or design proposal worth interrogating | That any intervention has been tested |

The v0.6 example records are *not* grounded in actual observations. They are fictional fixtures to test software and help explain these distinctions. **0 real-world verified outcomes exist in this dataset.**

## Implemented project structure

- `schema/evidence-ledger.schema.json`: strict JSON Schema for three record collections.
- `data/evidence-ledger.json`: 10 fictional claims, 7 invented sources, 2 revision/withdrawal examples, all marked synthetic-only.
- `scripts/check_evidence.py`: fail-closed schema and cross-reference validator; checks duplicate IDs, source references, linked quest IDs, invalid metric use, current revisions and withdrawal events.
- `web/evidence-engine.js`: pure read-only browser helpers that reject attempts to claim verification, approval, causal certainty, or real source data in the fictional record format.
- `web/evidence-template.html` and generated `web/evidence.html`: accessible-minded, offline browser interface showing provenance, limitations, competing explanations, arithmetic examples and correction history.
- `tests/build_evidence.py`: deterministic build from committed structured data.
- `tests/evidence_engine.test.cjs` and `tests/test_evidence.py`: fabricated-verification attacks, forged source kinds, dangling links, revised/withdrawn claims, and no real-world data collection assertions.
- `.github/workflows/validate.yml`: validation and generated-file check.

## Source provenance and the privacy boundary

The only available source kinds here are `hand_authored_fixture` and `fictional_method_note`, with the required origin `invented_for_testing`. No source URL, participant identity, site location, private Atlas research note, photo or confidential report is accepted as a source record. Public GitHub is not an appropriate data intake system for sensitive evidence.

Every claim must identify at least one existing fictional source ID, a method description, limitations, and alternative explanations. Optional references to REGEN quests identify the learning *topic*, never completion or impact.

### Correction and withdrawal

The ledger uses stable claim IDs, current revision numbers, and separate correction events. A changed revision needs an event bound to the exact current revision. A withdrawn record remains visible with a **WITHDRAWN** label and an explanation, but is not an active conclusion. Because Git repositories can preserve older commits, withdrawal cannot guarantee deletion of material already published.

The v0.6 correction records are test specimens, not signed, tamper-proof audit trails. No reviewer identity is bound to them and no independent authority has approved them.

## Numeric examples and causal limits

The fake food-waste example changes from 40 to 30 **invented items**, which is a numeric difference of -10, or an arithmetic -25%. No real waste was counted and **no causal effect is estimated**.

Even with real measurements, a before/after comparison can be misleading: seasonality, changing participation, menu mix, counting practices, displaced labor, and the handling of waste can all alter totals. A legitimate future impact study must define the population, intervention, counterfactual, potential harms, baseline, follow-up windows, missing data, distribution of costs, and independent review.

The 0-to-3 fictional written ideas example is classified as an **output**, never ecological change. Attendance can increase while inclusion or safety worsens. There is no scoring of people or institutions.

## Non-negotiable safety gates

1. Completion markers, self-reported progress and the v0.4 simulation trace are never independent evidence of outcome or consent.
2. Passing JSON Schema or GitHub Actions proves only that specific tests ran successfully; it does not certify truth, legal compliance, accessibility or impact.
3. Real people, sites and organizations must not be introduced into the public ledger until data rights, consent, privacy handling, publication authority, correction and incident-response processes are operational.
4. Founder, reviewer or sponsor involvement cannot convert unsupported statements into approval or institutional redemption.
5. Claims must distinguish what was done, what was observed, the uncertainty around effects, who benefited, who carried burdens, and who may dispute the interpretation.
6. Affected communities and independent domain specialists must be able to question and correct reports when a real pilot eventually exists.
7. No public claims about identifiable individuals or harmful conduct without a lawful, fair, context-appropriate evidence and due-process process.

## What is *not* implemented yet

- Real-world field data, source ingestion, participant consent management, secure evidence storage or protected report channels.
- Signed editorial review, trusted publication and revocation, or legally meaningful data retention/deletion policies.
- Statistics with confidence intervals or valid causal evaluation for real-world studies.
- Any cross-repository import from the private Regenerative Society Atlas.
- Independent auditing by affected people or qualified experts.
- End-to-end mobile/screen-reader accessibility verification.

## Next architecture: from fictional evidence to accountable learning

**v0.7 candidate:** a synthetic evaluation design workbench for adverse outcomes, counterfactual explanations, null results and evidence expiry; complementary provenance versioning; education-friendly, explicitly noncertifying methodology cards. That work can continue before community submissions.

**Later:** only after policy, rights, reviewer authority and security exist, evaluate a narrow, truly consented research/pilot process. No part of v0.6 opens the public submission gate.

### Repeatable developer checks

```sh
python -m pip install 'jsonschema>=4,<5'
python scripts/check_evidence.py
python -m unittest discover -s tests -p 'test_evidence.py'
node --check web/evidence-engine.js
node --test tests/*.test.cjs
python tests/build_evidence.py
git diff --exit-code -- web/evidence.html
```

**Principle:** A claim should have a traceable basis, a clear confidence/uncertainty boundary, a correction route, and a way to say *we don't know* without treating anyone as a failure.
