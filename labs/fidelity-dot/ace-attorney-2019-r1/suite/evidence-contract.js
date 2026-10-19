(()=>{
"use strict";
const VERSION="AA2019-editable-v0.4";
const ICONS=Object.freeze({
 badge:"assets/badge.png",
 statue:"assets/statue.svg",
 shards:"assets/shards.svg",
 note:"assets/note.svg",
 phone:"assets/phone.svg",
 envelope:"assets/envelope.svg"
});
const idPattern=/^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/;
function fail(message){throw new Error(message);}
function record(value,label){
 if(!value||typeof value!=="object"||Array.isArray(value))fail(label+" must be an object.");
}
function keys(value,expected,label){
 const actual=Object.keys(value);
 if(actual.length!==expected.length||expected.some(k=>!Object.prototype.hasOwnProperty.call(value,k)))
  fail(label+" has missing or unsupported fields.");
}
function text(value,max,label){
 if(typeof value!=="string"||value.length>max)fail(label+" must be a string of at most "+max+" UTF-16 code units.");
 return value;
}
function validate(input){
 record(input,"Document");
 keys(input,["schemaVersion","version","selectedId","items"],"Document");
 if(input.schemaVersion!==1)fail("Unsupported schemaVersion; expected 1.");
 if(input.version!==VERSION)fail("Expected version "+VERSION+".");
 if(!Array.isArray(input.items)||input.items.length>10)fail("items must contain 0 to 10 entries.");
 if(input.selectedId!==null&&(typeof input.selectedId!=="string"||!idPattern.test(input.selectedId)))
  fail("selectedId must be null or a valid item ID.");
 const seen=new Set();
 const items=input.items.map((entry,i)=>{
  const label="items["+i+"]";
  record(entry,label);keys(entry,["id","name","icon","description"],label);
  if(typeof entry.id!=="string"||!idPattern.test(entry.id))fail(label+".id is invalid.");
  if(seen.has(entry.id))fail("Duplicate item ID: "+entry.id);
  seen.add(entry.id);
  if(typeof entry.icon!=="string"||!Object.prototype.hasOwnProperty.call(ICONS,entry.icon))
   fail(label+".icon is not an approved icon key.");
  return {
   id:entry.id,
   name:text(entry.name,300,label+".name"),
   icon:entry.icon,
   description:text(entry.description,20000,label+".description")
  };
 });
 const selectedId=items.length?(seen.has(input.selectedId)?input.selectedId:items[0].id):null;
 return {
  state:{schemaVersion:1,version:VERSION,selectedId,items},
  selectionAdjusted:selectedId!==input.selectedId
 };
}
function parse(raw){
 if(typeof raw!=="string"||raw.length>1000000)fail("JSON text exceeds 1,000,000 UTF-16 code units.");
 let value;
 try{value=JSON.parse(raw);}catch(_){fail("Invalid JSON syntax.");}
 return validate(value);
}
window.AA_EVIDENCE_CONTRACT=Object.freeze({VERSION,ICONS,validate,parse});
})();