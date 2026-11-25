// Keşif defteri: bilgi kartı açılan her yer deftere işlenir; ilçe ve toplam rozetleri kazanılır.
// Kayıt tarayıcıda saklanır; saklama kapalıysa defter yalnızca bu oturum için tutulur.
(function () {
  const IZ = window.IZ, S = IZ.sahne;
  if (!S) return;
  const $ = (id) => document.getElementById(id);
  const ANAHTAR = 'izmir-defter';
  const yerler = S.yerler.map((y) => y.veri);
  const TOPLAM = yerler.length;
  const ROZETLER = [[5, 'Meraklı', '🔎'], [15, 'Gezgin', '🧭'], [30, 'Kâşif', '🗺️'], [TOPLAM, 'İzmirli', '🏅']];

  let kayit = {};
  try { kayit = JSON.parse(localStorage.getItem(ANAHTAR) || '{}') || {}; } catch (e) { kayit = {}; }
  const sakla = () => { try { localStorage.setItem(ANAHTAR, JSON.stringify(kayit)); } catch (e) { /* yok say */ } };
  const gezildi = (id) => !!kayit[id];
  const sayi = () => yerler.filter((v) => kayit[v.id]).length;
  const ilceDurumu = (ilce) => {
    const l = yerler.filter((v) => v.ilce === ilce);
    return { hepsi: l, gezilen: l.filter((v) => kayit[v.id]).length };
  };
  const oku = (ad) => { try { return Number(localStorage.getItem('izmir-' + ad)) || 0; } catch (e) { return 0; } };

  const panel = $('defter'), dugme = $('defterDugme'), bildirim = $('bildirim');
  let bildirimZaman = null;
  function bildir(yazi) {
    bildirim.textContent = yazi;
    bildirim.hidden = false;
    clearTimeout(bildirimZaman);
    bildirimZaman = setTimeout(() => { bildirim.hidden = true; }, 4200);
  }
  function dugmeYaz() { dugme.textContent = '📓 ' + sayi() + '/' + TOPLAM; }

  function el(etiket, sinif, yazi) {
    const e = document.createElement(etiket);
    if (sinif) e.className = sinif;
    if (yazi !== undefined) e.textContent = yazi;
    return e;
  }
  function ciz() {
    const n = sayi();
    panel.innerHTML = '';
    const ust = el('div', 'oyunUst');
    ust.appendChild(el('b', '', 'Keşif defteri'));
    ust.appendChild(el('span', '', n + '/' + TOPLAM + ' yer'));
    const kapat = el('button', '', '×');
    kapat.setAttribute('aria-label', 'Kapat');
    kapat.addEventListener('click', kapa);
    ust.appendChild(kapat);
    panel.appendChild(ust);

    const cubuk = el('div', 'defterCubuk');
    const dolu = el('i');
    dolu.style.width = Math.round((n / TOPLAM) * 100) + '%';
    cubuk.appendChild(dolu);
    panel.appendChild(cubuk);
    panel.appendChild(el('p', 'defterNot', n === 0 ? 'Haritada bir yapıya tıklayıp bilgi kartını açtığınızda o yer deftere işlenir.' : n === TOPLAM ? 'Bütün yerleri gezdiniz.' : 'Bir yapının bilgi kartını açtığınızda o yer deftere işlenir.'));

    // Toplam rozetleri
    const rozetler = el('div', 'defterRozetler');
    ROZETLER.forEach(([esik, ad, simge]) => {
      const r = el('span', 'rozet' + (n >= esik ? ' kazanildi' : ''), simge + ' ' + ad);
      r.title = esik + ' yer' + (n >= esik ? ' (kazanıldı)' : ' (' + (esik - n) + ' yer kaldı)');
      rozetler.appendChild(r);
    });
    panel.appendChild(rozetler);

    // İlçeler
    IZ.ILCELER.forEach((ilce) => {
      const d = ilceDurumu(ilce);
      if (!d.hepsi.length) return;
      const bolum = el('div', 'defterIlce');
      const baslik = el('div', 'defterIlceBaslik');
      baslik.appendChild(el('b', '', ilce));
      baslik.appendChild(el('span', '', d.gezilen + '/' + d.hepsi.length + (d.gezilen === d.hepsi.length ? ' · 🏅 tamam' : '')));
      bolum.appendChild(baslik);
      const liste = el('div', 'defterYerler');
      d.hepsi.forEach((v) => {
        const b = el('button', gezildi(v.id) ? 'gezildi' : '', (gezildi(v.id) ? '✓ ' : '') + v.ad);
        b.title = gezildi(v.id) ? 'Gezildi: ' + new Date(kayit[v.id]).toLocaleDateString('tr-TR') : 'Henüz gezilmedi; gitmek için tıklayın';
        b.addEventListener('click', () => { kapa(); S.sec(v.id); });
        liste.appendChild(b);
      });
      bolum.appendChild(liste);
      panel.appendChild(bolum);
    });

    // Oyun rekorları
    const neresi = oku('neresi'), marti = oku('marti'), kaptan = oku('kaptan');
    if (neresi || marti || kaptan) {
      const rekor = el('p', 'defterNot');
      const parca = [];
      if (neresi) parca.push('Neresi?: ' + neresi + ' puan');
      if (marti) parca.push('Martı uçuşu: ' + Math.floor(marti / 60) + ':' + String(Math.floor(marti % 60)).padStart(2, '0'));
      if (kaptan) parca.push('Vapur kaptanı: ' + kaptan + ' puan');
      rekor.textContent = 'Oyun rekorları · ' + parca.join(' · ');
      panel.appendChild(rekor);
    }
    if (n > 0) {
      const alt = el('div', 'oyunAlt');
      const sifirla = el('button', '', 'Defteri sıfırla');
      sifirla.addEventListener('click', () => {
        if (!window.confirm('Defterdeki ' + n + ' kayıt silinsin mi? Bu geri alınamaz.')) return;
        kayit = {};
        sakla();
        dugmeYaz();
        S.listeyiCiz();
        ciz();
      });
      alt.appendChild(sifirla);
      panel.appendChild(alt);
    }
  }
  function ac() {
    if (S.oyunAktif) return;
    if (IZ.oyun) IZ.oyun.bitir(); // açık oyun menüsü varsa kapat
    ciz();
    panel.hidden = false;
  }
  function kapa() { panel.hidden = true; }
  dugme.addEventListener('click', () => (panel.hidden ? ac() : kapa()));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') kapa(); });

  // Sahne bir yerin kartını açtığında çağırır (oyun sırasında çağırmaz)
  S.yerSecildi = (v) => {
    if (kayit[v.id]) return;
    const once = sayi();
    kayit[v.id] = Date.now();
    sakla();
    const n = once + 1;
    let yazi = 'Yeni keşif: ' + v.ad + ' (' + n + '/' + TOPLAM + ')';
    const d = ilceDurumu(v.ilce);
    if (d.gezilen === d.hepsi.length) yazi += ' · ' + v.ilce + ' ilçesi tamamlandı 🏅';
    const rozet = ROZETLER.find(([esik]) => esik === n);
    if (rozet) yazi += ' · Rozet: ' + rozet[2] + ' ' + rozet[1];
    bildir(yazi);
    dugmeYaz();
    S.listeyiCiz();
    if (!panel.hidden) ciz();
  };

  IZ.defter = { gezildi, sayi, ac, kapa };
  dugmeYaz();
  S.listeyiCiz();
})();
