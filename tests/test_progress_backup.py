"""Portable v1/v2 completion backups never attest to real-world outcomes."""
from pathlib import Path
import json
import unittest
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parents[1]
SCHEMA=json.loads((ROOT/"schema/progress-backup.schema.json").read_text())

class BackupFormatTests(unittest.TestCase):
    def test_valid_v1_legacy(self):
        old={"format":"regen-local-progress","version":1,"evidence":"self_report_only","completed_ids":["first-spark"]}
        self.assertFalse(list(Draft202012Validator(SCHEMA).iter_errors(old)))
    def test_valid_v2(self):
        new={"format":"regen-local-progress","version":2,"evidence":"self_report_only","catalog_version":"0.4.0","completed_ids":["first-spark"]}
        self.assertFalse(list(Draft202012Validator(SCHEMA).iter_errors(new)))
    def test_personal_data_and_fake_evidence_rejected(self):
        good={"format":"regen-local-progress","version":2,"evidence":"self_report_only","catalog_version":"0.4.0","completed_ids":[]}
        for modified in [{**good,"person":"someone"},{**good,"evidence":"verified"},{**good,"completed_ids":["first-spark","first-spark"]},{**good,"version":3}]:
            self.assertTrue(list(Draft202012Validator(SCHEMA).iter_errors(modified)))
    def test_schema_itself_valid(self):
        Draft202012Validator.check_schema(SCHEMA)

if __name__=="__main__":
    unittest.main()
