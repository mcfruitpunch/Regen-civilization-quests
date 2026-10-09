# 13 · Pre-Community Development Lab — REGEN v0.4

**Status:** implemented software rehearsal and fictional curriculum. **No live quests, no participant enrollment, no public submissions, no verified impact.**

## Strategic decision: build deep before scaling wide

REGEN should not depend on an early flood of submissions to develop its core model. A small founding team can create real depth in architecture, educational material, safety principles, tests, and simulations first. The purpose is to reduce the burden on future participants: when communities eventually choose to engage, they should encounter an understandable, accessible, accountable system rather than an unfinished idea.

**Boundary:** We cannot credibly determine others' priorities, know whether actions fit local cultures, secure consent, or establish real-world outcomes by working alone. A mature system must distinguish designer-supplied examples from priorities identified by participants themselves.

## What is implemented in this branch

| Artifact | Quantity | What it actually tests |
| --- | ---: | --- |
| `data/quests.json` | 30 | Illustrative beginner and intermediate learning tasks, all with voluntary alternatives and cautions |
| `data/pathways.json` | 10 | Hand-curated, optional sequences with explicit learning goals and non-goals |
| `data/scenarios.json` | 9 | Hypothetical time, skills, home access, permission limits, interruption and empty-result constraints |
| `web/simulation-engine.js` | 1 pure deterministic engine | Repeatable recommendation traces and exercise-specific coverage gaps |
| `web/lab.html` | 1 offline test page | Scenario selection, step reasoning, budget limits and sample coverage |
| `tests/precommunity_lab.test.cjs` | Automated test suite | Repeatability, stop rules, no contact, never simulating draft publication or impact |
| `tests/build_lab.py` | Reproducible build | Embedded data matches the committed single-file browser lab |

All examples remain `publication_status: illustrative_only` and `evidence_level: self_report`. The prototype's private markers do not become verified activity because of simulated recommendations.

## Ten optional learning tracks

The catalog includes ecology literacy; accessible participation; circular materials; food-system safety; civic-source literacy; accountable institutional transformation; community strengths; safe repair; food-pilot readiness; and transparency about public processes. The tracks are examples of learning arcs, not certification programs or claims about which problems matter most in any place.

**Design rule:** A quest should have one reachable learning objective, explicit consent and safety boundaries, a low-resource option, and a reflection question. Scope levels describe complexity, never a participant's human value. A person may skip any sequence or contribute only at a local scope.

## What our simulation does and does not mean

The lab replays nine *invented*, non-identifying scenarios through the same deterministic v0.2 quest recommender. Each run specifies optional interests, maximum duration, total hypothetical minutes, scenario-only progress markers, no-go quest IDs, and an optional forced stop.

The output is a **fictional trace** with reason strings and capacity used; it is never stored in someone else's progress, never submitted to a server, and never interpreted as evidence that a social intervention helped anybody.

This helps identify defects that are safe and cheap to discover before deployment: broken prerequisite chains, inaccessible time filters, recommendations that exceed a session, mismatched settings, insufficient alternatives, hidden dead ends, and incorrect claims about what the engine accomplished.

It **cannot** evaluate trust, health/safety, local legitimacy, coercion, accessibility for real users, political fairness in practice, or regenerative effectiveness. Those require different kinds of evidence, including opt-in human testing.

## Strategic build backlog before inviting submissions

### Track A — Core game

- Offline-first mobile and desktop usability; keyboard and screen-reader testing.
- Better local knowledge maps and quest-pathway navigation.
- One-click data export/import, deletion, portability, and device recovery.
- Small-scope language, reading-level and assistive participation options.
- Noncompetitive motivation: curiosity, practical learning, collaboration; no ideology points.

### Track B — Knowledge and Atlas

- Agree on a stable, versioned mapping contract with the real Regenerative Society Atlas repository.
- Classify systems, subsystems, possible interventions, competing perspectives, and uncertainty.
- Create an editorial evidence ledger with sources, claims, age of evidence, and corrections.
- Explicitly distinguish designer-authored models from verified local community needs.
- No auto-generated Atlas links to unknown nodes.

### Track C — Quest authoring and learning design

- Create more structured sample pathways, difficulty gradations, and alternate media.
- Offer rigorous editorial lint that catches claims, vague objectives, and missing stop rules.
- Require versioning and reversible corrections to all authored content.
- Rehearse negative outcomes and how to explain a rejected/retired task respectfully.
- Keep real-world publication technically disabled while governance is unresolved.

### Track D — Safety, rights, and governance

- Decide licenses for code and creative content; do not assume public means open source.
- Design reporting/appeal, recusal, donor-conflict, consent, site-specific scope, and revocation rules.
- Add branch protections and binding between an authorized reviewer identity and an exact content version.
- Independent safety/legal/context review for any real-world pilot, with especially high standards for vulnerable participants and workplaces.
- Threat-model public GitHub edits, founder capture, automation abuse and manipulation incentives.

### Track E — Evidence and impact

- Create data definitions for inputs, activities, outputs, outcomes, harms and uncertainties.
- Develop synthetic evaluation fixtures and tests for misleading causal claims.
- Avoid leaderboards, moral scores, institutional redemption badges, and unverifiable success rates.
- Pilot measures should include participants' own assessment of burdens, accessibility, safety and choice.
- Only separately reviewed and consented evidence can support real-world claims.

### Track F — Operations and future collaboration

- Document decision rights, finances, maintenance, incident response and reliable backups.
- Prepare onboarding materials and mock organizations/places for user testing.
- Define voluntary, limited, consented pilot criteria with an actual partner.
- Do not recruit or solicit community submissions until governance, security, accessibility and support capacity exist.

## Maturity gates

**G0 — Internal laboratory (current):** test-only data, synthetic scenarios, transparent source, CI, fixed examples. No accounts or uploads.

**G1 — Prototype quality:** cross-browser/mobile accessibility review, performance and security audit, reliable privacy controls, clear errors and versioned schemas.

**G2 — Accountability foundation:** licensing, accepted governance, conflict rules, trusted reviewers, incident handling, branch protection and suspension tests.

**G3 — Consented narrow pilot:** partner scope and consent, affected-person review, safety and measurement plan, protected feedback, reversible intervention.

**G4 — Community participation:** only after earlier gates and a demonstrated ability to protect contributors and correct harmful or misleading material.

Future releases can add features without opening the G4 gate. Passing CI is not proof that any gate beyond G0 is satisfied.

## Anti-capture / adversarial scenarios to rehearse

1. Sponsor tries to skip an independent review.
2. A founder is accused of wrongdoing and the complaints process must be impartial.
3. A draft is revised after approval, making an earlier review stale.
4. A volunteer is pressured to work without pay.
5. An opt-out is treated as failure and wrongly lowers status.
6. A recommendation targets or profiles political opponents.
7. A real participant is identifiable from supposedly anonymous feedback.
8. An accessibility route requires inaccessible resources.
9. A successful pilot is copied to a different location without context.
10. Harm is discovered after public praise of an institution.

Each scenario needs a documented response and, wherever possible, executable tests before G3/G4. No artificial 'redemption' scores for businesses or individuals.

## Success criteria for REGEN v0.4

- [x] 30 safe, clearly illustrative learning quests in the repository.
- [x] 10 editorial learning tracks, each with boundaries and non-goals.
- [x] 9 deterministic fictional scenarios.
- [x] Source-traceable offline lab UI with reasoning, capacity, stopping and coverage.
- [x] Cross-file tests, build reproducibility and continuous-integration checks added.
- [ ] Real device / assistive technology accessibility audit.
- [ ] Independent safety, legal and community judgment.
- [ ] Verified impact or successful pilot.
- [ ] Authenticated approval or submissions (deliberately prohibited at this stage).

**Next technical priority:** portability and replayable change logs, content/evidence provenance, and a stable Atlas adapter. **Next governance priority:** licenses, review authority, and conflict/appeal protections—not community recruitment.
