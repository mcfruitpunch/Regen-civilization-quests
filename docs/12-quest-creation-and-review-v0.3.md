# 12 · Quest Creation, Review, and Approval Protocol — v0.3

**Status:** working offline authoring sandbox and automated preflight; **not an operational approval authority**.

## Core principle

A machine may check a quest's shape or highlight risk. It cannot independently establish informed consent, expertise, good faith, community legitimacy, actual safety, or social benefit. **Passing validation never makes a quest approved or publishable.**

REGEN v0.3 intentionally stops before a live approval step, because no trusted reviewer roles, branch protection, independent appeals, or live incident-response capability has been authorized.

## What actually works now

1. Open `web/creator.html` locally or on an intentionally enabled static GitHub Pages preview.
2. Fill in the quest idea, steps, alternative ways to participate, safeguards, and ten review questions.
3. Answer every risk question **Yes** or **No**, or keep **Unsure** to prevent an incomplete draft from exporting.
4. Select **Check my draft**. Structural errors are reported; affirmative risk flags are highlighted for specialist review.
5. Select **Export JSON draft** to save the record locally. Nothing automatically uploads or contacts any server.
6. Review a locally saved JSON file with `python scripts/screen_quest.py my-draft.json --json`.
7. Open `web/reviewer.html` and load a local draft to inspect the authored review answers and record **request changes**, **reject**, or **refer to future authorized human review**. Exported worksheet notes are **not identity-verified approvals**.
8. An authorized maintainer may consider a **sanitized** proposal in a private review process or GitHub pull request. Never post sensitive participant data publicly.

A sample draft lives at `proposals/example-reusable-bag.json`. All committed proposals must remain `publication_status: "draft"`. JSON-schema validation, risk triage, and a release fail-closed check run in GitHub Actions.

The optional local reviewer worksheet (`web/reviewer.html`, `web/quest-review.js`) never contains an **approve** action. Even a fully assessed worksheet is explicitly `authorized_approval: false` and `permission_to_publish: false`. Neither a browser note nor an exported file verifies a person's role, independence, expertise or content-version signature.

## Governance workflow (proposed, not enabled)

| State | Entered by | Conditions | Permission |
| --- | --- | --- | --- |
| Local draft | Author | Consent and risk fields are drafted | Author may revise or export |
| Intake screening | Maintainer + automation | Schema, links, safety flags, duplicate IDs | **No publication** |
| Revision requested | Human reviewer | Gaps, harms or unanswered questions | Author may revise or withdraw |
| Community / specialist review | Qualified, independent humans | Directly affected groups consulted, domain checks, accessible alternatives | **No publication yet** |
| Ready for final authorization | Independent lead after reviews | Approval authority, version lock, appeals, audit trail, stopping rules | **Not implemented in v0.3** |
| Approved pilot quest | Authorized governance (future) | Verified consent, no unresolved blocking risk, applicable local compliance | Site- and version-limited consented pilot |
| Retired / suspended | Safety authority or governing process | Incident, revocation of consent or stale evidence | Publication stops; corrections visible |

This table describes a *future* approval process. A browser checkmark, local JSON field, GitHub issue label, merge, or contributor self-assertion is **not** proof of such approval.

## Required human signoffs before any future pilot publication

- **Safety & consent:** authorization for each site and participant group; professional/regulatory oversight where needed.
- **Affected people:** voluntary consultation, ability to object, burden and unintended harms assessment.
- **Accessibility:** meaningful alternatives, no forced purchases, disclosure, travel, public identity, or physical labor.
- **Evidence:** baseline and measurement, potential confounding, no false 'verified impact' claims.
- **Appeals and stop rules:** independent complaint channel, rapid suspension, visible corrections and version retirement.

If physical hazards, children, regulated work, identifying data, coercion, political targeting, or institutional allegations may be involved, pause for qualified specialist review. Some proposed quests should be rejected entirely rather than converted into tasks.

**Institutional dialogue must be voluntary, non-deceptive, and accountable.** There is no covert access, harassment, targeted manipulation, or requirement to persuade people to adopt a worldview.

## Threat model and anti-capture

- Proposal author can misstate risk flags. Treat them as claims, not evidence.
- Client-side JavaScript and JSON are editable. They cannot provide authentication or trusted roles.
- Public GitHub files can be edited through privileged commits. CI checks are not a substitute for signed independent review.
- Sponsorship, founder status, and popularity cannot override consent or public-safety requirements.
- Deleting a published GitHub file does not necessarily remove it from Git history. Never commit secrets or allegations about identifiable individuals.
- No sensitive evidence collection or storage is designed or authorized yet.

## Required before enabling real publication

1. Resolve licensing and ownership (issue #1).
2. Adopt a code of conduct, privacy practices, moderation and appeals capacity (issue #2).
3. Agree authorized signoff roles, conflict rules, and independent reviewers with directly affected communities (issue #3).
4. Configure GitHub branch protection or rulesets: required PR, required independent reviews, required successful CI, and restrictive direct-push permissions. A CODEOWNERS file alone is not protection.
5. Implement a **server-side or trusted CI identity binding** to specific proposal content versions, trusted reviewer approvals, authorization expiry, and suspension. Self-declared approver names must never be accepted as proof.
6. Run an opt-in pilot with site and worker participation, scope limits, measurement plan, rollback and incident response (issue #4).
7. Complete keyboard, screen reader, cognition, and mobile accessibility testing (issue #5).

Until these controls exist, the only supported outcome of screening is **needs revision or awaiting human review**. There is deliberately no 'Approve quest' button.

## Developer commands

```bash
python -m pip install 'jsonschema>=4,<5'
python scripts/screen_quest.py
python scripts/screen_quest.py proposals/example-reusable-bag.json --json
python -m unittest discover -s tests -p 'test_quest_approval.py'
node --test tests/*.test.cjs
```

All examples are fictional illustrations; this system is not yet accepting live public submissions or validating regenerative impact.
