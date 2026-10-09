/* REGEN v0.3 reviewer worksheet. A review note is not an authenticated approval. */
(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(root)root.REGENReview=api;
})(typeof globalThis!=="undefined"?globalThis:undefined,function(){
 "use strict";
 const AREAS=["safety_and_consent","affected_people","accessibility","evidence_and_fairness","stop_and_appeals"];
 const RATINGS=["addressed","needs_changes","not_assessed"];
 const OUTCOMES=["request_changes","reject","refer_to_authorized_review"];
 function createWorksheet(proposal,answers={}){
  return {
   record_type:"regen_untrusted_review_note",
   proposal_id:typeof proposal?.id==="string"?proposal.id:"",
   proposal_version:typeof proposal?.version==="string"?proposal.version:"",
   recommendation:answers.recommendation||"request_changes",
   checks:Object.fromEntries(AREAS.map(x=>[x,answers[x]||"not_assessed"])),
   notes:String(answers.notes||"").trim(),
   authorized_approval:false,
   permission_to_publish:false
  };
 }
 function validateWorksheet(note){
  const errors=[];
  if(note?.record_type!=="regen_untrusted_review_note")errors.push("Not a local REGEN review worksheet.");
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(note?.proposal_id||""))errors.push("Proposal ID is missing or malformed.");
  if(!/^\d+\.\d+\.\d+$/.test(note?.proposal_version||""))errors.push("Proposal version is required.");
  if(!OUTCOMES.includes(note?.recommendation))errors.push("Choose a non-publishing review recommendation.");
  for(const key of AREAS)if(!RATINGS.includes(note?.checks?.[key]))errors.push("Review area needs an explicit status: "+key);
  if(typeof note?.notes!=="string"||note.notes.length<20)errors.push("Explain the findings and reasons (at least 20 characters).");
  if(note?.authorized_approval!==false||note?.permission_to_publish!==false)errors.push("A local worksheet can never authorize publication.");
  if(note?.recommendation==="refer_to_authorized_review"){
    for(const key of AREAS)if(note.checks[key]!=="addressed")errors.push("Referral requires all review areas marked addressed: "+key);
  }
  return errors;
 }
 return Object.freeze({AREAS,RATINGS,OUTCOMES,createWorksheet,validateWorksheet});
});
