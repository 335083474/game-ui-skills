/* Pure data contract. Browser and Node share this exact validator. */
(function(root){
function validate(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Expected a data object');
 const text=(s,key)=>{if(typeof s!=='string')throw Error(key+' must be a string');return s;};
 function list(a,min,max,label){if(!Array.isArray(a)||a.length<min||a.length>max)throw Error(label+' requires '+min+'..'+max+' entries');const ids=new Set();return a.map((v)=>{if(!v||typeof v!=='object')throw Error('Invalid entry');const o={};for(const k of ['id','name','icon','description'])o[k]=text(v[k],k);if(!o.id||ids.has(o.id))throw Error('IDs must be unique and nonempty');ids.add(o.id);if(!/^components\/[A-Za-z0-9_./-]+\.png$/.test(o.icon)||o.icon.includes('..'))throw Error('Icon must be a safe relative components/*.png path');if(!Number.isInteger(v.count)||v.count<0||v.count>9999)throw Error('Count must be integer 0..9999');o.count=v.count;return o;});}
 const out={title:text(raw.title,'title'),items:list(raw.items,2,20,'items'),equipment:list(raw.equipment,1,3,'equipment'),selectedIndex:raw.selectedIndex};
 if(!Number.isInteger(out.selectedIndex)||out.selectedIndex<0||out.selectedIndex>=out.items.length)throw Error('selectedIndex out of bounds');return out;
}
function next(i,delta,n){return ((i+delta)%n+n)%n;}
const api={validate,next};if(typeof module!=='undefined')module.exports=api;else root.ZeldaData=api;
})(typeof window==='undefined'?globalThis:window);
