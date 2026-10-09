/* REGEN v0.4: hypothetical rehearsal only. No simulated progress is real. */
(function(root,factory){
 const api=factory(typeof module!=="undefined"&&module.exports?require("./quest-engine.js"):root.REGENEngine);
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
 if(root)root.REGENLab=api;
})(typeof globalThis!=="undefined"?globalThis:undefined,function(engine){
 "use strict";
 if(!engine||typeof engine.recommendations!=="function")throw Error("REGEN quest engine must load first.");
 function assertScenario(s,quests){
  if(!s||typeof s.id!=="string"||!/^[a-z0-9-]+$/.test(s.id))throw Error("Scenario needs a stable ID.");
  const ids=new Set(quests.map(q=>q.id));
  if(!Number.isInteger(s.step_limit)||s.step_limit<0||s.step_limit>100)throw Error("Invalid step limit");
  if(!Number.isInteger(s.total_minutes_budget)||s.total_minutes_budget<0||s.total_minutes_budget>100000)throw Error("Invalid time budget");
  for(const key of ["starting_completed_ids","blocked_quest_ids"]){
   if(!Array.isArray(s[key])||new Set(s[key]).size!==s[key].length)throw Error(key+" must be a unique array");
   for(const id of s[key])if(!ids.has(id))throw Error("Unknown quest "+id+" in "+key);
  }
  if(s.pause_after_steps!==null&&s.pause_after_steps!==undefined&&(!Number.isInteger(s.pause_after_steps)||s.pause_after_steps<0||s.pause_after_steps>s.step_limit))throw Error("Invalid pause step");
  const p=s.preferences||{};
  if(!["all","remote","community"].includes(p.setting||"all"))throw Error("Invalid participation setting");
  return true;
 }
 function simulate(quests,scenario){
  engine.validate(quests);
  assertScenario(scenario,quests);
  const done=new Set(scenario.starting_completed_ids);
  const blocked=new Set(scenario.blocked_quest_ids);
  const trace=[];
  let remaining=scenario.total_minutes_budget,stop="step_limit";
  for(let step=0;step<scenario.step_limit;step++){
   if(scenario.pause_after_steps===step){stop="scenario_interruption";break;}
   const candidates=engine.recommendations(quests,done,scenario.preferences,quests.length);
   const feasible=candidates.find(x=>!blocked.has(x.quest.id)&&x.quest.estimated_minutes<=remaining);
   if(!feasible){
    const alternative=candidates.some(x=>!blocked.has(x.quest.id));
    stop=alternative?"insufficient_total_time":"no_matching_unblocked_quest";break;
   }
   const q=feasible.quest;
   remaining-=q.estimated_minutes;
   done.add(q.id);
   trace.push({step:step+1,quest_id:q.id,title:q.title,stage:q.stage,
    estimated_minutes:q.estimated_minutes,reason:feasible.reason,
    marker:"hypothetical_only"});
  }
  if(scenario.pause_after_steps===scenario.step_limit&&trace.length===scenario.step_limit)stop="scenario_interruption";
  const stages=[...new Set(trace.map(x=>x.stage))].sort((a,b)=>a-b);
  return {scenario_id:scenario.id,name:scenario.name,simulation:true,verified_impact:false,participant_activity:false,
    result_kind:"fictional_trace",stop_reason:stop,steps:trace,total_estimated_minutes:scenario.total_minutes_budget-remaining,
    remaining_estimated_minutes:remaining,simulated_completed_ids:trace.map(x=>x.quest_id),
    starting_completed_ids:[...scenario.starting_completed_ids],stages_encountered:stages,
    warning:"This is a fictional pathway rehearsal, not an observation, qualification, permission, or impact assessment."};
 }
 function audit(quests,scenarios){
  engine.validate(quests);
  if(!Array.isArray(scenarios))throw Error("Scenarios must be an array.");
  const traces=scenarios.map(s=>simulate(quests,s));
  const domains=[...new Set(quests.map(q=>q.domain))].sort();
  const settings=[...new Set(quests.map(q=>q.setting))].sort();
  const allVisited=new Set(traces.flatMap(x=>x.simulated_completed_ids));
  const counts=Object.fromEntries(domains.map(d=>[d,quests.filter(q=>q.domain===d).length]));
  return {simulation:true,scenarios:traces.length,seed_quests:quests.length,domains:counts,settings,
    encountered_quest_count:allVisited.size,
    unreachable_in_these_scenarios:quests.filter(q=>!allVisited.has(q.id)).map(q=>q.id),
    stopped_by_reason:Object.fromEntries([...new Set(traces.map(t=>t.stop_reason))].sort().map(k=>[k,traces.filter(t=>t.stop_reason===k).length])),
    disclosure:"Coverage describes fictional test scenarios, never real user access or social outcomes."};
 }
 return Object.freeze({assertScenario,simulate,audit});
});
