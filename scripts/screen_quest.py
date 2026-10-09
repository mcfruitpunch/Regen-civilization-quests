"""REGEN v0.3: automated proposal intake checks, never human approval.

Usage:
  python scripts/screen_quest.py
  python scripts/screen_quest.py proposals/example-reusable-bag.json
  python scripts/screen_quest.py proposals/example-reusable-bag.json --json

Public GitHub content is not suitable for private participant information.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = ROOT / "schema" / "quest-proposal.schema.json"
PROPOSALS = ROOT / "proposals"
DEMO = ROOT / "data" / "quests.json"

HIGH_RISK = {
    "physical_hazard", "regulated_activity", "children_or_vulnerable_people",
    "sensitive_information", "public_targeting", "coercion_or_dependency"
}

def screen(proposal: dict[str, Any], schema: dict[str, Any]) -> dict[str, Any]:
    validator = Draft202012Validator(schema)
    errors = sorted(
        (f"{'.'.join(map(str, e.absolute_path)) or 'proposal'}: {e.message}"
         for e in validator.iter_errors(proposal))
    )
    flags = proposal.get("review", {}).get("risk_flags", {})
    active = sorted(k for k, v in flags.items() if v is True)
    risk = "requires_specialist_review" if any(k in HIGH_RISK for k in active) else (
        "institutional_review" if active else "ordinary_human_review"
    )
    reviews = ["safety_and_consent", "accessibility", "affected_people", "evidence_and_fairness"]
    if active:
        reviews.append("risk_specific_specialist")
    status = "needs_revision" if errors else "awaiting_human_review"
    return {
        "proposal_id": proposal.get("id", "unknown"),
        "state": status,
        "machine_validation": "failed" if errors else "passed",
        "risk_triage": risk,
        "declared_risks": active,
        "errors": errors,
        "required_review_areas": reviews,
        "permission_to_publish": False,
        "verified_approval": False,
        "notes": [
            "A self-declared risk assessment is not an independent safety finding.",
            "GitHub reviewer identity, affected-community consent, safety expertise and incident capacity require human governance.",
            "No new public quests may be published by this v0.3 pipeline, even with zero errors."
        ],
    }

def check_repository(schema: dict[str, Any]) -> list[str]:
    """Fail closed: authoring submissions are never silently promoted to demo/live."""
    problems = []
    catalog = json.loads(DEMO.read_text(encoding="utf8"))
    known = [q["id"] for q in catalog["quests"]]
    if len(known) != len(set(known)):
        problems.append("Duplicate catalog IDs")
    for q in catalog["quests"]:
        if q.get("publication_status") != "illustrative_only":
            problems.append(f"Catalog contains non-illustrative quest: {q.get('id')}")
    proposal_ids = []
    for path in sorted(PROPOSALS.glob("*.json")):
        try:
            p = json.loads(path.read_text(encoding="utf8"))
        except (OSError, ValueError) as exc:
            problems.append(f"Unreadable {path.name}: {exc}")
            continue
        report = screen(p, schema)
        proposal_ids.append(p.get("id"))
        if report["errors"]:
            problems.append(f"{path.name}: " + "; ".join(report["errors"]))
        if p.get("publication_status") != "draft":
            problems.append(f"{path.name} must remain draft")
    if len(proposal_ids) != len(set(proposal_ids)):
        problems.append("Duplicate proposal IDs")
    if set(proposal_ids) & set(known):
        problems.append("Proposal ID collides with an existing illustrative quest")
    return problems

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("proposal_file", nargs="?", help="Review one local JSON draft")
    parser.add_argument("--json", action="store_true", help="Output machine-readable review packet")
    args = parser.parse_args()
    schema = json.loads(SCHEMA.read_text(encoding="utf8"))
    Draft202012Validator.check_schema(schema)
    if args.proposal_file:
        source = Path(args.proposal_file).resolve()
        draft = json.loads(source.read_text(encoding="utf8"))
        report = screen(draft, schema)
        if args.json:
            print(json.dumps(report, indent=2))
        else:
            print(json.dumps(report, indent=2))
        raise SystemExit(1 if report["errors"] else 0)
    problems = check_repository(schema)
    if problems:
        for issue in problems:
            print("ERROR:", issue)
        raise SystemExit(1)
    print("All local proposal JSON files are structurally valid DRAFTS. Live publication remains disabled.")

if __name__ == "__main__":
    main()
