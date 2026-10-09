/* REGEN v0.3 authoring sandbox. A local screening result is NEVER permission to publish. */
(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(root)root.REGENAuthoring=api;
})(typeof globalThis!=="undefined"?globalThis:undefined,function(){
"use strict";
const SKILLS=["Ecological Restoration","Community Building","Building & Engineering","Civic Transformation","Creative Expression","Education & Research","Regenerative Enterprise","Systems Thinking"];
const DOMAINS=["Community","Learning","Repair","Food","Civic","Systems"];
const KINDS=["learn","observe","act","collaborate","transform"];
const SETTINGS=["home","remote","community","flexible"];
const REVIEW_FIELDS=["community_need","affected_people","potential_harms","mitigation_plan","permissions_plan","accessibility_plan","impact_measure","stop_conditions","data_handling","accountability_route"];
const FLAGS=["physical_hazard","regulated_activity","workplace_or_institution","children_or_vulnerable_people","sensitive_information","public_targeting","coercion_or_dependency"];
function slug(value){
 return String(value||"").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60);
}
function buildDraft(raw){
 const value=(key)=>String(raw[key]??"").trim();
 const review={};
 for(const k of REVIEW_FIELDS)review[k]=value(k);
 review.risk_flags=Object.fromEntries(FLAGS.map(k=>[k,raw[k]===true]));
 return {
  record_type:"regen_quest_proposal",
  id:slug(value("id")||value("title")),version:"0.3.0",
  title:value("title"),summary:value("summary"),stage:Number(raw.stage),
  domain:value("domain"),kind:value("kind"),estimated_minutes:Number(raw.estimated_minutes),
  setting:value("setting"),skills:Array.isArray(raw.skills)?[...new Set(raw.skills.filter(s=>SKILLS.includes(s)))]:[],
  objective:value("objective"),
  steps:Array.isArray(raw.steps)?raw.steps.map(s=>String(s).trim()).filter(Boolean):[],
  reflection_prompt:value("reflection_prompt"),accessibility_alternative:value("accessibility_alternative"),
  consent_requirement:value("consent_requirement"),safety_notes:value("safety_notes"),
  next_quest_id:null,atlas_refs:[],publication_status:"draft",evidence_level:"self_report",review
 };
}
function validateDraft(draft){
 const errors=[];
 if(!draft||typeof draft!=="object"||Array.isArray(draft))return ["A draft object is required."];
 if(draft.record_type!=="regen_quest_proposal"||draft.publication_status!=="draft"||draft.evidence_level!=="self_report")errors.push("Only local draft proposals are allowed.");
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.id||""))errors.push("Use a short lowercase quest identifier.");
 if(!/^\d+\.\d+\.\d+$/.test(draft.version||""))errors.push("Version must be a semantic version.");
 for(const [field,min] of Object.entries({title:6,summary:12,objective:10,reflection_prompt:10,accessibility_alternative:10,consent_requirement:10,safety_notes:10})){
  if(typeof draft[field]!=="string"||draft[field].trim().length<min)errors.push(field.replace(/_/g," ")+": add at least "+min+" characters.");
 }
 if(!Number.isInteger(draft.stage)||draft.stage<1||draft.stage>7)errors.push("Choose a scope from 1 to 7.");
 if(!Number.isInteger(draft.estimated_minutes)||draft.estimated_minutes<1||draft.estimated_minutes>10080)errors.push("Choose a realistic duration in minutes.");
 if(!DOMAINS.includes(draft.domain))errors.push("Choose a valid quest area.");
 if(!KINDS.includes(draft.kind))errors.push("Choose a valid activity type.");
 if(!SETTINGS.includes(draft.setting))errors.push("Choose a participation setting.");
 if(!Array.isArray(draft.skills)||!draft.skills.length||draft.skills.some(s=>!SKILLS.includes(s))||new Set(draft.skills).size!==draft.skills.length)errors.push("Choose at least one recognized skill.");
 if(!Array.isArray(draft.steps)||draft.steps.length<2||draft.steps.length>8||draft.steps.some(s=>typeof s!=="string"||s.trim().length<10))errors.push("Provide 2–8 specific, nontrivial steps.");
 if(!draft.review||typeof draft.review!=="object")errors.push("Complete the community impact and consent review.");
 else{
  for(const field of REVIEW_FIELDS)if(typeof draft.review[field]!=="string"||draft.review[field].trim().length<20)errors.push("Review: "+field.replace(/_/g," ")+" needs at least 20 characters.");
  for(const flag of FLAGS)if(typeof draft.review.risk_flags?.[flag]!=="boolean")errors.push("Risk flag "+flag+" needs an explicit yes/no.");
 }
 if(draft.next_quest_id!==null||!Array.isArray(draft.atlas_refs)||draft.atlas_refs.length!==0)errors.push("Draft authoring does not assign chain or Atlas links; reviewers must decide those.");
 return errors;
}
function screen(draft){
 const errors=validateDraft(draft);
 const warnings=[];
 const marked=FLAGS.filter(k=>draft?.review?.risk_flags?.[k]===true);
 if(marked.length)warnings.push("Heightened human review needed: "+marked.map(k=>k.replace(/_/g," ")).join(", ")+".");
 warnings.push("Automated checks cannot verify informed consent, community representation, factual accuracy, legal compliance, or actual risk.");
 warnings.push("Do not include identities, sensitive allegations, private records, or evidence in public GitHub issues.");
 return {structurally_complete:errors.length===0,ready_for_human_intake:errors.length===0,approved:false,publishable:false,errors,warnings,risk_flags:marked};
}
return Object.freeze({SKILLS,DOMAINS,KINDS,SETTINGS,REVIEW_FIELDS,FLAGS,slug,buildDraft,validateDraft,screen});
});
