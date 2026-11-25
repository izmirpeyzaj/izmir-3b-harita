// Low-poly modelleme yardımcıları. Tüm parçaların orijini taban merkezindedir.
(function () {
  const THREE = window.THREE;
  const IZ = (window.IZ = window.IZ || {});
  const onbellek = {};

  // Gece modunda parlayan malzemeler (pencereler, saat kadranı vb.)
  IZ.isikliMalzemeler = [];

  IZ.mat = function (renk, o) {
    o = o || {};
    const anahtar = renk + JSON.stringify(o);
    if (!onbellek[anahtar]) {
      const m = new THREE.MeshStandardMaterial({
        color: renk,
        flatShading: true,
        roughness: o.puruz === undefined ? 0.9 : o.puruz,
        metalness: o.metal || 0
      });
      if (o.isik) {
        m.emissive = new THREE.Color(o.isik);
        m.emissiveIntensity = 0;
        m.userData.guc = o.guc || 1;
        IZ.isikliMalzemeler.push(m);
      }
      onbellek[anahtar] = m;
    }
    return onbellek[anahtar];
  };

  function ag(geo, renk, o) {
    const m = new THREE.Mesh(geo, IZ.mat(renk, o));
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }

  IZ.kutu = function (w, h, d, renk, o) {
    const g = new THREE.BoxGeometry(w, h, d);
    g.translate(0, h / 2, 0);
    return ag(g, renk, o);
  };

  IZ.silindir = function (rUst, rAlt, h, kenar, renk, o) {
    const g = new THREE.CylinderGeometry(rUst, rAlt, h, kenar);
    g.translate(0, h / 2, 0);
    return ag(g, renk, o);
  };

  IZ.koni = function (r, h, kenar, renk, o) {
    const g = new THREE.ConeGeometry(r, h, kenar);
    g.translate(0, h / 2, 0);
    return ag(g, renk, o);
  };

  // yarim = true ise kubbe (yarım küre)
  IZ.kure = function (r, renk, o, yarim) {
    const g = new THREE.SphereGeometry(r, 8, yarim ? 4 : 6, 0, Math.PI * 2, 0, yarim ? Math.PI / 2 : Math.PI);
    return ag(g, renk, o);
  };

  // Beşik çatı: üçgen kesit x ekseninde, uzunluk z ekseninde
  IZ.besikCati = function (w, h, d, renk, o) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0);
    s.lineTo(w / 2, 0);
    s.lineTo(0, h);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
    g.translate(0, 0, -d / 2);
    return ag(g, renk, o);
  };

  // Dört yüzlü piramit çatı
  IZ.piramit = function (w, h, d, renk, o) {
    const g = new THREE.ConeGeometry(w / Math.SQRT2, h, 4);
    g.rotateY(Math.PI / 4);
    g.scale(1, 1, d / w);
    g.translate(0, h / 2, 0);
    return ag(g, renk, o);
  };

  IZ.koy = function (nesne, x, y, z, ry) {
    nesne.position.set(x, y, z);
    if (ry) nesne.rotation.y = ry;
    return nesne;
  };

  let duzMat = null;
  IZ.duzMalzeme = function () {
    if (!duzMat) duzMat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.9, emissive: new THREE.Color('#5c5142'), emissiveIntensity: 0 });
    return duzMat;
  };

  // Bir modelin sabit parçalarını malzemeye göre tek ağda birleştirir (çizim çağrısı sayısını düşürür).
  // userData.canli = true olan alt nesneler (hareketli parçalar) olduğu gibi bırakılır.
  IZ.birlestir = function (grup) {
    grup.updateMatrixWorld(true);
    const ters = grup.matrixWorld.clone().invert();
    const kumeler = new Map(), eski = [];
    (function gez(o) {
      if (o.userData.canli) return;
      if (o.isMesh) {
        // Işıksız, sıradan malzemeler köşe rengiyle tek ağda toplanır (model başına tek çizim çağrısı)
        const mt = o.material;
        const duz = !mt.userData.guc && mt.roughness === 0.9 && mt.metalness === 0 && !mt.vertexColors && !mt.transparent;
        const anahtar = (duz ? 'duz' : mt.uuid) + (o.castShadow ? 'g' : '');
        if (!kumeler.has(anahtar)) kumeler.set(anahtar, { mat: duz ? IZ.duzMalzeme() : mt, duz, golge: o.castShadow, konum: [], normal: [], renk: [], n: 0 });
        const k = kumeler.get(anahtar);
        const geo = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
        geo.applyMatrix4(new THREE.Matrix4().multiplyMatrices(ters, o.matrixWorld));
        k.konum.push(geo.attributes.position.array);
        k.normal.push(geo.attributes.normal.array);
        k.renk.push(mt.color);
        k.n += geo.attributes.position.array.length;
        eski.push(o);
      }
      o.children.slice().forEach(gez);
    })(grup);
    eski.forEach((o) => { o.parent.remove(o); o.geometry.dispose(); });
    kumeler.forEach((k) => {
      const konum = new Float32Array(k.n), normal = new Float32Array(k.n), renk = k.duz ? new Float32Array(k.n) : null;
      let i = 0;
      k.konum.forEach((dizi, j) => {
        konum.set(dizi, i);
        normal.set(k.normal[j], i);
        if (renk) {
          const c = k.renk[j];
          for (let t = i; t < i + dizi.length; t += 3) { renk[t] = c.r; renk[t + 1] = c.g; renk[t + 2] = c.b; }
        }
        i += dizi.length;
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(konum, 3));
      geo.setAttribute('normal', new THREE.BufferAttribute(normal, 3));
      if (renk) geo.setAttribute('color', new THREE.BufferAttribute(renk, 3));
      const m = new THREE.Mesh(geo, k.mat);
      m.castShadow = k.golge;
      m.receiveShadow = true;
      grup.add(m);
    });
  };

  // Henüz modellenmemiş yerler için harita iğnesi
  IZ.igne = function (renk) {
    const g = new THREE.Group();
    const uc = IZ.koni(0.9, 2.4, 6, renk);
    uc.rotation.x = Math.PI;
    uc.position.y = 2.4;
    g.add(uc);
    g.add(IZ.koy(IZ.kure(1.15, renk), 0, 3.1, 0));
    g.add(IZ.koy(IZ.kure(0.45, '#ffffff'), 0, 3.1, 0.85));
    g.userData.igne = true;
    return g;
  };
})();
