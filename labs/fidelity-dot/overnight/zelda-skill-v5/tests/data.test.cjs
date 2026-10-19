const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const{validate,next}=require('../data.cjs');const base=JSON.parse(fs.readFileSync(path.join(__dirname,'../example-data.json'),'utf8'));let passed=0;
function test(name,fn){fn();passed++;console.log('PASS '+name)}
test('default20',()=>assert.equal(validate(base).items.length,20));
for(const n of [2,3,4,19,20])test('count '+n,()=>{const b=structuredClone(base);b.items=b.items.slice(0,n);b.selectedIndex=n-1;assert.equal(validate(b).items.length,n);assert.equal(next(n-1,1,n),0);assert.equal(next(0,-1,n),n-1)});
for(const n of [0,1,21])test('reject count '+n,()=>{const b=structuredClone(base);b.items=Array.from({length:n},(_,i)=>({...base.items[0],id:''+i}));b.selectedIndex=0;assert.throws(()=>validate(b))});
for(const n of [-1,1.2,10000])test('reject quantity '+n,()=>{const b=structuredClone(base);b.items[0].count=n;assert.throws(()=>validate(b))});
test('long text and unicode preserved',()=>{const b=structuredClone(base);b.items[0].description='Long 中文 🗝️\n'.repeat(1000);assert.equal(validate(b).items[0].description,b.items[0].description)});
test('roundtrip',()=>assert.deepEqual(validate(JSON.parse(JSON.stringify(base))),base));
test('copy isolated',()=>{const b=validate(base);b.items[0].name='OTHER';assert.notEqual(b.items[0].name,base.items[0].name)});
for(const icon of ['https://host/a.png','components/../a.png','/tmp/a.png'])test('unsafe icon '+icon,()=>{const b=structuredClone(base);b.items[0].icon=icon;assert.throws(()=>validate(b))});
test('invalid selection',()=>assert.throws(()=>validate({...base,selectedIndex:20})));
test('duplicate ids',()=>{const b=structuredClone(base);b.items[1].id=b.items[0].id;assert.throws(()=>validate(b))});
console.log(JSON.stringify({passed,browserTested:false}));
