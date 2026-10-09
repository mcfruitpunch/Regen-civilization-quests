const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const engine = require("../web/quest-engine.js");
const quests = JSON.parse(fs.readFileSync(path.join(__dirname,"../data/quests.json"),"utf8")).quests;
const byId = id => quests.find(q=>q.id===id);

test("real catalog has an acyclic, internally consistent prerequisite graph",()=>{
  assert.equal(engine.validate(quests),true);
  assert.equal(new Set(quests.map(q=>q.id)).size,30);
  assert.ok(quests.every(q=>q.publication_status==="illustrative_only"));
});

test("only next ready illustrative quests are recommended",()=>{
  const initial=engine.recommendations(quests,[],{},20);
  assert.ok(initial.every(x=>x.ready&&!x.completed&&!x.missing.length));
  assert.ok(initial.some(x=>x.quest.id==="first-spark"));
  assert.ok(!initial.some(x=>x.quest.id==="neighborhood-assets"));
  const later=engine.recommendations(quests,["first-spark"],{},20);
  assert.ok(later.some(x=>x.quest.id==="neighborhood-assets"));
});

test("advisory sequence does not remove quests from browsing",()=>{
  const list=engine.assess(quests,[]);
  const followup=list.find(x=>x.quest.id==="neighborhood-assets");
  assert.ok(followup);
  assert.deepEqual(followup.missing,["first-spark"]);
  assert.ok(followup.reason.includes("Find your first spark"));
});

test("recommendations respect skills, participation setting, duration, and topic",()=>{
  const results=engine.recommendations(quests,[],{skill:"Education & Research",setting:"remote",minutes:15,domain:"Learning"},20);
  assert.deepEqual(results.map(x=>x.quest.id),["skill-compass"]);
  const none=engine.recommendations(quests,[],{domain:"Food",minutes:5},20);
  assert.deepEqual(none,[]);
});

test("results stable independent of data ordering",()=>{
  const a=engine.recommendations(quests,["first-spark"],{},20).map(x=>x.quest.id);
  const b=engine.recommendations([...quests].reverse(),["first-spark"],{},20).map(x=>x.quest.id);
  assert.deepEqual(a,b);
});

test("completion is a private self-report, never a verified impact claim",()=>{
  const exported=engine.exportProgress(quests,["first-spark","first-spark","secret","public-meeting"]);
  assert.deepEqual(exported.completed_ids,["first-spark","public-meeting"]);
  assert.equal(exported.evidence,"self_report_only");
  assert.equal(exported.format,"regen-local-progress");
  assert.ok(!("user" in exported));
});

test("unsupported publication states are never recommended in demo",()=>{
  const draft={...byId("first-spark"),id:"unapproved-example",prerequisite_ids:[],publication_status:"draft"};
  const subset=[...quests,draft];
  assert.equal(engine.validate(subset),true);
  assert.ok(!engine.assess(subset,[]).some(x=>x.quest.id===draft.id));
});

test("catalog validation rejects dangling IDs, duplicate IDs, and cycles",()=>{
  assert.throws(()=>engine.validate([byId("first-spark"),byId("first-spark")]),/Duplicate/);
  assert.throws(()=>engine.validate([{...byId("first-spark"),prerequisite_ids:["never-defined"]}]),/Unknown/);
  const a={...byId("first-spark"),prerequisite_ids:["neighborhood-assets"]};
  const b={...byId("neighborhood-assets"),prerequisite_ids:["first-spark"]};
  assert.throws(()=>engine.validate([a,b]),/Circular/);
});

test("comparison scope is respected, not moral ranking",()=>{
  const results=engine.assess(quests,["first-spark"],{minutes:15});
  assert.ok(results.some(x=>x.completed));
  assert.ok(results.some(x=>!x.fits));
  assert.ok(results.every(x=>!Object.hasOwn(x,"morality")&&!Object.hasOwn(x,"impact_score")));
});
