
const test = require("node:test");
const assert = require("node:assert/strict");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const vm = require("node:vm");

const read=p=>readFileSync(join(__dirname,"..",p),"utf8");
function boot(){
  const html=read("web/index.html");
  const inline=html.match(/<script>\s*([\s\S]*?)<\/script>/);
  assert.ok(inline,"Expected embedded demo data and startup code");
  const elements=new Map();
  const stored=new Map();
  function el(id){
    if(!elements.has(id))elements.set(id,{
      id,style:{},innerHTML:"",textContent:"",value:"all",open:false,
      listeners:{},
      addEventListener(name,fn){this.listeners[name]=fn},
      classList:{toggle(){},contains(){return false}},
      setAttribute(){},removeAttribute(){},
      showModal(){this.open=true},close(){this.open=false}
    });
    return elements.get(id);
  }
  const doc={
    getElementById:el,
    querySelectorAll(){return []},
    body:{appendChild(){}},
    createElement(){return {style:{},click(){},remove(){}}}
  };
  const context={
    document:doc,location:{protocol:"file:",pathname:"/web/index.html"},
    localStorage:{getItem(k){return stored.get(k)||null},setItem(k,v){stored.set(k,v)}},
    confirm(){return true},setTimeout(){},console,Blob,URL,
    scrollTo(){}
  };
  context.window=context;
  vm.createContext(context);
  vm.runInContext(read("web/quest-engine.js"),context,{timeout:3000});
  vm.runInContext(inline[1],context,{timeout:3000});
  return {context,el,stored};
}

test("prototype boots with an offline, explainable pathway",()=>{
  const {el}=boot();
  assert.equal(el("statCompleted").textContent,0);
  assert.match(el("pathRecommendations").innerHTML,/Find your first spark/);
  assert.match(el("pathRecommendations").innerHTML,/No previous quest needed/);
  assert.doesNotMatch(el("pathRecommendations").innerHTML,/Spot three existing strengths/);
  assert.match(el("pathFull").innerHTML,/Spot three existing strengths/);
});

test("marking preparation complete updates suggestions and keeps progress local",()=>{
  const {context,el,stored}=boot();
  vm.runInContext('done.add("first-spark");save();updateStats()',context);
  assert.equal(el("statCompleted").textContent,1);
  assert.match(el("pathRecommendations").innerHTML,/Spot three existing strengths/);
  assert.match(stored.get("regen_v01_completed"),/first-spark/);
  assert.match(el("suggestDesc").textContent,/No previous quest|preparation/);
});

test("empty preference results explain how to continue",()=>{
  const {context,el}=boot();
  el("pathTime").value="5";
  vm.runInContext("renderJourney()",context);
  assert.match(el("pathSummary").textContent,/No ready example quests match/);
  assert.match(el("pathRecommendations").innerHTML,/Nothing ready/);
});
