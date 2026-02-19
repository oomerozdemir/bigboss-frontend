import React from 'react';
import { Truck, RefreshCcw, ShieldCheck, Ruler } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Ruler size={32} strokeWidth={1} />,
      title: t('features.size_range_title'),
      desc: t('features.size_range_desc')
    },
    {
      icon: <Truck size={32} strokeWidth={1} />,
      title: t('features.free_shipping_title'),
      desc: t('features.free_shipping_desc')
    },
    {
      icon: <RefreshCcw size={32} strokeWidth={1} />,
      title: t('features.easy_return_title'),
      desc: t('features.easy_return_desc')
    },
    {
      icon: <ShieldCheck size={32} strokeWidth={1} />,
      title: t('features.secure_payment_title'),
      desc: t('features.secure_payment_desc')
    }
  ];

  return (
    <section className="py-20 border-b border-gray-100 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="mb-4 text-gray-400 group-hover:text-black transition-colors duration-300 transform group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
