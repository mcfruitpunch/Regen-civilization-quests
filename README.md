# REGEN — Civilization Quest System

**Version:** 0.6 evidence and provenance branch · **Status:** concept + offline interactive prototype · **Date:** 2026-10-09

> Turn the work of building regenerative communities into an approachable, cooperative, real-world quest system.

REGEN is a proposal for an opt-in, game-inspired participation layer over a **Regenerative Society Atlas**: a map of how societal systems work today, how they might transition, and what regenerative alternatives could look like. Instead of asking people to agree with an ideology before participating, REGEN begins with useful, practical work and invites continual learning.

## Three connected systems

1. **The Game:** accessible quests, developing skills, parties, local projects, and seven expanding scopes of participation.
2. **The Engine:** a traceable way to match community needs and people's circumstances with safe, useful quests, then learn from results.
3. **The Bridge Protocol:** an ethical way to address institutional resistance: distinguish people from actions and structures, invite reform, verify change, protect affected people, and use lawful accountability when necessary.

**Working maxim:** _Everyone is invited to improve the system. No one is exempt from accountability._

## Open the prototype

Open [`index.html`](index.html) (or [`web/index.html`](web/index.html) directly) in a browser. No installation, account, server, internet, GPS, or API key required. It contains 30 illustrative quests, basic filters, skill areas, a quest detail view, local-only completion tracking, and a new **My pathway** view showing explainable, advisory sequences. Open any quest regardless of prerequisite markers; prior participation is not required to access the content. The quest completion record is **self-reported**, not verified impact.

A separate single-file HTML preview is available alongside the repository ZIP.

## Create a draft quest (v0.3)

Open [`web/creator.html`](web/creator.html) to write a quest proposal locally, complete explicit safety/consent/risk answers, run advisory checks, and **export a JSON draft**. A companion [`web/reviewer.html`](web/reviewer.html) lets someone inspect a locally exported draft and record **non-authoritative** feedback or referrals. No login, network submission, server, or automatic review is involved. See [`docs/12-quest-creation-and-review-v0.3.md`](docs/12-quest-creation-and-review-v0.3.md). **Passing automated checks is never approval to publish or execute a real-world mission.** This is not yet an operational public submission service.

Use `python scripts/screen_quest.py` to validate checked-in drafts and prevent non-illustrative content from being released into the prototype. Run `node --test tests/*.test.cjs` to test both pathway and creation logic. Public issues should never contain private evidence or identifying details.

## Test the pre-community lab (v0.4)

Open [`web/lab.html`](web/lab.html) to replay nine fully fictional scenarios without changing personal progress. Review ten curated, optional learning pathways in [`data/pathways.json`](data/pathways.json). The lab reports what sample routes would be suggested given time, remote/community preferences, unavailable permissions, and interruptions; **it does not prove access, impact, consent, or outcomes for real people**. The expanded sample library contains 30 illustrative quests across six domains. The initial Atlas integration contract is intentionally unlinked: no private source data or unsupported Atlas relationships were copied into this public repository.

See [`docs/13-precommunity-lab-v0.4.md`](docs/13-precommunity-lab-v0.4.md) for what can be built internally, what requires eventual community and independent review, and the gates that must remain closed before public submissions.

## Own your local progress (v0.5)

The interactive prototype now includes **Progress vault**: a private, offline space to download a strictly self-reported JSON backup, preview older v1 or current v2 backups, choose **Combine** or **Replace** explicitly, and erase REGEN's local demo progress key. All imports are inspected before application, unknown quest IDs are omitted, unsupported evidence claims are rejected, and deletion cannot reach backups or other devices. There are no accounts or servers. [Read the progress ownership guide](docs/15-progress-ownership-v0.5.md).

## Evidence & uncertainty lab (v0.6)

Open [`web/evidence.html`](web/evidence.html) to explore a **synthetic-only provenance ledger** with ten fictional claims, seven invented source fixtures, and two example revision/withdrawal records. The read-only lab explicitly separates activities, outputs, outcomes, harm, and hypotheses. It reports limitations, possible alternate explanations and what arithmetic on invented numbers can—not—establish. **Zero real-world or independently verified impacts are claimed.**

The structured contract and tests live in [`schema/evidence-ledger.schema.json`](schema/evidence-ledger.schema.json), [`scripts/check_evidence.py`](scripts/check_evidence.py) and the [v0.6 provenance guide](docs/16-evidence-provenance-v0.6.md). No source uploads, network requests, real participant data or private Atlas records are introduced.

## Read the foundation

| Document | Purpose |
| --- | --- |
| [`docs/00-charter.md`](docs/00-charter.md) | Mission, values, limits, and definitions |
| [`docs/01-game-and-progression.md`](docs/01-game-and-progression.md) | Seven stages, accessible learning, quests, and skills |
| [`docs/02-quest-engine.md`](docs/02-quest-engine.md) | Ranking, evidence, community needs, and feedback |
| [`docs/03-bridge-protocol.md`](docs/03-bridge-protocol.md) | Ethical transformation of institutions |
| [`docs/04-safety-and-governance.md`](docs/04-safety-and-governance.md) | Anti-capture, privacy, consent, abuse prevention |
| [`docs/05-roadmap.md`](docs/05-roadmap.md) | Pilot and release criteria |
| [`docs/06-architecture.md`](docs/06-architecture.md) | Modular technical architecture and Atlas integration |
| [`docs/07-decisions-and-research.md`](docs/07-decisions-and-research.md) | Assumptions, experiments, and unresolved decisions |
| [`docs/10-quest-engine-v0.2.md`](docs/10-quest-engine-v0.2.md) | Deterministic pathway engine, filters, limits and tests |
| [`docs/11-license-governance-options.md`](docs/11-license-governance-options.md) | Unapproved licensing choices and anti-capture governance proposal |
| [`docs/12-quest-creation-and-review-v0.3.md`](docs/12-quest-creation-and-review-v0.3.md) | Quest creator, preflight screening, human review proposal, and launch gates |
| [`docs/13-precommunity-lab-v0.4.md`](docs/13-precommunity-lab-v0.4.md) | Pre-community curriculum, simulations, maturity gates, and build roadmap |
| [`docs/14-atlas-integration-contract.md`](docs/14-atlas-integration-contract.md) | Source-permission and versioning boundary between REGEN and the Atlas |
| [`docs/15-progress-ownership-v0.5.md`](docs/15-progress-ownership-v0.5.md) | Local backup, restore preview, ownership and deletion boundaries |
| [`docs/16-evidence-provenance-v0.6.md`](docs/16-evidence-provenance-v0.6.md) | Strict synthetic source ledger, correction chain and impact-claim limitations |

Quest examples are in [`data/quests.json`](data/quests.json), contract in [`schema/quest.schema.json`](schema/quest.schema.json), and explainable progression logic in [`web/quest-engine.js`](web/quest-engine.js). Recommendations do not certify a person's abilities or the impact of their work. 

## Not in scope at v0.6

- No social network, public profiles, global leaderboard, or reputational ranking.
- No collection of participant location or identity and no uploading evidence.
- No institution scoring, political targeting, covert access, or campaigns against named individuals.
- No claim that a completed quest proves real-world improvement.
- No automatic publication of potentially harmful quests.
- This repository is an early public foundation, not an operational civic platform. Its policies and license remain under review.

## Next build decisions

1. Run a small, opt-in pilot with a community group and pick **one** testable outcome (e.g. food waste prevented in a consenting venue).
2. Co-design the quest safety and verification process with those affected.
3. Decide the software/content license and adopt contribution, safety, and governance policies before public release.
4. Review the stacked v0.2/v0.3/v0.4/v0.5/v0.6 pull requests, hosted CI, and architecture. Real-device accessibility and independent review remain necessary.
5. Later connect Atlas nodes to quest pathways through a versioned, human-reviewed interface.

This is an **early design**, not a validated social intervention. Preserve dignity and agency; measure benefits and unintended harms, not just participation.

## Repository handoff and publication

See [`docs/08-repository-setup.md`](docs/08-repository-setup.md) for setup, file placement, and GitHub Pages preview instructions. [`docs/09-first-issues.md`](docs/09-first-issues.md) is a ready-to-enter initial backlog. [`LICENSE_DECISION.md`](LICENSE_DECISION.md), [`CODE_OF_CONDUCT_DRAFT.md`](CODE_OF_CONDUCT_DRAFT.md), and [`SECURITY.md`](SECURITY.md) identify what still needs owner decisions. **This project does not yet have an open-source license or active public moderation program.**