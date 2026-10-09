"""REGEN v0.4: fail-closed public/private Atlas integration boundary.

This is not an Atlas importer. It validates structural proposals using fake or
explicitly permissioned references only; private Atlas data remains private.
"""
from pathlib import Path
import json
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parents[1]

def validate_mapping(proposal, schema, quest_ids):
    problems=[f"{'.'.join(map(str,e.absolute_path)) or 'proposal'}: {e.message}"
              for e in Draft202012Validator(schema).iter_errors(proposal)]
    if proposal.get("quest_id") not in quest_ids:
        problems.append("Referenced quest is not in the local catalog")
    if proposal.get("status")!="proposal_only":
        problems.append("No Atlas link may be approved by importing JSON")
    if proposal.get("source_visibility")=="permission_required":
        problems.append("Source permission is not established for publication")
    return sorted(set(problems))

def check_repository():
    schema=json.loads((ROOT/"schema/atlas-link.schema.json").read_text())
    Draft202012Validator.check_schema(schema)
    links=json.loads((ROOT/"data/atlas-links.json").read_text())
    catalog=json.loads((ROOT/"data/quests.json").read_text())
    ids={q["id"] for q in catalog["quests"]}
    errors=[]
    if links.get("status")!="no_cross_repository_content_imported":
        errors.append("Source visibility status changed without a new release gate")
    if links.get("source_permission")!="not_granted_for_publication":
        errors.append("Source publication permission must not be inferred")
    if links.get("links"):
        errors.append("Public Atlas link list is intentionally empty until explicit review and permission")
    for q in catalog["quests"]:
        if q.get("atlas_refs")!=[]:
            errors.append(q["id"]+" includes unreviewed Atlas references")
    return errors

if __name__=="__main__":
    errors=check_repository()
    for error in errors:
        print("ERROR:",error)
    if errors:
        raise SystemExit(1)
    print("OK: Atlas integration is explicitly unlinked; no private source data imported.")
