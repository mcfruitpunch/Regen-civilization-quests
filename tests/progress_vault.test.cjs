const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const V=require("../web/progress-vault.js");
const quests=JSON.parse(fs.readFileSync(path.join(__dirname,"../data/quests.json"),"utf8")).quests;

function backup(done=["first-spark"],catalog="0.5.0"){return V.createSnapshot(quests,new Set(done),catalog)}
function preview(text,current=[]){return V.previewImport(text,quests,new Set(current))}
function storage(initial=null){
 const values=new Map(initial===null?[]:[[V.STORE_KEY,initial]]);
 return {values,getItem(k){return values.has(k)?values.get(k):null},setItem(k,v){values.set(k,v)},removeItem(k){values.delete(k)}};
}
test("v2 backup contains only expected, portable non-personal fields",()=>{
 const data=backup(["neighborhood-assets","first-spark","ghost","first-spark"]);
 assert.deepEqual(Object.keys(data),["format","version","evidence","catalog_version","completed_ids"]);
 assert.deepEqual(data.completed_ids,["first-spark","neighborhood-assets"]);
 assert.equal(data.version,2);
 assert.equal(data.evidence,"self_report_only");
 assert.ok(!("email" in data)&&!("location" in data)&&!("timestamp" in data));
 assert.deepEqual(V.parseSnapshot(JSON.stringify(data)),data);
});
test("v1 legacy export can be restored with preview and no impact upgrade",()=>{
 const legacy={format:"regen-local-progress",version:1,evidence:"self_report_only",completed_ids:["first-spark","neighborhood-assets"]};
 const p=preview(JSON.stringify(legacy),["first-spark"]);
 assert.equal(p.input_version,1);
 assert.equal(p.existing_count,1);
 assert.equal(p.new_count,1);
 assert.equal(p.unknown_count,0);
 assert.match(p.disclaimer,/self-report/);
});
test("preview reports old unknown IDs but never grants them progress",()=>{
 const data=backup();
 data.completed_ids.push("renamed-and-removed-quest");
 const p=preview(JSON.stringify(data));
 assert.equal(p.unknown_count,1);
 assert.equal(p.recognized_count,1);
 assert.deepEqual(p.matched_ids,["first-spark"]);
 assert.ok(Object.isFrozen(p));
 assert.ok(Object.isFrozen(p.matched_ids));
});
test("import explicitly distinguishes union from replacement",()=>{
 const p=preview(JSON.stringify(backup(["first-spark"])),["neighborhood-assets"]);
 assert.deepEqual([...V.applyImport(p,["neighborhood-assets"],"merge",quests)].sort(),["first-spark","neighborhood-assets"]);
 assert.deepEqual([...V.applyImport(p,["neighborhood-assets"],"replace",quests)],["first-spark"]);
 assert.throws(()=>V.applyImport(p,[],"auto",quests),/Choose merge or replace/);
});
test("invalid JSON and oversized backups never apply",()=>{
 assert.throws(()=>V.parseSnapshot("not JSON"),/Not valid JSON/);
 assert.throws(()=>V.parseSnapshot(" ".repeat(V.MAX_BYTES+1)),/smaller than/);
 assert.throws(()=>V.parseSnapshot(JSON.stringify([])),/one JSON object/);
});
test("unexpected fields, forged verification, future version and duplicates rejected",()=>{
 const d=backup();
 for(const altered of [
  {...d,evidence:"independently_verified"},
  {...d,version:3},
  {...d,user_name:"Alice"},
  {...d,completed_ids:["first-spark","first-spark"]},
  {...d,completed_ids:[123]},
  {...d,completed_ids:["__proto__"]},
  {...d,catalog_version:"some unsafe value"}
 ])assert.throws(()=>V.parseSnapshot(JSON.stringify(altered)));
});
test("legacy local storage works with no destructive migration",()=>{
 const s=storage(JSON.stringify(["first-spark","neighborhood-assets"]));
 const initial=V.readLocal(s,quests);
 assert.equal(initial.available,true);
 assert.deepEqual([...initial.completed],["first-spark","neighborhood-assets"]);
 assert.equal(s.getItem(V.STORE_KEY),'["first-spark","neighborhood-assets"]');
});
test("write and erase affect only the REGEN demo key",()=>{
 const s=storage(JSON.stringify(["first-spark"]));
 s.setItem("unrelated-app-data","do-not-change");
 assert.equal(V.writeLocal(s,new Set(["neighborhood-assets"]),quests).ok,true);
 assert.deepEqual(JSON.parse(s.getItem(V.STORE_KEY)),["neighborhood-assets"]);
 assert.equal(V.eraseLocal(s).ok,true);
 assert.equal(s.getItem(V.STORE_KEY),null);
 assert.equal(s.getItem("unrelated-app-data"),"do-not-change");
});
test("read-only or unavailable storage cannot claim a successful save or deletion",()=>{
 const noStore={getItem(){throw Error("blocked")},setItem(){throw Error("blocked")},removeItem(){throw Error("blocked")}};
 const read=V.readLocal(noStore,quests);
 assert.equal(read.available,false);
 assert.equal(read.completed.size,0);
 assert.equal(V.writeLocal(noStore,new Set(["first-spark"]),quests).ok,false);
 assert.equal(V.eraseLocal(noStore).ok,false);
});
test("corrupt local storage is not silently overwritten by reading it",()=>{
 const s=storage("{bad json");
 const r=V.readLocal(s,quests);
 assert.equal(r.available,false);
 assert.equal(s.getItem(V.STORE_KEY),"{bad json");
});
