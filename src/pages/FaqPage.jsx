import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQPage = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    { key: 'general', label: t('faq.cat_general') },
    { key: 'order', label: t('faq.cat_order') },
    { key: 'return', label: t('faq.cat_return') },
  ];

  const [activeCategory, setActiveCategory] = useState('general');

  const faqData = {
    general: [
      { q: t('faq.general_q1'), a: t('faq.general_a1') },
      { q: t('faq.general_q2'), a: t('faq.general_a2') },
    ],
    order: [
      { q: t('faq.order_q1'), a: t('faq.order_a1') },
      { q: t('faq.order_q2'), a: t('faq.order_a2') },
      { q: t('faq.order_q3'), a: t('faq.order_a3') },
    ],
    return: [
      { q: t('faq.return_q1'), a: t('faq.return_a1') },
      { q: t('faq.return_q2'), a: t('faq.return_a2') },
      { q: t('faq.return_q3'), a: t('faq.return_a3') },
    ],
  };

  const activeCategoryLabel = categories.find(c => c.key === activeCategory)?.label || '';

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">

      {/* HEADER */}
      <div className="bg-gray-50 py-16 mb-16 text-center border-y border-gray-100">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-black">
          <HelpCircle size={32} strokeWidth={1} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-4">
          {t('faq.title')}
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto font-light">
          {t('faq.subtitle')}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12">

        {/* SOL: KATEGORİ MENÜSÜ */}
        <div className="lg:col-span-1">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-2">{t('faq.categories')}</h3>
          <div className="flex flex-col space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setOpenIndex(null); }}
                className={`text-left px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  activeCategory === cat.key
                  ? "bg-black text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* SAĞ: SORULAR */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-4">
            {activeCategoryLabel}
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
