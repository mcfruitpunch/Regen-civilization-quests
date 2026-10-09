# 02 · Quest Engine and Evidence Model

## Purpose

Translate community-identified needs and vetted action pathways into *relevant, feasible, accessible, safe* quest suggestions. This engine is a recommendation assistant—not an authority determining what a good citizen should believe or do.

## Inputs: v0 and beyond

- **Required:** chosen interest or browse-all; basic quest metadata; human-reviewed safety classification.
- **Optional:** time available, at-home/in-person preference, accessibility requirements, skill interests, collaborator preference.
- **Later, only with explicit consent:** approximate region to recommend locally relevant opportunities. No precise location required by default.
- **Contextual:** consented community priorities, Atlas system nodes, known resource constraints, actual measurable outcomes, feedback on failed interventions.

## Deterministic MVP matching

**Gate before ranking.** Reject quests requiring unavailable permissions, dangerous actions, disallowed targeting, or missing human review. For remaining quests, use transparent filters and a simple relevance sort. A future ranking model may weight feasibility, access, community-requested importance, learning fit, expected benefit, and uncertainty. Always show *why* a quest appears and allow manual browsing and challenge.

Proposed future score for experiments only (weights require stakeholder testing):

`fit = 0.30 * feasibility + 0.25 * accessibility + 0.20 * community_priority + 0.15 * skill_interest + 0.10 * evidence_quality`

Scores must never substitute for safety gates or become a moral rating of people. Predicted outcomes should not be described as realized impact.

## Evidence tiers

| Tier | Label | Meaning | Appropriate UI language |
| --- | --- | --- | --- |
| E0 | Unchecked activity | User has begun or marked a step; no proof | "Self-reported activity" |
| E1 | Participant reflection | Reflection or personal baseline exists | "Documented by participant" |
| E2 | Reviewed observation | Evidence reviewed under published rubric | "Reviewed, with limitations" |
| E3 | Independent outcome | Credible independent verification and baseline comparison | "Verified outcome, scope specified" |

No quest completion automatically upgrades a claim to E2 or E3. Different evidence types are necessary for different tasks; low-stakes learning does not need high-stakes verification. Never demand identifying photos or public testimony simply to award a badge.

## Quest publishing pipeline (future)

Proposal → structured lint → consent and impact review → risk tier assignment → accessibility review → pilot → revision → community governance approval → versioned release → incident reporting and retirement. High-risk or institution-focused quests always require named accountable human reviewers and legal-context evaluation before deployment.

## What the engine must learn

Record uncertainty, unintended harms, missing context, burden shifted onto volunteers, and differences across communities. A quest that succeeds in one location is a hypothesis for another location, not an instruction to copy without adaptation. Keep a reversible version history.

## Red lines

No covert surveillance; gathering private dossiers; political profiling; automated mass persuasion; deception; harassment; trespassing; retaliation; doxxing; unsafe physical activity; unlicensed regulated work. Do not create quests to 'convert' an unwilling person. Opt-in dialogue is allowed; accountability and lawful public processes remain available.
