import React from 'react';
import { Star, Quote } from 'lucide-react';

const HomeReviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Elif S.",
      location: "İstanbul",
      comment: "Yıllardır aradığım kalıplar buradaymış. Kumaş kalitesi ve dikişler gerçekten 'Premium' hissettiriyor. Teşekkürler Big Boss!",
      rating: 5
    },
    {
      id: 2,
      name: "Zeynep K.",
      location: "İzmir",
      comment: "Siparişimin ertesi günü elimde olması harikaydı. Paketleme o kadar özenliydi ki kendimi özel hissettim.",
      rating: 5
    },
    {
      id: 3,
      name: "Banu A.",
      location: "Ankara",
      comment: "İade sürecinde hiç sorun yaşamadım, anında yardımcı oldular. Müşteri hizmetlerinin ilgisi için bile tekrar alışveriş yaparım.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Başlık Alanı */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
            Sizden Gelenler
          </h2>
          <p className="text-gray-500 font-light text-sm md:text-base tracking-wide uppercase">
            Müşterilerimizin Big Boss Deneyimleri
          </p>
        </div>

        {/* Grid Yapı */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 md:p-10 relative group hover:-translate-y-2 transition-transform duration-500 shadow-sm hover:shadow-xl border border-gray-100">
              
              {/* Arkaplan İkonu (Dekoratif) */}
              <Quote className="absolute top-8 right-8 text-gray-100 group-hover:text-gray-900/5 transition-colors duration-500 transform scale-150 rotate-180" size={64} />

              {/* Yıldızlar */}
              <div className="flex text-black mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>

              {/* Yorum */}
              <p className="text-gray-600 text-lg leading-relaxed font-serif italic mb-8 relative z-10">
                "{review.comment}"
              </p>

              {/* Müşteri Bilgisi */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900">
                  {review.name}
                </h4>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  {review.location}
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* Alt Bilgi / Trustpilot vb. Logoları (Opsiyonel) */}
        <div className="mt-16 text-center border-t border-gray-200/50 pt-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                4.9/5 Müşteri Memnuniyet Puanı
            </p>
        </div>

      </div>
    </section>
  );
};

export default HomeReviews;