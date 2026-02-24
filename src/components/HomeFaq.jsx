import React, { useState } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const HomeFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useTranslation();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    { question: t('faq_home.q1'), answer: t('faq_home.a1') },
    { question: t('faq_home.q2'), answer: t('faq_home.a2') },
    { question: t('faq_home.q3'), answer: t('faq_home.a3') },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="max-w-3xl mx-auto px-6">

        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            {t('faq_home.title')}
          </h2>
          <p className="text-gray-500 font-light text-sm">
            {t('faq_home.subtitle')}
          </p>
        </div>

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

        <div className="mt-10 text-center">
          <Link
            to="/sss"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-1 hover:text-gray-600 hover:border-gray-400 transition-all"
          >
            {t('faq_home.view_all')}
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HomeFAQ;
