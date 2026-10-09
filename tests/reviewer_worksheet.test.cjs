const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const Review=require("../web/quest-review.js");
const sample=JSON.parse(fs.readFileSync(path.join(__dirname,"../proposals/example-reusable-bag.json"),"utf8"));
const answer=Object.fromEntries(Review.AREAS.map(a=>[a,"addressed"]));
test("review worksheet can never grant publication rights",()=>{
 const note=Review.createWorksheet(sample,{...answer,recommendation:"refer_to_authorized_review",notes:"All fields appear complete but require separate independent authorization."});
 assert.deepEqual(Review.validateWorksheet(note),[]);
 assert.equal(note.permission_to_publish,false);
 assert.equal(note.authorized_approval,false);
 assert.equal(note.record_type,"regen_untrusted_review_note");
});
test("missing review area prevents referral",()=>{
 const note=Review.createWorksheet(sample,{...answer,affected_people:"not_assessed",recommendation:"refer_to_authorized_review",notes:"A necessary community representative has not yet been contacted."});
 assert.ok(Review.validateWorksheet(note).some(e=>e.includes("affected_people")));
});
test("reject and request revision remain available without invented approval",()=>{
 for(const recommendation of ["reject","request_changes"]){
  const note=Review.createWorksheet(sample,{recommendation,notes:"Please explain consent assumptions and stop rules more clearly."});
  assert.deepEqual(Review.validateWorksheet(note),[]);
  assert.equal(note.permission_to_publish,false);
 }
});
test("tampered approval status is rejected",()=>{
 const note=Review.createWorksheet(sample,{...answer,recommendation:"refer_to_authorized_review",notes:"Not an actual authorization; human oversight is still necessary."});
 note.permission_to_publish=true;
 assert.ok(Review.validateWorksheet(note).some(e=>e.includes("never authorize publication")));
});
