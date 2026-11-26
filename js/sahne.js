// Sahne: zemin, körfez, dolgu şehir dokusu, ışık modları ve etkileşim.
(function () {
  const THREE = window.THREE;
  const IZ = window.IZ;

  // ---------- Temel kurulum ----------
  const tuval = document.getElementById('sahne');
  const renderer = new THREE.WebGLRenderer({ canvas: tuval, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false; // gölge haritası birkaç karede bir yenilenir (bkz. kare())

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#bfe6f7');
  scene.fog = new THREE.Fog('#bfe6f7', 330, 760);

  const camera = new THREE.PerspectiveCamera(40, 1, 1, 1200);
  camera.position.set(-88, 58, -12);
  const controls = new window.OrbitControls(camera, tuval);
  controls.target.set(0, 0, -22);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI / 2.15;
  controls.minDistance = 10;
  // Harita alışkanlığı: sol tuşla sürükleyince kaydırır, sağ tuşla döndürür; tekerlek imlecin altına yakınlaşır.
  // Dokunmatikte tek parmak kaydırır, iki parmak yakınlaştırır ve döndürür.
  controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
  controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE };
  controls.screenSpacePanning = false;
  controls.zoomToCursor = true;
  controls.panSpeed = 1.1;
  controls.maxDistance = 380;
  controls.update();

  function boyutla() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', boyutla);
  boyutla();

  // Harita (x doğu, y kuzey) -> dünya koordinatı
  const D = (x, y, h) => new THREE.Vector3(x, h || 0, -y);

  // ---------- Işıklar ----------
  const gok = new THREE.HemisphereLight('#ffffff', '#b9a98a', 0.9);
  scene.add(gok);
  const gunes = new THREE.DirectionalLight('#fff4e0', 1.9);
  gunes.position.set(-70, 110, 60);
  gunes.castShadow = true;
  gunes.shadow.mapSize.set(2048, 2048);
  const sc = gunes.shadow.camera;
  sc.left = -210; sc.right = 210; sc.top = 210; sc.bottom = -210; sc.near = 1; sc.far = 620;
  gunes.shadow.bias = -0.0006;
  gunes.target.position.set(-10, 0, -5);
  scene.add(gunes, gunes.target);

  // ---------- Kara ve körfez (gerçek coğrafyadan üretilen js/cografya.js) ----------
  const COG = IZ.COG;
  // Yerlerin konumu ve denize bakan modellerin dönüşü coğrafya verisinden gelir.
  // [modelin denize bakan yerel ekseni, kıyıdan denize doğru kaydırma]
  const DENIZ_EKSENI = {
    'konak-pier': ['-x', 7.6], 'pasaport': ['-x', 3.6], 'karsiyaka-iskele': ['+z', 0], 'bostanli': ['+z', 0], 'kus-cenneti': ['+z', 0],
    'deniz-muzesi': ['-z', 0], 'sahilevleri': ['-z', 0], 'ataturk-aniti': ['-z', 0], 'ataturk-muzesi': ['-z', 0], 'latife-kosku': ['-z', 0], 'zubeyde-hanim': ['-z', 0]
  };
  IZ.YERLER.forEach((v) => {
    const k = COG.konum[v.id];
    if (!k) return;
    v.konum = [k[0], k[1]];
    delete v.donus;
    const e = DENIZ_EKSENI[v.id], n = COG.yon[v.id];
    if (e && n) {
      const wx = n[0], wz = -n[1]; // harita (x doğu, y kuzey) -> dünya (x, z = -y)
      v.donus = e[0] === '+z' ? Math.atan2(wx, wz) : e[0] === '-z' ? Math.atan2(-wx, -wz) : Math.atan2(wz, -wx);
      v.konum = [k[0] + n[0] * e[1], k[1] + n[1] * e[1]];
    }
  });
  const [KX0, KY0, KX1, KY1] = COG.kutu;
  // Arazi ızgarası (1 birimlik hücreler): 0 deniz, 1-10 ilçe (IZ.ILCELER sırası), 11 diğer kara
  const araziIzgara = COG.arazi.satir.map((s) => {
    const r = new Uint8Array(COG.arazi.en);
    let i = 0;
    s.replace(/(\d+)([a-l])/g, (_, n, k) => { r.fill(k.charCodeAt(0) - 97, i, i + +n); i += +n; return ''; });
    return r;
  });
  function araziKodu(x, y) {
    const i = Math.floor(x - COG.arazi.x0), j = Math.floor(y - COG.arazi.y0);
    return i >= 0 && j >= 0 && i < COG.arazi.en && j < COG.arazi.boy ? araziIzgara[j][i] : 0;
  }
  const icinde = (x, y) => araziKodu(x, y) > 0;
  function karada(x, y, pay) {
    if (!icinde(x, y)) return false;
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4;
      if (!icinde(x + Math.cos(a) * pay, y + Math.sin(a) * pay)) return false;
    }
    return true;
  }

  // Her ilçe ayrı bir kara parçasıdır; komşu ilçeler hafifçe farklı tonda
  const karaRenk = ['#ddd3bc', '#d6ccb2', '#e1d8c3', '#d9cfb4', '#dcd1b6'];
  COG.parcalar.forEach((p) => {
    const s = new THREE.Shape();
    p.halka.forEach((q, k) => (k ? s.lineTo(q[0], q[1]) : s.moveTo(q[0], q[1])));
    const geo = new THREE.ExtrudeGeometry(s, { depth: 1.6, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(geo, IZ.mat(p.kod === 11 ? '#cfd2a8' : karaRenk[p.kod % 5]));
    m.position.y = -1.6;
    m.receiveShadow = true;
    scene.add(m);
  });
  // İlçe sınırlarındaki ince çatlakları örten iç kara tabanı
  (function () {
    const g = new THREE.Group();
    COG.ic.forEach(([j, i0, i1]) => {
      const m = IZ.kutu(i1 - i0, 1.5, 1, '#d9d0b6');
      m.castShadow = false;
      m.position.copy(D(COG.arazi.x0 + (i0 + i1) / 2, COG.arazi.y0 + j + 0.5, -1.6));
      g.add(m);
    });
    IZ.birlestir(g);
    scene.add(g);
  })();

  const haritaEn = KX1 - KX0, haritaBoy = KY1 - KY0, haritaX = (KX0 + KX1) / 2, haritaY = (KY0 + KY1) / 2;
  const suGeo = new THREE.PlaneGeometry(haritaEn, haritaBoy, 54, 52);
  suGeo.rotateX(-Math.PI / 2);
  const suMat = new THREE.MeshStandardMaterial({ color: '#4aa9d8', flatShading: true, roughness: 0.45, metalness: 0.1 });
  const su = new THREE.Mesh(suGeo, suMat);
  su.position.set(haritaX, -0.55, -haritaY);
  su.receiveShadow = true;
  scene.add(su);
  const taban = IZ.kutu(haritaEn, 5, haritaBoy, '#2f7fae');
  taban.position.set(haritaX, -5.9, -haritaY);
  taban.castShadow = false;
  scene.add(taban);

  // ---------- Tepeler, park, meydan ----------
  const yasaklar = []; // dolgu binaların giremeyeceği daireler
  function tepe(x, y, r, h, renk, duz) {
    const m = IZ.silindir(duz ? r * 0.42 : r * 0.08, r, h, 9, renk);
    m.position.copy(D(x, y));
    m.rotation.y = x * 0.37;
    scene.add(m);
    yasaklar.push({ x, y, r: r * 0.92 });
  }
  const yerKonum = (id) => IZ.YERLER.find((v) => v.id === id).konum;
  tepe(yerKonum('kadifekale')[0], yerKonum('kadifekale')[1], 21, 8, '#a9b77c', true); // Kadifekale tepesi
  COG.tepeler.forEach(([x, y, r, h], i) => tepe(x, y, r, h, i % 2 ? '#8fae76' : '#9ab87d'));

  function disk(x, y, r, renk) {
    const m = IZ.silindir(r, r, 0.06, 14, renk);
    m.castShadow = false;
    m.position.copy(D(x, y));
    scene.add(m);
  }
  const PARK = yerKonum('kulturpark'), MEYDAN = yerKonum('saat-kulesi');
  disk(PARK[0], PARK[1], 8.8, '#8fc070'); // Kültürpark
  disk(MEYDAN[0], MEYDAN[1], 6.8, '#efe7d4'); // Konak Meydanı
  yasaklar.push({ x: MEYDAN[0], y: MEYDAN[1], r: 8 });

  // ---------- Kıyı şeritleri: yaya yolu ----------
  const agaclar = [];
  const lambalar = [];
  // Bir kıyı zincirinin her parçası için kara tarafındaki normali bulur
  function kiyiParcalari(zincir) {
    const c = [];
    for (let i = 0; i < zincir.length - 1; i++) {
      const a = zincir[i], b = zincir[i + 1];
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
      if (L < 0.3) continue;
      let nx = dy / L, ny = -dx / L;
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      const s1 = icinde(mx + nx * 3, my + ny * 3), s2 = icinde(mx - nx * 3, my - ny * 3);
      if (s1 === s2) continue;
      if (!s1) { nx = -nx; ny = -ny; }
      c.push({ a, b, nx, ny, L, dx: dx / L, dy: dy / L });
    }
    return c;
  }
  function seritler(parcalar, katmanlar) {
    const g = new THREE.Group();
    parcalar.forEach((s) => {
      katmanlar.forEach(([ofs, gen, renk, kalinlik]) => {
        const m = IZ.kutu(s.L + gen * 0.6, kalinlik || 0.08, gen, renk);
        m.castShadow = false;
        m.position.copy(D((s.a[0] + s.b[0]) / 2 + s.nx * ofs, (s.a[1] + s.b[1]) / 2 + s.ny * ofs));
        m.rotation.y = Math.atan2(s.dy, s.dx);
        g.add(m);
      });
    });
    IZ.birlestir(g);
    scene.add(g);
  }
  const YAYA = [[1.3, 2.0, '#efe3c8', 0.09]];
  ['Konak', 'Karşıyaka', 'Balçova', 'Narlıdere', 'Bayraklı'].forEach((ilce) => {
    (COG.kiyi[ilce] || []).map(kiyiParcalari).forEach((p) => {
      seritler(p, YAYA);
      p.forEach((s) => {
        if (ilce === 'Konak') for (let t = 0.5; t < s.L; t += 5.5) lambalar.push(D(s.a[0] + s.dx * t + s.nx * 0.55, s.a[1] + s.dy * t + s.ny * 0.55, 0.09));
        if (ilce === 'Konak' || ilce === 'Karşıyaka') {
          for (let t = 1.5; t < s.L; t += 3.8) agaclar.push({ x: s.a[0] + s.dx * t + s.nx * 1.9, y: s.a[1] + s.dy * t + s.ny * 1.9, s: 0.8, palmiye: true });
        }
      });
    });
  });

  // ---------- Gerçek yollar ve raylar (OpenStreetMap verisi; js/cografya.js içinde) ----------
  const yolNoktalari = []; // [x, y, yarı genişlik, yerleşim çeker mi]
  function yolParcalari(z, f) {
    for (let i = 0; i < z.length - 1; i++) {
      const a = z[i], b = z[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
      if (L > 0.05) f(a, b, dx / L, dy / L, L, Math.atan2(dy, dx));
    }
  }
  const YOL_STIL = { sokak: [0.75, '#9a9ea4', 0.05], cadde: [1.15, '#858a91', 0.06], otoyol: [1.6, '#6f747b', 0.07] };
  Object.keys(YOL_STIL).forEach((sinif) => {
    const [gen, renk, kalin] = YOL_STIL[sinif];
    const g = new THREE.Group();
    (COG.yollar[sinif] || []).forEach((z) => {
      let yol = 0;
      yolParcalari(z, (a, b, ux, uy, L, aci) => {
        const m = IZ.kutu(L + gen * 0.5, kalin, gen, renk);
        m.castShadow = false;
        m.position.copy(D((a[0] + b[0]) / 2, (a[1] + b[1]) / 2));
        m.rotation.y = aci;
        g.add(m);
        if (sinif === 'otoyol') {
          const c = IZ.kutu(L, kalin + 0.012, 0.09, '#ece6d2');
          c.castShadow = false;
          c.position.copy(m.position);
          c.rotation.y = aci;
          g.add(c);
        }
        for (let t = 0; t < L; t += 1.2) yolNoktalari.push([a[0] + ux * t, a[1] + uy * t, gen / 2, sinif !== 'otoyol']);
        if (sinif === 'cadde') {
          for (let t = 7 - (yol % 7); t < L; t += 7) lambalar.push(D(a[0] + ux * t + uy * 0.85, a[1] + uy * t - ux * 0.85, 0));
        }
        yol += L;
      });
    });
    IZ.birlestir(g);
    scene.add(g);
  });
  // Raylar: tren (İZBAN ve ana hat) ve tramvay
  [['tren', '#8f887a', 0.95, 0.3, false], ['tramvay', '#a39b8d', 0.8, 0.22, true]].forEach(([sinif, yatakRenk, gen, ray, direkli]) => {
    const g = new THREE.Group();
    (COG.yollar[sinif] || []).forEach((z) => {
      let yol = 0;
      yolParcalari(z, (a, b, ux, uy, L, aci) => {
        const p = new THREE.Group();
        const yatak = IZ.kutu(L + 0.3, 0.085, gen, yatakRenk);
        yatak.castShadow = false;
        p.add(yatak);
        for (const o of [-ray, ray]) p.add(IZ.koy(IZ.kutu(L + 0.2, 0.03, 0.05, '#c9d0d5'), 0, 0.085, o));
        if (!direkli) for (let t = -L / 2 + 0.3; t < L / 2; t += 0.9) p.add(IZ.koy(IZ.kutu(0.14, 0.02, gen * 0.9, '#6b6257'), t, 0.085, 0));
        if (direkli) {
          for (let t = 8 - (yol % 8); t < L; t += 8) {
            p.add(IZ.koy(IZ.silindir(0.03, 0.045, 1.9, 4, '#4a4f55'), t - L / 2, 0, gen / 2 + 0.1));
            p.add(IZ.koy(IZ.kutu(0.04, 0.04, 0.9, '#4a4f55'), t - L / 2, 1.8, 0.15));
          }
          p.add(IZ.koy(IZ.kutu(L, 0.015, 0.015, '#3a3f45'), 0, 1.76, 0));
        }
        p.position.copy(D((a[0] + b[0]) / 2, (a[1] + b[1]) / 2));
        p.rotation.y = aci;
        g.add(p);
        for (let t = 0; t < L; t += 1.2) yolNoktalari.push([a[0] + ux * t, a[1] + uy * t, gen / 2, direkli]);
        yol += L;
      });
    });
    IZ.birlestir(g);
    scene.add(g);
  });

  // Metro hattı (yeraltında; haritada kırmızı çizgiyle gösterilir)
  (function () {
    const g = new THREE.Group();
    (COG.yollar.metro || []).forEach((z) => yolParcalari(z, (a, b, ux, uy, L, aci) => {
      const m = IZ.kutu(L + 0.3, 0.1, 0.36, '#c8402f');
      m.castShadow = false;
      m.position.copy(D((a[0] + b[0]) / 2, (a[1] + b[1]) / 2));
      m.rotation.y = aci;
      g.add(m);
    }));
    IZ.birlestir(g);
    scene.add(g);
  })();
  // İstasyonlar: metro kırmızı, İZBAN mavi, tramvay turkuaz tabelalı
  const IST_RENK = { metro: '#c8402f', tren: '#1f5fa8', tramvay: '#1aa3a3' };
  (function () {
    const g = new THREE.Group();
    (COG.istasyonlar || []).forEach(([tur, ad, x, y]) => {
      const p = new THREE.Group();
      p.add(IZ.kutu(1.7, 0.14, 0.8, '#d9d2c2'));
      p.add(IZ.koy(IZ.silindir(0.035, 0.035, 1.5, 4, '#6d747a'), 0.65, 0.14, 0.3));
      p.add(IZ.koy(IZ.kutu(0.5, 0.5, 0.08, IST_RENK[tur], { isik: IST_RENK[tur], guc: 0.8 }), 0.65, 1.5, 0.3));
      if (tur !== 'tramvay') {
        for (const sx of [-0.7, 0.3]) p.add(IZ.koy(IZ.silindir(0.03, 0.03, 0.95, 4, '#6d747a'), sx, 0.14, 0.3));
        p.add(IZ.koy(IZ.kutu(1.3, 0.06, 0.7, IST_RENK[tur]), -0.2, 1.08, 0.1));
      }
      p.position.copy(D(x, y, 0.09));
      g.add(p);
      yasaklar.push({ x, y, r: 1.7 });
    });
    IZ.birlestir(g);
    scene.add(g);
  })();
  // Vapur iskeleleri: kendi modeli olmayanlar için küçük iskele binası ve rıhtım (yerel +z deniz)
  (COG.iskeleler || []).filter((i) => !i.model).forEach((i) => {
    const g = new THREE.Group();
    g.add(IZ.koy(IZ.kutu(1.6, 0.3, 6.0, '#cfc6ae'), 0, -0.2, 3.0));
    for (const z of [1.2, 3.2, 5.4]) for (const sx of [-0.65, 0.65]) g.add(IZ.koy(IZ.silindir(0.11, 0.11, 1.0, 5, '#8a6a4a'), sx, -1.1, z));
    for (const sx of [-0.75, 0.75]) g.add(IZ.koy(IZ.kutu(0.04, 0.04, 5.6, '#6d747a'), sx, 0.5, 3.1));
    g.add(IZ.koy(IZ.kutu(2.8, 1.3, 1.8, '#f1e6cc'), 0, 0.1, -1.4));
    g.add(IZ.koy(IZ.kutu(2.84, 0.5, 1.4, '#36546d', { isik: '#ffd27a' }), 0, 0.55, -1.4));
    g.add(IZ.koy(IZ.piramit(3.2, 0.7, 2.2, '#b9553a'), 0, 1.4, -1.4));
    g.add(IZ.koy(IZ.kutu(1.6, 0.3, 0.06, '#1f5fa8'), 0, 1.15, -0.47));
    g.add(IZ.koy(IZ.silindir(0.03, 0.03, 2.4, 4, '#dddddd'), 1.6, 0.1, -0.6));
    g.add(IZ.koy(IZ.kutu(0.6, 0.38, 0.03, '#e30a17'), 1.91, 2.1, -0.6));
    IZ.birlestir(g);
    g.position.copy(D(i.x, i.y));
    g.rotation.y = Math.atan2(i.nx, i.ny * -1);
    scene.add(g);
    yasaklar.push({ x: i.x - i.nx * 1.5, y: i.y - i.ny * 1.5, r: 3.2 });
  });

  // Yola uzaklık için ızgara: dolgu binalar yolun üstüne gelmez, yerleşim cadde boylarında toplanır
  const yolIzgara = new Map(), kentIzgara = new Set();
  yolNoktalari.forEach((p) => {
    const k = Math.floor(p[0] / 2) + ',' + Math.floor(p[1] / 2);
    if (!yolIzgara.has(k)) yolIzgara.set(k, []);
    yolIzgara.get(k).push(p);
    if (p[3]) {
      const ci = Math.floor(p[0] / 6), cj = Math.floor(p[1] / 6);
      for (let di = -2; di <= 2; di++) for (let dj = -2; dj <= 2; dj++) kentIzgara.add(ci + di + ',' + (cj + dj));
    }
  });
  // Yol kenarına uzaklık (en çok ~4 birim uzağa bakar)
  function caddeyeUzaklik(x, y) {
    let en = Infinity;
    const ci = Math.floor(x / 2), cj = Math.floor(y / 2);
    for (let di = -2; di <= 2; di++) {
      for (let dj = -2; dj <= 2; dj++) {
        const l = yolIzgara.get(ci + di + ',' + (cj + dj));
        if (l) for (const p of l) en = Math.min(en, Math.hypot(x - p[0], y - p[1]) - p[2]);
      }
    }
    return en;
  }
  const yolaYakin = (x, y) => kentIzgara.has(Math.floor(x / 6) + ',' + Math.floor(y / 6));

  // Otobüs durakları: en uzun caddeler boyunca
  function durak(a, b, ileri, renk) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    const x = a[0] + (dx / L) * ileri - (dy / L) * 1.35, y = a[1] + (dy / L) * ileri + (dx / L) * 1.35;
    if (!karada(x, y, 1.5) || yasaklar.some((d) => Math.hypot(x - d.x, y - d.y) < d.r + 1)) return;
    const g = new THREE.Group();
    g.add(IZ.kutu(1.8, 0.08, 0.6, '#d9d2c2'));
    for (const sx of [-0.75, 0.75]) g.add(IZ.koy(IZ.silindir(0.03, 0.03, 1.0, 4, '#6d747a'), sx, 0.08, 0.2));
    g.add(IZ.koy(IZ.kutu(1.7, 0.05, 0.55, renk), 0, 1.08, 0.05));
    g.add(IZ.koy(IZ.kutu(1.5, 0.6, 0.04, '#cfe3f0', { isik: '#ffe9b0', guc: 0.6 }), 0, 0.4, 0.24));
    g.add(IZ.koy(IZ.kutu(0.9, 0.16, 0.2, '#8a6a4a'), 0, 0.08, 0.05));
    g.add(IZ.koy(IZ.silindir(0.02, 0.02, 1.4, 4, '#6d747a'), 1.05, 0, -0.1));
    g.add(IZ.koy(IZ.kutu(0.3, 0.3, 0.03, renk), 1.05, 1.4, -0.1));
    IZ.birlestir(g);
    g.position.copy(D(x, y));
    g.rotation.y = Math.atan2(dy, dx) + Math.PI;
    scene.add(g);
    yasaklar.push({ x, y, r: 2.0 });
  }
  (COG.yollar.cadde || []).slice(0, 8).forEach((z) => {
    let yol = 12;
    yolParcalari(z, (a, b, ux, uy, L) => {
      yol += L;
      if (yol > 26 && L > 1.6) { durak(a, b, L / 2, '#1aa3a3'); yol = 0; }
    });
  });

  // ---------- Dolgu şehir dokusu ----------
  function rastgeleUret(tohum) {
    return function () {
      tohum |= 0; tohum = (tohum + 0x6d2b79f5) | 0;
      let t = Math.imul(tohum ^ (tohum >>> 15), 1 | tohum);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rnd = rastgeleUret(11);
  IZ.YERLER.forEach((y) => yasaklar.push({ x: y.konum[0], y: y.konum[1], r: y.alan || 7 }));
  yasaklar.push({ x: PARK[0], y: PARK[1], r: 9.6 });
  // Asansör yamacı güneye uzanır
  yasaklar.push({ x: yerKonum('asansor')[0], y: yerKonum('asansor')[1] - 8, r: 9 });
  const FOLKART = yerKonum('folkart');

  const SAZLIK_X = yerKonum('dogal-yasam')[0] + 18;
  const yakin = (x, y, id, r) => Math.hypot(x - yerKonum(id)[0], y - yerKonum(id)[1]) < r;
  const ar = (a, b) => a + rnd() * (b - a);
  // İlçeye ve semte göre yapı tipi. tur: palet ve çatı biçimini belirler.
  const TIP = {
    kule: () => ({ tur: 'kule', h: ar(5, 13), w: ar(1.7, 2.6), d: ar(1.7, 2.6), cam: true }),
    ofis: () => ({ tur: 'apartman', h: ar(1.6, 3.6), w: ar(1.8, 2.7), d: ar(1.8, 2.6) }),
    eski: () => ({ tur: 'eski', h: ar(0.9, 1.5), w: ar(1.5, 2.3), d: ar(1.5, 2.2), cati: true }),
    apartman: () => ({ tur: 'apartman', h: ar(2.6, 4.6), w: ar(2.1, 2.9), d: ar(1.8, 2.5) }),
    orta: () => ({ tur: 'apartman', h: ar(1.6, 3.2), w: ar(1.8, 2.7), d: ar(1.7, 2.5) }),
    ev: () => ({ tur: 'ev', h: ar(0.9, 1.6), w: ar(1.6, 2.4), d: ar(1.6, 2.3), cati: true }),
    kondu: () => ({ tur: 'kondu', h: ar(0.75, 1.3), w: ar(1.3, 1.9), d: ar(1.3, 1.9), cati: true }),
    villa: () => ({ tur: 'villa', h: ar(1.0, 1.5), w: ar(1.7, 2.3), d: ar(1.7, 2.2), cati: true }),
    tas: () => ({ tur: 'tas', h: ar(1.3, 1.9), w: ar(1.9, 2.5), d: ar(1.8, 2.3), cati: true }),
    site: () => ({ tur: 'site', h: ar(3.8, 6.2), w: ar(1.6, 2.0), d: ar(1.6, 2.0) }),
    sanayi: () => ({ tur: 'sanayi', h: ar(1.0, 1.6), w: ar(2.6, 3.2), d: ar(2.2, 3.0) })
  };
  function binaTipi(x, y, kod, merkeze) {
    const z = rnd();
    if (Math.hypot(x - FOLKART[0], y - FOLKART[1]) < 17) return z < 0.3 ? TIP.kule() : TIP.ofis();
    if (kod === 1) { // Konak: Kemeraltı'nda eski doku, Alsancak'ta bitişik apartmanlar, yamaçlarda küçük evler
      if (yakin(x, y, 'kemeralti', 20) || yakin(x, y, 'agora', 16)) return TIP.eski();
      if (yakin(x, y, 'ataturk-muzesi', 26) || yakin(x, y, 'alsancak-gari', 24) || yakin(x, y, 'ataturk-aniti', 18)) return TIP.apartman();
      if (merkeze < 46) return z < 0.6 ? TIP.orta() : TIP.ev();
      return z < 0.65 ? TIP.kondu() : TIP.ev();
    }
    if (kod === 3) return z < 0.75 ? TIP.apartman() : TIP.orta(); // Karşıyaka
    if (kod === 2) { // Çiğli: sanayi, kıyıya yakın siteler
      if (yakin(x, y, 'aosb', 26)) return z < 0.8 ? TIP.sanayi() : TIP.ev();
      return z < 0.3 ? TIP.site() : z < 0.6 ? TIP.orta() : TIP.ev();
    }
    if (kod === 4) return z < 0.6 ? TIP.orta() : TIP.ev(); // Bayraklı'nın kule dışı kesimi
    if (kod === 5) return z < 0.45 ? TIP.villa() : z < 0.8 ? TIP.orta() : TIP.ev(); // Bornova
    if (kod === 6) return z < 0.28 ? TIP.tas() : z < 0.75 ? TIP.ev() : TIP.orta(); // Buca: Levanten taş evler
    if (kod === 7) { // Gaziemir: depolar ve alçak konut
      if (yakin(x, y, 'serbest-bolge', 22) || yakin(x, y, 'havalimani', 26) || yakin(x, y, 'fuar-izmir', 20)) return z < 0.7 ? TIP.sanayi() : TIP.ev();
      return z < 0.3 ? TIP.orta() : TIP.ev();
    }
    if (kod === 8) return z < 0.7 ? TIP.kondu() : z < 0.9 ? TIP.ev() : TIP.orta(); // Karabağlar
    if (kod === 9) return z < 0.5 ? TIP.orta() : z < 0.8 ? TIP.villa() : TIP.site(); // Balçova
    if (kod === 10) return z < 0.35 ? TIP.site() : z < 0.75 ? TIP.villa() : TIP.orta(); // Narlıdere
    return TIP.ev();
  }
  const binalar = [];
  for (let gx = KX0 + 3; gx < KX1 - 2; gx += 3.5) {
    for (let gy = KY0 + 3; gy < KY1 - 2; gy += 3.5) {
      if (rnd() < 0.2) continue;
      const x = gx + (rnd() - 0.5) * 1.1, y = gy + (rnd() - 0.5) * 1.1;
      if (!karada(x, y, 6.6)) continue;
      if (yasaklar.some((d) => Math.hypot(x - d.x, y - d.y) < d.r)) continue;
      const kod = araziKodu(x, y), cu = caddeyeUzaklik(x, y);
      if (cu < 1.5) continue;
      // Yerleşim yalnızca merkezde, cadde boylarında ve yerlerin çevresinde; gerisi ağaçlık
      const merkeze = Math.hypot(x, y);
      const kentsel = kod !== 11 && (merkeze < 82 || yolaYakin(x, y) || IZ.YERLER.some((v) => Math.hypot(x - v.konum[0], y - v.konum[1]) < 22));
      if (!kentsel) {
        // Kırsal bitki örtüsü: batı kıyısında sazlık, güneybatı yamaçlarında zeytinlik, dağlarda çamlık
        const bolge = kod === 2 && x < SAZLIK_X ? 'sazlik' : kod === 8 || kod === 9 || kod === 10 || (kod === 11 && x < -20 && y < 0) ? 'zeytin' : kod === 11 || merkeze > 112 ? 'cam' : 'karisik';
        if (bolge === 'zeytin') {
          if (rnd() < 0.8) agaclar.push({ x: gx, y: gy, s: 0.7, renk: '#8a9a6a' });
          if (rnd() < 0.8) agaclar.push({ x: gx + 1.75, y: gy + 1.75, s: 0.65, renk: '#93a372' });
        } else if (bolge === 'cam') {
          if (rnd() < 0.42) agaclar.push({ x, y, s: 1 + rnd() * 0.8, cam: true });
        } else if (bolge === 'sazlik') {
          if (rnd() < 0.4) agaclar.push({ x, y, s: 0.4 + rnd() * 0.3, renk: '#a8b070' });
        } else if (rnd() < 0.3) agaclar.push({ x, y, s: 0.9 + rnd() * 0.9 });
        continue;
      }
      binalar.push(Object.assign({ x, y, ry: (rnd() - 0.5) * 0.5 }, binaTipi(x, y, kod, merkeze)));
      const son = binalar[binalar.length - 1];
      if (son.tur === 'villa' && rnd() < 0.7) agaclar.push({ x: x + 1.7, y: y + 0.5, s: 0.7 });
    }
  }
  const duvarRenk = ['#f6eee0', '#f1e4cd', '#f7dcc6', '#ecd0b0', '#f4f3ee', '#e2e9ec', '#f3cdb6', '#f6e3a9'];
  const camRenk = ['#9cc3d9', '#b4d3e2', '#8fb4cf'];
  const catiRenk = ['#c0583c', '#b24a33', '#cc6a48', '#a9452f'];
  const PALET = {
    kule: camRenk,
    eski: ['#f1e0b8', '#ecd0a0', '#f3d9b0', '#e7c79a', '#f6ead0'],
    apartman: ['#f6eee0', '#f7dcc6', '#f3cdb6', '#e2e9ec', '#f4f3ee', '#f6e3a9', '#dfe8d8'],
    ev: duvarRenk,
    kondu: ['#f3e2c0', '#e8b9a0', '#bcd6e2', '#f0d27e', '#d9e6c4', '#e9a98f', '#f4f0e6'],
    villa: ['#fbf7ef', '#f6eedd', '#f4e4d0', '#ffffff'],
    tas: ['#d9c9a3', '#cdbd97', '#e1d3b0'],
    site: ['#f4f3ee', '#e9eef1', '#f6eee0', '#dfe6ea'],
    sanayi: ['#c9d2d8', '#aeb7bc', '#dfe3e6', '#b9c9d6', '#e9e4d6']
  };
  const CATI_PALET = { kondu: ['#c0583c', '#9aa3a8', '#b24a33', '#8f989d'], tas: ['#a9452f', '#9c3f2b'], villa: ['#b24a33', '#c0583c'] };
  const binaMat = new THREE.MeshStandardMaterial({ color: '#ffffff', flatShading: true, roughness: 0.9, emissive: new THREE.Color('#ffc46b'), emissiveIntensity: 0 });
  const kutuGeo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
  const catiGeo = new THREE.ConeGeometry(0.7071 * 1.1, 1, 4).rotateY(Math.PI / 4).translate(0, 0.5, 0);
  const binaAg = new THREE.InstancedMesh(kutuGeo, binaMat, binalar.length);
  const catili = binalar.filter((b) => b.cati);
  const catiAg = new THREE.InstancedMesh(catiGeo, IZ.mat('#ffffff', { ozel: 'cati' }), catili.length);
  const kukla = new THREE.Object3D();
  const renk = new THREE.Color();
  binalar.forEach((b, i) => {
    kukla.position.copy(D(b.x, b.y));
    kukla.rotation.set(0, b.ry, 0);
    kukla.scale.set(b.w, b.h, b.d);
    kukla.updateMatrix();
    binaAg.setMatrixAt(i, kukla.matrix);
    const palet = PALET[b.tur] || duvarRenk;
    binaAg.setColorAt(i, renk.set(palet[Math.floor(rnd() * palet.length)]));
  });
  catili.forEach((b, i) => {
    kukla.position.copy(D(b.x, b.y, b.h));
    kukla.rotation.set(0, b.ry, 0);
    kukla.scale.set(b.w, 0.55 + rnd() * 0.3, b.d);
    kukla.updateMatrix();
    catiAg.setMatrixAt(i, kukla.matrix);
    const cp = CATI_PALET[b.tur] || catiRenk;
    catiAg.setColorAt(i, renk.set(cp[Math.floor(rnd() * cp.length)]));
  });
  [binaAg, catiAg].forEach((m) => { m.castShadow = true; m.receiveShadow = true; scene.add(m); });

  // Pencereler: gündüz koyu cam; gece bir kısmının ışığı yanar. Gökdelenlerde kat bantları.
  const pencere = { yanan: [], sonuk: [], bantYanan: [], bantSonuk: [] };
  const catiDonanim = [];
  binalar.forEach((b) => {
    const c = Math.cos(b.ry), s = Math.sin(b.ry);
    const dunya = (lx, lz) => [b.x + lx * c + lz * s, -b.y - lx * s + lz * c];
    if (b.cam) {
      for (let y = 0.45; y < b.h - 0.25; y += 0.5) {
        (rnd() < 0.62 ? pencere.bantYanan : pencere.bantSonuk).push({ x: b.x, y, z: -b.y, sx: b.w + 0.05, sy: 0.2, sz: b.d + 0.05, ry: b.ry });
      }
    } else {
      const kat = Math.max(1, Math.floor((b.h - 0.2) / 0.75));
      for (let yuz = 0; yuz < 4; yuz++) {
        const yan = yuz % 2 === 1, yon = yuz < 2 ? 1 : -1;
        const gen = yan ? b.d : b.w, derin = yan ? b.w : b.d;
        const adet = gen > 2.25 ? 2 : 1;
        for (let k = 0; k < kat; k++) {
          for (let i = 0; i < adet; i++) {
            const t = adet === 1 ? 0 : (i ? 0.24 : -0.24) * gen;
            const dis = (yon * derin) / 2 + yon * 0.02;
            const [x, z] = yan ? dunya(dis, t) : dunya(t, dis);
            (rnd() < 0.42 ? pencere.yanan : pencere.sonuk).push({ x, y: Math.min(0.5 + k * 0.75, b.h - 0.3), z, sx: 0.34, sy: 0.32, sz: 1, ry: b.ry + (yan ? (yon * Math.PI) / 2 : yon > 0 ? 0 : Math.PI) });
          }
        }
      }
      // Düz çatılarda güneş enerjili su ısıtıcısı
      if (!b.cati && b.tur !== 'sanayi' && rnd() < 0.8) {
        const [x, z] = dunya((rnd() - 0.5) * b.w * 0.4, (rnd() - 0.5) * b.d * 0.4);
        catiDonanim.push({ x, y: b.h, z, ry: b.ry });
      }
    }
  });
  // Ev pencereleri tek düzlemdir (kutuya göre altıda bir üçgen); kule bantları kutudur
  const duzlemGeo = new THREE.PlaneGeometry(1, 1), bantGeo = new THREE.BoxGeometry(1, 1, 1);
  const yananMat = IZ.mat('#40566b', { isik: '#ffcf7a', guc: 1.15, puruz: 0.4 }), sonukMat = IZ.mat('#3b4d60', { puruz: 0.4 });
  [[pencere.yanan, yananMat, duzlemGeo], [pencere.sonuk, sonukMat, duzlemGeo], [pencere.bantYanan, yananMat, bantGeo], [pencere.bantSonuk, sonukMat, bantGeo]].forEach(([liste, malzeme, geo]) => {
    const ag = new THREE.InstancedMesh(geo, malzeme, liste.length);
    liste.forEach((p, i) => {
      kukla.position.set(p.x, p.y, p.z);
      kukla.rotation.set(0, p.ry, 0);
      kukla.scale.set(p.sx, p.sy, p.sz);
      kukla.updateMatrix();
      ag.setMatrixAt(i, kukla.matrix);
    });
    scene.add(ag);
  });
  const depoAg = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.11, 0.11, 0.42, 6).rotateZ(Math.PI / 2).translate(0, 0.42, -0.12), IZ.mat('#dfe3e6', { ozel: 'depo', puruz: 0.5 }), catiDonanim.length);
  const panelGeo = new THREE.BoxGeometry(0.46, 0.03, 0.5).rotateX(0.6).translate(0, 0.2, 0.14);
  const panelAg = new THREE.InstancedMesh(panelGeo, IZ.mat('#27364f', { ozel: 'panel', puruz: 0.3 }), catiDonanim.length);
  catiDonanim.forEach((p, i) => {
    kukla.position.set(p.x, p.y, p.z);
    kukla.rotation.set(0, p.ry, 0);
    kukla.scale.set(1, 1, 1);
    kukla.updateMatrix();
    depoAg.setMatrixAt(i, kukla.matrix);
    panelAg.setMatrixAt(i, kukla.matrix);
  });
  [depoAg, panelAg].forEach((m) => { m.castShadow = true; scene.add(m); });

  // ---------- Ağaçlar ----------
  for (let i = 0; i < 46; i++) {
    const a = rnd() * Math.PI * 2, r = 2.8 + Math.sqrt(rnd()) * 5.6;
    agaclar.push({ x: PARK[0] + Math.cos(a) * r, y: PARK[1] + Math.sin(a) * r, s: 0.9 + rnd() * 0.6 });
  }
  for (let i = 0; i < 7; i++) {
    const a = 0.4 + (i / 7) * Math.PI * 2;
    agaclar.push({ x: MEYDAN[0] + Math.cos(a) * 6.1, y: MEYDAN[1] - Math.sin(a) * 6.1, s: 0.8 });
  }
  const govdeAg = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.1, 0.15, 1.3, 5).translate(0, 0.65, 0), IZ.mat('#8a6a4a', { ozel: 'govde' }), agaclar.length);
  const yaprakAg = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.75, 0).translate(0, 1.75, 0), IZ.mat('#ffffff', { ozel: 'yaprak' }), agaclar.length);
  const yesiller = ['#5fa052', '#6fb15c', '#4f9450', '#7dbb62'];
  agaclar.forEach((a, i) => {
    kukla.position.copy(D(a.x, a.y));
    kukla.rotation.set(0, rnd() * 6, 0);
    if (a.cam) kukla.scale.set(a.s * 0.8, a.s * 1.7, a.s * 0.8);
    else kukla.scale.set(a.s, a.palmiye ? a.s * 1.5 : a.s, a.s);
    kukla.updateMatrix();
    govdeAg.setMatrixAt(i, kukla.matrix);
    yaprakAg.setMatrixAt(i, kukla.matrix);
    yaprakAg.setColorAt(i, renk.set(a.cam ? (i % 2 ? '#3f7a4a' : '#4a8552') : a.renk || yesiller[Math.floor(rnd() * yesiller.length)]));
  });
  [govdeAg, yaprakAg].forEach((m) => { m.castShadow = true; scene.add(m); });

  // ---------- Kordon lambaları (gece yanar) ----------
  const direkAg = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.05, 1.5, 4).translate(0, 0.75, 0), IZ.mat('#4a4f55', { ozel: 'direk' }), lambalar.length);
  const ampulAg = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.17, 0).translate(0, 1.6, 0), IZ.mat('#fff3c4', { isik: '#ffdf8a', guc: 1.6 }), lambalar.length);
  lambalar.forEach((p, i) => {
    kukla.position.copy(p);
    kukla.rotation.set(0, 0, 0);
    kukla.scale.set(1, 1, 1);
    kukla.updateMatrix();
    direkAg.setMatrixAt(i, kukla.matrix);
    ampulAg.setMatrixAt(i, kukla.matrix);
  });
  scene.add(direkAg, ampulAg);

  // ---------- Gökyüzü: bulutlar, yıldızlar, güneş/ay ----------
  const bulutlar = [[-70, -122, 33], [-10, -126, 38], [45, -120, 35], [95, -124, 31], [-60, 134, 34], [10, 137, 37], [75, 132, 32], [-125, 60, 36]].map(([x, y, h], i) => {
    const g = new THREE.Group();
    [[0, 0, 0, 5], [4.5, -0.8, 1, 3.6], [-4.2, -1, -0.6, 3.2], [1.5, -1.2, 2.6, 2.8]].forEach(([bx, by, bz, r]) => {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), IZ.mat('#ffffff', { ozel: 'bulut' }));
      m.position.set(bx, by, bz);
      m.scale.y = 0.6;
      m.rotation.y = i + bx;
      g.add(m);
    });
    g.position.copy(D(x, y, h));
    scene.add(g);
    return g;
  });
  const yildizKonum = [];
  for (let i = 0; i < 500; i++) {
    const a = Math.random() * Math.PI * 2, e = 0.06 + Math.random() * 1.45;
    yildizKonum.push(Math.cos(a) * Math.cos(e) * 700, Math.sin(e) * 700, Math.sin(a) * Math.cos(e) * 700);
  }
  const yildizGeo = new THREE.BufferGeometry();
  yildizGeo.setAttribute('position', new THREE.Float32BufferAttribute(yildizKonum, 3));
  const yildizMat = new THREE.PointsMaterial({ color: '#ffffff', size: 1.7, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false });
  const yildizlar = new THREE.Points(yildizGeo, yildizMat);
  scene.add(yildizlar);
  const gokCismi = new THREE.Mesh(new THREE.SphereGeometry(18, 14, 10), new THREE.MeshBasicMaterial({ color: '#fff4e0', fog: false }));
  scene.add(gokCismi);
  // Körfez üstünde daireler çizen martılar
  const martiYerleri = [];
  for (let i = 0; martiYerleri.length < 10 && i < 400; i++) {
    const x = -75 + Math.random() * 110, y = -25 + Math.random() * 90;
    if (araziKodu(x, y) === 0 && araziKodu(x + 6, y) === 0 && araziKodu(x - 6, y) === 0 && araziKodu(x, y + 6) === 0 && araziKodu(x, y - 6) === 0) martiYerleri.push([x, y, 5 + Math.random() * 5, 7 + Math.random() * 5]);
  }
  const martilar = martiYerleri.map(([x, y, r, h], i) => {
    const g = new THREE.Group();
    g.add(IZ.koy(IZ.kutu(0.12, 0.08, 0.42, '#f4f4f4', { ozel: 'marti' }), 0, 0, 0));
    const kanatlar = [-1, 1].map((yon) => {
      const k = new THREE.Group();
      k.add(IZ.koy(IZ.kutu(0.6, 0.03, 0.2, '#ffffff', { ozel: 'marti' }), yon * 0.3, 0.04, 0));
      g.add(k);
      return k;
    });
    scene.add(g);
    return { g, kanatlar, merkez: D(x, y, h), r, hiz: (0.35 + (i % 4) * 0.08) * (i % 2 ? 1 : -1), faz: i * 1.7 };
  });
  function martiGuncelle(t) {
    martilar.forEach((m) => {
      const a = t * m.hiz + m.faz;
      m.g.position.set(m.merkez.x + Math.cos(a) * m.r, m.merkez.y + Math.sin(t * 0.7 + m.faz) * 0.8, m.merkez.z + Math.sin(a) * m.r);
      m.g.rotation.y = -a + (m.hiz > 0 ? Math.PI : 0);
      const cirpma = Math.sin(t * 7 + m.faz) * 0.5;
      m.kanatlar[0].rotation.z = -cirpma;
      m.kanatlar[1].rotation.z = cirpma;
    });
  }
  const beyaz = new THREE.Color('#ffffff');
  function gokGuncelle(dt) {
    bulutlar.forEach((b, i) => {
      b.position.x += dt * (0.6 + (i % 3) * 0.25);
      if (b.position.x > 135) b.position.x = -155;
    });
    yildizlar.position.copy(camera.position);
    yildizMat.opacity = Math.max(0, isikDuzeyi - 0.5) * 2;
    gokCismi.position.copy(gunes.position).normalize().multiplyScalar(620).add(gunes.target.position);
    gokCismi.material.color.copy(gunes.color).lerp(beyaz, 0.45);
  }

  // ---------- Yerler: modeller, iğneler, etiketler ----------
  const etiketKatmani = document.getElementById('etiketler');
  const semtler = COG.semtler.map(([ad, x, y]) => {
    const el = document.createElement('div');
    el.className = 'semt' + (ad === 'KÖRFEZ' ? ' su' : '');
    el.textContent = ad;
    etiketKatmani.appendChild(el);
    return { el, nokta: D(x, y, 0.5) };
  });
  const aydinlananlar = new Set();
  const yerler = IZ.YERLER.map((veri) => {
    const kat = IZ.KATEGORILER[veri.kategori];
    veri.hazir = !!IZ.yapilar[veri.id];
    const grup = veri.hazir ? IZ.yapilar[veri.id]() : IZ.igne(kat.renk);
    if (veri.hazir) IZ.birlestir(grup);
    grup.position.copy(D(veri.konum[0], veri.konum[1], veri.kot || 0));
    grup.rotation.y = veri.donus || 0;
    // Etiket, modelin tepesinin biraz üstünde durur
    veri.boy = new THREE.Box3().setFromObject(grup).max.y - (veri.kot || 0) + 1.2;
    grup.userData.yerId = veri.id;
    scene.add(grup);
    // Gece simge yapılar hafifçe aydınlanır (projektör etkisi)
    grup.traverse((o) => {
      if (o.isMesh && !o.material.userData.guc && !aydinlananlar.has(o.material)) {
        if (!o.material.vertexColors) o.material.emissive.copy(o.material.color);
        o.material.emissiveIntensity = 0;
        aydinlananlar.add(o.material);
      }
    });

    const etiket = document.createElement('button');
    etiket.className = 'etiket' + (veri.hazir ? '' : ' sirada');
    etiket.textContent = veri.ad;
    etiket.style.setProperty('--renk', kat.renk);
    etiket.addEventListener('click', () => (IZ.sahne.tiklamaYakala ? IZ.sahne.tiklamaYakala(veri) : sec(veri.id)));
    etiketKatmani.appendChild(etiket);

    return { veri, grup, etiket, capa: D(veri.konum[0], veri.konum[1], (veri.kot || 0) + veri.boy), olcek: 1 };
  });
  const yerBul = (id) => yerler.find((y) => y.veri.id === id);

  // ---------- Hareketli öğeler: vapur, tramvay, arabalar ----------
  // Modellerin önü yerel +x yönündedir.
  function vapurModeli() {
    const g = new THREE.Group();
    g.add(IZ.kutu(5.2, 0.85, 1.8, '#f4f4f0'));
    g.add(IZ.kutu(5.26, 0.25, 1.86, '#1f5f8b'));
    g.add(IZ.koy(IZ.kutu(3.6, 0.75, 1.5, '#ffffff'), -0.1, 0.85, 0));
    g.add(IZ.koy(IZ.kutu(3.64, 0.32, 1.54, '#35526b', { isik: '#ffd27a' }), -0.1, 1.1, 0));
    g.add(IZ.koy(IZ.kutu(1.6, 0.6, 1.1, '#ffffff'), 0.5, 1.6, 0));
    g.add(IZ.koy(IZ.kutu(1.64, 0.25, 1.14, '#35526b', { isik: '#ffd27a' }), 0.5, 1.8, 0));
    g.add(IZ.koy(IZ.silindir(0.22, 0.27, 0.9, 6, '#e8a23a'), -0.9, 1.6, 0));
    return g;
  }
  function tramvayModeli(serit) {
    const g = new THREE.Group();
    g.add(IZ.koy(IZ.kutu(0.5, 0.04, 0.04, '#3a3f45'), 0, 1.1, 0));
    g.add(IZ.koy(IZ.kutu(0.04, 0.4, 0.04, '#3a3f45'), 0, 0.7, 0));
    for (const x of [-1.2, 1.2]) {
      g.add(IZ.koy(IZ.kutu(2.25, 0.62, 0.55, '#f4f4f0'), x, 0.08, 0));
      g.add(IZ.koy(IZ.kutu(2.27, 0.16, 0.57, serit || '#1aa3a3'), x, 0.1, 0));
      g.add(IZ.koy(IZ.kutu(2.0, 0.24, 0.58, '#2b3a4a', { isik: '#ffe9b0' }), x, 0.4, 0));
    }
    g.add(IZ.koy(IZ.kutu(0.2, 0.4, 0.4, '#555b62'), 0, 0.15, 0));
    return g;
  }
  function arabaModeli(renk) {
    const g = new THREE.Group();
    g.add(IZ.koy(IZ.kutu(0.95, 0.26, 0.46, renk), 0, 0.06, 0));
    g.add(IZ.koy(IZ.kutu(0.5, 0.2, 0.4, '#2b3a4a'), -0.05, 0.32, 0));
    g.add(IZ.koy(IZ.kutu(0.05, 0.1, 0.4, '#fff6c8', { isik: '#fff2b0' }), 0.47, 0.14, 0));
    return g;
  }
  function rota(noktalar, y) {
    return new THREE.CatmullRomCurve3(noktalar.map((p) => D(p[0], p[1], y)));
  }

  function iskeleNoktasi(id, uzak) {
    const k = COG.konum[id], n = COG.yon[id];
    return [k[0] + n[0] * uzak, k[1] + n[1] * uzak];
  }
  function vapurRota(a, ua, b, ub) {
    const p = iskeleNoktasi(a, ua), q = iskeleNoktasi(b, ub);
    return rota([p, [(p[0] * 2 + q[0]) / 3, (p[1] * 2 + q[1]) / 3], [(p[0] + q[0] * 2) / 3, (p[1] + q[1] * 2) / 3], q], -0.75);
  }
  const hareketliler = [];
  function hareketli(nesne, egri, o) {
    scene.add(nesne);
    hareketliler.push(Object.assign({ nesne, egri, uzunluk: egri.getLength(), u: 0, yon: 1, hiz: 5, bekle: 0, durak: 0, yan: 0, aci: null }, o));
  }
  // Vapurlar: Konak-Karşıyaka ve Pasaport-Bayraklı
  hareketli(vapurModeli(), vapurRota('konak-pier', 20, 'karsiyaka-iskele', 8), { hiz: 4.5, durak: 4, salinim: true });
  hareketli(vapurModeli(), vapurRota('pasaport', 15, 'bostanli', 9), { hiz: 4.5, durak: 4, salinim: true, u: 1, yon: -1 });
  const arabaRenk = ['#d2452f', '#f2f2ee', '#2f7fd1', '#f0b429', '#3f4a56', '#3d8b7d', '#ffffff', '#8e5bb5'];
  // Tramvaylar ve trenler gerçek hatlarda gidip gelir
  const rayEgri = (z) => new THREE.CatmullRomCurve3(z.map((p) => D(p[0], p[1], 0.09)), false, 'catmullrom', 0.1);
  (COG.yollar.tramvay || []).slice(0, 5).forEach((z, i) => {
    const e = rayEgri(z);
    hareketli(tramvayModeli(i % 2 ? '#e0703a' : null), e, { hiz: 3.8, durak: 3, ciftYon: true, u: 0.2, yan: 0.22 });
    if (e.getLength() > 28) hareketli(tramvayModeli(i % 2 ? '#e0703a' : null), e, { hiz: 3.8, durak: 3, ciftYon: true, u: 0.8, yon: -1, yan: -0.22 });
  });
  function trenModeli(serit) {
    const g = new THREE.Group();
    for (const x of [-2.5, 0, 2.5]) {
      g.add(IZ.koy(IZ.kutu(2.35, 0.7, 0.6, '#f4f4f0'), x, 0.08, 0));
      g.add(IZ.koy(IZ.kutu(2.37, 0.18, 0.62, serit || '#1f5fa8'), x, 0.1, 0));
      g.add(IZ.koy(IZ.kutu(2.1, 0.26, 0.63, '#2b3a4a', { isik: '#ffe9b0' }), x, 0.44, 0));
      g.add(IZ.koy(IZ.kutu(2.2, 0.06, 0.5, '#d9dde0'), x, 0.78, 0));
    }
    return g;
  }
  (COG.yollar.tren || []).slice(0, 4).forEach((z, i) => {
    hareketli(trenModeli(), rayEgri(z), { hiz: 6, durak: 4, ciftYon: true, u: i % 2 ? 0.7 : 0.15, yon: i % 2 ? -1 : 1 });
  });
  (COG.yollar.metro || []).slice(0, 2).forEach((z, i) => {
    hareketli(trenModeli('#c8402f'), rayEgri(z), { hiz: 6.5, durak: 3, ciftYon: true, u: i ? 0.6 : 0.2, yon: i ? -1 : 1 });
  });
  // Otobüsler ve şehir içi trafik: ana caddelerde gidip gelir
  function otobusModeli() {
    const g = new THREE.Group();
    g.add(IZ.koy(IZ.kutu(1.7, 0.5, 0.5, '#f4f4f0'), 0, 0.1, 0));
    g.add(IZ.koy(IZ.kutu(1.72, 0.14, 0.52, '#1aa3a3'), 0, 0.12, 0));
    g.add(IZ.koy(IZ.kutu(1.5, 0.2, 0.53, '#2b3a4a', { isik: '#ffe9b0' }), 0.05, 0.34, 0));
    g.add(IZ.koy(IZ.kutu(0.06, 0.24, 0.44, '#2b3a4a'), 0.85, 0.3, 0));
    g.add(IZ.koy(IZ.kutu(0.05, 0.08, 0.44, '#fff6c8', { isik: '#fff2b0' }), 0.86, 0.14, 0));
    g.add(IZ.koy(IZ.kutu(0.5, 0.08, 0.3, '#d9dde0'), -0.3, 0.6, 0));
    return g;
  }
  const yol = (n) => new THREE.CatmullRomCurve3(n.map((p) => D(p[0], p[1], 0.07)), false, 'catmullrom', 0.12);
  const otobusHatlari = (COG.yollar.cadde || []).slice(0, 6).map(yol);
  const arabaHatlari = (COG.yollar.otoyol || []).slice(0, 6).concat((COG.yollar.cadde || []).slice(0, 5)).map(yol);
  [[0, 0.1, 1], [0, 0.6, -1], [1, 0.2, 1], [1, 0.75, -1], [2, 0.4, 1], [3, 0.5, -1], [4, 0.3, 1], [5, 0.6, -1]].forEach(([h, u, yon]) => {
    if (otobusHatlari[h]) hareketli(otobusModeli(), otobusHatlari[h], { hiz: 4.2, durak: 2.5, yan: 0.3, u, yon });
  });
  for (let i = 0; i < 34 && arabaHatlari.length; i++) {
    hareketli(arabaModeli(arabaRenk[(i * 3) % arabaRenk.length]), arabaHatlari[i % arabaHatlari.length], { hiz: 4.8 + rnd() * 2.5, durak: 0.5, yan: 0.32, u: rnd(), yon: i % 2 ? 1 : -1 });
  }
  const teget = new THREE.Vector3();
  const nokta = new THREE.Vector3();
  function hareketGuncelle(dt, t) {
    hareketliler.forEach((h, i) => {
      if (h.bekle > 0) h.bekle -= dt;
      else {
        h.u += (h.yon * h.hiz * dt) / h.uzunluk;
        if (h.dongu) h.u = (h.u + 1) % 1;
        else if (h.u >= 1 || h.u <= 0) {
          h.u = Math.min(1, Math.max(0, h.u));
          h.yon = -h.yon;
          h.bekle = h.durak;
        }
      }
      h.egri.getPointAt(h.u, nokta);
      h.egri.getTangentAt(h.u, teget);
      const k = h.ciftYon ? 1 : h.yon;
      const tx = teget.x * k, tz = teget.z * k;
      h.nesne.position.set(nokta.x - tz * h.yan, nokta.y + (h.salinim ? Math.sin(t * 1.5 + i) * 0.05 : 0), nokta.z + tx * h.yan);
      const hedefAci = Math.atan2(-tz, tx);
      if (h.aci === null) h.aci = hedefAci;
      let fark = hedefAci - h.aci;
      fark = Math.atan2(Math.sin(fark), Math.cos(fark));
      h.aci += fark * Math.min(1, dt * (h.salinim ? 1.2 : 8));
      h.nesne.rotation.y = h.aci;
    });
  }

  // ---------- Gün modları ----------
  const MODLAR = {
    gunduz: { gok: '#bfe6f7', gunes: '#fff4e0', gunesSiddet: 1.9, gunesKonum: [-70, 110, 60], hemiUst: '#ffffff', hemiAlt: '#b9a98a', hemiSiddet: 0.9, su: '#4aa9d8', isik: 0 },
    gunbatimi: { gok: '#f6b98c', gunes: '#ff9350', gunesSiddet: 1.7, gunesKonum: [-150, 34, -40], hemiUst: '#ffdcbc', hemiAlt: '#8d7480', hemiSiddet: 0.95, su: '#c9937f', isik: 0.4 },
    gece: { gok: '#0c1830', gunes: '#8fb0ff', gunesSiddet: 0.45, gunesKonum: [60, 100, -70], hemiUst: '#42598f', hemiAlt: '#101829', hemiSiddet: 0.8, su: '#143560', isik: 1 }
  };
  let hedef = MODLAR.gunduz;
  let isikDuzeyi = 0;
  const gecici = new THREE.Color();
  const geciciV = new THREE.Vector3();
  function modGecis(k) {
    scene.background.lerp(gecici.set(hedef.gok), k);
    scene.fog.color.copy(scene.background);
    gunes.color.lerp(gecici.set(hedef.gunes), k);
    gunes.intensity += (hedef.gunesSiddet - gunes.intensity) * k;
    gunes.position.lerp(geciciV.fromArray(hedef.gunesKonum), k);
    gok.color.lerp(gecici.set(hedef.hemiUst), k);
    gok.groundColor.lerp(gecici.set(hedef.hemiAlt), k);
    gok.intensity += (hedef.hemiSiddet - gok.intensity) * k;
    suMat.color.lerp(gecici.set(hedef.su), k);
    isikDuzeyi += (hedef.isik - isikDuzeyi) * k;
    IZ.isikliMalzemeler.forEach((m) => (m.emissiveIntensity = isikDuzeyi * 1.6 * m.userData.guc));
    binaMat.emissiveIntensity = isikDuzeyi * 0.07;
    const projektor = Math.max(0, isikDuzeyi - 0.4) * 0.4;
    aydinlananlar.forEach((m) => (m.emissiveIntensity = projektor));
  }

  // ---------- Arayüz ----------
  const kapaliKategoriler = new Set();
  const cipler = document.getElementById('cipler');
  Object.entries(IZ.KATEGORILER).forEach(([anahtar, kat]) => {
    const b = document.createElement('button');
    b.className = 'cip acik';
    b.style.setProperty('--renk', kat.renk);
    b.textContent = kat.ad;
    b.setAttribute('aria-pressed', 'true');
    b.addEventListener('click', () => {
      const kapat = !kapaliKategoriler.has(anahtar);
      kapat ? kapaliKategoriler.add(anahtar) : kapaliKategoriler.delete(anahtar);
      b.classList.toggle('acik', !kapat);
      b.setAttribute('aria-pressed', String(!kapat));
      yerler.forEach((y) => { if (y.veri.kategori === anahtar) y.grup.visible = !kapat; });
      listeyiCiz();
    });
    cipler.appendChild(b);
  });

  const liste = document.getElementById('liste');
  const ara = document.getElementById('ara');
  ara.addEventListener('input', listeyiCiz);
  function ilceyeGit(ilce) {
    const g = yerler.filter((y) => y.veri.ilce === ilce);
    const orta = new THREE.Vector3();
    g.forEach((y) => orta.add(y.grup.position));
    orta.divideScalar(g.length).setY(0);
    const yon = camera.position.clone().sub(controls.target).normalize();
    if (yon.y < 0.55) { yon.y = 0.55; yon.normalize(); }
    turDurdur();
    kartiKapat();
    ucus = { t: 0, n0: controls.target.clone(), n1: orta, k0: camera.position.clone(), k1: orta.clone().addScaledVector(yon, 85) };
    if (darEkran.matches) sol.classList.add('kapali');
  }
  function listeyiCiz() {
    liste.innerHTML = '';
    const aranan = ara.value.trim().toLocaleLowerCase('tr');
    const gorunen = yerler.filter((y) => y.grup.visible && (!aranan || (y.veri.ad + ' ' + y.veri.semt + ' ' + y.veri.ilce).toLocaleLowerCase('tr').includes(aranan)));
    if (!gorunen.length) {
      const li = document.createElement('li');
      li.className = 'bos';
      li.textContent = 'Eşleşen yer yok.';
      liste.appendChild(li);
    }
    let sonIlce = null;
    gorunen.forEach((y) => {
      if (y.veri.ilce !== sonIlce) {
        sonIlce = y.veri.ilce;
        const bas = document.createElement('li');
        const bb = document.createElement('button');
        bb.className = 'ilce';
        bb.textContent = sonIlce;
        bb.title = sonIlce + ' ilçesine git';
        const ilce = sonIlce;
        bb.addEventListener('click', () => ilceyeGit(ilce));
        bas.appendChild(bb);
        liste.appendChild(bas);
      }
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.innerHTML = '<i style="background:' + IZ.KATEGORILER[y.veri.kategori].renk + '"></i>';
      b.appendChild(document.createTextNode(y.veri.ad));
      if (!y.veri.hazir) b.classList.add('sirada');
      if (IZ.defter && IZ.defter.gezildi(y.veri.id)) b.classList.add('gezildi');
      b.addEventListener('click', () => sec(y.veri.id));
      li.appendChild(b);
      liste.appendChild(li);
    });
  }
  listeyiCiz();

  document.querySelectorAll('#modlar button').forEach((b) => {
    b.addEventListener('click', () => {
      hedef = MODLAR[b.dataset.mod];
      document.querySelectorAll('#modlar button').forEach((x) => x.classList.toggle('secili', x === b));
      document.body.classList.toggle('gece', b.dataset.mod === 'gece');
    });
  });

  // Bilgi kartındaki küçük harita: ilçelerin gerçek sınırları (stilize 3B haritadan farklı olarak coğrafi)
  const ilceYollari = {};
  (function () {
    const h = IZ.ILCE_HARITA, svg = document.getElementById('ilceHarita');
    if (!h) { document.getElementById('kartHarita').hidden = true; return; }
    svg.setAttribute('viewBox', '-6 -6 ' + (h.en + 12) + ' ' + (h.boy + 12));
    Object.keys(h.yol).forEach((ad) => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', h.yol[ad]);
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      t.textContent = ad;
      p.appendChild(t);
      p.addEventListener('click', () => { if (IZ.ILCELER.includes(ad)) ilceyeGit(ad); });
      svg.appendChild(p);
      ilceYollari[ad] = p;
    });
  })();
  function ilceHaritasiniGuncelle(ilce) {
    Object.keys(ilceYollari).forEach((ad) => ilceYollari[ad].classList.toggle('secili', ad === ilce));
    const n = yerler.filter((y) => y.veri.ilce === ilce).length;
    document.getElementById('ilceHaritaAd').innerHTML = '<b></b>Gerçek haritadaki yeri. Bu ilçeden ' + n + ' yer var.';
    document.querySelector('#ilceHaritaAd b').textContent = ilce;
  }

  const kart = document.getElementById('kart');
  let secili = null;
  let ucus = null;
  function sec(id) {
    const y = yerBul(id);
    if (!y) return;
    secili = y;
    const kat = IZ.KATEGORILER[y.veri.kategori];
    document.getElementById('kartKat').textContent = kat.ad;
    document.getElementById('kartKat').style.background = kat.renk;
    document.getElementById('kartAd').textContent = y.veri.ad;
    document.getElementById('kartMeta').textContent = [y.veri.semt, y.veri.semt.includes(y.veri.ilce) ? '' : y.veri.ilce, y.veri.yil].filter(Boolean).join(' · ');
    document.getElementById('kartAciklama').textContent = y.veri.aciklama;
    document.getElementById('kartDurum').textContent = y.veri.hazir ? '' : '3B modeli sırada; şimdilik iğne ile gösteriliyor.';
    ilceHaritasiniGuncelle(y.veri.ilce);
    kart.hidden = false;
    // Keşif defteri (js/defter.js): oyun dışında açılan her kart deftere işlenir
    if (IZ.sahne && IZ.sahne.yerSecildi && !IZ.sahne.oyunAktif) IZ.sahne.yerSecildi(y.veri);
    history.replaceState(null, '', '#' + id);
    if (darEkran.matches) sol.classList.add('kapali');

    const hedefNokta = y.grup.position.clone().setY((y.veri.kot || 0) + 3);
    const yon = camera.position.clone().sub(controls.target).normalize();
    if (yon.y < 0.45) { yon.y = 0.45; yon.normalize(); }
    ucus = { t: 0, n0: controls.target.clone(), n1: hedefNokta, k0: camera.position.clone(), k1: hedefNokta.clone().addScaledVector(yon, 46) };
  }
  // Gezinme: kapat, tüm harita, önceki/sonraki, otomatik tur
  const BAS_KAMERA = new THREE.Vector3(-88, 58, -12), BAS_HEDEF = new THREE.Vector3(0, 0, -22);

  // ---------- Gezinme: klavye, ekran düğmeleri, küçük harita ----------
  // Ok tuşları ya da WASD kaydırır, Q/E döndürür, + ve - yakınlaştırır. Ekran düğmeleri aynı işi yapar.
  const GEZ_TUS = {
    ArrowUp: 'ileri', w: 'ileri', W: 'ileri', ArrowDown: 'geri', s: 'geri', S: 'geri', ArrowLeft: 'sol', a: 'sol', A: 'sol', ArrowRight: 'sag', d: 'sag', D: 'sag',
    q: 'donSol', Q: 'donSol', e: 'donSag', E: 'donSag', '+': 'yakin', '=': 'yakin', '-': 'uzak', _: 'uzak'
  };
  const gezTus = { ileri: false, geri: false, sol: false, sag: false, donSol: false, donSag: false, yakin: false, uzak: false };
  const gezV = new THREE.Vector3(), gezYan = new THREE.Vector3(), gezOfs = new THREE.Vector3(), DIKEY = new THREE.Vector3(0, 1, 0);
  function gezinmeGuncelle(dt) {
    const t = gezTus;
    if (!(t.ileri || t.geri || t.sol || t.sag || t.donSol || t.donSag || t.yakin || t.uzak)) return;
    ucus = null;
    gezOfs.copy(camera.position).sub(controls.target);
    const uzaklik = gezOfs.length();
    // Kaydırma: kameranın baktığı yöne göre, yerde
    gezV.set(-gezOfs.x, 0, -gezOfs.z).normalize();
    gezYan.crossVectors(gezV, DIKEY);
    const hiz = Math.max(10, uzaklik * 0.5) * dt;
    const ileri = (t.ileri ? 1 : 0) - (t.geri ? 1 : 0), yan = (t.sag ? 1 : 0) - (t.sol ? 1 : 0);
    controls.target.addScaledVector(gezV, ileri * hiz).addScaledVector(gezYan, yan * hiz);
    // Döndürme ve yakınlaşma: kamera hedefin çevresinde
    const don = ((t.donSag ? 1 : 0) - (t.donSol ? 1 : 0)) * 1.0 * dt;
    if (don) gezOfs.applyAxisAngle(DIKEY, don);
    const yakinlas = (t.yakin ? 1 : 0) - (t.uzak ? 1 : 0);
    if (yakinlas) gezOfs.setLength(Math.min(controls.maxDistance, Math.max(controls.minDistance, uzaklik * (1 - yakinlas * 0.75 * dt))));
    camera.position.copy(controls.target).add(gezOfs);
  }
  // Ekran düğmeleri: basılı tutunca sürer
  document.querySelectorAll('#gezinme button[data-g]').forEach((b) => {
    const ayarla = (durum) => (e) => { gezTus[b.dataset.g] = durum; if (durum) turDurdur(); e.preventDefault(); };
    b.addEventListener('pointerdown', ayarla(true));
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((olay) => b.addEventListener(olay, ayarla(false)));
  });
  // Kuzey yukarı: kamerayı hedefin güneyine alır
  document.getElementById('kuzey').addEventListener('click', () => {
    turDurdur();
    const ofs = camera.position.clone().sub(controls.target);
    const yatay = Math.hypot(ofs.x, ofs.z);
    ucus = { t: 0, n0: controls.target.clone(), n1: controls.target.clone(), k0: camera.position.clone(), k1: controls.target.clone().add(new THREE.Vector3(0, ofs.y, yatay)) };
  });

  // Küçük harita: tıklanan yere gider; nokta kameranın baktığı yeri, çizgi bakış yönünü gösterir
  const kucuk = document.getElementById('kucukHaritaCizim');
  const SVGNS = 'http://www.w3.org/2000/svg';
  kucuk.setAttribute('viewBox', KX0 + ' ' + -KY1 + ' ' + (KX1 - KX0) + ' ' + (KY1 - KY0));
  COG.parcalar.forEach((p) => {
    const yol = document.createElementNS(SVGNS, 'path');
    yol.setAttribute('d', 'M' + p.halka.map((q) => q[0] + ' ' + -q[1]).join('L') + 'Z');
    if (p.kod === 11) yol.setAttribute('class', 'dis');
    else {
      const baslik = document.createElementNS(SVGNS, 'title');
      baslik.textContent = p.ad;
      yol.appendChild(baslik);
    }
    kucuk.appendChild(yol);
  });
  IZ.YERLER.forEach((v) => {
    const c = document.createElementNS(SVGNS, 'circle');
    c.setAttribute('cx', v.konum[0]);
    c.setAttribute('cy', -v.konum[1]);
    c.setAttribute('r', 3);
    c.setAttribute('fill', IZ.KATEGORILER[v.kategori].renk);
    kucuk.appendChild(c);
  });
  const bakis = document.createElementNS(SVGNS, 'line'), buradayim = document.createElementNS(SVGNS, 'circle');
  bakis.setAttribute('class', 'bakis');
  buradayim.setAttribute('class', 'burada');
  buradayim.setAttribute('r', 9);
  kucuk.appendChild(bakis);
  kucuk.appendChild(buradayim);
  function hedefeGit(x, z) {
    turDurdur();
    const ofs = camera.position.clone().sub(controls.target);
    const n1 = new THREE.Vector3(Math.min(KX1 - 4, Math.max(KX0 + 4, x)), 0, Math.min(-KY0 - 4, Math.max(-KY1 + 4, z)));
    ucus = { t: 0, n0: controls.target.clone(), n1, k0: camera.position.clone(), k1: n1.clone().add(ofs) };
  }
  kucuk.addEventListener('click', (e) => {
    const m = kucuk.getScreenCTM();
    if (!m) return;
    const n = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    hedefeGit(n.x, n.y); // SVG y = dünya z
  });
  function kucukHaritaGuncelle() {
    const h = controls.target, k = camera.position;
    buradayim.setAttribute('cx', h.x);
    buradayim.setAttribute('cy', h.z);
    const dx = h.x - k.x, dz = h.z - k.z, L = Math.hypot(dx, dz) || 1;
    bakis.setAttribute('x1', h.x - (dx / L) * 22);
    bakis.setAttribute('y1', h.z - (dz / L) * 22);
    bakis.setAttribute('x2', h.x);
    bakis.setAttribute('y2', h.z);
  }
  const sol = document.getElementById('sol');
  const darEkran = window.matchMedia('(max-width: 720px)');
  if (darEkran.matches) sol.classList.add('kapali');
  document.getElementById('listeDugme').addEventListener('click', () => sol.classList.toggle('kapali'));

  function kartiKapat() {
    kart.hidden = true;
    secili = null;
    history.replaceState(null, '', location.pathname + location.search);
  }
  function komsu(adim) {
    const g = yerler.filter((y) => y.grup.visible);
    if (!g.length) return;
    const i = g.indexOf(secili);
    sec(g[(i + adim + g.length) % g.length].veri.id);
  }
  const turDugme = document.getElementById('tur');
  let turZaman = null;
  function turDurdur() {
    if (turZaman === null) return;
    turZaman = null;
    controls.autoRotate = false;
    turDugme.textContent = '▶ Tur';
  }
  function turBaslat() {
    turZaman = 0;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    turDugme.textContent = '■ Turu durdur';
    komsu(1);
  }
  turDugme.addEventListener('click', () => (turZaman === null ? turBaslat() : turDurdur()));
  document.getElementById('tumHarita').addEventListener('click', () => {
    turDurdur();
    kartiKapat();
    ucus = { t: 0, n0: controls.target.clone(), n1: BAS_HEDEF.clone(), k0: camera.position.clone(), k1: BAS_KAMERA.clone() };
  });
  document.getElementById('kartKapat').addEventListener('click', () => { turDurdur(); kartiKapat(); });
  document.getElementById('onceki').addEventListener('click', () => { turDurdur(); komsu(-1); });
  document.getElementById('sonraki').addEventListener('click', () => { turDurdur(); komsu(1); });
  window.addEventListener('keydown', (e) => {
    if (IZ.sahne.kameraSerbest) return; // uçuş ve vapur oyunları kendi tuşlarını dinler
    const oyunda = IZ.sahne.oyunAktif;
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'Escape') { turDurdur(); kartiKapat(); }
    else if (e.key === 'PageDown' && !oyunda) { turDurdur(); komsu(1); e.preventDefault(); }
    else if (e.key === 'PageUp' && !oyunda) { turDurdur(); komsu(-1); e.preventDefault(); }
    else if (GEZ_TUS[e.key]) { gezTus[GEZ_TUS[e.key]] = true; turDurdur(); e.preventDefault(); }
  });
  window.addEventListener('keyup', (e) => { if (GEZ_TUS[e.key]) gezTus[GEZ_TUS[e.key]] = false; });
  window.addEventListener('blur', () => { Object.keys(gezTus).forEach((k) => { gezTus[k] = false; }); });
  tuval.addEventListener('wheel', turDurdur, { passive: true });

  // Tıklama ve üzerine gelme
  const isin = new THREE.Raycaster();
  const fare = new THREE.Vector2();
  let basis = null, uzerinde = null;
  function yerYakala(e) {
    fare.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    isin.setFromCamera(fare, camera);
    const isabet = isin.intersectObjects(yerler.filter((y) => y.grup.visible).map((y) => y.grup), true)[0];
    if (!isabet) {
      let en = 34, bulunan = null;
      yerler.forEach((y) => {
        if (!y.ekranda || !y.grup.visible) return;
        const d = Math.hypot(e.clientX - y.ex, e.clientY - y.ey - 16);
        if (d < en) { en = d; bulunan = y; }
      });
      return bulunan;
    }
    let o = isabet.object;
    while (o && !o.userData.yerId) o = o.parent;
    return o ? yerBul(o.userData.yerId) : null;
  }
  tuval.addEventListener('pointerdown', (e) => { basis = [e.clientX, e.clientY]; turDurdur(); });
  tuval.addEventListener('pointerup', (e) => {
    if (!basis || Math.hypot(e.clientX - basis[0], e.clientY - basis[1]) > 5) return;
    const y = yerYakala(e);
    // Oyun sırasında tıklama oyuna gider
    if (IZ.sahne.tiklamaYakala) IZ.sahne.tiklamaYakala(y ? y.veri : null);
    else if (y) sec(y.veri.id);
  });
  tuval.addEventListener('pointermove', (e) => {
    uzerinde = yerYakala(e);
    tuval.style.cursor = uzerinde ? 'pointer' : 'grab';
  });

  // ---------- Döngü ----------
  const saat = new THREE.Clock();
  const suKonum = suGeo.attributes.position;
  const v = new THREE.Vector3();
  let kareSayisi = 0;
  function kare() {
    const dt = Math.min(saat.getDelta(), 0.05);
    const t = saat.elapsedTime;

    for (let i = 0; i < suKonum.count; i++) {
      const x = suKonum.getX(i), z = suKonum.getZ(i);
      suKonum.setY(i, Math.sin(x * 0.16 + t * 0.9) * 0.11 + Math.cos(z * 0.19 + t * 1.2) * 0.11);
    }
    suKonum.needsUpdate = true;

    modGecis(1 - Math.exp(-dt * 3));
    hareketGuncelle(dt, t);
    gokGuncelle(dt);
    martiGuncelle(t);
    if (turZaman !== null) {
      turZaman += dt;
      if (turZaman > 7) { turZaman = 0; komsu(1); }
    }

    if (!IZ.sahne || !IZ.sahne.kameraSerbest) gezinmeGuncelle(dt);
    if (ucus) {
      ucus.t = Math.min(1, ucus.t + dt / 1.1);
      const k = ucus.t < 0.5 ? 2 * ucus.t * ucus.t : 1 - Math.pow(-2 * ucus.t + 2, 2) / 2;
      controls.target.lerpVectors(ucus.n0, ucus.n1, k);
      camera.position.lerpVectors(ucus.k0, ucus.k1, k);
      if (ucus.t >= 1) ucus = null;
    }
    if (!(IZ.sahne && IZ.sahne.kameraSerbest)) {
      // Bakılan nokta haritanın dışına ve yerin altına kaçmasın
      const h = controls.target;
      h.set(Math.min(KX1 - 2, Math.max(KX0 + 2, h.x)), Math.min(30, Math.max(0, h.y)), Math.min(-KY0 - 2, Math.max(-KY1 + 2, h.z)));
      controls.update(); // uçuş oyununda kamerayı oyun yönetir
    }
    kucukHaritaGuncelle();

    const w = window.innerWidth, h = window.innerHeight;
    yerler.forEach((y) => {
      const hedefOlcek = y === uzerinde || y === secili ? 1.08 : 1;
      y.olcek += (hedefOlcek - y.olcek) * 0.2;
      y.grup.scale.setScalar(y.olcek);
      if (y.grup.userData.guncelle) y.grup.userData.guncelle(t);
      if (y.grup.userData.igne) y.grup.position.y = (y.veri.kot || 0) + 0.5 + Math.sin(t * 2 + y.veri.konum[0]) * 0.25;
      v.copy(y.capa).project(camera);
      y.ekranda = y.grup.visible && v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
      y.ex = ((v.x + 1) / 2) * w;
      y.ey = ((1 - v.y) / 2) * h;
      y.uzaklik = y === secili ? -1 : y.capa.distanceTo(camera.position);
      y.etiket.classList.toggle('secili', y === secili);
    });
    // Semt adları: yalnızca uzaktan bakarken görünür
    const uzak = camera.position.distanceTo(controls.target) > 62;
    semtler.forEach((s) => {
      v.copy(s.nokta).project(camera);
      const goster = uzak && v.z < 1 && Math.abs(v.x) < 1 && Math.abs(v.y) < 1;
      s.el.style.display = goster ? '' : 'none';
      if (goster) s.el.style.transform = 'translate(' + ((v.x + 1) / 2) * w + 'px,' + ((1 - v.y) / 2) * h + 'px) translate(-50%,-50%)';
    });
    // Üst üste binen etiketlerden kameraya yakın olan kalır
    const yerlesen = [];
    yerler.slice().sort((a, b) => a.uzaklik - b.uzaklik).forEach((y) => {
      const gen = y.veri.ad.length * 7 + 26;
      const goster = y.ekranda && !yerlesen.some((o) => Math.abs(o.ex - y.ex) < (o.gen + gen) / 2 && Math.abs(o.ey - y.ey) < 26);
      y.etiket.style.display = goster ? '' : 'none';
      if (goster) {
        y.gen = gen;
        yerlesen.push(y);
        y.etiket.style.transform = 'translate(' + y.ex + 'px,' + y.ey + 'px) translate(-50%,-100%)';
      }
    });

    if (IZ.sahne) IZ.sahne.kareler.forEach((f) => f(dt, t));
    // Gölgeler: gün modu değişirken her kare, diğer zamanlarda altı karede bir
    kareSayisi++;
    if (kareSayisi < 4 || kareSayisi % 6 === 0 || Math.abs(isikDuzeyi - hedef.isik) > 0.004) renderer.shadowMap.needsUpdate = true;
    renderer.render(scene, camera);
    requestAnimationFrame(kare);
  }
  kare();
  document.body.classList.add('hazir');
  // Adres çubuğundaki #yer-kimliği ile doğrudan bir yere açılır
  if (yerBul(decodeURIComponent(location.hash.slice(1)))) sec(decodeURIComponent(location.hash.slice(1)));

  // Hata ayıklama için
  // Açılışta kısa bir gezinme ipucu; ilk dokunuşta ya da birkaç saniye sonra kaybolur
  (function () {
    const b = document.getElementById('bildirim');
    if (!b) return;
    b.textContent = darEkran.matches ? 'Tek parmak: kaydır · İki parmak: yakınlaş ve döndür' : 'Sürükle: kaydır · Sağ tuş: döndür · Tekerlek: yakınlaş · Ok tuşları da çalışır';
    b.hidden = false;
    const gizle = () => { if (b.textContent.indexOf('kaydır') !== -1) b.hidden = true; };
    setTimeout(gizle, 9000);
    tuval.addEventListener('pointerdown', gizle, { once: true });
  })();

  // Dışa açılanlar: hata ayıklama ve oyunlar (js/oyun.js) için
  IZ.sahne = {
    scene, camera, controls, sec, yerler, renderer, D, araziKodu, kartiKapat, turDurdur,
    ilceyeGit, kareler: [], tiklamaYakala: null, kameraSerbest: false, oyunAktif: false, listeyiCiz, yerSecildi: null
  };
})();
