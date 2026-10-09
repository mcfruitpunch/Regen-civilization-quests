/* REGEN v0.6 — view and analyze SYNTHETIC records only.
 * Client checks are educational; they are not cryptographic verification or
 * an independent scientific review.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
 if(root)root.REGENEvidence=api;
})(typeof globalThis!=="undefined"?globalThis:undefined,function(){
 "use strict";
 const KINDS=new Set(["synthetic_observation","hypothesis","design_proposal","synthetic_outcome","risk_counterexample"]);
 const LAYERS=new Set(["activity","output","outcome","harm","assumption"]);
 function validate(pack){
  if(!pack||pack.format!=="regen-synthetic-evidence-ledger"||
      pack.version!=="0.6.0"||pack.visibility!=="synthetic_only_no_real_world_claims")
      throw Error("Not an authorized synthetic-only evidence pack");
  if(!Array.isArray(pack.sources)||!Array.isArray(pack.claims)||!Array.isArray(pack.events))throw Error("Missing ledger collections");
  const sid=new Set(),cid=new Set(),eid=new Set();
  for(const s of pack.sources){
   if(!/^SYN-SRC-[A-Z0-9-]+$/.test(s.id)||sid.has(s.id)||s.origin!=="invented_for_testing")throw Error("Untrusted source");
   sid.add(s.id);
  }
  for(const c of pack.claims){
   if(!/^SYN-CLM-[A-Z0-9-]+$/.test(c.id)||cid.has(c.id))throw Error("Untrusted or duplicate claim");
   cid.add(c.id);
   if(!KINDS.has(c.claim_kind)||!LAYERS.has(c.evidence_layer))throw Error("Unknown claim category");
   if(c.scope!=="fictional_example_only"||c.verification_state!=="not_verified"||c.causality!=="not_established"||
      c.review_state!=="not_reviewed"||!["synthetic_only","withdrawn_synthetic"].includes(c.publication_state))
      throw Error("This ledger cannot carry verified or publicly authorized claims");
   if(!Array.isArray(c.source_ids)||!c.source_ids.length||c.source_ids.some(id=>!sid.has(id)))throw Error("Missing fictional provenance");
   if(!Array.isArray(c.linked_quest_ids))throw Error("Malformed quest references");
   if(c.claim_kind==="synthetic_outcome"&&!c.metric)throw Error("Synthetic outcome requires a fictional metric");
   if(["hypothesis","design_proposal","risk_counterexample"].includes(c.claim_kind)&&c.metric!==null)throw Error("Narrative claim cannot have a measurement");
   if(c.metric&&(c.metric.population!=="invented_sample_only"||c.metric.design!=="uncontrolled_fictional_before_after"||
        !Number.isFinite(c.metric.baseline)||c.metric.baseline<0||!Number.isFinite(c.metric.followup)||c.metric.followup<0))throw Error("Untrusted measurement fields");
  }
  const transitioned=new Set();
  for(const e of pack.events){
   if(!/^SYN-EVT-[A-Z0-9-]+$/.test(e.id)||eid.has(e.id)||!cid.has(e.claim_id)||!["clarification","withdrawal"].includes(e.kind)||e.status!=="synthetic_event_only")throw Error("Invalid correction event");
   eid.add(e.id);
   const key=e.claim_id+":"+e.to_revision;
   if(transitioned.has(key)||!Number.isInteger(e.to_revision)||!Number.isInteger(e.from_revision)||e.to_revision<=e.from_revision)throw Error("Invalid revision chain");
   transitioned.add(key);
   const c=pack.claims.find(c=>c.id===e.claim_id);
   if(e.to_revision!==c.revision)throw Error("Revision not bound to current record");
   if(e.kind==="withdrawal"&&c.publication_state!=="withdrawn_synthetic")throw Error("Withdrawal not enforced");
  }
  for(const c of pack.claims){
   if(c.revision>1&&!transitioned.has(c.id+":"+c.revision))throw Error("Correction record missing");
   if(c.publication_state==="withdrawn_synthetic"&&!pack.events.some(e=>e.claim_id===c.id&&e.kind==="withdrawal"))throw Error("Withdrawal event missing");
   if(c.publication_state==="synthetic_only"&&pack.events.some(e=>e.claim_id===c.id&&e.kind==="withdrawal"))throw Error("Withdrawn claim presented as active");
  }
  return true;
 }
 function metricIllustration(metric){
  if(!metric)return null;
  const change=metric.followup-metric.baseline;
  const percentage=metric.baseline===0?null:Math.round((change/metric.baseline)*1000)/10;
  return {baseline:metric.baseline,followup:metric.followup,change,percentage,unit:metric.unit,
    disclosure:"Arithmetic on invented numbers only; no causal identification or observed benefit."};
 }
 function search(pack,{domain="all",kind="all",query="",includeWithdrawn=true}={}){
  validate(pack);
  const term=String(query||"").trim().toLocaleLowerCase();
  return pack.claims.filter(c=>
   (includeWithdrawn||c.publication_state!=="withdrawn_synthetic")&&
   (domain==="all"||c.domain===domain)&&
   (kind==="all"||c.claim_kind===kind)&&
   (!term||[c.title,c.statement,c.method,c.limitations,c.alternative_explanations,c.id].some(x=>x.toLocaleLowerCase().includes(term))));
 }
 function summary(pack){
  validate(pack);
  const active=pack.claims.filter(c=>c.publication_state==="synthetic_only");
  const counts=Object.fromEntries([...LAYERS].sort().map(x=>[x,active.filter(c=>c.evidence_layer===x).length]));
  return {fictional_claims:pack.claims.length,synthetic_sources:pack.sources.length,correction_events:pack.events.length,
    withdrawn:pack.claims.length-active.length,by_layer:counts,verified_outcomes:0,
    statement:"All records fictional; 0 real observations or independently verified outcomes."};
 }
 return Object.freeze({validate,metricIllustration,search,summary});
});
