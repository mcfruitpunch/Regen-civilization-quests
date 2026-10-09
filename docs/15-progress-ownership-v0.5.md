# 15 · Progress Ownership and Portability — v0.5

**Status:** offline prototype with real local backup/restore/delete behavior. Not an identity, certification, account, or proof-of-impact system.

## What someone can do today

1. Mark an illustrative quest as complete, voluntarily and without logging in.
2. Open **Progress vault** in the browser prototype.
3. Download a JSON backup containing **only the IDs of quests personally marked complete**, an explicit `self_report_only` label, the format version and an illustrative catalog revision.
4. Choose an older v1 or current v2 JSON backup. Inspect a **read-only preview** before any progress changes: source format, recognized IDs, retired/missing IDs, and new marks.
5. Choose **Combine** (union of old and incoming marks) or **Replace** (recognized incoming IDs only), then explicitly confirm.
6. Clear REGEN's demo progress from **this browser's** local storage, after explicit confirmation.

### Important boundaries

- No upload server, app account, GPS, user identity, completed-quest timestamp, reflection, images, personal dossier, or analytics collection is introduced.
- The prototype holds markers in browser storage if available; if blocked, progress is temporary to the open tab, and the UI must disclose that.
- Backups are plain JSON **not encrypted**. They contain no names, but quest choices may still reveal interests to anyone receiving a copy. Store/share them carefully.
- Exported backups are not certifications, credentials, independently verified activity, community permission, consent, or regenerative outcomes.
- REGEN can only delete the local demo key `regen_v01_completed` that it controls. It cannot erase downloaded files, device backups, cloud copies, browser-sync mirrors, Git history, or copies elsewhere.
- Restoring an exported JSON file is **never automatic**: preview and explicit confirmation are required. Files larger than 64 KB are rejected.
- REGEN does not import unknown quest IDs as new completion claims; older/retired IDs are counted and omitted.
- Malformed JSON, unexpected metadata, forged evidence tiers, duplicate identifiers and unsupported format versions are rejected. No error should silently overwrite existing markers.

## Technical interface

- `web/progress-vault.js` defines a pure backup contract and local storage functions.
- `schema/progress-backup.schema.json` documents and validates strict legacy v1 and current v2 formats.
- `tests/progress_vault.test.cjs` exercises the backup engine and storage edge cases.
- `tests/progress_ui_smoke.test.cjs` exercises the offline browser workflow with synthetic files and fake storage.
- `tests/test_progress_backup.py` validates schema strictness and shows that fabricated impact claims are invalid.

Current export example (the IDs here are fictional demo markers):

```json
{
  "format": "regen-local-progress",
  "version": 2,
  "evidence": "self_report_only",
  "catalog_version": "0.4.0",
  "completed_ids": ["first-spark", "neighborhood-assets"]
}
```

The schema supports v1, which omits `catalog_version`. No migration is necessary: the in-browser progress key is preserved from prior builds until the person edits or deletes it.

## Privacy and limitations

A person can fake or modify JSON and localStorage. That is **acceptable** for a non-competitive, self-reported, offline learning tool. No part of REGEN may treat these markers as an authority or eligibility score.

Local storage is device/browser/origin specific, may be erased by private browsing or browser settings, and may not persist when opening from `file:` URLs. Storage quota, privacy settings or browser errors may prevent saving or erasing. The UI must not claim a deletion succeeded when removal fails.

This system does not yet support an optional encrypted backup, signed audit trail, cloud syncing, progress encryption, multiple local profiles, cross-origin sync or server-side deletion, none of which should be introduced casually. Creating accounts could add tracking and coercion risks.

## Future work before external participation

- Hands-on iPhone/iPad, Android, laptop, screen-reader and keyboard accessibility testing, including file import/export and focus feedback.
- Add optional backup verification/checksum for accidental corruption only, **never** treated as proof of external impact.
- Provide an optional human-readable printable progress card, explicitly labeled self-report.
- Allow someone to redact or modify backups before sharing; avoid collecting reflections or identifiable activity logs by default.
- Review threat model for XSS, compromised dependencies, local storage scope and any future cloud/offline service workers.
- Confirm license and governance status; no live public quests or submission approval is activated by v0.5.

The guiding rule: **people own their learning markers, and REGEN does not claim ownership of their participation or their identity.**
