"""Explicit UTF-8 AST audit plus GBK-default simulation, not a Windows execution."""
import ast,io,runpy,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
for path in root.rglob('*.py'):
 for node in ast.walk(ast.parse(path.read_text(encoding='utf-8'))):
  if isinstance(node,ast.Call) and isinstance(node.func,ast.Attribute) and node.func.attr in ('read_text','write_text'):
   assert any(k.arg=='encoding' and isinstance(k.value,ast.Constant) and k.value.value=='utf-8' for k in node.keywords),(path,node.lineno)
original=io.open
def gbk_default(file,mode='r',buffering=-1,encoding=None,*args,**kwargs):
 return original(file,mode,buffering,encoding if encoding is not None or 'b' in mode else 'gbk',*args,**kwargs)
io.open=gbk_default
try:
 for relative,args in [('build_spec.py',['--check']),('tests/layout_arithmetic.py',[])]:
  sys.argv=[str(root/relative),*args]
  runpy.run_path(str(root/relative),run_name='__main__')
finally:io.open=original
print('PASS: explicit UTF-8 audit and simulated GBK default for build check/layout reads')
