import React from 'react';
import SEO from '../../components/SEO';

const TermsOfService = () => {
  return (
    <>
      <SEO title="Mesafeli Satış Sözleşmesi" canonical="/mesafeli-satis-sozlesmesi" noindex={true} />
      <div className="bg-white min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Başlık */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-black text-gray-900 mb-4">Kullanım Koşulları</h1>
            <p className="text-gray-600">Son Güncelleme: 16 Ocak 2026</p>
          </div>

          {/* İçerik */}
          <div className="prose prose-lg max-w-none">
            
            {/* 1. Genel Hükümler */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Genel Hükümler</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                İşbu Kullanım Koşulları ("Sözleşme"), www.bigboss.com.tr ("Web Sitesi") üzerinden 
                sunulan hizmetlerin kullanımına ilişkin şartları düzenlemektedir. Web Sitesi, 
                Big Boss Tekstil ve Giyim Sanayi Ticaret Limited Şirketi ("Şirket", "Big Boss", "Biz") 
                tarafından işletilmektedir.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Web Sitesini ziyaret ederek veya kullanarak, bu Kullanım Koşulları'nı okuduğunuzu, 
                anladığınızı ve kabul ettiğinizi beyan etmektesiniz. Bu koşulları kabul etmiyorsanız, 
                lütfen Web Sitesini kullanmayınız.
              </p>
            </section>

            {/* 2. Taraflar */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Taraflar</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1. SATICI</h3>
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <p className="text-gray-700 mb-2"><strong>Ünvan:</strong> Big Boss Tekstil</p>
                <p className="text-gray-700 mb-2"><strong>Adres:</strong> MEŞRUTİYET MAH. HALASKARGAZİ CAD. NO: 150 B ŞİŞLİ/İSTANBUL</p>
                <p className="text-gray-700 mb-2"><strong>Telefon:</strong> 530 774 99 86</p>
                <p className="text-gray-700 mb-2"><strong>E-posta:</strong> bigbosstextil1972@gmail.com</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2. ALICI</h3>
              <p className="text-gray-700 leading-relaxed">
                Web Sitesi üzerinden sipariş veren gerçek veya tüzel kişi ("Müşteri", "Alıcı", "Siz").
              </p>
            </section>

            {/* 3. Sözleşmenin Konusu */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Sözleşmenin Konusu</h2>
              <p className="text-gray-700 leading-relaxed">
                İşbu Sözleşme, Alıcı'nın Satıcı'ya ait Web Sitesi üzerinden elektronik ortamda 
                sipariş verdiği ürün veya hizmetin satışı ve teslimi ile ilgili olarak 6502 sayılı 
                Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri 
                gereğince tarafların hak ve yükümlülüklerini düzenler.
              </p>
            </section>

            {/* 4. Ürün/Hizmet Bilgileri */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Ürün/Hizmet Bilgileri</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Web Sitesinde yer alan ürünlere ilişkin temel özellikler, satış fiyatları ve ödeme 
                şekilleri ilgili ürünün detay sayfasında yer almaktadır. Ürün fiyatlarına KDV dahildir.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1. Ürün Görselleri</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Web Sitesinde yer alan ürün görselleri, tarayıcı ve ekran ayarlarınıza bağlı olarak 
                gerçek ürün renkleriyle farklılık gösterebilir. Satıcı, bu farklılıklardan sorumlu tutulamaz.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2. Fiyat Değişiklikleri</h3>
              <p className="text-gray-700 leading-relaxed">
                Satıcı, Web Sitesindeki fiyatları ve kampanyaları önceden haber vermeksizin değiştirme 
                hakkını saklı tutar. Ancak, sipariş onaylanmış ürünlerin fiyatları değişmez.
              </p>
            </section>

            {/* 5. Sipariş Süreci */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sipariş Süreci</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1. Sipariş Oluşturma</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
                <li>Ürünü sepete ekleyin</li>
                <li>Üye girişi yapın veya misafir olarak devam edin</li>
                <li>Teslimat adresini girin</li>
                <li>Ödeme yöntemini seçin</li>
                <li>Ön Bilgilendirme Formu'nu ve Mesafeli Satış Sözleşmesi'ni okuyup onaylayın</li>
                <li>"Siparişi Onayla" butonuna tıklayın</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2. Sipariş Onayı</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Siparişiniz tamamlandıktan sonra, kayıtlı e-posta adresinize sipariş özeti gönderilir. 
                Bu e-posta, sözleşmenin kurulduğuna dair bir bildirimdir.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3. Sipariş Onay Hakkı</h3>
              <p className="text-gray-700 leading-relaxed">
                Satıcı, teknik hatalar, stok yetersizliği veya ödeme sorunları durumunda siparişi 
                reddetme hakkını saklı tutar. Bu durumda Alıcı derhal bilgilendirilir ve ödeme 
                iade edilir.
              </p>
            </section>

            {/* 6. Ödeme */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Ödeme</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1. Ödeme Yöntemleri</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Kredi Kartı (Tek Çekim / Taksit)</li>
                <li>Banka Kartı</li>
                <li>Havale / EFT</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2. Güvenlik</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Tüm kredi kartı bilgileri SSL güvenlik sertifikası ile şifrelenmektedir. Kredi kartı 
                bilgileriniz hiçbir şekilde Satıcı tarafından görülmez veya saklanmaz. İşlemler, 
                3D Secure sistemi ile güvence altındadır.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3. Taksit Seçenekleri</h3>
              <p className="text-gray-700 leading-relaxed">
                Taksit seçenekleri, anlaşmalı bankalar ve kampanyalara göre değişiklik gösterir. 
                Taksit faizi, banka tarafından uygulanır ve Satıcı'nın sorumluluğunda değildir.
              </p>
            </section>

            {/* 7. Teslimat */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Teslimat</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1. Teslimat Süresi</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ürünler, siparişin onaylanmasından itibaren en geç 30 (otuz) gün içerisinde 
                kargo ile teslim edilir. Özel durumlarda (bayram, kampanya yoğunluğu vb.) 
                bu süre uzayabilir.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2. Kargo Bedeli</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                2000 TL ve üzeri alışverişlerde kargo ücretsizdir. Altındaki tutarlarda kargo 
                bedeli sepet toplamına eklenir ve ödeme sırasında gösterilir.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.3. Teslimat Adresi</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ürünler, sipariş sırasında belirtilen adrese teslim edilir. Alıcı, teslimat 
                sırasında adresinde bulunmalıdır. Kargo şirketi, adres değişikliği veya eksik 
                adres nedeniyle teslimat yapamadığı takdirde, ürün Satıcı'ya iade edilir.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.4. Teslim Alma</h3>
              <p className="text-gray-700 leading-relaxed">
                Ürün teslim alınırken, kargo görevlisi önünde paketin hasar kontrolü yapılmalıdır. 
                Hasarlı paketler kabul edilmemelidir. Hasarlı teslimat durumunda, tutanak tutularak 
                kargo şirketi ve Satıcı bilgilendirilmelidir.
              </p>
            </section>

            {/* 8. Cayma Hakkı */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cayma Hakkı</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1. Cayma Süresi</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Alıcı, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içerisinde hiçbir 
                gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2. Cayma Hakkının Kullanılması</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cayma hakkını kullanmak için:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
                <li>Web sitesindeki "İade/İptal Talebi" formunu doldurun veya</li>
                <li>Müşteri hizmetleri ile iletişime geçin (bigbosstextil1972@gmail.com)</li>
                <li>Ürünü orijinal ambalajında, kullanılmamış ve etiketli şekilde kargoya verin</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.3. İade Koşulları</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                İade edilecek ürünün:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Kullanılmamış olması</li>
                <li>Orijinal ambalajında olması</li>
                <li>Etiketlerinin zarar görmemiş olması</li>
                <li>Hijyenik açıdan uygun olması (iç giyim, mayo, bikini vb.)</li>
                <li>Fatura veya iade formu ile birlikte gönderilmesi</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.4. Cayma Hakkı Kullanılamayacak Ürünler</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Aşağıdaki ürünlerde cayma hakkı kullanılamaz:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>İç giyim ürünleri (hijyen nedeniyle, açılmış ise)</li>
                <li>Mayo, bikini vb. deniz ürünleri (açılmış ise)</li>
                <li>Kulak küpesi, piercing vb. takılar (hijyen nedeniyle)</li>
                <li>Kişiye özel üretilmiş veya değişiklik yapılmış ürünler</li>
                <li>İndirim kuponları, hediye çekleri</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.5. İade Süreci ve Para İadesi</h3>
              <p className="text-gray-700 leading-relaxed">
                İade edilen ürün Satıcı'ya ulaştıktan ve kontrol edildikten sonra, 14 (on dört) 
                gün içerisinde ödeme iadesi yapılır. İade, ödeme yöntemine göre kredi kartına 
                veya banka hesabına gerçekleştirilir. Kargo ücreti, ürün Satıcı'nın hatası 
                nedeniyle iade edilmiyorsa Alıcı'ya aittir.
              </p>
            </section>

            

            {/* 9. Fikri Mülkiyet Hakları */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Fikri Mülkiyet Hakları</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Web Sitesinde yer alan tüm içerikler (metin, görsel, logo, grafik, video, yazılım vb.) 
                Satıcı'ya aittir ve telif hakkı yasaları ile korunmaktadır.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Web Sitesindeki içeriklerin izinsiz kopyalanması, çoğaltılması, dağıtılması veya 
                başka şekilde kullanılması yasaktır ve yasal işlem gerektirir.
              </p>
            </section>

            {/* 10. Sorumluluk Sınırlaması */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Sorumluluk Sınırlaması</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Satıcı, aşağıdaki durumlardan sorumlu tutulamaz:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Alıcı'nın hatalı veya eksik adres bilgisi vermesi</li>
                <li>Kargo şirketinin gecikmesi veya kaybı</li>
                <li>Mücbir sebepler (doğal afet, savaş, pandemi vb.)</li>
                <li>İnternet altyapısından kaynaklanan teknik sorunlar</li>
                <li>Üçüncü taraf web sitelerine verilen linkler</li>
                <li>Alıcı'nın kendi güvenlik hatalarından kaynaklanan veri kayıpları</li>
              </ul>
            </section>

            {/* 11. Uyuşmazlıkların Çözümü */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Uyuşmazlıkların Çözümü</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                İşbu Sözleşme'den doğabilecek uyuşmazlıklarda, Türkiye Cumhuriyeti yasaları uygulanır.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Tüketici şikayetleri için öncelikle Satıcı müşteri hizmetleri ile iletişime geçilmelidir:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>E-posta: bigbosstextil1972@gmail.com</li>
                <li>Telefon: 530 774 99 86</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Çözüm sağlanamazsa, T.C. Gümrük ve Ticaret Bakanlığı tarafından her yıl belirlenen 
                parasal sınırlar dâhilinde alıcının yerleşim yerindeki veya satın alımın 
                gerçekleştirildiği yerdeki Tüketici Hakem Heyetleri veya Tüketici Mahkemeleri 
                yetkilidir.
              </p>
            </section>

            {/* 12. Yürürlük */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Yürürlük</h2>
              <p className="text-gray-700 leading-relaxed">
                İşbu Kullanım Koşulları, Web Sitesini kullanmaya başladığınız anda yürürlüğe girer. 
                Satıcı, bu koşulları önceden haber vermeksizin değiştirme hakkını saklı tutar. 
                Değişiklikler, Web Sitesinde yayınlandığı andan itibaren geçerlidir.
              </p>
            </section>

            {/* 13. İletişim */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. İletişim</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Sorularınız, önerileriniz veya şikayetleriniz için bizimle iletişime geçebilirsiniz:
                </p>
                <p className="text-gray-700">
                  <strong>Big Boss Tekstil</strong><br />
                  <strong>Adres:</strong> MEŞRUTİYET MAH. HALASKARGAZİ CAD. NO: 150 B ŞİŞLİ/İSTANBUL <br />
                  <strong>Telefon:</strong> 530 774 99 86<br />
                  <strong>E-posta:</strong> bigbosstextil1972@gmail.com<br />
                </p>
              </div>
            </section>

            {/* Son Güncelleme */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Bu kullanım koşulları en son 16 Ocak 2026 tarihinde güncellenmiştir.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;