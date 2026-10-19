/* Browser/CommonJS helper. Supply parsed font_arrays.json; no fonts/network fetched here. */
function layoutText(text, data, options = {}) {
 const name=options.font || 'display6', font=data.fonts[name];
 const maxWidth=options.maxWidth ?? null, pageHeight=options.pageHeight ?? null;
 if (maxWidth!==null && maxWidth<1) throw new Error('maxWidth must be positive');
 if (pageHeight!==null && pageHeight<1) throw new Error('pageHeight must be positive');
 const maxLines=pageHeight ? Math.max(1,Math.floor(pageHeight/font.lineHeight)):null;
 const chars=Array.from(text), records=[], diagnostics=[]; let x=0,line=0,page=0;
 function nextLine(){x=0;line++;if(maxLines && line>=maxLines){page++;line=0;}}
 chars.forEach((char,index)=>{
  if(char==='\r'||char==='\n'){
   records.push({kind:'control',index,source:char,page,line});
   if(char==='\n'||index+1===chars.length||chars[index+1]!=='\n')nextLine();
   return;
  }
  const rendered=Object.prototype.hasOwnProperty.call(font.glyphs,char)?char:font.fallback;
  if(rendered!==char)diagnostics.push({code:'UNSUPPORTED_GLYPH',index,source:char,codepoint:'U+'+char.codePointAt(0).toString(16).toUpperCase().padStart(4,'0'),fallback:rendered,message:'Unsupported character; visible fallback used'});
  const glyph={...font.glyphs[rendered]};
  if(options.liftSeparator && name==='display6' && char==='.')Object.assign(glyph,{advance:0,bearingX:-1});
  if(maxWidth && x && x+glyph.advance>maxWidth)nextLine();
  if(maxWidth && glyph.advance>maxWidth)diagnostics.push({code:'GLYPH_EXCEEDS_LINE_WIDTH',index,source:char,message:'Glyph preserved; render canvas expands to avoid clipping'});
  records.push({kind:'glyph',index,source:char,rendered,page,line,x,y:line*font.lineHeight,width:glyph.width,advance:glyph.advance,bearingX:glyph.bearingX,bearingY:glyph.bearingY});
  x+=glyph.advance;
 });
 return {text,font:name,maxWidth,pageHeight,lineHeight:font.lineHeight,pageCount:page+1,records,diagnostics,inputPreserved:records.map(r=>r.source).join('')===text};
}
function renderPage(canvas,layout,data,page=0,foreground='#f8f8f0',background='#000000'){
 const font=data.fonts[layout.font],records=layout.records.filter(r=>r.page===page&&r.kind==='glyph');
 const offset=-Math.min(0,...records.map(r=>r.x+r.bearingX));
 canvas.width=Math.max(1,layout.maxWidth||1,...records.map(r=>r.x+r.bearingX+r.width))+offset;
 canvas.height=Math.max(font.height,layout.pageHeight||font.height,...records.map(r=>r.y+r.bearingY+font.height));
 const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.fillStyle=background;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=foreground;
 for(const r of records)font.glyphs[r.rendered].rows.forEach((row,yy)=>Array.from(row).forEach((v,xx)=>{if(v==='1')ctx.fillRect(r.x+r.bearingX+xx+offset,r.y+r.bearingY+yy,1,1);}));
 return {width:canvas.width,height:canvas.height,diagnostics:layout.diagnostics};
}
if(typeof module!=='undefined')module.exports={layoutText,renderPage};
if(typeof window!=='undefined')window.PixelFont={layoutText,renderPage};
