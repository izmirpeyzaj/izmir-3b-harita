// Simge yapıların low-poly modelleri. Her fonksiyon bir THREE.Group döndürür.
// Yerel eksenler: -z kuzey (deniz tarafı), +z güney, -x batı.
(function () {
  const THREE = window.THREE;
  const IZ = window.IZ;
  const koy = IZ.koy;

  function sutunHalkasi(grup, adet, yaricap, y, h, r, renk) {
    for (let i = 0; i < adet; i++) {
      const a = (i / adet) * Math.PI * 2;
      grup.add(koy(IZ.silindir(r, r, h, 5, renk), Math.cos(a) * yaricap, y, Math.sin(a) * yaricap));
    }
  }

  function evcik(w, h, d, renk, catiRenk) {
    const g = new THREE.Group();
    g.add(IZ.kutu(w, h, d, renk));
    g.add(koy(IZ.piramit(w * 1.12, h * 0.55, d * 1.12, catiRenk), 0, h, 0));
    return g;
  }

  // ---------- Saat Kulesi ----------
  function saatKulesi() {
    const g = new THREE.Group();
    const tas = '#ecdcb9', koyu = '#c9a676', beyaz = '#f7f0e1', kubbe = '#6f8f8a', altin = '#d9b23c';

    // Basamaklı sekizgen kaide
    g.add(IZ.silindir(4.7, 5.0, 0.4, 8, '#d6cfc0'));
    g.add(koy(IZ.silindir(3.7, 3.9, 0.4, 8, beyaz), 0, 0.4, 0));

    // Dört köşedeki kubbeli çeşme köşkleri
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + (i * Math.PI) / 2;
      const k = new THREE.Group();
      k.add(IZ.silindir(0.8, 0.85, 0.45, 8, tas));
      sutunHalkasi(k, 6, 0.6, 0.45, 1.25, 0.08, beyaz);
      k.add(koy(IZ.silindir(0.85, 0.85, 0.16, 8, koyu), 0, 1.7, 0));
      k.add(koy(IZ.kure(0.72, kubbe, null, true), 0, 1.86, 0));
      k.add(koy(IZ.koni(0.07, 0.4, 5, altin), 0, 2.55, 0));
      // Çeşme teknesi
      k.add(koy(IZ.silindir(0.2, 0.26, 0.6, 6, beyaz), 0, 0.45, 0));
      k.add(koy(IZ.silindir(0.46, 0.46, 0.05, 8, '#5db4dd', { puruz: 0.4 }), 0, 0.46, 0));
      k.position.set(Math.cos(a) * 2.75, 0.8, Math.sin(a) * 2.75);
      g.add(k);
    }

    // Gövde katları
    let y = 0.8;
    function kat(r, h) {
      // Sekizgenin yüzleri ana yönlere baksın diye gövde 22,5° döndürülür
      g.add(koy(IZ.silindir(r, r * 1.04, h, 8, tas), 0, y, 0, Math.PI / 8));
      // Köşe sütunçeleri
      for (let i = 0; i < 8; i++) {
        const a = Math.PI / 8 + (i * Math.PI) / 4;
        g.add(koy(IZ.silindir(0.07, 0.085, h, 5, beyaz), Math.sin(a) * r * 1.01, y, Math.cos(a) * r * 1.01));
      }
      // At nalı kemerli pencereler (ana yönlerde büyük, ara yönlerde küçük)
      for (let i = 0; i < 8; i++) {
        const p = new THREE.Group();
        const w = r * (i % 2 ? 0.26 : 0.4), ph = h * (i % 2 ? 0.3 : 0.46), z = r * 0.924;
        p.add(koy(IZ.kutu(w, ph, 0.08, '#8a7a63'), 0, h * 0.22, z));
        p.add(koy(alinlik(w / 2, '#8a7a63'), 0, h * 0.22 + ph, z - 0.04));
        p.add(koy(yarimHalka(w / 2 + 0.05, 0.035, beyaz), 0, h * 0.22 + ph, z + 0.05));
        p.rotation.y = (i * Math.PI) / 4;
        p.position.y = y;
        g.add(p);
      }
      y += h;
      g.add(koy(IZ.silindir(r + 0.25, r + 0.1, 0.26, 8, koyu), 0, y, 0, Math.PI / 8));
      y += 0.26;
    }
    kat(1.55, 3.2);
    // Birinci kat balkonu
    sutunHalkasi(g, 16, 1.7, y, 0.3, 0.03, beyaz);
    const kork = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.03, 3, 16), IZ.mat(beyaz));
    kork.rotation.x = Math.PI / 2;
    g.add(koy(kork, 0, y + 0.3, 0));
    kat(1.32, 3.0);

    // Saat katı
    g.add(koy(IZ.kutu(2.3, 2.3, 2.3, tas), 0, y, 0));
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Group();
      const kadran = IZ.silindir(0.82, 0.82, 0.1, 12, '#fffdf5', { isik: '#fff0c0' });
      kadran.rotation.x = Math.PI / 2;
      kadran.position.set(0, 1.15, 1.13);
      p.add(kadran);
      p.add(koy(IZ.kutu(0.07, 0.6, 0.04, '#2c2c2c'), 0, 1.15, 1.24));
      const akrep = IZ.kutu(0.07, 0.42, 0.04, '#2c2c2c');
      akrep.rotation.z = -Math.PI / 2.6;
      p.add(koy(akrep, 0, 1.15, 1.24));
      // Kadran çerçevesi ve saat çizgileri
      const cerceve = new THREE.Mesh(new THREE.TorusGeometry(0.84, 0.05, 4, 14), IZ.mat(koyu));
      p.add(koy(cerceve, 0, 1.15, 1.2));
      for (let k = 0; k < 12; k += 3) p.add(koy(IZ.kutu(0.07, 0.14, 0.03, '#2c2c2c'), Math.sin((k * Math.PI) / 6) * 0.66, 1.08 + Math.cos((k * Math.PI) / 6) * 0.66, 1.24));
      for (const sx of [-1, 1]) p.add(koy(IZ.silindir(0.09, 0.1, 2.3, 5, beyaz), sx * 1.1, 0, 1.1));
      p.rotation.y = (i * Math.PI) / 2;
      p.position.y = y;
      g.add(p);
    }
    y += 2.3;
    g.add(koy(IZ.kutu(2.75, 0.26, 2.75, koyu), 0, y, 0));
    y += 0.26;

    // Sütunlu fener ve kubbe
    g.add(koy(IZ.silindir(0.95, 1.0, 0.25, 8, tas), 0, y, 0));
    sutunHalkasi(g, 8, 0.78, y + 0.25, 1.3, 0.09, beyaz);
    g.add(koy(IZ.silindir(0.55, 0.55, 1.3, 8, '#b9a98a'), 0, y + 0.25, 0));
    y += 1.55;
    g.add(koy(IZ.silindir(1.05, 1.0, 0.2, 8, koyu), 0, y, 0));
    g.add(koy(IZ.kure(0.85, kubbe, null, true), 0, y + 0.2, 0));
    g.add(koy(IZ.koni(0.1, 0.9, 5, altin), 0, y + 1.0, 0));
    g.add(koy(IZ.kure(0.14, altin), 0, y + 1.25, 0));
    // Meydan lambaları ve güvercinler
    for (let i = 0; i < 4; i++) lamba(g, Math.sin((i * Math.PI) / 2) * 4.3, 0.4, Math.cos((i * Math.PI) / 2) * 4.3, 1.5);
    [[3.9, 1.6, 0.4], [4.2, 2.1, 2.0], [3.6, 2.4, 4.1], [-4.1, 1.2, 1.0], [-3.8, 1.9, 3.3], [-4.3, -1.6, 5.0], [1.4, -4.2, 0.7], [2.0, -3.9, 2.6], [-1.8, 4.1, 3.9], [-1.1, 4.4, 5.5]]
      .forEach(([x, z, ry]) => guvercin(g, x, 0.4, z, ry));
    return g;
  }

  // ---------- Tarihi Asansör ----------
  function asansor() {
    const g = new THREE.Group();
    const tugla = '#b8674b', tas = '#e2d3b0', kaya = '#a39473', cati = '#a3472f', cam = '#3d5a73';

    // Yamaç (güneyde yükselir)
    g.add(koy(IZ.kutu(17, 3.2, 10, kaya), 0, 0, 6.6));
    g.add(koy(IZ.kutu(14, 7, 7, '#97886a'), 0.5, 0, 7.5));
    g.add(koy(IZ.kutu(14, 0.25, 7, '#86b266'), 0.5, 7, 7.5));
    g.add(koy(IZ.kutu(17, 0.2, 3, '#93bb70'), 0, 3.2, 2.9));

    // Kule gövdesi
    g.add(koy(IZ.kutu(2.6, 7, 2.6, tugla), 0, 0, 0.3));
    g.add(koy(IZ.kutu(2.8, 0.22, 2.8, tas), 0, 2.3, 0.3));
    g.add(koy(IZ.kutu(2.8, 0.22, 2.8, tas), 0, 4.6, 0.3));
    for (const yy of [0.9, 3.1, 5.4]) {
      g.add(koy(IZ.kutu(0.7, 1.0, 0.1, cam, { isik: '#ffd27a' }), 0, yy, -1.02));
    }

    // Üst kabin ve çatı
    g.add(koy(IZ.kutu(3.4, 0.25, 3.4, tas), 0, 7, 0.3));
    g.add(koy(IZ.kutu(3.1, 1.9, 3.1, tas), 0, 7.25, 0.3));
    g.add(koy(IZ.kutu(3.16, 0.9, 3.16, cam, { isik: '#ffd27a' }), 0, 7.75, 0.3));
    for (const sx of [-1.5, -0.5, 0.5, 1.5]) {
      g.add(koy(IZ.kutu(0.22, 1.9, 3.22, tas), sx, 7.25, 0.3));
      g.add(koy(IZ.kutu(3.22, 1.9, 0.22, tas), 0, 7.25, 0.3 + sx));
    }
    g.add(koy(IZ.piramit(3.9, 1.3, 3.9, cati), 0, 9.15, 0.3));
    g.add(koy(IZ.silindir(0.04, 0.04, 1.2, 4, '#555555'), 0, 10.4, 0.3));

    // Üst terasa köprü ve korkuluklar
    g.add(koy(IZ.kutu(1.8, 0.3, 3.0, tas), 0, 6.75, 2.9));
    g.add(koy(IZ.kutu(0.1, 0.6, 3.0, '#5b5b5b'), -0.85, 7.05, 2.9));
    g.add(koy(IZ.kutu(0.1, 0.6, 3.0, '#5b5b5b'), 0.85, 7.05, 2.9));

    // Alt giriş binası
    g.add(koy(IZ.kutu(4.6, 2.0, 1.8, tas), 0, 0, -1.6));
    g.add(koy(IZ.kutu(4.9, 0.25, 2.1, '#c9b48a'), 0, 2.0, -1.6));
    g.add(koy(IZ.kutu(1.0, 1.4, 0.1, '#5a3b2a'), 0, 0, -2.52));
    g.add(koy(IZ.kutu(0.7, 0.8, 0.1, cam, { isik: '#ffd27a' }), -1.5, 0.7, -2.52));
    g.add(koy(IZ.kutu(0.7, 0.8, 0.1, cam, { isik: '#ffd27a' }), 1.5, 0.7, -2.52));

    // Yamaçtaki evler
    const renkler = ['#f3e6cf', '#f1cdb4', '#e9eef0', '#f5dfa8', '#e8c6c0'];
    const evler = [[-5, 7.25, 6, 0], [-2.2, 7.25, 8.6, 1], [3.6, 7.25, 6.4, 2], [5.6, 7.25, 9, 3], [-6.5, 3.4, 2.9, 4], [5.5, 3.4, 2.9, 0], [-3.5, 3.4, 3.1, 2]];
    for (const [x, y, z, r] of evler) g.add(koy(evcik(1.9, 1.5, 1.7, renkler[r], cati), x, y, z));
    // Kule: köşe taşları, yan pencereler ve tabela
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) g.add(koy(IZ.kutu(0.24, 7, 0.24, tas), sx * 1.24, 0, 0.3 + sz * 1.24));
      for (const yy of [0.9, 3.1, 5.4]) g.add(koy(IZ.kutu(0.1, 1.0, 0.7, cam, { isik: '#ffd27a' }), sx * 1.31, yy, 0.3));
    }
    for (const yy of [1.9, 4.1, 6.4]) g.add(koy(alinlik(0.35, cam, { isik: '#ffd27a' }), 0, yy, -1.07, Math.PI));
    g.add(koy(IZ.kutu(1.9, 0.34, 0.06, '#2b3a4a'), 0, 1.5, -2.54));
    g.add(koy(IZ.kutu(1.5, 0.08, 0.04, '#d9b23c'), 0, 1.63, -2.58));
    // Sokaktan yamaca çıkan merdivenler
    for (let i = 0; i < 8; i++) g.add(koy(IZ.kutu(1.2, 0.4 * (i + 1), 0.5, i % 2 ? '#cfc3a6' : '#dbd0b4'), -7.6, 0, -2.4 + i * 0.5));
    for (let i = 0; i < 8; i++) g.add(koy(IZ.kutu(0.9, 0.5 * (i + 1), 0.45, i % 2 ? '#cfc3a6' : '#dbd0b4'), 8.0, 3.2, 4.3 + i * 0.45));
    // Üst teras: korkuluk, kafe şemsiyeleri, selviler
    g.add(koy(IZ.kutu(5.5, 0.45, 0.12, tas), -3.7, 7.25, 4.1));
    g.add(koy(IZ.kutu(6.5, 0.45, 0.12, tas), 4.2, 7.25, 4.1));
    semsiye(g, -1.7, 7.25, 5.1, '#e85d4a');
    semsiye(g, 1.9, 7.25, 5.2, '#f4f0e6');
    semsiye(g, 0.2, 7.25, 6.6, '#e0a93b');
    selvi(g, 6.9, 7.25, 5.0, 1.0);
    selvi(g, -6.2, 7.25, 9.6, 1.1);
    selvi(g, 1.0, 7.25, 10.2, 0.9);
    lamba(g, -3.2, 0, -2.9, 1.5);
    lamba(g, 3.2, 0, -2.9, 1.5);
    lamba(g, -0.75, 7.05, 4.2, 1.1);
    lamba(g, 0.75, 7.05, 4.2, 1.1);
    return g;
  }

  // ---------- Konak Pier ----------
  function konakPier() {
    const g = new THREE.Group();
    const duvar = '#f2e8d2', cati = '#9db0b8', cam = '#36546d', sac = '#c9b996';

    // İskele platformu ve kazıklar
    g.add(koy(IZ.kutu(16.5, 0.5, 7.6, '#b9b0a0'), 0, -0.5, 0));
    for (let x = -7.5; x <= 4.6; x += 2.4) {
      for (const z of [-3.3, 3.3]) g.add(koy(IZ.silindir(0.2, 0.2, 1.4, 5, '#7c7468'), x, -1.6, z));
    }

    // İki uzun hol
    for (const z of [-2.15, 2.15]) {
      g.add(koy(IZ.kutu(11.6, 1.7, 3.0, duvar), -0.9, 0, z));
      g.add(koy(IZ.kutu(11.66, 0.75, 3.06, cam, { isik: '#ffd27a' }), -0.9, 0.55, z));
      for (let x = -6.6; x <= 4.9; x += 1.28) g.add(koy(IZ.kutu(0.28, 1.7, 3.14, duvar), x, 0, z));
      const c = IZ.besikCati(3.5, 1.25, 12.0, cati);
      c.rotation.y = Math.PI / 2;
      g.add(koy(c, -0.9, 1.7, z));
      // Çatı feneri
      const f = IZ.besikCati(0.9, 0.45, 9.0, '#dfe7ea');
      f.rotation.y = Math.PI / 2;
      g.add(koy(f, -0.9, 2.75, z));
    }
    g.add(koy(IZ.kutu(11.6, 1.35, 1.4, '#e6dabf'), -0.9, 0, 0));

    // Kara tarafındaki giriş bloğu ve iki kule
    g.add(koy(IZ.kutu(2.3, 2.6, 7.3, duvar), 6.1, 0, 0));
    g.add(koy(IZ.kutu(2.6, 0.26, 7.6, sac), 6.1, 2.6, 0));
    g.add(koy(IZ.kutu(0.1, 1.7, 1.7, '#4a3a2c'), 7.27, 0, 0));
    for (const z of [-1.9, 1.9]) g.add(koy(IZ.kutu(0.1, 0.9, 1.0, cam, { isik: '#ffd27a' }), 7.27, 0.9, z));
    for (const z of [-3.1, 3.1]) {
      g.add(koy(IZ.kutu(1.3, 3.7, 1.3, duvar), 6.1, 0, z));
      g.add(koy(IZ.kutu(1.5, 0.2, 1.5, sac), 6.1, 3.7, z));
      g.add(koy(IZ.piramit(1.6, 1.0, 1.6, cati), 6.1, 3.9, z));
    }

    // Deniz ucundaki teras
    g.add(koy(IZ.kutu(1.6, 0.12, 7.0, '#d9ceb8'), -7.3, 0, 0));
    for (const z of [-2.2, 0, 2.2]) {
      g.add(koy(IZ.silindir(0.04, 0.04, 1.0, 4, '#666666'), -7.3, 0.12, z));
      g.add(koy(IZ.koni(0.7, 0.35, 6, '#e85d4a'), -7.3, 1.05, z));
      g.add(koy(IZ.silindir(0.3, 0.3, 0.05, 6, '#f4f0e6'), -7.3, 0.55, z));
    }
    // Teras korkuluğu ve lambalar
    g.add(koy(IZ.kutu(0.05, 0.05, 7.4, '#666666'), -8.15, 0.55, 0));
    for (let z = -3.6; z <= 3.61; z += 1.2) g.add(koy(IZ.silindir(0.03, 0.03, 0.55, 4, '#666666'), -8.15, 0, z));
    lamba(g, -7.9, 0, -3.4, 1.4);
    lamba(g, -7.9, 0, 3.4, 1.4);
    // Hollerin dış cephesinde çizgili tenteler
    for (const s of [-1, 1]) {
      for (let x = -6.0; x <= 4.3; x += 2.56) {
        const t = IZ.kutu(1.7, 0.05, 0.55, x > -2 && x < 1 ? '#f4f0e6' : '#e85d4a');
        t.rotation.x = s * 0.45;
        g.add(koy(t, x, 1.3, s * 3.78));
      }
    }
    // Giriş: tabela, kule pencereleri, rüzgârgülleri
    g.add(koy(IZ.kutu(0.08, 0.42, 2.4, '#2b3a4a'), 7.3, 1.95, 0));
    g.add(koy(IZ.kutu(0.5, 0.08, 2.2, sac), 7.5, 1.75, 0));
    for (const z of [-3.1, 3.1]) {
      g.add(koy(IZ.kutu(0.08, 0.7, 0.5, cam, { isik: '#ffd27a' }), 6.77, 2.5, z));
      g.add(koy(IZ.kutu(0.08, 0.7, 0.5, cam, { isik: '#ffd27a' }), 5.43, 2.5, z));
      g.add(koy(IZ.silindir(0.03, 0.03, 0.7, 4, '#666666'), 6.1, 4.9, z));
      g.add(koy(IZ.kure(0.09, '#d9b23c'), 6.1, 5.6, z));
    }
    // Çatı havalandırma bacaları
    for (const z of [-2.15, 2.15]) for (const x of [-4.4, -0.9, 2.6]) g.add(koy(IZ.kutu(0.5, 0.35, 0.5, '#dfe7ea'), x, 3.15, z));
    // İskeleye bağlı tekneler
    [[-3.2, 4.9, '#1f5f8b'], [-5.6, -4.9, '#b23a48']].forEach(([x, z, renk]) => {
      g.add(koy(IZ.kutu(1.7, 0.4, 0.62, '#f4f4f0'), x, -0.78, z));
      g.add(koy(IZ.kutu(1.74, 0.12, 0.66, renk), x, -0.78, z));
      g.add(koy(IZ.kutu(0.6, 0.3, 0.46, '#ffffff'), x + 0.2, -0.38, z));
    });
    return g;
  }

  // ---------- Konak Yalı Camii ----------
  function yaliCamii() {
    const g = new THREE.Group();
    const tas = '#f0e3c8', cini = '#3f9aa8', kursun = '#8b9a9c', altin = '#d9b23c';
    g.add(IZ.silindir(2.9, 3.0, 0.25, 8, '#d6cfc0'));
    g.add(koy(IZ.silindir(2.2, 2.25, 2.5, 8, tas), 0, 0.25, 0));
    g.add(koy(IZ.silindir(2.27, 2.27, 0.75, 8, cini), 0, 1.2, 0));
    for (let i = 0; i < 8; i++) {
      const p = new THREE.Group();
      p.add(koy(IZ.kutu(0.5, 0.9, 0.08, '#2c4a5a', { isik: '#ffd27a' }), 0, 1.1, 2.1));
      p.rotation.y = (i * Math.PI) / 4 + Math.PI / 8;
      g.add(p);
    }
    g.add(koy(IZ.silindir(2.4, 2.3, 0.22, 8, '#c9a676'), 0, 2.75, 0));
    g.add(koy(IZ.silindir(1.9, 2.1, 0.4, 8, tas), 0, 2.97, 0));
    g.add(koy(IZ.kure(1.85, kursun, null, true), 0, 3.37, 0));
    g.add(koy(IZ.koni(0.09, 0.7, 5, altin), 0, 5.15, 0));
    g.add(koy(IZ.kutu(0.8, 1.4, 0.1, '#5a3b2a'), 0, 0.25, -2.24));
    // Köşe pilastrları, çini bordürleri, kemerli pencere alınlıkları, kasnak pencereleri
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      if (i !== 4) g.add(koy(IZ.silindir(0.09, 0.11, 2.5, 5, '#fbf5e6'), Math.sin(a) * 2.21, 0.25, Math.cos(a) * 2.21));
      const p = new THREE.Group();
      p.add(koy(alinlik(0.25, '#2c4a5a', { isik: '#ffd27a' }), 0, 2.0, 2.06));
      p.add(koy(yarimHalka(0.3, 0.035, '#fbf5e6'), 0, 2.0, 2.16));
      p.add(koy(IZ.kutu(0.3, 0.24, 0.06, '#2c4a5a', { isik: '#ffd27a' }), 0, 3.05, 1.84));
      p.rotation.y = a + Math.PI / 8;
      g.add(p);
    }
    for (const yy of [1.14, 1.93]) g.add(koy(IZ.silindir(2.3, 2.3, 0.08, 8, '#1f6f86'), 0, yy, 0));
    // Giriş saçağı ve şadırvan
    g.add(koy(IZ.kutu(1.5, 0.1, 0.7, '#c9a676'), 0, 1.8, -2.55));
    g.add(koy(IZ.piramit(1.5, 0.3, 0.7, kursun), 0, 1.9, -2.55));
    for (const x of [-0.62, 0.62]) g.add(koy(IZ.silindir(0.05, 0.06, 1.55, 5, '#fbf5e6'), x, 0.25, -2.8));
    g.add(koy(IZ.silindir(0.42, 0.48, 0.4, 8, tas), 1.95, 0.25, -1.85));
    g.add(koy(IZ.silindir(0.36, 0.36, 0.05, 8, '#5db4dd', { puruz: 0.4 }), 1.95, 0.62, -1.85));
    g.add(koy(IZ.kure(0.1, altin), 0, 5.9, 0));
    g.add(koy(IZ.kure(0.07, altin), -2.5, 8.45, 0.9));
    const serefe = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.03, 3, 10), IZ.mat('#fbf5e6'));
    serefe.rotation.x = Math.PI / 2;
    g.add(koy(serefe, -2.5, 5.85, 0.9));
    // Minare
    g.add(koy(IZ.silindir(0.3, 0.38, 5.2, 8, tas), -2.5, 0, 0.9));
    g.add(koy(IZ.silindir(0.58, 0.36, 0.3, 8, '#c9a676'), -2.5, 5.2, 0.9));
    g.add(koy(IZ.silindir(0.5, 0.5, 0.3, 8, tas), -2.5, 5.5, 0.9));
    g.add(koy(IZ.silindir(0.24, 0.26, 1.2, 8, tas), -2.5, 5.8, 0.9));
    g.add(koy(IZ.koni(0.33, 1.4, 8, kursun), -2.5, 7.0, 0.9));
    return g;
  }

  // ---------- Kızlarağası Hanı ----------
  function kizlaragasi() {
    const g = new THREE.Group();
    const tas = '#e6d2a8', cati = '#b24a33', cam = '#4a3a2c';
    g.add(koy(IZ.kutu(5.4, 0.08, 5.4, '#d8ccb0'), 0, 0, 0));
    for (const z of [-3.6, 3.6]) {
      g.add(koy(IZ.kutu(9.4, 2.7, 2.2, tas), 0, 0, z));
      g.add(koy(IZ.kutu(8.6, 0.45, 2.26, cam, { isik: '#ffd27a' }), 0, 1.7, z));
      for (let x = -4; x <= 4; x += 1) g.add(koy(IZ.kutu(0.35, 2.7, 2.3, tas), x, 0, z));
      const c = IZ.besikCati(2.6, 0.9, 9.8, cati);
      c.rotation.y = Math.PI / 2;
      g.add(koy(c, 0, 2.7, z));
    }
    for (const x of [-3.6, 3.6]) {
      g.add(koy(IZ.kutu(2.2, 2.7, 5.0, tas), x, 0, 0));
      g.add(koy(IZ.kutu(2.26, 0.45, 4.4, cam, { isik: '#ffd27a' }), x, 1.7, 0));
      for (let z = -2; z <= 2; z += 1) g.add(koy(IZ.kutu(2.3, 2.7, 0.35, tas), x, 0, z));
      g.add(koy(IZ.besikCati(2.6, 0.9, 5.2, cati), x, 2.7, 0));
    }
    for (const x of [-3.6, 3.6]) for (const z of [-3.6, 3.6]) g.add(koy(IZ.kure(0.75, '#8b9a9c', null, true), x, 3.25, z));
    // Kemerli giriş
    g.add(koy(IZ.kutu(1.6, 3.1, 0.5, tas), 0, 0, -4.6));
    g.add(koy(IZ.kutu(1.0, 1.9, 0.1, '#3a2a1e'), 0, 0, -4.87));
    g.add(koy(IZ.besikCati(1.9, 0.6, 0.7, cati), 0, 3.1, -4.6));
    // Avlu
    g.add(koy(IZ.silindir(0.12, 0.15, 1.2, 5, '#8a6a4a'), 0, 0, 0));
    g.add(koy(IZ.kure(0.8, '#5fa052'), 0, 1.7, 0));
    for (const [x, z] of [[-1.5, -1.3], [1.5, 1.2], [-1.3, 1.4]]) {
      g.add(koy(IZ.koni(0.55, 0.3, 6, '#e85d4a'), x, 0.9, z));
      g.add(koy(IZ.silindir(0.03, 0.03, 0.85, 4, '#666666'), x, 0.08, z));
      g.add(koy(IZ.silindir(0.26, 0.26, 0.05, 6, '#f4f0e6'), x, 0.48, z));
    }
    // Çatı bacaları
    for (const s of [-3.6, 3.6]) {
      for (const t of [-2.6, 0, 2.6]) {
        g.add(koy(IZ.kutu(0.3, 0.6, 0.3, tas), t, 3.3, s));
        g.add(koy(IZ.piramit(0.42, 0.2, 0.42, cati), t, 3.9, s));
      }
      for (const t of [-1.3, 1.3]) {
        g.add(koy(IZ.kutu(0.3, 0.6, 0.3, tas), s, 3.3, t));
        g.add(koy(IZ.piramit(0.42, 0.2, 0.42, cati), s, 3.9, t));
      }
    }
    // Avlu revağı: ahşap direkler ve sundurma
    for (const s of [-1, 1]) {
      for (const t of [-1.8, -0.6, 0.6, 1.8]) {
        g.add(koy(IZ.silindir(0.06, 0.07, 1.3, 5, '#8a6a4a'), t, 0.08, s * 2.15));
        g.add(koy(IZ.silindir(0.06, 0.07, 1.3, 5, '#8a6a4a'), s * 2.15, 0.08, t));
      }
      const c1 = IZ.kutu(4.9, 0.06, 0.7, cati);
      c1.rotation.x = -s * 0.25;
      g.add(koy(c1, 0, 1.4, s * 2.2));
      const c2 = IZ.kutu(0.7, 0.06, 4.9, cati);
      c2.rotation.z = s * 0.25;
      g.add(koy(c2, s * 2.2, 1.4, 0));
    }
    // Avluya asılı halılar
    g.add(koy(IZ.kutu(0.7, 0.8, 0.05, '#b23a48'), -1.2, 1.75, -2.46));
    g.add(koy(IZ.kutu(0.7, 0.8, 0.05, '#2f6f8f'), 0.9, 1.75, -2.46));
    g.add(koy(IZ.kutu(0.7, 0.8, 0.05, '#c98a2b'), 1.3, 1.75, 2.46));
    g.add(koy(IZ.kutu(0.05, 0.8, 0.7, '#7a3b6b'), -2.46, 1.75, 0.8));
    g.add(koy(IZ.kutu(0.05, 0.8, 0.7, '#3d8b7d'), 2.46, 1.75, -0.9));
    // Giriş kemeri ve fenerler
    kemer(g, 0, 1.9, -4.9, 0.5, 0.07, '#c9a676');
    for (const x of [-0.95, 0.95]) g.add(koy(IZ.kutu(0.14, 0.22, 0.14, '#fff3c4', { isik: '#ffdf8a', guc: 1.6 }), x, 2.0, -4.92));
    return g;
  }

  // ---------- Smyrna Agorası ----------
  function agora() {
    const g = new THREE.Group();
    const mermer = '#ece5d3', tas = '#cdbf9f';
    g.add(IZ.kutu(11.5, 0.15, 8, tas));
    g.add(koy(IZ.kutu(7, 0.05, 2, '#9cbb78'), 1.5, 0.15, 1.3));
    function sutun(x, z, h, baslik) {
      g.add(koy(IZ.kutu(0.6, 0.15, 0.6, mermer), x, 0.15, z));
      g.add(koy(IZ.silindir(0.2, 0.24, h, 6, mermer), x, 0.3, z));
      if (baslik) g.add(koy(IZ.kutu(0.6, 0.16, 0.6, mermer), x, 0.3 + h, z));
    }
    for (let i = 0; i < 7; i++) sutun(-4.2 + i * 1.4, -2.9, 2.6, true);
    g.add(koy(IZ.kutu(6.3, 0.32, 0.62, mermer), -1.4, 3.06, -2.9));
    g.add(koy(IZ.kutu(6.5, 0.14, 0.75, '#d9cfb8'), -1.4, 3.38, -2.9));
    [2.6, 1.2, 0.6, 2.6, 0.9, 1.8, 0.5].forEach((h, i) => sutun(-4.2 + i * 1.4, -0.6, h, h > 2));
    // Kemerli bazilika kalıntısı
    for (let i = 0; i < 5; i++) g.add(koy(IZ.kutu(0.7, 1.5, 1.0, '#c4b594'), -4.4 + i * 1.5, 0.15, 2.9));
    g.add(koy(IZ.kutu(6.7, 0.5, 1.0, '#c4b594'), -1.4, 1.65, 2.9));
    g.add(koy(IZ.kutu(3.2, 0.4, 1.0, '#b9aa88'), -3.1, 2.15, 2.9));
    // Dağınık taşlar
    [[3.6, 2.6, 0.3], [4.4, 1.2, 1.1], [2.8, 3.3, 0.7], [4.8, -1.6, 0.2], [3.3, 0.6, 1.4]].forEach(([x, z, r]) => {
      g.add(koy(IZ.kutu(0.7, 0.35, 0.45, mermer), x, 0.15, z, r));
    });
    // Sütun dizisinin basamağı
    g.add(koy(golgesiz(IZ.kutu(9.6, 0.07, 1.0, '#ddd3bb')), 0, 0.15, -2.9));
    // Bazilika ayakları arasında kemerler
    for (let i = 0; i < 4; i++) for (const z of [2.55, 3.25]) kemer(g, -3.65 + i * 1.5, 1.2, z, 0.44, 0.1, '#b9aa88');
    // Kazı çukuru ve bodrum kemerleri
    g.add(koy(golgesiz(IZ.kutu(3.6, 0.04, 1.7, '#a8946c')), 3.7, 0.15, -1.7));
    g.add(koy(IZ.kutu(3.6, 0.8, 0.25, '#c4b594'), 3.7, 0.15, -2.6));
    for (let i = 0; i < 3; i++) {
      g.add(koy(alinlik(0.38, '#6f6450'), 2.6 + i * 1.1, 0.4, -2.5));
      kemer(g, 2.6 + i * 1.1, 0.4, -2.4, 0.42, 0.06, mermer);
    }
    // Devrilmiş sütun tamburları ve başlık
    [[2.6, 1.3, 0.3], [0.2, 2.0, -0.5], [-2.2, 1.2, 1.2]].forEach(([x, z, ry]) => {
      const t = IZ.silindir(0.22, 0.22, 1.1, 6, mermer);
      t.rotation.z = Math.PI / 2;
      const k = new THREE.Group();
      k.add(koy(t, 0.55, 0.22, 0));
      g.add(koy(k, x, 0.15, z, ry));
    });
    g.add(koy(IZ.kutu(0.6, 0.3, 0.6, mermer), 1.2, 0.15, 3.3, 0.4));
    g.add(koy(IZ.kutu(0.4, 0.14, 0.4, '#d9cfb8'), 1.2, 0.45, 3.3, 0.4));
    // Bilgi panosu ve selviler
    g.add(koy(IZ.silindir(0.04, 0.04, 0.8, 4, '#6d747a'), 4.9, 0.15, 3.5));
    g.add(koy(IZ.kutu(0.9, 0.5, 0.06, '#36546d'), 4.9, 0.8, 3.5, -0.4));
    selvi(g, 5.3, 0.15, 0.2, 1.0);
    selvi(g, -5.3, 0.15, 1.0, 1.1);
    selvi(g, -5.2, 0.15, -1.6, 0.9);
    return g;
  }

  // ---------- Kadifekale ----------
  function kadifekale() {
    const g = new THREE.Group();
    const tas = '#bfae8c', koyu = '#a89672';
    const R = 6.2;
    for (let i = 0; i < 8; i++) {
      const a = (i + 0.5) * (Math.PI / 4);
      const r = R * Math.cos(Math.PI / 8);
      const h = [2.1, 2.1, 1.2, 2.1, 2.1, 0.7, 1.6, 2.1][i];
      const d = IZ.kutu(2 * R * Math.sin(Math.PI / 8), h, 0.7, tas);
      g.add(koy(d, Math.cos(a) * r, 0, Math.sin(a) * r, Math.PI / 2 - a));
    }
    for (let i = 0; i < 8; i++) {
      if (i === 6) continue;
      const a = i * (Math.PI / 4);
      const x = Math.cos(a) * R, z = Math.sin(a) * R;
      const buyuk = i % 2 === 0;
      g.add(koy(IZ.silindir(buyuk ? 1.0 : 0.75, buyuk ? 1.15 : 0.85, buyuk ? 3.3 : 2.6, 8, koyu), x, 0, z));
      g.add(koy(IZ.silindir(buyuk ? 1.2 : 0.9, buyuk ? 1.05 : 0.8, 0.45, 8, tas), x, buyuk ? 3.3 : 2.6, z));
    }
    // Bayrak ve çamlar
    g.add(koy(IZ.silindir(0.05, 0.05, 3.2, 4, '#666666'), R, 3.75, 0));
    g.add(koy(IZ.kutu(1.3, 0.8, 0.05, '#d62828'), R + 0.7, 6.1, 0));
    [[-2, -1.5, 1], [1.5, 2, 1.3], [0.5, -2.8, 0.9], [-3, 2.2, 1.1], [2.8, -0.5, 1]].forEach(([x, z, s]) => {
      g.add(koy(IZ.silindir(0.1, 0.12, 0.6 * s, 5, '#7a5a3c'), x, 0, z));
      g.add(koy(IZ.koni(0.75 * s, 2.0 * s, 6, '#4f8a4b'), x, 0.5 * s, z));
    });
    // Sur ve burç mazgalları
    for (let i = 0; i < 8; i++) {
      const hh = [2.1, 2.1, 1.2, 2.1, 2.1, 0.7, 1.6, 2.1][i];
      if (hh >= 1.6) {
        const a = (i + 0.5) * (Math.PI / 4), r = R * Math.cos(Math.PI / 8);
        const s = new THREE.Group();
        for (const t of [-1.5, -0.5, 0.5, 1.5]) s.add(koy(IZ.kutu(0.5, 0.38, 0.74, koyu), t, hh, 0));
        g.add(koy(s, Math.cos(a) * r, 0, Math.sin(a) * r, Math.PI / 2 - a));
      }
      if (i === 6) continue;
      const buyuk = i % 2 === 0, a = i * (Math.PI / 4);
      const ty = (buyuk ? 3.3 : 2.6) + 0.45, tr = (buyuk ? 1.2 : 0.9) - 0.16;
      for (let k = 0; k < 6; k++) {
        const b = (k * Math.PI) / 3;
        g.add(koy(IZ.kutu(0.3, 0.34, 0.3, koyu), Math.cos(a) * R + Math.cos(b) * tr, ty, Math.sin(a) * R + Math.sin(b) * tr, -b));
      }
      g.add(koy(IZ.kutu(0.1, 0.5, 0.1, '#5a4c36'), Math.cos(a) * (R + (buyuk ? 1.1 : 0.82)), 1.3, Math.sin(a) * (R + (buyuk ? 1.1 : 0.82)), -a));
    }
    // Kapı kemeri
    for (const x of [-0.95, 0.95]) g.add(koy(IZ.kutu(0.6, 2.3, 0.9, koyu), x, 0, -6.1));
    g.add(koy(IZ.kutu(2.5, 0.5, 0.9, tas), 0, 2.3, -6.1));
    kemer(g, 0, 1.75, -6.56, 0.62, 0.09, '#d6c8a6');
    for (const t of [-0.9, 0, 0.9]) g.add(koy(IZ.kutu(0.5, 0.34, 0.92, koyu), t, 2.8, -6.1));
    // İç avlu: patika, sarnıç kalıntısı, seyir terası
    g.add(koy(golgesiz(IZ.kutu(0.9, 0.03, 5.4, '#d9cdaa')), 0, 0, -3.2));
    g.add(koy(IZ.kutu(2.8, 0.25, 1.8, '#a89672'), -1.0, 0, 0.4));
    for (const x of [-2.0, -1.0, 0.0]) for (const z of [-0.2, 1.0]) g.add(koy(IZ.kutu(0.35, 0.7, 0.35, tas), x, 0.25, z));
    g.add(koy(IZ.kutu(1.2, 0.25, 0.35, '#8a6a4a'), 3.4, 0, -3.2, 0.6));
    g.add(koy(IZ.silindir(0.04, 0.04, 0.9, 4, '#4a4f55'), 4.3, 0, -2.2));
    g.add(koy(IZ.kutu(0.4, 0.14, 0.14, '#4a4f55'), 4.3, 0.9, -2.2, 0.7));
    return g;
  }

  // ---------- Pasaport İskelesi ----------
  function pasaport() {
    const g = new THREE.Group();
    const duvar = '#f1e6cc', cati = '#b9553a', cini = '#2f7f9f';
    g.add(koy(IZ.kutu(7, 0.5, 5.6, '#b9b0a0'), 0, -0.5, 0));
    g.add(koy(IZ.kutu(5, 0.3, 1.8, '#a79d8b'), -5.5, -0.45, 0));
    for (const x of [-7.5, -5.5, -3.8]) for (const z of [-0.7, 0.7]) g.add(koy(IZ.silindir(0.15, 0.15, 1.3, 5, '#7c7468'), x, -1.6, z));
    // İki kanat ve geniş saçaklı çatılar
    for (const z of [-1.75, 1.75]) {
      g.add(koy(IZ.kutu(4.6, 1.7, 1.9, duvar), 0, 0, z));
      g.add(koy(IZ.kutu(4.66, 0.3, 1.96, cini), 0, 1.25, z));
      for (const x of [-1.4, 0, 1.4]) g.add(koy(IZ.kutu(0.6, 0.8, 1.98, '#33485a', { isik: '#ffd27a' }), x, 0.35, z));
      g.add(koy(IZ.piramit(5.6, 0.9, 2.7, cati), 0, 1.7, z));
    }
    // Orta giriş kulesi
    g.add(koy(IZ.kutu(2.6, 2.9, 2.2, duvar), 0, 0, 0));
    g.add(koy(IZ.kutu(2.66, 0.35, 2.26, cini), 0, 2.3, 0));
    g.add(koy(IZ.kutu(0.1, 1.7, 1.1, '#3a2a1e'), 1.32, 0, 0));
    g.add(koy(IZ.kutu(0.1, 1.7, 1.1, '#3a2a1e'), -1.32, 0, 0));
    g.add(koy(IZ.piramit(3.6, 1.2, 3.2, cati), 0, 2.9, 0));
    g.add(koy(IZ.silindir(0.04, 0.04, 1.6, 4, '#666666'), 0, 4.1, 0));
    g.add(koy(IZ.kutu(0.9, 0.55, 0.04, '#d62828'), 0.47, 5.1, 0));
    // Yanaşmış küçük vapur
    const v = new THREE.Group();
    v.add(IZ.kutu(4.2, 0.7, 1.5, '#f4f4f0'));
    v.add(koy(IZ.kutu(4.25, 0.2, 1.55, '#1f5f8b'), 0, 0, 0));
    v.add(koy(IZ.kutu(2.6, 0.7, 1.2, '#ffffff'), -0.2, 0.7, 0));
    v.add(koy(IZ.kutu(2.62, 0.3, 1.22, '#35526b', { isik: '#ffd27a' }), -0.2, 0.95, 0));
    v.add(koy(IZ.silindir(0.2, 0.24, 0.8, 6, '#e8a23a'), 0.2, 1.4, 0));
    v.add(koy(IZ.silindir(0.03, 0.03, 1.1, 4, '#666666'), -1.6, 0.7, 0));
    v.add(koy(IZ.kutu(0.5, 0.3, 0.03, '#d62828'), -1.33, 1.5, 0));
    for (const x of [-1.0, 0.6]) {
      const sim = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 4, 8), IZ.mat('#e85d4a'));
      v.add(koy(sim, x, 0.45, 0.77));
    }
    g.add(koy(v, -5.5, -0.75, -2.0));
    // Kemerli pencere alınlıkları ve çini madalyonlar
    for (const s of [-1, 1]) {
      for (const x of [-1.4, 0, 1.4]) g.add(koy(alinlik(0.3, '#33485a', { isik: '#ffd27a' }), x, 1.15, s * 2.73 - 0.04));
      const mad = IZ.silindir(0.32, 0.32, 0.06, 8, cini);
      mad.rotation.z = Math.PI / 2;
      g.add(koy(mad, s * 1.33 + 0.03, 2.0, 0));
    }
    // Giriş saçağı, banklar, lambalar
    g.add(koy(IZ.kutu(1.0, 0.08, 1.7, cati), 1.8, 1.85, 0));
    for (const z of [-0.75, 0.75]) g.add(koy(IZ.silindir(0.04, 0.04, 1.85, 4, '#6d747a'), 2.2, 0, z));
    for (const z of [-2.0, 2.0]) {
      g.add(koy(IZ.kutu(0.3, 0.26, 0.9, '#8a6a4a'), 3.05, 0, z));
      lamba(g, 3.25, 0, z * 1.28, 1.4);
      lamba(g, -3.25, 0, z * 1.28, 1.4);
    }
    // İskele: babalar, korkuluk, vapura iskele tahtası
    for (const x of [-7.7, -6.2, -4.6]) g.add(koy(IZ.silindir(0.1, 0.13, 0.3, 6, '#3a3a3a'), x, -0.15, -0.72));
    g.add(koy(IZ.kutu(4.6, 0.05, 0.05, '#666666'), -5.6, 0.35, 0.85));
    for (let x = -7.8; x <= -3.4; x += 1.1) g.add(koy(IZ.silindir(0.025, 0.025, 0.5, 4, '#666666'), x, -0.15, 0.85));
    g.add(koy(IZ.kutu(0.5, 0.06, 0.9, '#8a6a4a'), -5.2, -0.12, -1.25));
    return g;
  }

  // ---------- Aziz Polikarp Kilisesi ----------
  function polikarp() {
    const g = new THREE.Group();
    const duvar = '#ecdcbb', cati = '#b24a33', altin = '#d9b23c';
    g.add(koy(IZ.kutu(5.6, 2.0, 6.6, duvar), 0, 0, 0.6));
    g.add(koy(IZ.kutu(5.9, 0.2, 6.9, cati), 0, 2.0, 0.6));
    g.add(koy(IZ.kutu(3.4, 3.4, 7.4, duvar), 0, 0, 0.6));
    g.add(koy(IZ.besikCati(3.9, 1.4, 7.8, cati), 0, 3.4, 0.6));
    for (const x of [-2.82, 2.82]) for (let z = -1.6; z <= 2.9; z += 1.5) g.add(koy(IZ.kutu(0.08, 1.0, 0.5, '#3d5a73', { isik: '#ffd27a' }), x, 0.6, z));
    // Apsis
    g.add(koy(IZ.silindir(1.5, 1.5, 2.6, 8, duvar), 0, 0, 4.3));
    g.add(koy(IZ.koni(1.6, 0.9, 8, cati), 0, 2.6, 4.3));
    // Çan kulesi
    g.add(koy(IZ.kutu(1.9, 5.2, 1.9, duvar), 0, 0, -3.6));
    g.add(koy(IZ.kutu(2.1, 0.2, 2.1, '#c9a676'), 0, 5.2, -3.6));
    g.add(koy(IZ.kutu(1.5, 1.3, 1.5, '#5a4636'), 0, 5.4, -3.6));
    for (const x of [-0.75, 0.75]) for (const z of [-0.75, 0.75]) g.add(koy(IZ.kutu(0.3, 1.3, 0.3, duvar), x, 5.4, -3.6 + z));
    g.add(koy(IZ.piramit(2.2, 1.6, 2.2, cati), 0, 6.7, -3.6));
    g.add(koy(IZ.kutu(0.1, 0.9, 0.1, altin), 0, 8.2, -3.6));
    g.add(koy(IZ.kutu(0.5, 0.1, 0.1, altin), 0, 8.75, -3.6));
    g.add(koy(IZ.kutu(0.9, 1.6, 0.1, '#4a3324'), 0, 0, -4.57));
    g.add(koy(IZ.silindir(0.45, 0.45, 0.08, 10, '#3d5a73', { isik: '#ffd27a' }), 0, 3.3, -4.57).rotateX(Math.PI / 2));
    // Payandalar, kemerli pencereler ve üst pencereler
    for (const s of [-1, 1]) {
      for (const z of [-2.35, -0.85, 0.65, 2.15, 3.65]) {
        g.add(koy(IZ.kutu(0.32, 1.7, 0.32, '#dccaa6'), s * 2.9, 0, z));
        g.add(koy(IZ.piramit(0.36, 0.3, 0.36, cati), s * 2.9, 1.7, z));
      }
      for (let z = -1.6; z <= 2.9; z += 1.5) {
        const a = alinlik(0.25, '#3d5a73', { isik: '#ffd27a' });
        a.rotation.set(0, 0, Math.PI / 2);
        g.add(koy(a, s * 2.82 + 0.04, 1.6, z));
        g.add(koy(IZ.kutu(0.06, 0.6, 0.4, '#3d5a73', { isik: '#ffd27a' }), s * 1.72, 2.55, z));
      }
    }
    // Çan kulesi: çan boşlukları, saçak ve çan
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Group();
      p.add(koy(IZ.kutu(0.5, 0.8, 0.06, '#2b2018'), 0, 5.55, 0.76));
      p.add(koy(alinlik(0.25, '#2b2018'), 0, 6.35, 0.72));
      p.add(koy(IZ.kutu(0.4, 0.9, 0.06, '#3d5a73', { isik: '#ffd27a' }), 0, 2.6, 0.95));
      p.rotation.y = (i * Math.PI) / 2;
      p.position.set(0, 0, -3.6);
      g.add(p);
    }
    g.add(koy(IZ.kure(0.16, altin), 0, 8.15, -3.6));
    // Giriş: basamak, kemer ve niş
    g.add(koy(IZ.kutu(1.8, 0.12, 0.5, '#d6cfc0'), 0, 0, -4.8));
    kemer(g, 0, 1.6, -4.6, 0.5, 0.08, '#c9a676');
    g.add(koy(IZ.kutu(0.5, 0.75, 0.06, '#f7f0e1'), 0, 2.15, -4.58));
    g.add(koy(IZ.kutu(0.16, 0.5, 0.08, '#c9a676'), 0, 2.2, -4.62));
    // Apsis pencereleri, bahçe
    for (const a of [-0.8, 0, 0.8]) g.add(koy(IZ.kutu(0.3, 0.9, 0.06, '#3d5a73', { isik: '#ffd27a' }), Math.sin(a) * 1.42, 0.9, 4.3 + Math.cos(a) * 1.42, a));
    selvi(g, -2.4, 0, -3.9, 1.0);
    selvi(g, 2.4, 0, -3.9, 1.1);
    selvi(g, 2.5, 0, 5.0, 0.9);
    return g;
  }

  // İki nokta arasında uzanan, uçları farklı kalınlıkta olabilen uzuv (bacak, kol, boyun...)
  const YUKARI = new THREE.Vector3(0, 1, 0);
  function uzuv(p1, p2, r1, r2, renk, o) {
    const a = new THREE.Vector3(p1[0], p1[1], p1[2]), b = new THREE.Vector3(p2[0], p2[1], p2[2]);
    const yon = b.clone().sub(a);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r2, r1, yon.length(), 6), IZ.mat(renk, o));
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(YUKARI, yon.normalize());
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }

  // Ayrıntı parçaları
  function lamba(g, x, y, z, h) {
    g.add(koy(IZ.silindir(0.035, 0.05, h, 4, '#4a4f55'), x, y, z));
    g.add(koy(IZ.kure(0.14, '#fff3c4', { isik: '#ffdf8a', guc: 1.6 }), x, y + h + 0.1, z));
  }
  function guvercin(g, x, y, z, ry) {
    const k = new THREE.Group();
    const govde = IZ.kure(0.1, '#8f979e');
    govde.scale.set(1.5, 0.9, 0.9);
    k.add(koy(govde, 0, 0.1, 0));
    k.add(koy(IZ.kure(0.055, '#6f7880'), 0.14, 0.2, 0));
    g.add(koy(k, x, y, z, ry));
  }
  function selvi(g, x, y, z, s) {
    g.add(koy(IZ.silindir(0.06 * s, 0.08 * s, 0.4 * s, 5, '#7a5a40'), x, y, z));
    g.add(koy(IZ.koni(0.36 * s, 2.9 * s, 6, '#3b6e45'), x, y + 0.3 * s, z));
  }
  function semsiye(g, x, y, z, renk) {
    g.add(koy(IZ.silindir(0.03, 0.03, 0.9, 4, '#666666'), x, y, z));
    g.add(koy(IZ.koni(0.55, 0.28, 6, renk), x, y + 0.85, z));
    g.add(koy(IZ.silindir(0.22, 0.22, 0.04, 6, '#f4f0e6'), x, y + 0.42, z));
  }
  function kisi(g, x, y, z, renk) {
    g.add(koy(IZ.silindir(0.1, 0.12, 0.36, 5, renk), x, y, z));
    g.add(koy(IZ.kure(0.11, '#e8c4a0'), x, y + 0.48, z));
  }
  function palmiye(g, x, y, z, s) {
    g.add(koy(IZ.silindir(0.07 * s, 0.11 * s, 1.9 * s, 5, '#8a6a4a'), x, y, z));
    for (let i = 0; i < 5; i++) {
      const p = new THREE.Group();
      const yaprak = IZ.kutu(0.9 * s, 0.04, 0.24 * s, i % 2 ? '#4f9450' : '#5fa052');
      yaprak.rotation.z = -0.4;
      p.add(koy(yaprak, 0.4 * s, 0, 0));
      g.add(koy(p, x, y + 1.85 * s, z, (i * Math.PI * 2) / 5));
    }
  }
  function cicekTarhi(g, x, y, z, w, d, renkler) {
    g.add(koy(IZ.kutu(w, 0.12, d, '#6fb15c'), x, y, z));
    const n = Math.max(2, Math.round(Math.max(w, d) / 0.35));
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n - 0.5;
      g.add(koy(IZ.kure(0.09, renkler[i % renkler.length]), x + (w >= d ? t * w : 0), y + 0.17, z + (w >= d ? 0 : t * d)));
    }
  }
  function bank(g, x, y, z, ry) {
    g.add(koy(IZ.kutu(0.9, 0.22, 0.26, '#8a6a4a'), x, y, z, ry));
  }
  // Dik duran yarım daire kemer (açıklığı x ekseni boyunca)
  function kemer(g, x, y, z, r, kalin, renk, ry) {
    g.add(koy(yarimHalka(r, kalin, renk), x, y, z, ry));
  }
  // Duvara yaslı yuvarlak kemer alınlığı (yüzü +z'ye bakar)
  function alinlik(r, renk, o) {
    const m = IZ.silindir(r, r, 0.08, 10, renk, o);
    m.rotation.x = Math.PI / 2;
    return m;
  }

  // ---------- Atatürk Anıtı ----------
  // Atın başı yerel -z yönüne (veride batıya, denize) bakar.
  function ataturkAniti() {
    const g = new THREE.Group();
    const tas = '#d3cbb9', govdeTas = '#cbc2ad', koyuTas = '#b9af98';
    const bo = { metal: 0.45, puruz: 0.55 };
    const b = '#6f5d3c', bKoyu = '#55462c';
    // Meydan döşemesi
    g.add(IZ.silindir(4.6, 4.8, 0.12, 16, '#e6dfcf'));
    g.add(koy(golgesiz(IZ.silindir(3.9, 3.9, 0.02, 16, '#d8cfba')), 0, 0.12, 0));
    g.add(koy(golgesiz(IZ.silindir(3.3, 3.3, 0.02, 16, '#e9e3d4')), 0, 0.13, 0));
    // Zincirli babalar
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + 0.22;
      g.add(koy(IZ.silindir(0.06, 0.08, 0.5, 5, '#4a4f55'), Math.cos(a) * 4.1, 0.12, Math.sin(a) * 4.1));
      g.add(koy(IZ.kure(0.08, '#4a4f55'), Math.cos(a) * 4.1, 0.66, Math.sin(a) * 4.1));
    }
    const zincir = new THREE.Mesh(new THREE.TorusGeometry(4.1, 0.02, 3, 28), IZ.mat('#4a4f55'));
    zincir.rotation.x = Math.PI / 2;
    g.add(koy(zincir, 0, 0.5, 0));
    // Çiçek tarhları
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      g.add(koy(IZ.kutu(0.9, 0.14, 0.9, '#7fbf63'), sx * 2.55, 0.12, sz * 2.55, Math.PI / 4));
      for (let k = 0; k < 4; k++) g.add(koy(IZ.kure(0.1, k % 2 ? '#ffffff' : '#d2452f'), sx * 2.55 + (k % 2 ? 0.2 : -0.2), 0.32, sz * 2.55 + (k < 2 ? 0.2 : -0.2)));
    }
    // Basamaklı taban
    g.add(koy(IZ.kutu(3.9, 0.2, 5.0, tas), 0, 0.12, 0));
    g.add(koy(IZ.kutu(3.4, 0.2, 4.5, '#dcd4c2'), 0, 0.32, 0));
    g.add(koy(IZ.kutu(2.9, 0.2, 4.0, tas), 0, 0.52, 0));
    // Kaide: ayak, gövde, korniş
    g.add(koy(IZ.kutu(2.4, 0.5, 3.5, koyuTas), 0, 0.72, 0));
    g.add(koy(IZ.kutu(2.2, 0.12, 3.3, tas), 0, 1.22, 0));
    g.add(koy(IZ.kutu(1.8, 2.2, 2.9, govdeTas), 0, 1.34, 0));
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(koy(IZ.kutu(0.16, 2.2, 0.16, tas), sx * 0.86, 1.34, sz * 1.41));
    g.add(koy(IZ.kutu(2.0, 0.14, 3.1, tas), 0, 3.54, 0));
    g.add(koy(IZ.kutu(2.25, 0.14, 3.35, '#dcd4c2'), 0, 3.68, 0));
    g.add(koy(IZ.kutu(1.9, 0.12, 3.0, tas), 0, 3.82, 0));
    // Yan yüzlerde tunç yüksek kabartmalar
    for (const sx of [-1, 1]) {
      g.add(koy(IZ.kutu(0.06, 1.25, 2.3, bKoyu, bo), sx * 0.92, 1.5, 0));
      [-0.9, -0.45, 0, 0.45, 0.9].forEach((z, i) => {
        const h = 0.72 + (i % 2) * 0.12;
        g.add(koy(IZ.kutu(0.14, h, 0.24, b, bo), sx * 1.0, 1.5, z));
        g.add(koy(IZ.kure(0.1, b, bo), sx * 1.0, 1.62 + h, z));
        if (i % 2 === 0) g.add(uzuv([sx * 1.03, 1.55, z + 0.17], [sx * 1.03, 2.75, z + 0.3], 0.018, 0.018, b, bo));
      });
    }
    g.add(koy(IZ.kutu(1.3, 1.25, 0.06, bKoyu, bo), 0, 1.5, 1.47));
    [-0.4, 0, 0.4].forEach((x, i) => {
      g.add(koy(IZ.kutu(0.24, 0.75 + (i % 2) * 0.1, 0.14, b, bo), x, 1.5, 1.55));
      g.add(koy(IZ.kure(0.1, b, bo), x, 2.36 + (i % 2) * 0.1, 1.55));
    });
    // Ön yüzde yazıt
    g.add(koy(IZ.kutu(1.3, 1.1, 0.06, '#efe9da'), 0, 1.75, -1.47));
    [[2.55, 0.9], [2.35, 1.0], [2.15, 0.8], [1.95, 0.5]].forEach(([y, w]) => g.add(koy(golgesiz(IZ.kutu(w, 0.07, 0.03, '#6a5f4c')), 0, y, -1.51)));
    // Çelenkler
    for (const x of [-0.75, 0.75]) {
      const c = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.09, 5, 10), IZ.mat('#3f8a45'));
      c.rotation.x = 0.35;
      c.castShadow = true;
      g.add(koy(c, x, 1.05, -1.9));
      g.add(koy(IZ.kutu(0.3, 0.1, 0.04, '#e30a17'), x, 0.82, -2.02));
    }
    bayrak(g, -3.3, 3.0, 4.6);
    bayrak(g, 3.3, 3.0, 4.6);

    // ---- Tunç atlı heykel (orijin: toynak hizası) ----
    const h = new THREE.Group();
    const ekle = (m) => { h.add(m); return m; };
    // Gövde
    const govde = IZ.silindir(0.34, 0.36, 1.3, 8, b, bo);
    govde.rotation.x = Math.PI / 2;
    ekle(koy(govde, 0, 1.15, -0.65));
    const gogus = IZ.kure(0.38, b, bo);
    gogus.scale.set(0.95, 1.05, 1.0);
    ekle(koy(gogus, 0, 1.17, -0.62));
    const sagri = IZ.kure(0.4, b, bo);
    sagri.scale.set(0.98, 1.0, 1.05);
    ekle(koy(sagri, 0, 1.18, 0.62));
    // Bacaklar: sol ön bacak havada
    const bacak = (p, d, t) => {
      ekle(uzuv(p, d, 0.13, 0.075, b, bo));
      ekle(uzuv(d, t, 0.07, 0.055, b, bo));
      ekle(koy(IZ.silindir(0.07, 0.085, 0.09, 6, bKoyu, bo), t[0], t[1] - 0.08, t[2]));
    };
    bacak([0.2, 1.0, -0.66], [0.2, 0.52, -0.7], [0.2, 0.08, -0.66]);
    bacak([-0.2, 1.0, -0.68], [-0.2, 0.68, -1.02], [-0.2, 0.32, -0.86]);
    bacak([0.22, 1.02, 0.66], [0.22, 0.52, 0.86], [0.22, 0.08, 0.76]);
    bacak([-0.22, 1.02, 0.6], [-0.22, 0.52, 0.66], [-0.22, 0.08, 0.5]);
    // Boyun, baş, kulaklar, yele
    ekle(uzuv([0, 1.25, -0.72], [0, 2.0, -1.16], 0.31, 0.17, b, bo));
    ekle(uzuv([0, 2.08, -1.1], [0, 1.72, -1.56], 0.17, 0.1, b, bo));
    ekle(koy(IZ.kure(0.105, b, bo), 0, 1.71, -1.57));
    for (const x of [-0.08, 0.08]) ekle(koy(IZ.koni(0.045, 0.16, 4, b, bo), x, 2.12, -1.06));
    const yele = uzuv([0, 1.42, -0.5], [0, 2.14, -0.98], 0.11, 0.07, bKoyu, bo);
    yele.scale.x = 0.45;
    ekle(yele);
    // Kuyruk
    ekle(uzuv([0, 1.34, 0.96], [0, 1.1, 1.26], 0.085, 0.075, bKoyu, bo));
    ekle(uzuv([0, 1.1, 1.26], [0, 0.48, 1.3], 0.075, 0.03, bKoyu, bo));
    // Eyer örtüsü ve dizginler
    ekle(koy(IZ.kutu(0.76, 0.06, 0.62, bKoyu, bo), 0, 1.5, 0.02));
    for (const x of [-0.36, 0.36]) ekle(koy(IZ.kutu(0.04, 0.3, 0.56, bKoyu, bo), x, 1.24, 0.02));
    for (const x of [-0.07, 0.07]) ekle(uzuv([x * 2, 1.8, -0.42], [x, 1.76, -1.5], 0.014, 0.014, bKoyu, bo));
    // Binici: bacaklar ve çizmeler
    for (const s of [-1, 1]) {
      ekle(uzuv([s * 0.15, 1.62, 0.06], [s * 0.4, 1.22, -0.2], 0.12, 0.09, b, bo));
      ekle(uzuv([s * 0.4, 1.22, -0.2], [s * 0.43, 0.74, -0.12], 0.085, 0.07, bKoyu, bo));
      ekle(koy(IZ.kutu(0.1, 0.08, 0.26, bKoyu, bo), s * 0.43, 0.66, -0.18));
    }
    // Gövde, omuzlar, baş ve kalpak
    const beden = uzuv([0, 1.55, 0.08], [0, 2.28, 0.02], 0.2, 0.25, b, bo);
    beden.scale.z = 0.72;
    ekle(beden);
    ekle(koy(IZ.kutu(0.66, 0.14, 0.28, b, bo), 0, 2.2, 0.02));
    ekle(koy(IZ.kutu(0.36, 0.05, 0.3, bKoyu, bo), 0, 1.78, 0.04));
    ekle(koy(IZ.silindir(0.07, 0.08, 0.1, 6, b, bo), 0, 2.34, 0.01));
    ekle(koy(IZ.kure(0.15, b, bo), 0, 2.56, 0.0));
    ekle(koy(IZ.silindir(0.15, 0.165, 0.2, 8, bKoyu, bo), 0, 2.6, 0.01));
    // Sağ kol ileriyi (denizi) gösterir, sol kol dizginlerde
    ekle(uzuv([0.33, 2.26, 0.0], [0.42, 2.14, -0.42], 0.08, 0.065, b, bo));
    ekle(uzuv([0.42, 2.14, -0.42], [0.46, 2.1, -0.86], 0.065, 0.05, b, bo));
    ekle(koy(IZ.kure(0.06, b, bo), 0.46, 2.1, -0.9));
    ekle(uzuv([-0.33, 2.26, 0.0], [-0.36, 1.9, -0.06], 0.08, 0.065, b, bo));
    ekle(uzuv([-0.36, 1.9, -0.06], [-0.14, 1.8, -0.42], 0.065, 0.05, b, bo));
    // Kılıç
    ekle(uzuv([-0.3, 1.62, 0.12], [-0.46, 0.95, 0.5], 0.03, 0.02, bKoyu, bo));
    // At ve binici haritada seçilebilsin diye kaideye göre büyütülür
    h.position.y = 3.94;
    h.scale.setScalar(1.45);
    g.add(h);
    return g;
  }

  // ---------- Kültürpark Paraşüt Kulesi ----------
  function kulturpark() {
    const g = new THREE.Group();
    const beyaz = '#f3f0e7', kirmizi = '#d2452f';
    g.add(IZ.silindir(1.9, 2.1, 1.2, 8, beyaz));
    g.add(koy(IZ.silindir(1.95, 1.95, 0.35, 8, '#35526b', { isik: '#ffd27a' }), 0, 0.5, 0));
    g.add(koy(IZ.silindir(2.2, 2.0, 0.2, 8, kirmizi), 0, 1.2, 0));
    g.add(koy(IZ.silindir(0.5, 0.8, 8.4, 8, beyaz), 0, 1.4, 0));
    for (const y of [3.5, 5.6, 7.7]) g.add(koy(IZ.silindir(0.72 - (y - 3.5) * 0.04, 0.72 - (y - 3.5) * 0.04, 0.18, 8, kirmizi), 0, y, 0));
    g.add(koy(IZ.silindir(1.6, 1.0, 0.4, 8, beyaz), 0, 9.8, 0));
    g.add(koy(IZ.silindir(1.65, 1.65, 0.3, 8, kirmizi), 0, 10.2, 0));
    g.add(koy(IZ.silindir(0.35, 0.45, 1.6, 8, beyaz), 0, 10.2, 0));
    for (let i = 0; i < 3; i++) {
      const kol = new THREE.Group();
      kol.add(koy(IZ.kutu(3.0, 0.14, 0.14, '#8a8f95'), 1.5, 11.6, 0));
      kol.add(koy(IZ.silindir(0.02, 0.02, 1.0, 3, '#555555'), 2.9, 10.6, 0));
      kol.rotation.y = (i * Math.PI * 2) / 3;
      g.add(kol);
    }
    g.add(koy(IZ.koni(0.4, 0.8, 8, kirmizi), 0, 11.8, 0));
    // Süs havuzu
    g.add(koy(IZ.silindir(2.6, 2.6, 0.2, 10, '#d9d2c3'), 5, 0, 2.5));
    g.add(koy(IZ.silindir(2.3, 2.3, 0.22, 10, '#5db4dd'), 5, 0, 2.5));
    g.add(koy(IZ.koni(0.25, 1.0, 5, '#cfeaf7'), 5, 0.2, 2.5));
    for (let i = 0; i < 6; i++) g.add(koy(IZ.koni(0.1, 0.5, 4, '#cfeaf7'), 5 + Math.cos(i * 1.05) * 1.4, 0.2, 2.5 + Math.sin(i * 1.05) * 1.4));
    // Kule pencereleri, giriş, seyir katı korkuluğu
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Group();
      [2.6, 4.5, 6.6, 8.7].forEach((yy) => p.add(koy(IZ.kutu(0.16, 0.42, 0.05, '#35526b', { isik: '#ffd27a' }), 0, yy, 0.8 - (yy - 1.4) * 0.036 - 0.05)));
      p.rotation.y = (i * Math.PI) / 2 + Math.PI / 8;
      g.add(p);
    }
    g.add(koy(IZ.kutu(0.8, 0.9, 0.1, '#4a3324'), 0, 0, 1.93, 0));
    g.add(koy(IZ.kutu(1.2, 0.08, 0.6, kirmizi), 0, 1.0, 2.2));
    sutunHalkasi(g, 12, 1.58, 10.5, 0.3, 0.025, '#8a8f95');
    const kork = new THREE.Mesh(new THREE.TorusGeometry(1.58, 0.025, 3, 14), IZ.mat('#8a8f95'));
    kork.rotation.x = Math.PI / 2;
    g.add(koy(kork, 0, 10.8, 0));
    g.add(koy(IZ.silindir(0.02, 0.02, 0.9, 3, '#555555'), 0, 12.6, 0));
    g.add(koy(IZ.kutu(0.6, 0.38, 0.03, '#e30a17'), 0.31, 13.1, 0));
    // Paraşütle atlayan kişi: kulenin kolundan süzülerek iner
    const para = new THREE.Group();
    const kubbe = IZ.kure(0.75, '#f4f4ef', null, true);
    kubbe.scale.y = 0.7;
    para.add(koy(kubbe, 0, 1.0, 0));
    para.add(koy(IZ.silindir(0.76, 0.76, 0.06, 8, kirmizi), 0, 0.97, 0));
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + 0.4;
      para.add(uzuv([Math.cos(a) * 0.7, 1.0, Math.sin(a) * 0.7], [0, 0.32, 0], 0.01, 0.01, '#555555'));
    }
    para.add(koy(IZ.kutu(0.16, 0.3, 0.1, '#2f7fd1'), 0, 0.02, 0));
    para.add(koy(IZ.kure(0.07, '#f1cfa8'), 0, 0.39, 0));
    for (const dx of [-0.045, 0.045]) para.add(koy(IZ.kutu(0.06, 0.24, 0.07, '#3f4a56'), dx, -0.22, 0));
    para.userData.canli = true;
    g.add(para);
    g.userData.guncelle = (t) => {
      const u = (t * 0.11) % 1;
      const inis = Math.min(1, u / 0.8);
      para.position.set(2.9 + Math.sin(t * 1.3) * 0.12, 9.4 - inis * 8.8, Math.cos(t * 1.1) * 0.12);
      para.rotation.z = Math.sin(t * 1.3) * 0.08;
      para.scale.setScalar(u > 0.8 ? Math.max(0.001, 1 - (u - 0.8) / 0.08) : Math.min(1, u / 0.04 + 0.001));
    };
    g.userData.guncelle(3);
    return g;
  }

  // ---------- Cumhuriyet Ağacı Anıtı ----------
  function cumhuriyetAgaci() {
    const g = new THREE.Group();
    const celik = '#e3e9ed', altin = '#d9b23c';
    g.add(IZ.silindir(3.2, 3.4, 0.25, 10, '#e2dbcb'));
    g.add(koy(IZ.silindir(1.5, 1.8, 0.4, 10, '#cfc7b6'), 0, 0.25, 0));
    for (let i = 0; i < 5; i++) {
      const p = new THREE.Group();
      const dal = IZ.silindir(0.1, 0.24, 6.2, 5, celik, { puruz: 0.5 });
      dal.rotation.z = -0.13;
      p.add(koy(dal, 0.35, 0.6, 0));
      p.rotation.y = (i * Math.PI * 2) / 5;
      g.add(p);
    }
    for (let i = 0; i < 22; i++) {
      const a = i * 2.4;
      const rr = 0.5 + (i % 4) * 0.5;
      const y = 5.6 + (i % 6) * 0.42;
      const yaprak = IZ.kutu(1.0, 0.07, 0.5, i % 3 ? celik : altin, { puruz: 0.5 });
      yaprak.rotation.set(a * 0.7, a, 0.5);
      g.add(koy(yaprak, Math.cos(a) * rr, y, Math.sin(a) * rr));
    }
    // Daha sık yaprak ve dal budakları
    for (let i = 0; i < 18; i++) {
      const a = i * 1.9 + 0.6, rr = 0.9 + (i % 5) * 0.42, y = 5.2 + (i % 7) * 0.4;
      const yaprak = IZ.kutu(0.7, 0.05, 0.36, i % 4 ? celik : altin, { puruz: 0.5 });
      yaprak.rotation.set(a * 0.5, a, -0.4);
      g.add(koy(yaprak, Math.cos(a) * rr, y, Math.sin(a) * rr));
    }
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5 + 0.3;
      g.add(uzuv([Math.cos(a) * 0.5, 4.6, -Math.sin(a) * 0.5], [Math.cos(a) * 1.9, 6.3, -Math.sin(a) * 1.9], 0.07, 0.03, celik, { puruz: 0.5 }));
    }
    // Meydan döşemesi, yazıt taşları, projektörler
    g.add(koy(golgesiz(IZ.silindir(2.7, 2.7, 0.02, 10, '#d3cab6')), 0, 0.25, 0));
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5 + 0.63;
      g.add(koy(IZ.kutu(0.9, 0.5, 0.3, '#cfc7b6'), Math.sin(a) * 2.45, 0.25, Math.cos(a) * 2.45, a));
      g.add(koy(IZ.kutu(0.7, 0.3, 0.04, '#5a5f66'), Math.sin(a) * 2.62, 0.35, Math.cos(a) * 2.62, a));
      g.add(koy(IZ.kutu(0.18, 0.14, 0.18, '#fff3c4', { isik: '#ffdf8a', guc: 1.6 }), Math.sin(a + 0.63) * 1.95, 0.65, Math.cos(a + 0.63) * 1.95));
    }
    return g;
  }

  // ---------- Alsancak Garı ----------
  function alsancakGari() {
    const g = new THREE.Group();
    const duvar = '#ead9b4', cati = '#b24a33', cam = '#3d5a73';
    g.add(koy(IZ.kutu(9.4, 2.7, 3.6, duvar), 0.8, 0, 0));
    g.add(koy(IZ.kutu(9.46, 1.1, 3.66, cam, { isik: '#ffd27a' }), 0.8, 0.8, 0));
    for (let x = -3.9; x <= 5.5; x += 1.05) g.add(koy(IZ.kutu(0.4, 2.7, 3.74, duvar), x, 0, 0));
    g.add(koy(IZ.kutu(9.7, 0.22, 3.9, '#c9a676'), 0.8, 2.7, 0));
    const c = IZ.besikCati(4.1, 1.3, 9.8, cati);
    c.rotation.y = Math.PI / 2;
    g.add(koy(c, 0.8, 2.92, 0));
    // Saat kulesi
    g.add(koy(IZ.kutu(1.9, 5.6, 1.9, duvar), -4.9, 0, -0.9));
    g.add(koy(IZ.kutu(2.1, 0.2, 2.1, '#c9a676'), -4.9, 5.6, -0.9));
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Group();
      const k = IZ.silindir(0.6, 0.6, 0.08, 10, '#fffdf5', { isik: '#fff0c0' });
      k.rotation.x = Math.PI / 2;
      p.add(koy(k, 0, 4.6, 0.96));
      p.rotation.y = (i * Math.PI) / 2;
      p.position.set(-4.9, 0, -0.9);
      g.add(p);
    }
    g.add(koy(IZ.piramit(2.3, 1.5, 2.3, cati), -4.9, 5.8, -0.9));
    g.add(koy(IZ.kutu(1.0, 1.7, 0.1, '#4a3324'), 0.8, 0, -1.9));
    // Peron çatısı, raylar ve tren
    for (let x = -3; x <= 5; x += 2) for (const z of [2.6, 5.2]) g.add(koy(IZ.silindir(0.08, 0.08, 2.0, 5, '#6d747a'), x, 0, z));
    const s = IZ.besikCati(3.4, 0.7, 9.4, '#8f9ba3');
    s.rotation.y = Math.PI / 2;
    g.add(koy(s, 1, 2.0, 3.9));
    g.add(koy(IZ.kutu(12, 0.1, 0.9, '#6b6257'), 1, 0, 3.9));
    g.add(koy(IZ.kutu(2.6, 1.0, 0.8, '#d2452f'), -1.2, 0.2, 3.9));
    g.add(koy(IZ.kutu(2.6, 1.0, 0.8, '#f1ede2'), 1.6, 0.2, 3.9));
    g.add(koy(IZ.kutu(2.6, 1.0, 0.8, '#f1ede2'), 4.4, 0.2, 3.9));
    g.add(koy(IZ.kutu(7.8, 0.35, 0.84, cam, { isik: '#ffd27a' }), 1.6, 0.7, 3.9));
    // Lokomotif burnu, raylar, peron
    g.add(koy(IZ.kutu(0.06, 0.4, 0.6, '#2b3a4a'), -2.52, 0.65, 3.9));
    g.add(koy(IZ.kutu(0.06, 0.12, 0.3, '#fff6c8', { isik: '#fff2b0' }), -2.53, 0.3, 3.9));
    for (const dz of [-0.3, 0.3]) g.add(koy(golgesiz(IZ.kutu(12, 0.03, 0.06, '#b9c0c5')), 1, 0.1, 3.9 + dz));
    g.add(koy(IZ.kutu(9.6, 0.18, 0.9, '#cfc6ae'), 1, 0, 2.75));
    g.add(koy(IZ.kutu(9.6, 0.18, 0.7, '#cfc6ae'), 1, 0, 5.05));
    for (const x of [-1.5, 2.5]) g.add(koy(IZ.kutu(0.9, 0.22, 0.26, '#8a6a4a'), x, 0.18, 2.5));
    // Çatı bacaları, giriş saçağı, kemerli pencere alınlıkları
    for (const x of [-2.0, 0.8, 3.6]) {
      g.add(koy(IZ.kutu(0.36, 0.8, 0.36, '#b8674b'), x, 3.85, 0));
      g.add(koy(IZ.kutu(0.46, 0.1, 0.46, '#c9a676'), x, 4.65, 0));
    }
    for (let x = -3.38; x <= 5.0; x += 1.05) if (Math.abs(x - 0.8) > 0.6) g.add(koy(alinlik(0.3, cam, { isik: '#ffd27a' }), x, 1.9, -1.87, Math.PI));
    g.add(koy(IZ.kutu(2.6, 0.1, 1.1, '#8f9ba3'), 0.8, 2.0, -2.4));
    for (const x of [-0.3, 1.9]) g.add(koy(IZ.silindir(0.05, 0.05, 2.0, 5, '#6d747a'), x, 0, -2.85));
    g.add(koy(IZ.kutu(1.6, 0.12, 0.5, '#d6cfc0'), 0.8, 0, -2.1));
    // Saat kulesi: akrep-yelkovan, pencereler
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Group();
      p.add(koy(IZ.kutu(0.06, 0.42, 0.03, '#2c2c2c'), 0, 4.6, 1.05));
      const ak = IZ.kutu(0.06, 0.3, 0.03, '#2c2c2c');
      ak.rotation.z = -1.2;
      p.add(koy(ak, 0, 4.6, 1.05));
      p.add(koy(IZ.kutu(0.5, 0.9, 0.06, cam, { isik: '#ffd27a' }), 0, 1.0, 0.96));
      p.add(koy(IZ.kutu(0.5, 0.9, 0.06, cam, { isik: '#ffd27a' }), 0, 2.7, 0.96));
      p.rotation.y = (i * Math.PI) / 2;
      p.position.set(-4.9, 0, -0.9);
      g.add(p);
    }
    g.add(koy(IZ.silindir(0.03, 0.03, 0.9, 4, '#666666'), -4.9, 7.3, -0.9));
    lamba(g, -2.4, 0, -2.7, 1.5);
    lamba(g, 4.0, 0, -2.7, 1.5);
    agac(g, 5.8, -2.6, 0.9, '#6fb15c');
    return g;
  }

  // ---------- Folkart Towers ----------
  // İkiz kuleler: üst kısım düz cam prizma, alt üçte birlik bölüm beyaz balkon bantlarıyla dalgalanır.
  function folkart() {
    const g = new THREE.Group();
    const cam = '#4f86b8', beyaz = '#f4f7f9', koyu = '#34475c';
    const camSec = { isik: '#ffdf9a', guc: 1.1, puruz: 0.3 };
    g.add(IZ.kutu(13.0, 0.08, 8.6, '#d4d0c2'));
    // Podyum: beyaz bantlı otopark katları
    for (let i = 0; i < 3; i++) {
      g.add(koy(IZ.kutu(12.0 - i * 0.9, 0.42, 6.8 - i * 0.5, koyu, { isik: '#ffd27a', guc: 0.5 }), 0, i * 0.6, 0.4));
      g.add(koy(IZ.kutu(12.2 - i * 0.9, 0.2, 7.0 - i * 0.5, beyaz), 0, i * 0.6 + 0.4, 0.4));
    }
    const H = 20, n = 40, kh = H / n, w = 3.0, d = 2.3, dalga = 0.42;
    for (const [tx, tz] of [[-3.0, 0.9], [3.0, 0.0]]) {
      const kule = new THREE.Group();
      for (let i = 0; i < n; i++) {
        const t = i / n, y = i * kh;
        const ox = t < dalga ? Math.sin((t / dalga) * Math.PI * 2) * 0.42 : 0;
        kule.add(koy(IZ.kutu(w, kh, d, cam, { puruz: 0.3 }), ox, y, 0));
        // Gece rastgele yanan ofis pencereleri
        for (const s of [-1, 1]) for (let k = 0; k < 3; k++) {
          if ((i * 7 + k * 5 + (s > 0 ? 3 : 0) + (tx > 0 ? 1 : 0)) % 5 < 2) kule.add(koy(IZ.kutu(w / 3 - 0.12, kh - 0.2, 0.04, cam, camSec), ox + (k - 1) * (w / 3), y + 0.04, s * (d / 2 + 0.005)));
        }
        if (t < dalga) {
          kule.add(koy(IZ.kutu(w + 0.22, 0.12, d + 0.22, beyaz), ox, y + kh - 0.12, 0));
          kule.add(koy(IZ.kutu(0.16, kh, d + 0.16, beyaz), ox - w / 2, y, 0));
        } else if (i % 4 === 0) {
          kule.add(koy(IZ.kutu(w + 0.05, 0.05, d + 0.05, '#c9d9e6'), ox, y, 0));
        }
        kule.add(koy(IZ.kutu(0.22, kh, d + 0.2, beyaz), ox + w / 2, y, 0));
      }
      // Taç: yükselen beyaz kanat, açık çerçeve ve ışıklı yazı
      kule.add(koy(IZ.kutu(0.22, 1.9, d + 0.2, beyaz), w / 2, H, 0));
      kule.add(koy(IZ.kutu(0.14, 1.25, d + 0.1, beyaz), -w / 2, H, 0));
      const ust = IZ.kutu(w + 0.3, 0.12, d + 0.2, beyaz);
      ust.rotation.z = 0.2;
      kule.add(koy(ust, 0, H + 1.5, 0));
      for (const x of [-0.75, 0, 0.75]) kule.add(koy(IZ.kutu(0.06, 1.35 + (x + 0.75) * 0.2, d, beyaz), x, H, 0));
      for (const s of [-1, 1]) {
        kule.add(koy(IZ.kutu(w - 0.3, 1.0, 0.08, koyu), 0, H + 0.1, s * (d / 2 - 0.05)));
        kule.add(koy(IZ.kutu(w * 0.8, 0.3, 0.06, beyaz, { isik: '#ffffff', guc: 1.2 }), 0, H - 0.6, s * (d / 2 + 0.03)));
      }
      kule.add(koy(IZ.kure(0.1, '#ff5a4a', { isik: '#ff3020', guc: 2 }), w / 2, H + 2.0, 0));
      // Kule eteğinden podyuma süzülen beyaz kanat
      const kanat = IZ.kutu(0.3, 0.14, 3.4, beyaz);
      kanat.rotation.x = -0.5;
      kule.add(koy(kanat, w / 2 + 0.05, 0.9, -d / 2 - 1.2));
      const kanat2 = IZ.kutu(0.3, 0.14, 2.2, beyaz);
      kanat2.rotation.x = -0.35;
      kule.add(koy(kanat2, -w / 2 - 0.05, 0.3, -d / 2 - 0.8));
      g.add(koy(kule, tx, 1.8, tz));
    }
    // Giriş, palmiyeler, otopark
    g.add(koy(IZ.kutu(2.6, 0.1, 0.9, beyaz), 0, 0.9, -3.3));
    g.add(koy(IZ.kutu(2.0, 0.8, 0.08, '#9cc3d9', { isik: '#ffe9b0', puruz: 0.3 }), 0, 0.08, -3.02));
    for (const x of [-1.1, 1.1]) g.add(koy(IZ.silindir(0.05, 0.05, 0.9, 5, '#8f9ba3'), x, 0.08, -3.6));
    for (const x of [-5.6, -3.4, 3.4, 5.6]) palmiye(g, x, 0.08, -3.7, 0.9);
    ['#d2452f', '#f2f2ee', '#2f7fd1', '#3f4a56'].forEach((r, i) => araba(g, -1.8 + i * 1.2, -4.0, r, 0));
    g.add(koy(IZ.kutu(3.0, 0.08, 5.0, '#7fbf63'), 0, 1.8, 0.6));
    for (const z of [-1.0, 0.6, 2.2]) g.add(koy(IZ.kure(0.34, '#5fa052'), 0, 2.3, z));
    return g;
  }

  // ---------- Mistral İzmir ----------
  // Katlar yükseldikçe bir sağa bir sola döner; ofis kulesi camgöbeği cam, konut kulesi beyaz bantlıdır.
  function mistral() {
    const g = new THREE.Group();
    const beyaz = '#f2f5f7', cam = '#2f9a93';
    const ucgen = (t, f, a) => (2 / Math.PI) * Math.asin(Math.sin(t * Math.PI * 2 * f)) * a;
    g.add(IZ.kutu(10.6, 0.1, 7.8, '#d4d0c2'));
    // Alışveriş ve çarşı podyumu
    g.add(koy(IZ.kutu(9.6, 1.0, 6.2, '#dfe3e6'), 0, 0.1, 0.4));
    g.add(koy(IZ.kutu(9.66, 0.45, 6.26, '#36546d', { isik: '#ffd27a' }), 0, 0.3, 0.4));
    g.add(koy(IZ.kutu(3.0, 0.2, 0.1, '#2f6fd1', { isik: '#4f8fff', guc: 1.5 }), 2.2, 0.85, -2.74));
    for (const x of [-3.6, 0.2, 3.9]) g.add(koy(IZ.kutu(1.0, 0.3, 0.8, '#aeb7bc'), x, 1.1, 2.6));
    // Ofis kulesi
    const ofis = new THREE.Group(), n = 36, kh = 0.6;
    for (let i = 0; i < n; i++) {
      const a = ucgen(i / n, 2.2, 0.27);
      ofis.add(koy(IZ.kutu(2.7, kh, 2.7, cam, (i * 5) % 7 < 3 ? { isik: '#d8fff2', guc: 0.75, puruz: 0.25 } : { puruz: 0.25 }), 0, i * kh, 0, a));
      if (i % 3 === 0) ofis.add(koy(IZ.kutu(2.74, 0.04, 2.74, '#8fd6cc'), 0, i * kh, 0, a));
    }
    const sonAci = ucgen(1, 2.2, 0.27);
    ofis.add(koy(IZ.kutu(2.5, 0.5, 2.5, cam, { puruz: 0.25 }), 0, n * kh, 0, sonAci));
    const kapak = IZ.kutu(2.75, 0.08, 2.75, '#bfe6e0');
    kapak.rotation.set(0, sonAci, 0.1);
    kapak.position.set(0, n * kh + 0.55, 0);
    ofis.add(kapak);
    ofis.add(koy(alinlik(0.3, '#2f6fd1', { isik: '#4f8fff', guc: 1.5 }), 0, n * kh - 0.5, 1.33));
    ofis.add(koy(IZ.silindir(0.02, 0.02, 1.0, 3, '#6d747a'), 0.8, n * kh + 0.6, 0.6));
    ofis.add(koy(IZ.kure(0.09, '#ff5a4a', { isik: '#ff3020', guc: 2 }), 0.8, n * kh + 1.65, 0.6));
    g.add(koy(ofis, -2.4, 1.1, 0.5));
    // Konut kulesi
    const konut = new THREE.Group(), n2 = 28, kh2 = 0.55;
    for (let i = 0; i < n2; i++) {
      const a = ucgen(i / n2, 1.6, -0.3);
      konut.add(koy(IZ.kutu(2.0, kh2, 1.9, '#566b78', (i * 3) % 5 < 2 ? { isik: '#ffd27a', guc: 1.0 } : null), 0, i * kh2, 0, a));
      konut.add(koy(IZ.kutu(2.42, 0.13, 2.3, beyaz), 0, i * kh2 + kh2 - 0.13, 0, a));
    }
    const a2 = ucgen(1, 1.6, -0.3);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) konut.add(koy(IZ.kutu(0.1, 0.9, 0.1, beyaz), sx * 1.1, n2 * kh2, sz * 1.05, a2));
    konut.add(koy(IZ.kutu(2.42, 0.1, 2.3, beyaz), 0, n2 * kh2 + 0.9, 0, a2));
    g.add(koy(konut, 2.7, 1.1, 0.2));
    // Giriş meydanı
    g.add(koy(IZ.kutu(3.2, 0.1, 1.0, beyaz), -1.0, 0.95, -3.1));
    for (const x of [-4.6, -3.0, 1.2, 3.0, 4.6]) palmiye(g, x, 0.1, -3.4, 0.85);
    kisi(g, -1.4, 0.1, -3.3, '#c2478f');
    kisi(g, -0.6, 0.1, -3.5, '#3d6fa8');
    return g;
  }

  // ---------- Ege Perla ----------
  // Farklı yükseklikte iki kule; alışveriş bölümünün çatısı iki ucundan yürünerek çıkılan yeşil bir yamaçtır.
  function egePerla() {
    const g = new THREE.Group();
    const bronz = '#8a6f55', acik = '#b9a58a', cam = '#46525e';
    g.add(IZ.kutu(10.8, 0.1, 7.6, '#d4d0c2'));
    // Podyum ve yeşil çatı
    g.add(koy(IZ.kutu(9.8, 0.6, 5.6, '#e3ded2'), 0, 0.1, 0.4));
    g.add(koy(IZ.kutu(9.0, 0.36, 5.66, '#36546d', { isik: '#ffd27a' }), 0, 0.2, 0.4));
    g.add(koy(IZ.besikCati(9.8, 1.1, 5.6, '#7fbf63'), 0, 0.7, 0.4));
    for (const [x, z] of [[-3.4, -1.6], [-1.2, 2.2], [1.4, -1.9], [3.6, 1.9]]) g.add(koy(IZ.kure(0.3, '#5a9148'), x, 0.7 + 1.1 * (1 - Math.abs(x) / 4.9) + 0.2, z));
    kisi(g, -2.6, 0.7 + 1.1 * (1 - 2.6 / 4.9), 0.2, '#c2478f');
    kisi(g, 2.0, 0.7 + 1.1 * (1 - 2.0 / 4.9), 0.9, '#3d6fa8');
    function kule(x, z, w, d, H, renk) {
      const k = new THREE.Group();
      // Kaide ayakları
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) k.add(koy(IZ.kutu(0.3, 2.6, 0.3, '#cfc6ae'), sx * (w / 2 - 0.3), 0, sz * (d / 2 - 0.3)));
      k.add(koy(IZ.kutu(w * 0.5, 2.6, d * 0.6, cam), 0, 0, 0));
      const n = Math.round((H - 2.6) / 0.52);
      for (let i = 0; i < n; i++) {
        const y = 2.6 + i * 0.52;
        k.add(koy(IZ.kutu(w - 0.2, 0.52, d - 0.2, cam, (i * 3 + Math.round(H)) % 5 < 2 ? { isik: '#ffd27a', guc: 1.0 } : null), 0, y, 0));
        k.add(koy(IZ.kutu(w, 0.2, d, renk), 0, y, 0));
        // Geniş teraslar: bantlar kat kat hafifçe kayar
        if (i % 2) k.add(koy(IZ.kutu(w * 0.42, 0.2, d + 0.3, renk), (i % 4 === 1 ? -1 : 1) * w * 0.25, y, 0));
      }
      k.add(koy(IZ.kutu(w, 0.3, d, renk), 0, 2.6 + n * 0.52, 0));
      k.add(koy(IZ.kutu(w * 0.5, 0.5, d * 0.5, '#aeb7bc'), 0, 2.9 + n * 0.52, 0));
      k.add(koy(IZ.kure(0.09, '#ff5a4a', { isik: '#ff3020', guc: 2 }), 0, 3.45 + n * 0.52, 0));
      g.add(koy(k, x, 0.1, z));
    }
    kule(-2.2, 1.0, 3.2, 1.9, 19.0, bronz);
    kule(2.6, 0.2, 2.8, 1.9, 13.4, acik);
    for (const x of [-4.6, -1.6, 1.6, 4.6]) palmiye(g, x, 0.1, -3.2, 0.85);
    g.add(koy(IZ.kutu(2.4, 0.1, 0.8, '#f2f5f7'), 0, 0.75, -2.7));
    return g;
  }

  // ---------- Kemeraltı Çarşısı ----------
  function kemeralti() {
    const g = new THREE.Group();
    const tas = '#e9dcbd', cati = '#b24a33', ahsap = '#6b4a33';
    const renkler = ['#d2452f', '#2f8f7f', '#e0a93b', '#3d6fa8', '#c2478f'];
    g.add(IZ.kutu(6.6, 0.08, 9.8, '#d8ccb0'));
    let k = 0;
    for (const x of [-2.2, 2.2]) {
      const ic = x < 0 ? 1 : -1; // sokağa bakan yön
      for (let z = -3.4; z <= 3.5; z += 1.7) {
        const h = 1.5 + ((k * 7) % 3) * 0.25;
        g.add(koy(IZ.kutu(1.9, h, 1.6, k % 2 ? tas : '#f1e6cc'), x, 0, z));
        g.add(koy(IZ.kutu(0.08, 0.8, 1.1, '#4a3a2c', { isik: '#ffd27a' }), x + ic * 0.96, 0.25, z));
        g.add(koy(IZ.besikCati(2.1, 0.5, 1.7, cati), x, h, z));
        const tente = IZ.kutu(1.0, 0.07, 1.4, renkler[k % 5]);
        tente.rotation.z = -0.35 * ic;
        g.add(koy(tente, x + ic * 1.35, 1.25, z));
        k++;
      }
    }
    // Giriş kapısı
    for (const x of [-1.25, 1.25]) g.add(koy(IZ.kutu(0.5, 2.6, 0.5, tas), x, 0, -4.5));
    g.add(koy(IZ.kutu(3.3, 0.45, 0.6, tas), 0, 2.6, -4.5));
    const alinlik = IZ.besikCati(0.8, 0.5, 3.5, cati);
    alinlik.rotation.y = Math.PI / 2;
    g.add(koy(alinlik, 0, 3.05, -4.5));
    // Sokak boyunca fenerler ve tezgâhlar
    for (let z = -3.4; z <= 3.5; z += 1.7) g.add(koy(IZ.kure(0.13, '#ffe9a8', { isik: '#ffd27a' }), 0, 2.0, z));
    [[-0.25, -2.6, '#e8872e'], [0.25, -0.8, '#c8402f'], [-0.2, 1.0, '#8fb04a'], [0.25, 2.6, '#e0b83b']].forEach(([x, z, renk]) => {
      g.add(koy(IZ.kutu(0.5, 0.35, 0.5, ahsap), x, 0.08, z));
      g.add(koy(IZ.kure(0.22, renk), x, 0.5, z));
    });
    // Şadırvan
    g.add(koy(IZ.silindir(0.55, 0.6, 0.3, 8, '#d6cfc0'), 0, 0.08, 4.25));
    sutunHalkasi(g, 6, 0.45, 0.38, 0.8, 0.05, '#f5efe0');
    g.children.slice(-6).forEach((s) => (s.position.z += 4.25));
    g.add(koy(IZ.kure(0.6, '#8b9a9c', null, true), 0, 1.18, 4.25));
    // Sokak üstünde flamalar
    for (let z = -2.55; z <= 2.6; z += 1.7) {
      g.add(koy(IZ.kutu(2.5, 0.02, 0.02, ahsap), 0, 2.25, z));
      renkler.slice(0, 4).forEach((r, i) => g.add(koy(IZ.kutu(0.2, 0.22, 0.02, r), -0.75 + i * 0.5, 2.03, z)));
    }
    // Dükkân arka pencereleri, baharat çuvalları, alışveriş yapanlar
    for (const x of [-2.2, 2.2]) for (let z = -3.4; z <= 3.5; z += 1.7) g.add(koy(IZ.kutu(0.06, 0.4, 0.5, '#4a3a2c', { isik: '#ffd27a' }), x + (x < 0 ? -0.96 : 0.96), 0.8, z));
    [[-0.95, -1.7, '#c98a2b'], [0.95, 0.2, '#b23a48'], [-0.95, 1.9, '#6fa052'], [0.95, -3.3, '#e8d9a8'], [0.95, 2.0, '#c98a2b']].forEach(([x, z, r]) => {
      g.add(koy(IZ.silindir(0.16, 0.18, 0.3, 6, '#b9a57e'), x, 0.08, z));
      g.add(koy(IZ.silindir(0.14, 0.14, 0.05, 6, r), x, 0.38, z));
    });
    kisi(g, 0.45, 0.08, -1.9, '#3d6fa8');
    kisi(g, -0.45, 0.08, 0.2, '#c2478f');
    kisi(g, 0.4, 0.08, 1.7, '#2f8f7f');
    kisi(g, -0.3, 0.08, 3.3, '#e0a93b');
    kemer(g, 0, 1.75, -4.5, 0.82, 0.1, tas);
    g.add(koy(IZ.kutu(1.8, 0.28, 0.06, '#2b3a4a'), 0, 2.7, -4.82));
    for (const x of [-1.25, 1.25]) g.add(koy(IZ.kutu(0.16, 0.24, 0.16, '#fff3c4', { isik: '#ffdf8a', guc: 1.6 }), x, 1.9, -4.82));
    return g;
  }

  // ---------- Hisar Camii ----------
  function hisarCamii() {
    const g = new THREE.Group();
    const tas = '#eadbb8', kursun = '#8b9a9c', altin = '#d9b23c', koyu = '#c9a676';
    g.add(koy(IZ.kutu(8.4, 0.2, 9.4, '#d6cfc0'), 0, 0, 0));
    g.add(koy(IZ.kutu(6.2, 3.2, 6.2, tas), 0, 0.2, 0.9));
    g.add(koy(IZ.kutu(6.26, 0.6, 6.26, '#2c4a5a', { isik: '#ffd27a' }), 0, 1.6, 0.9));
    for (let i = -2; i <= 2; i++) {
      g.add(koy(IZ.kutu(0.55, 3.2, 6.34, tas), i * 1.25, 0.2, 0.9));
      g.add(koy(IZ.kutu(6.34, 3.2, 0.55, tas), 0, 0.2, 0.9 + i * 1.25));
    }
    g.add(koy(IZ.kutu(6.5, 0.2, 6.5, koyu), 0, 3.4, 0.9));
    g.add(koy(IZ.silindir(2.5, 2.6, 0.9, 8, tas), 0, 3.6, 0.9));
    g.add(koy(IZ.kure(2.45, kursun, null, true), 0, 4.5, 0.9));
    g.add(koy(IZ.koni(0.1, 0.8, 5, altin), 0, 6.9, 0.9));
    for (const x of [-2.5, 2.5]) for (const z of [-1.6, 3.4]) g.add(koy(IZ.kure(0.8, kursun, null, true), x, 3.6, z));
    // Son cemaat yeri
    for (let x = -3; x <= 3.01; x += 1.2) g.add(koy(IZ.silindir(0.12, 0.12, 1.9, 6, '#f5efe0'), x, 0.2, -3.7));
    g.add(koy(IZ.kutu(6.6, 0.25, 1.8, tas), 0, 2.1, -3.0));
    for (let x = -2.4; x <= 2.41; x += 1.2) g.add(koy(IZ.kure(0.55, kursun, null, true), x, 2.35, -3.0));
    g.add(koy(IZ.kutu(0.9, 1.6, 0.1, '#5a3b2a'), 0, 0.2, -2.25));
    // Minare
    g.add(koy(IZ.kutu(1.0, 1.6, 1.0, tas), 3.7, 0.2, -2.6));
    g.add(koy(IZ.silindir(0.34, 0.42, 5.6, 8, tas), 3.7, 1.8, -2.6));
    g.add(koy(IZ.silindir(0.62, 0.4, 0.3, 8, koyu), 3.7, 7.4, -2.6));
    g.add(koy(IZ.silindir(0.54, 0.54, 0.3, 8, tas), 3.7, 7.7, -2.6));
    g.add(koy(IZ.silindir(0.26, 0.28, 1.3, 8, tas), 3.7, 8.0, -2.6));
    g.add(koy(IZ.koni(0.36, 1.6, 8, kursun), 3.7, 9.3, -2.6));
    // Kemerli pencere alınlıkları (yan ve arka cepheler)
    for (const t of [-1.875, -0.625, 0.625, 1.875]) {
      for (const sx of [-1, 1]) {
        const a = alinlik(0.35, '#2c4a5a', { isik: '#ffd27a' });
        a.rotation.set(0, 0, Math.PI / 2);
        g.add(koy(a, sx * 3.13 + 0.04, 2.2, 0.9 + t));
      }
      g.add(koy(alinlik(0.35, '#2c4a5a', { isik: '#ffd27a' }), t, 2.2, 3.99));
    }
    // Kasnak pencereleri, alemler, şerefe korkuluğu
    for (let i = 0; i < 8; i++) {
      const p = new THREE.Group();
      p.add(koy(IZ.kutu(0.4, 0.4, 0.06, '#2c4a5a', { isik: '#ffd27a' }), 0, 3.85, 2.36));
      p.rotation.y = (i * Math.PI) / 4 + Math.PI / 8;
      p.position.z = 0.9;
      g.add(p);
    }
    g.add(koy(IZ.kure(0.12, altin), 0, 7.75, 0.9));
    g.add(koy(IZ.kure(0.08, altin), 3.7, 10.95, -2.6));
    for (const x of [-2.5, 2.5]) for (const z of [-1.6, 3.4]) g.add(koy(IZ.koni(0.05, 0.3, 4, altin), x, 4.38, z));
    const serefe = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.03, 3, 10), IZ.mat('#f5efe0'));
    serefe.rotation.x = Math.PI / 2;
    g.add(koy(serefe, 3.7, 8.05, -2.6));
    // Son cemaat yeri kemerleri, mihrap çıkıntısı, selviler
    for (let x = -2.4; x <= 2.41; x += 1.2) kemer(g, x, 1.62, -3.7, 0.5, 0.07, '#f5efe0');
    g.add(koy(IZ.kutu(1.3, 2.4, 0.35, tas), 0, 0.2, 4.12));
    g.add(koy(IZ.piramit(1.3, 0.4, 0.35, kursun), 0, 2.6, 4.12));
    selvi(g, -3.75, 0.2, -4.0, 0.9);
    selvi(g, -3.8, 0.2, 2.2, 1.0);
    selvi(g, 3.8, 0.2, 2.6, 1.0);
    return g;
  }

  // ---------- Basmane Garı ----------
  function basmaneGari() {
    const g = new THREE.Group();
    const duvar = '#efd9a0', tas = '#f6efe0', cati = '#a8452f', cam = '#3d5a73';
    g.add(koy(IZ.kutu(12.4, 0.15, 8.4, '#d6cfc0'), 0, 0, 1.2));
    for (const x of [-3.9, 3.9]) {
      g.add(koy(IZ.kutu(3.6, 2.6, 3.2, duvar), x, 0.15, 0));
      g.add(koy(IZ.kutu(3.66, 1.0, 3.26, cam, { isik: '#ffd27a' }), x, 1.0, 0));
      for (const dx of [-1.6, -0.53, 0.53, 1.6]) g.add(koy(IZ.kutu(0.42, 2.6, 3.32, duvar), x + dx, 0.15, 0));
      g.add(koy(IZ.kutu(3.8, 0.18, 3.4, tas), x, 2.75, 0));
      g.add(koy(IZ.piramit(3.9, 1.0, 3.5, cati), x, 2.93, 0));
    }
    // Orta kütle ve alınlık
    g.add(koy(IZ.kutu(4.4, 3.6, 3.8, duvar), 0, 0.15, 0));
    g.add(koy(IZ.kutu(4.46, 2.0, 3.86, cam, { isik: '#ffd27a' }), 0, 0.6, 0));
    for (const x of [-2.0, -0.67, 0.67, 2.0]) g.add(koy(IZ.kutu(0.5, 3.6, 3.92, duvar), x, 0.15, 0));
    g.add(koy(IZ.kutu(4.7, 0.2, 4.1, tas), 0, 3.75, 0));
    g.add(koy(IZ.besikCati(4.6, 1.2, 4.0, cati), 0, 3.95, 0));
    const saat = IZ.silindir(0.42, 0.42, 0.1, 10, '#fffdf5', { isik: '#fff0c0' });
    saat.rotation.x = Math.PI / 2;
    g.add(koy(saat, 0, 4.4, -2.08));
    g.add(koy(IZ.kutu(4.8, 0.15, 0.9, tas), 0, 0.15, -2.3));
    g.add(koy(IZ.kutu(4.8, 0.12, 1.0, '#8f9ba3'), 0, 2.75, -2.4));
    for (const x of [-2.2, 2.2]) g.add(koy(IZ.silindir(0.07, 0.07, 2.6, 5, '#6d747a'), x, 0.15, -2.8));
    // Peron, ray ve tren
    for (let x = -4; x <= 4; x += 2) g.add(koy(IZ.silindir(0.08, 0.08, 2.0, 5, '#6d747a'), x, 0.15, 2.6));
    const sacak = IZ.kutu(10.4, 0.12, 2.2, '#8f9ba3');
    g.add(koy(sacak, 0, 2.15, 2.7));
    g.add(koy(IZ.kutu(12.4, 0.1, 0.9, '#6b6257'), 0, 0.15, 4.3));
    for (const x of [-3.0, -0.2, 2.6]) g.add(koy(IZ.kutu(2.6, 1.0, 0.8, x < -1 ? '#2f6fa8' : '#f1ede2'), x, 0.35, 4.3));
    g.add(koy(IZ.kutu(8.2, 0.35, 0.84, cam, { isik: '#ffd27a' }), -0.2, 0.85, 4.3));
    // Kemerli pencereler, saat ibreleri, tabela, bacalar, bayrak
    for (const x of [-1.33, 0, 1.33]) g.add(koy(alinlik(0.42, cam, { isik: '#ffd27a' }), x, 2.6, -1.99));
    g.add(koy(IZ.kutu(0.05, 0.3, 0.03, '#2c2c2c'), 0, 4.4, -2.2));
    g.add(koy(IZ.kutu(0.22, 0.05, 0.03, '#2c2c2c'), 0.1, 4.38, -2.2));
    g.add(koy(IZ.kutu(2.4, 0.3, 0.06, '#2b3a4a'), 0, 3.38, -1.99));
    for (const x of [-4.9, -2.9, 2.9, 4.9]) {
      g.add(koy(IZ.kutu(0.3, 0.75, 0.3, '#b8674b'), x, 3.25, 0));
      g.add(koy(IZ.kutu(0.4, 0.08, 0.4, tas), x, 4.0, 0));
    }
    g.add(koy(IZ.silindir(0.03, 0.03, 1.3, 4, '#dddddd'), 0, 5.1, 0));
    g.add(koy(IZ.kutu(0.7, 0.42, 0.03, '#e30a17'), 0.36, 5.95, 0));
    // Peron, raylar, lokomotif burnu, banklar
    g.add(koy(IZ.kutu(10.4, 0.18, 1.1, '#cfc6ae'), 0, 0.15, 3.2));
    for (const dz of [-0.3, 0.3]) g.add(koy(golgesiz(IZ.kutu(12.4, 0.03, 0.06, '#b9c0c5')), 0, 0.25, 4.3 + dz));
    g.add(koy(IZ.kutu(0.06, 0.4, 0.6, '#2b3a4a'), -4.32, 0.8, 4.3));
    g.add(koy(IZ.kutu(0.06, 0.12, 0.3, '#fff6c8', { isik: '#fff2b0' }), -4.33, 0.45, 4.3));
    bank(g, -2, 0.33, 2.95);
    bank(g, 2, 0.33, 2.95);
    kisi(g, 0.3, 0.33, 3.3, '#3d6fa8');
    kisi(g, -3.2, 0.33, 3.2, '#c2478f');
    // Gar önü: lambalar, taksiler, ağaçlar
    lamba(g, -3.2, 0.15, -2.7, 1.5);
    lamba(g, 3.2, 0.15, -2.7, 1.5);
    araba(g, -4.7, -2.6, '#f0b429', 0);
    araba(g, -3.9, -2.6, '#f0b429', 0);
    agac(g, 5.6, -2.4, 0.9, '#6fb15c');
    agac(g, 4.5, -2.5, 0.8);
    return g;
  }

  // ---------- Elhamra Sahnesi ----------
  function elhamra() {
    const g = new THREE.Group();
    const duvar = '#efe4cc', tas = '#d9c9a3', cini = '#2f8f9f', kursun = '#8b9a9c', cam = '#3d4f66', ahsap = '#7a5a40';
    g.add(IZ.kutu(6.8, 0.2, 9.0, '#d6cfc0'));
    // Salon
    g.add(koy(IZ.kutu(5.4, 4.2, 7.4, duvar), 0, 0.2, 0.2));
    g.add(koy(IZ.kutu(5.46, 1.0, 4.4, cam, { isik: '#ffd27a' }), 0, 2.4, -0.4));
    for (let z = -2.6; z <= 1.8; z += 1.1) g.add(koy(IZ.kutu(5.5, 4.2, 0.5, duvar), 0, 0.2, z));
    g.add(koy(IZ.piramit(5.8, 1.2, 5.0, '#b24a33'), 0, 4.4, -0.5));
    // Sahne kulesi
    g.add(koy(IZ.kutu(4.8, 5.7, 2.2, duvar), 0, 0.2, 3.0));
    g.add(koy(IZ.kutu(5.0, 0.18, 2.4, tas), 0, 5.9, 3.0));
    // Ön cephe
    g.add(koy(IZ.kutu(5.8, 4.8, 1.2, duvar), 0, 0.2, -3.5));
    for (const x of [-1.6, 0, 1.6]) {
      g.add(koy(IZ.kutu(0.8, 1.2, 0.1, '#4a3324'), x, 0.2, -4.12));
      g.add(koy(IZ.kutu(1.0, 2.0, 0.1, cam, { isik: '#ffd27a' }), x, 1.85, -4.12));
      g.add(koy(IZ.besikCati(1.0, 0.55, 0.1, cam, { isik: '#ffd27a' }), x, 3.85, -4.12));
    }
    g.add(koy(IZ.kutu(4.8, 0.14, 0.7, tas), 0, 1.6, -4.35));
    g.add(koy(IZ.kutu(4.8, 0.3, 0.06, ahsap), 0, 1.74, -4.68));
    g.add(koy(IZ.kutu(5.86, 0.3, 1.26, cini), 0, 4.45, -3.5));
    g.add(koy(IZ.kutu(6.6, 0.15, 2.0, ahsap), 0, 5.0, -3.6));
    for (const x of [-2.75, 2.75]) {
      g.add(koy(IZ.kutu(0.9, 5.3, 1.3, duvar), x, 0.2, -3.5));
      g.add(koy(IZ.silindir(0.5, 0.55, 0.3, 8, tas), x, 5.5, -3.5));
      g.add(koy(IZ.kure(0.5, kursun, null, true), x, 5.8, -3.5));
      g.add(koy(IZ.koni(0.05, 0.4, 5, '#d9b23c'), x, 6.28, -3.5));
      g.add(koy(IZ.kutu(0.5, 1.2, 0.06, cam, { isik: '#ffd27a' }), x, 2.6, -4.17));
      g.add(koy(alinlik(0.25, cam, { isik: '#ffd27a' }), x, 3.8, -4.21));
    }
    // Giriş basamağı, afiş panoları, saçak ampulleri ve ahşap payandalar
    g.add(koy(IZ.kutu(4.6, 0.08, 0.3, '#e3ded2'), 0, 0.2, -4.3));
    [['#c2478f', -0.8], ['#e0a93b', 0.8]].forEach(([r, x]) => {
      g.add(koy(IZ.kutu(0.5, 0.8, 0.06, '#f4f0e6'), x, 0.5, -4.13));
      g.add(koy(IZ.kutu(0.4, 0.5, 0.07, r), x, 0.72, -4.14));
      const c = IZ.kutu(0.34, 0.34, 0.05, cini);
      c.rotation.z = Math.PI / 4;
      g.add(koy(c, x, 3.0, -4.13));
    });
    for (let x = -2.0; x <= 2.01; x += 0.8) {
      g.add(koy(IZ.kutu(0.1, 0.1, 0.1, '#fff3c4', { isik: '#ffdf8a', guc: 1.6 }), x, 1.5, -4.6));
      g.add(koy(IZ.kutu(0.12, 0.3, 0.7, ahsap), x, 4.7, -4.3));
    }
    for (let x = -2.2; x <= 2.21; x += 0.55) g.add(koy(IZ.silindir(0.03, 0.03, 0.3, 4, ahsap), x, 1.74, -4.66));
    g.add(koy(IZ.kutu(4.8, 0.05, 0.08, ahsap), 0, 2.04, -4.66));
    // Sahne kulesi: panjurlar ve bayrak
    for (const x of [-1.2, 1.2]) g.add(koy(IZ.kutu(1.2, 0.8, 0.06, '#6b7780'), x, 4.6, 4.12));
    g.add(koy(IZ.silindir(0.03, 0.03, 1.2, 4, '#dddddd'), 0, 6.08, 3.0));
    g.add(koy(IZ.kutu(0.7, 0.42, 0.03, '#e30a17'), 0.36, 6.85, 3.0));
    lamba(g, -3.1, 0.2, -4.25, 1.4);
    lamba(g, 3.1, 0.2, -4.25, 1.4);
    return g;
  }

  // ---------- Atatürk Müzesi ----------
  function ataturkMuzesi() {
    const g = new THREE.Group();
    const duvar = '#f6f1e4', cati = '#b24a33', pan = '#4f7a5a', tas = '#d6cfc0', cam = '#2c4a5a';
    g.add(IZ.kutu(6.4, 0.12, 6.4, '#9cc47e'));
    g.add(koy(IZ.kutu(4.6, 3.6, 3.8, duvar), 0, 0.12, 0.6));
    g.add(koy(IZ.kutu(4.7, 0.12, 3.9, tas), 0, 1.9, 0.6));
    for (const y of [0.7, 2.4]) {
      for (const x of [-1.6, 1.6]) {
        for (const z of [-1.33, 2.53]) {
          g.add(koy(IZ.kutu(0.6, 0.9, 0.08, cam, { isik: '#ffd27a' }), x, y, z));
          for (const dx of [-0.42, 0.42]) g.add(koy(IZ.kutu(0.2, 0.9, 0.07, pan), x + dx, y, z));
        }
      }
      for (const z of [-0.2, 1.4]) for (const sx of [-1, 1]) g.add(koy(IZ.kutu(0.08, 0.9, 0.6, cam, { isik: '#ffd27a' }), sx * 2.32, y, z));
    }
    // Cumba ve giriş
    g.add(koy(IZ.kutu(1.8, 1.6, 0.9, duvar), 0, 2.0, -1.75));
    g.add(koy(IZ.kutu(1.3, 0.9, 0.08, cam, { isik: '#ffd27a' }), 0, 2.35, -2.22));
    for (const x of [-0.75, 0.75]) g.add(koy(IZ.silindir(0.09, 0.09, 1.9, 6, duvar), x, 0.12, -2.05));
    g.add(koy(IZ.piramit(2.0, 0.5, 1.1, cati), 0, 3.6, -1.75));
    g.add(koy(IZ.kutu(0.8, 1.4, 0.08, '#5a3b2a'), 0, 0.3, -1.33));
    g.add(koy(IZ.kutu(1.9, 0.18, 0.9, tas), 0, 0.12, -1.8));
    // Çatı
    g.add(koy(IZ.kutu(4.9, 0.15, 4.1, tas), 0, 3.72, 0.6));
    g.add(koy(IZ.piramit(5.0, 1.3, 4.2, cati), 0, 3.87, 0.6));
    g.add(koy(IZ.kutu(0.35, 0.9, 0.35, '#b8674b'), 1.4, 4.2, 1.2));
    // Bayrak, çit ve ağaçlar
    g.add(koy(IZ.silindir(0.04, 0.04, 3.6, 5, '#dddddd'), -2.5, 0.12, -2.4));
    g.add(koy(IZ.kutu(1.0, 0.62, 0.04, '#e30a17'), -1.98, 3.05, -2.4));
    for (const x of [-2.05, 2.05]) g.add(koy(IZ.kutu(2.2, 0.4, 0.08, '#3a3a3a'), x, 0.12, -3.1));
    for (const [x, z] of [[2.5, -2.2], [-2.6, 2.4], [2.6, 2.3]]) {
      g.add(koy(IZ.silindir(0.08, 0.1, 0.8, 5, '#8a6a4a'), x, 0.12, z));
      g.add(koy(IZ.kure(0.55, '#5fa052'), x, 1.3, z));
    }
    // Köşe taşları, pencere söveleri, ikinci baca
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(koy(IZ.kutu(0.18, 3.6, 0.18, tas), sx * 2.3, 0.12, 0.6 + sz * 1.9));
    for (const y of [0.7, 2.4]) for (const x of [-1.6, 1.6]) for (const z of [-1.36, 2.56]) g.add(koy(IZ.kutu(1.1, 0.08, 0.1, tas), x, y + 0.93, z));
    g.add(koy(IZ.kutu(0.3, 0.8, 0.3, '#b8674b'), -1.4, 4.25, 0.2));
    // Cumba balkon korkuluğu
    g.add(koy(IZ.kutu(1.9, 0.05, 0.05, '#3a3a3a'), 0, 2.02, -2.22));
    // Bahçe: Atatürk büstü, kapı babaları, çiçek tarhları, lambalar
    const tunc = { metal: 0.45, puruz: 0.55 };
    g.add(koy(IZ.kutu(0.36, 0.8, 0.36, tas), -1.6, 0.12, -2.55));
    g.add(koy(IZ.kutu(0.4, 0.22, 0.24, '#6f5d3c', tunc), -1.6, 0.92, -2.55));
    g.add(koy(IZ.kure(0.16, '#6f5d3c', tunc), -1.6, 1.28, -2.55));
    for (const x of [-0.85, 0.85]) {
      g.add(koy(IZ.kutu(0.24, 0.7, 0.24, tas), x, 0.12, -3.1));
      g.add(koy(IZ.kure(0.14, tas), x, 0.92, -3.1));
      lamba(g, x * 1.4, 0.12, -2.3, 1.3);
    }
    cicekTarhi(g, -1.7, 0.12, -1.6, 1.2, 0.3, ['#d2452f', '#ffffff']);
    cicekTarhi(g, 1.7, 0.12, -1.6, 1.2, 0.3, ['#ffffff', '#d2452f']);
    return g;
  }

  // ---------- Tarihi Havagazı Fabrikası ----------
  function havagazi() {
    const g = new THREE.Group();
    const tugla = '#b5654a', koyu = '#96513a', cati = '#7d868c', cam = '#33485a', celik = '#59636b';
    g.add(IZ.kutu(10.4, 0.1, 8.4, '#cfc6ae'));
    // Ana hol
    g.add(koy(IZ.kutu(6.4, 2.6, 3.0, tugla), -1.6, 0.1, 1.8));
    g.add(koy(IZ.kutu(6.0, 1.2, 3.06, cam, { isik: '#ffd27a' }), -1.6, 0.8, 1.8));
    for (let x = -4.6; x <= 1.41; x += 1.0) g.add(koy(IZ.kutu(0.5, 2.6, 3.1, tugla), x, 0.1, 1.8));
    const c1 = IZ.besikCati(3.3, 1.1, 6.6, cati);
    c1.rotation.y = Math.PI / 2;
    g.add(koy(c1, -1.6, 2.7, 1.8));
    g.add(koy(IZ.kutu(4.0, 0.4, 0.7, '#aeb7bc'), -1.6, 3.55, 1.8));
    // Yan hol
    g.add(koy(IZ.kutu(2.8, 2.2, 4.2, tugla), 3.4, 0.1, -1.6));
    g.add(koy(IZ.kutu(2.86, 1.0, 3.6, cam, { isik: '#ffd27a' }), 3.4, 0.7, -1.6));
    for (let z = -3.5; z <= 0.31; z += 0.95) g.add(koy(IZ.kutu(2.9, 2.2, 0.45, tugla), 3.4, 0.1, z));
    g.add(koy(IZ.besikCati(3.1, 0.9, 4.4, cati), 3.4, 2.3, -1.6));
    // Baca
    g.add(koy(IZ.kutu(1.3, 0.9, 1.3, koyu), 3.2, 0.1, 2.6));
    g.add(koy(IZ.silindir(0.32, 0.5, 8.0, 8, tugla), 3.2, 1.0, 2.6));
    g.add(koy(IZ.silindir(0.44, 0.36, 0.3, 8, koyu), 3.2, 9.0, 2.6));
    // Gazometre
    const gx = -2.4, gz = -2.0;
    g.add(koy(IZ.silindir(1.9, 1.9, 1.5, 12, '#8fa0a8'), gx, 0.1, gz));
    const kapak = IZ.kure(1.9, '#9eadb4', null, true);
    kapak.scale.y = 0.28;
    g.add(koy(kapak, gx, 1.6, gz));
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.add(koy(IZ.silindir(0.07, 0.07, 3.5, 5, celik), gx + Math.cos(a) * 2.15, 0.1, gz + Math.sin(a) * 2.15));
    }
    for (const y of [2.4, 3.6]) {
      const halka = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.06, 4, 12), IZ.mat(celik));
      halka.rotation.x = Math.PI / 2;
      halka.castShadow = true;
      g.add(koy(halka, gx, y, gz));
    }
    // Avlu
    g.add(koy(IZ.kutu(3.0, 0.05, 2.6, '#9cc47e'), 0.8, 0.1, -2.4));
    g.add(koy(IZ.silindir(0.08, 0.1, 0.8, 5, '#8a6a4a'), 0.8, 0.1, -2.4));
    g.add(koy(IZ.kure(0.6, '#5fa052'), 0.8, 1.3, -2.4));
    // Tuğla kemerli pencereler
    for (let x = -4.1; x <= 0.91; x += 1.0) {
      g.add(koy(alinlik(0.25, cam, { isik: '#ffd27a' }), x, 2.0, 0.22));
      g.add(koy(alinlik(0.25, cam, { isik: '#ffd27a' }), x, 2.0, 3.3));
    }
    // Baca bilezikleri ve paratoner
    for (const y of [3.5, 6.0]) {
      const r = 0.5 - ((y - 1) / 8) * 0.18 + 0.04;
      g.add(koy(IZ.silindir(r, r, 0.14, 8, '#e3d6b8'), 3.2, y, 2.6));
    }
    g.add(koy(IZ.silindir(0.02, 0.02, 0.9, 3, '#555555'), 3.2, 9.3, 2.6));
    // Gazometre: çapraz bağlantılar ve merdiven
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2, b = ((i + 1) / 8) * Math.PI * 2;
      g.add(uzuv([gx + Math.cos(a) * 2.15, 2.4, gz + Math.sin(a) * 2.15], [gx + Math.cos(b) * 2.15, 3.6, gz + Math.sin(b) * 2.15], 0.025, 0.025, celik));
    }
    g.add(koy(IZ.kutu(0.3, 3.5, 0.04, celik), gx, 0.1, gz - 2.2));
    // Avlu: demir kapı, banklar, lambalar
    for (const x of [-0.1, 1.7]) g.add(koy(IZ.kutu(0.4, 1.6, 0.4, tugla), x, 0.1, -3.95));
    kemer(g, 0.8, 1.7, -3.95, 0.9, 0.05, celik);
    bank(g, 0.2, 0.1, -1.0);
    bank(g, 1.5, 0.1, -1.0);
    lamba(g, -0.3, 0.1, -3.3, 1.5);
    lamba(g, 1.7, 0.1, 0.0, 1.5);
    kisi(g, 0.8, 0.1, -3.2, '#3d6fa8');
    return g;
  }

  // ---------- Ortak küçük parçalar ----------
  function agac(g, x, z, s, renk) {
    g.add(koy(IZ.silindir(0.1 * s, 0.14 * s, 1.0 * s, 5, '#8a6a4a'), x, 0.1, z));
    g.add(koy(IZ.kure(0.7 * s, renk || '#5fa052'), x, 0.1 + 1.45 * s, z));
  }
  function cam(g, x, z, s, renk) {
    g.add(koy(IZ.silindir(0.08 * s, 0.1 * s, 0.6 * s, 5, '#7a5a40'), x, 0.1, z));
    g.add(koy(IZ.koni(0.55 * s, 2.0 * s, 6, renk || '#3f7a4a'), x, 0.1 + 0.5 * s, z));
  }
  function bayrak(g, x, z, h) {
    g.add(koy(IZ.silindir(0.04, 0.04, h, 5, '#dddddd'), x, 0.1, z));
    g.add(koy(IZ.kutu(0.9, 0.56, 0.04, '#e30a17'), x + 0.47, h - 0.5, z));
  }

  // ---------- Karşıyaka İskelesi ve Çarşı ----------
  // Orijin kıyı çizgisindedir: +z deniz, -z çarşı.
  function karsiyakaIskele() {
    const g = new THREE.Group();
    const duvar = '#f3ead6', cati = '#b9553a', camR = '#36546d', ahsap = '#8a6a4a';
    g.add(koy(IZ.kutu(8.4, 0.1, 8.2, '#e6dcc2'), 0, 0, -4.4));
    // İskele binası
    g.add(koy(IZ.kutu(6.0, 2.2, 2.4, duvar), 0, 0.1, -1.7));
    g.add(koy(IZ.kutu(6.06, 0.9, 2.46, camR, { isik: '#ffd27a' }), 0, 0.8, -1.7));
    for (let x = -2.7; x <= 2.71; x += 0.9) g.add(koy(IZ.kutu(0.35, 2.2, 2.52, duvar), x, 0.1, -1.7));
    const c = IZ.besikCati(2.8, 0.9, 6.4, cati);
    c.rotation.y = Math.PI / 2;
    g.add(koy(c, 0, 2.3, -1.7));
    g.add(koy(IZ.kutu(1.3, 1.5, 1.3, duvar), 0, 2.3, -1.7));
    g.add(koy(IZ.piramit(1.6, 0.8, 1.6, cati), 0, 3.8, -1.7));
    const saat = IZ.silindir(0.38, 0.38, 0.08, 10, '#fffdf5', { isik: '#fff0c0' });
    saat.rotation.x = Math.PI / 2;
    g.add(koy(saat, 0, 3.25, -1.08));
    // İskele
    g.add(koy(IZ.kutu(2.2, 0.3, 4.6, '#cfc6ae'), 0, -0.2, 1.9));
    for (const z of [1, 2.6, 4]) for (const x of [-0.95, 0.95]) g.add(koy(IZ.silindir(0.12, 0.12, 1.0, 5, ahsap), x, -1.1, z));
    for (const z of [0.8, 3.6]) for (const x of [-0.85, 0.85]) g.add(koy(IZ.silindir(0.06, 0.06, 1.6, 5, '#6d747a'), x, 0.1, z));
    g.add(koy(IZ.kutu(2.0, 0.1, 3.4, '#8f9ba3'), 0, 1.7, 2.2));
    // Çarşı sokağı
    const renkler = ['#d2452f', '#2f8f7f', '#e0a93b', '#3d6fa8'];
    let k = 0;
    for (const x of [-2.6, 2.6]) {
      const ic = x < 0 ? 1 : -1;
      for (const z of [-4.2, -5.9, -7.6]) {
        const h = 2.0 + (k % 3) * 0.5;
        g.add(koy(IZ.kutu(2.4, h, 1.6, k % 2 ? '#efe4cc' : '#f6f1e4'), x, 0.1, z));
        g.add(koy(IZ.kutu(0.08, 0.5, 1.2, camR, { isik: '#ffd27a' }), x + ic * 1.21, 1.45, z));
        g.add(koy(IZ.kutu(0.08, 0.8, 1.2, '#4a3a2c', { isik: '#ffd27a' }), x + ic * 1.21, 0.2, z));
        const tente = IZ.kutu(0.8, 0.06, 1.4, renkler[k % 4]);
        tente.rotation.z = -0.3 * ic;
        g.add(koy(tente, x + ic * 1.55, 1.15, z));
        k++;
      }
    }
    for (const z of [-3.6, -6.8]) agac(g, 0, z, 0.7);
    // İskele korkulukları, babalar, can simidi
    for (const x of [-1.05, 1.05]) {
      g.add(koy(IZ.kutu(0.04, 0.04, 3.6, '#6d747a'), x, 0.55, 2.3));
      for (const z of [0.6, 1.8, 3.0, 4.1]) g.add(koy(IZ.silindir(0.025, 0.025, 0.5, 4, '#6d747a'), x, 0.1, z));
      g.add(koy(IZ.silindir(0.1, 0.12, 0.25, 6, '#3a3a3a'), x * 0.76, 0.1, 4.0));
      lamba(g, x * 3.4, 0.1, -0.7, 1.5);
    }
    const sim = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 4, 8), IZ.mat('#e85d4a'));
    g.add(koy(sim, 1.08, 0.38, 2.4, Math.PI / 2));
    guvercin(g, 0.5, 0.1, 3.9, 1.0);
    guvercin(g, -0.6, 0.1, 3.4, 4.0);
    // Çarşıda gezenler ve simit arabası
    kisi(g, 0.35, 0.1, -4.6, '#3d6fa8');
    kisi(g, -0.4, 0.1, -6.1, '#c2478f');
    kisi(g, 0.5, 0.1, -7.7, '#2f8f7f');
    kisi(g, -1.8, 0.1, -0.5, '#e0a93b');
    g.add(koy(IZ.kutu(0.6, 0.45, 0.35, '#d2452f'), -0.2, 0.1, -5.3));
    g.add(koy(IZ.kutu(0.56, 0.25, 0.31, '#cfe3f0'), -0.2, 0.55, -5.3));
    g.add(koy(IZ.kutu(0.7, 0.05, 0.45, '#f4f0e6'), -0.2, 0.8, -5.3));
    bayrak(g, 3.4, -1.9, 3.4);
    return g;
  }

  // ---------- Zübeyde Hanım Anıt Mezarı ----------
  function zubeyde() {
    const g = new THREE.Group();
    const mermer = '#efece4', kaya = '#9a8f7c';
    g.add(IZ.kutu(8.4, 0.1, 8.4, '#9cc47e'));
    g.add(koy(IZ.kutu(5.4, 0.15, 6.6, '#d9d2c2'), 0, 0.1, 0));
    g.add(koy(IZ.kutu(4.4, 0.2, 2.6, mermer), 0, 0.25, 1.6));
    g.add(koy(IZ.kutu(3.6, 0.2, 2.0, mermer), 0, 0.45, 1.8));
    // Doğal kaya anıt
    const k1 = IZ.kure(1.5, kaya);
    k1.scale.set(1.05, 1.75, 0.7);
    k1.rotation.y = 0.3;
    g.add(koy(k1, 0, 2.9, 2.1));
    const k2 = IZ.kure(0.9, '#8c8270');
    k2.scale.set(1.2, 1.0, 0.8);
    g.add(koy(k2, 1.3, 1.2, 2.3));
    g.add(koy(IZ.kutu(1.0, 0.7, 0.08, '#6b5a3c'), 0, 1.5, 1.28));
    // Mezar
    g.add(koy(IZ.kutu(1.5, 0.15, 2.5, '#cfc8b8'), 0, 0.25, -1.3));
    g.add(koy(IZ.kutu(1.1, 0.5, 2.0, mermer), 0, 0.4, -1.3));
    g.add(koy(IZ.kutu(1.2, 0.1, 2.1, '#e3ded2'), 0, 0.9, -1.3));
    for (const x of [-0.9, 0.9]) g.add(koy(IZ.silindir(0.3, 0.3, 0.12, 8, '#d2452f'), x, 0.25, -2.9));
    bayrak(g, -2.3, 2.6, 4.2);
    bayrak(g, 2.3, 2.6, 4.2);
    for (const x of [-3.5, 3.5]) for (const z of [-3, -1, 1, 3]) cam(g, x, z, 1.25, '#3a6f47');
    // Çit bordürü, çiçekler, lambalar, mermer banklar
    for (const sx of [-1, 1]) {
      g.add(koy(IZ.kutu(0.3, 0.3, 6.6, '#3f7a4a'), sx * 2.85, 0.1, 0));
      for (let i = 0; i < 7; i++) g.add(koy(IZ.kure(0.1, i % 2 ? '#ffffff' : '#d2452f'), sx * 2.35, 0.33, -3.0 + i * 0.45));
      lamba(g, sx * 2.2, 0.25, 0.9, 1.2);
      g.add(koy(IZ.kutu(0.3, 0.25, 0.9, '#efece4'), sx * 2.1, 0.25, -0.2));
      // Çelenk
      const c = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.08, 5, 10), IZ.mat('#3f8a45'));
      c.rotation.x = 0.4;
      c.castShadow = true;
      g.add(koy(c, sx * 0.9, 0.55, -2.8));
    }
    // Kitabe satırları, mezar baş taşı, basamak
    [2.0, 1.85, 1.7].forEach((y, i) => g.add(koy(golgesiz(IZ.kutu(0.72 - i * 0.14, 0.05, 0.02, '#d9c9a0')), 0, y, 1.23)));
    g.add(koy(IZ.kutu(0.7, 0.75, 0.12, mermer), 0, 1.0, -0.38));
    g.add(koy(IZ.kutu(0.4, 0.08, 0.04, '#b9a57e'), 0, 1.4, -0.46));
    g.add(koy(IZ.kutu(1.6, 0.1, 0.5, '#e3ded2'), 0, 0.25, -2.85));
    g.add(koy(IZ.kutu(1.0, 0.25, 1.0, '#8c8270'), -1.4, 0.65, 2.2, 0.4));
    return g;
  }

  // ---------- Bostanlı Yaya Köprüsü ve Gün Batımı Terası ----------
  // Orijin kıyı çizgisindedir: +z deniz.
  function bostanli() {
    const g = new THREE.Group();
    const ahsap = '#c9a26b', koyuA = '#b08a55', beyaz = '#f4f4ef';
    g.add(koy(IZ.kutu(12, 0.08, 4.8, '#e6dcc2'), 0.6, 0, -2.6));
    // Basamaklı ahşap teras
    g.add(koy(IZ.kutu(7.0, 0.3, 2.0, ahsap), -1.8, 0.25, -1.4));
    for (let i = 0; i < 5; i++) g.add(koy(IZ.kutu(7.0 - i * 0.3, 0.25, 1.0, i % 2 ? ahsap : koyuA), -1.8, 0.2 - i * 0.2, 0.1 + i * 0.95));
    [[-3.6, 0.45, 0.1, '#d2452f'], [-2.2, 0.25, 1.05, '#3d6fa8'], [-0.6, 0.45, 0.1, '#e0a93b'], [0.2, 0.05, 2.0, '#2f8f7f'], [-3.0, 0.05, 2.0, '#c2478f']].forEach(([x, y, z, renk]) => {
      g.add(koy(IZ.silindir(0.12, 0.14, 0.38, 5, renk), x, y, z));
      g.add(koy(IZ.kure(0.13, '#e8c4a0'), x, y + 0.5, z));
    });
    // Dere ve kemerli yaya köprüsü
    g.add(koy(IZ.kutu(1.9, 0.07, 5.0, '#4aa9d8', { puruz: 0.4 }), 4.6, 0.03, -2.5));
    for (let i = -2; i <= 2; i++) {
      const p = IZ.kutu(0.95, 0.12, 1.3, beyaz);
      p.rotation.z = -i * 0.22;
      g.add(koy(p, 4.6 + i * 0.82, 0.25 + (1 - (i * i) / 4) * 0.55, -2.2));
    }
    for (const z of [-2.85, -1.55]) {
      const kemer = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.05, 4, 10, Math.PI), IZ.mat(beyaz));
      kemer.scale.y = 0.62;
      kemer.castShadow = true;
      g.add(koy(kemer, 4.6, 0.3, z));
    }
    for (const x of [-5.0, 1.9, 6.6]) {
      g.add(koy(IZ.silindir(0.04, 0.05, 1.8, 5, '#5a6068'), x, 0.08, -3.9));
      g.add(koy(IZ.kure(0.13, '#fff3c4', { isik: '#ffe9a8' }), x, 1.95, -3.9));
    }
    agac(g, 2.6, -3.6, 0.8);
    agac(g, 6.4, -1.2, 0.7);
    // Bisiklet yolu ve bisikletli
    g.add(koy(golgesiz(IZ.kutu(12, 0.02, 0.5, '#c96a5a')), 0.6, 0.075, -3.3));
    const bis = new THREE.Group();
    for (const x of [-0.25, 0.25]) bis.add(koy(new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 3, 10), IZ.mat('#2e3338')), x, 0.18, 0));
    bis.add(koy(IZ.kutu(0.5, 0.04, 0.04, '#d2452f'), 0, 0.3, 0));
    bis.add(koy(IZ.kutu(0.14, 0.32, 0.12, '#2f7fd1'), -0.02, 0.36, 0));
    bis.add(koy(IZ.kure(0.1, '#e8c4a0'), 0.02, 0.8, 0));
    g.add(koy(bis, -2.4, 0.08, -3.3));
    // Köprüde ve terasta insanlar, banklar, martılar
    kisi(g, 4.4, 0.92, -2.2, '#c2478f');
    kisi(g, 5.5, 0.72, -2.3, '#3d8b7d');
    kisi(g, -4.6, 0.55, -1.5, '#e0a93b');
    kisi(g, -1.2, 0.55, -1.7, '#3d6fa8');
    bank(g, 0.4, 0.08, -4.4);
    bank(g, -3.6, 0.08, -4.4);
    guvercin(g, -4.9, 0.45, 0.2, 1.0);
    guvercin(g, 0.9, 0.55, -1.0, 3.0);
    // Açıkta yelkenli
    const tekne = new THREE.Group();
    tekne.add(IZ.kutu(1.4, 0.3, 0.5, '#f4f4ef'));
    tekne.add(koy(IZ.kutu(1.42, 0.07, 0.52, '#2f8f7f'), 0, 0.2, 0));
    tekne.add(koy(IZ.silindir(0.03, 0.03, 1.8, 4, '#dddddd'), 0.1, 0.3, 0));
    tekne.add(koy(IZ.besikCati(1.0, 1.5, 0.03, '#ffffff'), -0.3, 0.5, 0));
    g.add(koy(tekne, 3.0, -0.62, 3.6, 0.5));
    return g;
  }

  // ---------- Latife Hanım Köşkü ----------
  function latifeKosku() {
    const g = new THREE.Group();
    const duvar = '#f1d6cb', beyaz = '#fbf7ef', cati = '#a8452f', camR = '#2c4a5a';
    g.add(IZ.kutu(8.2, 0.1, 7.6, '#9cc47e'));
    g.add(koy(IZ.kutu(5.2, 3.4, 3.6, duvar), 0, 0.1, 0.8));
    g.add(koy(IZ.kutu(5.3, 0.12, 3.7, beyaz), 0, 1.95, 0.8));
    for (const y of [0.75, 2.4]) {
      for (const x of [-1.8, 0, 1.8]) {
        if (y < 1 && x === 0) continue;
        g.add(koy(IZ.kutu(0.7, 0.95, 0.08, camR, { isik: '#ffd27a' }), x, y, -1.03));
        g.add(koy(IZ.kutu(0.7, 0.95, 0.08, camR, { isik: '#ffd27a' }), x, y, 2.63));
      }
      for (const z of [0.1, 1.5]) for (const sx of [-1, 1]) g.add(koy(IZ.kutu(0.08, 0.95, 0.6, camR, { isik: '#ffd27a' }), sx * 2.62, y, z));
    }
    g.add(koy(IZ.kutu(0.9, 1.5, 0.08, '#5a3b2a'), 0, 0.28, -1.03));
    // İki katlı veranda
    g.add(koy(IZ.kutu(5.8, 0.18, 1.2, beyaz), 0, 0.1, -1.6));
    g.add(koy(IZ.kutu(5.8, 0.14, 1.2, beyaz), 0, 1.95, -1.6));
    g.add(koy(IZ.kutu(5.8, 0.3, 0.06, beyaz), 0, 2.09, -2.17));
    g.add(koy(IZ.kutu(6.0, 0.14, 1.4, beyaz), 0, 3.5, -1.6));
    for (let x = -2.7; x <= 2.71; x += 1.08) {
      g.add(koy(IZ.silindir(0.09, 0.09, 1.67, 6, beyaz), x, 0.28, -2.05));
      g.add(koy(IZ.silindir(0.08, 0.08, 1.41, 6, beyaz), x, 2.09, -2.05));
    }
    // Çatı ve seyir kulesi
    g.add(koy(IZ.piramit(5.7, 1.1, 4.1, cati), 0, 3.5, 0.8));
    g.add(koy(IZ.kutu(1.6, 1.7, 1.6, duvar), 0, 3.6, 0.8));
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Group();
      p.add(koy(IZ.kutu(0.8, 0.6, 0.06, camR, { isik: '#ffd27a' }), 0, 4.5, 0.81));
      p.rotation.y = (i * Math.PI) / 2;
      p.position.z = 0.8;
      g.add(p);
    }
    g.add(koy(IZ.piramit(2.0, 0.9, 2.0, cati), 0, 5.3, 0.8));
    // Bahçe
    g.add(koy(IZ.kutu(1.0, 0.03, 1.5, '#e6dcc2'), 0, 0.1, -3.0));
    for (const x of [-2.4, 2.4]) g.add(koy(IZ.kutu(3.2, 0.4, 0.08, beyaz), x, 0.1, -3.7));
    agac(g, -3.2, -2.6, 0.9);
    agac(g, 3.3, -2.4, 1.0, '#6fb15c');
    agac(g, -3.3, 2.6, 1.1, '#4f9450');
    cam(g, 3.3, 2.6, 1.1);
    // Yeşil panjurlar, pencere söveleri
    for (const y of [0.75, 2.4]) {
      for (const x of [-1.8, 0, 1.8]) {
        for (const z of [-1.03, 2.63]) {
          if (y < 1 && x === 0 && z < 0) continue;
          for (const dx of [-0.46, 0.46]) g.add(koy(IZ.kutu(0.2, 0.95, 0.07, '#4f7a5a'), x + dx, y, z));
          g.add(koy(IZ.kutu(1.2, 0.07, 0.1, beyaz), x, y + 0.97, z));
        }
      }
    }
    // Veranda korkulukları, giriş basamakları, bacalar
    for (let x = -2.6; x <= 2.61; x += 0.36) if (Math.abs(x) > 0.5) g.add(koy(IZ.silindir(0.025, 0.025, 0.35, 4, beyaz), x, 0.28, -2.15));
    for (const x of [-1.6, 1.6]) g.add(koy(IZ.kutu(2.2, 0.05, 0.05, beyaz), x, 0.63, -2.15));
    g.add(koy(IZ.kutu(1.4, 0.1, 0.4, beyaz), 0, 0.1, -2.4));
    for (const x of [-1.9, 1.9]) {
      g.add(koy(IZ.kutu(0.3, 0.8, 0.3, '#b8674b'), x, 4.0, 0.8));
      g.add(koy(IZ.kutu(0.4, 0.08, 0.4, beyaz), x, 4.8, 0.8));
    }
    // Seyir kulesi korkuluğu ve rüzgârgülü
    g.add(koy(IZ.silindir(0.03, 0.03, 0.7, 4, '#3a3a3a'), 0, 6.2, 0.8));
    g.add(koy(IZ.kutu(0.4, 0.05, 0.05, '#3a3a3a'), 0, 6.7, 0.8));
    // Bahçe: gül tarhları, kapı babaları, lambalar, bank
    cicekTarhi(g, -1.7, 0.1, -3.05, 1.4, 0.4, ['#d2452f', '#f2a0c0', '#ffffff']);
    cicekTarhi(g, 1.7, 0.1, -3.05, 1.4, 0.4, ['#f2a0c0', '#d2452f', '#ffffff']);
    for (const x of [-0.7, 0.7]) {
      g.add(koy(IZ.kutu(0.22, 0.7, 0.22, beyaz), x, 0.1, -3.7));
      lamba(g, x * 1.3, 0.1, -3.4, 1.2);
    }
    bank(g, -3.0, 0.1, 0.4, Math.PI / 2);
    g.add(koy(IZ.silindir(0.5, 0.55, 0.25, 8, '#d6cfc0'), 3.2, 0.1, 0.4));
    g.add(koy(golgesiz(IZ.silindir(0.4, 0.4, 0.04, 8, '#4aa9d8', { puruz: 0.4 })), 3.2, 0.33, 0.4));
    g.add(koy(IZ.koni(0.07, 0.45, 4, '#cfeaf5'), 3.2, 0.35, 0.4));
    return g;
  }

  // ---------- Bornova Büyük Park ----------
  function buyukPark() {
    const g = new THREE.Group();
    g.add(IZ.silindir(5.3, 5.3, 0.1, 14, '#8fc070'));
    g.add(koy(IZ.kutu(10.4, 0.03, 0.8, '#e6dcc2'), 0, 0.1, 0));
    g.add(koy(IZ.kutu(0.8, 0.03, 10.4, '#e6dcc2'), 0, 0.1, 0));
    g.add(koy(IZ.silindir(2.0, 2.0, 0.03, 12, '#e6dcc2'), 0, 0.1, 0));
    // Havuz ve fıskiye
    g.add(koy(IZ.silindir(1.3, 1.4, 0.3, 10, '#d6cfc0'), 0, 0.1, 0));
    g.add(koy(IZ.silindir(1.1, 1.1, 0.05, 10, '#4aa9d8', { puruz: 0.4 }), 0, 0.38, 0));
    g.add(koy(IZ.silindir(0.1, 0.16, 0.8, 6, '#efece4'), 0, 0.4, 0));
    g.add(koy(IZ.silindir(0.45, 0.2, 0.15, 8, '#efece4'), 0, 1.2, 0));
    g.add(koy(IZ.koni(0.12, 0.6, 5, '#bfe3f2'), 0, 1.35, 0));
    // Çardak
    g.add(koy(IZ.silindir(1.15, 1.2, 0.2, 6, '#d6cfc0'), -2.7, 0.1, -2.6));
    sutunHalkasi(g, 6, 0.95, 0.3, 1.5, 0.05, '#fbf7ef');
    g.children.slice(-6).forEach((s) => { s.position.x += -2.7; s.position.z += -2.6; });
    g.add(koy(IZ.koni(1.4, 0.8, 6, '#b24a33'), -2.7, 1.8, -2.6));
    // Çınarlar ve banklar
    [[2.6, -2.8, 1.5], [3.6, -1.2, 1.2], [2.4, 2.6, 1.6], [3.8, 1.6, 1.1], [-2.6, 2.8, 1.5], [-3.9, 1.3, 1.2], [-1.2, 3.9, 1.1], [-4.0, -1.2, 1.1], [1.2, -4.1, 1.2]]
      .forEach(([x, z, s], i) => agac(g, x, z, s, ['#5fa052', '#4f9450', '#6fb15c'][i % 3]));
    for (const [x, z] of [[1.7, 0.75], [-1.7, -0.75], [0.75, -1.7], [-0.75, 1.7]]) g.add(koy(IZ.kutu(0.7, 0.22, 0.25, '#8a6a4a'), x, 0.1, z));
    for (const [x, z] of [[1.9, 1.9], [-1.9, 1.9], [1.9, -1.9]]) {
      g.add(koy(IZ.silindir(0.04, 0.05, 1.5, 5, '#3a3f45'), x, 0.1, z));
      g.add(koy(IZ.kure(0.14, '#fff3c4', { isik: '#ffe9a8' }), x, 1.65, z));
    }
    // Yol kenarı çiçek tarhları
    cicekTarhi(g, 3.0, 0.1, 0.75, 1.6, 0.35, ['#d2452f', '#f2c94c']);
    cicekTarhi(g, -3.0, 0.1, -0.75, 1.6, 0.35, ['#f2c94c', '#c2478f']);
    cicekTarhi(g, 0.75, 0.1, 3.0, 0.35, 1.6, ['#ffffff', '#d2452f']);
    cicekTarhi(g, -0.75, 0.1, -3.0, 0.35, 1.6, ['#c2478f', '#ffffff']);
    // Havuzda ördekler, ek fıskiyeler
    for (const [x, z] of [[0.6, 0.4], [-0.6, -0.4], [0.2, -0.75]]) {
      const o = IZ.kure(0.1, '#ffffff');
      o.scale.set(1.3, 0.8, 0.9);
      g.add(koy(o, x, 0.47, z));
      g.add(koy(IZ.kure(0.05, '#f0b429'), x + 0.13, 0.55, z));
    }
    for (let i = 0; i < 4; i++) g.add(koy(IZ.koni(0.06, 0.35, 4, '#bfe3f2'), Math.cos(i * 1.57 + 0.8) * 0.75, 0.4, Math.sin(i * 1.57 + 0.8) * 0.75));
    // Çardak korkuluğu, oyun alanı (salıncak ve tahterevalli), parktakiler
    const ck = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.03, 3, 6), IZ.mat('#fbf7ef'));
    ck.rotation.x = Math.PI / 2;
    g.add(koy(ck, -2.7, 0.75, -2.6));
    for (const x of [0.8, 1.9]) g.add(koy(IZ.silindir(0.04, 0.04, 1.3, 4, '#2f7fd1'), x, 0.1, 3.4));
    g.add(koy(IZ.kutu(1.2, 0.06, 0.06, '#2f7fd1'), 1.35, 1.4, 3.4));
    for (const x of [1.1, 1.6]) {
      g.add(koy(IZ.kutu(0.02, 0.8, 0.02, '#555555'), x, 0.55, 3.4));
      g.add(koy(IZ.kutu(0.26, 0.05, 0.18, '#e0a93b'), x, 0.5, 3.4));
    }
    const tah = IZ.kutu(1.3, 0.05, 0.16, '#d2452f');
    tah.rotation.z = 0.2;
    g.add(koy(tah, 1.5, 0.38, -3.2));
    g.add(koy(IZ.kutu(0.14, 0.3, 0.2, '#3a3f45'), 1.5, 0.1, -3.2));
    kisi(g, 1.7, 0.32, 0.75, '#c2478f');
    kisi(g, -0.2, 0.13, 2.6, '#3d6fa8');
    kisi(g, -2.7, 0.3, -2.6, '#e0a93b');
    kisi(g, 3.0, 0.13, -0.1, '#2f8f7f');
    return g;
  }

  // ---------- Ege Üniversitesi ----------
  function egeUniversitesi() {
    const g = new THREE.Group();
    const duvar = '#f4ecd8', beyaz = '#fbf7ef', cati = '#a8452f', camR = '#2c4a5a', mavi = '#1f5fa8';
    g.add(IZ.kutu(10.6, 0.1, 8.6, '#9cc47e'));
    g.add(koy(IZ.kutu(1.2, 0.03, 4.0, '#e6dcc2'), 0, 0.1, -2.3));
    g.add(koy(IZ.kutu(8.4, 0.03, 1.0, '#e6dcc2'), 0, 0.1, -0.9));
    // Rektörlük köşkü
    g.add(koy(IZ.kutu(4.4, 2.9, 3.0, duvar), -2.6, 0.1, 1.6));
    g.add(koy(IZ.kutu(4.46, 0.8, 3.06, camR, { isik: '#ffd27a' }), -2.6, 0.7, 1.6));
    g.add(koy(IZ.kutu(4.46, 0.7, 3.06, camR, { isik: '#ffd27a' }), -2.6, 2.0, 1.6));
    for (let x = -4.7; x <= -0.49; x += 0.84) g.add(koy(IZ.kutu(0.4, 2.9, 3.12, duvar), x, 0.1, 1.6));
    for (const z of [0.2, 1.6, 3.0]) g.add(koy(IZ.kutu(4.5, 2.9, 0.5, duvar), -2.6, 0.1, z));
    g.add(koy(IZ.kutu(4.6, 0.14, 3.2, beyaz), -2.6, 3.0, 1.6));
    g.add(koy(IZ.piramit(4.8, 1.0, 3.4, cati), -2.6, 3.14, 1.6));
    g.add(koy(IZ.kutu(2.2, 0.12, 0.9, beyaz), -2.6, 1.75, -0.3));
    g.add(koy(IZ.besikCati(2.2, 0.6, 0.9, cati), -2.6, 1.87, -0.3));
    for (const x of [-3.5, -2.9, -2.3, -1.7]) g.add(koy(IZ.silindir(0.08, 0.08, 1.65, 6, beyaz), x, 0.1, -0.65));
    // Fakülte bloğu
    g.add(koy(IZ.kutu(3.6, 4.4, 2.6, '#e8edf0'), 2.9, 0.1, 1.8));
    for (const y of [0.8, 2.0, 3.2]) g.add(koy(IZ.kutu(3.66, 0.6, 2.66, '#4f7fa8', { isik: '#ffe2a0' }), 2.9, y, 1.8));
    g.add(koy(IZ.kutu(0.5, 4.8, 2.7, mavi), 1.0, 0.1, 1.8));
    g.add(koy(IZ.kutu(3.8, 0.15, 2.8, '#c9d2d8'), 2.9, 4.5, 1.8));
    // Kampüs kapısı
    for (const x of [-1.4, 1.4]) g.add(koy(IZ.kutu(0.5, 2.2, 0.5, beyaz), x, 0.1, -3.8));
    g.add(koy(IZ.kutu(3.8, 0.45, 0.6, beyaz), 0, 2.3, -3.8));
    g.add(koy(IZ.kutu(3.8, 0.14, 0.64, mavi), 0, 2.45, -3.8));
    bayrak(g, -2.4, -3.6, 3.4);
    [[3.9, -2.6, 1.1], [2.2, -2.9, 0.9], [-4.2, -2.4, 1.0], [4.4, -0.4, 0.9], [0.1, 3.4, 1.0]].forEach(([x, z, s], i) => agac(g, x, z, s, i % 2 ? '#6fb15c' : '#4f9450'));
    cam(g, -4.6, 3.6, 1.1);
    cam(g, 4.6, 3.7, 1.0);
    // Rektörlük: bacalar ve giriş basamağı
    for (const x of [-3.8, -1.4]) {
      g.add(koy(IZ.kutu(0.3, 0.8, 0.3, '#b8674b'), x, 3.55, 1.6));
      g.add(koy(IZ.kutu(0.4, 0.08, 0.4, beyaz), x, 4.35, 1.6));
    }
    g.add(koy(IZ.kutu(2.4, 0.1, 0.5, beyaz), -2.6, 0.1, -0.75));
    g.add(koy(IZ.kutu(0.8, 1.3, 0.06, '#5a3b2a'), -2.6, 0.2, 0.07));
    // Fakülte bloğu: giriş, saçak, çatı donanımı
    g.add(koy(IZ.kutu(0.9, 0.7, 0.06, '#2b3a4a'), 2.9, 0.1, 0.47));
    g.add(koy(IZ.kutu(1.6, 0.08, 0.7, mavi), 2.9, 0.8, 0.15));
    for (const x of [2.2, 3.6]) g.add(koy(IZ.silindir(0.04, 0.04, 0.7, 4, '#8f9ba3'), x, 0.1, -0.15));
    g.add(koy(IZ.kutu(1.0, 0.4, 0.8, '#aeb7bc'), 3.6, 4.65, 2.0));
    g.add(koy(IZ.silindir(0.02, 0.02, 1.2, 3, '#6d747a'), 2.2, 4.65, 2.4));
    // Kapı amblemi
    g.add(koy(alinlik(0.32, mavi), 0, 3.07, -3.84));
    g.add(koy(alinlik(0.2, '#ffffff'), 0, 3.07, -3.9));
    // Yerleşke: süs havuzu, lambalar, banklar, öğrenciler
    g.add(koy(IZ.silindir(0.6, 0.66, 0.25, 8, '#d6cfc0'), 0, 0.1, -0.9));
    g.add(koy(golgesiz(IZ.silindir(0.5, 0.5, 0.04, 8, '#4aa9d8', { puruz: 0.4 })), 0, 0.33, -0.9));
    g.add(koy(IZ.koni(0.08, 0.5, 4, '#cfeaf5'), 0, 0.35, -0.9));
    for (const z of [-3.0, -1.9]) for (const x of [-0.8, 0.8]) lamba(g, x, 0.1, z, 1.4);
    bank(g, 3.3, 0.1, -1.6);
    bank(g, -3.3, 0.1, -1.6);
    kisi(g, 0.3, 0.13, -2.6, '#c2478f');
    kisi(g, -0.25, 0.13, -1.9, '#3d6fa8');
    kisi(g, 1.7, 0.13, -0.9, '#e0a93b');
    kisi(g, -1.2, 0.13, -0.95, '#2f8f7f');
    kisi(g, 2.5, 0.13, -0.5, '#d2452f');
    kisi(g, 3.3, 0.32, -1.6, '#8e5bb5');
    return g;
  }

  // ---------- Yeşilova Höyüğü ----------
  function yesilova() {
    const g = new THREE.Group();
    const toprak = '#c9b48a', koyuT = '#8f7a55', kerpic = '#b89468', saz = '#d9b86a';
    g.add(IZ.silindir(5.2, 5.4, 0.1, 12, '#b9c58a'));
    g.add(koy(IZ.silindir(3.0, 3.8, 0.5, 9, toprak), 1.0, 0.1, 0.8));
    // Kazı açmaları
    g.add(koy(IZ.kutu(3.2, 0.06, 2.6, koyuT), 1.0, 0.6, 0.8));
    for (const x of [0.0, 1.0, 2.0]) g.add(koy(IZ.kutu(0.12, 0.14, 2.6, toprak), x, 0.6, 0.8));
    for (const z of [0.0, 0.9, 1.7]) g.add(koy(IZ.kutu(3.2, 0.14, 0.12, toprak), 1.0, 0.6, z));
    [[0.5, 0.4], [1.5, 1.3], [2.3, 0.5]].forEach(([x, z]) => g.add(koy(IZ.kure(0.14, '#b8674b'), x, 0.75, z)));
    // Koruma çatısı
    for (const x of [-0.7, 2.7]) for (const z of [-0.6, 2.2]) g.add(koy(IZ.silindir(0.05, 0.05, 1.5, 5, '#6d747a'), x, 0.6, z));
    const ortu = IZ.kutu(3.8, 0.08, 3.2, '#f3f0e7');
    ortu.rotation.z = 0.08;
    g.add(koy(ortu, 1.0, 2.1, 0.8));
    // Neolitik köy canlandırması
    [[-3.0, -1.2, 0.3], [-1.6, -2.9, -0.4], [-3.3, 1.2, 0.1]].forEach(([x, z, ry]) => {
      const ev = new THREE.Group();
      ev.add(IZ.kutu(1.4, 0.8, 1.1, kerpic));
      ev.add(koy(IZ.kutu(0.35, 0.55, 0.06, '#4a3a2c'), 0, 0, -0.56));
      ev.add(koy(IZ.besikCati(1.7, 0.75, 1.3, saz), 0, 0.8, 0));
      g.add(koy(ev, x, 0.1, z, ry));
    });
    g.add(koy(IZ.silindir(0.7, 0.75, 0.8, 8, kerpic), -1.3, 0.1, 3.2));
    g.add(koy(IZ.koni(1.0, 0.85, 8, saz), -1.3, 0.9, 3.2));
    g.add(koy(IZ.silindir(0.35, 0.4, 0.1, 6, '#5a5148'), -2.0, 0.1, 0.1));
    g.add(koy(IZ.koni(0.16, 0.35, 5, '#e8872e', { isik: '#ffb060' }), -2.0, 0.2, 0.1));
    // Ziyaretçi merkezi
    g.add(koy(IZ.kutu(2.6, 1.3, 1.5, '#e8e1d0'), 2.6, 0.1, -3.2));
    g.add(koy(IZ.kutu(2.2, 0.6, 1.56, '#36546d', { isik: '#ffd27a' }), 2.6, 0.5, -3.2));
    g.add(koy(IZ.kutu(2.9, 0.12, 1.8, '#a8824f'), 2.6, 1.4, -3.2));
    agac(g, 4.2, 2.6, 0.9);
    agac(g, -4.2, -3.0, 0.8, '#6fb15c');
    // Kazı ekibi, el arabası, toprak yığını
    kisi(g, 0.5, 0.63, 1.3, '#e0a93b');
    kisi(g, 2.45, 0.63, 1.2, '#3d6fa8');
    g.add(koy(IZ.kutu(0.5, 0.2, 0.34, '#3d8b7d'), 3.2, 0.72, 0.9, 0.4));
    g.add(koy(IZ.silindir(0.12, 0.12, 0.06, 8, '#2e3338'), 3.45, 0.6, 1.0));
    g.add(koy(IZ.koni(0.45, 0.4, 6, toprak), -0.4, 0.6, 2.7));
    g.add(koy(IZ.koni(0.3, 0.28, 6, koyuT), 2.9, 0.6, -0.5));
    // Köy: çömlekler, öğütme taşı, kurutma askısı, sazdan çit
    [[-2.3, -0.5], [-2.6, 0.5], [-0.9, -2.2], [-0.5, 3.6]].forEach(([x, z], i) => {
      g.add(koy(IZ.silindir(0.1, 0.16, 0.3, 6, i % 2 ? '#b8674b' : '#a85a40'), x, 0.1, z));
    });
    g.add(koy(IZ.silindir(0.25, 0.28, 0.15, 7, '#8f887a'), -2.0, 0.1, 1.5));
    g.add(koy(IZ.kure(0.1, '#7d766a'), -2.0, 0.3, 1.5));
    for (const z of [-0.5, 0.5]) g.add(koy(IZ.silindir(0.035, 0.035, 0.9, 4, '#7a5a40'), -4.5, 0.1, z));
    g.add(koy(IZ.kutu(0.04, 0.04, 1.1, '#7a5a40'), -4.5, 0.98, 0));
    for (const z of [-0.3, 0, 0.3]) g.add(koy(IZ.kutu(0.03, 0.4, 0.2, '#c9a676'), -4.5, 0.56, z));
    for (let i = 0; i < 11; i++) {
      const a = 2.3 + i * 0.2;
      g.add(koy(IZ.silindir(0.035, 0.04, 0.55 + (i % 2) * 0.1, 4, '#b89a5a'), Math.cos(a) * 4.95, 0.1, -Math.sin(a) * 4.95));
    }
    // Bilgi panoları ve ziyaretçiler
    for (const [x, z, ry] of [[0.6, -2.3, 0.2], [3.9, -1.7, -0.5]]) {
      g.add(koy(IZ.silindir(0.035, 0.035, 0.7, 4, '#6d747a'), x, 0.1, z));
      g.add(koy(IZ.kutu(0.7, 0.4, 0.05, '#36546d'), x, 0.7, z, ry));
    }
    kisi(g, 0.9, 0.1, -2.9, '#c2478f');
    kisi(g, 1.5, 0.1, -2.7, '#2f8f7f');
    return g;
  }

  // ---------- Homeros Vadisi ----------
  function homeros() {
    const g = new THREE.Group();
    const cimen = '#86b86a', kaya = '#9a9488', ahsap = '#a8824f';
    g.add(IZ.silindir(5.4, 5.6, 0.1, 12, cimen));
    g.add(koy(IZ.silindir(0.5, 2.6, 1.9, 7, '#7fae68'), -3.3, 0.1, 2.9));
    g.add(koy(IZ.silindir(0.4, 2.3, 1.5, 7, '#8fbb72'), 3.6, 0.1, 3.0));
    g.add(koy(IZ.silindir(0.3, 1.6, 1.0, 6, '#7fae68'), 4.0, 0.1, -2.4));
    // Gölet
    const golet = IZ.silindir(2.1, 2.1, 0.06, 12, '#4aa9d8', { puruz: 0.4 });
    golet.scale.x = 1.35;
    g.add(koy(golet, -0.3, 0.1, -0.8));
    // Kayalar ve şelale
    [[1.6, 1.9, 0.75], [2.4, 1.3, 0.55], [0.9, 2.5, 0.5], [2.0, 2.6, 0.6]].forEach(([x, z, r]) => g.add(koy(IZ.kure(r, kaya), x, 0.25, z)));
    const selale = IZ.kutu(0.55, 1.1, 0.1, '#cfeaf5');
    selale.rotation.x = -0.6;
    g.add(koy(selale, 1.4, 0.15, 1.5));
    // Ahşap köprü
    g.add(koy(IZ.kutu(0.7, 0.1, 4.6, ahsap), -0.3, 0.42, -0.8));
    for (const z of [-3.0, -0.8, 1.4]) for (const x of [-0.62, 0.02]) g.add(koy(IZ.silindir(0.04, 0.04, 0.9, 5, '#7a5a40'), x, 0.1, z));
    for (const x of [-0.62, 0.02]) g.add(koy(IZ.kutu(0.05, 0.05, 4.6, '#7a5a40'), x, 0.95, -0.8));
    // Piknik çardağı ve Homeros büstü
    for (const x of [-4.0, -2.9]) for (const z of [-3.2, -2.1]) g.add(koy(IZ.silindir(0.05, 0.05, 1.2, 5, ahsap), x, 0.1, z));
    g.add(koy(IZ.piramit(1.7, 0.6, 1.7, '#b24a33'), -3.45, 1.3, -2.65));
    g.add(koy(IZ.kutu(0.8, 0.3, 0.5, ahsap), -3.45, 0.1, -2.65));
    g.add(koy(IZ.kutu(0.45, 0.9, 0.45, '#efece4'), 2.6, 0.1, -3.4));
    g.add(koy(IZ.kure(0.27, '#e3ded2'), 2.6, 1.25, -3.4));
    g.add(koy(IZ.kutu(0.4, 0.22, 0.3, '#e3ded2'), 2.6, 0.85, -3.4));
    [[-4.4, 0.6, 1.1], [-3.0, 3.6, 1.2], [-1.6, 4.2, 1.0], [3.0, 4.2, 1.1], [4.6, 1.4, 1.2], [4.4, -0.6, 0.9], [0.8, -4.4, 1.0], [-1.4, -4.3, 1.1], [3.9, -3.6, 0.9]]
      .forEach(([x, z, s], i) => cam(g, x, z, s, i % 2 ? '#3f7a4a' : '#4c8a52'));
    // Gölette ördekler, nilüferler, sazlar
    for (const [x, z] of [[-1.7, -1.2], [-2.1, -0.4], [1.3, -1.7]]) {
      const o = IZ.kure(0.11, '#ffffff');
      o.scale.set(1.3, 0.8, 0.9);
      g.add(koy(o, x, 0.22, z));
      g.add(koy(IZ.kure(0.05, '#f0b429'), x + 0.14, 0.3, z));
    }
    for (const [x, z] of [[0.9, -0.2], [1.6, -1.0], [-1.3, 0.3], [0.6, -2.2]]) {
      g.add(koy(golgesiz(IZ.silindir(0.18, 0.18, 0.02, 6, '#5a9a4a')), x, 0.16, z));
      g.add(koy(IZ.kure(0.06, '#f2a0c0'), x, 0.21, z));
    }
    for (let a = 3.5; a < 5.7; a += 0.24) g.add(koy(IZ.koni(0.07, 0.55 + (Math.round(a * 10) % 3) * 0.12, 4, '#9aa85a'), -0.3 + Math.cos(a) * 2.95, 0.1, -0.8 + Math.sin(a) * 2.2));
    // Şelale köpüğü, kır çiçekleri
    g.add(koy(golgesiz(IZ.kure(0.2, '#ffffff')), 1.3, 0.2, 1.05));
    g.add(koy(golgesiz(IZ.kure(0.14, '#ffffff')), 1.0, 0.18, 0.9));
    [[-2.2, 2.0], [-1.0, 3.0], [0.2, 3.4], [3.0, 0.4], [3.4, -1.2], [-4.2, -1.0], [1.6, -3.6], [-0.4, -3.9], [-4.0, 2.0], [2.2, -2.9]]
      .forEach(([x, z], i) => g.add(koy(IZ.kure(0.08, ['#f2c94c', '#ffffff', '#c2478f'][i % 3]), x, 0.16, z)));
    // Köprü fenerleri, piknik yapanlar, büst kitabesi
    lamba(g, 0.4, 0.1, -3.2, 1.2);
    lamba(g, 0.4, 0.1, 1.6, 1.2);
    kisi(g, -3.45, 0.1, -1.85, '#c2478f');
    kisi(g, -2.65, 0.1, -2.65, '#3d6fa8');
    kisi(g, -0.3, 0.47, -0.6, '#e0a93b');
    g.add(koy(IZ.kutu(0.3, 0.2, 0.03, '#6b5a3c'), 2.6, 0.45, -3.64));
    return g;
  }

  function yarimHalka(r, kalin, renk) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, kalin, 4, 8, Math.PI), IZ.mat(renk));
    m.castShadow = true;
    return m;
  }

  // ---------- Balçova Teleferik ----------
  // Alt istasyon kuzeyde (-z), hat güneydeki tepeye çıkar.
  function teleferik() {
    const g = new THREE.Group();
    const beyaz = '#f2f5f7', kirmizi = '#d2452f', celik = '#6d747a';
    g.add(koy(IZ.silindir(1.7, 5.0, 5.0, 8, '#8fae76'), 0, 0, 5.4));
    // Alt istasyon
    g.add(koy(IZ.kutu(3.2, 1.9, 2.4, beyaz), 0, 0, -3.6));
    g.add(koy(IZ.kutu(3.26, 0.8, 2.0, '#36546d', { isik: '#ffd27a' }), 0, 0.6, -3.6));
    const c1 = IZ.kutu(3.6, 0.14, 2.9, kirmizi);
    c1.rotation.x = 0.16;
    g.add(koy(c1, 0, 2.0, -3.6));
    // Üst istasyon ve seyir terası
    g.add(koy(IZ.kutu(2.4, 1.3, 1.8, beyaz), 0, 5.0, 5.6));
    g.add(koy(IZ.kutu(2.46, 0.5, 1.5, '#36546d', { isik: '#ffd27a' }), 0, 5.4, 5.6));
    g.add(koy(IZ.kutu(2.8, 0.12, 2.2, kirmizi), 0, 6.3, 5.6));
    // Direk ve halatlar
    g.add(koy(IZ.silindir(0.1, 0.18, 4.0, 6, celik), 0, 0.6, 1.0));
    g.add(koy(IZ.kutu(1.5, 0.12, 0.12, celik), 0, 4.55, 1.0));
    const egim = Math.atan2(4.2, 8.4), boy = Math.hypot(4.2, 8.4);
    const renkler = ['#d2452f', '#e0a93b', '#3d6fa8', '#2f8f7f'];
    const kabinler = [];
    [-0.55, 0.55].forEach((x, s) => {
      const halat = IZ.kutu(0.04, 0.04, boy, '#3a3f45');
      halat.rotation.x = -egim;
      g.add(koy(halat, x, 4.5, 1.2));
      [0, 0.5].forEach((faz, i) => {
        const k = new THREE.Group();
        k.add(koy(IZ.kutu(0.03, 0.5, 0.03, '#3a3f45'), 0, -0.5, 0));
        k.add(koy(IZ.kutu(0.5, 0.5, 0.6, renkler[s * 2 + i]), 0, -1.0, 0));
        k.add(koy(IZ.kutu(0.52, 0.2, 0.5, '#cfe3f0', { isik: '#ffe2a0' }), 0, -0.75, 0));
        k.userData.canli = true;
        g.add(k);
        kabinler.push({ k, x, faz: faz + s * 0.25, yon: s ? -1 : 1 });
      });
    });
    // Kabinler bir halatta çıkar, diğerinde iner
    g.userData.guncelle = (t) => {
      kabinler.forEach((c) => {
        let u = (t * 0.045 + c.faz) % 1;
        if (c.yon < 0) u = 1 - u;
        c.k.position.set(c.x, 2.4 + u * 4.2, -3.0 + u * 8.4);
      });
    };
    g.userData.guncelle(0);
    [[-2.6, 3.2, 0.9], [2.7, 3.6, 1.0], [-3.4, 6.0, 1.0], [3.3, 6.4, 0.9], [-1.8, 8.6, 1.0], [2.0, 8.8, 0.9]]
      .forEach(([x, z, s]) => { const p = new THREE.Group(); cam(p, 0, 0, s); g.add(koy(p, x, Math.max(0, 5 * (5 - Math.hypot(x, z - 5.4)) / 3.3) * 0.9, z)); });
    agac(g, -2.6, -3.4, 0.8);
    agac(g, 2.7, -2.8, 0.8);
    // Direk: makas, çaprazlar, makaralar
    g.add(koy(IZ.kutu(1.1, 0.08, 0.08, celik), 0, 3.4, 1.0));
    g.add(uzuv([-0.5, 3.4, 1.0], [0.6, 4.5, 1.0], 0.03, 0.03, celik));
    g.add(uzuv([0.5, 3.4, 1.0], [-0.6, 4.5, 1.0], 0.03, 0.03, celik));
    for (const x of [-0.55, 0.55]) {
      const m = IZ.silindir(0.16, 0.16, 0.06, 8, '#3a3f45');
      m.rotation.z = Math.PI / 2;
      g.add(koy(m, x + 0.03, 4.62, 1.0));
    }
    // Alt istasyon: tabela, gişe, sıra bekleyenler
    g.add(koy(IZ.kutu(1.8, 0.3, 0.06, '#2b3a4a'), 0, 1.5, -4.83));
    g.add(koy(IZ.kutu(0.8, 1.2, 0.06, '#36546d', { isik: '#ffd27a' }), 0, 0, -4.82));
    g.add(koy(IZ.kutu(0.9, 1.0, 0.9, beyaz), 2.3, 0, -4.5));
    g.add(koy(IZ.kutu(0.6, 0.4, 0.06, '#36546d', { isik: '#ffd27a' }), 2.3, 0.45, -4.96));
    g.add(koy(IZ.piramit(1.1, 0.35, 1.1, kirmizi), 2.3, 1.0, -4.5));
    kisi(g, 1.4, 0, -5.2, '#3d6fa8');
    kisi(g, 1.0, 0, -5.25, '#e0a93b');
    kisi(g, 0.55, 0, -5.2, '#c2478f');
    lamba(g, -1.9, 0, -5.0, 1.5);
    // Üst teras: korkuluk, şemsiye, dürbün, bayrak
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      g.add(koy(IZ.silindir(0.025, 0.025, 0.45, 4, celik), Math.cos(a) * 1.62, 5.0, 5.4 + Math.sin(a) * 1.62));
    }
    const kork = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.025, 3, 14), IZ.mat(celik));
    kork.rotation.x = Math.PI / 2;
    g.add(koy(kork, 0, 5.45, 5.4));
    semsiye(g, 1.3, 5.0, 4.5, '#e0a93b');
    g.add(koy(IZ.silindir(0.03, 0.03, 0.7, 4, '#4a4f55'), -1.2, 5.0, 4.5));
    g.add(koy(IZ.kutu(0.14, 0.14, 0.4, '#4a4f55'), -1.2, 5.7, 4.5, 0.5));
    kisi(g, -0.9, 5.0, 4.3, '#2f8f7f');
    g.add(koy(IZ.silindir(0.03, 0.03, 1.1, 4, '#dddddd'), 1.0, 6.42, 5.6));
    g.add(koy(IZ.kutu(0.6, 0.38, 0.03, '#e30a17'), 1.31, 7.1, 5.6));
    return g;
  }

  // ---------- Balçova Termal (Agamemnon Kaplıcaları) ----------
  function agamemnon() {
    const g = new THREE.Group();
    const duvar = '#f1e6cc', kursun = '#8b9a9c', mermer = '#efece4', su = '#59c3c8';
    g.add(IZ.kutu(8.6, 0.1, 7.4, '#e6dcc2'));
    g.add(koy(IZ.kutu(6.0, 1.9, 2.6, duvar), 0, 0.1, 1.8));
    g.add(koy(IZ.kutu(5.4, 1.1, 0.1, '#4a3a2c', { isik: '#ffd27a' }), 0, 0.3, 0.46));
    for (let x = -2.7; x <= 2.71; x += 0.9) g.add(koy(IZ.kutu(0.3, 1.9, 0.3, mermer), x, 0.1, 0.4));
    g.add(koy(IZ.kutu(6.3, 0.2, 2.9, '#c9a676'), 0, 2.0, 1.8));
    g.add(koy(IZ.silindir(1.3, 1.4, 0.5, 8, duvar), 0, 2.2, 1.8));
    g.add(koy(IZ.kure(1.3, kursun, null, true), 0, 2.7, 1.8));
    for (const x of [-2.1, 2.1]) g.add(koy(IZ.kure(0.7, kursun, null, true), x, 2.2, 1.8));
    // Termal havuzlar ve buhar
    for (const [x, z, r] of [[-1.7, -1.6, 1.3], [1.6, -1.9, 1.0]]) {
      g.add(koy(IZ.silindir(r + 0.2, r + 0.25, 0.25, 10, mermer), x, 0.1, z));
      g.add(koy(IZ.silindir(r, r, 0.05, 10, su, { puruz: 0.4 }), x, 0.33, z));
      for (let i = 0; i < 3; i++) g.add(koy(IZ.kure(0.22 - i * 0.04, '#ffffff'), x + (i - 1) * 0.3, 0.8 + i * 0.45, z + (i % 2) * 0.25));
    }
    // Antik sütunlar
    [[3.5, -0.6, 1.9], [3.5, -1.6, 1.4], [3.5, -2.6, 0.7]].forEach(([x, z, h]) => {
      g.add(koy(IZ.kutu(0.5, 0.15, 0.5, mermer), x, 0.1, z));
      g.add(koy(IZ.silindir(0.17, 0.2, h, 6, mermer), x, 0.25, z));
    });
    for (const [x, z] of [[-3.6, -2.8], [-3.7, 0.4], [3.7, 2.6]]) agac(g, x, z, 0.9, '#6fb15c');
    // Alemler, kemerli revak, giriş
    g.add(koy(IZ.kure(0.1, '#d9b23c'), 0, 4.08, 1.8));
    for (const x of [-2.1, 2.1]) g.add(koy(IZ.koni(0.05, 0.3, 4, '#d9b23c'), x, 2.88, 1.8));
    for (let x = -2.25; x <= 2.26; x += 0.9) kemer(g, x, 1.55, 0.4, 0.34, 0.06, mermer);
    g.add(koy(IZ.kutu(5.9, 0.1, 0.5, mermer), 0, 0.1, 0.2));
    // Şezlonglar, şemsiyeler, palmiyeler
    g.add(koy(IZ.kutu(0.35, 0.12, 0.9, '#ffffff'), -3.85, 0.1, -1.3));
    g.add(koy(IZ.kutu(0.9, 0.12, 0.35, '#ffffff'), -1.2, 0.1, -3.35));
    g.add(koy(IZ.kutu(0.9, 0.12, 0.35, '#ffffff'), 1.4, 0.1, -3.35));
    semsiye(g, -0.4, 0.1, -3.35, '#e0a93b');
    semsiye(g, 2.2, 0.1, -3.35, '#2f8f9f');
    palmiye(g, 3.9, 0.1, 0.9, 1.0);
    palmiye(g, -3.9, 0.1, 2.5, 1.1);
    // Havuz merdivenleri ve yüzenler
    for (const [x, z] of [[-0.55, -1.2], [2.45, -1.5]]) for (const d of [-0.1, 0.1]) g.add(koy(IZ.silindir(0.02, 0.02, 0.4, 4, '#b9c0c5'), x, 0.3, z + d));
    g.add(koy(IZ.kure(0.11, '#e8c4a0'), -1.9, 0.38, -1.4));
    g.add(koy(IZ.kure(0.11, '#e8c4a0'), 1.5, 0.38, -2.1));
    // Antik kalıntılar: amforalar, devrik arşitrav
    for (const [x, z] of [[4.0, -1.1], [4.0, -2.1]]) {
      g.add(koy(IZ.silindir(0.09, 0.16, 0.4, 6, '#b8674b'), x, 0.1, z));
      g.add(koy(IZ.silindir(0.1, 0.07, 0.14, 6, '#b8674b'), x, 0.5, z));
    }
    g.add(koy(IZ.kutu(0.45, 0.2, 1.3, mermer), 3.2, 0.1, -3.3, 0.9));
    g.add(koy(IZ.kutu(0.6, 0.16, 0.6, mermer), 3.5, 2.15, -0.6));
    return g;
  }

  // ---------- İnciraltı Deniz Müzesi ----------
  // Orijin kıyı çizgisindedir: -z deniz.
  function denizMuzesi() {
    const g = new THREE.Group();
    const gri = '#8d98a3', acik = '#a9b3bc', siyah = '#2e3338';
    g.add(koy(IZ.kutu(10.4, 0.1, 4.4, '#e6dcc2'), 0, 0, 2.6));
    g.add(koy(IZ.kutu(10.4, 0.35, 1.4, '#cfc6ae'), 0, -0.25, 0));
    // Müze gemisi
    g.add(koy(IZ.kutu(6.6, 0.75, 1.3, gri), -1.4, -0.6, -2.0));
    g.add(koy(IZ.kutu(1.2, 0.6, 0.85, gri), -5.2, -0.45, -2.0));
    g.add(koy(IZ.kutu(6.6, 0.08, 1.34, '#b24a33'), -1.4, -0.56, -2.0));
    g.add(koy(IZ.kutu(2.8, 0.6, 0.95, acik), -0.8, 0.15, -2.0));
    g.add(koy(IZ.kutu(1.3, 0.5, 0.8, acik), -1.3, 0.75, -2.0));
    g.add(koy(IZ.kutu(1.34, 0.18, 0.84, '#36546d', { isik: '#ffd27a' }), -1.3, 0.95, -2.0));
    g.add(koy(IZ.silindir(0.04, 0.05, 1.6, 5, '#5a6068'), -1.0, 1.25, -2.0));
    g.add(koy(IZ.kutu(0.7, 0.04, 0.04, '#5a6068'), -1.0, 2.4, -2.0));
    g.add(koy(IZ.silindir(0.24, 0.28, 0.6, 6, '#5a6068'), 0.2, 0.75, -2.0));
    g.add(koy(IZ.kure(0.3, acik), -3.6, 0.3, -2.0));
    const top = IZ.silindir(0.05, 0.05, 0.8, 5, '#5a6068');
    top.rotation.z = Math.PI / 2.4;
    g.add(koy(top, -3.7, 0.35, -2.0));
    g.add(koy(IZ.kutu(0.5, 0.3, 0.03, '#e30a17'), 1.6, 0.6, -2.0));
    g.add(koy(IZ.silindir(0.02, 0.02, 0.9, 4, '#dddddd'), 1.85, 0.15, -2.0));
    // Denizaltı
    const govde = IZ.silindir(0.42, 0.42, 5.0, 8, siyah);
    govde.rotation.z = Math.PI / 2;
    g.add(koy(govde, 5.2, -0.45, -4.3));
    g.add(koy(IZ.kure(0.42, siyah), 0.2, -0.45, -4.3));
    g.add(koy(IZ.kutu(1.0, 0.75, 0.36, siyah), 2.4, -0.1, -4.3));
    g.add(koy(IZ.silindir(0.03, 0.03, 0.7, 4, '#5a6068'), 2.5, 0.65, -4.3));
    // Müze binası ve bahçe
    g.add(koy(IZ.kutu(4.0, 1.6, 2.0, '#f2f5f7'), -2.4, 0.1, 3.2));
    g.add(koy(IZ.kutu(4.06, 0.7, 2.06, '#36546d', { isik: '#ffd27a' }), -2.4, 0.5, 3.2));
    g.add(koy(IZ.kutu(4.2, 0.2, 2.2, '#1f5fa8'), -2.4, 1.7, 3.2));
    g.add(koy(IZ.silindir(0.5, 0.55, 0.25, 8, '#d6cfc0'), 2.2, 0.1, 2.4));
    g.add(koy(yarimHalka(0.35, 0.06, siyah), 2.2, 0.55, 2.4));
    g.add(koy(IZ.kutu(0.07, 0.8, 0.07, siyah), 2.2, 0.35, 2.4));
    bayrak(g, 0.6, 1.4, 3.6);
    agac(g, 4.3, 3.6, 0.9);
    agac(g, -4.7, 1.2, 0.8, '#6fb15c');
    // Gemi: vardavela, lombozlar, borda numarası, kıç top, radar, filika, iskele tahtası
    for (const dz of [-0.62, 0.62]) {
      g.add(koy(IZ.kutu(6.4, 0.03, 0.03, '#dfe6ea'), -1.4, 0.42, -2.0 + dz));
      for (let x = -4.4; x <= 1.61; x += 1.0) g.add(koy(IZ.silindir(0.015, 0.015, 0.28, 3, '#dfe6ea'), x, 0.15, -2.0 + dz));
    }
    for (let x = -4.0; x <= 1.21; x += 0.65) g.add(koy(IZ.kutu(0.12, 0.12, 1.32, '#1d2a36', { isik: '#ffd27a' }), x, -0.2, -2.0));
    g.add(koy(IZ.kutu(0.6, 0.3, 0.03, '#f4f4ef'), -4.2, -0.28, -1.34));
    g.add(koy(IZ.kure(0.22, acik), 1.1, 0.28, -2.0));
    const top2 = IZ.silindir(0.04, 0.04, 0.6, 5, '#5a6068');
    top2.rotation.z = -Math.PI / 2.4;
    g.add(koy(top2, 1.15, 0.33, -2.0));
    g.add(koy(IZ.kutu(0.5, 0.06, 0.2, '#dfe6ea'), -1.0, 2.85, -2.0, 0.5));
    g.add(koy(IZ.kutu(0.6, 0.16, 0.22, '#e8872e'), 0.2, 0.75, -1.72));
    g.add(koy(IZ.kutu(0.4, 0.05, 1.0, '#a8824f'), 0.9, 0.12, -1.0));
    // Denizaltı: güverte, numara, ikinci periskop, kuyruk ve pervane
    g.add(koy(IZ.kutu(3.6, 0.04, 0.3, '#454c53'), 2.7, -0.04, -4.3));
    g.add(koy(IZ.kutu(0.4, 0.22, 0.02, '#f4f4ef'), 2.4, 0.25, -4.11));
    g.add(koy(IZ.silindir(0.02, 0.02, 0.45, 4, '#5a6068'), 2.2, 0.65, -4.3));
    g.add(koy(IZ.kutu(0.5, 0.7, 0.05, siyah), 4.9, -0.8, -4.3));
    g.add(koy(IZ.kutu(0.04, 0.5, 0.08, '#b08d57'), 5.25, -0.7, -4.3));
    g.add(koy(IZ.kutu(0.04, 0.08, 0.5, '#b08d57'), 5.25, -0.49, -4.3));
    // Rıhtım: babalar ve halatlar
    for (const x of [-4.2, -1.4, 1.6, 4.2]) g.add(koy(IZ.silindir(0.09, 0.11, 0.22, 6, siyah), x, 0.1, -0.4));
    g.add(uzuv([-4.2, 0.25, -0.4], [-4.4, 0.15, -1.4], 0.015, 0.015, '#c9b48a'));
    g.add(uzuv([1.6, 0.25, -0.4], [1.7, 0.15, -1.4], 0.015, 0.015, '#c9b48a'));
    // Bahçe sergisi: torpido, mayın, tabela, ziyaretçiler
    const torp = IZ.silindir(0.12, 0.12, 1.6, 8, '#5a6068');
    torp.rotation.z = Math.PI / 2;
    g.add(koy(torp, 4.6, 0.52, 1.7));
    const burun = IZ.koni(0.12, 0.3, 8, '#b24a33');
    burun.rotation.z = Math.PI / 2;
    g.add(koy(burun, 3.0, 0.52, 1.7));
    for (const x of [3.4, 4.2]) g.add(koy(IZ.kutu(0.1, 0.3, 0.24, '#8d98a3'), x, 0.1, 1.7));
    g.add(koy(IZ.silindir(0.16, 0.2, 0.2, 6, '#8d98a3'), 1.0, 0.1, 3.7));
    g.add(koy(IZ.kure(0.28, siyah), 1.0, 0.56, 3.7));
    for (let i = 0; i < 5; i++) g.add(koy(IZ.silindir(0.025, 0.025, 0.14, 4, siyah), 1.0 + Math.cos(i * 1.26) * 0.24, 0.72, 3.7 + Math.sin(i * 1.26) * 0.24));
    g.add(koy(IZ.kutu(1.8, 0.3, 0.06, '#f4f4ef'), -2.4, 1.32, 2.17));
    kisi(g, -0.2, 0.1, 1.4, '#c2478f');
    kisi(g, 3.3, 0.1, 2.7, '#3d6fa8');
    kisi(g, -3.6, 0.1, 1.6, '#e0a93b');
    kisi(g, 0.9, 0.1, -0.2, '#2f8f7f');
    return g;
  }

  // ---------- Narlıdere Yukarıköy ----------
  function yukarikoy() {
    const g = new THREE.Group();
    const tas = '#d9cfb8', beyaz = '#f4efe2', cati = '#b24a33', ahsap = '#6b4a33';
    g.add(IZ.silindir(4.9, 5.4, 0.5, 10, '#b9c58a'));
    g.add(koy(IZ.silindir(1.7, 1.7, 0.04, 10, '#e0d6bd'), 0, 0.5, 0));
    [[-2.6, -1.8, 0.4, 1.5, beyaz], [2.5, -2.2, -0.5, 1.8, tas], [3.0, 1.2, 1.4, 1.5, beyaz], [-0.4, 3.1, 3.1, 1.7, tas], [-3.2, 1.4, 1.9, 1.4, beyaz], [0.2, -3.4, 0.1, 1.4, tas]]
      .forEach(([x, z, ry, h, renk]) => {
        const ev = new THREE.Group();
        ev.add(IZ.kutu(1.9, h, 1.5, renk));
        ev.add(koy(IZ.kutu(1.9, 0.45, 1.5, tas), 0, 0, 0));
        ev.add(koy(IZ.kutu(0.4, 0.4, 0.06, '#4a3a2c', { isik: '#ffd27a' }), -0.45, h - 0.65, 0.76));
        ev.add(koy(IZ.kutu(0.4, 0.4, 0.06, '#4a3a2c', { isik: '#ffd27a' }), 0.45, h - 0.65, 0.76));
        ev.add(koy(IZ.kutu(1.3, 0.08, 0.4, ahsap), 0, h - 0.8, 0.95));
        const c = IZ.besikCati(1.8, 0.6, 2.2, cati);
        c.rotation.y = Math.PI / 2;
        ev.add(koy(c, 0, h, 0));
        g.add(koy(ev, x, 0.5, z, ry));
      });
    // Meydan: çınar ve çeşme
    g.add(koy(IZ.silindir(0.16, 0.24, 1.5, 6, '#8a6a4a'), 0.3, 0.5, 0.2));
    g.add(koy(IZ.kure(1.3, '#4f9450'), 0.3, 2.7, 0.2));
    g.add(koy(IZ.kutu(0.6, 0.9, 0.3, '#efece4'), -1.1, 0.5, -0.6));
    g.add(koy(IZ.kutu(0.7, 0.2, 0.5, '#d6cfc0'), -1.1, 0.5, -0.3));
    // Nar ağaçları
    [[-1.6, -3.9], [4.1, -0.6], [1.9, 3.6], [-4.2, -0.4]].forEach(([x, z]) => {
      g.add(koy(IZ.silindir(0.06, 0.08, 0.6, 5, '#8a6a4a'), x, 0.5, z));
      g.add(koy(IZ.kure(0.55, '#5fa052'), x, 1.5, z));
      for (const [dx, dy, dz] of [[0.4, 0.1, 0.3], [-0.35, 0.2, 0.35], [0.1, -0.2, 0.5], [-0.1, 0.35, -0.42]]) g.add(koy(IZ.kure(0.13, '#d2302f'), x + dx, 1.5 + dy, z + dz));
    });
    // Bacalar
    [[-2.6, -1.8, 1.5], [2.5, -2.2, 1.8], [3.0, 1.2, 1.5], [-0.4, 3.1, 1.7], [-3.2, 1.4, 1.4], [0.2, -3.4, 1.4]].forEach(([x, z, h]) => {
      g.add(koy(IZ.kutu(0.24, 0.5, 0.24, tas), x, 0.5 + h + 0.35, z));
      g.add(koy(IZ.kutu(0.32, 0.06, 0.32, cati), x, 0.5 + h + 0.85, z));
    });
    // Meydan: çınar altı sedir, çeşme suyu, nar sepetleri, tavuklar, lambalar, köylüler
    const sedir = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.09, 4, 10), IZ.mat(ahsap));
    sedir.rotation.x = Math.PI / 2;
    sedir.castShadow = true;
    g.add(koy(sedir, 0.3, 0.78, 0.2));
    g.add(koy(golgesiz(IZ.kutu(0.55, 0.03, 0.35, '#4aa9d8', { puruz: 0.4 })), -1.1, 0.7, -0.3));
    for (const [x, z] of [[-0.9, 1.0], [1.3, -0.6]]) {
      g.add(koy(IZ.silindir(0.2, 0.15, 0.2, 7, '#a8824f'), x, 0.52, z));
      for (const [dx, dz] of [[0.07, 0], [-0.07, 0.05], [0, -0.08]]) g.add(koy(IZ.kure(0.09, '#d2302f'), x + dx, 0.78, z + dz));
    }
    for (const [x, z] of [[0.9, 1.35], [1.25, 1.05], [-0.3, -1.3]]) {
      g.add(koy(IZ.kure(0.09, '#ffffff'), x, 0.62, z));
      g.add(koy(IZ.kure(0.035, '#d2302f'), x + 0.07, 0.72, z));
    }
    lamba(g, -1.4, 0.5, 1.1, 1.3);
    lamba(g, 1.5, 0.5, -1.2, 1.3);
    kisi(g, -0.6, 0.52, 0.75, '#c2478f');
    kisi(g, 0.95, 0.52, -0.15, '#3d6fa8');
    // Taş basamaklar ve odun yığını
    for (let i = 0; i < 3; i++) g.add(koy(IZ.kutu(1.0, 0.16, 0.3, tas), 1.6, 0.34 - i * 0.16, 4.75 + i * 0.25, 0.3));
    for (let i = 0; i < 3; i++) {
      const o = IZ.silindir(0.08, 0.08, 0.7, 5, '#8a6a4a');
      o.rotation.z = Math.PI / 2;
      g.add(koy(o, -3.6, 0.58 + (i === 2 ? 0.14 : 0), 3.0 + (i === 2 ? 0.08 : i * 0.16)));
    }
    return g;
  }

  // ---------- Narlıdere Sahilevleri kıyı parkı ----------
  // Orijin kıyı çizgisindedir: -z deniz.
  function sahilevleri() {
    const g = new THREE.Group();
    const ahsap = '#a8824f';
    g.add(koy(IZ.kutu(10.4, 0.1, 4.2, '#9cc47e'), 0, 0, 2.3));
    g.add(koy(IZ.kutu(10.4, 0.04, 0.9, '#e6dcc2'), 0, 0.1, 0.9));
    // Ahşap iskele ve tekneler
    g.add(koy(IZ.kutu(1.0, 0.12, 4.6, ahsap), 0, -0.15, -2.2));
    g.add(koy(IZ.kutu(2.6, 0.12, 1.0, ahsap), 0, -0.15, -4.4));
    for (const z of [-1, -2.6, -4.4]) for (const x of [-0.42, 0.42]) g.add(koy(IZ.silindir(0.07, 0.07, 0.9, 5, '#7a5a40'), x, -0.95, z));
    [[-2.6, -2.2, 0.3, '#f4f4ef', '#d2452f'], [2.4, -3.0, -0.4, '#f4f4ef', '#3d6fa8'], [-3.4, -4.6, 1.2, '#e8e1d0', '#e0a93b']].forEach(([x, z, ry, renk, serit]) => {
      const t = new THREE.Group();
      t.add(koy(IZ.kutu(1.6, 0.3, 0.6, renk), 0, 0, 0));
      t.add(koy(IZ.kutu(0.5, 0.26, 0.42, renk), 0.95, 0.02, 0));
      t.add(koy(IZ.kutu(1.62, 0.07, 0.62, serit), 0, 0.2, 0));
      t.add(koy(IZ.silindir(0.03, 0.03, 1.8, 4, '#dddddd'), 0.1, 0.3, 0));
      const yelken = IZ.besikCati(1.1, 1.5, 0.03, '#ffffff');
      t.add(koy(yelken, -0.35, 0.5, 0));
      g.add(koy(t, x, -0.6, z, ry));
    });
    // Çardak, banklar, oyun alanı
    for (const x of [2.4, 4.4]) for (const z of [2.2, 3.6]) g.add(koy(IZ.silindir(0.06, 0.06, 1.4, 5, ahsap), x, 0.1, z));
    for (let x = 2.2; x <= 4.61; x += 0.4) g.add(koy(IZ.kutu(0.12, 0.08, 1.9, ahsap), x, 1.5, 2.9));
    for (const x of [-3.6, -1.2, 1.0]) g.add(koy(IZ.kutu(0.8, 0.22, 0.25, '#8a6a4a'), x, 0.1, 1.7));
    g.add(koy(IZ.kutu(0.1, 1.0, 0.1, '#e0a93b'), -3.2, 0.1, 3.4));
    const kaydirak = IZ.kutu(0.4, 0.06, 1.5, '#d2452f');
    kaydirak.rotation.x = 0.6;
    g.add(koy(kaydirak, -3.2, 0.55, 2.8));
    for (const [x, z] of [[-4.6, 2.0], [-1.8, 3.6], [0.6, 3.4], [4.9, 1.6]]) agac(g, x, z, 0.85, '#6fb15c');
    for (const x of [-2.4, 1.8]) {
      g.add(koy(IZ.silindir(0.04, 0.05, 1.7, 5, '#5a6068'), x, 0.1, 0.4));
      g.add(koy(IZ.kure(0.13, '#fff3c4', { isik: '#ffe9a8' }), x, 1.85, 0.4));
    }
    // İskele korkuluğu, balıkçı, martılar, şamandıralar
    for (const x of [-0.48, 0.48]) {
      g.add(koy(IZ.kutu(0.04, 0.04, 3.8, '#7a5a40'), x, 0.4, -2.0));
      for (const z of [-0.3, -1.5, -2.7, -3.85]) g.add(koy(IZ.silindir(0.025, 0.025, 0.45, 4, '#7a5a40'), x, -0.03, z));
    }
    kisi(g, 1.0, -0.03, -4.4, '#3d8b7d');
    g.add(uzuv([1.1, 0.35, -4.5], [1.5, 1.05, -5.3], 0.012, 0.012, '#3a3a3a'));
    guvercin(g, -1.0, -0.03, -4.5, 2.0);
    guvercin(g, -0.6, -0.03, -4.7, 3.4);
    for (const [x, z] of [[1.4, -1.5], [4.2, -4.2], [-4.6, -2.8]]) g.add(koy(IZ.kure(0.14, '#e8872e'), x, -0.5, z));
    // Kıyı parkı: çiçek tarhları, piknik masası, spor aletleri, gezenler
    cicekTarhi(g, -2.4, 0.1, 1.75, 1.3, 0.3, ['#d2452f', '#f2c94c']);
    cicekTarhi(g, -0.1, 0.1, 1.75, 1.1, 0.3, ['#c2478f', '#ffffff']);
    cicekTarhi(g, 2.2, 0.1, 1.75, 1.3, 0.3, ['#f2c94c', '#d2452f']);
    g.add(koy(IZ.kutu(1.0, 0.06, 0.6, ahsap), 3.4, 0.55, 2.9));
    for (const x of [3.0, 3.8]) g.add(koy(IZ.kutu(0.08, 0.45, 0.5, ahsap), x, 0.1, 2.9));
    for (const x of [-0.8, 0.0]) {
      g.add(koy(IZ.silindir(0.04, 0.04, 1.0, 4, '#f0b429'), x, 0.1, 3.2));
      g.add(koy(IZ.silindir(0.04, 0.04, 1.0, 4, '#f0b429'), x, 0.1, 3.8));
      g.add(koy(IZ.kutu(0.05, 0.05, 0.6, '#2f7fd1'), x, 1.1, 3.5));
    }
    kisi(g, -0.6, 0.14, 0.9, '#c2478f');
    kisi(g, 3.0, 0.14, 0.95, '#3d6fa8');
    kisi(g, 3.4, 0.1, 3.5, '#e0a93b');
    return g;
  }

  // ---------- Kızılçullu Su Kemerleri ----------
  function suKemerleri() {
    const g = new THREE.Group();
    const tas = '#cdb992', koyu = '#b39f7a';
    g.add(IZ.kutu(10.6, 0.1, 5.4, '#a9c47e'));
    g.add(koy(IZ.kutu(1.6, 0.06, 5.4, '#4aa9d8', { puruz: 0.4 }), 0.8, 0.08, 0));
    for (let i = 0; i < 7; i++) {
      const x = -4.8 + i * 1.6, kisa = i === 6;
      g.add(koy(IZ.kutu(0.55, kisa ? 1.9 : 3.3, 1.0, i % 2 ? tas : koyu), x, 0.1, 0));
      if (i < 5) {
        g.add(koy(yarimHalka(0.55, 0.14, tas), x + 0.8, 2.75, 0));
        g.add(koy(yarimHalka(0.55, 0.12, koyu), x + 0.8, 1.05, 0));
        g.add(koy(IZ.kutu(1.1, 0.22, 0.8, tas), x + 0.8, 1.6, 0));
      }
    }
    g.add(koy(IZ.kutu(8.6, 0.5, 1.0, tas), -1.3, 3.3, 0));
    g.add(koy(IZ.kutu(8.8, 0.12, 1.1, koyu), -1.3, 3.8, 0));
    g.add(koy(IZ.kutu(0.7, 0.4, 0.8, koyu), 4.4, 0.1, 0.6, 0.5));
    g.add(koy(IZ.kutu(0.5, 0.3, 0.6, tas), 3.9, 0.1, -0.9, 0.2));
    [[-4.2, 1.9, 1.0], [-1.6, -2.0, 0.9], [3.2, 2.0, 1.0], [-3.4, -1.9, 0.8]].forEach(([x, z, s], i) => agac(g, x, z, s, i % 2 ? '#6fb15c' : '#4f9450'));
    // Su yolu korkulukları, yıkık uç, kemer üstünde otlar
    for (const dz of [-0.46, 0.46]) g.add(koy(IZ.kutu(8.6, 0.16, 0.12, koyu), -1.3, 3.92, dz));
    g.add(koy(IZ.kutu(0.5, 0.3, 0.9, tas), 3.2, 3.3, 0));
    g.add(koy(IZ.kutu(0.4, 0.5, 0.8, koyu), 4.8, 2.0, 0));
    for (const [x, z] of [[-4.6, 0.3], [-2.2, -0.3], [0.4, 0.3], [2.4, -0.2]]) g.add(koy(IZ.kure(0.18, '#6fa052'), x, 4.05, z));
    // Dere: taşlar, sazlar, yaya köprüsü
    for (const [x, z] of [[0.5, 1.6], [1.1, -1.3], [0.8, 2.4], [1.0, -2.3]]) g.add(koy(IZ.kure(0.14, '#9a9488'), x, 0.14, z));
    for (const z of [-2.4, -1.6, 1.2, 2.5]) for (const x of [-0.1, 1.7]) g.add(koy(IZ.koni(0.07, 0.55, 4, '#9aa85a'), x, 0.1, z));
    g.add(koy(IZ.kutu(2.2, 0.08, 0.5, '#a8824f'), 0.8, 0.22, 1.9));
    // Çoban ve koyunlar, çalılar, bilgi panosu
    kisi(g, -1.4, 0.1, 2.0, '#7a5a40');
    g.add(koy(IZ.silindir(0.02, 0.02, 0.8, 4, '#6b4a33'), -1.2, 0.1, 2.0));
    for (const [x, z] of [[-2.6, 1.6], [-3.1, 2.2], [-2.0, 2.3]]) {
      const k = IZ.kure(0.2, '#f4f0e6');
      k.scale.set(1.3, 0.9, 0.9);
      g.add(koy(k, x, 0.33, z));
      g.add(koy(IZ.kutu(0.12, 0.14, 0.12, '#3a2a1e'), x + 0.27, 0.34, z));
    }
    for (const [x, z] of [[2.2, 1.3], [-3.0, -0.9], [3.9, -1.9]]) g.add(koy(IZ.kure(0.3, '#5a9148'), x, 0.3, z));
    g.add(koy(IZ.silindir(0.035, 0.035, 0.7, 4, '#6d747a'), 4.6, 0.1, -2.2));
    g.add(koy(IZ.kutu(0.7, 0.4, 0.05, '#36546d'), 4.6, 0.7, -2.2, -0.4));
    return g;
  }

  // ---------- Hasanağa Bahçesi ----------
  function hasanaga() {
    const g = new THREE.Group();
    const tas = '#d6cfc0';
    g.add(IZ.kutu(9.6, 0.1, 8.6, '#8fc070'));
    g.add(koy(IZ.kutu(1.0, 0.03, 8.6, '#e6dcc2'), 0, 0.1, 0));
    g.add(koy(IZ.kutu(9.6, 0.03, 0.9, '#e6dcc2'), 0, 0.1, 0.4));
    // Giriş kapısı
    for (const x of [-1.0, 1.0]) g.add(koy(IZ.kutu(0.45, 2.0, 0.45, '#efe4cc'), x, 0.1, -4.1));
    g.add(koy(yarimHalka(1.0, 0.16, '#efe4cc'), 0, 2.0, -4.1));
    // Amfi tiyatro
    [2.2, 1.7, 1.2].forEach((r, i) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.25 * (3 - i), 12, 1, false, Math.PI / 2, Math.PI).translate(0, 0.125 * (3 - i), 0), IZ.mat(i % 2 ? '#e3ded2' : tas));
      m.castShadow = true; m.receiveShadow = true;
      g.add(koy(m, 2.6, 0.1 + 0, 2.9));
    });
    g.add(koy(IZ.kutu(2.4, 0.2, 0.9, '#8a6a4a'), 2.6, 0.1, 3.5));
    // Çay bahçesi
    [[-3.4, -2.4, '#d2452f'], [-1.9, -3.0, '#e0a93b'], [-3.2, -0.9, '#3d6fa8'], [-1.7, -1.5, '#2f8f7f']].forEach(([x, z, renk]) => {
      g.add(koy(IZ.silindir(0.3, 0.3, 0.06, 8, '#f4f4ef'), x, 0.5, z));
      g.add(koy(IZ.silindir(0.03, 0.03, 1.3, 4, '#6d747a'), x, 0.1, z));
      g.add(koy(IZ.koni(0.6, 0.35, 8, renk), x, 1.3, z));
    });
    g.add(koy(IZ.kutu(1.6, 1.1, 1.2, '#f1e6cc'), -3.6, 0.1, -3.6));
    g.add(koy(IZ.piramit(1.9, 0.6, 1.5, '#b24a33'), -3.6, 1.2, -3.6));
    // Süs havuzu
    g.add(koy(IZ.silindir(1.0, 1.1, 0.25, 10, tas), -2.8, 0.1, 2.6));
    g.add(koy(IZ.silindir(0.85, 0.85, 0.05, 10, '#4aa9d8', { puruz: 0.4 }), -2.8, 0.33, 2.6));
    g.add(koy(IZ.koni(0.1, 0.6, 5, '#cfeaf5'), -2.8, 0.35, 2.6));
    [[3.9, -3.4, 1.4], [2.2, -2.2, 1.2], [4.0, -1.0, 1.1], [-4.2, 1.2, 1.2], [-1.0, 3.6, 1.1], [0.9, -3.2, 1.0], [4.3, 1.2, 1.0], [-4.3, 3.8, 1.0]]
      .forEach(([x, z, s], i) => agac(g, x, z, s, ['#5fa052', '#4f9450', '#6fb15c'][i % 3]));
    // Kapı tabelası ve fenerler, çit bordürü
    g.add(koy(IZ.kutu(1.3, 0.28, 0.06, '#2b3a4a'), 0, 2.2, -4.1));
    lamba(g, -1.6, 0.1, -4.0, 1.5);
    lamba(g, 1.6, 0.1, -4.0, 1.5);
    g.add(koy(IZ.kutu(9.6, 0.3, 0.2, '#3f7a4a'), 0, 0.1, 4.2));
    for (const sx of [-1, 1]) {
      g.add(koy(IZ.kutu(0.2, 0.3, 8.6, '#3f7a4a'), sx * 4.7, 0.1, 0));
      g.add(koy(IZ.kutu(3.2, 0.3, 0.2, '#3f7a4a'), sx * 3.1, 0.1, -4.2));
    }
    // Yol boyu çiçek tarhları, büst, süs havuzu fıskiyeleri
    for (const z of [-3.0, -1.7]) for (const sx of [-1, 1]) cicekTarhi(g, sx * 0.85, 0.1, z, 0.3, 0.9, ['#d2452f', '#f2c94c', '#ffffff']);
    cicekTarhi(g, -0.85, 0.1, 1.7, 0.3, 0.9, ['#c2478f', '#ffffff']);
    cicekTarhi(g, -0.85, 0.1, 3.0, 0.3, 0.9, ['#f2c94c', '#d2452f']);
    const tunc = { metal: 0.45, puruz: 0.55 };
    g.add(koy(IZ.kutu(0.36, 0.8, 0.36, tas), 1.0, 0.1, -0.6));
    g.add(koy(IZ.kutu(0.4, 0.22, 0.24, '#6f5d3c', tunc), 1.0, 0.9, -0.6));
    g.add(koy(IZ.kure(0.16, '#6f5d3c', tunc), 1.0, 1.26, -0.6));
    for (let i = 0; i < 4; i++) g.add(koy(IZ.koni(0.05, 0.3, 4, '#cfeaf5'), -2.8 + Math.cos(i * 1.57) * 0.55, 0.35, 2.6 + Math.sin(i * 1.57) * 0.55));
    // Salıncak, çay ocağı penceresi, sahnedekiler ve parktakiler
    for (const x of [2.5, 3.5]) g.add(koy(IZ.silindir(0.04, 0.04, 1.3, 4, '#2f7fd1'), x, 0.1, -0.6));
    g.add(koy(IZ.kutu(1.1, 0.06, 0.06, '#2f7fd1'), 3.0, 1.4, -0.6));
    for (const x of [2.8, 3.2]) {
      g.add(koy(IZ.kutu(0.02, 0.8, 0.02, '#555555'), x, 0.55, -0.6));
      g.add(koy(IZ.kutu(0.24, 0.05, 0.18, '#e0a93b'), x, 0.5, -0.6));
    }
    g.add(koy(IZ.kutu(1.0, 0.4, 0.06, '#36546d', { isik: '#ffd27a' }), -3.6, 0.5, -2.98));
    kisi(g, 2.3, 0.3, 3.5, '#c2478f');
    kisi(g, 2.9, 0.3, 3.5, '#3d6fa8');
    kisi(g, -2.5, 0.1, -2.2, '#e0a93b');
    kisi(g, 0.1, 0.13, 2.2, '#2f8f7f');
    kisi(g, -1.2, 0.13, 0.4, '#8e5bb5');
    return g;
  }

  // ---------- Şirinyer Hipodromu ----------
  function hipodrom() {
    const g = new THREE.Group();
    const beyaz = '#f4f4ef';
    const oval = (r, h, renk, sx, y) => { const m = IZ.silindir(r, r, h, 20, renk); m.scale.x = sx; m.castShadow = false; return koy(m, 0, y, 0.6); };
    g.add(oval(3.5, 0.08, '#d9c08a', 1.7, 0));
    g.add(oval(2.5, 0.05, '#7fbf63', 1.9, 0.08));
    for (const [r, sx] of [[3.45, 1.7], [2.55, 1.88]]) {
      const cit = new THREE.Mesh(new THREE.TorusGeometry(r, 0.035, 3, 28), IZ.mat(beyaz));
      cit.rotation.x = Math.PI / 2;
      cit.scale.x = sx;
      g.add(koy(cit, 0, 0.32, 0.6));
    }
    g.add(koy(IZ.silindir(0.8, 0.8, 0.04, 10, '#4aa9d8', { puruz: 0.4 }), 1.6, 0.13, 0.6));
    // Tribün
    for (let i = 0; i < 4; i++) g.add(koy(IZ.kutu(6.4, 0.45 + i * 0.45, 0.6, i % 2 ? '#c9d2d8' : '#aeb7bc'), 0, 0, -3.6 - i * 0.6));
    for (const x of [-3.0, 0, 3.0]) g.add(koy(IZ.silindir(0.07, 0.07, 3.4, 5, '#6d747a'), x, 0, -5.7));
    const cati = IZ.kutu(6.8, 0.12, 3.0, '#f2f5f7');
    cati.rotation.x = -0.12;
    g.add(koy(cati, 0, 3.3, -4.5));
    g.add(koy(IZ.kutu(6.4, 0.5, 0.1, '#36546d', { isik: '#ffd27a' }), 0, 2.0, -5.75));
    // Atlar ve jokeyler
    const atlar = [['#6b4a33', '#d2452f', 2.85], ['#3a2a1e', '#e0a93b', 3.05], ['#8a6a4a', '#3d6fa8', 2.95], ['#5a3b2a', '#2f8f7f', 3.15]].map(([renk, forma, r], i) => {
      const a = new THREE.Group();
      a.add(koy(IZ.kutu(0.55, 0.22, 0.18, renk), 0, 0.35, 0));
      for (const dx of [-0.2, 0.2]) a.add(koy(IZ.kutu(0.06, 0.3, 0.14, renk), dx, 0.08, 0));
      a.add(koy(IZ.kutu(0.14, 0.3, 0.14, renk), -0.3, 0.5, 0));
      a.add(koy(IZ.kutu(0.16, 0.22, 0.16, forma), 0.02, 0.57, 0));
      a.add(koy(IZ.kure(0.09, '#f4f4ef'), 0.02, 0.87, 0));
      a.userData.canli = true;
      g.add(a);
      return { a, r, faz: -i * 0.09 };
    });
    // Atlar pisti dolanır; başları yerel -x yönündedir
    g.userData.guncelle = (t) => {
      atlar.forEach((o) => {
        const aci = t * 0.55 + o.faz + Math.sin(t * 0.3 + o.r * 9) * 0.05;
        const sx = o.r * 1.75;
        o.a.position.set(Math.cos(aci) * sx, 0, 0.6 + Math.sin(aci) * o.r);
        o.a.rotation.y = Math.atan2(Math.cos(aci) * o.r, Math.sin(aci) * sx);
        o.a.position.y = Math.abs(Math.sin(t * 9 + o.r * 5)) * 0.06;
      });
    };
    g.userData.guncelle(0);
    // Ahırlar
    g.add(koy(IZ.kutu(2.6, 0.9, 1.0, '#efe4cc'), 5.0, 0, -3.9));
    const ac = IZ.besikCati(1.2, 0.5, 2.8, '#b24a33');
    ac.rotation.y = Math.PI / 2;
    g.add(koy(ac, 5.0, 0.9, -3.9));
    bayrak(g, -3.9, -3.4, 3.2);
    agac(g, -5.0, -3.6, 0.9);
    // Tribündeki seyirciler
    const seyirci = ['#d2452f', '#3d6fa8', '#e0a93b', '#f4f4ef', '#2f8f7f', '#c2478f'];
    for (let i = 0; i < 4; i++) for (let k = 0; k < 9; k++) {
      if ((i * 5 + k * 3) % 4 === 0) continue;
      g.add(koy(IZ.kure(0.1, seyirci[(i * 2 + k) % 6]), -2.8 + k * 0.7, 0.55 + i * 0.45, -3.6 - i * 0.6));
    }
    // Çatı bayrakları, bitiş direği
    seyirci.slice(0, 5).forEach((r, i) => {
      g.add(koy(IZ.silindir(0.02, 0.02, 0.7, 3, '#dddddd'), -2.8 + i * 1.4, 3.42, -5.6));
      g.add(koy(IZ.kutu(0.36, 0.22, 0.02, r), -2.6 + i * 1.4, 3.9, -5.6));
    });
    g.add(koy(IZ.silindir(0.035, 0.035, 1.6, 4, '#ffffff'), 0, 0.08, -3.05));
    g.add(koy(alinlik(0.2, '#d2452f'), 0, 1.7, -3.09));
    // Orta alan: skor tabelası, start kapanı, çalılar
    for (const x of [-2.0, -0.4]) g.add(koy(IZ.silindir(0.05, 0.05, 0.7, 4, '#6d747a'), x, 0.13, 1.7));
    g.add(koy(IZ.kutu(2.0, 1.0, 0.15, '#1d2a36'), -1.2, 0.8, 1.7));
    for (const y of [1.0, 1.3, 1.6]) g.add(koy(IZ.kutu(1.6, 0.12, 0.17, '#ffd27a', { isik: '#ffd27a', guc: 1.4 }), -1.2, y, 1.7));
    g.add(koy(IZ.kutu(0.3, 0.1, 1.5, '#3d8b7d'), -2.9, 0.75, 0.3));
    for (let i = 0; i < 5; i++) g.add(koy(IZ.kutu(0.3, 0.65, 0.05, '#3d8b7d'), -2.9, 0.13, -0.4 + i * 0.35));
    for (const [x, z] of [[0.4, 0.2], [3.0, 1.4], [2.6, -0.4], [-0.6, -0.5]]) g.add(koy(IZ.kure(0.25, '#5a9148'), x, 0.3, z));
    // Padok: gezdirilen at ve seyis
    g.add(koy(IZ.kutu(0.5, 0.2, 0.17, '#6b4a33'), 5.0, 0.32, -2.4));
    for (const dx of [-0.18, 0.18]) g.add(koy(IZ.kutu(0.06, 0.3, 0.13, '#6b4a33'), 5.0 + dx, 0.05, -2.4));
    g.add(koy(IZ.kutu(0.13, 0.28, 0.13, '#6b4a33'), 4.72, 0.46, -2.4));
    kisi(g, 4.4, 0, -2.4, '#3d6fa8');
    return g;
  }

  // ---------- Buca Gölet ----------
  function bucaGolet() {
    const g = new THREE.Group();
    const su = '#4aa9d8', ahsap = '#a8824f';
    g.add(IZ.silindir(5.3, 5.5, 0.1, 14, '#8fc070'));
    g.add(koy(IZ.silindir(4.0, 4.0, 0.03, 14, '#e6dcc2'), 0, 0.1, 0));
    const g1 = IZ.silindir(3.0, 3.0, 0.06, 14, su, { puruz: 0.4 });
    g1.scale.x = 1.2;
    g.add(koy(g1, -0.2, 0.12, 0.2));
    g.add(koy(IZ.silindir(1.6, 1.6, 0.06, 10, su, { puruz: 0.4 }), 2.4, 0.12, -1.6));
    // Adacık
    g.add(koy(IZ.silindir(0.7, 0.9, 0.25, 8, '#86b86a'), -0.8, 0.15, 0.6));
    g.add(koy(IZ.silindir(0.07, 0.1, 0.7, 5, '#8a6a4a'), -0.8, 0.4, 0.6));
    g.add(koy(IZ.kure(0.6, '#4f9450'), -0.8, 1.4, 0.6));
    // Fıskiye, iskele, su bisikletleri ve kuğular
    g.add(koy(IZ.koni(0.16, 1.3, 5, '#e8f6fb'), 1.3, 0.18, 1.0));
    g.add(koy(IZ.kutu(0.6, 0.1, 2.0, ahsap), -2.6, 0.22, 2.6, 0.6));
    [[-2.2, -0.9, '#e0a93b'], [0.6, -1.3, '#d2452f'], [0.4, 2.0, '#c2478f']].forEach(([x, z, renk], i) => {
      g.add(koy(IZ.kutu(0.6, 0.18, 0.4, renk), x, 0.18, z, i * 0.9));
      g.add(koy(IZ.kutu(0.3, 0.2, 0.36, '#f4f4ef'), x, 0.36, z, i * 0.9));
    });
    [[2.6, -1.6], [2.0, -2.2]].forEach(([x, z]) => {
      g.add(koy(IZ.kure(0.17, '#ffffff'), x, 0.25, z));
      g.add(koy(IZ.kutu(0.05, 0.3, 0.05, '#ffffff'), x + 0.14, 0.25, z));
    });
    // Kafe
    g.add(koy(IZ.kutu(1.8, 1.1, 1.3, '#f1e6cc'), 3.6, 0.1, 2.6));
    g.add(koy(IZ.kutu(1.84, 0.5, 1.0, '#36546d', { isik: '#ffd27a' }), 3.6, 0.4, 2.6));
    g.add(koy(IZ.piramit(2.2, 0.6, 1.7, '#b24a33'), 3.6, 1.2, 2.6));
    [[-4.4, -1.6, 1.1], [-3.6, -3.2, 1.0], [-1.0, -4.5, 1.1], [1.6, -4.4, 0.9], [4.5, -0.2, 1.0], [-4.5, 1.2, 1.0], [-1.6, 4.4, 1.1], [1.4, 4.5, 0.9]]
      .forEach(([x, z, s], i) => (i % 3 ? agac(g, x, z, s, i % 2 ? '#6fb15c' : '#4f9450') : cam(g, x, z, s)));
    // Amfi basamakları ve seyir terası
    for (let i = 0; i < 3; i++) g.add(koy(IZ.kutu(1.8, 0.15 * (i + 1), 0.3, i % 2 ? '#e3ded2' : '#d6cfc0'), -0.1, 0.1, 3.95 + i * 0.3));
    g.add(koy(IZ.kutu(1.4, 0.08, 0.9, ahsap), 2.4, 0.2, -3.3));
    g.add(koy(IZ.kutu(1.4, 0.04, 0.04, '#7a5a40'), 2.4, 0.65, -2.88));
    for (const x of [1.75, 2.4, 3.05]) g.add(koy(IZ.silindir(0.025, 0.025, 0.4, 4, '#7a5a40'), x, 0.26, -2.88));
    // Ördekler, nilüferler, sazlar, ek fıskiyeler
    for (const [x, z] of [[-1.9, 1.3], [-2.3, 0.7], [0.9, 0.4]]) {
      const o = IZ.kure(0.1, '#ffffff');
      o.scale.set(1.3, 0.8, 0.9);
      g.add(koy(o, x, 0.24, z));
      g.add(koy(IZ.kure(0.045, '#f0b429'), x + 0.13, 0.31, z));
    }
    for (const [x, z] of [[-2.6, -0.6], [1.9, 1.8], [-0.2, -2.0]]) {
      g.add(koy(golgesiz(IZ.silindir(0.17, 0.17, 0.02, 6, '#5a9a4a')), x, 0.185, z));
      g.add(koy(IZ.kure(0.055, '#f2a0c0'), x, 0.23, z));
    }
    for (let a = 2.6; a < 3.7; a += 0.16) g.add(koy(IZ.koni(0.06, 0.5, 4, '#9aa85a'), -0.2 + Math.cos(a) * 3.65, 0.12, 0.2 + Math.sin(a) * 3.05));
    for (const d of [-0.45, 0.45]) g.add(koy(IZ.koni(0.09, 0.7, 4, '#e8f6fb'), 1.3 + d, 0.18, 1.0 + d * 0.5));
    // Lambalar ve gezenler
    for (const a of [0.75, 2.3, 3.9, 5.5]) lamba(g, Math.cos(a) * 4.3, 0.1, Math.sin(a) * 4.3, 1.4);
    kisi(g, 3.95, 0.13, 0.9, '#c2478f');
    kisi(g, -0.5, 0.13, -3.8, '#3d6fa8');
    kisi(g, -0.3, 0.4, 4.3, '#e0a93b');
    kisi(g, 2.4, 0.28, -3.4, '#2f8f7f');
    return g;
  }

  // ---------- Çiğli, Gaziemir, Karabağlar için ortak parçalar ----------
  function golgesiz(m) { m.castShadow = false; return m; }
  // Ekseni x boyunca uzanan basık tonoz çatı (orijin merkezde)
  function tonoz(uzunluk, r, basiklik, renk) {
    const geo = new THREE.CylinderGeometry(r, r, uzunluk, 12);
    geo.rotateZ(Math.PI / 2);
    geo.scale(1, basiklik, 1);
    const m = new THREE.Mesh(geo, IZ.mat(renk));
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }
  // Önü yerel +x yönündedir
  function flamingo(g, x, y, z, s, ry) {
    const f = new THREE.Group(), pembe = '#f29ab0';
    for (const dz of [-0.05, 0.05]) f.add(koy(IZ.silindir(0.015, 0.015, 0.5, 4, '#e0708c'), 0, 0, dz));
    const govde = IZ.kure(0.2, pembe);
    govde.scale.set(1.3, 0.8, 0.8);
    f.add(koy(govde, 0, 0.6, 0));
    f.add(koy(IZ.kutu(0.06, 0.5, 0.06, pembe), 0.22, 0.62, 0));
    f.add(koy(IZ.kutu(0.16, 0.08, 0.07, '#f7b9c8'), 0.28, 1.08, 0));
    f.add(koy(IZ.kutu(0.07, 0.05, 0.05, '#2b2b2b'), 0.39, 1.06, 0));
    f.scale.setScalar(s);
    g.add(koy(f, x, y, z, ry));
  }
  function araba(g, x, z, renk, ry) {
    g.add(koy(IZ.kutu(0.6, 0.2, 0.3, renk), x, 0.12, z, ry));
    g.add(koy(IZ.kutu(0.32, 0.14, 0.26, '#2b3a4a'), x, 0.32, z, ry));
  }

  // ---------- İzmir Kuş Cenneti ----------
  // Orijin kıyı çizgisindedir: +z deniz (sığ lagün), -z kara.
  function kusCenneti() {
    const g = new THREE.Group();
    const ahsap = '#a8824f';
    g.add(koy(IZ.kutu(11, 0.12, 5.4, '#c5cc8c'), 0, 0, -2.7));
    // Sığ lagün ve tuzla setleri
    g.add(koy(IZ.kutu(11, 0.4, 6.0, '#cfc39a'), 0, -0.62, 3.0));
    [[-3.4, 1.9, 3.4, 2.6], [0.9, 1.7, 4.2, 2.2], [-2.2, 4.4, 4.6, 1.8], [3.0, 4.3, 4.0, 2.0]].forEach(([x, z, w, d], i) => {
      g.add(koy(golgesiz(IZ.kutu(w, 0.04, d, i % 2 ? '#8fd0d6' : '#a5dbd2', { puruz: 0.4 })), x, -0.22, z));
    });
    [[-3.9, 2.0, 0.3], [-3.1, 1.5, 2.1], [-2.5, 2.5, 4.0], [-4.4, 2.8, 1.2], [0.2, 1.5, 3.3], [1.3, 2.0, 0.8], [2.2, 1.4, 5.0],
      [-2.2, 4.3, 1.9], [-1.3, 4.8, 0.2], [-3.4, 4.7, 3.6], [3.1, 4.1, 2.6], [3.9, 4.7, 4.4], [2.3, 4.8, 1.0]]
      .forEach(([x, z, ry], i) => flamingo(g, x, -0.19, z, 0.75 + (i % 3) * 0.12, ry));
    // Pelikanlar
    [[4.6, 2.2], [4.9, 2.9]].forEach(([x, z]) => {
      const b = IZ.kure(0.2, '#fbfbf7');
      b.scale.set(1.3, 0.85, 0.9);
      g.add(koy(b, x, -0.02, z));
      g.add(koy(IZ.kutu(0.07, 0.28, 0.07, '#fbfbf7'), x + 0.2, 0.02, z));
      g.add(koy(IZ.kutu(0.26, 0.06, 0.07, '#e8a23a'), x + 0.34, 0.2, z));
    });
    // Sazlık
    for (let i = 0; i < 26; i++) {
      const x = -5.2 + i * 0.42, z = -0.35 - (i % 3) * 0.28;
      if (Math.abs(x - 3.4) < 0.5) continue;
      g.add(koy(IZ.koni(0.11, 0.7 + (i % 4) * 0.16, 4, i % 2 ? '#b7b56a' : '#9aa85a'), x, 0.1, z));
    }
    // Gözlem kulesi ve iskele yolu
    for (const dx of [-0.6, 0.6]) for (const dz of [-0.6, 0.6]) g.add(koy(IZ.silindir(0.07, 0.07, 3.0, 5, ahsap), 3.4 + dx, 0.1, -2.6 + dz));
    g.add(koy(IZ.kutu(1.7, 0.1, 1.7, ahsap), 3.4, 2.0, -2.6));
    for (const dz of [-0.8, 0.8]) g.add(koy(IZ.kutu(1.7, 0.4, 0.06, '#8a6a4a'), 3.4, 2.1, -2.6 + dz));
    for (const dx of [-0.8, 0.8]) g.add(koy(IZ.kutu(0.06, 0.4, 1.7, '#8a6a4a'), 3.4 + dx, 2.1, -2.6));
    g.add(koy(IZ.piramit(2.2, 0.7, 2.2, '#8a6a4a'), 3.4, 3.1, -2.6));
    g.add(koy(IZ.kutu(0.6, 0.08, 3.4, ahsap), 3.4, -0.1, 0.0));
    // Ziyaretçi merkezi
    g.add(koy(IZ.kutu(3.0, 1.2, 2.0, '#f1e6cc'), -2.6, 0.1, -3.4));
    g.add(koy(IZ.kutu(2.2, 0.5, 2.04, '#36546d', { isik: '#ffd27a' }), -2.6, 0.5, -3.4));
    const zc = IZ.besikCati(2.4, 0.7, 3.4, '#8a6a4a');
    zc.rotation.y = Math.PI / 2;
    g.add(koy(zc, -2.6, 1.3, -3.4));
    agac(g, -4.8, -4.4, 0.9, '#6fb15c');
    agac(g, 0.4, -4.6, 1.0, '#4f9450');
    agac(g, 1.6, -3.6, 0.8);
    // Lagün üstünde süzülen flamingolar
    const ucanlar = [0, 1, 2].map((i) => {
      const k = new THREE.Group();
      k.add(IZ.kutu(0.55, 0.05, 0.07, '#f7b9c8'));
      const kanat = [-1, 1].map((yon) => {
        const w = new THREE.Group();
        w.add(koy(IZ.kutu(0.14, 0.02, 0.42, '#f29ab0'), 0, 0.03, yon * 0.21));
        k.add(w);
        return w;
      });
      k.userData.canli = true;
      g.add(k);
      return { k, kanat, faz: i * 0.45 };
    });
    g.userData.guncelle = (t) => {
      ucanlar.forEach((o, i) => {
        const a = t * 0.45 - o.faz;
        o.k.position.set(Math.cos(a) * 3.8, 3.4 + i * 0.3 + Math.sin(t + i) * 0.2, 2.4 + Math.sin(a) * 2.6);
        o.k.rotation.y = Math.atan2(-Math.cos(a) * 2.6, -Math.sin(a) * 3.8);
        const c = Math.sin(t * 7 + i) * 0.5;
        o.kanat[0].rotation.x = -c;
        o.kanat[1].rotation.x = c;
      });
    };
    g.userData.guncelle(0);
    return g;
  }

  // ---------- İzmir Doğal Yaşam Parkı ----------
  function zurafa(g, x, z, s, ry) {
    const a = new THREE.Group(), r = '#e3b04b', k = '#a8702f';
    for (const dx of [-0.26, 0.26]) for (const dz of [-0.1, 0.1]) a.add(koy(IZ.kutu(0.08, 0.9, 0.08, r), dx, 0, dz));
    a.add(koy(IZ.kutu(0.75, 0.42, 0.32, r), 0, 0.85, 0));
    a.add(koy(IZ.kutu(0.3, 0.2, 0.34, k), -0.1, 1.0, 0));
    const boyun = IZ.kutu(0.16, 1.3, 0.16, r);
    boyun.rotation.z = -0.3;
    a.add(koy(boyun, 0.32, 1.15, 0));
    a.add(koy(IZ.kutu(0.1, 0.3, 0.17, k), 0.5, 1.7, 0));
    a.add(koy(IZ.kutu(0.34, 0.16, 0.16, r), 0.82, 2.34, 0));
    a.scale.setScalar(s);
    g.add(koy(a, x, 0.12, z, ry));
  }
  function fil(g, x, z, s, ry) {
    const a = new THREE.Group(), r = '#9aa0a6';
    for (const dx of [-0.32, 0.32]) for (const dz of [-0.18, 0.18]) a.add(koy(IZ.kutu(0.2, 0.5, 0.2, r), dx, 0, dz));
    a.add(koy(IZ.kutu(1.0, 0.6, 0.6, r), 0, 0.45, 0));
    a.add(koy(IZ.kutu(0.45, 0.5, 0.5, r), 0.62, 0.6, 0));
    for (const dz of [-0.31, 0.31]) a.add(koy(IZ.kutu(0.08, 0.4, 0.3, '#868c92'), 0.55, 0.66, dz));
    a.add(koy(IZ.kutu(0.12, 0.62, 0.12, r), 0.9, 0.08, 0));
    for (const dz of [-0.14, 0.14]) a.add(koy(IZ.kutu(0.22, 0.05, 0.05, '#fffdf5'), 0.93, 0.56, dz));
    a.scale.setScalar(s);
    g.add(koy(a, x, 0.12, z, ry));
  }
  function dogalYasam() {
    const g = new THREE.Group();
    const ahsap = '#a8824f';
    g.add(IZ.silindir(5.7, 5.9, 0.1, 14, '#9cc47e'));
    // Savan bölümü
    g.add(koy(golgesiz(IZ.silindir(2.7, 2.7, 0.03, 12, '#d9c88f')), -1.9, 0.1, -0.4));
    const cit = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.04, 3, 18), IZ.mat(ahsap));
    cit.rotation.x = Math.PI / 2;
    g.add(koy(cit, -1.9, 0.38, -0.4));
    zurafa(g, -2.8, -1.0, 1.0, 0.5);
    zurafa(g, -1.2, 0.5, 0.8, 2.6);
    agac(g, -3.4, 0.9, 1.2, '#7dbb62');
    agac(g, -0.6, -2.0, 1.0, '#6fb15c');
    // Filler
    g.add(koy(golgesiz(IZ.silindir(1.9, 1.9, 0.03, 10, '#cdbb8c')), 2.9, 0.1, -1.6));
    fil(g, 2.5, -1.9, 1.0, -0.5);
    fil(g, 3.6, -0.9, 0.62, 0.9);
    g.add(koy(golgesiz(IZ.silindir(0.6, 0.6, 0.04, 8, '#4aa9d8', { puruz: 0.4 })), 3.7, 0.12, -2.5));
    // Gölet ve flamingolar
    const golet = golgesiz(IZ.silindir(1.5, 1.5, 0.05, 12, '#4aa9d8', { puruz: 0.4 }));
    golet.scale.x = 1.3;
    g.add(koy(golet, 2.2, 0.1, 2.6));
    flamingo(g, 1.6, 0.14, 2.3, 0.8, 0.4);
    flamingo(g, 2.4, 0.14, 3.0, 0.9, 2.2);
    flamingo(g, 3.0, 0.14, 2.2, 0.75, 4.0);
    // Sazdan çatılı barınaklar
    [[-0.4, -4.0, 0.8], [0.9, 0.5, 0.65]].forEach(([x, z, r]) => {
      g.add(koy(IZ.silindir(r, r, 0.8, 8, '#e6d3a8'), x, 0.1, z));
      g.add(koy(IZ.koni(r * 1.45, 0.9, 8, '#b08d57'), x, 0.9, z));
    });
    // Giriş kapısı (güneyde)
    for (const dx of [-1.0, 1.0]) g.add(koy(IZ.kutu(0.3, 1.9, 0.3, ahsap), -1.4 + dx, 0.1, 4.7));
    g.add(koy(IZ.kutu(2.8, 0.4, 0.34, '#8a6a4a'), -1.4, 1.9, 4.7));
    g.add(koy(IZ.kutu(1.8, 0.24, 0.38, '#f6e3a9'), -1.4, 1.98, 4.7));
    g.add(koy(golgesiz(IZ.kutu(0.9, 0.03, 3.4, '#e6dcc2')), -1.4, 0.1, 3.4));
    [[-4.6, -2.4, 1.0], [-4.9, 1.6, 1.1], [-3.4, 3.6, 0.9], [0.4, 4.6, 1.0], [4.6, 1.0, 1.0], [4.9, -1.2, 0.9], [1.6, -4.6, 1.1], [-2.6, -4.4, 0.9]]
      .forEach(([x, z, s], i) => (i % 3 === 1 ? cam(g, x, z, s) : agac(g, x, z, s, i % 2 ? '#6fb15c' : '#4f9450')));
    return g;
  }

  // ---------- İzmir Atatürk Organize Sanayi Bölgesi ----------
  function aosb() {
    const g = new THREE.Group();
    const camR = '#36546d';
    g.add(IZ.kutu(11.4, 0.1, 9.8, '#cfcabc'));
    g.add(koy(golgesiz(IZ.kutu(11.4, 0.03, 1.0, '#8a8e95')), 0, 0.1, 0.5));
    // Testere dişi çatılı fabrika holleri
    function fabrika(x, z, w, d, renk, n) {
      g.add(koy(IZ.kutu(w, 1.5, d, renk), x, 0.1, z));
      g.add(koy(IZ.kutu(w * 0.8, 0.4, d + 0.04, camR, { isik: '#ffd27a' }), x, 0.85, z));
      for (let i = 0; i < n; i++) g.add(koy(IZ.besikCati(w / n, 0.55, d, '#8f9ba3'), x - w / 2 + ((i + 0.5) * w) / n, 1.6, z));
    }
    fabrika(-2.7, -2.5, 5.2, 3.6, '#e9e4d6', 4);
    fabrika(3.2, -2.8, 3.6, 3.0, '#dfe6ea', 3);
    fabrika(-3.0, 3.0, 4.4, 2.8, '#f1e6cc', 3);
    // Baca
    g.add(koy(IZ.silindir(0.2, 0.3, 4.4, 8, '#b9553a'), 0.7, 0.1, -3.6));
    g.add(koy(IZ.silindir(0.22, 0.22, 0.3, 8, '#f4f4ef'), 0.7, 3.9, -3.6));
    // Silolar
    for (const x of [1.4, 2.6, 3.8]) {
      g.add(koy(IZ.silindir(0.52, 0.52, 2.3, 10, '#d9dde0', { puruz: 0.5 }), x, 0.1, 2.4));
      g.add(koy(IZ.koni(0.54, 0.4, 10, '#b9c0c5'), x, 2.4, 2.4));
    }
    g.add(koy(IZ.kutu(3.4, 0.08, 0.1, '#6d747a'), 2.6, 2.75, 2.4));
    // Su kulesi
    for (const dx of [-0.3, 0.3]) for (const dz of [-0.3, 0.3]) g.add(koy(IZ.silindir(0.04, 0.04, 2.4, 4, '#6d747a'), 4.9 + dx, 0.1, 3.9 + dz));
    g.add(koy(IZ.silindir(0.6, 0.45, 0.8, 8, '#4a90b8'), 4.9, 2.4, 3.9));
    // Kamyonlar
    [[-1.6, 0.35, '#d2452f', 0], [2.8, 0.7, '#2f7fd1', Math.PI]].forEach(([x, z, renk, ry]) => {
      const k = new THREE.Group();
      k.add(koy(IZ.kutu(1.0, 0.5, 0.44, '#f4f4ef'), -0.2, 0.12, 0));
      k.add(koy(IZ.kutu(0.34, 0.42, 0.44, renk), 0.52, 0.12, 0));
      g.add(koy(k, x, 0.1, z, ry));
    });
    bayrak(g, -5.0, 1.4, 2.8);
    agac(g, 5.0, 1.4, 0.8);
    agac(g, 0.2, 4.2, 0.9, '#6fb15c');
    agac(g, -5.1, -4.4, 0.8, '#4f9450');
    // Bacadan çıkan duman
    const dumanlar = [0, 1, 2].map(() => {
      const d = golgesiz(IZ.kure(0.34, '#f2f2f2'));
      d.userData.canli = true;
      g.add(d);
      return d;
    });
    g.userData.guncelle = (t) => {
      dumanlar.forEach((d, i) => {
        const u = (t * 0.22 + i / 3) % 1;
        d.position.set(0.7 + u * 1.1, 4.6 + u * 2.4, -3.6);
        d.scale.setScalar((0.5 + u * 0.9) * (u > 0.75 ? (1 - u) / 0.25 : 1) + 0.001);
      });
    };
    g.userData.guncelle(0);
    return g;
  }

  // ---------- Adnan Menderes Havalimanı ----------
  // Önü yerel +x yönündedir.
  function ucakModeli(renk) {
    const u = new THREE.Group(), beyaz = '#f7f9fa';
    const govde = IZ.silindir(0.2, 0.2, 2.2, 8, beyaz);
    govde.rotation.z = -Math.PI / 2;
    u.add(koy(govde, -1.1, 0.45, 0));
    const burun = IZ.koni(0.2, 0.45, 8, beyaz);
    burun.rotation.z = -Math.PI / 2;
    u.add(koy(burun, 1.1, 0.45, 0));
    const kuyruk = IZ.koni(0.2, 0.6, 8, beyaz);
    kuyruk.rotation.z = Math.PI / 2;
    u.add(koy(kuyruk, -1.1, 0.45, 0));
    u.add(koy(IZ.kutu(0.55, 0.05, 2.7, '#e4e9ec'), -0.05, 0.36, 0));
    u.add(koy(IZ.kutu(0.3, 0.04, 0.95, '#e4e9ec'), -1.35, 0.5, 0));
    u.add(koy(IZ.kutu(0.42, 0.6, 0.05, renk), -1.35, 0.55, 0));
    for (const dz of [-0.62, 0.62]) {
      const m = IZ.silindir(0.09, 0.09, 0.36, 6, '#8f9ba3');
      m.rotation.z = -Math.PI / 2;
      u.add(koy(m, -0.1, 0.27, dz));
    }
    u.add(koy(IZ.kutu(1.5, 0.05, 0.41, '#36546d'), 0.15, 0.48, 0));
    return u;
  }
  function havalimani() {
    const g = new THREE.Group();
    const camR = '#36546d';
    g.add(IZ.kutu(19, 0.1, 12.4, '#b9c79a'));
    // Pist (güneyde, doğu-batı doğrultusunda)
    g.add(koy(golgesiz(IZ.kutu(18.4, 0.04, 1.7, '#5c6168')), 0, 0.1, 4.6));
    for (let x = -7.2; x <= 7.21; x += 1.6) g.add(koy(golgesiz(IZ.kutu(0.7, 0.02, 0.1, '#f4f4ef')), x, 0.14, 4.6));
    for (const x of [-8.5, 8.5]) for (const dz of [-0.56, -0.28, 0, 0.28, 0.56]) g.add(koy(golgesiz(IZ.kutu(0.6, 0.02, 0.12, '#f4f4ef')), x, 0.14, 4.6 + dz));
    // Taksi yolu ve apron
    g.add(koy(golgesiz(IZ.kutu(18.4, 0.03, 0.8, '#72777e')), 0, 0.1, 2.7));
    for (const x of [-8.2, 8.2]) g.add(koy(golgesiz(IZ.kutu(0.8, 0.03, 1.4, '#72777e')), x, 0.1, 3.5));
    g.add(koy(golgesiz(IZ.kutu(12.4, 0.03, 3.6, '#8a8e95')), -1.8, 0.1, 0.5));
    // Terminal
    g.add(koy(IZ.kutu(9.4, 1.5, 2.2, '#eef1f3'), -1.8, 0.1, -2.7));
    g.add(koy(IZ.kutu(9.44, 0.8, 2.24, camR, { isik: '#ffd27a' }), -1.8, 0.5, -2.7));
    g.add(koy(tonoz(9.7, 1.2, 0.42, '#f7f9fa'), -1.8, 1.58, -2.7));
    // Körükler
    for (const x of [-5.0, -1.8, 1.4]) {
      g.add(koy(IZ.kutu(0.34, 0.34, 1.5, '#dfe6ea'), x, 0.7, -0.9));
      g.add(koy(IZ.silindir(0.06, 0.06, 0.6, 5, '#6d747a'), x, 0.1, -0.3));
    }
    // Kontrol kulesi
    g.add(koy(IZ.silindir(0.28, 0.38, 3.7, 8, '#e9e4d6'), 5.3, 0.1, -2.9));
    g.add(koy(IZ.silindir(0.66, 0.46, 0.62, 8, camR, { isik: '#ffd27a' }), 5.3, 3.8, -2.9));
    g.add(koy(IZ.silindir(0.72, 0.72, 0.12, 8, '#f7f9fa'), 5.3, 4.42, -2.9));
    g.add(koy(IZ.silindir(0.03, 0.03, 0.9, 4, '#d2452f'), 5.3, 4.54, -2.9));
    // Otopark ve giriş yolu
    g.add(koy(golgesiz(IZ.kutu(10.4, 0.03, 1.5, '#8a8e95')), -1.8, 0.1, -5.0));
    ['#d2452f', '#f2f2ee', '#2f7fd1', '#f0b429', '#3f4a56', '#3d8b7d', '#ffffff'].forEach((renk, i) => araba(g, -5.6 + i * 1.25, -5.25 + (i % 2) * 0.5, renk, 0));
    // Hangar
    g.add(koy(IZ.kutu(2.8, 1.2, 2.4, '#c9d2d8'), 7.4, 0.1, 0.3));
    g.add(koy(tonoz(2.9, 1.3, 0.45, '#aeb7bc'), 7.4, 1.3, 0.3));
    g.add(koy(IZ.kutu(2.0, 0.9, 0.06, '#5c6168'), 7.4, 0.1, 1.5));
    // Park halindeki uçaklar (burunları terminale dönük)
    g.add(koy(ucakModeli('#d2452f'), -5.0, 0.1, 0.9, Math.PI / 2));
    g.add(koy(ucakModeli('#2f7fd1'), -1.8, 0.1, 0.9, Math.PI / 2));
    bayrak(g, 3.6, -4.2, 3.0);
    // Kalkış yapan uçak
    const kalkan = ucakModeli('#e0a93b');
    kalkan.userData.canli = true;
    g.add(kalkan);
    g.userData.guncelle = (t) => {
      const u = (t * 0.07) % 1;
      let x, y, egim = 0, s = Math.min(1, u / 0.03);
      if (u < 0.5) {
        const p = u / 0.5;
        x = -8 + 12 * p * p;
        y = 0.1;
      } else {
        const q = (u - 0.5) / 0.5;
        x = 4 + 24 * q;
        y = 0.1 + 9 * Math.pow(q, 1.4);
        egim = Math.min(0.32, q * 2.4);
        if (q > 0.8) s = (1 - q) / 0.2;
      }
      kalkan.position.set(x, y, 4.6);
      kalkan.rotation.z = egim;
      kalkan.scale.setScalar(s + 0.001);
    };
    g.userData.guncelle(0.5);
    return g;
  }

  // ---------- Fuar İzmir ----------
  function fuarIzmir() {
    const g = new THREE.Group();
    g.add(IZ.kutu(12.4, 0.1, 10.4, '#d9d5c8'));
    // Dört sergi holü ve ortada cam fuaye
    for (const x of [-3.7, 3.7]) for (const z of [-1.5, 2.5]) {
      g.add(koy(IZ.kutu(4.2, 1.5, 3.4, '#eef1f3'), x, 0.1, z));
      g.add(koy(IZ.kutu(4.24, 0.3, 3.44, '#2f7fd1'), x, 1.05, z));
      g.add(koy(tonoz(4.3, 1.72, 0.3, '#f7f9fa'), x, 1.6, z));
    }
    g.add(koy(IZ.kutu(2.6, 2.1, 8.0, '#9cc3d9', { isik: '#ffe9b0', puruz: 0.3 }), 0, 0.1, 0.5));
    g.add(koy(IZ.kutu(3.0, 0.12, 8.4, '#f7f9fa'), 0, 2.2, 0.5));
    for (let z = -2.9; z <= 3.91; z += 1.7) g.add(koy(IZ.kutu(2.66, 2.1, 0.12, '#f7f9fa'), 0, 0.1, z));
    // Giriş saçağı ve meydan (kuzeyde)
    g.add(koy(IZ.kutu(4.4, 0.12, 1.3, '#f7f9fa'), 0, 1.7, -4.1));
    for (const x of [-2.0, 2.0]) g.add(koy(IZ.silindir(0.07, 0.07, 1.6, 5, '#8f9ba3'), x, 0.1, -4.6));
    for (const x of [-4.6, -3.6, 3.6, 4.6]) bayrak(g, x, -4.6, 2.6);
    // Otopark
    g.add(koy(golgesiz(IZ.kutu(12, 0.03, 0.9, '#8a8e95')), 0, 0.1, 4.7));
    ['#d2452f', '#f2f2ee', '#2f7fd1', '#f0b429', '#3f4a56', '#3d8b7d', '#ffffff', '#8e5bb5', '#d2452f'].forEach((renk, i) => araba(g, -5.2 + i * 1.3, 4.7, renk, Math.PI / 2));
    agac(g, -5.6, -3.8, 0.8);
    agac(g, 5.6, -3.8, 0.8, '#6fb15c');
    return g;
  }

  // ---------- Ege Serbest Bölgesi ve Uzay Kampı ----------
  function serbestBolge() {
    const g = new THREE.Group();
    const camR = '#36546d', beyaz = '#f7f9fa';
    g.add(IZ.kutu(11.4, 0.1, 9.6, '#d4d0c2'));
    g.add(koy(golgesiz(IZ.kutu(11.4, 0.03, 0.9, '#8a8e95')), 0, 0.1, 0.9));
    // Üretim binaları
    [[-3.2, -2.6, 4.4, 3.0, '#e9eef1'], [2.3, -3.0, 3.6, 2.4, '#f1e6cc'], [-3.6, 3.4, 3.6, 2.0, '#dfe6ea']].forEach(([x, z, w, d, renk]) => {
      g.add(koy(IZ.kutu(w, 1.4, d, renk), x, 0.1, z));
      g.add(koy(IZ.kutu(w + 0.04, 0.28, d + 0.04, '#2f7fd1'), x, 1.2, z));
      g.add(koy(IZ.kutu(w * 0.8, 0.36, d + 0.06, camR, { isik: '#ffd27a' }), x, 0.6, z));
      g.add(koy(IZ.kutu(0.5, 0.25, 0.5, '#aeb7bc'), x + w * 0.25, 1.5, z));
    });
    // Uzay Kampı: kubbeli bina, roket ve mekik maketi
    g.add(koy(IZ.silindir(1.5, 1.5, 0.9, 12, beyaz), 3.2, 0.1, 3.2));
    g.add(koy(IZ.kure(1.5, '#dfe6ea', { puruz: 0.5 }, true), 3.2, 1.0, 3.2));
    g.add(koy(IZ.kutu(1.2, 0.7, 0.1, camR, { isik: '#ffd27a' }), 3.2, 0.1, 1.72));
    g.add(koy(IZ.silindir(0.5, 0.6, 0.2, 8, '#8f9ba3'), 0.4, 0.1, 3.3));
    g.add(koy(IZ.silindir(0.3, 0.3, 3.2, 8, beyaz), 0.4, 0.3, 3.3));
    g.add(koy(IZ.silindir(0.31, 0.31, 0.3, 8, '#d2452f'), 0.4, 1.6, 3.3));
    g.add(koy(IZ.silindir(0.31, 0.31, 0.2, 8, '#2b2b2b'), 0.4, 2.7, 3.3));
    g.add(koy(IZ.koni(0.3, 0.8, 8, '#d2452f'), 0.4, 3.5, 3.3));
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      g.add(koy(IZ.kutu(0.5, 0.7, 0.06, '#d2452f'), 0.4 + Math.cos(a) * 0.42, 0.3, 3.3 - Math.sin(a) * 0.42, a));
    }
    const mekik = new THREE.Group();
    const mg = IZ.silindir(0.24, 0.24, 1.5, 8, beyaz);
    mg.rotation.z = -Math.PI / 2;
    mekik.add(koy(mg, -0.75, 0.3, 0));
    const mb = IZ.koni(0.24, 0.45, 8, '#2b2b2b');
    mb.rotation.z = -Math.PI / 2;
    mekik.add(koy(mb, 0.75, 0.3, 0));
    mekik.add(koy(IZ.kutu(0.9, 0.05, 1.5, beyaz), -0.3, 0.2, 0));
    mekik.add(koy(IZ.kutu(0.4, 0.5, 0.05, beyaz), -0.6, 0.5, 0));
    g.add(koy(IZ.kutu(0.3, 0.5, 0.3, '#8f9ba3'), 5.0, 0.1, 0.0));
    g.add(koy(mekik, 5.0, 0.5, 0.0, 0.5));
    // Giriş kapısı ve konteynerler
    for (const dx of [-0.9, 0.9]) g.add(koy(IZ.kutu(0.24, 1.3, 0.24, '#8f9ba3'), -0.6 + dx, 0.1, -4.5));
    g.add(koy(IZ.kutu(2.3, 0.2, 0.5, '#2f7fd1'), -0.6, 1.4, -4.5));
    [['#d2452f', 0], ['#3d8b7d', 0.55], ['#e0a93b', 0.25]].forEach(([renk, k], i) => {
      g.add(koy(IZ.kutu(1.2, 0.5, 0.5, renk), -0.6 + k, 0.1 + (i === 2 ? 0.5 : 0), 3.4 + (i === 1 ? 0.6 : 0)));
    });
    bayrak(g, 1.2, -4.4, 2.8);
    agac(g, 5.0, -4.2, 0.8);
    agac(g, -5.2, 0.2, 0.8, '#6fb15c');
    agac(g, 5.1, 4.3, 0.7, '#4f9450');
    return g;
  }

  // ---------- Reşat Nuri Güntekin Çocuk Kütüphanesi ----------
  function guntekin() {
    const g = new THREE.Group();
    const tas = '#cdbf9f', ahsap = '#8a6a4a', cati = '#b24a33';
    g.add(IZ.kutu(8.6, 0.1, 8.6, '#9cc47e'));
    g.add(koy(golgesiz(IZ.kutu(1.0, 0.03, 4.2, '#e6dcc2')), 0, 0.1, 2.2));
    // İki katlı taş "kule" bağ evi
    g.add(koy(IZ.kutu(2.8, 3.2, 2.6, tas), 0, 0.1, -1.2));
    g.add(koy(IZ.kutu(2.86, 0.12, 2.66, '#b3a586'), 0, 1.6, -1.2));
    g.add(koy(IZ.piramit(3.4, 1.0, 3.2, cati), 0, 3.3, -1.2));
    g.add(koy(IZ.kutu(0.3, 0.6, 0.3, tas), 0.8, 3.7, -1.6));
    // Ahşap cumba ve kapı
    g.add(koy(IZ.kutu(1.5, 1.1, 0.6, '#a8824f'), 0, 1.9, 0.3));
    g.add(koy(IZ.kutu(1.2, 0.6, 0.64, '#36546d', { isik: '#ffd27a' }), 0, 2.2, 0.3));
    g.add(koy(IZ.kutu(1.7, 0.1, 0.8, cati), 0, 3.0, 0.3));
    for (const dx of [-0.6, 0.6]) g.add(koy(IZ.kutu(0.08, 1.8, 0.08, ahsap), dx, 0.1, 0.5));
    g.add(koy(IZ.kutu(0.7, 1.2, 0.08, ahsap), 0, 0.1, 0.12));
    for (const dx of [-1.0, 1.0]) g.add(koy(IZ.kutu(0.45, 0.6, 0.06, '#36546d', { isik: '#ffd27a' }), dx, 0.7, 0.12));
    for (const dz of [-1.8, -0.6]) for (const y of [0.7, 2.1]) for (const yon of [-1, 1]) g.add(koy(IZ.kutu(0.06, 0.6, 0.45, '#36546d', { isik: '#ffd27a' }), yon * 1.41, y, dz));
    // Asma çardağı
    for (const dx of [-0.9, 0.9]) for (const dz of [-0.8, 0.8]) g.add(koy(IZ.silindir(0.05, 0.05, 1.5, 4, ahsap), -2.8 + dx, 0.1, 1.4 + dz));
    g.add(koy(IZ.kutu(2.2, 0.14, 2.0, '#6fb15c'), -2.8, 1.6, 1.4));
    [[-3.3, 1.0], [-2.5, 1.8], [-2.9, 1.3]].forEach(([x, z]) => g.add(koy(IZ.kure(0.12, '#6b3a7a'), x, 1.5, z)));
    g.add(koy(IZ.kutu(1.0, 0.3, 0.3, ahsap), -2.8, 0.1, 1.4));
    // Çocuk parkı: kaydırak, salıncak ve kitap yığını
    g.add(koy(IZ.kutu(0.7, 1.0, 0.7, '#e0a93b'), 2.6, 0.1, 0.6));
    const kay = IZ.kutu(0.5, 0.06, 1.8, '#d2452f');
    kay.rotation.x = 0.55;
    g.add(koy(kay, 2.6, 0.55, 1.7));
    for (const dx of [-0.7, 0.7]) g.add(koy(IZ.silindir(0.04, 0.04, 1.4, 4, '#2f7fd1'), 2.8 + dx, 0.1, 3.4));
    g.add(koy(IZ.kutu(1.5, 0.06, 0.06, '#2f7fd1'), 2.8, 1.5, 3.4));
    g.add(koy(IZ.kutu(0.4, 0.05, 0.2, '#e0a93b'), 2.8, 0.55, 3.4));
    [['#c2478f', 0], ['#2f8f7f', 0.3], ['#e0a93b', -0.2]].forEach(([renk, ry], i) => g.add(koy(IZ.kutu(0.7, 0.16, 0.5, renk), -1.4, 0.1 + i * 0.16, 3.2, ry)));
    agac(g, -3.4, -2.8, 1.2, '#4f9450');
    agac(g, 3.2, -2.6, 1.1, '#6fb15c');
    agac(g, 3.6, -0.8, 0.8);
    cam(g, -3.6, -0.6, 1.0);
    return g;
  }

  // ---------- İzmir Demokrasi Üniversitesi ----------
  function demokrasiUni() {
    const g = new THREE.Group();
    const duvar = '#eef0ec', camR = '#36546d', vurgu = '#c2478f';
    g.add(IZ.kutu(10.4, 0.1, 9.4, '#a9cf8a'));
    g.add(koy(golgesiz(IZ.kutu(6.4, 0.03, 3.6, '#e6dcc2')), 0.4, 0.1, 2.2));
    // Ana blok ve kanat
    g.add(koy(IZ.kutu(7.0, 2.8, 2.2, duvar), 0, 0.1, -1.8));
    for (const y of [0.6, 1.4, 2.2]) g.add(koy(IZ.kutu(6.4, 0.4, 2.24, camR, { isik: '#ffd27a' }), 0, y, -1.8));
    g.add(koy(IZ.kutu(7.2, 0.14, 2.4, '#d9dde0'), 0, 2.9, -1.8));
    g.add(koy(IZ.kutu(2.2, 2.2, 3.8, duvar), -3.6, 0.1, 1.0));
    for (const y of [0.6, 1.4]) g.add(koy(IZ.kutu(2.24, 0.4, 3.2, camR, { isik: '#ffd27a' }), -3.6, y, 1.0));
    g.add(koy(IZ.kutu(2.4, 0.14, 4.0, '#d9dde0'), -3.6, 2.3, 1.0));
    // Cam giriş ve saçak
    g.add(koy(IZ.kutu(2.2, 3.3, 0.9, '#9cc3d9', { isik: '#ffe9b0', puruz: 0.3 }), 0.6, 0.1, -0.5));
    g.add(koy(IZ.kutu(2.8, 0.12, 1.4, vurgu), 0.6, 1.5, 0.3));
    for (const dx of [-1.2, 1.2]) g.add(koy(IZ.silindir(0.06, 0.06, 1.4, 5, '#8f9ba3'), 0.6 + dx, 0.1, 0.8));
    g.add(koy(IZ.kutu(1.6, 0.4, 0.1, vurgu), 0.6, 3.0, -0.02));
    // Basamaklı açık hava oturma alanı
    for (let i = 0; i < 3; i++) g.add(koy(IZ.kutu(3.0 - i * 0.5, 0.2 + i * 0.2, 0.5, i % 2 ? '#cfc6ae' : '#ded5bd'), 3.4, 0.1, 2.0 + i * 0.5));
    g.add(koy(IZ.silindir(0.5, 0.6, 0.3, 8, '#cfc6ae'), 0.6, 0.1, 2.6));
    g.add(koy(IZ.kutu(0.16, 1.2, 0.16, vurgu), 0.6, 0.4, 2.6, 0.5));
    bayrak(g, -1.6, 3.6, 3.0);
    [[-4.6, -3.8, 1.0], [4.6, -3.6, 1.1], [4.7, 0.2, 0.9], [-1.4, 4.0, 0.9], [2.2, 4.1, 1.0], [-4.6, 3.9, 0.9]]
      .forEach(([x, z, s], i) => agac(g, x, z, s, i % 2 ? '#6fb15c' : '#4f9450'));
    return g;
  }

  // ---------- Kavacık Köyü ve Bağları ----------
  function kavacik() {
    const g = new THREE.Group();
    const tas = '#bfb39a', cati = '#b24a33', mor = '#6b3a7a';
    g.add(IZ.kutu(11.0, 0.1, 9.6, '#b9c98a'));
    g.add(koy(golgesiz(IZ.kutu(0.9, 0.03, 9.6, '#d9cdaa')), -0.6, 0.1, 0));
    // Taş köy evleri
    [[-3.6, -3.2, 2.2, 1.5, 1.8, 0.1], [-3.2, -0.6, 1.9, 1.9, 1.6, -0.15], [-4.0, 1.9, 2.0, 1.3, 1.7, 0.2], [-2.6, 3.7, 1.7, 1.5, 1.5, 0]].forEach(([x, z, w, h, d, ry], i) => {
      const e = new THREE.Group();
      e.add(IZ.kutu(w, h, d, i % 2 ? '#cdbf9f' : tas));
      e.add(koy(IZ.kutu(w + 0.04, 0.12, d + 0.04, '#a3977e'), 0, h * 0.5, 0));
      const c = IZ.besikCati(d + 0.3, 0.6, w + 0.3, i % 2 ? cati : '#c0583c');
      c.rotation.y = Math.PI / 2;
      e.add(koy(c, 0, h, 0));
      e.add(koy(IZ.kutu(0.06, 0.7, 0.4, '#6b4a33'), w / 2, 0, 0));
      e.add(koy(IZ.kutu(0.06, 0.35, 0.35, '#36546d', { isik: '#ffd27a' }), w / 2, h * 0.62, d * 0.28));
      e.add(koy(IZ.kutu(0.25, 0.5, 0.25, tas), -w * 0.25, h + 0.25, 0));
      g.add(koy(e, x, 0.1, z, ry));
    });
    // Köy çeşmesi
    g.add(koy(IZ.kutu(0.9, 1.2, 0.4, '#a3977e'), -0.6, 0.1, -4.2));
    g.add(koy(IZ.kutu(0.9, 0.25, 0.5, '#8f8570'), -0.6, 0.1, -3.8));
    g.add(koy(golgesiz(IZ.kutu(0.7, 0.03, 0.34, '#4aa9d8', { puruz: 0.4 })), -0.6, 0.35, -3.8));
    // Bağ sıraları
    for (let i = 0; i < 6; i++) {
      const x = 1.0 + i * 0.85;
      g.add(koy(golgesiz(IZ.kutu(0.5, 0.04, 7.4, '#a98f6a')), x, 0.1, 0.4));
      for (let z = -3.0; z <= 3.81; z += 0.85) {
        g.add(koy(IZ.silindir(0.03, 0.03, 0.5, 4, '#7a5a40'), x, 0.1, z));
        g.add(koy(IZ.kure(0.3, (i + Math.round(z)) % 2 ? '#6fa052' : '#5a9148'), x, 0.72, z));
        if ((i * 3 + Math.round(z * 2)) % 3 === 0) g.add(koy(IZ.kure(0.11, mor), x + 0.2, 0.5, z + 0.1));
      }
    }
    // Üzüm sepetleri ve festival bayrakları
    [[0.2, 2.2], [0.3, 3.0]].forEach(([x, z]) => {
      g.add(koy(IZ.silindir(0.28, 0.2, 0.3, 7, '#a8824f'), x, 0.1, z));
      g.add(koy(IZ.kure(0.24, mor), x, 0.42, z));
    });
    for (const z of [-2.2, 1.0]) g.add(koy(IZ.silindir(0.04, 0.04, 2.2, 4, '#8a6a4a'), 0.1, 0.1, z));
    g.add(koy(IZ.kutu(0.03, 0.03, 3.2, '#8a6a4a'), 0.1, 2.25, -0.6));
    ['#d2452f', '#e0a93b', '#6b3a7a', '#2f8f7f', '#d2452f', '#e0a93b'].forEach((renk, i) => g.add(koy(IZ.kutu(0.04, 0.26, 0.26, renk), 0.1, 1.95, -1.9 + i * 0.52)));
    agac(g, -5.0, -1.8, 1.0, '#4f9450');
    agac(g, -4.9, 3.9, 1.1, '#6fb15c');
    cam(g, -5.0, 0.4, 1.0);
    cam(g, -1.9, -4.3, 0.9);
    return g;
  }

  IZ.yapilar = {
    'mistral': mistral,
    'ege-perla': egePerla,
    'serbest-bolge': serbestBolge,
    'guntekin': guntekin,
    'demokrasi-uni': demokrasiUni,
    'kavacik': kavacik,
    'kus-cenneti': kusCenneti,
    'dogal-yasam': dogalYasam,
    'aosb': aosb,
    'havalimani': havalimani,
    'fuar-izmir': fuarIzmir,
    'teleferik': teleferik,
    'balcova-termal': agamemnon,
    'deniz-muzesi': denizMuzesi,
    'yukarikoy': yukarikoy,
    'sahilevleri': sahilevleri,
    'su-kemerleri': suKemerleri,
    'hasanaga': hasanaga,
    'hipodrom': hipodrom,
    'buca-golet': bucaGolet,
    'karsiyaka-iskele': karsiyakaIskele,
    'zubeyde-hanim': zubeyde,
    'bostanli': bostanli,
    'latife-kosku': latifeKosku,
    'buyuk-park': buyukPark,
    'ege-universitesi': egeUniversitesi,
    'yesilova': yesilova,
    'homeros': homeros,
    'kemeralti': kemeralti,
    'hisar-camii': hisarCamii,
    'basmane-gari': basmaneGari,
    'elhamra': elhamra,
    'ataturk-muzesi': ataturkMuzesi,
    'havagazi': havagazi,
    'saat-kulesi': saatKulesi,
    'asansor': asansor,
    'konak-pier': konakPier,
    'yali-camii': yaliCamii,
    'kizlaragasi': kizlaragasi,
    'agora': agora,
    'kadifekale': kadifekale,
    'pasaport': pasaport,
    'polikarp': polikarp,
    'ataturk-aniti': ataturkAniti,
    'kulturpark': kulturpark,
    'cumhuriyet-agaci': cumhuriyetAgaci,
    'alsancak-gari': alsancakGari,
    'folkart': folkart
  };
})();
