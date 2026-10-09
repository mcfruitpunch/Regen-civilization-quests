# 06 · Technical Architecture (proposed)

## Design posture

Open formats, modular components, local-first onboarding, explicit consent, adaptable for federation. A simple static offline prototype is appropriate now; do not build data-heavy infrastructure before pilot demand exists.

## Conceptual modules

1. **Atlas adapter:** maps current/transition/regenerative nodes and their evidence into quest references. Read-only until a review pathway exists.
2. **Quest catalog:** versioned structured content, safety status, accessibility, prerequisites, localization, outcomes, evidence tier.
3. **Recommendation layer:** explainable, optional filters; human override; deterministic minimum viable implementation.
4. **Local participant experience:** browsing, quests, reflections, accessible alternatives, local progress. No sign-in needed for solo MVP.
5. **Group coordination:** future opt-in team tasks, consent, transparent roles, anti-harassment controls.
6. **Impact and evidence:** store methodology and outcome claims separately from activity checkboxes; permissioned review and corrections.
7. **Bridge workflow:** institutional commitments, stakeholder sign-off, public milestones, independent findings and escalation paths.
8. **Governance and trust:** appeals, safeguarding, audit log, transparent funding and conflicts.

## Trust boundaries

Quest authors cannot self-certify their own high-impact results. Sponsors cannot exclusively control evidence reviews. Recommendation code cannot silently change eligibility rules. Institution participants cannot see individual participant data without consent. Public narratives must not leak sensitive evidence. Community stewardship must remain contestable.

## Data objects (concept)

- `Quest`: version, type, stage, safety/consent requirements, instructions, accessibility, evidence requirement.
- `QuestRun`: local user instance, state, optional private reflection. In demo, only completion IDs are persisted.
- `OutcomeClaim`: linked quest run/pilot, metrics, baseline, period, methodology, confidence/uncertainty.
- `EvidenceReview`: author, reviewer independence, findings, conflicts, limitations, dispute status.
- `AtlasNode`: external reference + relation types and version, not copied blindly.
- `BridgeCompact`: participating institution, affected-party governance, commitments, remedies, milestones, independent monitor.
- `GovernanceDecision`: proposal, consultation, vote/decision procedure, conflict disclosures, appeals.

## Data interoperability

Prefer JSON Schema for quest records, documented API interfaces, exportable content, localization keys, and a stable URI convention for Atlas links. A quest may connect to multiple Atlas nodes through `atlas_refs` after identifiers and versioning are agreed. Avoid locked proprietary recommendation logic; publish safety/ranking criteria in human-readable terms.

## Prototype implementation

`web/index.html` is a standalone browser app generated from the same `data/quests.json` seed. It stores completed quest IDs in browser localStorage only, with no network calls. The included generator `tests/build_prototype.py` refreshes the embedded dataset. The tests validate every quest against the schema and check basic internal links and IDs. This is **not** an institutional verification engine or production service.
