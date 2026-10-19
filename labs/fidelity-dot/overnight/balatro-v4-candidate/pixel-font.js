/* Frozen source masks; integer 1/64 advances. No CSS font or runtime FreeType. */
window.PixelFont=(()=>{const tinted=new Map(),sources={};let diagnostics=[];const {layout,wrap}=createTextLayout(FONT_METRICS);
async function init(){for(const [size,m]of Object.entries(FONT_METRICS.masters)){const im=new Image();im.src='fonts/browser/'+m.atlas;await im.decode();sources[size]=im;}}
function atlas(size,color){const key=size+color;if(!tinted.has(key)){const s=sources[size],c=document.createElement('canvas');c.width=s.width;c.height=s.height;const x=c.getContext('2d');x.drawImage(s,0,0);x.globalCompositeOperation='source-in';x.fillStyle=color;x.fillRect(0,0,c.width,c.height);tinted.set(key,c);}return tinted.get(key);}
function draw(ctx,text,x,y,size=19,color='#f5f4df',center=false,shadow=true){const l=layout(text,size);if(center)x-=Math.floor(l.width/2);x=Math.round(x);y=Math.round(y);diagnostics.push(...l.diagnostics);for(const [col,off]of shadow?[['#142023',2],[color,0]]:[[color,0]]){const a=atlas(size,col);for(const v of l.glyphs){const [sx,sy,w,h]=v.g.rect;ctx.drawImage(a,sx,sy,w,h,x+v.x-l.bounds[0]+off,y+v.y-l.bounds[1]+off,w,h);}}return {x,y,width:l.width+(shadow?2:0),height:l.height+(shadow?2:0)};}

return {init,layout,draw,wrap,resetDiagnostics(){diagnostics=[];},diagnostics(){return diagnostics;}};})();
