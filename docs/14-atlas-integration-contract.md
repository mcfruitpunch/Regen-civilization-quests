# 14 · Atlas Integration Contract — Privacy and Permission Before Linking

**Stage:** contract prototype only, no cross-repository data imported.

## Why this matters

The Regenerative Society Atlas and REGEN complement each other:

- **Atlas:** a structured description of societal functions, observed current conditions, dependencies, proposed transitions, regenerative hypotheses, and evidence uncertainty.
- **REGEN:** a voluntary practice and participation layer of accessible, bounded learning quests and—only in future, with approvals—consented action pilots.

They must remain modular. REGEN should not treat every proposed Atlas intervention as proven, nor silently copy content from a private knowledge base into a public website.

## Verified source characteristics used to design this boundary

The original Atlas uses stable subsystem-style IDs and distinguishes current, transition, and regenerative lenses. Its node and relationship metadata make explicit distinctions between observed claims, hypotheses, and human-reviewed material.

**Important:** The Atlas repository's access restrictions do not transfer to REGEN. Any cross-repository export must be expressly authorized by rights holders and screened for sensitive, private, attributed, or third-party information. This public REGEN repository deliberately contains **zero** copied Atlas nodes, links, evidence, or source documents.

## Implemented v0.4 contract

- `schema/atlas-link.schema.json`: a structural proposal referencing a stable node identifier, exact revision, intended relation, clear rationale and source visibility.
- `data/atlas-links.json`: an intentionally empty public mapping with explicit `not_granted_for_publication` permission status.
- `scripts/check_atlas_links.py`: fails checks if private source content is assumed public, links appear without a new release gate, or quests acquire unreviewed `atlas_refs`.
- `tests/test_atlas_boundary.py`: only synthetic mock IDs; tests reject unreviewed, unknown or permission-requiring maps.

A proposed link may be one of:
- `learning_about`: a general educational connection to an Atlas subsystem;
- `system_context`: explanatory background about a system, not approval or evidence;
- `transition_hypothesis`: a proposed change explicitly requiring validation.

None of these labels means effective, safe, universally relevant, publicly authorized, or validated by affected people.

## Rules for a future authorized adapter

1. **Consent to export:** Explicit release permission from Atlas rights holders, respecting any private source and material ownership restrictions. No default import of unpublished research.
2. **Minimal export:** Only stable node identifiers, revision pins, non-sensitive titles and reviewed relationships. Never copy hidden annotations, internal messages, personal data, protected reports, or source evidence into public files without separate permission.
3. **Human editorial mapping:** Record the evidence explaining why a quest is relevant to a node; no automatic matching of keywords to factual claims.
4. **Revision integrity:** A link to a stale or deleted node must fall out of scope until revalidated, never silently point to a replacement.
5. **Evidence separation:** The Atlas may describe a problem or hypothesis; REGEN's self-reported quest completion can never be promoted to proof of impact.
6. **Version-controlled audits:** Mappings have provenance, correction histories, limitations, and a clear appeal path.
7. **Permission withdrawal:** Support unpublication, redaction and future non-public deployments while recognizing Git history and mirrors can retain public material.
8. **Local specificity:** One Atlas node may have many culturally and environmentally different local contexts; REGEN must not presume a global recommendation is locally safe.

## Planned technical stages

- **Adapter 0:** Defined and tested empty boundary (current).
- **Adapter 1:** Develop a synthetic test Atlas with fictional node IDs and demonstrate a closed-loop import/export validation.
- **Adapter 2:** With express permission, import a small non-sensitive reviewed source snapshot on a protected branch, and evaluate editorial link accuracy.
- **Adapter 3:** Build a versioned link explorer with confidence/uncertainty labels and human correction, without identity profiling.
- **Adapter 4:** After real governance and consent are functioning, make approved, locally scoped pilot quests discoverable through both systems.

Any proposal to link the systems publicly requires a separate owner decision. Existing internal Atlas records are not implicitly licensed or cleared for publication.

## Architectural takeaway

**The Atlas tells us what might need to change. REGEN provides one possible way to learn and act, but action is always contextual and optional.**

This is deliberately a two-way exchange of *questions and reviewed evidence*, not a single central institution claiming authority over communities.
