"""Validate only synthetic claims and their correction links (never real-world truth).

A schema-valid or test-passing claim remains a fictional fixture, not a certified
outcome. Do not copy private Atlas records or personal/organizational evidence here.
"""
from __future__ import annotations
from pathlib import Path
import json
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parents[1]
LEDGER=ROOT/"data/evidence-ledger.json"
SCHEMA=ROOT/"schema/evidence-ledger.schema.json"
QUESTS=ROOT/"data/quests.json"

def audit(ledger:dict,schema:dict,quest_ids:set[str])->list[str]:
    errors=[f"{'/'.join(map(str,e.absolute_path)) or 'root'}: {e.message}"
        for e in Draft202012Validator(schema).iter_errors(ledger)]
    if errors:
        return sorted(errors)
    claims=ledger["claims"]
    sources=ledger["sources"]
    events=ledger["events"]
    claim_ids=[c["id"] for c in claims]
    src_ids=[s["id"] for s in sources]
    event_ids=[e["id"] for e in events]
    for label,ids in (("claim",claim_ids),("source",src_ids),("event",event_ids)):
        if len(ids)!=len(set(ids)):
            errors.append(f"Duplicate {label} IDs")
    known_sources=set(src_ids)
    by_claim={c["id"]:c for c in claims}
    for c in claims:
        unknown=set(c["source_ids"])-known_sources
        if unknown: errors.append(f"{c['id']}: unknown sources {sorted(unknown)}")
        missing=set(c["linked_quest_ids"])-quest_ids
        if missing: errors.append(f"{c['id']}: unknown quests {sorted(missing)}")
        if c["claim_kind"]=="synthetic_outcome" and c["metric"] is None:
            errors.append(c["id"]+": synthetic outcome requires fictional metric")
        if c["claim_kind"] in {"hypothesis","design_proposal","risk_counterexample"} and c["metric"] is not None:
            errors.append(c["id"]+": a proposal/hypothesis/harm counterexample cannot imply measured results")
        if c["publication_state"]=="withdrawn_synthetic" and not any(
            e["claim_id"]==c["id"] and e["kind"]=="withdrawal" for e in events):
            errors.append(c["id"]+": withdrawal event required")
        if c["publication_state"]=="synthetic_only" and any(
            e["claim_id"]==c["id"] and e["kind"]=="withdrawal" for e in events):
            errors.append(c["id"]+": withdrawn record cannot remain active")
        if c["revision"]>1 and not any(e["claim_id"]==c["id"] and e["to_revision"]==c["revision"] for e in events):
            errors.append(c["id"]+": changed revision requires recorded event")
    seen_transitions=set()
    for event in events:
        key=(event["claim_id"],event["to_revision"])
        if key in seen_transitions: errors.append(f"Duplicate revision transition: {key}")
        seen_transitions.add(key)
        c=by_claim.get(event["claim_id"])
        if not c: errors.append(event["id"]+": event points to absent claim")
        if event["to_revision"]<=event["from_revision"]:
            errors.append(event["id"]+": revision must increase")
        if c and event["to_revision"]!=c["revision"]:
            errors.append(event["id"]+": event must point to exact current revision")
        if c and event["kind"]=="withdrawal" and c["publication_state"]!="withdrawn_synthetic":
            errors.append(event["id"]+": withdrawal must hide claim from active interpretation")
    return sorted(set(errors))

def check_repository():
    schema=json.loads(SCHEMA.read_text(encoding="utf-8"))
    Draft202012Validator.check_schema(schema)
    pack=json.loads(LEDGER.read_text(encoding="utf-8"))
    quests=json.loads(QUESTS.read_text(encoding="utf-8"))["quests"]
    return audit(pack,schema,{q["id"] for q in quests})

if __name__=="__main__":
    errors=check_repository()
    if errors:
        for error in errors: print("ERROR:",error)
        raise SystemExit(1)
    print("OK: synthetic evidence ledger structurally valid, sources linked, corrections auditable, real-world verification disabled.")
