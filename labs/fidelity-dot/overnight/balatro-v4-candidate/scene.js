(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BalatroScene=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';const palette={panel:'#2b383d',sidebar:'#29363a',rail:'#425e66',red:'#ff4c40',green:'#2ebc87',blue:'#009fdd',orange:'#efa500',gold:'#f7c253',white:'#f5f4df',ink:'#172426'};
const shopSlots=[[536,220,90,122],[640,220,90,122],[407,417,78,122],[592,399,96,151],[702,399,96,151]];const prices=[[580,193],[680,193],[447,386],[638,374],[745,374]];
function build(s,F){const commands=[],hits=[],notes=[];const col=c=>palette[c]||c;const panel=(x,y,w,h,fill='panel',border=null,r=8)=>commands.push({type:'panel',x,y,w,h,fill:col(fill),border:border&&col(border),radius:r});const image=(src,x,y,w,h)=>commands.push({type:'image',src,x,y,w,h});
function text(value,x,y,size=19,color='white',center=false){const v=String(value),m=F.layout(v,size);commands.push({type:'text',text:v,x:Math.round(x-(center?m.width/2:0)),y:Math.round(y),size,color:col(color),width:m.width,height:m.height});}
function fit(value,x,y,width,height,size=48,color='white',align='center'){const sizes=[48,40,32,26,24,22,20,19,18,16].filter(n=>n<=size);let chosen=sizes.find(n=>{const m=F.layout(String(value),n);return m.width+2<=width&&m.height+2<=height;});if(!chosen){notes.push('Text exceeds numeric box: '+value);text('?',x+width/2,y+4,19,color,true);return;}const m=F.layout(String(value),chosen);text(value,align==='left'?x:align==='right'?x+width-m.width-2:x+(width-m.width)/2,y+(height-m.height)/2,chosen,color);}
function button(id,label,x,y,w,h,color='red',enabled=true){panel(x,y,w,h,enabled?color:'rail');fit(label,x+4,y+5,w-8,h-10,19);hits.push({id,x,y,w,h,label,enabled});}
function card(item,index,box,kind){const [x,y,w,h]=box;image(item.icon,x,y,w,h);if(kind===s.screen&&index===s.selected)commands.push({type:'outline',x:x-5,y:y-5,w:w+10,h:h+10,color:'#f7c253',width:3});if(item.sold&&kind==='shop'){panel(x,y+h-28,w,28,'ink');text('SOLD',x+w/2,y+h-22,19,'gold',true);}hits.push({id:'select:'+kind+':'+index,x,y,w,h,label:item.name,enabled:true});}
image('components/background.png',0,0,1024,576);
panel(13,-5,240,590,'sidebar','red',0);panel(18,38,230,154,'panel','red',11);image('components/shop-marquee.png',33,50,200,100);const tag=F.wrap(s.data.title,216,26);text(tag[0]||'',133,162,26,'gold',true);if(tag.length>1)notes.push('Title exceeds one visible line; full title in editor/details');
panel(18,207,230,41);panel(88,210,155,34,'sidebar');text('Round',32,213);text('score',32,229);image('components/score-chip.png',143,215,24,24);text('0',172,215,32);
panel(18,254,230,116,'ink');panel(25,312,94,47,'blue');panel(147,312,94,47,'red');fit('0',33,318,78,35,48,'white','right');fit('0',155,318,78,35,48,'white','left');fit('×',121,318,24,35,48,'red');
button('details','Details',26,384,70,81);button('editor','Edit',26,475,70,80,'orange');
for(const b of[[107,380,68,53],[181,380,67,53],[107,444,141,53],[107,507,68,53],[181,507,67,53]])panel(...b);
for(const b of[[112,399,57,30],[186,399,57,30],[112,448,130,44],[112,528,57,29],[186,528,57,29]])panel(...b,'sidebar');
for(const [v,x,y]of[['Hands',141,384],['Discards',214,384],['Ante',141,510],['Round',215,510]])text(v,x,y,18,'white',true);
text('4',141,404,32,'blue',true);text('3',215,404,32,'red',true);fit('$'+s.data.cash,116,453,122,39,48,'gold');text('3',131,530,32,'orange',true);text('/8',151,537,19);text('1',215,530,32,'orange',true);
const list=s.data[s.screen==='shop'?'products':'collection'],selected=list[s.selected];
if(s.screen==='shop'){
 s.data.collection.slice(0,5).forEach((a,i)=>card(a,i,[[266,392,520,648,821][i],18,i===4?78:88,120],'collection'));
 text(s.data.runStats.jokersUsed+'/'+s.data.runStats.jokersMax,273,144,18);text(s.data.runStats.consumablesUsed+'/'+s.data.runStats.consumablesMax,937,144,18,'white',true);
 panel(282,188,552,388,'ink','red',10);panel(288,194,540,377);panel(435,201,386,160,'rail');panel(304,389,258,166,'rail');panel(311,396,244,152);panel(570,389,244,166,'rail');
 button('collection','Collection',299,205,131,69);button('reroll','Reroll $'+s.data.rerollPrice,299,280,131,74,'green');
 const page=Math.floor(s.selected/5);list.slice(page*5,page*5+5).forEach((a,j)=>{card(a,page*5+j,shopSlots[j],'shop');const [x,y]=prices[j];panel(x-27,y-5,54,30,'sidebar','#111d20');fit('$'+a.price,x-24,y,48,23,24,'gold');if(a.icon==='components/voucher.png')text('VOUCHER',446,430,16,'#465971',true);});
 image('components/deck.png',866,425,98,137);text('52/52',913,557,18,'white',true);
 button('prev','<',850,370,48,35,'rail',page>0);button('next','>',916,370,48,35,'rail',(page+1)*5<list.length);text((page+1)+'/'+Math.ceil(list.length/5),908,344,18,'white',true);
}else{
 panel(275,20,731,540,'ink','red',12);text('Owned cards',300,39,32,'gold');button('shop','Back to shop',812,36,175,42,'red');text(list.length+' entries',300,80,19);
 const page=Math.floor(s.selected/8);list.slice(page*8,page*8+8).forEach((a,j)=>{const x=300+(j%4)*113,y=119+Math.floor(j/4)*190;card(a,page*8+j,[x,y,80,112],'collection');fit('x'+a.count,x,y+116,80,22,19,'gold');const lines=F.wrap(a.name,95,16);for(let k=0;k<Math.min(2,lines.length);k++)text(lines[k],x,y+143+k*17,16);if(lines.length>2)text('...',x+80,y+160,16);});
 button('prev','Previous',300,511,145,32,'rail',page>0);button('next','Next',586,511,145,32,'rail',(page+1)*8<list.length);text((page+1)+'/'+Math.max(1,Math.ceil(list.length/8)),516,519,19,'white',true);
 if(!list.length)text('Empty collection. Buy an item in the shop.',310,175,19);
}
const dx=s.screen==='shop'?850:770,dy=s.screen==='shop'?188:105,dw=s.screen==='shop'?150:215,dh=s.screen==='shop'?145:345;
panel(dx,dy,dw,dh,'ink');if(selected){const lines=F.wrap(selected.name+'\n'+selected.description,dw-16,16),per=Math.floor((dh-48)/19),pages=Math.max(1,Math.ceil(lines.length/per)),p=Math.min(s.detailPage,pages-1);lines.slice(p*per,p*per+per).forEach((line,i)=>text(line,dx+8,dy+9+i*19,16));text((p+1)+'/'+pages,dx+dw/2,dy+dh-32,16,'gold',true);hits.push({id:'detail-next',x:dx,y:dy,w:dw,h:dh,label:'Next description page',enabled:pages>1});notes.push('descriptionPages:'+pages);if(s.screen==='collection')button('details','Full text',dx,461,dw,38,'green');}
const brief=F.wrap(selected?selected.name:'No selection',210,16);brief.slice(0,2).forEach((line,i)=>text(line,28,264+i*19,16,'gold'));
return {width:1024,height:576,commands,hits,notes,descriptionPages:Number((notes.find(x=>x.startsWith('descriptionPages:'))||'descriptionPages:1').split(':')[1])};}
return {build,palette,shopSlots};});
