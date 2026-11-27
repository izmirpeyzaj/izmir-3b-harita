// İlgi alanı kataloğundaki yerler (js/mekanlar.js) için türe göre üretilen low-poly modeller.
// Her yer kendi kimliğinden türetilen bir tohumla renk, kat sayısı ve süslemeleri değiştirir;
// böylece aynı türden iki yer birbirinin kopyası olmaz. Taban yaklaşık 6x6 birimdir.
// Yerel eksenler: +z ön cephe (sokak), -z arka.
(function () {
  const THREE = window.THREE;
  const IZ = window.IZ;
  const koy = IZ.koy;

  // ---------- Tohumlu rastgele ----------
  function tohum(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h = Math.imul(h ^ (h >>> 15), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return (h >>> 0) / 4294967296;
    };
  }
  const sec = (r, dizi) => dizi[Math.floor(r() * dizi.length)];

  // ---------- Ortak parçalar ----------
  const CAM = '#36546d', CAM_ACIK = '#9cc3d9', AHSAP = '#8a6a4a', CELIK = '#6d747a', KALDIRIM = '#ddd5c4';
  const SIVA = ['#f1e4c8', '#efd2b0', '#e9c9a0', '#f4ece0', '#e7d7c9', '#f2d6c4', '#dfe6e0', '#f3e1a8'];
  const CATI = ['#b24a33', '#c45c3c', '#a84432', '#9a5a3c'];
  const TENTE = ['#d2452f', '#2f8f7f', '#e0a93b', '#3d6fa8', '#c2478f', '#5a9148', '#7a5cc0', '#e07a3b'];
  const KISI = ['#3d6fa8', '#d2452f', '#e0a93b', '#2f8f7f', '#7a5cc0', '#f4f0e6', '#3a3f45', '#c2478f'];

  function golgesiz(m) { m.castShadow = false; return m; }
  function zemin(g, w, d, renk) { g.add(golgesiz(IZ.kutu(w, 0.1, d, renk || KALDIRIM))); }
  function agac(g, x, z, s, renk) {
    g.add(koy(IZ.silindir(0.08 * s, 0.12 * s, 0.9 * s, 5, '#8a6a4a'), x, 0.1, z));
    g.add(koy(IZ.kure(0.62 * s, renk || '#5fa052'), x, 0.1 + 1.3 * s, z));
  }
  function cam(g, x, z, s) {
    g.add(koy(IZ.silindir(0.07 * s, 0.09 * s, 0.5 * s, 5, '#7a5a40'), x, 0.1, z));
    g.add(koy(IZ.koni(0.5 * s, 1.8 * s, 6, '#3f7a4a'), x, 0.1 + 0.45 * s, z));
  }
  function palmiye(g, x, z, s) {
    g.add(koy(IZ.silindir(0.06 * s, 0.1 * s, 1.8 * s, 5, '#8a6a4a'), x, 0.1, z));
    for (let i = 0; i < 5; i++) {
      const p = new THREE.Group();
      const yaprak = IZ.kutu(0.85 * s, 0.04, 0.22 * s, i % 2 ? '#4f9450' : '#5fa052');
      yaprak.rotation.z = -0.4;
      p.add(koy(yaprak, 0.38 * s, 0, 0));
      g.add(koy(p, x, 0.1 + 1.75 * s, z, (i * Math.PI * 2) / 5));
    }
  }
  function kisi(g, x, z, renk, y) {
    g.add(koy(IZ.silindir(0.09, 0.11, 0.34, 5, renk), x, y || 0.1, z));
    g.add(koy(IZ.kure(0.1, '#e8c4a0'), x, (y || 0.1) + 0.45, z));
  }
  function lamba(g, x, z, h) {
    g.add(koy(IZ.silindir(0.03, 0.045, h, 4, '#4a4f55'), x, 0.1, z));
    g.add(koy(IZ.kure(0.12, '#fff3c4', { isik: '#ffdf8a', guc: 1.6 }), x, 0.1 + h + 0.08, z));
  }
  function bank(g, x, z, ry) { g.add(koy(IZ.kutu(0.8, 0.2, 0.24, AHSAP), x, 0.1, z, ry)); }
  // Masa, iki sandalye ve isteğe bağlı şemsiye
  function masa(g, x, z, r, semsiyeRengi) {
    g.add(koy(IZ.silindir(0.24, 0.24, 0.05, 7, '#f4f0e6'), x, 0.42, z));
    g.add(koy(IZ.silindir(0.03, 0.03, 0.33, 4, '#555b62'), x, 0.1, z));
    g.add(koy(IZ.kutu(0.18, 0.22, 0.18, sec(r, ['#8a6a4a', '#3a3f45', '#c9b48a'])), x - 0.36, 0.1, z));
    g.add(koy(IZ.kutu(0.18, 0.22, 0.18, sec(r, ['#8a6a4a', '#3a3f45', '#c9b48a'])), x + 0.36, 0.1, z));
    if (r() < 0.6) kisi(g, x + 0.36, z, sec(r, KISI), 0.32);
    if (semsiyeRengi) {
      g.add(koy(IZ.silindir(0.025, 0.025, 1.0, 4, '#666666'), x, 0.1, z));
      g.add(koy(IZ.koni(0.6, 0.26, 6, semsiyeRengi), x, 1.05, z));
    }
  }
  // Çizgili tente (ön cephede, +z'ye uzanır)
  function tente(g, x, y, z, w, renk) {
    const n = Math.max(3, Math.round(w / 0.32));
    for (let i = 0; i < n; i++) {
      const p = IZ.kutu(w / n, 0.05, 0.9, i % 2 ? '#f4f0e6' : renk);
      p.rotation.x = 0.32;
      g.add(koy(p, x - w / 2 + (i + 0.5) * (w / n), y, z + 0.4));
    }
    g.add(koy(IZ.kutu(w, 0.12, 0.05, renk), x, y - 0.2, z + 0.84));
  }
  // Sıra pencereler (ön cephe +z). isikli: gece yanar
  function pencereSirasi(g, x0, x1, y, z, h, renk) {
    const n = Math.max(1, Math.round((x1 - x0) / 0.7));
    for (let i = 0; i < n; i++) {
      const x = x0 + (i + 0.5) * ((x1 - x0) / n);
      g.add(koy(IZ.kutu(0.36, h, 0.06, renk || CAM, { isik: '#ffd27a' }), x, y, z));
      g.add(koy(IZ.kutu(0.46, 0.06, 0.1, '#f4f0e6'), x, y - 0.04, z + 0.02));
    }
  }
  function yanPencere(g, x, z0, z1, y, h) {
    const n = Math.max(1, Math.round((z1 - z0) / 0.8));
    for (let i = 0; i < n; i++) g.add(koy(IZ.kutu(0.06, h, 0.34, CAM, { isik: '#ffd27a' }), x, y, z0 + (i + 0.5) * ((z1 - z0) / n)));
  }
  // Tabela levhası (ön cephe)
  function tabela(g, x, y, z, w, renk) {
    g.add(koy(IZ.kutu(w, 0.32, 0.08, renk), x, y, z));
    g.add(koy(IZ.kutu(w * 0.7, 0.1, 0.1, '#fff6dc', { isik: '#ffe9b0', guc: 1.2 }), x, y + 0.11, z + 0.01));
  }
  // Tel üzerinde renkli ampuller
  function ampulDizisi(g, a, b, n, y) {
    for (let i = 0; i <= n; i++) {
      const t = i / n, sark = Math.sin(t * Math.PI) * 0.25;
      g.add(koy(IZ.kure(0.06, ['#ffd27a', '#ff9a6a', '#fff3c4'][i % 3], { isik: '#ffcf7a', guc: 2 }), a[0] + (b[0] - a[0]) * t, y - sark, a[1] + (b[1] - a[1]) * t));
    }
  }
  function araba(g, x, z, renk, ry) {
    const k = new THREE.Group();
    k.add(IZ.kutu(0.9, 0.24, 0.44, renk));
    k.add(koy(IZ.kutu(0.48, 0.2, 0.4, '#2b3a4a'), -0.04, 0.24, 0));
    g.add(koy(k, x, 0.1, z, ry));
  }
  // İki ya da üç katlı basit bina; ön cephesi +z
  function bina(g, r, x, z, w, d, kat, o) {
    o = o || {};
    const siva = o.siva || sec(r, SIVA), katH = 0.9;
    g.add(koy(IZ.kutu(w, kat * katH, d, siva), x, 0.1, z));
    for (let k = 0; k < kat; k++) {
      if (k === 0 && o.dukkan) continue;
      pencereSirasi(g, x - w / 2 + 0.2, x + w / 2 - 0.2, 0.35 + k * katH, z + d / 2 + 0.01, 0.42);
    }
    if (o.dukkan) {
      g.add(koy(IZ.kutu(w - 0.3, 0.6, 0.06, CAM_ACIK, { isik: '#ffe9b0', puruz: 0.3 }), x, 0.15, z + d / 2 + 0.01));
    }
    const ust = 0.1 + kat * katH;
    if (o.duzCati) {
      g.add(koy(IZ.kutu(w + 0.1, 0.12, d + 0.1, '#d9d4c8'), x, ust, z));
    } else {
      g.add(koy(IZ.piramit(w * 1.1, 0.7, d * 1.1, o.cati || sec(r, CATI)), x, ust, z));
    }
    return ust;
  }

  // ---------- Yeme-içme ----------
  function restoran(v, r) {
    const g = new THREE.Group();
    zemin(g, 6.2, 6.2);
    const tur = v.tur, renk = sec(r, TENTE);
    const kat = tur === 'meyhane' ? 2 : 1 + Math.floor(r() * 2);
    const ust = bina(g, r, -0.2, -1.4, 4.6, 2.8, kat, { dukkan: true, cati: tur === 'balik' ? '#3d6fa8' : undefined });
    tente(g, -0.2, 0.95, -0.0, 4.4, renk);
    tabela(g, -0.2, Math.min(ust - 0.4, 1.55), 0.02, 2.2, renk);
    // Çiçek saksıları ve kapı
    g.add(koy(IZ.kutu(0.7, 0.85, 0.06, AHSAP), 1.5, 0.1, 0.02));
    for (const x of [-2.3, 1.95]) {
      g.add(koy(IZ.silindir(0.18, 0.13, 0.3, 6, '#b5653f'), x, 0.1, 0.3));
      g.add(koy(IZ.kure(0.22, '#d2452f'), x, 0.5, 0.3));
    }
    // Teras masaları
    const semsiyeli = tur !== 'meyhane';
    [[-2.0, 1.5], [-0.3, 1.6], [1.4, 1.5], [-1.2, 2.6], [0.6, 2.7], [2.3, 2.6]].forEach(([x, z], i) => {
      if (i < 4 || r() < 0.7) masa(g, x, z, r, semsiyeli && i % 2 === 0 ? sec(r, TENTE) : null);
    });
    if (tur === 'meyhane') {
      // Asma ve ampul dizisi
      for (const x of [-2.6, 2.6]) g.add(koy(IZ.silindir(0.04, 0.04, 1.9, 4, AHSAP), x, 0.1, 3.0));
      g.add(koy(IZ.kutu(5.4, 0.1, 2.2, '#5a9148'), 0, 2.0, 2.0));
      ampulDizisi(g, [-2.6, 3.0], [2.6, 3.0], 9, 1.9);
    } else if (tur === 'balik') {
      // Kayık ve ağ direği
      const kayik = new THREE.Group();
      kayik.add(IZ.kutu(1.7, 0.3, 0.6, '#f4f4f0'));
      kayik.add(koy(IZ.kutu(1.72, 0.1, 0.62, '#2f7fd1'), 0, 0.22, 0));
      kayik.add(koy(IZ.silindir(0.03, 0.03, 1.2, 4, AHSAP), 0.2, 0.3, 0));
      g.add(koy(kayik, 2.2, 0.1, -2.6, 0.5));
      g.add(koy(IZ.kutu(0.9, 0.5, 0.06, '#3d6fa8'), -2.5, 0.1, -0.4));
    } else if (tur === 'kahvalti') {
      agac(g, 2.4, -2.4, 1.1, '#4f9450');
      agac(g, -2.6, -2.6, 0.9);
      g.add(koy(IZ.kutu(0.5, 0.3, 0.5, '#f4f0e6'), 2.7, 0.1, 0.6)); // semaver tezgâhı
      g.add(koy(IZ.silindir(0.12, 0.16, 0.45, 6, '#c9a676', { metal: 0.5, puruz: 0.4 }), 2.7, 0.4, 0.6));
    } else {
      palmiye(g, -2.7, -2.5, 0.9);
    }
    lamba(g, 2.8, 0.4, 1.6);
    return g;
  }

  function kafe(v, r) {
    const g = new THREE.Group();
    zemin(g, 6.0, 6.0);
    const renk = sec(r, TENTE);
    // Köşe binası: zemin kat cam vitrin, üst kat cumbalı
    const ust = bina(g, r, -0.6, -1.3, 3.6, 3.0, 2 + Math.floor(r() * 2), { dukkan: true });
    g.add(koy(IZ.kutu(1.4, 0.8, 0.5, sec(r, SIVA)), -0.6, 1.1, 0.45));
    g.add(koy(IZ.kutu(1.2, 0.42, 0.06, CAM, { isik: '#ffd27a' }), -0.6, 1.3, 0.71));
    tente(g, -0.6, 0.95, 0.2, 3.4, renk);
    tabela(g, -0.6, Math.min(ust - 0.5, 2.3), 0.74, 1.4, renk);
    if (v.tur === 'pastane') {
      // Vitrinde pasta katları
      for (const x of [-1.6, -0.6, 0.4]) {
        g.add(koy(IZ.silindir(0.2, 0.22, 0.14, 8, '#f4e0d0'), x, 0.2, 0.3));
        g.add(koy(IZ.silindir(0.13, 0.15, 0.12, 8, sec(r, ['#c2478f', '#f4f0e6', '#7a4a2a'])), x, 0.34, 0.3));
        g.add(koy(IZ.kure(0.04, '#d2452f'), x, 0.5, 0.3));
      }
    } else {
      // Kahve fincanı tabelası
      g.add(koy(IZ.silindir(0.28, 0.2, 0.36, 8, '#f4f0e6'), 1.6, 2.2, 0.3));
      g.add(koy(IZ.kutu(0.12, 0.2, 0.06, '#f4f0e6'), 1.9, 2.3, 0.3));
      g.add(koy(IZ.silindir(0.02, 0.02, 2.1, 4, '#4a4f55'), 1.6, 0.1, 0.3));
    }
    [[-1.8, 1.7], [0.0, 1.8], [1.8, 1.6], [-0.9, 2.8], [0.9, 2.8]].forEach(([x, z], i) => masa(g, x, z, r, i === 1 ? renk : null));
    agac(g, 2.4, -1.6, 1.0);
    agac(g, 2.6, 2.7, 0.7, '#6fb15c');
    lamba(g, -2.7, 0.9, 1.5);
    return g;
  }

  // Sokak: iki yanında dükkân sıraları, ortada yaya yolu
  function sokak(v, r) {
    const g = new THREE.Group();
    zemin(g, 6.4, 7.0, '#cbbfa6');
    g.add(koy(golgesiz(IZ.kutu(1.8, 0.03, 7.0, '#e8dfcc')), 0, 0.1, 0));
    for (let i = -3; i <= 3; i++) g.add(koy(golgesiz(IZ.kutu(1.8, 0.035, 0.06, '#c9bda3')), 0, 0.1, i));
    const gece = v.tur === 'gece', yeme = v.ilgi && v.ilgi.includes('yeme');
    for (const s of [-1, 1]) {
      let z = -3.2;
      while (z < 3.0) {
        const d = 1.1 + r() * 0.6, kat = 2 + Math.floor(r() * 3);
        const bg = new THREE.Group();
        bina(bg, r, 0, 0, d, 1.6, kat, { dukkan: true, duzCati: r() < 0.4 });
        if (r() < 0.8) tente(bg, 0, 0.95, 0.8, d - 0.1, sec(r, TENTE));
        g.add(koy(bg, s * 2.3, 0, z + d / 2, s < 0 ? Math.PI / 2 : -Math.PI / 2));
        z += d + 0.05;
      }
      if (yeme || gece) for (let k = 0; k < 3; k++) masa(g, s * 0.95, -2.2 + k * 2.0, r, null);
    }
    if (gece) {
      for (let i = 0; i < 4; i++) ampulDizisi(g, [-1.45, -2.6 + i * 1.7], [1.45, -2.6 + i * 1.7 + 0.4], 6, 2.4);
      // Neon tabelalar
      [[-1.5, -1.8, '#ff4fa3'], [1.5, 0.4, '#4fd2ff'], [-1.5, 1.9, '#b7ff4f']].forEach(([x, z, c]) =>
        g.add(koy(IZ.kutu(0.06, 0.3, 0.9, c, { isik: c, guc: 2.2 }), x, 1.6, z)));
    } else {
      for (let i = 0; i < 3; i++) agac(g, 0, -2.4 + i * 2.4, 0.8);
    }
    for (let i = 0; i < 6; i++) kisi(g, (r() - 0.5) * 1.4, (r() - 0.5) * 6, sec(r, KISI));
    return g;
  }

  // Pazar / çarşı: renkli tezgâh örtüleri
  function pazar(v, r) {
    const g = new THREE.Group();
    zemin(g, 6.4, 6.4, '#d8ceb8');
    const kapali = v.tur === 'carsi';
    if (kapali) {
      // Kemerli çarşı girişi
      g.add(koy(IZ.kutu(6.0, 2.0, 1.4, sec(r, SIVA)), 0, 0.1, -2.4));
      for (const x of [-1.9, 0, 1.9]) g.add(koy(IZ.kutu(1.0, 1.2, 0.08, '#4a3a2a'), x, 0.1, -1.68));
      g.add(koy(IZ.besikCati(6.2, 0.8, 1.6, sec(r, CATI)), 0, 2.1, -2.4));
    }
    const sira = kapali ? [-0.6, 1.2, 2.6] : [-2.4, -0.8, 0.8, 2.4];
    sira.forEach((z) => {
      for (let x = -2.4; x <= 2.41; x += 1.2) {
        const c = sec(r, TENTE);
        g.add(koy(IZ.kutu(1.0, 0.5, 0.7, '#a8824f'), x, 0.1, z));
        // Meyve-sebze kasaları
        for (const dx of [-0.25, 0.25]) g.add(koy(IZ.kutu(0.4, 0.14, 0.5, sec(r, ['#d2452f', '#e0a93b', '#5a9148', '#7a4a8a', '#e07a3b'])), x + dx, 0.6, z));
        for (const dx of [-0.45, 0.45]) g.add(koy(IZ.silindir(0.025, 0.025, 1.3, 4, '#8f9ba3'), x + dx, 0.1, z + 0.3));
        const ort = IZ.kutu(1.12, 0.05, 1.0, c);
        ort.rotation.x = -0.12;
        g.add(koy(ort, x, 1.42, z));
      }
      for (let k = 0; k < 2; k++) kisi(g, (r() - 0.5) * 5, z + 0.75, sec(r, KISI));
    });
    return g;
  }

  // ---------- Alışveriş merkezi ----------
  function avm(v, r) {
    const g = new THREE.Group();
    zemin(g, 7.0, 7.0, '#bcbcb4');
    const vurgu = sec(r, ['#d2452f', '#2f7fd1', '#2f8f7f', '#c2478f', '#e0a93b', '#7a5cc0']);
    const kat = 2 + Math.floor(r() * 2), h = kat * 0.95;
    const outlet = v.tur === 'outlet';
    // Ana kütle
    g.add(koy(IZ.kutu(6.2, h, 3.6, outlet ? '#e9e1d2' : '#eef0ec'), 0, 0.1, -1.4));
    for (let k = 0; k < kat; k++) g.add(koy(IZ.kutu(6.24, 0.08, 3.64, '#c8ccd0'), 0, 0.1 + (k + 1) * 0.95 - 0.04, -1.4));
    // Cam atriyum ve kubbe/çatı ışığı
    g.add(koy(IZ.kutu(2.4, h + 0.4, 1.0, CAM_ACIK, { isik: '#ffe9b0', puruz: 0.3 }), 0, 0.1, 0.5));
    for (let i = -2; i <= 2; i++) g.add(koy(IZ.kutu(0.05, h + 0.4, 1.04, '#8f9ba3'), i * 0.6, 0.1, 0.5));
    if (r() < 0.5) g.add(koy(IZ.kure(1.0, CAM_ACIK, { isik: '#ffe9b0', puruz: 0.3 }, true), 0, h + 0.1, -1.4));
    else g.add(koy(IZ.piramit(1.8, 0.8, 1.8, CAM_ACIK, { isik: '#ffe9b0', puruz: 0.3 }), 0, h + 0.1, -1.4));
    // Vitrin bantları ve logo kuşağı
    for (const x of [-2.2, 2.2]) {
      g.add(koy(IZ.kutu(1.6, 0.6, 0.06, CAM_ACIK, { isik: '#ffe9b0', puruz: 0.3 }), x, 0.15, 0.42));
      g.add(koy(IZ.kutu(1.7, 0.35, 0.1, sec(r, TENTE)), x, 0.82, 0.42));
    }
    g.add(koy(IZ.kutu(2.6, 0.4, 0.12, vurgu, { isik: '#ffffff', guc: 0.6 }), 0, h + 0.15, 1.02));
    // Çatı makineleri
    for (const x of [-2.2, 2.2]) g.add(koy(IZ.kutu(0.7, 0.35, 0.7, '#a3a8ad'), x, h + 0.1, -2.4));
    if (outlet) for (let i = 0; i < 4; i++) g.add(koy(IZ.besikCati(1.5, 0.45, 3.6, '#b24a33'), -2.25 + i * 1.5, h + 0.1, -1.4));
    // Otopark ve arabalar
    g.add(koy(golgesiz(IZ.kutu(6.6, 0.03, 2.0, '#6f7378')), 0, 0.1, 2.3));
    for (let i = 0; i < 7; i++) g.add(koy(golgesiz(IZ.kutu(0.04, 0.035, 0.8, '#f4f0e6')), -3 + i, 0.1, 2.3));
    for (let i = 0; i < 6; i++) if (r() < 0.75) araba(g, -2.5 + i, 2.3, sec(r, ['#d2452f', '#f4f4f0', '#3a3f45', '#2f7fd1', '#9aa0a6', '#e0a93b']), Math.PI / 2);
    palmiye(g, -3.0, 1.0, 0.9);
    palmiye(g, 3.0, 1.0, 0.9);
    bayrakDirekleri(g, [-1.6, 1.6], 1.2, [vurgu, '#e30a17']);
    return g;
  }
  function bayrakDirekleri(g, xs, z, renkler) {
    xs.forEach((x, i) => {
      g.add(koy(IZ.silindir(0.03, 0.03, 2.2, 4, '#dddddd'), x, 0.1, z));
      g.add(koy(IZ.kutu(0.6, 0.38, 0.03, renkler[i % renkler.length]), x + 0.31, 1.9, z));
    });
  }

  // ---------- Eğlence ve spor ----------
  function stadyum(v, r) {
    const g = new THREE.Group();
    zemin(g, 7.2, 7.2, '#c9c4b8');
    const renk = sec(r, ['#d2452f', '#e0a93b', '#2f8f7f', '#3d6fa8', '#c2478f']);
    const ikinci = sec(r, ['#f4f4f0', '#ffd23a', '#3a3f45']);
    // Basamaklı tribün halkası (dikdörtgene yakın)
    for (let k = 0; k < 4; k++) {
      const s = 1 + k * 0.1;
      const t = IZ.silindir(3.0 * s, 3.0 * s, 0.4, 16, k % 2 ? renk : ikinci);
      t.scale.set(1, 1, 0.78);
      g.add(koy(t, 0, 0.1 + k * 0.4, 0));
    }
    // Çatı halkası
    // Çatı halkası (ortası açık, saha görünür)
    const cati = new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.42, 3, 20), IZ.mat('#e8ecef'));
    cati.rotation.x = Math.PI / 2;
    cati.scale.set(1, 0.78, 0.25);
    cati.castShadow = cati.receiveShadow = true;
    g.add(koy(cati, 0, 2.2, 0));
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      g.add(koy(IZ.silindir(0.05, 0.05, 2.0, 4, CELIK), Math.cos(a) * 3.45, 0.1, Math.sin(a) * 3.45 * 0.78));
    }
    // Saha (tribünün içinde, üstten görünür)
    const saha = IZ.kutu(3.6, 0.06, 2.3, '#4f9a4a');
    g.add(koy(saha, 0, 1.7, 0));
    for (let i = 0; i < 6; i++) g.add(koy(golgesiz(IZ.kutu(0.6, 0.065, 2.3, '#5aa752')), -1.5 + i * 0.6, 1.7, 0));
    g.add(koy(golgesiz(IZ.kutu(0.04, 0.07, 2.3, '#ffffff')), 0, 1.71, 0));
    g.add(koy(golgesiz(IZ.silindir(0.35, 0.35, 0.07, 10, '#ffffff')), 0, 1.71, 0));
    g.add(koy(golgesiz(IZ.silindir(0.3, 0.3, 0.075, 10, '#4f9a4a')), 0, 1.71, 0));
    for (const x of [-1.75, 1.75]) g.add(koy(IZ.kutu(0.06, 0.25, 0.6, '#ffffff'), x, 1.76, 0));
    // Projektör direkleri
    for (const [x, z] of [[-3.1, -2.4], [3.1, -2.4], [-3.1, 2.4], [3.1, 2.4]]) {
      g.add(koy(IZ.silindir(0.06, 0.09, 3.4, 5, CELIK), x, 0.1, z));
      g.add(koy(IZ.kutu(0.7, 0.4, 0.12, '#fff6dc', { isik: '#ffffff', guc: 2.4 }), x, 3.5, z, Math.atan2(x, z)));
    }
    return g;
  }

  function salon(v, r) {
    const g = new THREE.Group();
    zemin(g, 6.6, 6.6);
    const renk = sec(r, ['#c2478f', '#d2452f', '#2f7fd1', '#7a5cc0', '#e0a93b']);
    if (v.tur === 'sahne' && r() < 0.5) {
      // Açık hava amfisi
      for (let k = 0; k < 5; k++) {
        const b = new THREE.Mesh(new THREE.CylinderGeometry(3.0 - k * 0.0, 3.0, 0.3, 14, 1, false, Math.PI * 0.15, Math.PI * 0.7), IZ.mat(k % 2 ? '#d8cfb8' : '#e6dcc2'));
        b.castShadow = b.receiveShadow = true;
        b.scale.setScalar(1 - k * 0.14);
        b.position.set(0, 0.1 + (4 - k) * 0.3, -0.8);
        g.add(b);
      }
      g.add(koy(IZ.kutu(3.0, 0.4, 1.4, '#8a6a4a'), 0, 0.1, -2.4));
      g.add(koy(IZ.kutu(3.4, 1.8, 0.2, '#3a3f45'), 0, 0.1, -3.1));
      g.add(koy(IZ.kutu(3.2, 0.2, 1.6, renk), 0, 1.9, -2.5));
      for (let i = 0; i < 8; i++) kisi(g, (r() - 0.5) * 4, 0.6 + r() * 1.6, sec(r, KISI), 0.4);
      return g;
    }
    // Kapalı salon: eğri çatılı ana hacim ve cam fuaye
    const govde = IZ.silindir(2.6, 2.8, 2.6, 12, '#eef0ec');
    govde.scale.set(1, 1, 0.75);
    g.add(koy(govde, 0, 0.1, -0.8));
    const kubbe = IZ.kure(2.7, renk, null, true);
    kubbe.scale.set(1, 0.45, 0.78);
    g.add(koy(kubbe, 0, 2.7, -0.8));
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      g.add(koy(IZ.kutu(0.12, 2.6, 0.12, '#c8ccd0'), Math.cos(a) * 2.68, 0.1, -0.8 + Math.sin(a) * 2.02));
    }
    g.add(koy(IZ.kutu(4.4, 1.5, 1.2, CAM_ACIK, { isik: '#ffe9b0', puruz: 0.3 }), 0, 0.1, 1.3));
    g.add(koy(IZ.kutu(4.8, 0.14, 1.6, '#e8ecef'), 0, 1.6, 1.4));
    // Afiş panoları
    for (const x of [-2.6, 2.6]) {
      g.add(koy(IZ.kutu(0.08, 1.4, 0.6, sec(r, TENTE), { isik: '#ffffff', guc: 0.6 }), x, 0.3, 2.4));
    }
    if (v.tur === 'sinema') {
      g.add(koy(IZ.kutu(3.2, 0.5, 0.14, '#3a3f45'), 0, 1.75, 2.15));
      for (let i = 0; i < 10; i++) g.add(koy(IZ.kure(0.06, '#fff3c4', { isik: '#ffdf8a', guc: 2 }), -1.5 + i * 0.333, 2.08, 2.24));
    }
    if (v.tur === 'spor') {
      // Çatıda saha çizgileri yerine spor salonu kafes kirişleri
      for (let i = -2; i <= 2; i++) g.add(koy(IZ.kutu(0.08, 0.1, 3.6, CELIK), i * 0.9, 3.85, -0.8));
    }
    for (let i = 0; i < 5; i++) kisi(g, (r() - 0.5) * 4.5, 2.4 + r() * 0.6, sec(r, KISI));
    agac(g, -2.9, -2.9, 0.9);
    agac(g, 2.9, -2.9, 1.0);
    return g;
  }

  function lunapark(v, r) {
    const g = new THREE.Group();
    zemin(g, 6.6, 6.6, '#d8ceb8');
    // Dönme dolap
    const dolap = new THREE.Group();
    const R = 2.4;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const kol = IZ.kutu(0.06, R, 0.06, '#e8ecef');
      kol.rotation.z = a;
      dolap.add(kol);
      const kabin = IZ.kutu(0.38, 0.38, 0.38, TENTE[i % TENTE.length]);
      kabin.position.set(-Math.sin(a) * R, Math.cos(a) * R - 0.2, 0);
      kabin.userData.kabin = true;
      dolap.add(kabin);
    }
    const halka = new THREE.Mesh(new THREE.TorusGeometry(R, 0.06, 4, 24), IZ.mat('#d2452f'));
    dolap.add(halka);
    dolap.add(IZ.silindir(0.2, 0.2, 0.5, 8, '#555b62'));
    dolap.children[dolap.children.length - 1].rotation.x = Math.PI / 2;
    dolap.position.set(-1.0, 3.0, -1.2);
    dolap.userData.canli = true;
    g.add(dolap);
    for (const s of [-1, 1]) {
      const ayak = IZ.kutu(0.12, 3.2, 0.12, '#8f9ba3');
      ayak.rotation.z = s * 0.3;
      g.add(koy(ayak, -1.0 + s * 0.48, 0.1, -1.2));
    }
    // Atlıkarınca
    const karinca = new THREE.Group();
    karinca.add(IZ.silindir(1.0, 1.0, 0.15, 10, '#f4f0e6'));
    karinca.add(koy(IZ.koni(1.15, 0.6, 10, '#d2452f'), 0, 1.15, 0));
    karinca.add(koy(IZ.silindir(0.06, 0.06, 1.0, 5, '#d9b23c'), 0, 0.15, 0));
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      karinca.add(koy(IZ.silindir(0.02, 0.02, 1.0, 4, '#d9b23c'), Math.cos(a) * 0.75, 0.15, Math.sin(a) * 0.75));
      karinca.add(koy(IZ.kutu(0.3, 0.2, 0.1, TENTE[i % TENTE.length]), Math.cos(a) * 0.75, 0.45, Math.sin(a) * 0.75, -a));
    }
    karinca.position.set(1.7, 0.1, 1.4);
    karinca.userData.canli = true;
    g.add(karinca);
    // Bilet gişesi ve ampul dizileri
    g.add(koy(IZ.kutu(0.9, 0.9, 0.7, '#e0a93b'), 2.3, 0.1, -2.2));
    g.add(koy(IZ.piramit(1.1, 0.5, 0.9, '#d2452f'), 2.3, 1.0, -2.2));
    ampulDizisi(g, [-3, 2.8], [3, 2.8], 12, 1.6);
    for (let i = 0; i < 6; i++) kisi(g, (r() - 0.5) * 5, 0.5 + r() * 2.2, sec(r, KISI));
    g.userData.guncelle = (t) => {
      dolap.rotation.z = t * 0.25;
      dolap.children.forEach((c) => { if (c.userData.kabin) c.rotation.z = -t * 0.25; });
      karinca.rotation.y = t * 0.8;
    };
    return g;
  }

  function marina(v, r) {
    const g = new THREE.Group();
    // Kıyı tarafında kulüp binası, deniz tarafında iskeleler ve yelkenliler
    zemin(g, 6.6, 2.4);
    g.children[0].position.z = -2.2;
    bina(g, r, -1.2, -2.4, 2.6, 1.4, 2, { duzCati: true, siva: '#f4f4f0' });
    for (let i = 0; i < 3; i++) {
      const z = -0.6 + i * 1.3;
      g.add(koy(IZ.kutu(5.6, 0.08, 0.35, '#a8824f'), 0.4, -0.25, z + 0.5));
    }
    for (let i = 0; i < 6; i++) {
      const x = -2.0 + (i % 3) * 1.8, z = -0.2 + Math.floor(i / 3) * 1.3 + 0.1;
      const t = new THREE.Group();
      t.add(IZ.kutu(1.2, 0.25, 0.4, '#f4f4f0'));
      t.add(koy(IZ.kutu(1.22, 0.06, 0.42, sec(r, ['#2f7fd1', '#1f5f8b', '#d2452f', '#3a3f45'])), 0, 0.05, 0));
      t.add(koy(IZ.silindir(0.02, 0.02, 2.2, 4, '#dddddd'), 0, 0.25, 0));
      const yelken = IZ.besikCati(0.06, 1.8, 0.8, '#ffffff');
      yelken.rotation.y = Math.PI / 2;
      t.add(koy(yelken, 0, 0.35, 0.05));
      g.add(koy(t, x, -0.45, z + 0.5));
    }
    bayrakDirekleri(g, [2.3], -2.2, ['#e30a17']);
    palmiye(g, 2.8, -2.6, 0.9);
    return g;
  }

  // ---------- Müze, sanat, tarih ----------
  function muze(v, r) {
    const g = new THREE.Group();
    zemin(g, 6.4, 6.4);
    const tas = sec(r, ['#ecdcb9', '#e9e1d2', '#f1ece2', '#e2d2b4']);
    const modern = v.tur === 'galeri' || (v.tur === 'kultur-merkezi' && r() < 0.5) || r() < 0.25;
    if (modern) {
      // Kübik çağdaş yapı: kayık kütleler, cam bant
      g.add(koy(IZ.kutu(4.6, 1.6, 3.0, '#f4f4f0'), -0.3, 0.1, -1.0));
      g.add(koy(IZ.kutu(3.2, 1.4, 2.6, sec(r, ['#3a3f45', '#b5653f', '#c9b48a'])), 0.5, 1.7, -1.4));
      g.add(koy(IZ.kutu(4.4, 0.6, 0.06, CAM_ACIK, { isik: '#ffe9b0', puruz: 0.3 }), -0.3, 0.5, 0.51));
      g.add(koy(IZ.kutu(3.0, 0.4, 0.06, CAM, { isik: '#ffd27a' }), 0.5, 2.3, -0.09));
      // Avlu heykeli
      const h = IZ.kutu(0.5, 1.4, 0.5, sec(r, TENTE));
      h.rotation.y = 0.6;
      h.rotation.z = 0.2;
      g.add(koy(h, -1.8, 0.1, 2.0));
      g.add(koy(IZ.kure(0.4, '#d9b23c', { metal: 0.5, puruz: 0.4 }), 1.6, 0.5, 2.2));
      g.add(koy(IZ.silindir(0.25, 0.3, 0.4, 6, '#c8ccd0'), 1.6, 0.1, 2.2));
    } else {
      // Neoklasik cephe: kaide, sütunlar, alınlık
      g.add(koy(IZ.kutu(5.2, 0.35, 3.8, '#d6cfc0'), 0, 0.1, -0.8));
      for (let i = 0; i < 3; i++) g.add(koy(IZ.kutu(2.2, 0.12, 0.35, '#d6cfc0'), 0, 0.1 + i * 0.12, 1.2 + 0.3 - i * 0.3 + 0.3));
      g.add(koy(IZ.kutu(4.8, 2.0, 3.0, tas), 0, 0.45, -1.0));
      for (let i = 0; i < 6; i++) g.add(koy(IZ.silindir(0.13, 0.15, 1.8, 7, '#f7f0e1'), -1.9 + i * 0.76, 0.45, 0.75));
      g.add(koy(IZ.kutu(4.8, 0.25, 0.7, '#f7f0e1'), 0, 2.25, 0.6));
      g.add(koy(IZ.besikCati(5.0, 0.9, 3.8, sec(r, ['#8f6a4a', '#7c8a86', tas])), 0, 2.45, -0.8));
      pencereSirasi(g, -2.2, 2.2, 1.0, 0.51, 0.8);
      g.add(koy(IZ.kutu(0.8, 1.2, 0.06, '#5a3e2a'), 0, 0.45, 0.52));
      // Afiş (sergi pankartları)
      for (const x of [-1.5, 1.5]) g.add(koy(IZ.kutu(0.5, 1.0, 0.04, sec(r, TENTE)), x, 0.9, 0.9));
    }
    // Bahçe
    agac(g, -2.7, 2.4, 0.9);
    agac(g, 2.7, 2.6, 1.0, '#4f9450');
    cam(g, 2.9, -2.8, 0.9);
    for (let i = 0; i < 3; i++) kisi(g, (r() - 0.5) * 3, 2.0 + r(), sec(r, KISI));
    bank(g, -0.5, 2.8, 0);
    return g;
  }

  function cami(v, r) {
    const g = new THREE.Group();
    zemin(g, 6.2, 6.2, '#e2dac8');
    const tas = sec(r, ['#ecdcb9', '#e6d6b8', '#f0e6d2']), kursun = '#8f9ba3';
    // Avlu duvarı
    for (const [x, z, w, d] of [[0, 2.9, 6.0, 0.2], [-2.9, 0, 0.2, 6.0], [2.9, 0, 0.2, 6.0]]) g.add(koy(IZ.kutu(w, 0.6, d, tas), x, 0.1, z));
    // Harim, kasnak, kubbe
    g.add(koy(IZ.kutu(3.2, 1.8, 3.0, tas), 0, 0.1, -1.2));
    g.add(koy(IZ.silindir(1.3, 1.4, 0.5, 8, tas), 0, 1.9, -1.2));
    g.add(koy(IZ.kure(1.35, kursun, null, true), 0, 2.4, -1.2));
    g.add(koy(IZ.koni(0.06, 0.5, 5, '#d9b23c'), 0, 3.7, -1.2));
    for (const x of [-1.6, 1.6]) {
      g.add(koy(IZ.silindir(0.5, 0.55, 0.3, 8, tas), x, 1.6, -1.2));
      g.add(koy(IZ.kure(0.5, kursun, null, true), x, 1.9, -1.2));
    }
    // Son cemaat yeri revakı
    g.add(koy(IZ.kutu(3.2, 0.14, 1.0, tas), 0, 1.3, 0.75));
    for (let i = 0; i < 4; i++) {
      g.add(koy(IZ.silindir(0.08, 0.08, 1.2, 6, '#f7f0e1'), -1.3 + i * 0.87, 0.1, 1.15));
      g.add(koy(IZ.kure(0.3, kursun, null, true), -1.3 + i * 0.87 + (i < 3 ? 0.43 : -0.43), 1.44, 0.75));
    }
    // Pencereler
    pencereSirasi(g, -1.4, 1.4, 0.9, 0.31, 0.5);
    // Minare
    const mx = 1.9, mz = -2.6;
    g.add(koy(IZ.kutu(0.7, 0.8, 0.7, tas), mx, 0.1, mz));
    g.add(koy(IZ.silindir(0.28, 0.3, 4.0, 8, '#f4ece0'), mx, 0.9, mz));
    g.add(koy(IZ.silindir(0.42, 0.42, 0.12, 8, tas), mx, 3.8, mz));
    g.add(koy(IZ.silindir(0.22, 0.24, 0.8, 8, '#f4ece0'), mx, 3.92, mz));
    g.add(koy(IZ.koni(0.3, 1.0, 8, kursun), mx, 4.72, mz));
    g.add(koy(IZ.koni(0.04, 0.3, 4, '#d9b23c'), mx, 5.7, mz));
    // Şadırvan
    g.add(koy(IZ.silindir(0.5, 0.55, 0.35, 8, tas), -1.2, 0.1, 2.0));
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; g.add(koy(IZ.silindir(0.04, 0.04, 0.8, 4, '#f7f0e1'), -1.2 + Math.cos(a) * 0.5, 0.45, 2.0 + Math.sin(a) * 0.5)); }
    g.add(koy(IZ.koni(0.75, 0.5, 8, kursun), -1.2, 1.25, 2.0));
    cam(g, 1.8, 2.0, 0.8);
    selviIkili(g, 2.4, 1.2);
    for (let i = 0; i < 6; i++) guvercin(g, (r() - 0.5) * 3, 0.1, 1.6 + r());
    return g;
  }
  function selviIkili(g, x, z) {
    for (const dx of [0, 0.5]) {
      g.add(koy(IZ.silindir(0.05, 0.07, 0.3, 5, '#7a5a40'), x + dx, 0.1, z));
      g.add(koy(IZ.koni(0.3, 2.4, 6, '#3b6e45'), x + dx, 0.35, z));
    }
  }
  function guvercin(g, x, y, z) {
    const b = IZ.kure(0.09, '#8f979e');
    b.scale.set(1.5, 0.9, 0.9);
    g.add(koy(b, x, y + 0.08, z));
  }

  function kilise(v, r) {
    const g = new THREE.Group();
    zemin(g, 6.2, 6.2, '#e2dac8');
    const tas = sec(r, ['#e8dcc4', '#d8c6a4', '#efe6d4', '#cdbf9f']), cati = sec(r, ['#a84432', '#8f9ba3', '#7c5a44']);
    const sinagog = v.tur === 'sinagog';
    // Bazilika gövdesi (uzun eksen z)
    g.add(koy(IZ.kutu(2.8, 2.2, 4.4, tas), 0, 0.1, -0.6));
    g.add(koy(IZ.besikCati(3.0, 1.0, 4.6, cati), 0, 2.3, -0.6));
    // Yan nefler
    for (const s of [-1, 1]) {
      g.add(koy(IZ.kutu(0.9, 1.4, 4.0, tas), s * 1.85, 0.1, -0.6));
      const c = IZ.besikCati(1.0, 0.4, 4.0, cati);
      g.add(koy(c, s * 1.85, 1.5, -0.6));
      for (let i = 0; i < 4; i++) {
        g.add(koy(IZ.kutu(0.06, 0.6, 0.3, CAM, { isik: '#ffd27a' }), s * 2.31, 0.55, -2.1 + i * 1.0));
      }
    }
    // Ön cephe: gül pencere ve portal
    const gul = IZ.silindir(0.45, 0.45, 0.08, 10, sinagog ? '#3d6fa8' : '#7a4a8a', { isik: '#ffcf7a' });
    gul.rotation.x = Math.PI / 2;
    g.add(koy(gul, 0, 1.75, 1.66));
    g.add(koy(IZ.kutu(0.8, 1.1, 0.08, '#5a3e2a'), 0, 0.1, 1.64));
    g.add(koy(IZ.kutu(1.2, 0.18, 0.2, '#f7f0e1'), 0, 1.2, 1.66));
    if (sinagog) {
      // Kemerli pencereler ve iki küçük kubbe; Kemeraltı sinagogları gibi sade avlu cephesi
      for (const x of [-0.9, 0.9]) {
        g.add(koy(IZ.kutu(0.35, 0.8, 0.06, CAM, { isik: '#ffd27a' }), x, 0.6, 1.64));
        g.add(koy(IZ.kure(0.18, CAM, { isik: '#ffd27a' }, true), x, 1.4, 1.64));
      }
      g.add(koy(IZ.silindir(0.7, 0.75, 0.3, 8, tas), 0, 3.2, -0.6));
      g.add(koy(IZ.kure(0.72, '#7c8a86', null, true), 0, 3.5, -0.6));
      // Avlu ağacı ve çeşme
      agac(g, -2.2, 2.4, 1.0, '#4f9450');
      g.add(koy(IZ.silindir(0.3, 0.35, 0.4, 8, tas), 1.6, 0.1, 2.3));
    } else {
      // Çan kulesi
      const kx = 1.9, kz = 1.0;
      g.add(koy(IZ.kutu(0.9, 3.6, 0.9, tas), kx, 0.1, kz));
      for (const [dx, dz] of [[0, 0.46], [0.46, 0], [0, -0.46], [-0.46, 0]]) g.add(koy(IZ.kutu(dz ? 0.4 : 0.06, 0.6, dz ? 0.06 : 0.4, '#3a3f45'), kx + dx, 3.0, kz + dz));
      g.add(koy(IZ.piramit(1.1, 1.2, 1.1, cati), kx, 3.7, kz));
      g.add(koy(IZ.kutu(0.06, 0.6, 0.06, '#d9b23c'), kx, 4.9, kz));
      g.add(koy(IZ.kutu(0.36, 0.06, 0.06, '#d9b23c'), kx, 5.3, kz));
      g.add(koy(IZ.kutu(0.06, 0.5, 0.06, '#d9b23c'), 0, 3.3, 1.5));
      g.add(koy(IZ.kutu(0.3, 0.06, 0.06, '#d9b23c'), 0, 3.6, 1.5));
      cam(g, -2.5, 2.4, 0.9);
    }
    // Apsis
    const apsis = IZ.silindir(1.1, 1.1, 1.8, 8, tas);
    apsis.scale.z = 0.6;
    g.add(koy(apsis, 0, 0.1, -2.8));
    const apsisKubbe = IZ.kure(1.1, cati, null, true);
    apsisKubbe.scale.set(1, 0.6, 0.6);
    g.add(koy(apsisKubbe, 0, 1.9, -2.8));
    lamba(g, -1.4, 2.6, 1.5);
    for (let i = 0; i < 2; i++) kisi(g, (r() - 0.5) * 2, 2.4 + r() * 0.4, sec(r, KISI));
    return g;
  }

  function kosk(v, r) {
    const g = new THREE.Group();
    zemin(g, 6.4, 6.4, '#a9cf8a');
    const siva = sec(r, ['#f1e4c8', '#f4ece0', '#efd2b0', '#e7d7c9', '#f3e1a8']), cati = sec(r, CATI);
    g.add(koy(golgesiz(IZ.kutu(1.0, 0.03, 3.0, '#e6dcc2')), 0, 0.1, 1.7));
    // İki katlı Levanten köşkü: taş subasman, cumba, kırma çatı
    g.add(koy(IZ.kutu(4.2, 0.4, 3.2, '#cdbf9f'), 0, 0.1, -1.0));
    g.add(koy(IZ.kutu(4.0, 2.2, 3.0, siva), 0, 0.5, -1.0));
    g.add(koy(IZ.kutu(4.06, 0.1, 3.06, '#f7f0e1'), 0, 1.6, -1.0));
    g.add(koy(IZ.piramit(4.8, 1.2, 3.8, cati), 0, 2.7, -1.0));
    for (const x of [-1.0, 1.0]) g.add(koy(IZ.kutu(0.3, 0.6, 0.3, siva), x, 3.2, -1.2));
    // Cephe pencereleri (yüksek, panjurlu)
    for (const y of [0.75, 1.85]) for (const x of [-1.5, -0.8, 0.8, 1.5]) {
      g.add(koy(IZ.kutu(0.34, 0.6, 0.06, CAM, { isik: '#ffd27a' }), x, y, 0.52));
      for (const s of [-1, 1]) g.add(koy(IZ.kutu(0.16, 0.6, 0.05, '#3f6e5a'), x + s * 0.27, y, 0.54));
    }
    // Merdivenli giriş ve sütunlu balkon
    for (let i = 0; i < 3; i++) g.add(koy(IZ.kutu(1.4 - i * 0.2, 0.14, 0.3, '#e2dac8'), 0, 0.1 + i * 0.14, 1.0 - i * 0.25));
    g.add(koy(IZ.kutu(1.6, 0.12, 0.9, '#f7f0e1'), 0, 1.55, 0.95));
    for (const x of [-0.7, 0.7]) g.add(koy(IZ.silindir(0.07, 0.07, 1.0, 6, '#f7f0e1'), x, 0.5, 1.3));
    for (let i = 0; i < 7; i++) g.add(koy(IZ.kutu(0.04, 0.35, 0.04, '#f7f0e1'), -0.72 + i * 0.24, 1.67, 1.38));
    g.add(koy(IZ.kutu(1.6, 0.04, 0.04, '#f7f0e1'), 0, 2.02, 1.38));
    g.add(koy(IZ.kutu(0.7, 1.0, 0.06, '#5a3e2a'), 0, 0.55, 0.52));
    // Bahçe: palmiye, havuz, çiçek
    palmiye(g, -2.4, 1.4, 1.1);
    palmiye(g, 2.5, -2.8, 1.0);
    agac(g, 2.5, 1.6, 0.9, '#4f9450');
    g.add(koy(IZ.silindir(0.6, 0.65, 0.2, 10, '#d6cfc0'), -1.8, 0.1, 2.6));
    g.add(koy(golgesiz(IZ.silindir(0.5, 0.5, 0.05, 10, '#5db4dd', { puruz: 0.4 })), -1.8, 0.27, 2.6));
    for (let i = 0; i < 8; i++) g.add(koy(IZ.kure(0.1, sec(r, ['#d2452f', '#e0a93b', '#c2478f', '#f4f0e6'])), 1.2 + (i % 4) * 0.3, 0.2, 2.4 + Math.floor(i / 4) * 0.3));
    return g;
  }

  function antik(v, r) {
    const g = new THREE.Group();
    zemin(g, 6.4, 6.4, '#cdbb92');
    const tas = '#e6dcc2', koyu = '#c9b48a';
    // Kazı alanı: basamaklı çukur, temel izleri
    g.add(koy(golgesiz(IZ.kutu(4.6, 0.04, 3.8, '#b8a37a')), 0, 0.1, -0.4));
    for (let i = 0; i < 8; i++) {
      const w = 0.4 + r() * 1.4, d = 0.25;
      g.add(koy(IZ.kutu(w, 0.25 + r() * 0.3, d, koyu), (r() - 0.5) * 3.6, 0.1, (r() - 0.5) * 3.0 - 0.4, r() < 0.5 ? 0 : Math.PI / 2));
    }
    // Ayakta kalan sütunlar, bir kısmı kırık
    for (let i = 0; i < 6; i++) {
      const x = -2.0 + i * 0.8, h = i % 3 === 1 ? 0.8 + r() * 0.6 : 2.0 + r() * 0.4;
      g.add(koy(IZ.kutu(0.4, 0.2, 0.4, tas), x, 0.1, -1.6));
      g.add(koy(IZ.silindir(0.13, 0.15, h, 8, tas), x, 0.3, -1.6));
      if (h > 1.5) g.add(koy(IZ.kutu(0.38, 0.14, 0.38, tas), x, 0.3 + h, -1.6));
    }
    g.add(koy(IZ.kutu(2.6, 0.24, 0.42, tas), -1.2, 2.75, -1.6));
    // Devrik sütun parçaları
    for (let i = 0; i < 3; i++) {
      const p = IZ.silindir(0.14, 0.14, 0.8, 8, tas);
      p.rotation.z = Math.PI / 2;
      p.rotation.y = r() * 3;
      g.add(koy(p, (r() - 0.5) * 3, 0.24, 0.8 + r() * 0.8));
    }
    // Kazı çadırı ve ziyaretçi yolu
    for (const [x, z] of [[1.9, 1.6], [2.9, 1.6], [1.9, 2.6], [2.9, 2.6]]) g.add(koy(IZ.silindir(0.03, 0.03, 1.2, 4, AHSAP), x, 0.1, z));
    g.add(koy(IZ.kutu(1.3, 0.06, 1.3, '#f4f0e6'), 2.4, 1.3, 2.1));
    g.add(koy(golgesiz(IZ.kutu(5.6, 0.05, 0.6, '#a8824f')), 0, 0.12, 2.8));
    for (let i = 0; i < 2; i++) kisi(g, -1 + i * 0.7, 2.8, sec(r, KISI), 0.15);
    cam(g, -2.7, 2.4, 0.9);
    agac(g, -2.8, -2.8, 0.8, '#7a9a4a');
    return g;
  }

  function han(v, r) {
    const g = new THREE.Group();
    zemin(g, 6.2, 6.2);
    const tas = sec(r, ['#c9a676', '#d8c6a4', '#b99a70']), tugla = '#b5653f';
    // Avlulu iki katlı han: dört kanat
    for (const [x, z, w, d] of [[0, -2.2, 5.4, 1.2], [0, 2.2, 5.4, 1.2], [-2.2, 0, 1.2, 3.2], [2.2, 0, 1.2, 3.2]]) {
      g.add(koy(IZ.kutu(w, 2.0, d, tas), x, 0.1, z));
      for (let i = 0; i < 3; i++) g.add(koy(IZ.kutu(w + 0.02, 0.07, d + 0.02, tugla), x, 0.5 + i * 0.6, z));
    }
    g.add(koy(golgesiz(IZ.kutu(3.2, 0.05, 3.2, '#e6dcc2')), 0, 0.1, 0));
    // Avlu revakları (kemer yerine dikdörtgen açıklıklar)
    for (let i = 0; i < 4; i++) for (const s of [-1, 1]) g.add(koy(IZ.kutu(0.5, 0.7, 0.06, '#4a3a2a'), -1.2 + i * 0.8, 0.2, s * 1.58));
    // Kubbecikler
    for (let i = 0; i < 5; i++) for (const s of [-1, 1]) g.add(koy(IZ.kure(0.36, '#8f9ba3', null, true), -2.0 + i * 1.0, 2.1, s * 2.2));
    // Avluda çay bahçesi
    masa(g, -0.6, -0.4, r, sec(r, TENTE));
    masa(g, 0.6, 0.6, r, null);
    agac(g, 0.5, -0.6, 0.9);
    return g;
  }

  // ---------- Doğa, sahil, çocuk ----------
  function park(v, r) {
    const g = new THREE.Group();
    const orman = v.tur === 'orman', bahce = v.tur === 'bahce';
    zemin(g, 7.0, 7.0, orman ? '#7fae63' : '#9cc47e');
    // Kıvrımlı yürüyüş yolu
    for (let i = 0; i < 9; i++) {
      const t = i / 8, x = -3 + t * 6, z = Math.sin(t * Math.PI * 1.5) * 1.6;
      g.add(koy(golgesiz(IZ.kutu(0.9, 0.03, 0.55, '#e6dcc2')), x, 0.1, z, Math.cos(t * Math.PI * 1.5) * 0.7));
    }
    // Gölet
    if (!orman || r() < 0.5) {
      const gol = IZ.silindir(1.2, 1.2, 0.05, 12, '#5db4dd', { puruz: 0.3 });
      gol.scale.set(1.3, 1, 0.8);
      g.add(koy(golgesiz(gol), 1.4, 0.1, -2.0));
      for (let i = 0; i < 2; i++) {
        const o = IZ.kure(0.12, '#f4f4f0');
        o.scale.set(1.4, 0.8, 0.9);
        o.userData.canli = true;
        o.userData.ordek = i;
        g.add(koy(o, 1.2 + i * 0.6, 0.18, -2.0));
      }
    }
    // Ağaçlar
    const n = orman ? 16 : 9;
    for (let i = 0; i < n; i++) {
      const x = (r() - 0.5) * 6.2, z = (r() - 0.5) * 6.2;
      if (Math.abs(z - Math.sin(((x + 3) / 6) * Math.PI * 1.5) * 1.6) < 0.7) continue;
      if (Math.hypot(x - 1.4, z + 2) < 1.7) continue;
      if (orman && r() < 0.6) cam(g, x, z, 0.8 + r() * 0.5);
      else agac(g, x, z, 0.7 + r() * 0.5, sec(r, ['#5fa052', '#4f9450', '#6fb15c', '#7a9a4a']));
    }
    if (bahce) {
      // Sera ve çiçek tarhları
      g.add(koy(IZ.kutu(1.8, 1.0, 1.2, CAM_ACIK, { isik: '#ffe9b0', puruz: 0.3 }), -1.8, 0.1, -2.2));
      g.add(koy(IZ.besikCati(1.9, 0.6, 1.3, CAM_ACIK, { puruz: 0.3 }), -1.8, 1.1, -2.2));
      for (let k = 0; k < 3; k++) for (let i = 0; i < 6; i++) g.add(koy(IZ.kure(0.12, sec(r, ['#d2452f', '#e0a93b', '#c2478f', '#f4f0e6', '#7a5cc0'])), -0.6 + i * 0.3, 0.2, 2.0 + k * 0.35));
    } else {
      // Çardak ve oturma
      for (const [x, z] of [[-2.0, 2.0], [-1.0, 2.0], [-2.0, 2.8], [-1.0, 2.8]]) g.add(koy(IZ.silindir(0.04, 0.04, 1.2, 4, AHSAP), x, 0.1, z));
      g.add(koy(IZ.piramit(1.5, 0.5, 1.2, '#8a6a4a'), -1.5, 1.3, 2.4));
      bank(g, -1.5, 2.4, 0);
    }
    for (let i = 0; i < 3; i++) kisi(g, -2 + i * 1.6, Math.sin(((i * 1.6 + 1) / 6) * Math.PI * 1.5) * 1.6, sec(r, KISI));
    lamba(g, 0.4, 0.9, 1.4);
    g.userData.guncelle = (t) => {
      g.children.forEach((c) => {
        if (c.userData.ordek === undefined) return;
        const a = t * 0.3 + c.userData.ordek * Math.PI;
        c.position.set(1.4 + Math.cos(a) * 0.9, 0.18, -2.0 + Math.sin(a) * 0.5);
        c.rotation.y = -a;
      });
    };
    return g;
  }

  function sahil(v, r) {
    const g = new THREE.Group();
    // Arka (-z) kara, ön (+z) deniz: yürüyüş yolu, bisiklet yolu, çim, palmiye
    zemin(g, 7.0, 4.2, '#9cc47e');
    g.children[0].position.z = -1.2;
    g.add(koy(golgesiz(IZ.kutu(7.0, 0.04, 1.3, '#e8dfcc')), 0, 0.1, 0.4));
    g.add(koy(golgesiz(IZ.kutu(7.0, 0.045, 0.5, '#c45c3c')), 0, 0.1, -0.5));
    for (let i = 0; i < 7; i++) g.add(koy(golgesiz(IZ.kutu(0.4, 0.05, 0.04, '#f4f0e6')), -3 + i, 0.1, -0.5));
    // Kıyı taşı ve korkuluk
    g.add(koy(IZ.kutu(7.0, 0.3, 0.3, '#cfc6ae'), 0, -0.1, 1.15));
    for (let i = 0; i < 12; i++) g.add(koy(IZ.silindir(0.03, 0.03, 0.5, 4, '#4a4f55'), -3.3 + i * 0.6, 0.2, 1.2));
    g.add(koy(IZ.kutu(7.0, 0.04, 0.04, '#4a4f55'), 0, 0.68, 1.2));
    for (let i = 0; i < 4; i++) {
      palmiye(g, -2.6 + i * 1.75, -1.3, 0.9 + r() * 0.3);
      bank(g, -1.75 + i * 1.75, 0.85, 0);
      lamba(g, -3.0 + i * 1.75 + 0.4, 0.95, 1.5);
    }
    for (let i = 0; i < 6; i++) kisi(g, (r() - 0.5) * 6, 0.1 + r() * 0.6, sec(r, KISI));
    // Bisikletli ve çim üstünde piknik
    g.add(koy(IZ.kutu(0.9, 0.03, 0.7, sec(r, TENTE)), 1.5, 0.12, -2.4));
    kisi(g, 1.3, -2.4, sec(r, KISI));
    agac(g, -2.2, -2.6, 1.0);
    // Deniz tarafında küçük tekne
    const t = new THREE.Group();
    t.add(IZ.kutu(1.3, 0.25, 0.45, '#f4f4f0'));
    t.add(koy(IZ.kutu(1.32, 0.07, 0.47, '#d2452f'), 0, 0.05, 0));
    g.add(koy(t, 1.8, -0.55, 2.6, 0.3));
    return g;
  }

  function bilim(v, r) {
    const g = new THREE.Group();
    zemin(g, 6.4, 6.4);
    const renk = sec(r, ['#2f7fd1', '#2f8f7f', '#7a5cc0', '#e07a3b']);
    g.add(koy(IZ.kutu(4.6, 1.8, 2.8, '#f4f4f0'), -0.4, 0.1, -1.2));
    g.add(koy(IZ.kutu(4.62, 0.5, 2.82, renk), -0.4, 1.0, -1.2));
    pencereSirasi(g, -2.5, 1.7, 0.35, 0.21, 0.4);
    // Planetaryum kubbesi
    g.add(koy(IZ.silindir(1.2, 1.2, 0.3, 14, '#e8ecef'), 1.2, 1.9, -1.4));
    g.add(koy(IZ.kure(1.2, '#c8d4dc', { metal: 0.3, puruz: 0.4 }, true), 1.2, 2.2, -1.4));
    // Avluda dev atom maketi ve teleskop
    const atom = new THREE.Group();
    atom.add(IZ.kure(0.28, '#d2452f'));
    for (let i = 0; i < 3; i++) {
      const y = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.035, 4, 20), IZ.mat('#e0a93b'));
      y.rotation.set(Math.PI / 2 + i * 1.0, i * 1.0, 0);
      atom.add(y);
    }
    atom.position.set(-1.6, 1.4, 1.6);
    atom.userData.canli = true;
    g.add(atom);
    g.add(koy(IZ.silindir(0.08, 0.1, 0.6, 5, '#8f9ba3'), -1.6, 0.1, 1.6));
    const tel = IZ.silindir(0.14, 0.1, 1.0, 6, '#3a3f45');
    tel.rotation.x = -0.8;
    g.add(koy(tel, 1.6, 0.7, 1.8));
    g.add(koy(IZ.silindir(0.04, 0.06, 0.6, 4, '#4a4f55'), 1.6, 0.1, 1.8));
    for (let i = 0; i < 4; i++) kisi(g, (r() - 0.5) * 4, 1.0 + r() * 1.4, sec(r, ['#d2452f', '#e0a93b', '#3d6fa8', '#5a9148']));
    agac(g, 2.8, 2.8, 0.8);
    g.userData.guncelle = (t) => { atom.rotation.y = t * 0.6; atom.rotation.x = Math.sin(t * 0.4) * 0.4; };
    return g;
  }

  function oyun(v, r) {
    const g = new THREE.Group();
    zemin(g, 6.4, 6.4, '#9cc47e');
    // Kauçuk zemin
    g.add(koy(golgesiz(IZ.kutu(4.8, 0.04, 3.8, '#e07a3b')), 0, 0.1, 0.2));
    // Oyun kulesi, kaydırak
    g.add(koy(IZ.kutu(1.2, 1.4, 1.2, '#2f7fd1'), -1.2, 0.1, -0.5));
    g.add(koy(IZ.piramit(1.5, 0.8, 1.5, '#d2452f'), -1.2, 1.5, -0.5));
    for (const [dx, dz] of [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]]) g.add(koy(IZ.silindir(0.04, 0.04, 0.6, 4, '#e0a93b'), -1.2 + dx, 1.5, -0.5 + dz));
    // Tırmanma ağı
    for (let i = 0; i < 4; i++) g.add(koy(IZ.kutu(0.04, 1.3, 0.04, '#f4f0e6'), -1.85, 0.1, -0.95 + i * 0.3));
    for (let i = 0; i < 4; i++) g.add(koy(IZ.kutu(0.04, 0.04, 1.0, '#f4f0e6'), -1.85, 0.4 + i * 0.3, -0.5));
    const kay = IZ.kutu(0.5, 0.06, 1.9, '#e0a93b');
    kay.rotation.x = 0.6;
    g.add(koy(kay, -1.2, 0.68, 0.85));
    // Salıncak
    for (const x of [0.6, 2.2]) {
      const a = IZ.kutu(0.07, 1.7, 0.07, '#5a9148');
      g.add(koy(a, x, 0.1, -0.6));
    }
    g.add(koy(IZ.kutu(1.7, 0.07, 0.07, '#5a9148'), 1.4, 1.8, -0.6));
    const salincak = new THREE.Group();
    for (const x of [-0.35, 0.35]) {
      salincak.add(koy(IZ.kutu(0.02, 1.2, 0.02, '#4a4f55'), x, -1.2, 0));
      salincak.add(koy(IZ.kutu(0.3, 0.05, 0.25, '#d2452f'), x, -1.25, 0));
    }
    salincak.position.set(1.4, 1.8, -0.6);
    salincak.userData.canli = true;
    g.add(salincak);
    // Tahterevalli ve kum havuzu
    const tahta = IZ.kutu(1.8, 0.06, 0.25, '#c2478f');
    tahta.userData.canli = true;
    g.add(koy(IZ.kutu(0.2, 0.35, 0.2, '#555b62'), 1.4, 0.1, 1.2));
    g.add(koy(tahta, 1.4, 0.45, 1.2));
    g.add(koy(IZ.kutu(1.4, 0.12, 1.0, '#cfc6ae'), -1.4, 0.1, 1.6));
    g.add(koy(golgesiz(IZ.kutu(1.2, 0.1, 0.8, '#ead9a6')), -1.4, 0.12, 1.6));
    for (let i = 0; i < 5; i++) {
      const x = (r() - 0.5) * 4, z = (r() - 0.5) * 3;
      g.add(koy(IZ.silindir(0.07, 0.09, 0.24, 5, sec(r, ['#d2452f', '#e0a93b', '#3d6fa8', '#5a9148'])), x, 0.12, z));
      g.add(koy(IZ.kure(0.08, '#e8c4a0'), x, 0.44, z));
    }
    agac(g, -2.8, -2.6, 1.0);
    agac(g, 2.8, -2.6, 0.9, '#4f9450');
    agac(g, 2.8, 2.6, 0.8);
    bank(g, 0, 2.6, 0);
    g.userData.guncelle = (t) => {
      salincak.rotation.x = Math.sin(t * 1.8) * 0.45;
      tahta.rotation.z = Math.sin(t * 1.2) * 0.25;
    };
    return g;
  }

  function hayvan(v, r) {
    // Akvaryum/hayvan bahçesi: cam tüneller ve havuz
    const g = new THREE.Group();
    zemin(g, 6.4, 6.4);
    g.add(koy(IZ.kutu(4.4, 1.6, 2.6, '#eef0ec'), 0, 0.1, -1.6));
    const dalga = IZ.kutu(4.42, 0.4, 2.62, '#2f7fd1');
    g.add(koy(dalga, 0, 1.0, -1.6));
    g.add(koy(IZ.kutu(2.0, 1.2, 0.06, CAM_ACIK, { isik: '#9fe0ff', puruz: 0.3 }), 0, 0.2, -0.29));
    const havuz = IZ.silindir(1.4, 1.4, 0.3, 12, '#cfc6ae');
    g.add(koy(havuz, 0.8, 0.1, 1.6));
    g.add(koy(golgesiz(IZ.silindir(1.25, 1.25, 0.05, 12, '#3fa6d8', { puruz: 0.3 })), 0.8, 0.38, 1.6));
    const balik = new THREE.Group();
    const b = IZ.kure(0.22, '#e07a3b');
    b.scale.set(1.6, 0.8, 0.6);
    balik.add(b);
    const kuyruk = IZ.koni(0.14, 0.25, 4, '#e07a3b');
    kuyruk.rotation.z = Math.PI / 2;
    balik.add(koy(kuyruk, -0.3, 0, 0));
    balik.userData.canli = true;
    g.add(balik);
    agac(g, -2.6, 2.2, 1.0);
    palmiye(g, 2.8, -2.6, 0.9);
    for (let i = 0; i < 4; i++) kisi(g, -2 + i * 0.6, 1.0 + r(), sec(r, KISI));
    g.userData.guncelle = (t) => { balik.position.set(0.8 + Math.cos(t) * 0.8, 0.45, 1.6 + Math.sin(t) * 0.8); balik.rotation.y = -t - Math.PI / 2; };
    return g;
  }

  const TURLER = {
    restoran, meyhane: restoran, balik: restoran, kahvalti: restoran,
    kafe, pastane: kafe,
    sokak, gece: sokak,
    pazar, carsi: pazar,
    avm, outlet: avm,
    stadyum, salon, sahne: salon, sinema: salon, spor: salon,
    lunapark, marina,
    muze, galeri: muze, 'kultur-merkezi': muze,
    cami, kilise, sinagog: kilise, kosk, antik, han,
    park, orman: park, bahce: park, sahil, bilim, oyun, hayvan
  };

  IZ.mekanModeli = function (veri) {
    const r = tohum(veri.id);
    const f = TURLER[veri.tur] || muze;
    const g = f(veri, r);
    return g;
  };
  IZ.mekanTuruVar = (tur) => !!TURLER[tur];
})();
