import React, { useState } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeFAQ = () => {
  // Hangi sorunun açık olduğunu tutan state
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Siparişim ne zaman kargoya verilir?",
      answer: "Hafta içi saat 15:00'e kadar verilen siparişler aynı gün, 15:00'ten sonraki siparişler ertesi gün kargoya verilir. Cumartesi ve Pazar verilen siparişler Pazartesi günü işleme alınır."
    },
    {
      question: "İade ve değişim süreci nasıl işliyor?",
      answer: "Siparişinizi teslim aldığınız tarihten itibaren 14 gün içinde ücretsiz olarak iade edebilirsiniz. Değişim işlemleri için müşteri hizmetlerimizle iletişime geçmeniz yeterlidir."
    },
    {
      question: "Hangi kargo firması ile çalışıyorsunuz?",
      answer: "Big Boss olarak Yurtiçi Kargo ve Aras Kargo ile anlaşmalıyız. Sipariş adımında dilediğiniz firmayı seçebilirsiniz."
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Başlık */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Merak Edilenler
          </h2>
          <p className="text-gray-500 font-light text-sm">
            Sıkça sorulan sorulara hızlı cevaplar.
          </p>
        </div>

        {/* Akordiyon Listesi */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-gray-100 rounded-lg overflow-hidden transition-all duration-300 ${openIndex === index ? 'bg-gray-50 border-gray-200' : 'bg-white'}`}
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className={`text-sm font-bold uppercase tracking-wide ${openIndex === index ? 'text-black' : 'text-gray-600'}`}>
                  {faq.question}
                </span>
                {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 text-sm text-gray-500 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tümünü Gör Butonu */}
        <div className="mt-10 text-center">
          <Link 
            to="/sss" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-1 hover:text-gray-600 hover:border-gray-400 transition-all"
          >
            Tüm Soruları İncele
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HomeFAQ;