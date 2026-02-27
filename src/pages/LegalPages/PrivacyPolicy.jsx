import React from 'react';
import SEO from '../../components/SEO';

const PrivacyPolicy = () => {
  return (
    <>
      <SEO title="Gizlilik Politikası" canonical="/gizlilik-politikasi" noindex={true} />
      <div className="bg-white min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Başlık */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-black text-gray-900 mb-4">Gizlilik Politikası</h1>
            <p className="text-gray-600">Son Güncelleme: 16 Ocak 2026</p>
          </div>

          {/* İçerik */}
          <div className="prose prose-lg max-w-none">
            
            {/* 1. Giriş */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Giriş</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Big Boss olarak, müşterilerimizin kişisel verilerinin güvenliği ve gizliliği en önemli önceliğimizdir. 
                Bu Gizlilik Politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında 
                kişisel verilerinizin nasıl toplandığını, işlendiğini, korunduğunu ve paylaşıldığını açıklamaktadır.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Hizmetlerimizi kullanarak, bu Gizlilik Politikası'nda belirtilen koşulları kabul etmiş sayılırsınız.
              </p>
            </section>

            {/* 2. Veri Sorumlusu */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Veri Sorumlusu</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">Şirket Unvanı:</p>
                <p className="text-gray-700 mb-4">Big Boss Tekstil</p>
                
                <p className="text-gray-700 font-semibold mb-2">Adres:</p>
                <p className="text-gray-700 mb-4">MEŞRUTİYET MAH. HALASKARGAZİ CAD. NO: 150 B ŞİŞLİ/İSTANBUL</p>
                
                <p className="text-gray-700 font-semibold mb-2">İletişim:</p>
                <p className="text-gray-700">
                  E-posta: bigbosstextil1972@gmail.com<br />
                  Telefon: 530 774 99 86
                </p>
              </div>
            </section>

            {/* 3. Toplanan Kişisel Veriler */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Toplanan Kişisel Veriler</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1. Kimlik Bilgileri</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Ad, Soyad</li>
                <li>T.C. Kimlik Numarası (Fatura için gerekli olduğunda)</li>
                <li>Doğum Tarihi</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2. İletişim Bilgileri</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>E-posta Adresi</li>
                <li>Cep Telefonu Numarası</li>
                <li>Teslimat Adresi</li>
                <li>Fatura Adresi</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3. İşlem Güvenliği Bilgileri</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>IP Adresi</li>
                <li>Çerez Bilgileri</li>
                <li>Tarayıcı Türü ve Versiyonu</li>
                <li>İşletim Sistemi</li>
                <li>Ziyaret Edilen Sayfalar</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.4. Müşteri İşlem Bilgileri</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Sipariş Geçmişi</li>
                <li>Ödeme Bilgileri (Kredi kartı bilgileri saklanmaz)</li>
                <li>Favori Ürünler</li>
                <li>Sepet İçeriği</li>
                <li>İade ve Değişim Talepleri</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.5. Pazarlama Bilgileri</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>İlgi Alanları</li>
                <li>Ürün Tercihleri</li>
                <li>Kampanya Tercih Bilgileri</li>
              </ul>
            </section>

            {/* 4. Kişisel Verilerin İşlenme Amaçları */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Kişisel Verilerin İşlenme Amaçları</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Sipariş süreçlerinin yönetimi ve teslimatın gerçekleştirilmesi</li>
                <li>Müşteri hizmetleri ve destek taleplerinin yerine getirilmesi</li>
                <li>Fatura düzenlenmesi ve muhasebe işlemlerinin yürütülmesi</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                <li>Kampanya, promosyon ve pazarlama faaliyetlerinin yürütülmesi (İzin dahilinde)</li>
                <li>Web sitesi ve hizmetlerin geliştirilmesi</li>
                <li>Güvenlik ve fraud önleme</li>
                <li>İstatistik ve analiz çalışmaları</li>
              </ul>
            </section>

            {/* 5. Kişisel Verilerin Aktarılması */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Kişisel Verilerin Aktarılması</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kişisel verileriniz, yasal zorunluluklar ve hizmet gereklilikleri çerçevesinde 
                aşağıdaki taraflarla paylaşılabilir:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1. Yurt İçi Aktarımlar</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Kargo Şirketleri:</strong> Ürün teslimatı için</li>
                <li><strong>Ödeme Kuruluşları:</strong> Ödeme işlemlerinin gerçekleştirilmesi için</li>
                <li><strong>Muhasebe Danışmanları:</strong> Fatura ve finans süreçleri için</li>
                <li><strong>Hosting Sağlayıcıları:</strong> Veri depolama ve yönetimi için</li>
                <li><strong>SMS/E-posta Sağlayıcıları:</strong> Bilgilendirme mesajları için</li>
                <li><strong>Yasal Merciler:</strong> Yasal zorunluluk halinde</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2. Yurt Dışı Aktarımlar</h3>
              <p className="text-gray-700 leading-relaxed">
                Kişisel verileriniz, yalnızca hizmet sağlayıcılarımızın sunucularının yurt dışında 
                olması durumunda ve KVKK'nın 9. maddesi uyarınca yeterli korumaya sahip ülkelere 
                veya açık rızanızla aktarılabilir.
              </p>
            </section>

            {/* 6. Kişisel Verilerin Korunması */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Kişisel Verilerin Korunması</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kişisel verilerinizin güvenliğini sağlamak için aşağıdaki teknik ve idari tedbirler alınmıştır:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>SSL sertifikası ile şifreli veri iletimi</li>
                <li>Güvenli sunucu altyapısı ve firewall koruması</li>
                <li>Düzenli güvenlik güncellemeleri ve yama yönetimi</li>
                <li>Erişim yetkilendirmesi ve loglama</li>
                <li>Personel gizlilik taahhütnameleri</li>
                <li>Düzenli güvenlik denetimleri</li>
                <li>Veri yedekleme sistemleri</li>
              </ul>
            </section>

            {/* 7. Çerezler (Cookies) */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Çerezler (Cookies)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Web sitemiz, kullanıcı deneyimini geliştirmek ve site performansını analiz etmek amacıyla 
                çerezler kullanmaktadır. Çerezler hakkında detaylı bilgi için 
                <a href="/cerez-politikasi" className="text-blue-600 hover:underline ml-1">Çerez Politikası</a> 
                sayfamızı inceleyebilirsiniz.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Tarayıcı ayarlarınızdan çerezleri reddedebilir veya silebilirsiniz. Ancak bu durumda 
                web sitesinin bazı özellikleri düzgün çalışmayabilir.
              </p>
            </section>

            {/* 8. KVKK Kapsamındaki Haklarınız */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. KVKK Kapsamındaki Haklarınız</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                KVKK'nın 11. maddesi uyarınca, kişisel verilerinizle ilgili olarak aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
                <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
                <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme</li>
                <li>Kişisel verilerin düzeltilmesi, silinmesi ya da yok edilmesi halinde bu işlemlerin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
                <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme</li>
              </ul>
            </section>

            {/* 9. Başvuru Yöntemi */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Başvuru Yöntemi</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                KVKK kapsamındaki haklarınızı kullanmak için aşağıdaki yöntemlerle başvuruda bulunabilirsiniz:
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Yazılı Başvuru</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Adres:</strong> MEŞRUTİYET MAH. HALASKARGAZİ CAD. NO: 150 B ŞİŞLİ/İSTANBUL
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Konu:</strong> "KVKK Kapsamında Bilgi Talep Başvurusu"
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">E-posta ile Başvuru</h3>
                <p className="text-gray-700">
                  <strong>E-posta:</strong> bigbosstextil1972@gmail.com<br />
                  <small className="text-gray-600">
                    (Başvurunuz kayıtlı elektronik posta (KEP) adresi, güvenli elektronik imza, 
                    mobil imza veya başvuruda bulunacak kişi tarafından Şirketimize daha önce bildirilen 
                    ve sistemimizde kayıtlı bulunan e-posta adresinden yapılabilir)
                  </small>
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Cevaplama Süresi:</strong> Başvurunuz en geç 30 (otuz) gün içerisinde 
                ücretsiz olarak sonuçlandırılacaktır. Ancak işlemin ayrıca bir maliyeti gerektirmesi 
                halinde, Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifedeki ücret 
                talep edilebilir.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-gray-700 text-sm">
                  <strong>Önemli Not:</strong> Başvurunuzda kimliğinizi tespit edici gerekli bilgiler ile 
                  başvurunuzla ilgili açıklamaların bulunması gerekmektedir. Kimlik tespiti için nüfus cüzdanı 
                  fotokopisi veya elektronik imza gibi belgeler talep edilebilir.
                </p>
              </div>
            </section>

            {/* 10. Veri Saklama Süreleri */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Veri Saklama Süreleri</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kişisel verileriniz, işleme amacının gerekli kıldığı süre boyunca ve yasal saklama 
                yükümlülüklerimiz çerçevesinde saklanmaktadır:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Müşteri Hesap Bilgileri:</strong> Hesap aktif olduğu sürece + 5 yıl</li>
                <li><strong>Sipariş ve Fatura Bilgileri:</strong> Vergi Usul Kanunu gereği 10 yıl</li>
                <li><strong>İletişim Kayıtları:</strong> 3 yıl</li>
                <li><strong>Pazarlama İzinleri:</strong> İzin geri alınana kadar veya 2 yıl boyunca işlem yapılmaması halinde</li>
                <li><strong>Web Sitesi Logları:</strong> 2 yıl</li>
              </ul>
            </section>

            {/* 11. Reşit Olmayanlar */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Reşit Olmayanlar</h2>
              <p className="text-gray-700 leading-relaxed">
                Hizmetlerimiz 18 yaş ve üzeri kullanıcılara yöneliktir. 18 yaşın altındaki bireylerin 
                kişisel verilerini bilerek toplamıyoruz. Eğer 18 yaşından küçük bir bireye ait kişisel 
                veri topladığımızı fark edersek, bu verileri derhal sileriz. Böyle bir durumla 
                karşılaşırsanız lütfen bizimle iletişime geçin.
              </p>
            </section>

            {/* 12. Politika Değişiklikleri */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Politika Değişiklikleri</h2>
              <p className="text-gray-700 leading-relaxed">
                Bu Gizlilik Politikası, yasal düzenlemeler veya hizmet değişiklikleri nedeniyle 
                güncellenebilir. Önemli değişiklikler olması durumunda, kayıtlı e-posta adresinize 
                bildirim gönderilecektir. Güncel politikayı düzenli olarak kontrol etmenizi öneririz.
              </p>
            </section>

        

            {/* Son Güncelleme */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Bu gizlilik politikası en son 16 Ocak 2026 tarihinde güncellenmiştir.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;