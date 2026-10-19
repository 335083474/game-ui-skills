const fs=require('fs'),path=require('path'),R=__dirname,M=require('./model.js'),S=require('./scene.js'),F=require('./text-layout.js')(JSON.parse(fs.readFileSync(path.join(R,'fonts/canonical/canonical_metrics.json'),'utf8'))),d=JSON.parse(fs.readFileSync(path.join(R,'example-data.json'),'utf8'));
for(const screen of ['shop','collection']){const scene=S.build(M.create(d,screen),F);fs.writeFileSync(path.join(R,'output',screen+'-commands.json'),JSON.stringify(scene,null,2)+'\n','utf8');}
console.log('Exported both scenes from the same scene.js builder used by runtime.');
