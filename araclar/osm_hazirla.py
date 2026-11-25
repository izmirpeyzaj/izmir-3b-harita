# -*- coding: utf-8 -*-
"""Overpass'tan indirilen ham OSM yanıtını (osm_ham.json) küçük bir dosyaya indirger: araclar/osm_yollar.json

Sorgu (kutu: 38.24,26.84,38.60,27.40):
  way[highway~^(motorway|trunk|primary|secondary)$]; way[railway~^(rail|tram|light_rail)$][service!~.]; out geom tags;
Veri (c) OpenStreetMap katkıcıları, ODbL.

Çalıştırma:  python araclar/osm_hazirla.py <osm_ham.json>
"""
import io, json, os, sys

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ham = json.load(io.open(sys.argv[1], encoding='utf-8'))
SINIF = {'motorway': 'otoyol', 'trunk': 'otoyol', 'primary': 'cadde', 'secondary': 'sokak'}
cikti, say = [], {}
for e in ham['elements']:
    if e.get('type') != 'way' or 'geometry' not in e:
        continue
    t = e.get('tags', {})
    if t.get('tunnel') in ('yes', 'building_passage') or t.get('location') == 'underground':
        continue
    if 'highway' in t:
        s = SINIF.get(t['highway'])
    elif t.get('railway') == 'tram':
        s = 'tramvay'
    elif t.get('railway') in ('rail', 'light_rail'):
        s = 'tren'
    else:
        s = None
    if not s:
        continue
    say[s] = say.get(s, 0) + 1
    cikti.append([s, [[round(p['lon'], 5), round(p['lat'], 5)] for p in e['geometry']]])
io.open(os.path.join(KOK, 'araclar', 'osm_yollar.json'), 'w', encoding='utf-8', newline='\n').write(json.dumps(cikti, separators=(',', ':')))
print(say, 'toplam nokta:', sum(len(c[1]) for c in cikti))
