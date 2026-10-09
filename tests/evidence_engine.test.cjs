const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const E=require("../web/evidence-engine.js");
const PACK=JSON.parse(fs.readFileSync(path.join(__dirname,"../data/evidence-ledger.json"),"utf8"));
const clone=v=>JSON.parse(JSON.stringify(v));
test("all examples are explicitly fictional with zero verified outcomes",()=>{
 assert.equal(E.validate(PACK),true);
 const s=E.summary(PACK);
 assert.equal(s.fictional_claims,10);
 assert.equal(s.synthetic_sources,7);
 assert.equal(s.correction_events,2);
 assert.equal(s.withdrawn,1);
 assert.equal(s.verified_outcomes,0);
 assert.match(s.statement,/0 real observations/);
});
test("the viewer can filter by domain, kind and uncertainty text",()=>{
 const food=E.search(PACK,{domain:"Food"});
 assert.equal(food.length,3);
 assert.ok(food.every(c=>c.domain==="Food"));
 assert.ok(E.search(PACK,{kind:"synthetic_outcome"}).every(c=>c.metric));
 assert.ok(E.search(PACK,{query:"causal"}).some(c=>c.id==="SYN-CLM-FOOD-OUTCOME"));
});
test("withdrawal stays discoverable as a correction but can be hidden",()=>{
 const id="SYN-CLM-WITHDRAWN-CLAIM";
 assert.ok(E.search(PACK).some(c=>c.id===id));
 assert.ok(!E.search(PACK,{includeWithdrawn:false}).some(c=>c.id===id));
});
test("invented before-after arithmetic cannot become causal certainty",()=>{
 const record=PACK.claims.find(c=>c.id==="SYN-CLM-FOOD-OUTCOME");
 const m=E.metricIllustration(record.metric);
 assert.equal(m.baseline,40);assert.equal(m.followup,30);
 assert.equal(m.change,-10);assert.equal(m.percentage,-25);
 assert.match(m.disclosure,/no causal identification/);
 assert.equal(E.metricIllustration(null),null);
 assert.equal(E.metricIllustration({...record.metric,baseline:0,followup:1}).percentage,null);
});
test("duplicate or dangling synthetic source references are rejected",()=>{
 const a=clone(PACK);a.claims[0].source_ids=["SYN-SRC-DOES-NOT-EXIST"];
 assert.throws(()=>E.validate(a),/provenance/);
 const b=clone(PACK);b.sources.push(clone(b.sources[0]));
 assert.throws(()=>E.validate(b),/source/);
});
test("independent verification, approval or causality cannot be smuggled into records",()=>{
 for(const [field,value] of [["verification_state","independently_verified"],["review_state","approved"],["causality","established"],["scope","measured_social_benefit"],["publication_state","approved"]]){
  const a=clone(PACK);a.claims[0][field]=value;
  assert.throws(()=>E.validate(a),/verified|authorized/);
 }
});
test("proposals and hypotheses cannot masquerade as measured effects",()=>{
 const a=clone(PACK);a.claims.find(c=>c.claim_kind==="hypothesis").metric={...PACK.claims.find(c=>c.metric).metric};
 assert.throws(()=>E.validate(a),/cannot have a measurement/);
 const b=clone(PACK);b.claims.find(c=>c.claim_kind==="synthetic_outcome").metric=null;
 assert.throws(()=>E.validate(b),/requires a fictional metric/);
});
test("revision history and withdrawal must bind to the exact current claim",()=>{
 const a=clone(PACK);a.events[0].to_revision=3;
 assert.throws(()=>E.validate(a),/Revision|revision/);
 const b=clone(PACK);b.events=b.events.filter(e=>e.kind!=="withdrawal");
 assert.throws(()=>E.validate(b),/Withdrawal|withdrawal/);
 const c=clone(PACK);c.claims.find(x=>x.id==="SYN-CLM-WITHDRAWN-CLAIM").publication_state="synthetic_only";
 assert.throws(()=>E.validate(c),/Withdrawal|withdrawal|Withdrawn/);
});
test("pack cannot import a real-world evidence format",()=>{
 const a=clone(PACK);a.visibility="public_verified_evidence";assert.throws(()=>E.validate(a),/synthetic-only/);
 const b=clone(PACK);b.sources[0].origin="uploaded_customer_report";assert.throws(()=>E.validate(b),/Untrusted source/);
});
test("HTML is generated, offline and never stores activity or evidence",()=>{
 const html=fs.readFileSync(path.join(__dirname,"../web/evidence.html"),"utf8");
 assert.ok(html.includes('src="evidence-engine.js"'));
 assert.ok(html.includes("Every record on this page is fictional."));
 assert.ok(!html.includes("__EVIDENCE_DATA__"));
 assert.ok(!/fetch\s*\(/.test(html));
 assert.ok(!/localStorage|sessionStorage|XMLHttpRequest/.test(html));
});
