"""Adversarial tests for fictional provenance and correction gates."""
import copy
import json
import sys
import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"scripts"))
from check_evidence import audit, check_repository, SCHEMA, LEDGER, QUESTS
SCHEMA_DOC=json.loads(SCHEMA.read_text(encoding="utf8"))
FIXTURE=json.loads(LEDGER.read_text(encoding="utf8"))
QUEST_IDS={q["id"] for q in json.loads(QUESTS.read_text(encoding="utf8"))["quests"]}

class EvidenceProvenanceTests(unittest.TestCase):
    def valid(self,pack):
        return audit(pack,SCHEMA_DOC,QUEST_IDS)
    def test_valid_synthetic_sample(self):
        self.assertEqual(self.valid(FIXTURE),[])
        self.assertEqual(check_repository(),[])
    def test_forged_verified_status_rejected(self):
        p=copy.deepcopy(FIXTURE);p["claims"][0]["verification_state"]="independently_verified"
        self.assertTrue(self.valid(p))
    def test_forged_evidence_source_rejected(self):
        p=copy.deepcopy(FIXTURE);p["sources"][0]["origin"]="uploaded_real_world_study"
        self.assertTrue(self.valid(p))
    def test_broken_source_reference_rejected(self):
        p=copy.deepcopy(FIXTURE);p["claims"][0]["source_ids"]=["SYN-SRC-GHOST"]
        self.assertTrue(any("unknown sources" in x for x in self.valid(p)))
    def test_broken_quest_reference_rejected(self):
        p=copy.deepcopy(FIXTURE);p["claims"][0]["linked_quest_ids"]=["missing-quest"]
        self.assertTrue(any("unknown quests" in x for x in self.valid(p)))
    def test_duplicate_claim_ids_rejected(self):
        p=copy.deepcopy(FIXTURE);p["claims"].append(copy.deepcopy(p["claims"][0]))
        self.assertTrue(any("Duplicate claim" in x for x in self.valid(p)))
    def test_metric_cannot_validate_real_population(self):
        p=copy.deepcopy(FIXTURE)
        c=next(c for c in p["claims"] if c["metric"])
        c["metric"]["population"]="observed_people"
        self.assertTrue(self.valid(p))
    def test_outcome_requires_metric(self):
        p=copy.deepcopy(FIXTURE)
        c=next(c for c in p["claims"] if c["claim_kind"]=="synthetic_outcome")
        c["metric"]=None
        self.assertTrue(any("requires fictional metric" in x for x in self.valid(p)))
    def test_hypothesis_cannot_claim_measured_results(self):
        p=copy.deepcopy(FIXTURE)
        c=next(c for c in p["claims"] if c["claim_kind"]=="hypothesis")
        c["metric"]=copy.deepcopy(next(x["metric"] for x in p["claims"] if x["metric"]))
        self.assertTrue(any("cannot imply measured" in x for x in self.valid(p)))
    def test_no_withdrawn_claim_without_event(self):
        p=copy.deepcopy(FIXTURE)
        p["events"]=[e for e in p["events"] if e["kind"]!="withdrawal"]
        self.assertTrue(any("withdrawal event required" in x for x in self.valid(p)))
    def test_invalid_revision_binding_rejected(self):
        p=copy.deepcopy(FIXTURE)
        p["events"][0]["to_revision"]=3
        self.assertTrue(any("exact current revision" in x for x in self.valid(p)))
    def test_invented_source_urls_are_not_accepted_by_schema(self):
        p=copy.deepcopy(FIXTURE)
        p["sources"][0]["source_url"]="https://example.com/real-study"
        self.assertTrue(self.valid(p))

if __name__=="__main__":
    unittest.main()
