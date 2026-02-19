import React from 'react';
import { MapPin, Clock, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="bg-white pt-28 pb-12">

        {/* HERO SECTION */}
        <div className="relative h-[400px] bg-gray-900 text-white flex items-center justify-center mb-16">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
            alt="Big Boss Atölye"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-20 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-wider mb-4">{t('about.title')}</h1>
            <p className="text-lg md:text-xl font-light opacity-90 tracking-widest uppercase">{t('about.since')}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-16">

          {/* TARİHÇE VE MİSYON */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">{t('about.half_century')}</h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
            <p className="text-gray-600 leading-relaxed text-lg">
              1972 yılında modanın kalbinde başlayan yolculuğumuz, bugün yarım asrı deviren tecrübemizle devam ediyor.
              <strong>BIG BOSS</strong> olarak, kurulduğumuz günden bu yana kaliteden ödün vermeden, kadın giyimine yön veren tasarımlarımızla sektörde sağlam bir yer edindik.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Bizim için şıklığın bedeni yoktur. Bu vizyonla koleksiyonlarımızı <strong>36'dan 50 bedene kadar</strong> geniş bir yelpazede sunuyoruz.
              Her kadının, kendi bedeniyle barışık, özgüvenli ve şık hissetmesi en büyük motivasyon kaynağımızdır.
            </p>
          </div>

          {/* ÖZELLİKLER GRİD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-gray-100">
            <div className="text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-black">
                <Clock size={24} />
              </div>
              <h3 className="font-bold text-lg">{t('about.since')}</h3>
              <p className="text-sm text-gray-500">50 yılı aşkın üretim ve tasarım tecrübesi.</p>
            </div>
            <div className="text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-black">
                <CheckCircle size={24} />
              </div>
              <h3 className="font-bold text-lg">{t('about.size_range')}</h3>
              <p className="text-sm text-gray-500">{t('about.size_range_desc')}</p>
            </div>
            <div className="text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-black">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-lg">{t('about.central_location')}</h3>
              <p className="text-sm text-gray-500">{t('about.central_location_desc')}</p>
            </div>
          </div>

          {/* MAĞAZALARIMIZ */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center">{t('about.our_stores')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-gray-50 p-6 rounded-xl text-center group hover:bg-black hover:text-white transition duration-300 cursor-default">
                <h3 className="text-xl font-bold mb-2 font-serif">{t('about.osmanbey')}</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-300">{t('about.osmanbey_title')}</p>
                <p className="text-xs mt-4 opacity-70">{t('about.osmanbey_address').replace(', ', ',\n')}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl text-center group hover:bg-black hover:text-white transition duration-300 cursor-default">
                <h3 className="text-xl font-bold mb-2 font-serif">{t('about.nisantasi')}</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-300">{t('about.nisantasi_title')}</p>
                <p className="text-xs mt-4 opacity-70">{t('about.nisantasi_address').replace(', ', ',\n')}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl text-center group hover:bg-black hover:text-white transition duration-300 cursor-default">
                <h3 className="text-xl font-bold mb-2 font-serif">{t('about.sisli')}</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-300">{t('about.sisli_title')}</p>
                <p className="text-xs mt-4 opacity-70">{t('about.sisli_address').replace(', ', ',\n')}</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AboutPage;
