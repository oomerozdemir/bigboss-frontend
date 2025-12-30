import React, { useState } from 'react';
import { Plus, Minus, Search, HelpCircle } from 'lucide-react';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("Genel");
  const [openIndex, setOpenIndex] = useState(null);

  // KATEGORİLER VE SORULAR
  const faqData = {
    "Genel": [
      { q: "Big Boss ürünleri nerede üretiliyor?", a: "Tüm ürünlerimiz İstanbul'daki fabrikamızda, yerli üretim kalitesiyle üretilmektedir." },
      { q: "Mağazalarınız hangi saatlerde açık?", a: "Nişantaşı ve Osmanbey mağazalarımız haftanın her günü 09:00 - 20:00 saatleri arasında hizmet vermektedir." },
    ],
    "Sipariş & Kargo": [
      { q: "Siparişim ne zaman kargoya verilir?", a: "Hafta içi 15:00'e kadar verilen siparişler aynı gün kargoya teslim edilir." },
      { q: "Hangi kargo firmalarıyla çalışıyorsunuz?", a: "Yurtiçi Kargo ve Aras Kargo ile anlaşmamız bulunmaktadır." },
      { q: "Kargo ücreti ne kadar?", a: "2000 TL ve üzeri alışverişlerde kargo ücretsizdir. Altındaki siparişler için sabit ücret 59.90 TL'dir." },
    ],
    "İade & Değişim": [
      { q: "İade süresi kaç gündür?", a: "Yasal cayma hakkı süresi olan 14 gün içinde koşulsuz iade yapabilirsiniz." },
      { q: "İade kargo ücretini kim öder?", a: "Anlaşmalı kodumuzla gönderdiğiniz takdirde iade kargo ücreti tarafımızca karşılanır." },
      { q: "Değişim yapabilir miyim?", a: "Evet, beden veya renk değişimi için ürün elimize ulaştıktan sonra yeni ürününüz kargolanır." },
    ]
  };

  const categories = Object.keys(faqData);

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      
      {/* HEADER */}
      <div className="bg-gray-50 py-16 mb-16 text-center border-y border-gray-100">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-black">
            <HelpCircle size={32} strokeWidth={1} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-4">
          Yardım Merkezi
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto font-light">
          Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* SOL: KATEGORİ MENÜSÜ */}
        <div className="lg:col-span-1">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-2">Kategoriler</h3>
          <div className="flex flex-col space-y-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                className={`text-left px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  activeCategory === cat 
                  ? "bg-black text-white shadow-lg transform scale-105" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* SAĞ: SORULAR */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-4">
            {activeCategory}
          </h2>

          <div className="space-y-4">
            {faqData[activeCategory].map((item, index) => (
              <div 
                key={index} 
                className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex justify-between items-center p-6 text-left bg-white"
                >
                  <span className="font-bold text-gray-900 pr-8">{item.q}</span>
                  {openIndex === index ? <Minus size={20} className="shrink-0" /> : <Plus size={20} className="shrink-0" />}
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 bg-gray-50 ${openIndex === index ? 'max-h-48' : 'max-h-0'}`}
                >
                  <div className="p-6 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQPage;