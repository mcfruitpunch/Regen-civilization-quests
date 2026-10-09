# REGEN — Civilization Quest System

**Version:** 0.1 foundation · **Status:** concept + offline interactive prototype · **Date:** 2026-10-09

> Turn the work of building regenerative communities into an approachable, cooperative, real-world quest system.

REGEN is a proposal for an opt-in, game-inspired participation layer over a **Regenerative Society Atlas**: a map of how societal systems work today, how they might transition, and what regenerative alternatives could look like. Instead of asking people to agree with an ideology before participating, REGEN begins with useful, practical work and invites continual learning.

## Three connected systems

1. **The Game:** accessible quests, developing skills, parties, local projects, and seven expanding scopes of participation.
2. **The Engine:** a traceable way to match community needs and people's circumstances with safe, useful quests, then learn from results.
3. **The Bridge Protocol:** an ethical way to address institutional resistance: distinguish people from actions and structures, invite reform, verify change, protect affected people, and use lawful accountability when necessary.

**Working maxim:** _Everyone is invited to improve the system. No one is exempt from accountability._

## Open the prototype

Open [`index.html`](index.html) (or [`web/index.html`](web/index.html) directly) in a browser. No installation, account, server, internet, GPS, or API key required. It contains 12 example quests, basic filters, skill areas, a quest detail view, and local-only completion tracking. The quest completion record is **self-reported**, not verified impact.

A separate single-file HTML preview is available alongside the repository ZIP.

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

Quest examples are in [`data/quests.json`](data/quests.json), contract in [`schema/quest.schema.json`](schema/quest.schema.json). 

## Not in scope at v0.1

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
4. Complete initial import and verify GitHub Actions; core schema/build checks are included, but accessibility checks require further work.
5. Later connect Atlas nodes to quest pathways through a versioned, human-reviewed interface.

This is an **early design**, not a validated social intervention. Preserve dignity and agency; measure benefits and unintended harms, not just participation.

## Repository handoff and publication

See [`docs/08-repository-setup.md`](docs/08-repository-setup.md) for setup, file placement, and GitHub Pages preview instructions. [`docs/09-first-issues.md`](docs/09-first-issues.md) is a ready-to-enter initial backlog. [`LICENSE_DECISION.md`](LICENSE_DECISION.md), [`CODE_OF_CONDUCT_DRAFT.md`](CODE_OF_CONDUCT_DRAFT.md), and [`SECURITY.md`](SECURITY.md) identify what still needs owner decisions. **This project does not yet have an open-source license or active public moderation program.**