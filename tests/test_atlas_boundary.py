"""Synthetic tests for the proposed, untrusted Atlas mapping interface."""
import sys
import unittest
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"scripts"))
from check_atlas_links import validate_mapping,check_repository

class AtlasBoundaryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.schema=json.loads((ROOT/"schema/atlas-link.schema.json").read_text())
        cls.good={
            "quest_id":"fictional-quest","atlas_node_id":"TST-01",
            "atlas_revision":"fixture-0.1","relation":"learning_about",
            "rationale":"A fictional link is used only to test the interface contract.",
            "status":"proposal_only","source_visibility":"independently_public",
            "evidence_state":"unverified_mapping"}
    def test_synthetic_link_structure(self):
        self.assertEqual(validate_mapping(self.good,self.schema,{"fictional-quest"}),[])
    def test_unknown_quest_denied(self):
        self.assertTrue(validate_mapping(self.good,self.schema,{"different-quest"}))
    def test_unreleased_or_private_source_requires_permission(self):
        p={**self.good,"source_visibility":"permission_required"}
        self.assertTrue(any("permission" in x for x in validate_mapping(p,self.schema,{"fictional-quest"})))
    def test_cannot_claim_approved_from_json(self):
        p={**self.good,"status":"approved"}
        self.assertTrue(validate_mapping(p,self.schema,{"fictional-quest"}))
    def test_repo_contains_no_atlas_import(self):
        self.assertEqual(check_repository(),[])

if __name__=="__main__":
    unittest.main()
