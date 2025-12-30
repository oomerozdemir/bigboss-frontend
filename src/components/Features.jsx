import React from 'react';
import { Truck, RefreshCcw, ShieldCheck, Ruler } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Ruler size={32} strokeWidth={1} />,
      title: "Geniş Beden Aralığı",
      desc: "36 - 50 beden arası özel kalıplar."
    },
    {
      icon: <Truck size={32} strokeWidth={1} />,
      title: "Ücretsiz Kargo",
      desc: "2000 TL üzeri siparişlerde kargo bizden."
    },
    {
      icon: <RefreshCcw size={32} strokeWidth={1} />,
      title: "Kolay İade",
      desc: "14 gün içinde koşulsuz iade hakkı."
    },
    {
      icon: <ShieldCheck size={32} strokeWidth={1} />,
      title: "Güvenli Ödeme",
      desc: "256-bit SSL ile korunan ödeme altyapısı."
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