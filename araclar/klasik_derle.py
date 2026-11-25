# -*- coding: utf-8 -*-
"""vendor/ altındaki ES modüllerinden, dosya çift tıklanarak (file://) açıldığında da
çalışan klasik betikler üretir: vendor/three.klasik.js ve vendor/OrbitControls.klasik.js.

Çalıştırma:  python araclar/klasik_derle.py
"""
import io, os, re

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = os.path.join(KOK, 'vendor')

s = io.open(os.path.join(V, 'three.module.min.js'), encoding='utf-8').read()
i = s.rindex('export{')
j = s.index('}', i)
ciftler = []
for parca in s[i + 7:j].split(','):
    parca = parca.strip()
    if not parca:
        continue
    if ' as ' in parca:
        ic, dis = parca.split(' as ')
        ciftler.append('%s:%s' % (dis.strip(), ic.strip()))
    else:
        ciftler.append(parca)
assert 'import ' not in s[:200] and 'import.meta' not in s
klasik = '(function(){"use strict";\n' + s[:i] + '\nwindow.THREE={' + ','.join(ciftler) + '};\n})();\n'
io.open(os.path.join(V, 'three.klasik.js'), 'w', encoding='utf-8', newline='\n').write(klasik)

o = io.open(os.path.join(V, 'addons', 'controls', 'OrbitControls.js'), encoding='utf-8').read()
m = re.search(r"import\s*\{([^}]*)\}\s*from\s*'three';", o)
adlar = [a.strip() for a in m.group(1).split(',') if a.strip()]
o = o[:m.start()] + 'const { ' + ', '.join(adlar) + ' } = window.THREE;' + o[m.end():]
o, n = re.subn(r"export\s*\{\s*OrbitControls\s*\};", 'window.OrbitControls = OrbitControls;', o)
assert n == 1
io.open(os.path.join(V, 'OrbitControls.klasik.js'), 'w', encoding='utf-8', newline='\n').write('(function(){"use strict";\n' + o + '\n})();\n')
print('tamam: %d dışa aktarım' % len(ciftler))
