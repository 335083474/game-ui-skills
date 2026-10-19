"""Regenerate runtime font bindings from edited local canonical arrays."""
from pathlib import Path
import runpy,shutil
R=Path(__file__).resolve().parent;G=R/'sources/glyphs'
runpy.run_path(str(G/'build_fonts.py'))
shutil.copyfile(G/'font_compat.json',G/'glyph_arrays.json')
shutil.copyfile(G/'font_data.js',R/'font-data.js')
print('Updated local runtime font-data.js and offline compatibility arrays')
