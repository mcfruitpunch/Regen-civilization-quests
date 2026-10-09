const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const A=require("../web/quest-authoring.js");
const sample=JSON.parse(fs.readFileSync(path.join(__dirname,"../proposals/example-reusable-bag.json"),"utf8"));
function rawFrom(s){
 return {...s,...s.review,...s.review.risk_flags,skills:s.skills,steps:s.steps};
}
test("sample authoring draft roundtrips with no publication authority",()=>{
 const p=A.buildDraft(rawFrom(sample));
 assert.deepEqual(p,sample);
 const report=A.screen(p);
 assert.equal(report.structurally_complete,true);
 assert.equal(report.ready_for_human_intake,true);
 assert.equal(report.approved,false);
 assert.equal(report.publishable,false);
 assert.deepEqual(report.risk_flags,[]);
});
test("blank form is incomplete and cannot be exported",()=>{
 const p=A.buildDraft({});
 const report=A.screen(p);
 assert.equal(report.structurally_complete,false);
 assert.ok(report.errors.length>=10);
 assert.equal(report.publishable,false);
});
test("unanswered risks are not silently declared safe",()=>{
 const raw=rawFrom(sample);delete raw.sensitive_information;
 const report=A.screen(A.buildDraft(raw));
 assert.ok(report.errors.some(x=>x.includes("sensitive_information")));
});
test("each affirmative risk flag triggers enhanced screening",()=>{
 const raw=rawFrom(sample);raw.workplace_or_institution=true;
 const report=A.screen(A.buildDraft(raw));
 assert.equal(report.structurally_complete,true);
 assert.ok(report.risk_flags.includes("workplace_or_institution"));
 assert.ok(report.warnings.some(x=>x.includes("Heightened human review")));
 assert.equal(report.approved,false);
});
test("can't import approved status using the draft builder",()=>{
 const raw=rawFrom(sample);raw.publication_status="approved";raw.evidence_level="independent";
 const p=A.buildDraft(raw);
 assert.equal(p.publication_status,"draft");
 assert.equal(p.evidence_level,"self_report");
 assert.equal(A.screen({...p,publication_status:"approved"}).structurally_complete,false);
});
test("missing impact and consent review blocks intake",()=>{
 const raw=rawFrom(sample);raw.data_handling="ok";raw.permissions_plan="not sure";
 const report=A.screen(A.buildDraft(raw));
 assert.ok(report.errors.some(x=>x.includes("data handling")));
 assert.ok(report.errors.some(x=>x.includes("permissions plan")));
});
test("keeps no identifying data or timestamps in standard export",()=>{
 const raw=rawFrom(sample);raw.full_name="Private Name";raw.contact_email="private@example.invalid";raw.timestamp="now";
 const p=A.buildDraft(raw);
 assert.ok(!("full_name" in p)&&!("contact_email" in p)&&!("timestamp" in p));
});
