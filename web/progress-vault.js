/* REGEN v0.5 progress vault: local-only, small, portable, explicitly self-reported.
 * This is a backup/restore format, not an identity credential or impact certificate.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
 if(root)root.REGENProgress=api;
})(typeof globalThis!=="undefined"?globalThis:undefined,function(){
 "use strict";
 const FORMAT="regen-local-progress",EVIDENCE="self_report_only",VERSION=2;
 const STORE_KEY="regen_v01_completed"; // Preserve earlier local demo records.
 const MAX_BYTES=65536,MAX_IDS=2000;
 const VALID_ID=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
 function catalogIDs(quests){
  if(!Array.isArray(quests))throw Error("Quest catalog is unavailable.");
  return new Set(quests.filter(q=>q&&q.publication_status==="illustrative_only").map(q=>q.id));
 }
 function checkedIDs(ids){
  if(!Array.isArray(ids)||ids.length>MAX_IDS)throw Error("Backup quest IDs must be an appropriately sized array.");
  const seen=new Set();
  for(const id of ids){
   if(typeof id!=="string"||id.length>96||!VALID_ID.test(id))throw Error("Backup contains an invalid quest ID.");
   if(seen.has(id))throw Error("Backup includes duplicate quest IDs.");
   seen.add(id);
  }
  return ids;
 }
 function createSnapshot(quests,done,catalogVersion){
  const allowed=catalogIDs(quests);
  const ids=[...new Set(done||[])].filter(id=>allowed.has(id)).sort();
  checkedIDs(ids);
  const version=String(catalogVersion||"unknown");
  if(version.length>80||!/^[a-zA-Z0-9._-]+$/.test(version))throw Error("Invalid catalog revision.");
  return {format:FORMAT,version:VERSION,evidence:EVIDENCE,catalog_version:version,completed_ids:ids};
 }
 function parseSnapshot(input){
  if(typeof input!=="string"||!input.length||input.length>MAX_BYTES)throw Error("Backup must be a JSON file smaller than 64 KB.");
  let record;
  try{record=JSON.parse(input)}catch(e){throw Error("Not valid JSON.");}
  if(!record||Array.isArray(record)||typeof record!=="object")throw Error("Backup must contain one JSON object.");
  if(record.format!==FORMAT||![1,2].includes(record.version)||record.evidence!==EVIDENCE)throw Error("Unsupported or untrusted backup format; only self-reported v1/v2 is allowed.");
  const required=record.version===1?["format","version","evidence","completed_ids"]:["format","version","evidence","catalog_version","completed_ids"];
  if(Object.keys(record).length!==required.length||Object.keys(record).some(k=>!required.includes(k)))throw Error("Backup contains unexpected fields; no personal or verification claims are allowed.");
  if(record.version===2&&(typeof record.catalog_version!=="string"||record.catalog_version.length>80||!/^[a-zA-Z0-9._-]+$/.test(record.catalog_version)))throw Error("Invalid catalog revision in backup.");
  checkedIDs(record.completed_ids);
  return record;
 }
 function previewImport(text,quests,current){
  const backup=parseSnapshot(text),allowed=catalogIDs(quests),existing=new Set(current||[]);
  const matched=backup.completed_ids.filter(id=>allowed.has(id));
  const unknown=backup.completed_ids.length-matched.length;
  const newIds=matched.filter(id=>!existing.has(id));
  return Object.freeze({
   input_version:backup.version,source_catalog:backup.catalog_version||"v1 (no catalog revision)",
   matched_ids:Object.freeze([...matched]),existing_count:existing.size,
   incoming_count:backup.completed_ids.length,recognized_count:matched.length,
   unknown_count:unknown,new_count:newIds.length,
   would_replace_count:matched.length,would_merge_count:new Set([...existing,...matched]).size,
   disclaimer:"An imported backup is a self-report only. It cannot certify activity, skills, consent, or outcomes."
  });
 }
 function applyImport(preview,current,mode,quests){
  if(!["merge","replace"].includes(mode))throw Error("Choose merge or replace explicitly.");
  if(!preview||!Array.isArray(preview.matched_ids))throw Error("No inspected backup is selected.");
  const allowed=catalogIDs(quests);
  const ids=mode==="replace"?[]:[...(current||[])];
  for(const id of preview.matched_ids)if(allowed.has(id))ids.push(id);
  return new Set(ids.filter(id=>allowed.has(id)));
 }
 function readLocal(storage,quests){
  try{
   const raw=storage.getItem(STORE_KEY);
   if(raw===null)return {completed:new Set(),available:true,warning:""};
   if(raw.length>MAX_BYTES)throw Error("Stored quest progress exceeds the allowed size.");
   const ids=JSON.parse(raw);
   checkedIDs(ids);
   const allowed=catalogIDs(quests);
   return {completed:new Set(ids.filter(x=>allowed.has(x))),available:true,warning:""};
  }catch(e){
   return {completed:new Set(),available:false,warning:"Browser storage could not be read. Progress works in this tab only; it was not overwritten."};
  }
 }
 function writeLocal(storage,done,quests){
  try{
   const snapshot=createSnapshot(quests,done,"local");
   storage.setItem(STORE_KEY,JSON.stringify(snapshot.completed_ids));
   return {ok:true,message:"Saved locally in this browser."};
  }catch(e){return {ok:false,message:"Browser storage could not be saved. Your progress remains in this open tab only."};}
 }
 function eraseLocal(storage){
  try{
   storage.removeItem(STORE_KEY);
   return {ok:true,message:"REGEN demo progress was removed from this browser's storage."};
  }catch(e){return {ok:false,message:"Browser storage could not be erased here. No deletion was confirmed."};}
 }
 return Object.freeze({FORMAT,VERSION,STORE_KEY,MAX_BYTES,createSnapshot,parseSnapshot,previewImport,applyImport,readLocal,writeLocal,eraseLocal});
});
