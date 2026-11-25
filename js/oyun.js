// Oyunlar: "Neresi?" bulmacası ve martı uçuşu. Sahneye IZ.sahne üzerinden bağlanır.
(function () {
  const THREE = window.THREE, IZ = window.IZ, S = IZ.sahne;
  if (!S) return;
  const $ = (id) => document.getElementById(id);
  const kutu = $('oyun'), tuslar = $('ucusTuslari');

  // En iyi sonuçlar tarayıcıda saklanır; saklama kapalıysa oyun yine çalışır
  const rekor = {
    oku(ad) { try { return Number(localStorage.getItem('izmir-' + ad)) || 0; } catch (e) { return 0; } },
    yaz(ad, deger) { try { localStorage.setItem('izmir-' + ad, String(deger)); } catch (e) { /* yok say */ } }
  };
  const karistir = (dizi) => dizi.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((c) => c[1]);
  const sureYaz = (sn) => Math.floor(sn / 60) + ':' + String(Math.floor(sn % 60)).padStart(2, '0');

  let aktif = null; // çalışan oyunun temizleyicisi
  function bitir() {
    if (aktif) aktif();
    aktif = null;
    S.oyunAktif = false;
    S.tiklamaYakala = null;
    S.kareler.length = 0;
    document.body.classList.remove('oyun', 'ucus');
    kutu.hidden = true;
    kutu.innerHTML = '';
    tuslar.hidden = true;
    tuslar.innerHTML = '';
  }
  function hazirla(sinif) {
    bitir();
    S.turDurdur();
    S.kartiKapat();
    S.oyunAktif = true;
    document.body.classList.add(sinif);
    kutu.hidden = false;
  }

  // ---------- Menü ----------
  function menu() {
    if (!kutu.hidden && !S.oyunAktif) { bitir(); return; }
    bitir();
    kutu.hidden = false;
    kutu.innerHTML = '<div class="oyunUst"><b>Oyunlar</b><span></span><button id="oyunCik" aria-label="Kapat">×</button></div>' +
      '<button class="oyunSecenek" id="oyunNeresi"><b>Neresi?</b><small>İpucunu okuyun, haritada doğru yapıya tıklayın. 10 soru.</small></button>' +
      '<button class="oyunSecenek" id="oyunMarti"><b>Martı uçuşu</b><small>Körfezin üstünde uçun, yapıların tepesindeki 20 simidi toplayın.</small></button>' +
      '<button class="oyunSecenek" id="oyunKaptan"><b>Vapur kaptanı</b><small>Vapuru iskeleler arasında sürün, 3 dakikada en çok yolcuyu taşıyın.</small></button>';
    $('oyunCik').addEventListener('click', bitir);
    $('oyunNeresi').addEventListener('click', neresi);
    $('oyunMarti').addEventListener('click', marti);
    $('oyunKaptan').addEventListener('click', kaptan);
  }
  function sonEkrani(baslik, satirlar, tekrar) {
    S.tiklamaYakala = null;
    S.kareler.length = 0;
    kutu.innerHTML = '<div class="oyunUst"><b></b><span></span><button id="oyunCik" aria-label="Kapat">×</button></div>' +
      satirlar.map(() => '<p></p>').join('') + '<div class="oyunAlt"><button id="oyunTekrar">Tekrar oyna</button><button id="oyunMenu">Diğer oyun</button></div>';
    kutu.querySelector('b').textContent = baslik;
    kutu.querySelectorAll('p').forEach((p, i) => { p.textContent = satirlar[i]; });
    $('oyunCik').addEventListener('click', bitir);
    $('oyunTekrar').addEventListener('click', tekrar);
    $('oyunMenu').addEventListener('click', () => { bitir(); menu(); });
  }

  // ---------- Neresi? ----------
  // Açıklamadan yerin adını gizler ki ipucu cevabı ele vermesin
  function maskele(v) {
    let m = v.aciklama;
    v.ad.split(/[\s,()]+/).filter((k) => k.length > 3 && !/^(İzmir|Anıtı|Camii|Garı|Kulesi|Müzesi|Köyü|Parkı|Hanım|Tarihi)$/.test(k)).forEach((k) => { m = m.split(k).join('▢▢▢'); });
    return m;
  }
  function neresi() {
    hazirla('oyun');
    const SORU = 10, SURE = 60;
    const sira = karistir(S.yerler.map((y) => y.veri)).slice(0, SORU);
    let tur = -1, puan = 0, sure = 0, yanlis = 0, ipucu = 0, durum = 'soru', bekle = 0;
    kutu.innerHTML = '<div class="oyunUst"><b id="oyunBaslik"></b><span id="oyunPuan"></span><button id="oyunCik" aria-label="Oyundan çık">×</button></div>' +
      '<p id="oyunMetin"></p><p id="oyunIpucu"></p><div class="oyunAlt"><button id="oyunIpucuDugme">İpucu (−15 puan)</button><button id="oyunGec">Geç</button></div>';
    const metin = $('oyunMetin'), ipucuYazi = $('oyunIpucu');
    function ust() {
      $('oyunBaslik').textContent = 'Neresi? Soru ' + (tur + 1) + '/' + SORU;
      $('oyunPuan').textContent = puan + ' puan · ' + Math.max(0, Math.ceil(SURE - sure)) + ' sn';
    }
    function ipucuCiz() {
      const v = sira[tur];
      const parca = [];
      if (ipucu >= 1) parca.push(IZ.KATEGORILER[v.kategori].ad + ', ' + v.ilce + ' ilçesinde');
      if (ipucu >= 2) parca.push(v.semt + ', ' + v.yil);
      ipucuYazi.textContent = parca.join(' · ');
      $('oyunIpucuDugme').disabled = ipucu >= 2;
    }
    function soru() {
      tur++;
      if (tur >= sira.length) return son();
      sure = 0; yanlis = 0; ipucu = 0; durum = 'soru';
      S.kartiKapat();
      metin.className = '';
      metin.textContent = maskele(sira[tur]);
      ipucuCiz();
      ust();
    }
    function cevap(yazi, dogru) {
      durum = 'cevap';
      bekle = 3.4;
      metin.className = dogru ? 'dogru' : 'yanlis';
      metin.textContent = yazi;
      ipucuYazi.textContent = '';
      S.sec(sira[tur].id); // kamera doğru yere uçar (kart oyun sırasında gizlidir)
      ust();
    }
    function son() {
      const eski = rekor.oku('neresi');
      if (puan > eski) rekor.yaz('neresi', puan);
      S.kartiKapat();
      sonEkrani('Neresi? Bitti', ['Toplam ' + puan + ' puan (en çok ' + SORU * 100 + ').', puan > eski ? 'Yeni rekor!' + (eski ? ' Önceki: ' + eski + '.' : '') : 'En iyi sonucunuz: ' + eski + ' puan.'], neresi);
    }
    S.tiklamaYakala = (veri) => {
      if (durum !== 'soru' || !veri) return;
      const v = sira[tur];
      if (veri.id === v.id) {
        const k = Math.max(20, Math.round(100 - sure * 1.2 - yanlis * 15 - ipucu * 15));
        puan += k;
        cevap('Doğru: ' + v.ad + ' (+' + k + ' puan)', true);
      } else {
        yanlis++;
        ipucuYazi.textContent = 'Orası ' + veri.ad + '. Tekrar deneyin (−15 puan).';
      }
    };
    $('oyunCik').addEventListener('click', bitir);
    $('oyunIpucuDugme').addEventListener('click', () => { if (durum === 'soru' && ipucu < 2) { ipucu++; ipucuCiz(); } });
    $('oyunGec').addEventListener('click', () => { if (durum === 'soru') cevap('Geçildi. Cevap: ' + sira[tur].ad, false); });
    S.kareler.push((dt) => {
      if (durum === 'soru') {
        sure += dt;
        if (sure >= SURE) cevap('Süre doldu. Cevap: ' + sira[tur].ad, false);
        else ust();
      } else if (durum === 'cevap') {
        bekle -= dt;
        if (bekle <= 0) soru();
      }
    });
    const tus = (e) => { if (e.key === 'Escape') bitir(); };
    window.addEventListener('keydown', tus);
    aktif = () => window.removeEventListener('keydown', tus);
    soru();
  }

  // ---------- Martı uçuşu ----------
  function marti() {
    hazirla('ucus');
    S.kameraSerbest = true;
    S.controls.enabled = false;
    const sahne = S.scene, kamera = S.camera;
    const [KX0, KY0, KX1, KY1] = IZ.COG.kutu;

    // Martı: önü yerel +x
    const kus = new THREE.Group(), govde = new THREE.Group();
    const beyaz = new THREE.MeshStandardMaterial({ color: '#f7f7f4', flatShading: true }), gri = new THREE.MeshStandardMaterial({ color: '#aeb7bc', flatShading: true });
    const parca = (w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = true; govde.add(m); return m; };
    parca(1.1, 0.3, 0.34, beyaz, 0, 0, 0);
    parca(0.3, 0.26, 0.26, beyaz, 0.62, 0.08, 0);
    parca(0.22, 0.07, 0.09, new THREE.MeshStandardMaterial({ color: '#f0b429', flatShading: true }), 0.86, 0.05, 0);
    parca(0.4, 0.05, 0.3, gri, -0.7, 0.02, 0);
    const kanatlar = [-1, 1].map((yon) => {
      const k = new THREE.Group();
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 1.3), gri);
      m.position.set(0, 0, yon * 0.65);
      m.castShadow = true;
      const uc = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.04, 0.5), new THREE.MeshStandardMaterial({ color: '#3a3f45', flatShading: true }));
      uc.position.set(-0.05, 0, yon * 1.5);
      k.add(m, uc);
      k.position.set(0, 0.12, yon * 0.12);
      govde.add(k);
      return k;
    });
    kus.add(govde);
    sahne.add(kus);

    // Simitler: rastgele 20 yapının tepesinde
    const ADET = 20;
    const simitMat = new THREE.MeshStandardMaterial({ color: '#c98a3c', flatShading: true, emissive: new THREE.Color('#ffb347'), emissiveIntensity: 0.55 });
    const isinMat = new THREE.MeshBasicMaterial({ color: '#ffd27a', transparent: true, opacity: 0.22, depthWrite: false, fog: false });
    const simitler = karistir(S.yerler).slice(0, ADET).map((y) => {
      const v = y.veri, g = new THREE.Group();
      const yuk = (v.kot || 0) + v.boy + 2.6;
      g.add(new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.3, 6, 12), simitMat));
      const isin = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 70, 6), isinMat);
      isin.position.y = 35;
      g.add(isin);
      g.position.copy(S.D(v.konum[0], v.konum[1], yuk));
      sahne.add(g);
      return { g, ad: v.ad, alindi: false };
    });

    kutu.innerHTML = '<div class="oyunUst"><b id="oyunBaslik">Martı uçuşu</b><span id="oyunPuan"></span><button id="oyunCik" aria-label="Oyundan çık">×</button></div>' +
      '<p id="oyunMetin"></p><p id="oyunIpucu">Yön: ok tuşları ya da A/D · Yüksel/alçal: W/S · Hızlan: boşluk</p>';
    $('oyunCik').addEventListener('click', bitir);

    // Denetimler: klavye ve ekran düğmeleri
    const basili = { sol: false, sag: false, yukari: false, asagi: false, hiz: false };
    const TUS = { ArrowLeft: 'sol', a: 'sol', A: 'sol', ArrowRight: 'sag', d: 'sag', D: 'sag', ArrowUp: 'yukari', w: 'yukari', W: 'yukari', ArrowDown: 'asagi', s: 'asagi', S: 'asagi', ' ': 'hiz' };
    const tusBas = (e) => {
      if (e.key === 'Escape') { bitir(); return; }
      if (TUS[e.key]) { basili[TUS[e.key]] = true; e.preventDefault(); }
    };
    const tusBirak = (e) => { if (TUS[e.key]) basili[TUS[e.key]] = false; };
    window.addEventListener('keydown', tusBas);
    window.addEventListener('keyup', tusBirak);
    tuslar.hidden = false;
    tuslar.innerHTML = '<div><button data-t="sol" aria-label="Sola dön">◀</button><button data-t="sag" aria-label="Sağa dön">▶</button></div>' +
      '<div><button data-t="hiz" aria-label="Hızlan">⚡</button><button data-t="asagi" aria-label="Alçal">▼</button><button data-t="yukari" aria-label="Yüksel">▲</button></div>';
    tuslar.querySelectorAll('button').forEach((b) => {
      const ayarla = (durum) => (e) => { basili[b.dataset.t] = durum; b.classList.toggle('basili', durum); e.preventDefault(); };
      b.addEventListener('pointerdown', ayarla(true));
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((olay) => b.addEventListener(olay, ayarla(false)));
    });

    // Başlangıç: körfezin üstünde, Konak'a dönük
    const konum = new THREE.Vector3(-42, 14, -18), bak = new THREE.Vector3(), kamHedef = new THREE.Vector3();
    let yon = 0.15, donus = 0, tirman = 0, sure = 0, toplanan = 0, mesaj = 0, bitti = false;
    kamera.position.set(konum.x - 12, konum.y + 5, konum.z);

    S.kareler.push((dt, t) => {
      if (bitti) return;
      sure += dt;
      const hedefDonus = (basili.sag ? 1 : 0) - (basili.sol ? 1 : 0), hedefTirman = (basili.yukari ? 1 : 0) - (basili.asagi ? 1 : 0);
      donus += (hedefDonus - donus) * Math.min(1, dt * 6);
      tirman += (hedefTirman - tirman) * Math.min(1, dt * 5);
      yon += donus * 1.7 * dt;
      const hiz = basili.hiz ? 24 : 14;
      konum.x += Math.cos(yon) * hiz * dt;
      konum.z += Math.sin(yon) * hiz * dt;
      konum.y = Math.min(60, Math.max(1.4, konum.y + tirman * 10 * dt));
      // Harita kenarında geri döndür
      if (konum.x < KX0 + 6 || konum.x > KX1 - 6 || -konum.z < KY0 + 6 || -konum.z > KY1 - 6) {
        konum.x = Math.min(KX1 - 6, Math.max(KX0 + 6, konum.x));
        konum.z = -Math.min(KY1 - 6, Math.max(KY0 + 6, -konum.z));
        yon += 2.2 * dt;
      }
      kus.position.copy(konum);
      kus.rotation.y = -yon;
      govde.rotation.x = donus * 0.55;
      govde.rotation.z = tirman * 0.3;
      const cirpma = Math.sin(t * (basili.hiz ? 13 : 8)) * 0.55;
      kanatlar[0].rotation.x = -cirpma;
      kanatlar[1].rotation.x = cirpma;
      // Arkadan izleyen kamera
      kamHedef.set(konum.x - Math.cos(yon) * 11, konum.y + 4.2, konum.z - Math.sin(yon) * 11);
      kamera.position.lerp(kamHedef, 1 - Math.exp(-dt * 4));
      bak.set(konum.x + Math.cos(yon) * 6, konum.y + 0.5, konum.z + Math.sin(yon) * 6);
      kamera.lookAt(bak);
      S.controls.target.copy(bak);

      // Simit toplama ve en yakın simide ok
      let enYakin = null, enUzak = Infinity;
      simitler.forEach((s) => {
        if (s.alindi) return;
        s.g.children[0].rotation.y = t * 1.6;
        const d = s.g.position.distanceTo(konum);
        if (d < 2.8) {
          s.alindi = true;
          sahne.remove(s.g);
          toplanan++;
          mesaj = 2.5;
          $('oyunMetin').className = 'dogru';
          $('oyunMetin').textContent = 'Simit alındı: ' + s.ad;
        } else if (d < enUzak) { enUzak = d; enYakin = s; }
      });
      $('oyunPuan').textContent = toplanan + '/' + ADET + ' simit · ' + sureYaz(sure);
      if (mesaj > 0) mesaj -= dt;
      else if (enYakin) {
        const p = enYakin.g.position;
        const aci = Math.atan2(p.z - konum.z, p.x - konum.x) - yon;
        const dy = p.y - konum.y;
        $('oyunMetin').className = '';
        $('oyunMetin').innerHTML = '<span id="oyunOk">➤</span> En yakın simit ' + Math.round(enUzak) + ' birim' + (dy > 2.5 ? ' · yüksel ▲' : dy < -2.5 ? ' · alçal ▼' : '');
        $('oyunOk').style.transform = 'rotate(' + aci + 'rad)';
      }
      if (toplanan >= ADET) {
        bitti = true;
        const eski = rekor.oku('marti');
        const yeni = !eski || sure < eski;
        if (yeni) rekor.yaz('marti', Math.round(sure * 10) / 10);
        tuslar.hidden = true;
        sonEkrani('Martı uçuşu bitti', ['20 simit ' + sureYaz(sure) + ' sürede toplandı.', yeni ? 'Yeni rekor!' + (eski ? ' Önceki: ' + sureYaz(eski) + '.' : '') : 'En iyi süreniz: ' + sureYaz(eski) + '.'], marti);
      }
    });

    aktif = () => {
      window.removeEventListener('keydown', tusBas);
      window.removeEventListener('keyup', tusBirak);
      sahne.remove(kus);
      simitler.forEach((s) => sahne.remove(s.g));
      // Kamerayı serbest gezinmeye geri ver: martının bulunduğu yere yukarıdan bak
      S.controls.target.set(konum.x, 0, konum.z);
      kamera.position.set(konum.x - 30, 36, konum.z + 30);
      S.kameraSerbest = false;
      S.controls.enabled = true;
      S.controls.update();
    };
  }

  // ---------- Vapur kaptanı ----------
  function kaptan() {
    hazirla('ucus');
    S.kameraSerbest = true;
    S.controls.enabled = false;
    const sahne = S.scene, kamera = S.camera, C = IZ.COG;
    const [KX0, KY0, KX1, KY1] = C.kutu;
    const SURE = 180;
    // İskeleler: kıyıdaki yapıların açığında, suyun üstündeki yanaşma noktaları (harita koordinatı)
    const iskeleler = [['konak-pier', 'Konak', 20], ['pasaport', 'Pasaport', 15], ['karsiyaka-iskele', 'Karşıyaka', 9], ['bostanli', 'Bostanlı', 10], ['deniz-muzesi', 'İnciraltı', 10], ['sahilevleri', 'Narlıdere', 10]]
      .filter(([id]) => C.konum[id] && C.yon[id])
      .map(([id, ad, uzak]) => ({ ad, x: C.konum[id][0] + C.yon[id][0] * uzak, y: C.konum[id][1] + C.yon[id][1] * uzak, nx: C.yon[id][0], ny: C.yon[id][1] }))
      .filter((i) => S.araziKodu(i.x, i.y) === 0);

    // Vapur: önü yerel +x
    const mat = (renk, isik) => new THREE.MeshStandardMaterial({ color: renk, flatShading: true, emissive: new THREE.Color(isik || '#000000'), emissiveIntensity: isik ? 0.5 : 0 });
    const vapur = new THREE.Group(), tekne = new THREE.Group();
    const parca = (w, h, d, m, x, y, z) => { const k = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); k.position.set(x, y + h / 2, z); k.castShadow = true; tekne.add(k); return k; };
    parca(5.6, 0.9, 1.9, mat('#f4f4f0'), 0, 0, 0);
    parca(1.0, 0.75, 1.3, mat('#f4f4f0'), 3.1, 0.1, 0);
    parca(5.66, 0.26, 1.96, mat('#c8402f'), 0, 0, 0);
    parca(3.8, 0.8, 1.6, mat('#ffffff'), -0.2, 0.9, 0);
    parca(3.84, 0.34, 1.64, mat('#35526b', '#ffd27a'), -0.2, 1.15, 0);
    parca(1.7, 0.65, 1.2, mat('#ffffff'), 0.7, 1.7, 0);
    parca(1.74, 0.26, 1.24, mat('#35526b', '#ffd27a'), 0.7, 1.92, 0);
    const baca = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.3, 1.0, 6), mat('#e8a23a'));
    baca.position.set(-1.0, 2.2, 0);
    tekne.add(baca);
    parca(0.04, 1.0, 0.04, mat('#dddddd'), 2.6, 0.9, 0);
    parca(0.5, 0.3, 0.03, mat('#e30a17'), 2.33, 1.55, 0);
    vapur.add(tekne);
    sahne.add(vapur);
    // Dümen suyu köpükleri
    const kopukMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.55, depthWrite: false });
    const kopukler = Array.from({ length: 14 }, () => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.5), kopukMat);
      m.visible = false;
      sahne.add(m);
      return { m, omur: 0 };
    });
    // Hedef iskele işareti: şamandıra halkası ve ışık sütunu
    const isaret = new THREE.Group();
    const halka = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.22, 5, 24), new THREE.MeshStandardMaterial({ color: '#e8872e', flatShading: true, emissive: new THREE.Color('#ff9b3d'), emissiveIntensity: 0.7 }));
    halka.rotation.x = Math.PI / 2;
    const isin = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 60, 6), new THREE.MeshBasicMaterial({ color: '#ffd27a', transparent: true, opacity: 0.25, depthWrite: false, fog: false }));
    isin.position.y = 30;
    isaret.add(halka, isin);
    sahne.add(isaret);

    kutu.innerHTML = '<div class="oyunUst"><b id="oyunBaslik">Vapur kaptanı</b><span id="oyunPuan"></span><button id="oyunCik" aria-label="Oyundan çık">×</button></div>' +
      '<p id="oyunMetin"></p><p id="oyunIpucu">Gaz: W ya da ↑ · Geri/fren: S ya da ↓ · Dümen: A/D ya da ←/→ · Halkanın içinde durun</p>';
    $('oyunCik').addEventListener('click', bitir);

    const basili = { sol: false, sag: false, yukari: false, asagi: false };
    const TUS = { ArrowLeft: 'sol', a: 'sol', A: 'sol', ArrowRight: 'sag', d: 'sag', D: 'sag', ArrowUp: 'yukari', w: 'yukari', W: 'yukari', ArrowDown: 'asagi', s: 'asagi', S: 'asagi' };
    const tusBas = (e) => {
      if (e.key === 'Escape') { bitir(); return; }
      if (TUS[e.key]) { basili[TUS[e.key]] = true; e.preventDefault(); }
    };
    const tusBirak = (e) => { if (TUS[e.key]) basili[TUS[e.key]] = false; };
    window.addEventListener('keydown', tusBas);
    window.addEventListener('keyup', tusBirak);
    tuslar.hidden = false;
    tuslar.innerHTML = '<div><button data-t="sol" aria-label="Sola dümen">◀</button><button data-t="sag" aria-label="Sağa dümen">▶</button></div>' +
      '<div><button data-t="asagi" aria-label="Geri ya da fren">▼</button><button data-t="yukari" aria-label="Gaz">▲</button></div>';
    tuslar.querySelectorAll('button').forEach((b) => {
      const ayarla = (durum) => (e) => { basili[b.dataset.t] = durum; b.classList.toggle('basili', durum); e.preventDefault(); };
      b.addEventListener('pointerdown', ayarla(true));
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((olay) => b.addEventListener(olay, ayarla(false)));
    });

    // Durum: x, z dünya koordinatı (z = -harita y)
    const bas = iskeleler[0];
    // İskelenin biraz açığından, burnu denize dönük başlar (kamera iskele binasının içinde kalmasın)
    let x = bas.x + bas.nx * 9, z = -(bas.y + bas.ny * 9), yon = Math.atan2(-bas.ny, bas.nx), hiz = 0, donus = 0;
    let kalan = SURE, puan = 0, sefer = 0, yolcu = 0, hedef = null, seferSuresi = 0, yanasma = 0, mesaj = 0, ceza = 0, bitti = false, kopukSayac = 0;
    let simdiki = 0, binen = 0;
    function yeniHedef() {
      let i;
      do { i = Math.floor(Math.random() * iskeleler.length); } while (i === simdiki);
      hedef = i;
      seferSuresi = 0;
      yanasma = 0;
      binen = 20 + Math.floor(Math.random() * 60);
      isaret.position.set(iskeleler[i].x, -0.45, -iskeleler[i].y);
    }
    yeniHedef();
    const bak = new THREE.Vector3(), kamHedef = new THREE.Vector3();
    kamera.position.set(x - Math.cos(yon) * 18, 10, z - Math.sin(yon) * 18);
    const metin = $('oyunMetin');

    S.kareler.push((dt, t) => {
      if (bitti) return;
      kalan -= dt;
      seferSuresi += dt;
      // Makine ve dümen: vapur ağırdır, yavaş hızlanır ve durur
      const gaz = (basili.yukari ? 1 : 0) - (basili.asagi ? 1 : 0);
      hiz += gaz * (gaz * hiz < 0 ? 9 : 5.5) * dt;
      hiz *= 1 - Math.min(1, 0.32 * dt);
      hiz = Math.min(13, Math.max(-4, hiz));
      const hedefDonus = (basili.sag ? 1 : 0) - (basili.sol ? 1 : 0);
      donus += (hedefDonus - donus) * Math.min(1, dt * 3);
      yon += donus * 0.95 * dt * Math.max(-1, Math.min(1, hiz / 5));
      const nx = x + Math.cos(yon) * hiz * dt, nz = z + Math.sin(yon) * hiz * dt;
      // Kara ve harita kenarı: burun ya da kıç karaya değerse vapur geri seker
      const uc = hiz >= 0 ? 3.4 : -3.0;
      const bx = nx + Math.cos(yon) * uc, bz = nz + Math.sin(yon) * uc;
      const disarida = bx < KX0 + 4 || bx > KX1 - 4 || -bz < KY0 + 4 || -bz > KY1 - 4;
      if (S.araziKodu(bx, -bz) !== 0 || S.araziKodu(nx, -nz) !== 0 || disarida) {
        if (Math.abs(hiz) > 2 && ceza <= 0 && !disarida) {
          puan = Math.max(0, puan - 15);
          ceza = 2.5;
          mesaj = 2.5;
          metin.className = 'yanlis';
          metin.textContent = 'Karaya çok yaklaştınız (−15 puan).';
        }
        hiz = -hiz * 0.35;
      } else { x = nx; z = nz; }
      if (ceza > 0) ceza -= dt;
      vapur.position.set(x, -0.72 + Math.sin(t * 1.5) * 0.05, z);
      vapur.rotation.y = -yon;
      tekne.rotation.x = donus * Math.min(1, Math.abs(hiz) / 8) * 0.12;
      // Köpük izi
      kopukSayac -= dt * Math.abs(hiz);
      if (kopukSayac <= 0) {
        kopukSayac = 1.1;
        const k = kopukler.find((o) => o.omur <= 0);
        if (k) { k.omur = 2.2; k.m.visible = true; k.m.position.set(x - Math.cos(yon) * 3 + (Math.random() - 0.5) * 0.8, -0.3, z - Math.sin(yon) * 3 + (Math.random() - 0.5) * 0.8); }
      }
      kopukler.forEach((k) => {
        if (k.omur > 0) { k.omur -= dt; k.m.scale.setScalar(0.8 + (2.2 - k.omur) * 0.45); if (k.omur <= 0) k.m.visible = false; }
      });
      halka.rotation.z = t * 0.4;
      // Arkadan izleyen kamera
      kamHedef.set(x - Math.cos(yon) * 18, 9.5, z - Math.sin(yon) * 18);
      kamera.position.lerp(kamHedef, 1 - Math.exp(-dt * 3));
      bak.set(x + Math.cos(yon) * 7, 1, z + Math.sin(yon) * 7);
      kamera.lookAt(bak);
      S.controls.target.copy(bak);

      // Yanaşma: halkanın içinde, neredeyse durmuş halde kısa süre beklemek
      const h = iskeleler[hedef];
      const uzak = Math.hypot(h.x - x, -h.y - z);
      if (uzak < 4.6 && Math.abs(hiz) < 2.2) yanasma += dt;
      else yanasma = Math.max(0, yanasma - dt * 2);
      if (yanasma >= 1.3) {
        const k = 100 + Math.max(0, Math.round((70 - seferSuresi) * 2));
        puan += k;
        sefer++;
        yolcu += binen;
        simdiki = hedef;
        mesaj = 3;
        metin.className = 'dogru';
        metin.textContent = h.ad + ' İskelesi: ' + binen + ' yolcu indi (+' + k + ' puan).';
        yeniHedef();
      }
      $('oyunPuan').textContent = puan + ' puan · ' + sureYaz(Math.max(0, kalan));
      if (mesaj > 0) mesaj -= dt;
      else {
        const aci = Math.atan2(-h.y - z, h.x - x) - yon;
        metin.className = '';
        metin.innerHTML = '<span id="oyunOk">➤</span> <b></b> İskelesi · ' + Math.round(uzak) + ' birim · hız ' + Math.abs(hiz).toFixed(0) + (uzak < 4.6 ? ' · yavaşlayın, yanaşıyor…' : '');
        metin.querySelector('b').textContent = h.ad;
        $('oyunOk').style.transform = 'rotate(' + aci + 'rad)';
      }
      if (kalan <= 0) {
        bitti = true;
        const eski = rekor.oku('kaptan');
        if (puan > eski) rekor.yaz('kaptan', puan);
        tuslar.hidden = true;
        sonEkrani('Vardiya bitti', [sefer + ' sefer, ' + yolcu + ' yolcu, ' + puan + ' puan.', puan > eski ? 'Yeni rekor!' + (eski ? ' Önceki: ' + eski + '.' : '') : 'En iyi sonucunuz: ' + eski + ' puan.'], kaptan);
      }
    });

    aktif = () => {
      window.removeEventListener('keydown', tusBas);
      window.removeEventListener('keyup', tusBirak);
      sahne.remove(vapur, isaret);
      kopukler.forEach((k) => sahne.remove(k.m));
      S.controls.target.set(x, 0, z);
      kamera.position.set(x - 30, 36, z + 30);
      S.kameraSerbest = false;
      S.controls.enabled = true;
      S.controls.update();
    };
  }

  $('oyunDugme').addEventListener('click', menu);
  IZ.oyun = { menu, neresi, marti, kaptan, bitir };
})();
