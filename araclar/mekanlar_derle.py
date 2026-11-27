# -*- coding: utf-8 -*-
"""araclar/mekanlar.json -> js/mekanlar.js

İlgi alanı kataloğundaki yerleri (restoran, AVM, müze, park...) denetler ve sayfanın okuyacağı
js/mekanlar.js dosyasını yazar. Konumları 3B haritaya araclar/cografya.py yerleştirir; bu yüzden
yeni yer ekledikten sonra önce bu betiği, sonra cografya.py'yi çalıştırın.

    python araclar/mekanlar_derle.py [araştırma.json ...]

Argüman olarak verilen JSON dizileri araclar/mekanlar.json'a eklenir (aynı kimlik varsa güncellenir).
Denetim: kimlik tekliği, koordinatın on ilçeden birinde olması (ilceler.geojson varsa ilçe adı da
geometriye göre düzeltilir), tür ve ilgi alanlarının bilinmesi.
"""
import io, json, os, re, sys

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KAYNAK = os.path.join(KOK, 'araclar', 'mekanlar.json')
ILCELER = ['Konak', 'Çiğli', 'Karşıyaka', 'Bayraklı', 'Bornova', 'Buca', 'Gaziemir', 'Karabağlar', 'Balçova', 'Narlıdere']
ADLAR = {'KONAK': 'Konak', 'BALÇOVA': 'Balçova', 'KARABAĞLAR': 'Karabağlar', 'BUCA': 'Buca', 'GAZİEMİR': 'Gaziemir',
         'BAYRAKLI': 'Bayraklı', 'NARLIDERE': 'Narlıdere', 'KARŞIYAKA': 'Karşıyaka', 'ÇİĞLİ': 'Çiğli', 'BORNOVA': 'Bornova'}
TURLER = {'restoran', 'meyhane', 'balik', 'kahvalti', 'kafe', 'pastane', 'sokak', 'gece', 'pazar', 'carsi', 'avm', 'outlet',
          'stadyum', 'salon', 'sahne', 'sinema', 'spor', 'lunapark', 'marina', 'muze', 'galeri', 'kultur-merkezi', 'bilim',
          'cami', 'kilise', 'sinagog', 'kosk', 'han', 'antik', 'park', 'orman', 'bahce', 'sahil', 'oyun', 'hayvan'}
ILGILER = {'tarih', 'muze', 'yeme', 'alisveris', 'eglence', 'doga', 'cocuk'}
ALANLAR = ('id', 'ad', 'tur', 'kategori', 'ilce', 'semt', 'yil', 'aciklama', 'ilgi', 'web', 'webTur', 'alan')


def icinde(x, y, halka):
    ic = False
    j = len(halka) - 1
    for i in range(len(halka)):
        xi, yi = halka[i]
        xj, yj = halka[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            ic = not ic
        j = i
    return ic


def ilce_bulucu():
    yol = os.path.join(KOK, 'ilceler.geojson')
    if not os.path.exists(yol):
        return None
    veri = json.load(io.open(yol, encoding='utf-8'))
    parcalar = []
    for f in veri['features']:
        ad = ADLAR.get(f['properties']['adi'])
        g = f['geometry']
        halkalar = [g['coordinates'][0]] if g['type'] == 'Polygon' else [p[0] for p in g['coordinates']]
        parcalar += [(ad, h) for h in halkalar]
    return lambda lon, lat: next((ad or '?' for ad, h in parcalar if icinde(lon, lat, h)), None)


def main():
    liste = json.load(io.open(KAYNAK, encoding='utf-8')) if os.path.exists(KAYNAK) else []
    sira = {m['id']: i for i, m in enumerate(liste)}
    for yol in sys.argv[1:]:
        for m in json.load(io.open(yol, encoding='utf-8-sig')):
            if m['id'] in sira:
                liste[sira[m['id']]].update(m)
            else:
                sira[m['id']] = len(liste)
                liste.append(m)

    veri_js = io.open(os.path.join(KOK, 'js', 'veri.js'), encoding='utf-8').read()
    simgeler = set(re.findall(r"\n    id: '([^']+)'", veri_js))
    bul = ilce_bulucu()
    temiz, sorun = [], []
    for m in liste:
        k = m['id']
        if k in simgeler:
            sorun.append('%s: simge yapılarda zaten var, atlandı' % k)
            continue
        if m.get('tur') not in TURLER:
            sorun.append('%s: bilinmeyen tür %r' % (k, m.get('tur')))
            continue
        m['ilgi'] = [i for i in dict.fromkeys(m.get('ilgi') or []) if i in ILGILER]
        if bul:
            gercek = bul(m['lon'], m['lat'])
            if gercek is None and m['tur'] in ('sahil', 'marina') and m.get('ilce') in ILCELER:
                gercek = m['ilce']  # denizdeki nokta (iskele, marina): kıyıya cografya.py oturtur
            if gercek not in ILCELER:
                sorun.append('%s: koordinat on ilçenin dışında (%s), atlandı' % (k, gercek))
                continue
            if gercek != m.get('ilce'):
                sorun.append('%s: ilçe %s -> %s' % (k, m.get('ilce'), gercek))
                m['ilce'] = gercek
        if not m.get('web'):
            m['web'] = None
        temiz.append(m)
    io.open(KAYNAK, 'w', encoding='utf-8', newline='\n').write(json.dumps(liste, ensure_ascii=False, indent=1) + '\n')

    cikti = []
    for m in temiz:
        o = {a: m[a] for a in ALANLAR if m.get(a) not in (None, '')}
        o.setdefault('alan', 2.9)
        cikti.append(o)
    js = ('// Bu dosya araclar/mekanlar_derle.py tarafından araclar/mekanlar.json dosyasından üretilir; elle düzenlemeyin.\n'
          '// İlgi alanı kataloğundaki yerler. Konumlarını araclar/cografya.py yerleştirir (IZ.COG.konum).\n'
          'window.IZ = window.IZ || {};\nIZ.MEKANLAR = ' + json.dumps(cikti, ensure_ascii=False, indent=0).replace('\n', '') + ';\n')
    js = js.replace('}, {', '},\n{')
    io.open(os.path.join(KOK, 'js', 'mekanlar.js'), 'w', encoding='utf-8', newline='\n').write(js)
    print('yer:', len(cikti), '· sorun:', len(sorun))
    for s in sorun:
        print('  ' + s)


if __name__ == '__main__':
    main()
