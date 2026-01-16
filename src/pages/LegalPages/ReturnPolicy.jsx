import React from 'react';
import { Package, Truck, RefreshCcw, Shield, AlertCircle } from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <>
      <div className="bg-white min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Başlık */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-black text-gray-900 mb-4">İptal ve İade Koşulları</h1>
            <p className="text-gray-600">14 Gün İçinde Koşulsuz İade</p>
          </div>

          {/* Hızlı Bilgi Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Package className="mx-auto mb-2 text-blue-600" size={32} />
              <h3 className="font-bold text-gray-900 text-sm mb-1">14 Gün</h3>
              <p className="text-xs text-gray-600">İade Süresi</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <RefreshCcw className="mx-auto mb-2 text-green-600" size={32} />
              <h3 className="font-bold text-gray-900 text-sm mb-1">Kolay İade</h3>
              <p className="text-xs text-gray-600">3 Adımda</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Truck className="mx-auto mb-2 text-purple-600" size={32} />
              <h3 className="font-bold text-gray-900 text-sm mb-1">Ücretsiz</h3>
              <p className="text-xs text-gray-600">Kargo İadesi</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Shield className="mx-auto mb-2 text-orange-600" size={32} />
              <h3 className="font-bold text-gray-900 text-sm mb-1">Hızlı İade</h3>
              <p className="text-xs text-gray-600">14 Gün İçinde</p>
            </div>
          </div>

          {/* İçerik */}
          <div className="prose prose-lg max-w-none">
            
            {/* 1. Cayma Hakkı */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Cayma Hakkı Nedir?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği 
                uyarınca, tüketiciler mesafeli satış yoluyla satın aldıkları ürünleri teslim aldıkları 
                tarihten itibaren <strong>14 (on dört) gün</strong> içerisinde hiçbir gerekçe göstermeden 
                ve cezai şart ödemeden iade edebilirler.
              </p>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <p className="text-gray-700 text-sm">
                  <strong>✓ Önemli:</strong> Cayma hakkı süresi, ürünü teslim aldığınız günden başlar 
                  ve 14 gün boyunca geçerlidir. Bu süre içinde herhangi bir sebep belirtmeden iade 
                  talebinde bulunabilirsiniz.
                </p>
              </div>
            </section>

            {/* 2. İade Nasıl Yapılır? */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. İade Nasıl Yapılır?</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Adım 1: İade Talebi Oluşturun</h3>
                  <p className="text-gray-700 mb-2">
                    Hesabınıza giriş yaparak "Siparişlerim" bölümünden iade etmek istediğiniz ürünü 
                    seçin ve "İade Et" butonuna tıklayın.
                  </p>
                 
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Adım 2: Ürünü Hazırlayın</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Ürünü orijinal ambalajına koyun</li>
                    <li>Tüm etiketlerin yerinde olduğundan emin olun</li>
                    <li>Fatura veya irsaliye kopyasını ekleyin</li>
                    <li>İade formunu doldurup pakete ekleyin</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Adım 3: Kargoya Verin</h3>
                  <p className="text-gray-700 mb-2">
                    Size gönderilen iade kargo kodu ile ürünü en yakın kargo şubesine teslim edin. 
                    Kargo ücreti bizden!
                  </p>
                  <div className="bg-yellow-50 p-3 rounded mt-2">
                    <p className="text-sm text-gray-700">
                      <strong>Not:</strong> İade kargo kodunuz 24 saat içinde e-posta ve SMS olarak 
                      size iletilecektir.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            

            {/* 3. Para İadesi */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Para İadesi Nasıl Yapılır?</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">🕐 İade Süresi</h3>
                  <p className="text-gray-700 text-sm">
                    İade edilen ürün depolarımıza ulaştıktan ve kalite kontrolünden geçtikten sonra, 
                    <strong> en geç 14 (on dört) gün</strong> içerisinde ödemeniz iade edilir.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">💳 Kredi Kartı ile Ödemeler</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Kredi kartı ile yapılan ödemelerde iade tutarı, alışverişte kullandığınız kredi 
                    kartına yansıtılır. Bankanızın işlem süresine bağlı olarak bu tutar 2-10 iş günü 
                    içinde hesabınızda görünür.
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Taksitli alışverişlerde:</strong> İade tutarı, banka tarafından taksit 
                    sayısına bölünerek her ay kart ekstrenize yansıtılır.
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">🏦 Havale/EFT ile Ödemeler</h3>
                  <p className="text-gray-700 text-sm">
                    Havale veya EFT ile ödeme yaptıysanız, iade tutarı hesabınıza yapılır. 
                    Bunun için IBAN bilgilerinizi iade talebinde belirtmeniz gerekir.
                  </p>
                </div>

              </div>
            </section>

            {/* 5. Değişim */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Ürün Değişimi</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Satın aldığınız ürünü farklı beden, renk veya modeliyle değiştirmek isterseniz:
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Hızlı Değişim Seçeneği</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>İade talebinizde "Değişim istiyorum" seçeneğini işaretleyin</li>
                  <li>İstediğiniz yeni ürünü belirtin (beden/renk/model)</li>
                  <li>Eski ürünü kargoya verin</li>
                  <li>Yeni ürününüz tarafınıza gönderilir (kargo bizden!)</li>
                </ol>
                <div className="bg-white p-3 rounded mt-3">
                  <p className="text-sm text-gray-700">
                    <strong>Fiyat Farkı:</strong> Değişim yapacağınız ürünün fiyatı farklıysa, 
                    fark tutarı tahsil edilir veya iade edilir.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">⚠️ Stok Durumu</h3>
                <p className="text-gray-700 text-sm">
                  Değişim talep ettiğiniz ürün stokta yoksa, size haber verilir ve isterseniz başka 
                  bir ürün seçebilir veya iade işlemine devam edebilirsiniz.
                </p>
              </div>
            </section>

            {/* 6. Hasarlı/Hatalı Ürün */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Hasarlı veya Hatalı Ürün Teslimi</h2>
              
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-4">
                <h3 className="font-semibold text-red-900 mb-3">🚨 Acil Durum Prosedürü</h3>
                <p className="text-gray-700 mb-3">
                  Size ulaşan üründe hasar veya hata tespit ederseniz:
                </p>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-3">
                  <li>Ürünü kargo görevlisi önünde kontrol edin</li>
                  <li>Hasar varsa kargo görevlisine tutanak tutturun</li>
                  <li>Hasarlı paketi kabul etmeyin veya "hasarlı teslim aldım" notu düşürün</li>
                  <li>Fotoğraf çekin (hasar kanıtı için)</li>
                </ol>
                <div className="bg-white p-3 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Garanti:</strong> Hasarlı veya hatalı ürün teslimatında, yeni ürün 
                    <strong> derhal ve ücretsiz</strong> olarak tarafınıza gönderilir. Kargo masrafları 
                    tamamen bize aittir.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">📝 Gerekli Belgeler</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Kargo tutanağı (hasarlı teslimat belgesi)</li>
                  <li>Ürün fotoğrafları (hasarın net görüldüğü)</li>
                  <li>Fatura veya irsaliye</li>
                </ul>
              </div>
            </section>

            {/* 7. Kargo Bedeli */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. İade Kargo Bedeli</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">✓ Biz Karşılıyoruz</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Hasarlı/hatalı ürün</li>
                    <li>• Yanlış ürün gönderimi</li>
                    <li>• Eksik ürün teslimatı</li>
                    <li>• Ürün açıklamasına uymama</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">📦 Size Ücretsiz Kod</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Cayma hakkı kullanımı</li>
                    <li>• Beden/renk değişimi</li>
                    <li>• Fikir değiştirme</li>
                    <li>• (Kargo kodu bizden)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-gray-700">
                  <strong>Önemli:</strong> Tüm iade işlemlerinde kargo kodu <strong>ücretsiz</strong> olarak 
                  size gönderilir. Hiçbir iade işleminde kargo ücreti ödemezsiniz!
                </p>
              </div>
            </section>

            {/* 8. SSS */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Sık Sorulan Sorular</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">❓ Ürünü denedim, iade edebilir miyim?</h3>
                  <p className="text-gray-700 text-sm">
                    Evet, ürünü evinizde deneyebilirsiniz. Ancak iade edeceğiniz ürün kullanılmamış, 
                    yıkanmamış ve etiketli olmalıdır. Parfüm, deodorant, ter, leke vb. etkilere maruz 
                    kalmış ürünler iade edilemez.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">❓ Etiket koptu, iade edebilir miyim?</h3>
                  <p className="text-gray-700 text-sm">
                    Maalesef hayır. Etiketler ürünle birlikte olmalıdır. Etiket koparılmış ürünler 
                    iade edilemez.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">❓ İndirimli ürün iade edilir mi?</h3>
                  <p className="text-gray-700 text-sm">
                    Evet, indirimli ürünler de normal ürünler gibi 14 gün içinde iade edilebilir. 
                    İndirim kuponları ise iade edilemez.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">❓ Hediye olarak aldığım ürünü iade edebilir miyim?</h3>
                  <p className="text-gray-700 text-sm">
                    Evet, hediye ürünler de iade edilebilir. İade tutarı, hediyeyi satın alan kişinin 
                    ödeme yöntemine iade edilir veya hediye kartı olarak size verilebilir.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">❓ Param ne zaman iade edilir?</h3>
                  <p className="text-gray-700 text-sm">
                    İade ettiğiniz ürün depomıza ulaştıktan ve kontrolü yapıldıktan sonra en geç 
                    14 gün içinde paranız iade edilir. Kredi kartına yansıma süresi bankanıza bağlıdır 
                    (2-10 iş günü).
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">❓ Kısmi iade yapabilir miyim?</h3>
                  <p className="text-gray-700 text-sm">
                    Evet, birden fazla ürün aldıysanız, istediğiniz ürünleri iade edebilirsiniz. 
                    Tüm siparişi iade etmeniz gerekmez.
                  </p>
                </div>
              </div>
            </section>

            {/* 9. İletişim */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. İletişim</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  İade sürecinizle ilgili her türlü soru ve destek için 7/24 müşteri hizmetlerimizle 
                  iletişime geçebilirsiniz:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>📞 Telefon:</strong> 530 774 99 86</p>
                  <p><strong>📧 E-posta:</strong> bigbosstextil1972@gmail.com</p>
                  <p><strong>🕐 Çalışma Saatleri:</strong> Hafta içi 09:00 - 18:00</p>
                </div>
              </div>
            </section>

            {/* Son Güncelleme */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Bu iade ve iptal koşulları en son 16 Ocak 2026 tarihinde güncellenmiştir.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnPolicy;