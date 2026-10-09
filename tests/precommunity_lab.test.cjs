const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const e=require("../web/quest-engine.js"),lab=require("../web/simulation-engine.js");
const pack=JSON.parse(fs.readFileSync(path.join(__dirname,"../data/quests.json"),"utf8"));
const scenarios=JSON.parse(fs.readFileSync(path.join(__dirname,"../data/scenarios.json"),"utf8")).scenarios;
const scenario=id=>scenarios.find(s=>s.id===id);
test("all 30 quest records form a valid advisory graph",()=>{
 assert.equal(pack.quests.length,30);
 assert.equal(new Set(pack.quests.map(q=>q.id)).size,30);
 assert.equal(e.validate(pack.quests),true);
 assert.ok(pack.quests.every(q=>q.publication_status==="illustrative_only"&&q.evidence_level==="self_report"));
});
test("all scenarios are self-contained and hypothetical",()=>{
 assert.equal(scenarios.length,9);
 for(const s of scenarios){
  assert.equal(lab.assertScenario(s,pack.quests),true);
  const result=lab.simulate(pack.quests,s);
  assert.equal(result.simulation,true);
  assert.equal(result.verified_impact,false);
  assert.equal(result.participant_activity,false);
  assert.ok(result.steps.length<=s.step_limit);
  assert.ok(result.total_estimated_minutes<=s.total_minutes_budget);
  assert.ok(result.steps.every(x=>x.marker==="hypothetical_only"));
 }
});
test("replay is identical and does not mutate inputs",()=>{
 const original=JSON.stringify(scenario("food-research"));
 const a=lab.simulate(pack.quests,scenario("food-research"));
 const b=lab.simulate(pack.quests,scenario("food-research"));
 assert.deepEqual(a,b);
 assert.equal(JSON.stringify(scenario("food-research")),original);
});
test("blocked quests never appear even if the engine could otherwise recommend them",()=>{
 const s=scenario("permission-unavailable"),out=lab.simulate(pack.quests,s);
 for(const id of s.blocked_quest_ids)assert.ok(!out.simulated_completed_ids.includes(id),id);
});
test("simulation interruption is explicit",()=>{
 const s=scenario("interrupted-learning"),out=lab.simulate(pack.quests,s);
 assert.equal(out.stop_reason,"scenario_interruption");
 assert.equal(out.steps.length,2);
});
test("time budget is never exceeded",()=>{
 for(const s of scenarios){
  const result=lab.simulate(pack.quests,s);
  assert.ok(result.remaining_estimated_minutes>=0);
  assert.ok(result.total_estimated_minutes<=s.total_minutes_budget);
 }
});
test("honest empty path does not invent quests",()=>{
 const out=lab.simulate(pack.quests,scenario("no-matching-preferences"));
 assert.equal(out.simulated_completed_ids.length,0);
 assert.equal(out.stop_reason,"no_matching_unblocked_quest");
});
test("invalid and contradictory scenarios are rejected",()=>{
 const s=scenario("food-research");
 assert.throws(()=>lab.assertScenario({...s,blocked_quest_ids:["not-real"]},pack.quests),/Unknown/);
 assert.throws(()=>lab.assertScenario({...s,step_limit:-1},pack.quests),/Invalid/);
 assert.throws(()=>lab.assertScenario({...s,starting_completed_ids:["food-date-language","food-date-language"]},pack.quests),/unique/);
});
test("coverage audit only describes generated traces",()=>{
 const a=lab.audit(pack.quests,scenarios);
 assert.equal(a.seed_quests,30);
 assert.equal(a.scenarios,9);
 assert.ok(a.encountered_quest_count<=30);
 assert.ok(a.disclosure.includes("never real user"));
 assert.equal(a.simulation,true);
});
test("draft quests cannot enter simulated recommendations",()=>{
 const fake={...pack.quests[0],id:"private-draft-test",publication_status:"draft",prerequisite_ids:[]};
 const out=lab.simulate([...pack.quests,fake],scenario("ten-minute-onboarding"));
 assert.ok(!out.simulated_completed_ids.includes(fake.id));
});
