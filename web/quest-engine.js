/* REGEN v0.2: deterministic, offline, explainable recommendations, never an impact score. */
(function(root,factory){
  const engine=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=engine;
  if(root)root.REGENEngine=engine;
})(typeof globalThis!=='undefined'?globalThis:undefined,function engineFactory(){
"use strict";
const DEMO="illustrative_only";
function validate(quests){
 if(!Array.isArray(quests))throw Error("Catalog must be an array");
 const nodes=new Map();
 for(const q of quests){
  if(!q||typeof q.id!=="string"||!q.id||!Array.isArray(q.prerequisite_ids))throw Error("Invalid quest or prerequisites");
  if(nodes.has(q.id))throw Error("Duplicate quest id: "+q.id);
  if(new Set(q.prerequisite_ids).size!==q.prerequisite_ids.length)throw Error("Duplicate prerequisites: "+q.id);
  nodes.set(q.id,q);
 }
 for(const q of quests)for(const id of q.prerequisite_ids){
  if(!nodes.has(id))throw Error("Unknown prerequisite "+id+" in "+q.id);
  if(nodes.get(id).stage>q.stage)throw Error("Prerequisite from later scope: "+q.id);
 }
 const active=new Set(),done=new Set();
 function visit(id){
  if(active.has(id))throw Error("Circular prerequisites: "+id);
  if(done.has(id))return;
  active.add(id);
  for(const parent of nodes.get(id).prerequisite_ids)visit(parent);
  active.delete(id);done.add(id);
 }
 for(const id of nodes.keys())visit(id);
 return true;
}
function missing(q,completed){const ids=new Set(completed||[]);return q.prerequisite_ids.filter(id=>!ids.has(id))}
function fits(q,filter={}){
 if(filter.domain&&filter.domain!=="all"&&q.domain!==filter.domain)return false;
 if(filter.skill&&filter.skill!=="all"&&!q.skills.includes(filter.skill))return false;
 if(filter.minutes&&filter.minutes!=="all"){
  const n=Number(filter.minutes);if(!Number.isFinite(n)||n<1||q.estimated_minutes>n)return false;
 }
 const mode=filter.setting||"all";
 if(mode==="remote"&&!["remote","home","flexible"].includes(q.setting))return false;
 if(mode==="community"&&!["community","flexible"].includes(q.setting))return false;
 return ["all","remote","community"].includes(mode);
}
function assess(quests,completed,filter={}){
 validate(quests);
 const ids=new Set(completed||[]), lookup=new Map(quests.map(q=>[q.id,q]));
 return quests.filter(q=>q.publication_status===DEMO).map(q=>{
  const missingIds=missing(q,ids),isDone=ids.has(q.id),fitsPreferences=fits(q,filter),ready=!isDone&&!missingIds.length;
  const why=[];
  if(missingIds.length)why.push("Suggested preparation: "+missingIds.map(id=>lookup.get(id).title).join(", ")+".");
  else if(q.prerequisite_ids.length)why.push("Your self-reported preparation is marked complete.");
  else why.push("No previous quest needed.");
  if(filter.skill&&filter.skill!=="all"&&q.skills.includes(filter.skill))why.push("Matches your skill interest.");
  if(filter.domain&&filter.domain!=="all"&&q.domain===filter.domain)why.push("Matches your chosen topic.");
  if(filter.minutes&&filter.minutes!=="all"&&q.estimated_minutes<=Number(filter.minutes))why.push("Fits in "+filter.minutes+" minutes.");
  if(filter.setting==="remote"&&["remote","home","flexible"].includes(q.setting))why.push("Offers an at-home or remote route.");
  if(filter.setting==="community"&&["community","flexible"].includes(q.setting))why.push("Offers a community participation route.");
  return {quest:q,missing:missingIds,completed:isDone,ready,fits:fitsPreferences,reason:why.join(" ")};
 });
}
function recommendations(quests,completed,filter={},limit=3){
 return assess(quests,completed,filter).filter(x=>x.ready&&x.fits)
 .sort((a,b)=>a.quest.stage-b.quest.stage||a.quest.estimated_minutes-b.quest.estimated_minutes||a.quest.id.localeCompare(b.quest.id))
 .slice(0,Math.max(0,Math.floor(limit)));
}
function exportProgress(quests,completed){
 validate(quests);
 const ids=new Set(quests.filter(q=>q.publication_status===DEMO).map(q=>q.id));
 return {format:"regen-local-progress",version:1,evidence:"self_report_only",completed_ids:[...new Set(completed||[])].filter(x=>ids.has(x)).sort()};
}
return Object.freeze({validate,missing,fits,assess,recommendations,exportProgress});
});
