# -*- coding: utf-8 -*-
"""ilceler.geojson + araclar/koordinat.json -> js/cografya.js

3B haritanın kıyısını, ilçe parçalarını, yerlerin konumlarını, caddeleri ve tepeleri
gerçek coğrafyadan üretir. Merkez (Konak) büyütülür, uzaklar sıkıştırılır ("balık gözü"):
yönler ve komşuluklar gerçektir, uzaklıklar değildir.

Çalıştırma:  python araclar/cografya.py
"""
import io, json, math, os, re

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LON0, LAT0 = 27.1287, 38.4189          # Konak Meydanı
A, B = 46.0, 1.0                        # r' = A * ln(1 + r/B), r km
KX, KY = 111.32 * math.cos(math.radians(LAT0)), 110.57
KUTU = (-155.0, -147.0, 129.0, 129.0)   # dönüştürülmüş birimlerde harita penceresi
IZGARA = 0.4
ILCELER = ['Konak', 'Çiğli', 'Karşıyaka', 'Bayraklı', 'Bornova', 'Buca', 'Gaziemir', 'Karabağlar', 'Balçova', 'Narlıdere']
ADLAR = {'KONAK': 'Konak', 'BALÇOVA': 'Balçova', 'KARABAĞLAR': 'Karabağlar', 'BUCA': 'Buca', 'GAZİEMİR': 'Gaziemir',
         'BAYRAKLI': 'Bayraklı', 'NARLIDERE': 'Narlıdere', 'KARŞIYAKA': 'Karşıyaka', 'ÇİĞLİ': 'Çiğli', 'BORNOVA': 'Bornova'}
KIYI_YERLERI = {'konak-pier', 'pasaport', 'karsiyaka-iskele', 'bostanli', 'kus-cenneti', 'deniz-muzesi', 'sahilevleri'}
KIYI_GERISI = {'ataturk-aniti': 8.0}  # kıyıdan içeri uzaklık (birim): Cumhuriyet Meydanı, Kordon
EK_YARICAP = {'teleferik': 11.0, 'asansor': 12.5, 'kadifekale': 21.0, 'havalimani': 12.5, 'cumhuriyet-agaci': 4.6, 'konak-pier': 12.0, 'pasaport': 9.0, 'karsiyaka-iskele': 10.4, 'zubeyde-hanim': 7.8, 'basmane-gari': 9.0, 'latife-kosku': 6.6, 'bostanli': 7.5, 'deniz-muzesi': 8.0, 'sahilevleri': 8.0,
              'ataturk-aniti': 7.4, 'ataturk-muzesi': 6.4, 'alsancak-gari': 7.4, 'kulturpark': 9.2, 'havagazi': 6.8, 'polikarp': 6.6,
              'yali-camii': 4.0, 'kizlaragasi': 6.4, 'kemeralti': 5.6, 'elhamra': 5.4, 'hisar-camii': 6.2}

# Ana caddeler ve tramvay (boylam, enlem)
CADDELER = [
    [(27.1320, 38.4215), (27.1440, 38.4255), (27.1560, 38.4300), (27.1680, 38.4340), (27.1900, 38.4470), (27.2150, 38.4600)],
    [(27.1300, 38.4150), (27.1250, 38.4020), (27.1260, 38.3850), (27.1300, 38.3600), (27.1350, 38.3300), (27.1480, 38.3020)],
    [(27.1440, 38.4255), (27.1500, 38.4050), (27.1620, 38.3920), (27.1780, 38.3870)],
    [(27.1680, 38.4340), (27.1720, 38.4600), (27.1450, 38.4830), (27.1000, 38.4870), (27.0600, 38.4980), (27.0150, 38.4990), (26.9750, 38.4960)],
    [(27.1230, 38.4090), (27.0900, 38.3990), (27.0550, 38.3930), (27.0150, 38.3940), (26.9850, 38.3950)],
]
TRAMVAY2 = [(27.1400, 38.4720), (27.1200, 38.4725), (27.0980, 38.4735), (27.0780, 38.4790), (27.0600, 38.4880)]
TEPELER = [  # boylam, enlem, yarıçap, yükseklik
    (27.200, 38.545, 26, 20), (27.120, 38.530, 22, 16), (27.030, 38.535, 18, 12), (27.300, 38.470, 22, 17),
    (27.290, 38.420, 20, 15), (27.260, 38.370, 20, 14), (27.220, 38.330, 18, 12), (27.040, 38.355, 22, 18),
    (26.980, 38.350, 22, 17), (27.070, 38.330, 18, 13), (26.930, 38.380, 16, 11), (27.080, 38.270, 18, 12),
    (27.220, 38.280, 18, 12), (27.160, 38.570, 22, 15), (27.340, 38.520, 22, 16), (27.330, 38.330, 20, 13),
    (26.950, 38.300, 20, 14), (27.000, 38.560, 18, 11),
]
SEMTLER = [('KONAK', 27.128, 38.408), ('ALSANCAK', 27.143, 38.437), ('BAYRAKLI', 27.165, 38.462), ('BORNOVA', 27.220, 38.470),
           ('KARŞIYAKA', 27.115, 38.468), ('ÇİĞLİ', 27.030, 38.495), ('BUCA', 27.175, 38.378), ('GAZİEMİR', 27.135, 38.320),
           ('KARABAĞLAR', 27.105, 38.375), ('BALÇOVA', 27.050, 38.392), ('NARLIDERE', 27.000, 38.397), ('KÖRFEZ', 27.070, 38.435)]


def cog(lon, lat):
    x, y = (lon - LON0) * KX, (lat - LAT0) * KY
    r = math.hypot(x, y)
    if r < 1e-9:
        return (0.0, 0.0)
    f = A * math.log(1 + r / B) / r
    return (x * f, y * f)


def yogunlastir(h, adim=0.004):
    c = []
    for i in range(len(h)):
        a, b = h[i], h[(i + 1) % len(h)]
        n = max(1, int(math.ceil(math.hypot(b[0] - a[0], b[1] - a[1]) / adim)))
        n = min(n, 60)
        for k in range(n):
            c.append((a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n))
    return c


def kirp(h, kutu):
    x0, y0, x1, y1 = kutu
    def tek(h, ic, kes):
        c = []
        for i in range(len(h)):
            a, b = h[i], h[(i + 1) % len(h)]
            ia, ib = ic(a), ic(b)
            if ia:
                c.append(a)
            if ia != ib:
                c.append(kes(a, b))
        return c
    def kx(x):
        return lambda a, b: (x, a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]))
    def ky(y):
        return lambda a, b: (a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]), y)
    for ic, kes in ((lambda p: p[0] >= x0, kx(x0)), (lambda p: p[0] <= x1, kx(x1)), (lambda p: p[1] >= y0, ky(y0)), (lambda p: p[1] <= y1, ky(y1))):
        if not h:
            break
        h = tek(h, ic, kes)
    return h


def temizle(h):
    h = [(round(p[0] / IZGARA) * IZGARA, round(p[1] / IZGARA) * IZGARA) for p in h]
    degisti = True
    while degisti and len(h) >= 3:
        degisti = False
        c = []
        n = len(h)
        for i in range(n):
            a, p, b = h[i - 1], h[i], h[(i + 1) % n]
            if p == a:
                degisti = True
                continue
            if a == b:
                degisti = True
                continue
            if abs((p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0])) < 1e-9 and (p[0] - a[0]) * (b[0] - p[0]) + (p[1] - a[1]) * (b[1] - p[1]) > 0:
                degisti = True
                continue
            c.append(p)
        h = c
    return h if len(h) >= 3 else []


def main():
    veri = json.load(io.open(os.path.join(KOK, 'ilceler.geojson'), encoding='utf-8'))
    koordinat = json.load(io.open(os.path.join(KOK, 'araclar', 'koordinat.json'), encoding='utf-8'))
    veri_js = io.open(os.path.join(KOK, 'js', 'veri.js'), encoding='utf-8').read()
    yaricap = {m.group(1): float(m.group(2)) for m in re.finditer(r"id: '([^']+)'[\s\S]*?alan: ([\d.]+)", veri_js)}
    yaricap.update(EK_YARICAP)

    # ---- İlçe parçaları ----
    parcalar = []  # (kod, ad, halka)
    for f in veri['features']:
        ad = ADLAR.get(f['properties']['adi'])
        g = f['geometry']
        halkalar = [g['coordinates'][0]] if g['type'] == 'Polygon' else [p[0] for p in g['coordinates']]
        for h in halkalar:
            h = [(c[0], c[1]) for c in h]
            if h[0] == h[-1]:
                h = h[:-1]
            h = [cog(*p) for p in yogunlastir(h)]
            h = temizle(kirp(h, KUTU))
            if h:
                parcalar.append((ILCELER.index(ad) + 1 if ad else 11, ad or '', h))

    # ---- Arazi ızgarası (1 birim) ----
    x0, y0, x1, y1 = [int(v) for v in KUTU]
    W, H = x1 - x0, y1 - y0
    arazi = [[0] * W for _ in range(H)]
    for kod, ad, h in parcalar:
        n = len(h)
        ys = [p[1] for p in h]
        for j in range(max(0, int(min(ys) - y0) - 1), min(H, int(max(ys) - y0) + 2)):
            yc = y0 + j + 0.5
            ks = []
            for i in range(n):
                a, b = h[i], h[(i + 1) % n]
                if (a[1] > yc) != (b[1] > yc):
                    ks.append(a[0] + (b[0] - a[0]) * (yc - a[1]) / (b[1] - a[1]))
            ks.sort()
            for k in range(0, len(ks) - 1, 2):
                for i in range(max(0, int(math.ceil(ks[k] - x0 - 0.5))), min(W, int(math.floor(ks[k + 1] - x0 - 0.5)) + 1)):
                    if arazi[j][i] == 0 or kod < 11:
                        arazi[j][i] = kod

    # İlçe sınırları arasındaki çatlakları kapat: iki yanında kara olan dar boşluklar karadır
    for _ in range(3):
        yeni = [r[:] for r in arazi]
        for j in range(H):
            for i in range(W):
                if arazi[j][i]:
                    continue
                def kara(dj, di):
                    for k in (1, 2):
                        jj, ii = j + dj * k, i + di * k
                        if 0 <= jj < H and 0 <= ii < W and arazi[jj][ii]:
                            return arazi[jj][ii]
                    return 0
                for (d1, d2) in (((0, -1), (0, 1)), ((-1, 0), (1, 0)), ((-1, -1), (1, 1)), ((-1, 1), (1, -1))):
                    k1, k2 = kara(*d1), kara(*d2)
                    if k1 and k2:
                        yeni[j][i] = min(k1, k2)
                        break
        arazi = yeni
    # Körfeze bağlı olmayan boşluklar da karadır
    sx, sy = cog(27.07, 38.435)
    deniz = [[False] * W for _ in range(H)]
    yigin = [(int(sy - y0), int(sx - x0))]
    assert arazi[yigin[0][0]][yigin[0][1]] == 0, 'körfez tohumu karada'
    while yigin:
        j, i = yigin.pop()
        if not (0 <= j < H and 0 <= i < W) or deniz[j][i] or arazi[j][i]:
            continue
        deniz[j][i] = True
        yigin.extend(((j + 1, i), (j - 1, i), (j, i + 1), (j, i - 1)))
    for j in range(H):
        for i in range(W):
            if not arazi[j][i] and not deniz[j][i]:
                arazi[j][i] = 11

    def kod(x, y):
        i, j = int(math.floor(x - x0)), int(math.floor(y - y0))
        return arazi[j][i] if 0 <= i < W and 0 <= j < H else -1

    # Kıyıya işaretli uzaklık (karada +, denizde -; yaklaşık, hücre birimi)
    BUYUK = 1e9
    def uzaklik(kaynak):
        u = [[0.0 if kaynak(arazi[j][i]) else BUYUK for i in range(W)] for j in range(H)]
        for gecis in (1, -1):
            for j in (range(H) if gecis == 1 else range(H - 1, -1, -1)):
                for i in (range(W) if gecis == 1 else range(W - 1, -1, -1)):
                    d = u[j][i]
                    for dj, di, w in ((-gecis, 0, 1.0), (0, -gecis, 1.0), (-gecis, -gecis, 1.414), (-gecis, gecis, 1.414)):
                        jj, ii = j + dj, i + di
                        if 0 <= jj < H and 0 <= ii < W and u[jj][ii] + w < d:
                            d = u[jj][ii] + w
                    u[j][i] = d
        return u
    ud, uk = uzaklik(lambda k: k == 0), uzaklik(lambda k: k != 0)
    uz = [[ud[j][i] if arazi[j][i] else -uk[j][i] for i in range(W)] for j in range(H)]

    def denize(x, y):
        fx, fy = x - x0 - 0.5, y - y0 - 0.5
        i, j = int(math.floor(fx)), int(math.floor(fy))
        i, j = max(0, min(W - 2, i)), max(0, min(H - 2, j))
        tx, ty = min(1, max(0, fx - i)), min(1, max(0, fy - j))
        return (uz[j][i] * (1 - tx) + uz[j][i + 1] * tx) * (1 - ty) + (uz[j + 1][i] * (1 - tx) + uz[j + 1][i + 1] * tx) * ty

    # ---- Kıyı zincirleri ----
    def zincirler(h):
        n = len(h)
        kiyi = []
        for i in range(n):
            a, b = h[i], h[(i + 1) % n]
            L = math.hypot(b[0] - a[0], b[1] - a[1])
            mx, my, nx, ny = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, -(b[1] - a[1]) / L, (b[0] - a[0]) / L
            kiyi.append(kod(mx + nx * 1.3, my + ny * 1.3) == 0 or kod(mx - nx * 1.3, my - ny * 1.3) == 0)
        if any(kiyi) and not all(kiyi):
            i = next(i for i in range(n) if kiyi[i] and not kiyi[i - 1])
            k = 0
            while k < n:
                if not kiyi[(i + k) % n]:
                    m, L = k, 0.0
                    while m < n and not kiyi[(i + m) % n]:
                        p, q = h[(i + m) % n], h[(i + m + 1) % n]
                        L += math.hypot(q[0] - p[0], q[1] - p[1])
                        m += 1
                    if L < 7:
                        for t in range(k, m):
                            kiyi[(i + t) % n] = True
                    k = m
                else:
                    k += 1
        if all(kiyi) or not any(kiyi):
            return []
        bas = next(i for i in range(n) if kiyi[i] and not kiyi[i - 1])
        c, z = [], None
        for k in range(n):
            i = (bas + k) % n
            if kiyi[i]:
                if z is None:
                    z = [h[i]]
                z.append(h[(i + 1) % n])
            elif z is not None:
                c.append(z)
                z = None
        if z is not None:
            c.append(z)
        return c

    def dp(p, eps):
        tut = [False] * len(p)
        tut[0] = tut[-1] = True
        yigin = [(0, len(p) - 1)]
        while yigin:
            a, b = yigin.pop()
            if b <= a + 1:
                continue
            ax, ay = p[a]
            dx, dy = p[b][0] - ax, p[b][1] - ay
            L = math.hypot(dx, dy)
            m, mi = 0, -1
            for i in range(a + 1, b):
                d = abs((p[i][0] - ax) * dy - (p[i][1] - ay) * dx) / L if L > 1e-9 else math.hypot(p[i][0] - ax, p[i][1] - ay)
                if d > m:
                    m, mi = d, i
            if m > eps:
                tut[mi] = True
                yigin.append((a, mi))
                yigin.append((mi, b))
        return [q for q, t in zip(p, tut) if t]

    def boy(z):
        return sum(math.hypot(z[i + 1][0] - z[i][0], z[i + 1][1] - z[i][1]) for i in range(len(z) - 1))

    kiyilar = {}
    tum_kiyi = []
    for kd, ad, h in parcalar:
        for z in zincirler(h):
            if boy(z) < 6:
                continue
            tum_kiyi.append(z)
            if ad:
                kiyilar.setdefault(ad, []).append(z)
    kiyi_cikti = {ad: [dp(z, 0.7) for z in sorted(zs, key=boy, reverse=True) if boy(z) > 12] for ad, zs in kiyilar.items()}
    kiyi_noktalari = []
    for z in tum_kiyi:
        for i in range(len(z) - 1):
            a, b = z[i], z[i + 1]
            n = max(1, int(math.hypot(b[0] - a[0], b[1] - a[1]) / 0.5))
            for k in range(n):
                kiyi_noktalari.append((a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n))

    def deniz_yonu(x, y, r=3.0):
        sx = sy = 0.0
        for k in range(24):
            a = k * math.pi / 12
            for rr in (r, r * 2):
                if kod(x + math.cos(a) * rr, y + math.sin(a) * rr) == 0:
                    sx += math.cos(a)
                    sy += math.sin(a)
        L = math.hypot(sx, sy)
        return (sx / L, sy / L) if L > 1e-6 else None

    # ---- Caddeler, tramvay ----
    caddeler = [[cog(*p) for p in c] for c in CADDELER]
    tramvay2 = [cog(*p) for p in TRAMVAY2]
    caddeler, tramvay2 = [], []  # gerçek yollar OpenStreetMap'ten gelir (aşağıda)
    hatlar = []

    def parcaya(px, py, a, b):
        dx, dy = b[0] - a[0], b[1] - a[1]
        t = max(0, min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / (dx * dx + dy * dy)))
        qx, qy = a[0] + dx * t, a[1] + dy * t
        return math.hypot(px - qx, py - qy), qx, qy

    # ---- Yerleşim ----
    hedef = {k: cog(v[1], v[0]) for k, v in koordinat.items()}
    konum = dict(hedef)
    yon = {}
    sabit = set()
    for k in KIYI_YERLERI:
        hx, hy = hedef[k]
        konum[k] = min(kiyi_noktalari, key=lambda p: (p[0] - hx) ** 2 + (p[1] - hy) ** 2)
        yon[k] = deniz_yonu(*konum[k])
        sabit.add(k)
    # Kıyıya sabitlenen yerler birbirine girmesin: gerekirse kıyı boyunca kaydır
    ks = sorted(KIYI_YERLERI)
    for i, b in enumerate(ks):
        for a_ in ks[:i]:
            pay = yaricap.get(a_, 7) + yaricap.get(b, 7) + 0.8
            if math.hypot(konum[a_][0] - konum[b][0], konum[a_][1] - konum[b][1]) < pay:
                hx, hy = hedef[b]
                aday = [q for q in kiyi_noktalari if all(math.hypot(q[0] - konum[c][0], q[1] - konum[c][1]) >= yaricap.get(c, 7) + yaricap.get(b, 7) + 0.8 for c in ks[:i])]
                konum[b] = min(aday, key=lambda q: (q[0] - hx) ** 2 + (q[1] - hy) ** 2)
                yon[b] = deniz_yonu(*konum[b])
    # Kıyının hemen gerisinde, gerçek yerinde sabit duran yerler (diğerleri bunların çevresine yerleşir)
    for k, iceri in KIYI_GERISI.items():
        hx, hy = hedef[k]
        q = min(kiyi_noktalari, key=lambda p: (p[0] - hx) ** 2 + (p[1] - hy) ** 2)
        n = deniz_yonu(*q)
        konum[k] = (q[0] - n[0] * iceri, q[1] - n[1] * iceri)
        sabit.add(k)
    kimlikler = sorted(konum)
    R = {k: yaricap.get(k, 7.0) for k in kimlikler}
    for tur in range(2200):
        for k in kimlikler:
            if k in sabit:
                continue
            x, y = konum[k]
            hx, hy = hedef[k]
            x += (hx - x) * 0.006
            y += (hy - y) * 0.006
            # denizden ve harita kenarından uzak dur
            pay = R[k] * 0.8 + 3.2
            d = denize(x, y)
            if d < pay:
                gx = denize(x + 1, y) - denize(x - 1, y)
                gy = denize(x, y + 1) - denize(x, y - 1)
                L = math.hypot(gx, gy)
                if L > 1e-6:
                    x += gx / L * min(2.0, pay - d)
                    y += gy / L * min(2.0, pay - d)
            x = max(KUTU[0] + R[k] + 2, min(KUTU[2] - R[k] - 2, x))
            y = max(KUTU[1] + R[k] + 2, min(KUTU[3] - R[k] - 2, y))
            # caddelerden ve tramvaydan uzak dur
            for hat in hatlar:
                for i in range(len(hat) - 1):
                    d, qx, qy = parcaya(x, y, hat[i], hat[i + 1])
                    pay2 = R[k] * 0.8 + 1.4
                    if d < pay2:
                        if d < 1e-6:
                            x += 0.3
                        else:
                            x += (x - qx) / d * (pay2 - d)
                            y += (y - qy) / d * (pay2 - d)
            konum[k] = (x, y)
        for _ in range(3):
          for i, a in enumerate(kimlikler):
            for b in kimlikler[i + 1:]:
                ax, ay = konum[a]
                bx, by = konum[b]
                d = math.hypot(bx - ax, by - ay)
                pay = R[a] + R[b] + 0.6
                if d < pay:
                    if d < 1e-6:
                        bx += 0.1
                        d = 0.1
                    ux, uy = (bx - ax) / d, (by - ay) / d
                    ia = 0 if a in sabit else (1.0 if b in sabit else 0.5)
                    ib = 0 if b in sabit else (1.0 if a in sabit else 0.5)
                    konum[a] = (ax - ux * (pay - d) * ia, ay - uy * (pay - d) * ia)
                    konum[b] = (bx + ux * (pay - d) * ib, by + uy * (pay - d) * ib)

        for k in kimlikler:
            if k in sabit:
                continue
            x, y = konum[k]
            pay = R[k] * 0.8 + 3.2
            for _ in range(12):
                d = denize(x, y)
                if d >= pay:
                    break
                gx = denize(x + 1, y) - denize(x - 1, y)
                gy = denize(x, y + 1) - denize(x, y - 1)
                L = math.hypot(gx, gy)
                if L < 1e-6:
                    break
                x += gx / L * min(1.0, pay - d)
                y += gy / L * min(1.0, pay - d)
            konum[k] = (x, y)

    # denetim
    sorun = []
    for i, a in enumerate(kimlikler):
        for b in kimlikler[i + 1:]:
            d = math.hypot(konum[a][0] - konum[b][0], konum[a][1] - konum[b][1])
            if d < R[a] + R[b] - 0.3:
                sorun.append('%s/%s %.1f<%.1f' % (a, b, d, R[a] + R[b]))
        if a not in sabit and denize(*konum[a]) < R[a] * 0.8 + 2.4:
            sorun.append('%s denize yakın %.1f' % (a, denize(*konum[a])))
    kayma = sorted(((math.hypot(konum[k][0] - hedef[k][0], konum[k][1] - hedef[k][1]), k) for k in kimlikler), reverse=True)
    print('çakışma/sorun:', sorun or 'yok')
    print('en çok kayanlar:', ', '.join('%s %.0f' % (k, d) for d, k in kayma[:8]))

    # Denize bakan (ama kıyıda olmayan) yerler için yön
    for k in kimlikler:
        if k not in yon:
            x, y = konum[k]
            q = min(kiyi_noktalari, key=lambda p: (p[0] - x) ** 2 + (p[1] - y) ** 2)
            L = math.hypot(q[0] - x, q[1] - y) or 1
            yon[k] = ((q[0] - x) / L, (q[1] - y) / L)

    # ---- Gerçek yollar ve raylar (OpenStreetMap) ----
    osm = json.load(io.open(os.path.join(KOK, 'araclar', 'osm_yollar.json'), encoding='utf-8'))
    UZAK = {'sokak': 64.0, 'cadde': 134.0}          # merkezden bu kadar uzakta küçük yollar çizilmez
    daireler = [(konum[k][0], konum[k][1], (R[k] * 0.95) ** 2) for k in kimlikler]

    def gecerli(x, y, sinif):
        if not (KUTU[0] + 1 < x < KUTU[2] - 1 and KUTU[1] + 1 < y < KUTU[3] - 1) or kod(x, y) <= 0:
            return False
        if x * x + y * y > UZAK.get(sinif, 1e9) ** 2:
            return False
        for cx, cy, r2 in daireler:
            if (x - cx) ** 2 + (y - cy) ** 2 < r2:
                return False
        return True

    def ornekle(pts, adim):
        c = [pts[0]]
        for i in range(len(pts) - 1):
            a, b = pts[i], pts[i + 1]
            n = max(1, int(math.ceil(math.hypot(b[0] - a[0], b[1] - a[1]) / adim)))
            for k in range(1, n + 1):
                c.append((a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n))
        return c

    ham = {}
    for sinif, pts in osm:
        w = ornekle([cog(*q) for q in ornekle([tuple(q) for q in pts], 0.003)], 0.35)
        kosu = []
        for q in w:
            if gecerli(q[0], q[1], sinif):
                kosu.append(q)
            else:
                if len(kosu) > 1:
                    ham.setdefault(sinif, []).append(kosu)
                kosu = []
        if len(kosu) > 1:
            ham.setdefault(sinif, []).append(kosu)

    # Üst üste binen şeritleri (çift yönlü yolların ikinci yönü, sıkışan uzak yollar) ayıkla
    HUCRE = 0.7
    def ayikla(siniflar):
        dolu, c = {}, {}
        sira = 0
        for sinif in siniflar:
            for z in sorted(ham.get(sinif, []), key=len, reverse=True):
                sira += 1
                cift = []
                for (x, y) in z:
                    i, j = int(math.floor(x / HUCRE)), int(math.floor(y / HUCRE))
                    cift.append(any(dolu.get((i + di, j + dj), sira) != sira for di in (-1, 0, 1) for dj in (-1, 0, 1)))
                # kısa çakışmalar kavşaktır, kalır
                k = 0
                while k < len(z):
                    if cift[k]:
                        m = k
                        while m < len(z) and cift[m]:
                            m += 1
                        if (m - k) * 0.35 < 2.6:
                            for t in range(k, m):
                                cift[t] = False
                        k = m
                    else:
                        k += 1
                kosu = []
                for q, d in list(zip(z, cift)) + [(None, True)]:
                    if not d:
                        kosu.append(q)
                    else:
                        if len(kosu) * 0.35 >= 2.0:
                            c.setdefault(sinif, []).append(kosu)
                            for (x, y) in kosu:
                                dolu.setdefault((int(math.floor(x / HUCRE)), int(math.floor(y / HUCRE))), sira)
                        kosu = []
        return c
    ayik = {}
    ayik.update(ayikla(['otoyol', 'cadde', 'sokak']))
    ayik.update(ayikla(['tren']))
    ayik.update(ayikla(['tramvay']))

    # Uç uca gelen parçaları birleştir
    def zincirle(parcalar_):
        kalan = [list(z) for z in parcalar_]
        degisti = True
        while degisti:
            degisti = False
            uclar = {}
            for idx, z in enumerate(kalan):
                if z is None:
                    continue
                for uc in (0, -1):
                    uclar.setdefault((int(round(z[uc][0] / 0.8)), int(round(z[uc][1] / 0.8))), []).append((idx, uc))
            for idx, z in enumerate(kalan):
                if z is None:
                    continue
                cx, cy = int(round(z[-1][0] / 0.8)), int(round(z[-1][1] / 0.8))
                en, eni = 0.75, None
                for di in (-1, 0, 1):
                    for dj in (-1, 0, 1):
                        for (o, uc) in uclar.get((cx + di, cy + dj), []):
                            if o == idx or kalan[o] is None:
                                continue
                            d = math.hypot(kalan[o][uc][0] - z[-1][0], kalan[o][uc][1] - z[-1][1])
                            if d < en:
                                en, eni = d, (o, uc)
                if eni:
                    o, uc = eni
                    ek = kalan[o] if uc == 0 else kalan[o][::-1]
                    kalan[idx] = z + ek
                    kalan[o] = None
                    degisti = True
                    break
        return [z for z in kalan if z]

    yollar = {}
    for sinif, zs in ayik.items():
        c = []
        for z in zincirle(zs):
            z = dp(z, 0.18)
            if boy(z) >= (4.0 if sinif == 'sokak' else 3.0):
                c.append(z)
        yollar[sinif] = sorted(c, key=boy, reverse=True)
    yol_noktalari = [q for sinif in yollar for z in yollar[sinif] for q in ornekle(z, 2.0)]
    print('yollar:', {k: (len(v), round(sum(boy(z) for z in v))) for k, v in yollar.items()})
    print('en uzun:', {k: [round(boy(z)) for z in v[:4]] for k, v in yollar.items()})

    # ---- Tepeler ----
    tepeler = []
    for lon, lat, r, h in TEPELER:
        x, y = cog(lon, lat)
        if not (KUTU[0] < x < KUTU[2] and KUTU[1] < y < KUTU[3]) or kod(x, y) <= 0:
            continue
        r0 = r
        for k in kimlikler:
            r = min(r, math.hypot(konum[k][0] - x, konum[k][1] - y) - R[k] - 1.5)
        for hat in hatlar:
            for i in range(len(hat) - 1):
                r = min(r, parcaya(x, y, hat[i], hat[i + 1])[0] - 2.5)
        r = min(r, denize(x, y) / 0.85)
        for (qx, qy) in yol_noktalari:
            r = min(r, math.hypot(qx - x, qy - y) - 1.8)
        if r >= 9:
            tepeler.append((x, y, r, h * r / r0))

    def ic_seritler(j):
        c, i = [], 0
        while i < W:
            if uz[j][i] >= 1.6:
                k = i
                while k < W and uz[j][k] >= 1.6:
                    k += 1
                c.append((i, k))
                i = k
            else:
                i += 1
        return c

    # ---- Çıktı ----
    def yuvarla(p, n=1):
        return [round(p[0], n), round(p[1], n)]
    satirlar = []
    for j in range(H):
        s, i = [], 0
        while i < W:
            k = i
            while k < W and arazi[j][k] == arazi[j][i]:
                k += 1
            s.append('%d%s' % (k - i, 'abcdefghijkl'[arazi[j][i]]))
            i = k
        satirlar.append(''.join(s))
    cikti = {
        'kutu': list(KUTU),
        'ilceler': ILCELER,
        'parcalar': [{'kod': kd, 'ad': ad, 'halka': [yuvarla(p) for p in h]} for kd, ad, h in parcalar],
        'kiyi': {ad: [[yuvarla(p) for p in z] for z in zs] for ad, zs in kiyi_cikti.items()},
        'arazi': {'x0': x0, 'y0': y0, 'en': W, 'boy': H, 'satir': satirlar},
        'ic': [[j, i0, i1] for j in range(H) for (i0, i1) in ic_seritler(j)],
        'konum': {k: yuvarla(konum[k]) for k in kimlikler},
        'hedef': {k: yuvarla(hedef[k]) for k in kimlikler},
        'yon': {k: yuvarla(yon[k], 3) for k in kimlikler if yon.get(k)},
        'kiyida': sorted(KIYI_YERLERI),
        'yollar': {k: [[yuvarla(q, 2) for q in z] for z in v] for k, v in yollar.items()},
        'tepeler': [[round(v, 1) for v in t] for t in tepeler],
        'semtler': [[ad] + yuvarla(cog(lon, lat)) for ad, lon, lat in SEMTLER],
    }
    js = ('// Bu dosya araclar/cografya.py tarafından ilceler.geojson dosyasından üretilir; elle düzenlemeyin.\n'
          'window.IZ = window.IZ || {};\nIZ.COG = ' + json.dumps(cikti, ensure_ascii=False, separators=(',', ':')) + ';\n')
    io.open(os.path.join(KOK, 'js', 'cografya.js'), 'w', encoding='utf-8', newline='\n').write(js)
    print('kıyı boyları:', {a: [round(boy(z)) for z in zs] for a, zs in kiyi_cikti.items()})
    print('parça:', len(parcalar), 'köşe:', sum(len(h) for _, _, h in parcalar), 'kıyı:', {a: [len(z) for z in zs] for a, zs in kiyi_cikti.items()})
    print('tepe:', len(tepeler), 'dosya: %.0f KB' % (len(js) / 1024))


if __name__ == '__main__':
    main()
