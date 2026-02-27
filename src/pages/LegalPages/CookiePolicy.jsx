import React from 'react';
import { Cookie, Shield, Settings, Eye } from 'lucide-react';
import SEO from '../../components/SEO';

const CookiePolicy = () => {
  return (
    <>
      <SEO title="Çerez Politikası" canonical="/cerez-politikasi" noindex={true} />
      <div className="bg-white min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Başlık */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
              <Cookie size={40} className="text-yellow-600" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Çerez Politikası</h1>
            <p className="text-gray-600">Web sitemizde kullanılan çerezler hakkında bilgilendirme</p>
            <p className="text-sm text-gray-500 mt-2">Son Güncelleme: 16 Ocak 2026</p>
          </div>

          {/* İçerik */}
          <div className="prose prose-lg max-w-none">
            
            {/* 1. Çerez Nedir? */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Çerez (Cookie) Nedir?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Çerezler, ziyaret ettiğiniz web siteleri tarafından bilgisayarınıza veya mobil 
                cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler, web sitelerinin daha 
                verimli çalışmasını sağlar ve site sahiplerine bilgi sağlar.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Çerezlerin Amacı</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                  <li>Web sitesinin düzgün çalışmasını sağlamak</li>
                  <li>Kullanıcı deneyimini geliştirmek</li>
                  <li>Tercihlerinizi hatırlamak (dil, bölge vb.)</li>
                  <li>Sepetinizdeki ürünleri saklamak</li>
                  <li>Güvenlik önlemleri almak</li>
                  <li>Web sitesi performansını analiz etmek</li>
                  <li>Kişiselleştirilmiş içerik sunmak</li>
                </ul>
              </div>
            </section>

            {/* 2. Çerez Türleri */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Kullandığımız Çerez Türleri</h2>
              
              {/* Zorunlu Çerezler */}
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <Shield className="text-red-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">2.1. Zorunlu Çerezler</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Bu çerezler, web sitesinin temel işlevlerini yerine getirmesi için gereklidir 
                      ve devre dışı bırakılamazlar. Güvenlik, dil tercihi ve oturum yönetimi gibi 
                      işlevler için kullanılır.
                    </p>
                    <div className="bg-white p-4 rounded">
                      <p className="text-xs font-semibold text-gray-900 mb-2">Örnek Kullanımlar:</p>
                      <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                        <li>Giriş yapma durumunu hatırlama</li>
                        <li>Sepet içeriğini saklama</li>
                        <li>Güvenlik önlemleri (CSRF token)</li>
                        <li>Yük dengeleme</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* İşlevsellik Çerezleri */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <Settings className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">2.2. İşlevsellik Çerezleri</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Web sitesinin gelişmiş özelliklerini ve kişiselleştirme seçeneklerini sunmak 
                      için kullanılır. Bu çerezler olmadan bazı hizmetler kullanılamayabilir.
                    </p>
                    <div className="bg-white p-4 rounded">
                      <p className="text-xs font-semibold text-gray-900 mb-2">Örnek Kullanımlar:</p>
                      <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                        <li>Dil tercihinizi hatırlama</li>
                        <li>Bölge/konum ayarları</li>
                        <li>Favorilere eklenen ürünler</li>
                        <li>Son görüntülenen ürünler</li>
                        <li>Görünüm tercihleri (grid/list)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performans Çerezleri */}
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <Eye className="text-green-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">2.3. Performans ve Analitik Çerezleri</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Web sitesinin nasıl kullanıldığını anlamamıza yardımcı olan bilgiler toplar. 
                      Bu veriler, site performansını iyileştirmek için anonim olarak toplanır.
                    </p>
                    <div className="bg-white p-4 rounded">
                      <p className="text-xs font-semibold text-gray-900 mb-2">Kullandığımız Araçlar:</p>
                      <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                        <li><strong>Google Analytics:</strong> Ziyaretçi istatistikleri ve davranış analizi</li>
                        <li><strong>Hotjar:</strong> Kullanıcı etkileşim haritaları</li>
                        <li><strong>Google Tag Manager:</strong> Tag yönetimi</li>
                      </ul>
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Toplanan Veriler:</strong> Sayfa görüntülemeleri, tıklama oranları, 
                        ziyaret süresi, cihaz bilgisi, tarayıcı türü (anonim)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pazarlama Çerezleri */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <Cookie className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">2.4. Pazarlama ve Hedefleme Çerezleri</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Sizinle ilgili reklamlar göstermek için kullanılır. Ayrıca bir reklamın kaç 
                      kez gösterildiğini sınırlamak ve reklam kampanyalarının etkinliğini ölçmek 
                      için kullanılır.
                    </p>
                    <div className="bg-white p-4 rounded">
                      <p className="text-xs font-semibold text-gray-900 mb-2">Kullandığımız Platformlar:</p>
                      <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                        <li><strong>Google Ads:</strong> Arama ve display reklamları</li>
                        <li><strong>Facebook Pixel:</strong> Sosyal medya reklamları</li>
                        <li><strong>Instagram Pixel:</strong> Instagram reklamları</li>
                        <li><strong>TikTok Pixel:</strong> TikTok reklamları</li>
                      </ul>
                      <div className="bg-yellow-50 p-2 rounded mt-2">
                        <p className="text-xs text-gray-700">
                          ⚠️ Bu çerezleri <strong>reddetebilirsiniz</strong> - Web sitemizi 
                          kullanmaya devam edebilirsiniz ancak size özel reklamlar göremezsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Çerez Detay Tablosu */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Çerez Detay Tablosu</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Çerez Adı</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Tür</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Süre</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Açıklama</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">session_id</td>
                      <td className="border border-gray-200 px-4 py-2">Zorunlu</td>
                      <td className="border border-gray-200 px-4 py-2">Oturum</td>
                      <td className="border border-gray-200 px-4 py-2">Kullanıcı oturumunu yönetir</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">cart_items</td>
                      <td className="border border-gray-200 px-4 py-2">Zorunlu</td>
                      <td className="border border-gray-200 px-4 py-2">7 gün</td>
                      <td className="border border-gray-200 px-4 py-2">Sepet içeriğini saklar</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">csrf_token</td>
                      <td className="border border-gray-200 px-4 py-2">Zorunlu</td>
                      <td className="border border-gray-200 px-4 py-2">Oturum</td>
                      <td className="border border-gray-200 px-4 py-2">Güvenlik tokeni</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">lang_pref</td>
                      <td className="border border-gray-200 px-4 py-2">İşlevsellik</td>
                      <td className="border border-gray-200 px-4 py-2">1 yıl</td>
                      <td className="border border-gray-200 px-4 py-2">Dil tercihini saklar</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">_ga</td>
                      <td className="border border-gray-200 px-4 py-2">Analitik</td>
                      <td className="border border-gray-200 px-4 py-2">2 yıl</td>
                      <td className="border border-gray-200 px-4 py-2">Google Analytics - Ziyaretçi ID</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">_gid</td>
                      <td className="border border-gray-200 px-4 py-2">Analitik</td>
                      <td className="border border-gray-200 px-4 py-2">24 saat</td>
                      <td className="border border-gray-200 px-4 py-2">Google Analytics - Oturum ID</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">_fbp</td>
                      <td className="border border-gray-200 px-4 py-2">Pazarlama</td>
                      <td className="border border-gray-200 px-4 py-2">3 ay</td>
                      <td className="border border-gray-200 px-4 py-2">Facebook Pixel</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">_gcl_au</td>
                      <td className="border border-gray-200 px-4 py-2">Pazarlama</td>
                      <td className="border border-gray-200 px-4 py-2">3 ay</td>
                      <td className="border border-gray-200 px-4 py-2">Google Ads</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. Çerez Yönetimi */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Çerezleri Nasıl Yönetebilirsiniz?</h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🍪 Çerez Ayarları</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Web sitemizin alt kısmındaki "Çerez Ayarları" butonuna tıklayarak çerez tercihlerinizi 
                  istediğiniz zaman değiştirebilirsiniz. Zorunlu çerezler hariç tüm çerezleri 
                  kapatabilirsiniz.
                </p>
                <button className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                  Çerez Ayarlarını Yönet
                </button>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Tarayıcı Ayarları</h3>
              <p className="text-gray-700 mb-4">
                Çerezleri tarayıcınızın ayarlarından da yönetebilirsiniz:
              </p>

              <div className="space-y-3">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Google Chrome</h4>
                  <p className="text-sm text-gray-700">
                    Ayarlar → Gizlilik ve Güvenlik → Çerezler ve diğer site verileri
                  </p>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Mozilla Firefox</h4>
                  <p className="text-sm text-gray-700">
                    Ayarlar → Gizlilik ve Güvenlik → Çerezler ve Site Verileri
                  </p>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Safari</h4>
                  <p className="text-sm text-gray-700">
                    Tercihler → Gizlilik → Çerezleri engelle
                  </p>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Microsoft Edge</h4>
                  <p className="text-sm text-gray-700">
                    Ayarlar → Gizlilik, arama ve hizmetler → Çerezler ve site izinleri
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                <p className="text-sm text-gray-700">
                  <strong>⚠️ Uyarı:</strong> Çerezleri tamamen engellerseniz, web sitemizin bazı 
                  özellikleri düzgün çalışmayabilir. Özellikle zorunlu çerezlerin engellenmesi, 
                  sepet ve giriş işlemlerini etkileyebilir.
                </p>
              </div>
            </section>

            {/* 5. Üçüncü Taraf Çerezleri */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Üçüncü Taraf Çerezleri</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Web sitemizde bazı üçüncü taraf hizmet sağlayıcılarının çerezleri de kullanılmaktadır. 
                Bu çerezler, ilgili şirketlerin gizlilik politikalarına tabidir:
              </p>

              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Web sitesi trafiğini ve kullanıcı davranışlarını analiz etmek için kullanılır.
                  </p>
                  <a href="https://policies.google.com/privacy" 
                     className="text-blue-600 hover:underline text-sm"
                     target="_blank" 
                     rel="noopener noreferrer">
                    Google Gizlilik Politikası →
                  </a>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Facebook/Meta Pixel</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Sosyal medya reklamlarının etkinliğini ölçmek için kullanılır.
                  </p>
                  <a href="https://www.facebook.com/privacy/explanation" 
                     className="text-blue-600 hover:underline text-sm"
                     target="_blank" 
                     rel="noopener noreferrer">
                    Meta Gizlilik Politikası →
                  </a>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Google Ads</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Remarketing ve reklam kampanyalarını yönetmek için kullanılır.
                  </p>
                  <a href="https://policies.google.com/technologies/ads" 
                     className="text-blue-600 hover:underline text-sm"
                     target="_blank" 
                     rel="noopener noreferrer">
                    Google Reklam Politikası →
                  </a>
                </div>
              </div>
            </section>

            {/* 6. Reklam Kişiselleştirmesi */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Reklam Kişiselleştirmesini Kapatma</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kişiselleştirilmiş reklamları görmek istemiyorsanız, aşağıdaki bağlantıları kullanabilirsiniz:
              </p>

              <div className="bg-blue-50 p-6 rounded-lg">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">→</span>
                    <div>
                      <a href="https://optout.aboutads.info/" 
                         className="text-blue-600 hover:underline font-semibold"
                         target="_blank" 
                         rel="noopener noreferrer">
                        Digital Advertising Alliance (DAA)
                      </a>
                      <p className="text-sm text-gray-600">ABD tabanlı reklam ağları için</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">→</span>
                    <div>
                      <a href="https://www.youronlinechoices.com/" 
                         className="text-blue-600 hover:underline font-semibold"
                         target="_blank" 
                         rel="noopener noreferrer">
                        Your Online Choices
                      </a>
                      <p className="text-sm text-gray-600">Avrupa tabanlı reklam ağları için</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">→</span>
                    <div>
                      <a href="https://adssettings.google.com/" 
                         className="text-blue-600 hover:underline font-semibold"
                         target="_blank" 
                         rel="noopener noreferrer">
                        Google Reklam Ayarları
                      </a>
                      <p className="text-sm text-gray-600">Google reklamlarını kişiselleştirme</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">→</span>
                    <div>
                      <a href="https://www.facebook.com/ads/preferences/" 
                         className="text-blue-600 hover:underline font-semibold"
                         target="_blank" 
                         rel="noopener noreferrer">
                        Facebook Reklam Tercihleri
                      </a>
                      <p className="text-sm text-gray-600">Facebook reklamlarını yönetme</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* 7. Haklarınız */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. KVKK Kapsamındaki Haklarınız</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Çerezler yoluyla toplanan kişisel verilerinizle ilgili olarak aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Verilerinizin silinmesini veya yok edilmesini talep etme</li>
                <li>İşlenen verilerin otomatik sistemlerle analiz edilmesine itiraz etme</li>
                <li>Kanuna aykırı işleme sebebiyle zarara uğramanız halinde tazminat talep etme</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Bu haklarınızı kullanmak için <a href="/gizlilik-politikasi" className="text-blue-600 hover:underline">Gizlilik Politikası</a> sayfamızı 
                inceleyebilir veya kvkk@bigboss.com.tr adresine e-posta gönderebilirsiniz.
              </p>
            </section>

            {/* 8. Güncellemeler */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Politika Güncellemeleri</h2>
              <p className="text-gray-700 leading-relaxed">
                Bu Çerez Politikası, yasal düzenlemeler veya hizmet değişiklikleri nedeniyle 
                güncellenebilir. Önemli değişiklikler yapıldığında, web sitemizde bildirim 
                yayınlanacaktır. Güncel politikayı düzenli olarak kontrol etmenizi öneririz.
              </p>
            </section>


            {/* Son Güncelleme */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Bu çerez politikası en son 16 Ocak 2026 tarihinde güncellenmiştir.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;