window.ACNH_POCKETS_DATA={
 schemaVersion:1,version:'ACNH-pockets-v0.1',selectedId:'item-40',
 items:Array.from({length:40},(_,i)=>{
  const tools={0:['shovel','Shovel'],1:['axe','Axe'],2:['slingshot','Slingshot'],4:['wateringCan','Watering can'],5:['fishingRod','Fishing rod'],10:['ladder','Ladder'],11:['net','Net']};
  const t=tools[i];
  return {id:'item-'+(i+1),slot:i,name:t?t[1]:'Scorpion',icon:t?t[0]:'scorpion',quantity:1,dimmed:!!t,description:t?'Muted tool shown for the reference state. This label is demonstration data.':'Newly generated replacement scorpion icon. This description is demonstration text, not an official species guide.'};
 })
};