import React from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';

const Reviews = () => {
  // Şimdilik Statik Veriler (Backend bağlanınca burası dinamik olacak)
  const reviews = [
    {
      id: 1,
      name: "Selin Y.",
      date: "12 Ekim 2023",
      rating: 5,
      comment: "Kumaş kalitesi muazzam. Kesimi tam istediğim gibi, ne çok dar ne çok bol. Paketleme de çok özenliydi, teşekkürler Big Boss!",
      likes: 12
    },
    {
      id: 2,
      name: "Merve K.",
      date: "05 Eylül 2023",
      rating: 4,
      comment: "Ürün göründüğü gibi çok şık. Sadece kargo beklediğimden bir gün geç geldi ama ürün buna değdi.",
      likes: 8
    },
    {
      id: 3,
      name: "Ayşe T.",
      date: "28 Ağustos 2023",
      rating: 5,
      comment: "38 beden aldım tam oldu. Kumaşı terletmeyen cinsten, yaz ayları için ideal. Kesinlikle tavsiye ederim.",
      likes: 24
    }
  ];

  return (
    <div className="mt-16 border-t border-gray-100 pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* SOL: ÖZET VE PUANLAMA */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Değerlendirmeler</h2>
          
          <div className="flex items-end gap-4">
            <span className="text-6xl font-black text-gray-900 leading-none">4.8</span>
            <div className="flex flex-col mb-1">
              <div className="flex text-yellow-500 mb-1">
                 {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <span className="text-sm text-gray-500">142 Değerlendirme</span>
            </div>
          </div>

          {/* Yıldız Çubukları */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-3 font-bold">{star}</span>
                <Star size={10} className="text-gray-400" />
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black" 
                    style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full border border-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
            Değerlendirme Yaz
          </button>
        </div>

        {/* SAĞ: YORUM LİSTESİ */}
        <div className="lg:col-span-2 space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-50 pb-8 last:border-0">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{review.name}</h4>
                    <div className="flex gap-2 text-xs text-gray-400 mt-0.5">
                        <span>{review.date}</span>
                        <span>•</span>
                        <span className="text-green-600 font-medium">Satın Aldı</span>
                    </div>
                  </div>
                </div>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4 pl-14">
                {review.comment}
              </p>

              <div className="pl-14 flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-black transition-colors">
                  <ThumbsUp size={14} />
                  <span>Bu yorum faydalı ({review.likes})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Reviews;