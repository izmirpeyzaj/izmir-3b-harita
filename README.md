# İzmir 3B Şehir Haritası

İzmir'in on merkez ilçesinden simge yapıları, müzeleri, lezzet duraklarını, alışveriş ve eğlence yerlerini gösteren, tarayıcıda çalışan low-poly 3B harita.
Kurulum ve derleme gerektirmez; `index.html` dosyasını açmak yeterlidir.

## Özellikler

- Gerçek kıyı çizgisi, ilçe sınırları, yollar, raylı sistem hatları, istasyonlar ve vapur iskeleleri. Merkez büyütülmüştür; yönler ve komşuluklar gerçektir, uzaklıklar ölçekli değildir.
- İlgi alanına göre katalog: Tarih ve mimari, Müze ve sanat, Yeme-içme, Alışveriş, Eğlence ve spor, Doğa ve sahil, Çocuklarla. Her alanda en az 20 yer.
- Bilgi kartında genişletilmiş açıklama, resmi web sitesi, yol tarifi ve en yakın metro, İZBAN, tramvay ve vapur durakları.
- Gündüz, gün batımı ve gece modları; gece yanan pencereler.
- Hareket eden vapurlar, tramvaylar, trenler, otobüsler ve arabalar.
- Üç oyun: "Neresi?" bulmacası, martı uçuşu ve vapur kaptanı.
- Keşif defteri: gezilen yerler ve rozetler tarayıcıda saklanır.

## Çalıştırma

`index.html` dosyasına çift tıklayın. Bir sunucu üzerinden açmak isterseniz (Python gerekir) `baslat.bat` dosyasını çalıştırın.

## Haritayı yeniden üretmek

Harita verisi (`js/cografya.js`) şu betikle üretilir:

```
python araclar/cografya.py
```

Betik, simge yapıların koordinatlarını `araclar/koordinat.json`, katalogdaki yerleri `araclar/mekanlar.json`, yolları `araclar/osm_yollar.json` dosyasından okur.

Kataloğa yer eklemek için yeni yerleri `araclar/mekanlar.json` dosyasına (ya da ayrı bir JSON dizisine) yazın, sonra sırayla çalıştırın:

```
python araclar/mekanlar_derle.py [yeni-yerler.json]
python araclar/cografya.py
```

İlk betik yerleri denetler (koordinat on ilçeden birinde mi, tür ve ilgi alanı biliniyor mu) ve `js/mekanlar.js` dosyasını yazar. Yerlerin 3B modelleri türe göre `js/mekanmodelleri.js` dosyasında üretilir.
İlçe sınırlarını içeren `ilceler.geojson` (10 MB) bu depoda yoktur; yeniden üretim için portaldaki "İzmir Şehir Haritası" veri setinden indirilip proje klasörüne konmalıdır.

## Kaynaklar

- İlçe sınırları, metro, tramvay ve İZBAN hatları ile istasyonları, vapur iskeleleri: [İzmir Büyükşehir Belediyesi Açık Veri Portalı](https://acikveri.bizizmir.com/) (CC BY 4.0). İndirilen dosyalar `araclar/acikveri/` klasöründedir.
- Karayolu verisi © [OpenStreetMap](https://www.openstreetmap.org/copyright) katkıcıları (ODbL).
- 3B çizim: [three.js](https://threejs.org/) r160 (MIT), `vendor/` klasöründe.
- Yerlerin koordinatları Wikidata ve OpenStreetMap'ten derlenmiştir. Açıklamalar kurumların kendi siteleri, Vikipedi, belediye ve bakanlık sayfalarından derlenmiştir; işletme bilgileri değişebilir.
