const test=require("node:test"),assert=require("node:assert/strict");
const vm=require("node:vm"),fs=require("node:fs"),path=require("node:path");
const ROOT=path.resolve(__dirname,"..");
function read(p){return fs.readFileSync(path.join(ROOT,p),"utf8");}
function boot(){
 const nodes=new Map(),data=new Map();
 function el(id){
  if(!nodes.has(id))nodes.set(id,{
   id,style:{},value:"all",textContent:"",innerHTML:"",open:false,disabled:false,
   listeners:{},classList:{toggle(){},contains(){return false}},
   addEventListener(ev,fn){this.listeners[ev]=fn},
   setAttribute(){},removeAttribute(){},
   showModal(){this.open=true},close(){this.open=false}
  });
  return nodes.get(id);
 }
 const doc={
  getElementById:el,querySelectorAll(){return []},
  body:{appendChild(){}},
  createElement(){return {style:{},click(){},remove(){}}}
 };
 const store={
  getItem(k){return data.has(k)?data.get(k):null},
  setItem(k,v){data.set(k,v)},removeItem(k){data.delete(k)}
 };
 const context={document:doc,localStorage:store,location:{protocol:"file:",pathname:"/web/index.html"},
  confirm(){return true},setTimeout(){},console,Blob,URL,scrollTo(){}};
 context.window=context;vm.createContext(context);
 for(const script of ["web/quest-engine.js","web/progress-vault.js"])vm.runInContext(read(script),context,{timeout:3000});
 const html=read("web/index.html"),match=html.match(/<script>\s*([\s\S]*?)<\/script>/);
 assert.ok(match,"HTML must include an inline bootstrap");
 vm.runInContext(match[1],context,{timeout:3000});
 return {context,el,store,data};
}
test("vault boots without needing a login or modifying storage",()=>{
 const app=boot();
 assert.match(app.el("vaultStorage").textContent,/Available/);
 assert.equal(app.el("vaultCount").textContent,0);
 assert.equal(app.data.size,0);
});
test("old marks are retained, deletion removes only REGEN key",()=>{
 const app=boot();
 app.data.set("unrelated-application","value");
 vm.runInContext('done.add("first-spark");save();updateStats()',app.context);
 assert.match(app.data.get("regen_v01_completed"),/first-spark/);
 assert.equal(app.el("vaultCount").textContent,1);
 app.el("vaultErase").listeners.click();
 assert.equal(app.data.has("regen_v01_completed"),false);
 assert.equal(app.data.get("unrelated-application"),"value");
 assert.equal(app.el("vaultCount").textContent,0);
 assert.match(app.el("vaultMessage").textContent,/Local progress erased/);
});
test("backup file preview never auto restores; merge and replace require an action",async()=>{
 const app=boot();
 const snapshot=JSON.stringify({format:"regen-local-progress",version:1,evidence:"self_report_only",completed_ids:["first-spark","not-in-catalog"]});
 const target={files:[{size:snapshot.length,async text(){return snapshot}}],value:"file"};
 await app.el("vaultFile").listeners.change({target});
 assert.equal(app.el("vaultCount").textContent,0);
 assert.equal(app.el("vaultApply").disabled,false);
 assert.match(app.el("vaultPreview").textContent,/1 no longer recognized/);
 app.el("vaultMode").value="merge";
 app.el("vaultApply").listeners.click();
 assert.equal(app.el("vaultCount").textContent,1);
 assert.match(app.data.get("regen_v01_completed"),/first-spark/);
 assert.equal(app.el("vaultApply").disabled,true);
});
test("untrusted evidence backup disables restore and preserves marks",async()=>{
 const app=boot();
 vm.runInContext('done.add("neighborhood-assets");save();updateStats()',app.context);
 const backup=JSON.stringify({format:"regen-local-progress",version:2,evidence:"verified",catalog_version:"0.4.0",completed_ids:["first-spark"]});
 await app.el("vaultFile").listeners.change({target:{files:[{size:backup.length,async text(){return backup}}],value:"file"}});
 assert.equal(app.el("vaultApply").disabled,true);
 assert.match(app.el("vaultPreview").textContent,/Cannot use/);
 assert.match(app.data.get("regen_v01_completed"),/neighborhood-assets/);
});
