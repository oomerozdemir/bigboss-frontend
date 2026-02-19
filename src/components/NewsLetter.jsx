import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Newsletter = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4">
          {t('newsletter.title')}
        </h2>
        <p className="text-gray-500 mb-8 font-light">
          {t('newsletter.subtitle')}
        </p>

        <form className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder={t('newsletter.placeholder')}
            className="flex-1 bg-white border border-gray-200 px-6 py-4 outline-none focus:border-black transition-colors text-sm"
          />
          <button className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group">
            {t('newsletter.subscribe')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
          </button>
        </form>
        <p className="text-[10px] text-gray-400 mt-4">
          {t('newsletter.privacy_note')}
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
