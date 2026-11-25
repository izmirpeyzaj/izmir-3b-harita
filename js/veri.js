// İzmir şehir merkezi: yer listesi ve bilgi kartı verileri.
// konum: stilize harita koordinatı [x (doğu), y (kuzey)]. Coğrafi olarak birebir değildir.
window.IZ = window.IZ || {};

IZ.KATEGORILER = {
  tarihi: { ad: 'Tarihi yapı', renk: '#c8553d' },
  antik: { ad: 'Antik', renk: '#b08d57' },
  dini: { ad: 'Dini yapı', renk: '#2f8f7f' },
  anit: { ad: 'Anıt ve park', renk: '#7a5cc0' },
  kultur: { ad: 'Kültür ve sanat', renk: '#c2478f' },
  modern: { ad: 'Modern', renk: '#2f7fd1' }
};

IZ.YERLER = [
  {
    id: 'saat-kulesi', ad: 'Saat Kulesi', kategori: 'tarihi', semt: 'Konak Meydanı', yil: '1901',
    aciklama: 'İzmir\'in simgesi. II. Abdülhamid\'in tahta çıkışının 25. yılı için yapıldı. Mimarı Raymond Charles Péré, yüksekliği 25 metre. Saatinin Alman İmparatoru II. Wilhelm\'in hediyesi olduğu söylenir.',
    konum: [-7, -2], boy: 15, alan: 8, hazir: true
  },
  {
    id: 'asansor', ad: 'Tarihi Asansör', kategori: 'tarihi', semt: 'Karataş', yil: '1907',
    aciklama: 'Nesim Levi Bayraklıoğlu tarafından yaptırıldı. Mithatpaşa Caddesi ile yamacın üstündeki Halil Rıfat Paşa semtini birbirine bağlar; aradaki kot farkı yaklaşık 50 metredir. Üst terası Körfez manzarasıyla ünlüdür.',
    konum: [-36, -31], boy: 12, alan: 12, hazir: true
  },
  {
    id: 'konak-pier', ad: 'Konak Pier', kategori: 'tarihi', semt: 'Konak', yil: '19. yy sonu',
    aciklama: 'Gümrük binası olarak yapıldı; yapım yılı kaynaklara göre değişir, en sık 1890 verilir. Tasarımı Gustave Eiffel\'e atfedilir. 2000\'lerin başında restore edilerek alışveriş merkezine dönüştürüldü.',
    konum: [-17, 12], boy: 6, alan: 9, hazir: true
  },
  {
    id: 'yali-camii', ad: 'Konak Yalı Camii', kategori: 'dini', semt: 'Konak Meydanı', yil: '18. yy (1755?)',
    aciklama: 'Sekizgen planlı küçük cami. Yapımı genellikle 1755\'e ve Katipzade Mehmed Paşa\'nın eşi Ayşe Hanım\'a atfedilir; kesin kayıt yoktur. Cephesi Kütahya çinileriyle süslüdür.',
    konum: [-3, -10], boy: 6, alan: 5, hazir: false
  },
  {
    id: 'kizlaragasi', ad: 'Kızlarağası Hanı', kategori: 'tarihi', semt: 'Kemeraltı', yil: '1744',
    aciklama: 'Hacı Beşir Ağa tarafından yaptırılan avlulu Osmanlı hanı. Bugün Kemeraltı Çarşısı\'nın en bilinen duraklarından biridir.',
    konum: [6, 3], boy: 6, alan: 6, hazir: false
  },
  {
    id: 'agora', ad: 'Smyrna Agorası', kategori: 'antik', semt: 'Namazgâh', yil: 'MÖ 4. yy',
    aciklama: 'Antik Smyrna\'nın pazar ve toplanma yeri. MS 178 depreminde yıkıldı, İmparator Marcus Aurelius\'un desteğiyle yeniden yapıldı.',
    konum: [15, -9], boy: 6, alan: 7, hazir: false
  },
  {
    id: 'kadifekale', ad: 'Kadifekale', kategori: 'antik', semt: 'Pagos Tepesi', yil: 'MÖ 4.-3. yy',
    aciklama: 'Yaklaşık 186 metrelik Pagos Tepesi\'ndeki kale. Efsaneye göre şehrin buraya taşınması Büyük İskender\'in rüyasına dayanır; ilk surlar ölümünden sonra, Antigonos ve Lysimakhos döneminde yapıldı.',
    konum: [26, -31], kot: 8, boy: 6, alan: 20, hazir: false
  },
  {
    id: 'pasaport', ad: 'Pasaport İskelesi', kategori: 'tarihi', semt: 'Pasaport', yil: '1884',
    aciklama: 'Kordon üzerindeki tarihi vapur iskelesi. 1922 yangınında hasar gördü ve 1926\'da Birinci Ulusal Mimarlık üslubunda yeniden yapıldı.',
    konum: [-11.5, 27], boy: 6, alan: 6, hazir: false
  },
  {
    id: 'polikarp', ad: 'Aziz Polikarp Kilisesi', kategori: 'dini', semt: 'Alsancak', yil: '1625',
    aciklama: '1625\'te yapılan Katolik kilisesi; İzmir\'in ayakta kalan en eski yapılarından biridir.',
    konum: [13, 35], boy: 6, alan: 6, hazir: false
  },
  {
    id: 'ataturk-aniti', ad: 'Atatürk Anıtı', kategori: 'anit', semt: 'Cumhuriyet Meydanı', yil: '1932',
    aciklama: 'İtalyan heykeltıraş Pietro Canonica\'nın eseri olan atlı Atatürk heykeli.',
    konum: [3, 45], donus: Math.PI / 2, boy: 6, alan: 6, hazir: false
  },
  {
    id: 'kulturpark', ad: 'Kültürpark ve Paraşüt Kulesi', kategori: 'anit', semt: 'Kültürpark', yil: '1936',
    aciklama: 'İzmir Enternasyonal Fuarı\'na ev sahipliği yapan şehir parkı. İçindeki 48 metrelik Paraşüt Kulesi 1937\'de açıldı.',
    konum: [29, 46], boy: 6, alan: 11, hazir: false
  },
  {
    id: 'cumhuriyet-agaci', ad: 'Cumhuriyet Ağacı Anıtı', kategori: 'anit', semt: 'Gündoğdu Meydanı', yil: '2003',
    aciklama: 'Kordon\'daki Gündoğdu Meydanı\'nda yer alan anıt. Cumhuriyet\'in 80. yılı için heykeltıraş Ferit Özşen tarafından yapıldı.',
    konum: [6, 61], boy: 6, alan: 6, hazir: false
  },
  {
    id: 'alsancak-gari', ad: 'Alsancak Garı', kategori: 'tarihi', semt: 'Alsancak', yil: '1858',
    aciklama: 'İzmir-Aydın demiryolunun başlangıç istasyonu olarak açılan tarihi gar.',
    konum: [23, 71], boy: 6, alan: 7, hazir: false
  },
  {
    id: 'folkart', ad: 'Folkart Towers', kategori: 'modern', semt: 'Bayraklı', yil: '2014',
    aciklama: 'Bayraklı\'daki yeni iş merkezinin simgesi olan, 200 metre yüksekliğindeki ikiz gökdelenler. Mimarı Mehmet Yağcıoğlu\'dur. Alt katlarında dalgalanan beyaz balkon bantlarıyla tanınır.',
    konum: [84, 88], boy: 6, alan: 11.5, hazir: false
  },
  {
    id: 'mistral', ad: 'Mistral İzmir', kategori: 'modern', semt: 'Çınarlı', yil: '2017',
    aciklama: 'Biri ofis, biri konut iki kuleden oluşur. 216 metrelik, 48 katlı ofis kulesi İzmir\'in en yüksek yapılarındandır; konut kulesi 154 metredir. Katlar yükseldikçe bir sağa bir sola dönerek kulelere kıvrımlı biçimini verir.',
    konum: [53, 61], boy: 6, alan: 8
  },
  {
    id: 'ege-perla', ad: 'Ege Perla', kategori: 'modern', semt: 'Çınarlı', yil: '2017',
    aciklama: 'Mimar Emre Arolat\'ın tasarladığı, farklı yükseklikte iki kule ile alışveriş merkezinden oluşan yapı. Alışveriş bölümünün çatısı, iki ucundan yürünerek çıkılan yeşil bir park olarak düzenlenmiştir. Yüksek kulenin yüksekliği kaynaklara göre 186 ya da 210 metredir.',
    konum: [66, 64], boy: 6, alan: 8
  },
  {
    id: 'kemeralti', ad: 'Kemeraltı Çarşısı', kategori: 'tarihi', semt: 'Kemeraltı', yil: '17. yy',
    aciklama: 'İzmir\'in tarihi çarşısı. İç liman doldukça kazanılan alanda, 17. yüzyılın ortasından itibaren yapılan han ve dükkânlarla büyüdü. Ana aksı Anafartalar Caddesi\'nin kıvrımı eski iç limanın kıyı çizgisini izler.',
    konum: [3.5, 13], boy: 6, alan: 5.5
  },
  {
    id: 'hisar-camii', ad: 'Hisar Camii', kategori: 'dini', semt: 'Kemeraltı', yil: '1597-98',
    aciklama: 'İzmir merkezindeki tarihi camilerin en büyüğü sayılır. Yaptıranın Aydınoğulları soyundan Yakup Bey olduğu kabul edilir. Adını, önünde durduğu iç liman kalesinden alır.',
    konum: [15, 13], boy: 6, alan: 6
  },
  {
    id: 'basmane-gari', ad: 'Basmane Garı', kategori: 'tarihi', semt: 'Basmane', yil: '1866',
    aciklama: 'İzmir-Kasaba (Turgutlu) demiryolunun başlangıç istasyonu. Hattı işleten İngiliz şirketi tarafından yapıldı ve 1866\'da açıldı.',
    konum: [33, 25], boy: 6, alan: 7
  },
  {
    id: 'elhamra', ad: 'Elhamra Sahnesi', kategori: 'kultur', semt: 'Konak', yil: '1926',
    aciklama: 'Mimar Tahsin Sermet\'in tasarladığı yapı, bitişiğindeki Milli Kütüphane\'ye gelir sağlamak için sinema olarak açıldı. Bugün İzmir Devlet Opera ve Balesi\'nin sahnesidir.',
    konum: [-6, -19], boy: 6, alan: 6
  },
  {
    id: 'ataturk-muzesi', ad: 'Atatürk Müzesi', kategori: 'kultur', semt: 'Birinci Kordon', yil: '1875-1880',
    aciklama: 'Kordon\'da bir halı tüccarının yaptırdığı konak. Atatürk İzmir ziyaretlerinde burada kaldı. 1941\'de müze olarak açıldı.',
    konum: [7.5, 54], donus: Math.PI / 2, boy: 6, alan: 5
  },
  {
    id: 'havagazi', ad: 'Tarihi Havagazı Fabrikası', kategori: 'kultur', semt: 'Alsancak', yil: '1860\'lar',
    aciklama: 'Sokak aydınlatması için havagazı üreten fabrika; bir İngiliz firması tarafından kuruldu ve 1864\'te sokak lambalarına gaz vermeye başladı. İzmir Büyükşehir Belediyesi\'nin restorasyonu 2008\'de tamamlandı; bugün kültür ve etkinlik merkezidir.',
    konum: [37, 65], boy: 6, alan: 7
  },
  {
    id: 'karsiyaka-iskele', ad: 'Karşıyaka İskelesi ve Çarşı', kategori: 'tarihi', semt: 'Karşıyaka', yil: '1884',
    aciklama: 'Körfez vapurlarının Karşıyaka durağı. İlk ahşap iskele 1884\'te Hamidiye vapur şirketi tarafından yapıldı; bugünkü bina 20. yüzyılın ortasına aittir. İskelenin karşısında Karşıyaka Çarşısı başlar.',
    konum: [-5, 105.4], boy: 6, alan: 8
  },
  {
    id: 'latife-kosku', ad: 'Latife Hanım Köşkü', kategori: 'kultur', semt: 'Karşıyaka', yil: '1860\'lar',
    aciklama: 'Uşakizade ailesinin yazlık köşkü. Atatürk\'ün annesi Zübeyde Hanım son günlerini burada geçirdi. Karşıyaka Belediyesi\'nin restorasyonunun ardından 2008\'de anı evi olarak açıldı.',
    konum: [14, 113], donus: Math.PI, boy: 6, alan: 6
  },
  {
    id: 'zubeyde-hanim', ad: 'Zübeyde Hanım Anıt Mezarı', kategori: 'anit', semt: 'Karşıyaka', yil: '1940',
    aciklama: 'Atatürk\'ün annesi Zübeyde Hanım 14 Ocak 1923\'te Karşıyaka\'da öldü ve buraya defnedildi. Doğal kaya bloklu anıt mezar bugünkü biçimini 1940\'ta aldı.',
    konum: [30, 115], donus: Math.PI, boy: 6, alan: 6
  },
  {
    id: 'bostanli', ad: 'Bostanlı Gün Batımı Terası', kategori: 'modern', semt: 'Bostanlı', yil: '2016',
    aciklama: 'İzmirDeniz kıyı projesi kapsamında yapılan basamaklı ahşap teras ve Bostanlı Deresi\'nin iki yakasını bağlayan yaya köprüsü. Tasarım Studio Evren Başbuğ\'a aittir.',
    konum: [-34, 103.4], boy: 6, alan: 6
  },
  {
    id: 'buyuk-park', ad: 'Bornova Büyük Park', kategori: 'anit', semt: 'Bornova', yil: '1934',
    aciklama: 'Bornova merkezindeki park. 1920\'lere kadar mezarlık olan alan düzenlenerek 1934\'te açıldı.',
    konum: [98, 61], boy: 6, alan: 6
  },
  {
    id: 'ege-universitesi', ad: 'Ege Üniversitesi', kategori: 'kultur', semt: 'Bornova', yil: '1955',
    aciklama: '1955\'te kurulan üniversitenin kampüsü Bornova\'dadır. Rektörlük, Levanten Whittall ailesinin "Büyük Ev" olarak bilinen tarihi köşkünde yer alır.',
    konum: [93, 74], boy: 6, alan: 7
  },
  {
    id: 'yesilova', ad: 'Yeşilova Höyüğü', kategori: 'antik', semt: 'Bornova', yil: 'yaklaşık 8.500 yıl önce',
    aciklama: 'İzmir\'in bilinen en eski yerleşimi. 2003\'te bulundu, 2005\'ten beri kazılıyor. Yanındaki ziyaretçi merkezinde Neolitik evlerin birebir canlandırmaları vardır.',
    konum: [86, 58], boy: 6, alan: 6
  },
  {
    id: 'homeros', ad: 'Homeros Vadisi', kategori: 'anit', semt: 'Bornova', yil: '2008',
    aciklama: 'Göletleri ve yürüyüş yollarıyla yaklaşık 7 kilometrelik mesire vadisi. İzmir Büyükşehir Belediyesi tarafından düzenlendi.',
    konum: [103.5, 48], boy: 6, alan: 6
  },
  {
    id: 'teleferik', ad: 'Balçova Teleferik', kategori: 'modern', semt: 'Balçova', yil: '1974',
    aciklama: '1974\'te açılan teleferik, 810 metrelik hatla Dede Dağı\'ndaki mesire alanına çıkar. 2000\'lerin sonunda güvenlik nedeniyle kapatıldı; yenilenerek 2015\'te yeniden açıldı.',
    konum: [-66, -45], boy: 6, alan: 8
  },
  {
    id: 'balcova-termal', ad: 'Agamemnon Kaplıcaları', kategori: 'antik', semt: 'Balçova', yil: 'Antik Çağ',
    aciklama: 'Antik Çağ\'dan beri bilinen sıcak su kaynakları; Homeros ve Strabon\'da geçer. Rivayete göre Truva Savaşı\'nda yaralanan Agamemnon\'un askerleri burada şifa buldu. Bugün Balçova Termal tesisleridir.',
    konum: [-50, -39], boy: 6, alan: 6
  },
  {
    id: 'deniz-muzesi', ad: 'İnciraltı Deniz Müzesi', kategori: 'kultur', semt: 'İnciraltı', yil: '2007',
    aciklama: '1 Temmuz 2007\'de açılan açık hava deniz müzesi. TCG Ege firkateyni ile TCG Pirireis denizaltısı gezilebilir.',
    konum: [-57, -29], boy: 6, alan: 7
  },
  {
    id: 'yukarikoy', ad: 'Narlıdere Yukarıköy', kategori: 'tarihi', semt: 'Narlıdere', yil: '18. yy',
    aciklama: 'Narlıdere\'nin eski köy çekirdeği. Yaklaşık 300 yıl önce Tahtacı Türkmenleri tarafından kuruldu. İlçe adını dere boyundaki nar ağaçlarından alır.',
    konum: [-88, -47], boy: 6, alan: 6
  },
  {
    id: 'sahilevleri', ad: 'Sahilevleri Kıyı Parkı', kategori: 'anit', semt: 'Narlıdere', yil: '2010\'lar',
    aciklama: 'Narlıdere\'nin körfez kıyısındaki yürüyüş ve dinlenme alanı. İzmirDeniz projesi kapsamında yaklaşık 2,6 kilometrelik kıyı bandı yeniden düzenlendi.',
    konum: [-86, -33.2], boy: 6, alan: 6
  },
  {
    id: 'su-kemerleri', ad: 'Kızılçullu Su Kemerleri', kategori: 'antik', semt: 'Şirinyer, Buca', yil: 'Roma-Bizans',
    aciklama: 'Meles Çayı vadisini aşarak Smyrna\'ya su taşıyan kemerler. Yapımı kaynaklara göre Roma ya da Bizans dönemine tarihlenir; Osmanlı döneminde onarılmıştır.',
    konum: [50, -17], boy: 6, alan: 6
  },
  {
    id: 'hipodrom', ad: 'Şirinyer Hipodromu', kategori: 'tarihi', semt: 'Şirinyer, Buca', yil: '1856',
    aciklama: 'İlk yarışın 23 Eylül 1856\'da koşulduğu, Türkiye\'nin en eski hipodromu sayılan pist. Türkiye Jokey Kulübü tarafından işletilir.',
    konum: [62, -30], boy: 6, alan: 8
  },
  {
    id: 'hasanaga', ad: 'Hasanağa Bahçesi', kategori: 'anit', semt: 'Buca', yil: '1925',
    aciklama: 'Levanten Aliotti ailesinin bahçesiydi; 1925\'te satın alan Hasan Ağa\'nın adıyla anılır. Yaklaşık yüz yıldır Buca\'nın en büyük parkıdır.',
    konum: [74, -9], boy: 6, alan: 7
  },
  {
    id: 'buca-golet', ad: 'Buca Gölet', kategori: 'anit', semt: 'Buca', yil: '1999',
    aciklama: 'Buca Belediyesi\'nin kurduğu yapay gölet ve mesire alanı. Çevresinde yürüyüş yolları, amfi tiyatro ve seyir terasları bulunur.',
    konum: [80, -24], boy: 6, alan: 6
  },
  {
    id: 'kus-cenneti', ad: 'İzmir Kuş Cenneti', kategori: 'anit', semt: 'Sasalı', yil: '1982',
    aciklama: 'Gediz Deltası\'nın Çiğli kıyısındaki sulak alan. 1982\'de su kuşları koruma ve üreme sahası ilan edildi; delta 1998\'den beri Ramsar alanıdır. Yaklaşık 300 kuş türü kaydedilmiştir. Flamingoların Türkiye\'deki iki üreme alanından biridir.',
    konum: [-108, 99.6], boy: 6, alan: 8
  },
  {
    id: 'dogal-yasam', ad: 'İzmir Doğal Yaşam Parkı', kategori: 'anit', semt: 'Sasalı', yil: '2008',
    aciklama: '30 Kasım 2008\'de açılan, İzmir Büyükşehir Belediyesi\'nin işlettiği hayvanat bahçesi. Yaklaşık 425 dönümlük alanda 120\'den fazla türden hayvan yaşar. Afrika savanı bölümü ve Asya filleriyle bilinir.',
    konum: [-97, 118], boy: 6, alan: 7
  },
  {
    id: 'aosb', ad: 'Atatürk Organize Sanayi Bölgesi', kategori: 'modern', semt: 'Çiğli', yil: '1990',
    aciklama: '1990\'da faaliyete geçen İzmir Atatürk Organize Sanayi Bölgesi yaklaşık 6,2 milyon metrekarelik bir alana yayılır. Yirmiden fazla sektörde on binlerce kişi çalışır.',
    konum: [-68, 122], boy: 6, alan: 8
  },
  {
    id: 'havalimani', ad: 'Adnan Menderes Havalimanı', kategori: 'modern', semt: 'Gaziemir', yil: '1987',
    aciklama: '17 Kasım 1987\'de açılan havalimanı şehir merkezinin yaklaşık 14 kilometre güneyindedir; arazisi Gaziemir ve Menderes ilçelerine yayılır. Dış hatlar terminali 2006\'da, bugünkü iç hatlar terminali 2014\'te açıldı.',
    konum: [24, -113], boy: 6, alan: 11.5
  },
  {
    id: 'fuar-izmir', ad: 'Fuar İzmir', kategori: 'modern', semt: 'Gaziemir', yil: '2015',
    aciklama: 'Mart 2015\'te açılan fuar ve kongre alanı. İzmir Büyükşehir Belediyesi\'ne aittir ve İZFAŞ fuarlarına ev sahipliği yapar. Yaklaşık 330 bin metrekarelik arazisiyle Türkiye\'nin en büyük fuar alanlarından biridir.',
    konum: [53, -94], boy: 6, alan: 8.5
  },
  {
    id: 'serbest-bolge', ad: 'Ege Serbest Bölgesi ve Uzay Kampı', kategori: 'modern', semt: 'Gaziemir', yil: '1990',
    aciklama: '1990\'da faaliyete geçen serbest bölge, Türkiye\'de özel sektörün kurduğu ilk serbest bölge olarak anılır. İçindeki Uzay Kampı Türkiye 2000\'de açıldı.',
    konum: [-5, -98], boy: 6, alan: 8
  },
  {
    id: 'guntekin', ad: 'Reşat Nuri Güntekin Çocuk Kütüphanesi', kategori: 'kultur', semt: 'Bozyaka', yil: '2004',
    aciklama: 'Reşat Nuri Güntekin\'in "Çalıkuşu" romanını yazdığı kabul edilen bağ evi. Restore edilerek 2004\'te çocuk kütüphanesi olarak açıldı. Bozyaka\'nın iki katlı taş "kule" bağ evleri 1950\'lere kadar yazlık olarak kullanılırdı.',
    konum: [-12, -59], boy: 6, alan: 6.5
  },
  {
    id: 'demokrasi-uni', ad: 'İzmir Demokrasi Üniversitesi', kategori: 'kultur', semt: 'Üçkuyular', yil: '2016',
    aciklama: '2016\'da kurulan devlet üniversitesi. Merkez yerleşkesi Karabağlar\'ın Üçkuyular semtindedir.',
    konum: [-14, -78], boy: 6, alan: 7.5
  },
  {
    id: 'kavacik', ad: 'Kavacık Köyü ve Bağları', kategori: 'tarihi', semt: 'Kavacık', yil: '19. yy',
    aciklama: '19. yüzyılın ilk yarısında Yörüklerin kurduğu, taş evleriyle bilinen köy. Kavacık üzümü 2019\'da coğrafi işaret aldı; her eylülde üzüm festivali düzenlenir. Karabağlar\'ın adını da bir zamanlar yamaçlarını kaplayan kara üzüm bağlarından aldığı söylenir.',
    konum: [28, -74], boy: 6, alan: 8
  }
];

// İlçeler: liste ve tur bu sırayla ilerler. Aşağıda adı geçmeyen yerler Konak'tadır.
IZ.ILCELER = ['Konak', 'Çiğli', 'Karşıyaka', 'Bayraklı', 'Bornova', 'Buca', 'Gaziemir', 'Karabağlar', 'Balçova', 'Narlıdere'];
(function () {
  const ilceYerleri = {
    'Çiğli': ['kus-cenneti', 'dogal-yasam', 'aosb'],
    'Gaziemir': ['havalimani', 'fuar-izmir', 'serbest-bolge'],
    'Karabağlar': ['guntekin', 'demokrasi-uni', 'kavacik'],
    'Karşıyaka': ['karsiyaka-iskele', 'latife-kosku', 'zubeyde-hanim', 'bostanli'],
    'Bayraklı': ['folkart'],
    'Bornova': ['buyuk-park', 'ege-universitesi', 'yesilova', 'homeros'],
    'Buca': ['su-kemerleri', 'hipodrom', 'hasanaga', 'buca-golet'],
    'Balçova': ['teleferik', 'balcova-termal', 'deniz-muzesi'],
    'Narlıdere': ['yukarikoy', 'sahilevleri']
  };
  IZ.YERLER.forEach((y) => {
    y.ilce = Object.keys(ilceYerleri).find((i) => ilceYerleri[i].includes(y.id)) || 'Konak';
  });
  IZ.YERLER.sort((a, b) => IZ.ILCELER.indexOf(a.ilce) - IZ.ILCELER.indexOf(b.ilce));
})();
