// İzmir şehir merkezi: yer listesi ve bilgi kartı verileri.
// konum: stilize harita koordinatı [x (doğu), y (kuzey)]. Coğrafi olarak birebir değildir.
window.IZ = window.IZ || {};

IZ.KATEGORILER = {
  tarihi: { ad: 'Tarihi yapı', renk: '#c8553d' },
  antik: { ad: 'Antik', renk: '#b08d57' },
  dini: { ad: 'Dini yapı', renk: '#2f8f7f' },
  anit: { ad: 'Anıt ve park', renk: '#7a5cc0' },
  kultur: { ad: 'Kültür ve sanat', renk: '#c2478f' },
  modern: { ad: 'Modern', renk: '#2f7fd1' },
  yeme: { ad: 'Yeme-içme', renk: '#e07a3b' },
  alisveris: { ad: 'Alışveriş', renk: '#d14b6a' },
  eglence: { ad: 'Eğlence ve spor', renk: '#d9a520' },
  doga: { ad: 'Doğa ve sahil', renk: '#4f9a4a' }
};

// İlgi alanları: listeyi ve haritayı ilgi alanına göre süzmek için. Bir yer birden çok alanda olabilir.
IZ.ILGILER = {
  tarih: { ad: 'Tarih ve mimari', simge: '🏛️' },
  muze: { ad: 'Müze ve sanat', simge: '🎨' },
  yeme: { ad: 'Yeme-içme', simge: '🍽️' },
  alisveris: { ad: 'Alışveriş', simge: '🛍️' },
  eglence: { ad: 'Eğlence ve spor', simge: '🎡' },
  doga: { ad: 'Doğa ve sahil', simge: '🌳' },
  cocuk: { ad: 'Çocuklarla', simge: '🧸' }
};

// Katalogdaki yerlerin türü (js/mekanlar.js) -> renk kategorisi
IZ.TUR_KATEGORI = {
  restoran: 'yeme', meyhane: 'yeme', balik: 'yeme', kahvalti: 'yeme', kafe: 'yeme', pastane: 'yeme',
  sokak: 'alisveris', pazar: 'alisveris', carsi: 'alisveris', avm: 'alisveris', outlet: 'alisveris',
  gece: 'eglence', stadyum: 'eglence', salon: 'eglence', sahne: 'kultur', sinema: 'eglence', spor: 'eglence', lunapark: 'eglence', marina: 'eglence',
  muze: 'kultur', galeri: 'kultur', 'kultur-merkezi': 'kultur', bilim: 'kultur',
  cami: 'dini', kilise: 'dini', sinagog: 'dini', kosk: 'tarihi', han: 'tarihi', antik: 'antik',
  park: 'doga', orman: 'doga', bahce: 'doga', sahil: 'doga', oyun: 'doga', hayvan: 'doga'
};

IZ.YERLER = [
  {
    id: 'saat-kulesi', ad: 'Saat Kulesi', kategori: 'tarihi', semt: 'Konak Meydanı', yil: '1901',
    aciklama: 'İzmir\'in simgesi. II. Abdülhamid\'in tahta çıkışının 25. yılı için yapıldı; temeli 1 Eylül 1900\'de atıldı, 1 Eylül 1901\'de açıldı. Mimarı Fransız Raymond Charles Péré, yüksekliği 25 metre; dört katlı kule, Osmanlı ve Kuzey Afrika etkileri taşıyan oryantalist bir üsluptadır ve çevresini şadırvan biçiminde dört çeşme sarar. Saatinin Alman İmparatoru II. Wilhelm\'in hediyesi olduğu söylenir. Pencerelerdeki padişah tuğraları Cumhuriyet döneminde ay yıldız kabartmalarıyla değiştirildi; 1974 depreminde zarar gören kule onarıldı, son kapsamlı güçlendirme 2019\'da yapıldı. Konak metro istasyonu, Konak tramvay durağı ve Konak vapur iskelesi hemen yanı başındadır.',
    web: 'https://www.visitizmir.org/tr/Destinasyon/14715', webTur: 'resmi',
    ilgi: ['tarih'],
    konum: [-7, -2], boy: 15, alan: 8, hazir: true
  },
  {
    id: 'asansor', ad: 'Tarihi Asansör', kategori: 'tarihi', semt: 'Karataş', yil: '1907',
    aciklama: 'Nesim Levi Bayraklıoğlu tarafından 1907\'de yaptırıldı. Mithatpaşa Caddesi ile yamacın üstündeki Halil Rıfat Paşa semtini birbirine bağlar; aradaki kot farkı yaklaşık 50 metredir ve iki nokta arasında 155 basamaklı bir merdiven de bulunur. Alt kısmı taş, üst katları tuğla olan kademeli kulenin asansörleri önce buharla, sonra suyla çalıştı; 1985\'ten beri elektriklidir. Ayla Ökmen\'in 1983\'te bağışlamasıyla İzmir Büyükşehir Belediyesi\'ne geçti ve 1990\'ların başında çevresiyle birlikte restore edildi. Üst terası Körfez manzarasıyla ünlüdür; girişi Dario Moreno Sokağı\'ndandır ve gün batımı en çok tercih edilen saattir. Mithatpaşa Caddesi\'nden geçen Konak tramvayıyla kolayca ulaşılır.',
    web: 'https://www.visitizmir.org/tr/Destinasyon/14563', webTur: 'resmi',
    ilgi: ['tarih', 'yeme'],
    konum: [-36, -31], boy: 12, alan: 12, hazir: true
  },
  {
    id: 'konak-pier', ad: 'Konak Pier', kategori: 'tarihi', semt: 'Konak', yil: '19. yy sonu',
    aciklama: 'Gümrük binası olarak yapıldı; yapım yılı kaynaklara göre değişir, en sık 1890 verilir. Rıhtım ve gümrük binası imtiyazı 1867\'de alındı, imtiyaz daha sonra Fransız Dussaud Kardeşler\'e geçti; yapının tasarımı Gustave Eiffel\'e atfedilir, ancak bu bilgi belgelerle kesinleşmiş değildir. Gümrük işlevinden sonra 1960\'larda balık hali olarak kullanıldı. 2000\'lerin başında restore edilerek alışveriş merkezine dönüştürüldü; bugün mağazaların yanı sıra sinema ve Körfez\'e bakan teraslı restoranlar barındırır. Konak Meydanı, Konak vapur iskelesi, metro ve tramvay durakları birkaç dakikalık yürüme mesafesindedir; deniz tarafındaki teraslarda gün batımı izlenebilir.',
    web: 'https://www.visitizmir.org/tr/Destinasyon/10363', webTur: 'resmi',
    ilgi: ['alisveris', 'yeme', 'tarih'],
    konum: [-17, 12], boy: 6, alan: 9, hazir: true
  },
  {
    id: 'yali-camii', ad: 'Konak Yalı Camii', kategori: 'dini', semt: 'Konak Meydanı', yil: '18. yy (1755?)',
    aciklama: 'Sekizgen planlı küçük cami; tek kubbesi ve tek şerefeli minaresi vardır, taş ve tuğla karışık örgüyle yapılmıştır. Yapımı genellikle 1755\'e ve Katipzade Mehmed Paşa\'nın eşi Ayşe Hanım\'a atfedilir; kesin kayıt yoktur ve kaynaklara göre bani ile tarihler farklılık gösterir. Adını bir zamanlar denize yakın konumundan alır; Konak Camii ve Ayşe Hanım Camii adlarıyla da anılır. Cephesi Kütahya çinileriyle süslüdür; 1964 onarımında dış cephedeki çinilerin çoğu kaldırıldı, bugün çiniler daha çok pencere ve kapı çevrelerinde görülür. Saat Kulesi\'nin hemen yanında, Konak Meydanı\'ndadır; metro, tramvay ve vapurla kolayca ulaşılır, ziyaret için namaz vakitleri dışı tercih edilmelidir.',
    web: 'https://www.visitizmir.org/tr/Destinasyon/9569', webTur: 'resmi',
    ilgi: ['tarih'],
    konum: [-3, -10], boy: 6, alan: 5, hazir: false
  },
  {
    id: 'kizlaragasi', ad: 'Kızlarağası Hanı', kategori: 'tarihi', semt: 'Kemeraltı', yil: '1744',
    aciklama: 'Hacı Beşir Ağa tarafından 1744\'te yaptırılan avlulu Osmanlı hanı. Yaptıranı, I. Mahmud döneminin ünlü darüssaade ağası (kızlarağası) idi. İki katlı yapının alt katı ticaret ve depolama, üst katı konaklama için kullanılırdı; iç limanın dolmasıyla ticari önemini yitirdi. 1980\'lerin sonu ile 1990\'ların başı arasındaki restorasyonda büyük ölçüde yeniden inşa edildi ve çarşı olarak yeniden açıldı. Bugün Kemeraltı Çarşısı\'nın en bilinen duraklarından biridir; dükkânlarında el sanatları, deri ürünleri, takı ve hediyelik eşya satılır, avlusundaki kafeler Türk kahvesiyle tanınır. Konak ve Çankaya metro istasyonlarından yürüyerek ulaşılabilir.',
    web: 'https://www.visitizmir.org/tr/destinasyon/12451', webTur: 'resmi',
    ilgi: ['alisveris', 'tarih', 'yeme'],
    konum: [6, 3], boy: 6, alan: 6, hazir: false
  },
  {
    id: 'agora', ad: 'Smyrna Agorası', kategori: 'antik', semt: 'Namazgâh', yil: 'MÖ 4. yy',
    aciklama: 'Antik Smyrna\'nın pazar ve toplanma yeri; Helenistik dönemde kuruldu, bugün görülen kalıntıların çoğu Roma dönemine aittir. MS 178 depreminde yıkıldı, İmparator Marcus Aurelius\'un desteğiyle yeniden yapıldı; yeniden yapılan Faustina Kapısı\'nın kilit taşında imparatoriçe Faustina\'nın portresi bulunur ve kapı 2004\'te özgün biçimine kavuşturuldu. Alandaki yaklaşık 165 x 28 metrelik bazilika, kaynaklara göre bilinen en büyük Roma bazilikaları arasındadır; bodrum katındaki duvar yazıları ve çizimleri (grafitiler) benzersiz kabul edilir. Kazılar 1930\'larda başladı, 2000\'lerden beri yeniden sürüyor. Kadifekale\'nin kuzey eteğinde, Namazgâh\'tadır; Konak ve Çankaya metro istasyonlarından Kemeraltı içinden yürüyerek ulaşılabilir.',
    web: 'https://www.visitizmir.org/tr/Destinasyon/10364', webTur: 'resmi',
    ilgi: ['tarih', 'muze'],
    konum: [15, -9], boy: 6, alan: 7, hazir: false
  },
  {
    id: 'kadifekale', ad: 'Kadifekale', kategori: 'antik', semt: 'Pagos Tepesi', yil: 'MÖ 4.-3. yy',
    aciklama: 'Yaklaşık 186 metrelik Pagos Tepesi\'ndeki kale, antik Smyrna\'nın akropolüdür. Efsaneye göre şehrin buraya taşınması Büyük İskender\'in rüyasına dayanır; ilk surlar ölümünden sonra, Antigonos ve Lysimakhos döneminde yapıldı. Surlar 13. yüzyılda Bizans döneminde onarıldı, içine bir sarnıç ve kilise eklendi; Osmanlılar kiliseyi camiye çevirdi. Bugün batı ve güney surları ile beş kule, kırk sütunlu Bizans sarnıcı ve cami kalıntıları ayaktadır; surlar 2015\'te restore edilip aydınlatıldı. Tepeden Körfez, Kemeraltı ve kentin büyük bölümü görülür, gün batımı özellikle sevilir. Konak\'tan kalkan ESHOT otobüsleriyle ya da Agora\'dan yokuş yukarı yürüyerek çıkılabilir.',
    web: 'https://www.visitizmir.org/tr/Destinasyon/9379', webTur: 'resmi',
    ilgi: ['tarih', 'doga'],
    konum: [26, -31], kot: 8, boy: 6, alan: 20, hazir: false
  },
  {
    id: 'pasaport', ad: 'Pasaport İskelesi', kategori: 'tarihi', semt: 'Pasaport', yil: '1884',
    aciklama: 'Kordon üzerindeki tarihi vapur iskelesi. Adını bir zamanlar burada bulunan pasaport dairesinden alır; yapımı kaynaklara göre 1867\'de başlayıp 1880\'lerde tamamlandı, açılışı genellikle 1884 olarak verilir. 1922 yangınında hasar gördü ve 1926\'da Vali Kazım Dirik döneminde Birinci Ulusal Mimarlık üslubunda yeniden yapıldı. İzmir Büyükşehir Belediyesi\'ne aittir ve İZDENİZ tarafından işletilir; buradan başta Karşıyaka olmak üzere Körfez\'in karşı yakasına vapurlar kalkar. Birinci Kordon\'un yürüyüş yolu üzerindedir; gün batımında iskele çevresi ve Kordon kalabalıklaşır, Körfez\'i vapurla geçmek kenti görmenin en keyifli yollarından biridir.',
    web: 'https://www.visitizmir.org/tr/destinasyon/11972', webTur: 'resmi',
    ilgi: ['tarih', 'doga'],
    konum: [-11.5, 27], boy: 6, alan: 6, hazir: false
  },
  {
    id: 'polikarp', ad: 'Aziz Polikarp Kilisesi', kategori: 'dini', semt: 'Alsancak', yil: '1625',
    aciklama: '1625\'te yapılan Katolik kilisesi; İzmir\'in ayakta kalan en eski yapılarından biridir. Adını, 2. yüzyılda İzmir piskoposu olan ve 155 yılı civarında şehit edilen Aziz Polikarp\'tan alır; Fransa\'nın talebi ve Osmanlı izniyle yapıldı. 1688 depremi ve ardından çıkan yangında zarar gördü, sonraki yıllarda onarıldı; 1922 yangınında da hasar gördü. 19. yüzyılın sonundaki genişletme sırasında Saat Kulesi\'nin de mimarı olan Raymond Charles Péré, iç mekâna Aziz Polikarp\'ın hayatını anlatan freskler yaptı. Hâlâ ibadete açık bir kilisedir; ziyaretçilerin ayin saatlerine saygı göstermesi beklenir. Girişi Necatibey Bulvarı tarafındadır ve Konak\'tan yürüme mesafesindedir.',
    web: 'https://www.visitizmir.org/tr/Destinasyon/12098', webTur: 'resmi',
    ilgi: ['tarih'],
    konum: [13, 35], boy: 6, alan: 6, hazir: false
  },
  {
    id: 'ataturk-aniti', ad: 'Atatürk Anıtı', kategori: 'anit', semt: 'Cumhuriyet Meydanı', yil: '1932',
    aciklama: 'İtalyan heykeltıraş Pietro Canonica\'nın eseri olan atlı Atatürk heykeli; 27 Temmuz 1932\'de açıldı. Canonica, İstanbul\'daki Taksim Cumhuriyet Anıtı\'nın da heykeltıraşıdır. Bronz heykelde Atatürk, mareşal üniformasıyla atının üzerinde sağ eliyle denizi işaret eder; bu duruş Ordular, ilk hedefiniz Akdeniz\'dir, ileri! emrini simgeler. Kırmızı Afyon mermerinden kaidenin tasarımı mimar Asım Kömürcü\'ye aittir; kaidedeki bronz kabartmalar Kurtuluş Savaşı\'nı ve ordunun İzmir\'e girişini anlatır. 1922 yangınından sonra planlanan Cumhuriyet Meydanı\'nın merkezindedir; meydan, kutlama ve törenlerin yapıldığı başlıca alandır. Pasaport iskelesine ve Kordon\'a birkaç dakikalık yürüme mesafesindedir.',
    web: 'https://www.visitizmir.org/tr/Destinasyon/9439', webTur: 'resmi',
    ilgi: ['tarih'],
    konum: [3, 45], donus: Math.PI / 2, boy: 6, alan: 6, hazir: false
  },
  {
    id: 'kulturpark', ad: 'Kültürpark ve Paraşüt Kulesi', kategori: 'anit', semt: 'Kültürpark', yil: '1936',
    aciklama: 'İzmir Enternasyonal Fuarı\'na ev sahipliği yapan şehir parkı; 1922 yangınında yanan alan üzerinde, Belediye Başkanı Behçet Uz döneminde kuruldu ve 1 Eylül 1936\'da fuarla birlikte açıldı. Bugün yaklaşık 420 bin metrekarelik alanda binlerce ağaç, sergi ve kongre salonları, Atatürk Açıkhava Tiyatrosu, İzmir Tarih ve Sanat Müzesi, koşu parkuru ve spor alanları bulunur. İçindeki 48 metrelik Paraşüt Kulesi 1937\'de Türk Hava Kurumu tarafından açıldı; 2020 depreminden sonra kullanıma kapatıldı. Fuar her yıl ağustos sonu ile eylül başında düzenlenir ve parkın en kalabalık dönemidir. Basmane metro istasyonu ile Konak tramvayının parka yakın durakları en kolay ulaşım yollarıdır.',
    web: 'https://www.visitizmir.org/tr/Destinasyon/6116', webTur: 'resmi',
    ilgi: ['doga', 'eglence', 'muze'],
    konum: [29, 46], boy: 6, alan: 11, hazir: false
  },
  {
    id: 'cumhuriyet-agaci', ad: 'Cumhuriyet Ağacı Anıtı', kategori: 'anit', semt: 'Gündoğdu Meydanı', yil: '2003',
    aciklama: 'Kordon\'daki Gündoğdu Meydanı\'nda yer alan anıt. Cumhuriyet\'in 80. yılı için heykeltıraş Ferit Özşen tarafından yapıldı ve 2003\'te dikildi; klasik anıt heykellerden farklı, ağaç biçimli soyut tasarımıyla dikkat çeker. Meydan, İzmir Büyükşehir Belediyesi tarafından denizden doldurulan alan üzerinde 1999\'da düzenlendi. Gündoğdu Meydanı bugün kentin konser, miting ve kutlamalarının başlıca adresidir; özellikle 29 Ekim ve 9 Eylül kutlamalarında çok kalabalık olur. Kordon\'un yürüyüş ve bisiklet yolu üzerindedir; Pasaport ve Alsancak iskeleleri arasında, Kordon boyunca yürüyerek kolayca ulaşılır.',
    web: 'https://www.visitizmir.org/tr/Destinasyon/8206', webTur: 'resmi',
    ilgi: ['tarih', 'eglence', 'doga'],
    konum: [6, 61], boy: 6, alan: 6, hazir: false
  },
  {
    id: 'alsancak-gari', ad: 'Alsancak Garı', kategori: 'tarihi', semt: 'Alsancak', yil: '1858',
    aciklama: 'İzmir-Aydın demiryolunun başlangıç istasyonu olarak açılan tarihi gar. Osmanlı Demiryolu Şirketi (ORC) tarafından yapıldı ve 30 Ekim 1858\'de "Punta Garı" adıyla hizmete girdi; Türkiye\'nin en eski gar binalarından biri olarak anılır. 1935\'te TCDD\'nin şirketi satın almasıyla Alsancak Garı adını aldı. Geç Osmanlı üslubuna Ampir ve Barok öğeler katan taş binada vitraylı yüksek tavanlı bir salon, perondaki demir makas çatı ve yaklaşık 1890\'a tarihlenen, İzmir\'in ilk saat kulesi olduğu söylenen bir kule bulunur. Bugün İZBAN banliyö trenlerinin durağıdır; T2 Konak Tramvayı\'nın Alsancak Gar durağı hemen önündedir.',
    web: 'https://tr.wikipedia.org/wiki/Alsancak_Gar%C4%B1', webTur: 'vikipedi',
    ilgi: ['tarih'],
    konum: [23, 71], boy: 6, alan: 7, hazir: false
  },
  {
    id: 'folkart', ad: 'Folkart Towers', kategori: 'modern', semt: 'Bayraklı', yil: '2014',
    aciklama: 'Bayraklı\'daki yeni iş merkezinin simgesi olan, 200 metre yüksekliğindeki ikiz gökdelenler. Mimarı Mehmet Yağcıoğlu\'dur (Yağcıoğlu Mimarlık); temeli 2010\'da atıldı, inşaatı 2011-2014 arasında sürdü. Her biri 47 katlı kulelerde ofisler, konutlar ve ticari alanlar bir arada yer alır; kat sayısı bazı kaynaklarda 45 olarak geçer. Alt katlarında dalgalanan beyaz balkon bantlarıyla tanınır ve tamamlandığında İzmir\'in en yüksek yapıları arasına girdi. Manas Bulvarı üzerindedir; en yakın raylı durak İZBAN\'ın Salhane istasyonudur, kuleler Körfez\'in karşı yakasından, özellikle Kordon\'dan gün batımında iyi görünür.',
    web: 'https://tr.wikipedia.org/wiki/Folkart_Towers', webTur: 'vikipedi',
    ilgi: ['alisveris'],
    konum: [84, 88], boy: 6, alan: 11.5, hazir: false
  },
  {
    id: 'mistral', ad: 'Mistral İzmir', kategori: 'modern', semt: 'Çınarlı', yil: '2017',
    aciklama: 'Biri ofis, biri konut iki kuleden oluşur. 216 metrelik, 48 katlı ofis kulesi İzmir\'in en yüksek yapılarındandır; konut kulesi 154 metredir. Katlar yükseldikçe bir sağa bir sola dönerek kulelere kıvrımlı biçimini verir. Projesi DNA Mimarlık\'a aittir; 2010\'da başlaması planlanan inşaat 2014\'te başladı ve 2017\'de tamamlandı. Ofis kulesi 2017\'den, daha yüksek bir yapının bitirildiği 2024\'e kadar kentin en yüksek binası sayıldı. Çınarlı\'da Ankara Caddesi üzerindedir; metro, İZBAN ve tramvayın buluştuğu Halkapınar aktarma merkezine yakındır.',
    web: 'https://tr.wikipedia.org/wiki/Mistral_Ofis_Kulesi', webTur: 'vikipedi',
    ilgi: ['alisveris'],
    konum: [53, 61], boy: 6, alan: 8
  },
  {
    id: 'ege-perla', ad: 'Ege Perla', kategori: 'modern', semt: 'Çınarlı', yil: '2017',
    aciklama: 'Mimar Emre Arolat\'ın tasarladığı, farklı yükseklikte iki kule ile alışveriş merkezinden oluşan yapı. Alışveriş bölümünün çatısı, iki ucundan yürünerek çıkılan yeşil bir park olarak düzenlenmiştir. Yüksek kulenin yüksekliği kaynaklara göre 186 ya da 210 metredir. İş GYO için geliştirilen karma proje Eylül 2017\'de açıldı; kuleler 46 ve 29 katlıdır ve yaklaşık 125 bin metrekarelik inşaat alanına sahiptir. Mimar, kapalı ve içe dönük AVM\'ler yerine sokağa açılan, doğrusal bir alışveriş alanı hedeflediğini belirtir. Halkapınar metro istasyonundan kısa bir yürüyüşle ulaşılır.',
    web: 'https://www.egeperla.com.tr/', webTur: 'resmi',
    ilgi: ['alisveris', 'yeme'],
    konum: [66, 64], boy: 6, alan: 8
  },
  {
    id: 'kemeralti', ad: 'Kemeraltı Çarşısı', kategori: 'tarihi', semt: 'Kemeraltı', yil: '17. yy',
    aciklama: 'İzmir\'in tarihi çarşısı. İç liman doldukça kazanılan alanda, 17. yüzyılın ortasından itibaren yapılan han ve dükkânlarla büyüdü. Ana aksı Anafartalar Caddesi\'nin kıvrımı eski iç limanın kıyı çizgisini izler. Çarşının içinde Kızlarağası Hanı, Çakaloğlu Hanı, Hisar, Kemeraltı ve Şadırvanaltı camileri ile Havra Sokağı\'ndaki tarihi sinagoglar gibi yapılar bulunur; giyimden kuyumculuğa, baharattan bakır ve deri işlerine kadar her şey satılır. Çevresiyle birlikte "İzmir Tarihi Liman Kenti" adıyla 2020\'de UNESCO Dünya Mirası Geçici Listesi\'ne alındı. Konak metro istasyonu, Konak tramvay durağı veya Konak İskelesi\'nden yürüyerek girilebilir; kalabalıktan kaçınmak için hafta içi sabah saatleri daha rahattır.',
    web: 'https://tr.wikipedia.org/wiki/Kemeralt%C4%B1', webTur: 'vikipedi',
    ilgi: ['alisveris', 'tarih', 'yeme'],
    konum: [3.5, 13], boy: 6, alan: 5.5
  },
  {
    id: 'hisar-camii', ad: 'Hisar Camii', kategori: 'dini', semt: 'Kemeraltı', yil: '1597-98',
    aciklama: 'İzmir merkezindeki tarihi camilerin en büyüğü sayılır. Yaptıranın Aydınoğulları soyundan Yakup Bey olduğu kabul edilir. Adını, önünde durduğu iç liman kalesinden alır. Yapım tarihi kaynaklara göre 1591-92 ya da 1597-98\'dir; caminin yerinde daha önce bir Latin kilisesi bulunduğunu yazan kaynaklar da vardır. Merkezi bir kubbe ve onu çevreleyen küçük kubbelerle örtülüdür; İtalyan etkisi taşıyan üçlü mihrabıyla az rastlanan camilerdendir. Tek şerefeli minaresi 1927\'de yenilendi; 2010 civarındaki restorasyonda kubbedeki özgün kalem işleri ortaya çıkarıldı. Kemeraltı Çarşısı\'nın içinde, Kızlarağası Hanı\'nın hemen yanındadır; en yakın metro istasyonu Çankaya\'dır.',
    web: 'https://tr.wikipedia.org/wiki/Hisar_Camii', webTur: 'vikipedi',
    ilgi: ['tarih'],
    konum: [15, 13], boy: 6, alan: 6
  },
  {
    id: 'basmane-gari', ad: 'Basmane Garı', kategori: 'tarihi', semt: 'Basmane', yil: '1866',
    aciklama: 'İzmir-Kasaba (Turgutlu) demiryolunun başlangıç istasyonu. Hattı işleten İngiliz şirketi (Smyrna Cassaba Railway) tarafından yapıldı ve 25 Ekim 1866\'da açıldı; Alsancak Garı\'ndan sonra Türkiye\'nin en eski ikinci garı olarak anılır. Simetrik, üç bölümlü kesme taş bina neoklasik alınlık ve silmelerle süslüdür; peron saçağını çelik makaslar taşır. Binayı Gustave Eiffel\'in tasarladığı yönündeki yaygın söylentiyi kaynaklar doğrulamaz. 1922 yangınında ağır hasar gördü, sonra onarıldı; 1934\'te TCDD\'ye geçti ve 2022\'de yeni bir restorasyon başladı. Bugün şehirlerarası ve bölgesel trenlerin kalktığı gara M1 metro hattının Basmane istasyonundan doğrudan geçilir.',
    web: 'https://tr.wikipedia.org/wiki/Basmane_Gar%C4%B1', webTur: 'vikipedi',
    ilgi: ['tarih'],
    konum: [33, 25], boy: 6, alan: 7
  },
  {
    id: 'elhamra', ad: 'Elhamra Sahnesi', kategori: 'kultur', semt: 'Konak', yil: '1926',
    aciklama: 'Mimar Tahsin Sermet\'in tasarladığı yapı, bitişiğindeki Milli Kütüphane\'ye gelir sağlamak için sinema olarak açıldı. Bugün İzmir Devlet Opera ve Balesi\'nin sahnesidir. Temeli 1915\'te atıldı; Birinci Dünya Savaşı\'nda duran inşaat, İzmir\'in kurtuluşundan sonra sürdürülerek 1926\'da tamamlandı. "Milli Kütüphane Sineması" olarak da bilinen salonda İzmir\'deki ilk sesli film gösterildi ve 1926\'daki İzmir suikast davasının ilk duruşmaları yapıldı. Sinemaya ilginin azalmasıyla bina 1978\'de Kültür Bakanlığı\'na kiralandı, restore edildi ve 1982\'den beri opera ve bale sahnesi olarak kullanılıyor. Konak Meydanı\'na birkaç dakikalık yürüme mesafesindedir; Konak metro istasyonu en yakın duraktır.',
    web: 'https://www.operabale.gov.tr/', webTur: 'resmi',
    ilgi: ['muze', 'eglence', 'tarih'],
    konum: [-6, -19], boy: 6, alan: 6
  },
  {
    id: 'ataturk-muzesi', ad: 'Atatürk Müzesi', kategori: 'kultur', semt: 'Birinci Kordon', yil: '1875-1880',
    aciklama: 'Kordon\'da bir halı tüccarının yaptırdığı konak. Atatürk İzmir ziyaretlerinde burada kaldı. 1941\'de müze olarak açıldı. Halı tüccarı Takfor\'un 1875-1880 arasında yaptırdığı neoklasik bina, 1922\'den sonra hazineye geçti; İzmir Belediyesi 1926\'da satın alarak eşyalı biçimde Atatürk\'e armağan etti ve Atatürk 1930-1934 arasındaki ziyaretlerinde burada konakladı. Müze, Atatürk\'ün İzmir\'e gelişinin yıl dönümü olan 11 Eylül 1941\'de açıldı. Zemin katta mermer döşemeler ve büyük bir Uşak halısı, üst katta Atatürk\'ün kullandığı toplantı odası, yatak odası ve kütüphane dönemin eşyalarıyla sergilenir. Gündoğdu Meydanı ile Pasaport İskelesi arasında, Kordon boyunca yürüyerek kolayca ulaşılır.',
    web: 'https://izmir.ktb.gov.tr/EN-240777/ataturk-museum.html', webTur: 'resmi',
    ilgi: ['muze', 'tarih'],
    konum: [7.5, 54], donus: Math.PI / 2, boy: 6, alan: 5
  },
  {
    id: 'havagazi', ad: 'Tarihi Havagazı Fabrikası', kategori: 'kultur', semt: 'Alsancak', yil: '1860\'lar',
    aciklama: 'Sokak aydınlatması için havagazı üreten fabrika; bir İngiliz firması tarafından kuruldu ve 1864\'te sokak lambalarına gaz vermeye başladı. İzmir Büyükşehir Belediyesi\'nin restorasyonu 2008\'de tamamlandı; bugün kültür ve etkinlik merkezidir. Kaynaklara göre işletme ruhsatı 1859\'da İngiliz A. Edwards\'a verildi, inşaat 1862\'de başladı ve düzenli üretimin başlangıcı için 1867 de verilir. Fabrika 1935\'te belediyeye geçti, 1994\'te kapandı. Dökümhane, makine dairesi, idare binası ve 46 metrelik baca gibi tescilli yapılar korunarak 2009\'da kültür merkezi olarak açıldı; bahçesinde açık hava konserleri, sergiler ve festivaller düzenlenir. Konak Tramvayı\'nın Havagazı durağı hemen önündedir; yaz akşamlarındaki açık hava etkinlikleri için uygundur.',
    web: 'https://tr.wikipedia.org/wiki/Tarihi_Havagaz%C4%B1_Fabrikas%C4%B1', webTur: 'vikipedi',
    ilgi: ['muze', 'eglence', 'tarih'],
    konum: [37, 65], boy: 6, alan: 7
  },
  {
    id: 'karsiyaka-iskele', ad: 'Karşıyaka İskelesi ve Çarşı', kategori: 'tarihi', semt: 'Karşıyaka', yil: '1884',
    aciklama: 'Körfez vapurlarının Karşıyaka durağı. İlk ahşap iskele 1884\'te Hamidiye vapur şirketi tarafından yapıldı; bugünkü bina 20. yüzyılın ortasına aittir. İskelenin karşısında Karşıyaka Çarşısı başlar. Hamidiye Şirketi aynı yıl körfezde ilk düzenli vapur seferlerini başlatmıştı; Karşıyaka\'nın nüfusu arttıkça iskele yenilendi ve bugünkü terminal binası 1940\'lı-1950\'li yıllarda yapıldı. Bugün İZDENİZ vapurları buradan Konak, Pasaport, Alsancak ve Bostanlı gibi iskelelere sefer yapar. Yaya çarşısı kafeleri, boyozcuları ve dükkânlarıyla canlıdır; Karşıyaka Tramvayı ve İZBAN\'ın Karşıyaka istasyonu yakındadır, gün batımında yapılan vapur yolculuğu körfez manzarası için önerilir.',
    web: 'https://www.izdeniz.com.tr/', webTur: 'resmi',
    ilgi: ['alisveris', 'yeme', 'tarih'],
    konum: [-5, 105.4], boy: 6, alan: 8
  },
  {
    id: 'latife-kosku', ad: 'Latife Hanım Köşkü', kategori: 'kultur', semt: 'Karşıyaka', yil: '1860\'lar',
    aciklama: 'Uşakizade ailesinin yazlık köşkü. Atatürk\'ün annesi Zübeyde Hanım son günlerini burada geçirdi. Karşıyaka Belediyesi\'nin restorasyonunun ardından 2008\'de anı evi olarak açıldı. Köşk, Atatürk\'ün eşi Latife Hanım\'ın ailesine aitti; hastalığı nedeniyle Aralık 1922\'de İzmir\'e gelen Zübeyde Hanım 14 Ocak 1923\'te burada öldü. İki katlı, geç Osmanlı özellikleri taşıyan yapı sonraki yıllarda adliye ve dershane olarak da kullanıldı; belediye 2005\'te kamulaştırdı ve 2016\'da özel müze olarak tescil edildi. 30 Ekim 2020 depreminde hasar gördü ve güçlendirme için kapatıldı; yeniden açılış tarihi kaynaklarda farklı verildiğinden ziyaretten önce durumunu kontrol etmek iyi olur. Bahriye Üçok Bulvarı üzerinde, Karşıyaka sahiline yakındır.',
    web: 'https://tr.wikipedia.org/wiki/Latife_Han%C4%B1m_K%C3%B6%C5%9Fk%C3%BC', webTur: 'vikipedi',
    ilgi: ['muze', 'tarih'],
    konum: [14, 113], donus: Math.PI, boy: 6, alan: 6
  },
  {
    id: 'zubeyde-hanim', ad: 'Zübeyde Hanım Anıt Mezarı', kategori: 'anit', semt: 'Karşıyaka', yil: '1940',
    aciklama: 'Atatürk\'ün annesi Zübeyde Hanım 14 Ocak 1923\'te Karşıyaka\'da öldü ve önce Ferik Osman Paşa Camii\'nin avlusuna defnedildi. 1938\'de Belediye Başkanı Behçet Uz\'un hazırlattığı gösterişli projeyi Atatürk fazla süslü bularak reddetti; yalnızca bir taş, kısa bir yazıt ve mezarın çevresinde bir çocuk parkı istedi. Doğal kaya bloklu anıt mezar, bu isteğe uygun olarak bugünkü biçimini 1940\'ta aldı. Küçük Yamanlar Dağı\'ndan getirilen yaklaşık 10 tonluk pembe kaya üzerinde Zübeyde Hanım\'ın kabartma portresi ve 1923 tarihli yazıt yer alır. Her yıl 14 Ocak\'ta ve Anneler Günü\'nde burada anma törenleri yapılır. Anıt, Zübeyde Hanım Parkı içindedir; Karşıyaka İskelesi\'nden çarşı içinden yürüyerek ulaşılabilir.',
    web: 'https://tr.wikipedia.org/wiki/Zübeyde_Hanım_Anıt_Mezarı', webTur: 'vikipedi',
    ilgi: ['tarih'],
    konum: [30, 115], donus: Math.PI, boy: 6, alan: 6
  },
  {
    id: 'bostanli', ad: 'Bostanlı Gün Batımı Terası', kategori: 'modern', semt: 'Bostanlı', yil: '2016',
    aciklama: 'İzmirDeniz kıyı projesi kapsamında yapılan basamaklı ahşap teras ve Bostanlı Deresi\'nin iki yakasını bağlayan yaya köprüsü. Tasarım Studio Evren Başbuğ\'a aittir. Derenin körfeze döküldüğü noktada birbirine göre konumlandırılan iki yapı, projenin Karşıyaka kıyısı için geliştirilen Karşıkıyı yaklaşımının parçasıdır ve kıyı yürüyüş yolundaki kopukluğu da gidermiştir. Ahşap ve çelikten yapılan köprü ile teras Temmuz 2016\'da kullanıma açıldı ve kısa sürede kentin en sevilen buluşma noktalarından biri oldu. Adından da anlaşılacağı gibi en kalabalık olduğu saatler gün batımıdır. Bostanlı İskelesi ve Karşıyaka tramvayının iskele durağı yakındadır.',
    ilgi: ['doga', 'eglence'],
    konum: [-34, 103.4], boy: 6, alan: 6
  },
  {
    id: 'buyuk-park', ad: 'Bornova Büyük Park', kategori: 'anit', semt: 'Bornova', yil: '1934',
    aciklama: 'Bornova merkezindeki park. 1920\'lere kadar mezarlık olan alan düzenlenerek 1934\'te açıldı. Bugün ilçenin en büyük kent parklarından biridir; içinde Ayfer Feray Açıkhava Tiyatrosu, Uğur Mumcu Kültür ve Sanat Merkezi, Bornova Belediyesi\'nin meclis ve nikâh salonu, çocuk parkı, kafeler ve geniş bir meydan bulunur. Açıkhava tiyatrosu yaz aylarında belediyenin konserlerine ve anma etkinliklerine ev sahipliği yapar; park her yıl Hıdırellez kutlamalarının da adresidir. Yaz akşamlarında etkinlik programına göz atarak gitmek iyi olur; M1 metrosunun Bornova istasyonundan yürüyerek ulaşılabilir.',
    ilgi: ['doga', 'eglence', 'cocuk'],
    konum: [98, 61], boy: 6, alan: 6
  },
  {
    id: 'ege-universitesi', ad: 'Ege Üniversitesi', kategori: 'kultur', semt: 'Bornova', yil: '1955',
    aciklama: '1955\'te kurulan üniversitenin kampüsü Bornova\'dadır. 20 Mayıs 1955\'te Tıp ve Ziraat fakülteleriyle eğitime başlayan üniversite, bugün altmış binden fazla öğrencisiyle Türkiye\'nin büyük devlet üniversitelerindendir; kampüsteki Ege Üniversitesi Hastanesi bölgenin en büyük sağlık merkezlerinden biridir. Rektörlük, Levanten Whittall ailesinin "Büyük Ev" olarak bilinen tarihi köşkünde yer alır. Üniversitenin kaynaklarına göre yapı 18. yüzyıl başında Hollandalı rahibeler için manastır olarak yapıldı, 19. yüzyıl başında Charlton Whittall tarafından satın alındı ve sonradan Hazine\'ye geçti. Kampüste La Fontaine Köşkü, Sarı Köşk ve Wilkinson Evi gibi başka Levanten köşkleri de kullanılmaktadır. M1 metrosunun Ege Üniversitesi ve Bornova istasyonları kampüse yakındır.',
    web: 'https://ege.edu.tr/', webTur: 'resmi',
    ilgi: ['tarih', 'muze'],
    konum: [93, 74], boy: 6, alan: 7
  },
  {
    id: 'yesilova', ad: 'Yeşilova Höyüğü', kategori: 'antik', semt: 'Bornova', yil: 'yaklaşık 8.500 yıl önce',
    aciklama: 'İzmir\'in bilinen en eski yerleşimi. 2003\'te bulundu, 2005\'ten beri kazılıyor. Höyükte yaklaşık MÖ 6500\'den MÖ 4000\'e kadar kesintisiz yaşandığı, yerleşimin Neolitik Çağ\'da kurulup Kalkolitik Çağ\'a uzandığı anlaşılmıştır; üst katmanlarda Roma dönemine ait çiftlik yapıları ve mezarlar da bulunmuştur. Kazılar Ege Üniversitesi\'nden Zafer Derin başkanlığında Kültür ve Turizm Bakanlığı, İzmir Büyükşehir ve Bornova belediyelerinin desteğiyle sürdürülür. Yanındaki ziyaretçi merkezinde Neolitik evlerin birebir canlandırmaları vardır; Bornova Belediyesi\'nin açtığı mimari yarışmayı Evren ve Umut Başbuğ kazanmıştır. Ziyaretçiler çoğunlukla arkeologlar eşliğinde gezdirilir; kazının sürdüğü yaz aylarında gitmek çalışmaları da görme fırsatı verir.',
    web: 'https://yesilova.ege.edu.tr/', webTur: 'resmi',
    ilgi: ['tarih', 'muze', 'cocuk'],
    konum: [86, 58], boy: 6, alan: 6
  },
  {
    id: 'homeros', ad: 'Homeros Vadisi', kategori: 'anit', semt: 'Bornova', yil: '2008',
    aciklama: 'Göletleri ve yürüyüş yollarıyla yaklaşık 7 kilometrelik mesire vadisi. İzmir Büyükşehir Belediyesi tarafından düzenlendi. Vadi Mayıs 2008\'de hizmete açıldı, 2010\'da yeni eklemeler yapıldı. Adını, vadideki bir mağarada antik şair Homeros\'un yaşadığına ilişkin yerel inanıştan alır. Kaynaklara göre düzenlenen alanın uzunluğu 7 ile 9 kilometre arasında verilir ve vadi boyunca yirmi kadar küçük gölet bulunur. Ege Üniversitesi araştırmacıları Kayadibi, Çamiçi ve İkiz Göl çevresinde biyolojik çeşitlilik çalışmaları yürütmektedir. Gölgelik alanlar sınırlı olduğundan ilkbahar ve sonbahar en uygun mevsimlerdir; yanınıza su almanız önerilir.',
    web: 'https://tr.wikipedia.org/wiki/Homeros_Vadisi', webTur: 'vikipedi',
    ilgi: ['doga', 'cocuk'],
    konum: [103.5, 48], boy: 6, alan: 6
  },
  {
    id: 'teleferik', ad: 'Balçova Teleferik', kategori: 'modern', semt: 'Balçova', yil: '1974',
    aciklama: '1974\'te açılan teleferik, 810 metrelik hatla Dede Dağı\'ndaki mesire alanına çıkar. 24 Mart 1974\'te hizmete giren hatta alt ve üst istasyon arasındaki kot farkı yaklaşık 350 metredir. 2000\'lerin sonunda güvenlik nedeniyle kapatıldı; yenilenerek 2015\'te yeniden açıldı. Kapanış 2008\'de Makine Mühendisleri Odası İzmir Şubesi\'nin raporu üzerine oldu; 2013\'te başlayan yenileme sonrasında hat 31 Temmuz 2015\'te sekizer kişilik 20 kabinle yeniden açıldı. Tesisi İzmir Büyükşehir Belediyesi\'nin şirketi İZULAŞ işletir. Üst istasyondan körfez ve kent manzarası açık havada en iyi görünür; bakım dönemlerinde kapanabildiği için gitmeden resmi siteye bakmak iyi olur.',
    web: 'https://www.izmirteleferik.com.tr/', webTur: 'resmi',
    ilgi: ['doga', 'eglence', 'cocuk'],
    konum: [-66, -45], boy: 6, alan: 8
  },
  {
    id: 'balcova-termal', ad: 'Agamemnon Kaplıcaları', kategori: 'antik', semt: 'Balçova', yil: 'Antik Çağ',
    aciklama: 'Antik Çağ\'dan beri bilinen sıcak su kaynakları; Homeros ve Strabon\'da geçer. Rivayete göre Truva Savaşı\'nda yaralanan Agamemnon\'un askerleri burada şifa buldu. Bugün Balçova Termal tesisleridir. İzmir İl Kültür ve Turizm Müdürlüğü de kaplıcaların adını Mykene kralı Agamemnon\'dan aldığını ve Homeros ile coğrafyacı Strabon\'un anlatılarında geçtiğini belirtir; Büyük İskender\'in askerlerinin de burada tedavi edildiğine dair rivayet ise tartışmalıdır. Bölgedeki ilk jeotermal sondaj 1963\'te Maden Tetkik ve Arama tarafından açıldı; tesisler 1983\'ten beri jeotermal suyla ısıtılmaktadır. Bugün otel, termal havuzlar ile kaplıca ve fizik tedavi birimleri hizmet verir. Tesis Balçova merkezindedir ve M1 metrosunun Balçova istasyonuna yakındır.',
    web: 'https://izmir.ktb.gov.tr/EN-348268/hot-springs.html', webTur: 'resmi',
    ilgi: ['tarih', 'doga'],
    konum: [-50, -39], boy: 6, alan: 6
  },
  {
    id: 'deniz-muzesi', ad: 'İnciraltı Deniz Müzesi', kategori: 'kultur', semt: 'İnciraltı', yil: '2007',
    aciklama: '1 Temmuz 2007\'de açılan açık hava deniz müzesi. TCG Ege firkateyni ile TCG Pirireis denizaltısı gezilebilir. Resmî adı İzmir Müze Gemiler olan müze, İzmir Büyükşehir Belediyesi ile Güney Deniz Saha Komutanlığı arasında 2006\'da imzalanan protokolle kuruldu ve Denizcilik ve Kabotaj Bayramı\'nda açıldı; Deniz Kuvvetleri\'nin Deniz Müzeleri Komutanlığı\'na bağlıdır. 1994\'te donanmaya katılan TCG Ege\'nin bazı bölümleri özgün hâliyle korunur, platformunda 2014\'ten beri bir AB 212 helikopteri sergilenir. 1980-2004 arasında görev yapan Pirireis\'in içi özel geçitlerle gezilebilir; 2015\'te hücumbot TCG Kasırga da koleksiyona katıldı. Gemilerin karşısında geleneksel İzmir tekneleri sergilenir. Müze İnciraltı kıyısındadır; dar geçitler nedeniyle rahat ayakkabı önerilir.',
    web: 'https://tr.wikipedia.org/wiki/İnciraltı_Deniz_Müzesi', webTur: 'vikipedi',
    ilgi: ['muze', 'cocuk', 'tarih'],
    konum: [-57, -29], boy: 6, alan: 7
  },
  {
    id: 'yukarikoy', ad: 'Narlıdere Yukarıköy', kategori: 'tarihi', semt: 'Narlıdere', yil: '18. yy',
    aciklama: 'Narlıdere\'nin eski köy çekirdeği. Yaklaşık 300 yıl önce Tahtacı Türkmenleri tarafından kuruldu. İlçe adını dere boyundaki nar ağaçlarından alır. Alevi kültürünü ve geleneklerini bugüne taşıyan yerleşimde, İzmir Valiliği ile Narlıdere Belediyesi\'nin yaklaşık üç yıl süren çalışmasıyla 122 yapının çatı ve cephesi onarıldı; altyapı, aydınlatma ve peyzajı yenilenen alan 2023\'te açıldı. Bölgede, bir kaynağa göre geçmişi 1874\'e uzanan Narlıdere Kültür Evi ile Tahtacı Türkmenlerinin marangozluk, odunculuk ve tarım geleneğini anlatan tarihi cemevi bulunur. Ziyaretçiler için yaklaşık 1 kilometrelik bir yaya yolu düzenlenmiştir. M1 metrosunun Narlıdere Kaymakamlık istasyonundan yokuş yukarı yürüyerek ulaşılabilir.',
    ilgi: ['tarih', 'muze'],
    konum: [-88, -47], boy: 6, alan: 6
  },
  {
    id: 'sahilevleri', ad: 'Sahilevleri Kıyı Parkı', kategori: 'anit', semt: 'Narlıdere', yil: '2010\'lar',
    aciklama: 'Narlıdere\'nin körfez kıyısındaki yürüyüş ve dinlenme alanı. İzmirDeniz projesi kapsamında yaklaşık 2,6 kilometrelik kıyı bandı yeniden düzenlendi. Çalışmaların ilk etabında 1,6 kilometrelik bölüm tamamlanarak kent mobilyaları, yeşil alanlar ve çocuk oyun alanlarıyla donatıldı. Kıyı, körfezin batı ucunda Balçova ve İnciraltı kıyılarının devamında yer alır; yürüyüş, bisiklet ve olta balıkçılığı için kullanılır. Bölgeye yapılması planlanan yat limanı yerel tartışmalara konu olmuştur. Körfeze bakan konumu nedeniyle gün batımında en güzel hâlini alır; M1 metrosunun Narlıdere\'deki istasyonlarından otobüsle bağlantı vardır.',
    ilgi: ['doga', 'cocuk'],
    konum: [-86, -33.2], boy: 6, alan: 6
  },
  {
    id: 'su-kemerleri', ad: 'Kızılçullu Su Kemerleri', kategori: 'antik', semt: 'Şirinyer, Buca', yil: 'Roma-Bizans',
    aciklama: 'Meles Çayı vadisini aşarak Smyrna\'ya su taşıyan kemerler. Yapımı kaynaklara göre Roma ya da Bizans dönemine tarihlenir; Osmanlı döneminde onarılmıştır. İzmir İl Kültür ve Turizm Müdürlüğü yapımı İmparator Augustus dönemine bağlar ve kemerlerin Bizans ve Selçuklu dönemlerinde de onarılarak kullanıldığını belirtir. Kesme taş ve tuğladan örülen yapı üst üste iki sıra kemerden oluşur; ortadaki kemer ötekilerden daha geniş ve yuvarlaktır, yanlardakiler hafif sivridir. Bulunduğu yer eskiden Kızılçullu ya da Paradiso diye anılırdı; 1674\'te tamamlanan Osmanlı dönemi Vezirsuyu kemeriyle karıştırılmamalıdır. Kemerler Şirinyer\'dedir; İZBAN\'ın Şirinyer durağı yakındadır.',
    web: 'https://izmir.ktb.gov.tr/EN-243128/aqueducts-and-bridges.html', webTur: 'resmi',
    ilgi: ['tarih'],
    konum: [50, -17], boy: 6, alan: 6
  },
  {
    id: 'hipodrom', ad: 'Şirinyer Hipodromu', kategori: 'tarihi', semt: 'Şirinyer, Buca', yil: '1856',
    aciklama: 'İlk yarışın 23 Eylül 1856\'da koşulduğu, Türkiye\'nin en eski hipodromu sayılan pist. Türkiye Jokey Kulübü tarafından işletilir ve Kültür ve Turizm Bakanlığı\'nca koruma altındadır. 2000 ve 2015\'te yenilenen hipodromda yaklaşık 1.756 metrelik kum pist, 1.572 metrelik çim pist ve ayrı bir antrenman pisti bulunur; ahırlar ve at hastanesiyle birlikte toplam alan yaklaşık 48 hektardır. 2007\'de Türkiye\'de ilk kez gece yarışları burada düzenlendi; her yıl koşulan Ege Derbisi en önemli yarışıdır. Pistin hemen yanındaki İZBAN Koşu istasyonu, 1970\'te hipodroma hizmet için açılmıştır; trenle gelmek en kolay yoldur.',
    web: 'https://tjk.org/EN/Kurumsal/Static/Page/Hipodromlar', webTur: 'resmi',
    ilgi: ['eglence', 'tarih'],
    konum: [62, -30], boy: 6, alan: 8
  },
  {
    id: 'hasanaga', ad: 'Hasanağa Bahçesi', kategori: 'anit', semt: 'Buca', yil: '1925',
    aciklama: 'Levanten Aliotti ailesinin bahçesiydi; Aliotti\'nin burada küçük bir hayvanat bahçesi kurduğu anlatılır. Aliotti\'nin ölümünden sonra mirasçılarından satın alan Ödemişli eşraftan Hasan Ağa\'nın adıyla anılır; satış yılı kaynaklara göre 1925 ya da 1926\'dır. Hasan Ağa bahçeyi halka açık tuttu ve yaklaşık yüz yıldır Buca\'nın en büyük parkıdır. Bugün İzmir Büyükşehir Belediyesi\'nin işlettiği yaklaşık 96 bin metrekarelik parkta 2013\'teki yenilemenin ardından 1.400 metrelik koşu yolu, bisiklet yolu, spor sahaları, kaykay alanı ve oyun parkları bulunur. Yapımı süren Buca Metrosu\'nun Hasanağa Bahçesi istasyonu tamamlandığında parka raylı sistemle ulaşılabilecek; o zamana kadar Buca otobüsleri en pratik yoldur.',
    web: 'https://tr.wikipedia.org/wiki/Hasanağa_Bahçesi', webTur: 'vikipedi',
    ilgi: ['doga', 'cocuk'],
    konum: [74, -9], boy: 6, alan: 7
  },
  {
    id: 'buca-golet', ad: 'Buca Gölet', kategori: 'anit', semt: 'Buca', yil: '1999',
    aciklama: 'Buca Belediyesi\'nin kurduğu yapay gölet ve mesire alanı. Kaynaklar semtinde yer alan tesis, Kültür ve Turizm İl Müdürlüğü\'ne göre Nisan 1998\'de açıldı ve Mart 1999\'da halkın hizmetine girdi. Yaklaşık 167 bin metrekarelik alanın 30 bin metrekaresini gölet kaplar. Çevresinde yürüyüş yolları, seyir terasları, piknik ve mangal alanları, çocuk parkı, kafe ve restoran bulunur. Belediyenin yenilediği ve bugün Zeki & Metin Amfi Tiyatro adını taşıyan açık hava sahnesinde ilkbahar ve yaz aylarında konser ve tiyatro gösterileri yapılır. Yaz akşamları serinlemek ve bir etkinliğe denk gelmek için en uygun zamandır.',
    web: 'https://tr.wikipedia.org/wiki/Buca_Gölet', webTur: 'vikipedi',
    ilgi: ['doga', 'cocuk', 'eglence'],
    konum: [80, -24], boy: 6, alan: 6
  },
  {
    id: 'kus-cenneti', ad: 'İzmir Kuş Cenneti', kategori: 'anit', semt: 'Sasalı', yil: '1982',
    aciklama: 'Gediz Deltası\'nın Çiğli kıyısında, Çamaltı Tuzlası çevresindeki yaklaşık 8 bin hektarlık sulak alan. 1982\'de su kuşları koruma ve üreme sahası ilan edildi, 1985\'te birinci derece doğal sit oldu; delta 15 Nisan 1998\'den beri Ramsar alanıdır. Kaydedilen kuş türü sayısı kaynaklara göre 205 ile yaklaşık 300 arasında değişir. Flamingoların Türkiye\'deki iki üreme alanından biridir; 2012\'de yapımına başlanan yapay flamingo adasında her yaz binlerce yavru dünyaya gelir. Alanı İzmir Kuş Cennetini Koruma ve Geliştirme Birliği (İZKUŞ) yönetir. Ziyaretçi merkezinden sonra gözlem kulelerinden dürbünle kuşlar izlenebilir; göç dönemleri olan ilkbahar ve sonbahar en zengin gözlem mevsimleridir.',
    web: 'https://izmirkuscenneti.gov.tr/', webTur: 'resmi',
    ilgi: ['doga'],
    konum: [-108, 99.6], boy: 6, alan: 8
  },
  {
    id: 'dogal-yasam', ad: 'İzmir Doğal Yaşam Parkı', kategori: 'anit', semt: 'Sasalı', yil: '2008',
    aciklama: '30 Kasım 2008\'de açılan, İzmir Büyükşehir Belediyesi\'nin işlettiği hayvanat bahçesi. Yaklaşık 425 dönümlük alanda 120\'den fazla türden hayvan yaşar; Vikipedi\'ye göre 2023 itibarıyla yaklaşık 1.800 hayvan ve 132 tür vardır. Afrika savanı bölümü ve Asya filleriyle bilinir; ayrıca maymun adaları, tropik merkez, yırtıcı kuşlar bölümü ve küçük çocuklara yönelik bir çiftlik bölümü bulunur. Kâr amacı gütmeyen park 2011\'den beri Avrupa Hayvanat Bahçeleri ve Akvaryumları Birliği (EAZA) üyesidir ve yılda yüz binlerce ziyaretçi ağırlar. Karşıyaka İskelesi\'nden ve Çiğli Aktarma Merkezi\'nden kalkan ESHOT otobüsleriyle ulaşılır; alan geniş olduğundan rahat ayakkabı önerilir.',
    web: 'https://izmirdogalyasamparki.izmir.bel.tr/', webTur: 'resmi',
    ilgi: ['cocuk', 'doga'],
    konum: [-97, 118], boy: 6, alan: 7
  },
  {
    id: 'aosb', ad: 'Atatürk Organize Sanayi Bölgesi', kategori: 'modern', semt: 'Çiğli', yil: '1990',
    aciklama: '1990\'da faaliyete geçen İzmir Atatürk Organize Sanayi Bölgesi yaklaşık 6,2 milyon metrekarelik bir alana yayılır. Kentin kuzeybatısında, Çiğli\'de yer alır ve çevre yoluyla limana, havalimanına ve kent merkezine bağlanır. Bölge yönetimine göre yaklaşık 600 firmada 50 bin kadar kişi çalışır. Tekstil ve hazır giyim, makine, otomotiv yan sanayi, metal, plastik, kimya, gıda ile elektrik-elektronik başlıca sektörlerdir. Bölge İzmir\'in en önemli üretim ve ihracat merkezlerinden biridir; doluluk oranına ulaştığı için yeni bir genişleme alanı planlanmaktadır. Turistik bir yer değildir; bölgeye Çiğli Tramvayı ve İZBAN\'ın Çiğli istasyonu üzerinden ulaşılabilir.',
    web: 'https://www.iaosb.org.tr', webTur: 'resmi',
    ilgi: [],
    konum: [-68, 122], boy: 6, alan: 8
  },
  {
    id: 'havalimani', ad: 'Adnan Menderes Havalimanı', kategori: 'modern', semt: 'Gaziemir', yil: '1987',
    aciklama: '17 Kasım 1987\'de açılan havalimanı şehir merkezinin yaklaşık 14 kilometre güneyindedir; arazisi Gaziemir ve Menderes ilçelerine yayılır. Adını eski başbakan Adnan Menderes\'ten alır. Dış hatlar terminali 2006\'da, bugünkü iç hatlar terminali 2014\'te açıldı; eski dış hatlar binası bir süre iç hatlar için kullanıldı. Devlet Hava Meydanları İşletmesi\'ne ait olan havalimanını TAV Havalimanları işletir; 2023\'te yaklaşık 10,5 milyon yolcu ağırladı. İç hatlar terminalinin önündeki istasyon İZBAN banliyö treniyle Alsancak\'a ve metro aktarmalarıyla kent merkezine bağlanır; ayrıca Denizli, Ödemiş, Tire ve Nazilli yönüne bölgesel trenler kalkar.',
    web: 'https://www.adnanmenderesairport.com', webTur: 'resmi',
    ilgi: ['alisveris', 'yeme'],
    konum: [24, -113], boy: 6, alan: 11.5
  },
  {
    id: 'fuar-izmir', ad: 'Fuar İzmir', kategori: 'modern', semt: 'Gaziemir', yil: '2015',
    aciklama: '25 Mart 2015\'te açılan fuar ve kongre alanı. İzmir Büyükşehir Belediyesi\'ne aittir ve İZFAŞ fuarlarına ev sahipliği yapar. Yaklaşık 330 bin metrekarelik arazisiyle Türkiye\'nin en büyük fuar alanlarından biridir; kaynaklara göre arsa 330 ile 337 bin metrekare arasında verilir. Dört büyük kapalı sergi holü, açık sergi alanı, seminer salonları, kafe-restoran bölümü ve yaklaşık 2.500 araçlık otoparkı vardır. Mermer, düğün ve moda, tarım ve gıda gibi alanlarda uluslararası ihtisas fuarları burada düzenlenir. Çevre yolu üzerindedir; havalimanına yaklaşık 10, kent merkezine 15 dakika uzaklıktadır. Ziyaret öncesinde güncel fuar takvimine resmi siteden bakmak gerekir.',
    web: 'https://www.fuarizmir.com.tr', webTur: 'resmi',
    ilgi: ['eglence'],
    konum: [53, -94], boy: 6, alan: 8.5
  },
  {
    id: 'serbest-bolge', ad: 'Ege Serbest Bölgesi ve Uzay Kampı', kategori: 'modern', semt: 'Gaziemir', yil: '1990',
    aciklama: '1990\'da faaliyete geçen serbest bölge, Türkiye\'de özel sektörün kurduğu ilk serbest bölge olarak anılır. Mersin ve Antalya\'dan sonra ülkenin üçüncü serbest bölgesidir. 1989\'da kurulan ESBAŞ (Ege Serbest Bölge Kurucu ve İşleticisi A.Ş.) bölgeyi 14 Ağustos 1990\'dan beri 99 yıllık işletme hakkıyla yönetir. Gaziemir\'de yaklaşık 2,2–2,5 kilometrekarelik alana yayılan bölge, ticaret hacmiyle Türkiye\'nin en büyük serbest bölgesidir. İçindeki Uzay Kampı Türkiye, ESBAŞ tarafından kurularak 12 Haziran 2000\'de açıldı; çocuk ve gençlere yönelik uzay ve bilim kampları düzenler. Bölgeye giriş denetimlidir; kampa katılım önceden kayıtla olur. En yakın raylı durak İZBAN\'ın ESBAŞ istasyonudur.',
    web: 'https://www.esbas.com.tr', webTur: 'resmi',
    ilgi: ['cocuk'],
    konum: [-5, -98], boy: 6, alan: 8
  },
  {
    id: 'guntekin', ad: 'Reşat Nuri Güntekin Çocuk Kütüphanesi', kategori: 'kultur', semt: 'Bozyaka', yil: '2004',
    aciklama: 'Reşat Nuri Güntekin\'in "Çalıkuşu" romanını yazdığı kabul edilen bağ evi; ancak bazı kaynaklar burada yazılan eserin "Dudaktan Kalbe" olduğunu belirtir. Yeni Asır\'a göre 1873\'te Kilimcizade ailesi tarafından yapılan kâgir ev, uzun süre boş kaldıktan sonra Konak Belediyesi tarafından restore edildi ve çocuk kütüphanesi olarak açıldı; açılış yılı kaynaklara göre 2004 ya da 2006\'dır. Bugün Karabağlar Belediyesi\'ne bağlı kütüphanede yaklaşık 5 bin kitap bulunur ve çocuklara yönelik atölyeler düzenlenir. Çevresindeki mahalle adını romandan alarak Çalıkuşu olmuştur. Bozyaka\'nın iki katlı taş "kule" bağ evleri 1950\'lere kadar yazlık olarak kullanılırdı. Çevresi Kilimtepe Parkı olarak düzenlenmiştir.',
    ilgi: ['cocuk', 'muze'],
    konum: [-12, -59], boy: 6, alan: 6.5
  },
  {
    id: 'demokrasi-uni', ad: 'İzmir Demokrasi Üniversitesi', kategori: 'kultur', semt: 'Üçkuyular', yil: '2016',
    aciklama: '2016\'da kurulan devlet üniversitesi. 6745 sayılı Kanun ile 20 Ağustos 2016\'da kuruldu. Merkez yerleşkesi Karabağlar\'ın Üçkuyular semtinde, Gürsel Aksel Bulvarı üzerindedir; bu yerleşke daha önce 2016\'da kapatılan İzmir Üniversitesi\'nin kullandığı binalardır. Tıp, Diş Hekimliği, Hukuk, Mühendislik, Mimarlık, Fen-Edebiyat, Eğitim, Güzel Sanatlar, Sağlık Bilimleri ile İktisadi ve İdari Bilimler fakülteleri; yabancı diller ve meslek yüksekokulları bulunur. Son yıllarda ek yerleşke ve bina arayışları gündeme gelmiştir. Üçkuyular\'daki yerleşke, metronun son durağı Fahrettin Altay ile Üçkuyular İskelesi\'ne yakındır; kampüs ziyaretine açık bir turistik yer değildir.',
    web: 'https://idu.edu.tr', webTur: 'resmi',
    ilgi: [],
    konum: [-14, -78], boy: 6, alan: 7.5
  },
  {
    id: 'kavacik', ad: 'Kavacık Köyü ve Bağları', kategori: 'tarihi', semt: 'Kavacık', yil: '19. yy',
    aciklama: '19. yüzyılın ilk yarısında Yörüklerin kurduğu, taş evleriyle bilinen köy. Vikipedi\'ye göre konargöçer Türkmen aşiretleri Kızıldağlar\'ın ormanlık yamaçlarını 15. yüzyıldan beri kullanıyordu; köy bugünkü adını 1891\'den beri taşır. Kent merkezine yaklaşık 27 kilometre uzaklıkta, 525 metre yükseklikte yer alır; 2012\'den beri Karabağlar\'ın kırsal bir mahallesidir ve nüfusu 700 dolayındadır. Yer bağları biçiminde yetiştirilen Kavacık üzümü 2019\'da coğrafi işaret aldı; her eylülde Karabağlar Belediyesi\'nin düzenlediği üzüm festivali yapılır. Karabağlar\'ın adını da bir zamanlar yamaçlarını kaplayan kara üzüm bağlarından aldığı söylenir. Hasat dönemi olan ağustos sonu ve eylül en uygun ziyaret zamanıdır.',
    web: 'https://tr.wikipedia.org/wiki/Kavacık,_Karabağlar', webTur: 'vikipedi',
    ilgi: ['doga', 'yeme', 'tarih'],
    konum: [28, -74], boy: 6, alan: 8
  }
];

// İlgi alanı kataloğundaki yerler (js/mekanlar.js, araclar/mekanlar.json dosyasından üretilir)
(IZ.MEKANLAR || []).forEach((m) => IZ.YERLER.push(Object.assign({ kategori: IZ.TUR_KATEGORI[m.tur] || 'kultur', boy: 4, kucuk: true }, m)));

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
    y.ilce = y.ilce || Object.keys(ilceYerleri).find((i) => ilceYerleri[i].includes(y.id)) || 'Konak';
    y.ilgi = y.ilgi || [];
  });
  // İlçe sırasıyla; ilçe içinde önce simge yapılar, sonra katalogdaki yerler
  IZ.YERLER.sort((a, b) => IZ.ILCELER.indexOf(a.ilce) - IZ.ILCELER.indexOf(b.ilce) || !!a.kucuk - !!b.kucuk);
})();
