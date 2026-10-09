"""REGEN v0.3 proposal screening and publication fail-closed tests."""
import json
import unittest
from pathlib import Path
from jsonschema import Draft202012Validator
import sys
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"scripts"))
from screen_quest import screen, check_repository, SCHEMA

class ProposalSafetyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.schema=json.loads(SCHEMA.read_text())
        cls.sample=json.loads((ROOT/"proposals/example-reusable-bag.json").read_text())
    def test_valid_example(self):
        self.assertFalse(list(Draft202012Validator(self.schema).iter_errors(self.sample)))
        out=screen(self.sample,self.schema)
        self.assertEqual(out["state"],"awaiting_human_review")
        self.assertFalse(out["permission_to_publish"])
        self.assertFalse(out["verified_approval"])
    def test_approved_record_rejected(self):
        proposal={**self.sample,"publication_status":"approved"}
        self.assertEqual(screen(proposal,self.schema)["state"],"needs_revision")
    def test_unknown_fields_rejected(self):
        proposal={**self.sample,"some_private_field":"hidden"}
        self.assertEqual(screen(proposal,self.schema)["state"],"needs_revision")
    def test_risk_escalation(self):
        data=json.loads(json.dumps(self.sample))
        data["review"]["risk_flags"]["sensitive_information"]=True
        out=screen(data,self.schema)
        self.assertEqual(out["risk_triage"],"requires_specialist_review")
        self.assertIn("risk_specific_specialist",out["required_review_areas"])
        self.assertFalse(out["permission_to_publish"])
    def test_missing_consent_review_rejected(self):
        data=json.loads(json.dumps(self.sample))
        data["review"]["permissions_plan"]=""
        self.assertEqual(screen(data,self.schema)["state"],"needs_revision")
    def test_all_proposals_must_be_drafts(self):
        self.assertEqual(check_repository(self.schema),[])

if __name__=="__main__":
    unittest.main()
