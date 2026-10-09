const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const ROOT=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
function boot(){
 const elements=new Map();
 class Element{
  constructor(tag="div"){this.tagName=tag;this.children=[];this.value="all";this.listeners={};this.className="";this._text="";}
  set textContent(value){this._text=String(value);this.children=[];}
  get textContent(){return this._text+this.children.map(c=>c.textContent).join("");}
  get firstChild(){return this.children[0]||null;}
  appendChild(el){this.children.push(el);return el;}
  removeChild(el){const i=this.children.indexOf(el);if(i<0)throw Error("missing child");this.children.splice(i,1);return el;}
  addEventListener(type,handler){this.listeners[type]=handler;}
  focus(){this.focused=true;}
 }
 const document={getElementById(id){if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id);},createElement(tag){return new Element(tag);}};
 const ctx={document,console};
 ctx.window=ctx;
 vm.createContext(ctx);
 vm.runInContext(read("web/evidence-engine.js"),ctx,{timeout:3000});
 const html=read("web/evidence.html");
 const scripts=[...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
 assert.equal(scripts.length,2);
 vm.runInContext(scripts[1],ctx,{timeout:3000});
 return {ctx,el:id=>elements.get(id),html};
}
test("fictional viewer boots and advertises zero verified outcomes",()=>{
 const {el}=boot();
 assert.equal(el("stats").children.length,4);
 assert.match(el("stats").textContent,/Verified real outcomes0|0Verified real outcomes/);
 assert.equal(el("claims").children.length,10);
 assert.match(el("matches").textContent,/10 fictional example claims/);
 assert.match(el("detailIntro").textContent,/Illustrative only/);
});
test("searching and changing filters updates visible cards",()=>{
 const {ctx,el}=boot();
 el("domain").value="Food";
 vm.runInContext("render()",ctx);
 assert.equal(el("claims").children.length,3);
 assert.match(el("matches").textContent,/3 fictional/);
 el("query").value="nothing matches this invented query";
 vm.runInContext("render()",ctx);
 assert.match(el("claims").textContent,/No fictional claims match/);
});
test("withdrawn claims remain explicitly labeled and corrections visible",()=>{
 const {ctx,el}=boot();
 vm.runInContext('inspect("SYN-CLM-WITHDRAWN-CLAIM")',ctx);
 assert.match(el("detailIntro").textContent,/Withdrawn fictional claim/);
 assert.match(el("details").textContent,/withdrawal/i);
 assert.match(el("details").textContent,/incorrect|invalid|confused/i);
 assert.match(el("details").textContent,/Not reviewed/);
});
test("viewer uses text-only rendering rather than interpreting claims as markup",()=>{
 const html=read("web/evidence-template.html");
 assert.match(html,/element\.textContent=String\(content\)/);
 assert.ok(!html.includes("innerHTML="));
 assert.ok(!/fetch\s*\(/.test(html));
 assert.ok(!/localStorage|sessionStorage/.test(html));
});
