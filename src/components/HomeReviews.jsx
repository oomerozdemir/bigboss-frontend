import React from 'react';
import { Star, Quote } from 'lucide-react';

const HomeReviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Ayşe M.",
      location: "İstanbul",
      comment: "50 yaşındayım ve vücuduma oturan kıyafet bulmakta zorlanıyordum. Big Boss'un 46 beden koleksiyonu tam olarak aradığım şeydi. Kumaş kalitesi ve dikiş detayları gerçekten fark yaratıyor.",
      rating: 4,
      date: "2 hafta önce"
    },
    {
      id: 2,
      name: "Zeynep K.",
      location: "İzmir",
      comment: "Online alışverişte bedenim konusunda endişeliydim ama müşteri hizmetleri çok yardımcı oldu. Ürün fotoğraflardaki gibi geldi, kumaş kalitesi çok iyi. Sadece kargo biraz geç geldi o yüzden 4 yıldız.",
      rating: 3.5,
      date: "1 ay önce"
    },
    {
      id: 3,
      name: "Selin Y.",
      location: "Ankara",
      comment: "1972'den beri faaliyet gösteriyorlar ve bu deneyim kesinlikle hissediliyor. Klasik kesimler, kaliteli kumaşlar ve uzun ömürlü ürünler. Anne ve teyzelerim de buradan alışveriş yapıyormuş, ben de artık müşterisiyim.",
      rating: 4,
      date: "3 gün önce"
    },
    {
      id: 4,
      name: "Fatma D.",
      location: "Bursa",
      comment: "Nişantaşı mağazasından aldığım bluz çok şık durdu, elemanlar çok ilgiliydi. Fiyatlar biraz yüksek ama kalite de ona göre. Yine de daha uygun fiyatlı seçenekler de olabilir.",
      rating: 4,
      date: "2 hafta önce"
    },
    {
      id: 5,
      name: "Sevgi T.",
      location: "İstanbul",
      comment: "42 beden bir elbise aldım, kalıplar tam vücuda oturdu. İlk alışverişim değil, yıllardır tercih ediyorum. Kargo hızlı, paketleme özenli. Big Boss büyük beden konusunda gerçekten uzman.",
      rating: 5,
      date: "5 gün önce"
    },
    {
      id: 6,
      name: "Gülay A.",
      location: "Antalya",
      comment: "Kalite ve şıklık bir arada. Özellikle günlük giyim koleksiyonu çok başarılı. Tek eksi, bazen stoklar çabuk tükeniyor, beğendiğim ürünleri hemen almam gerekiyor.",
      rating: 4,
      date: "1 hafta önce"
    }
  ];

  // Ortalama puanı hesapla
  const averageRating = (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 md:p-10 relative group hover:-translate-y-2 transition-transform duration-500 shadow-sm hover:shadow-xl border border-gray-100">
              
              {/* Arkaplan İkonu (Dekoratif) */}
              <Quote className="absolute top-8 right-8 text-gray-100 group-hover:text-gray-900/5 transition-colors duration-500 transform scale-150 rotate-180" size={64} />

              {/* Yıldızlar */}
              <div className="flex gap-0.5 text-black mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < review.rating ? "currentColor" : "none"}
                    className={i < review.rating ? "" : "text-gray-300"}
                  />
                ))}
              </div>

              {/* Yorum */}
              <p className="text-gray-600 text-base leading-relaxed mb-6 relative z-10">
                "{review.comment}"
              </p>

              {/* Müşteri Bilgisi */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900">
                  {review.name}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    {review.location}
                  </span>
                  <span className="text-xs text-gray-400">
                    {review.date}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Alt Bilgi */}
        <div className="mt-16 text-center border-t border-gray-200/50 pt-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {averageRating}/5 Müşteri Memnuniyet Puanı • {reviews.length} Değerlendirme
            </p>
        </div>

      </div>
    </section>
  );
};

export default HomeReviews;