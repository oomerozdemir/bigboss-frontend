import React, { useState, useEffect, useCallback } from 'react';
import { Star, User, Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── BÜYÜK SAHTE YORUM HAVUZU ────────────────────────────────────────────────
// Gerçekçi dağılım: 5★ ~%40, 4★ ~%30, 3★ ~%15, 2★ ~%10, 1★ ~%5
const FAKE_POOL = [
  { name: "Selin Y.", rating: 5, comment: "Kumaş kalitesi gerçekten çok iyi. Kesimi tam istediğim gibi, ne çok dar ne çok bol. Uzun süre dayanacak bir ürün olduğunu hissettim.", likes: 12 },
  { name: "Merve K.", rating: 4, comment: "Ürün göründüğü gibi çok şık. Kargo beklediğimden bir gün geç geldi ama ürün buna değdi. Tekrar alırım.", likes: 8 },
  { name: "Ayşe T.", rating: 5, comment: "38 beden aldım tam oldu. Kumaşı terletmeyen cinsten, yaz ayları için ideal. Kesinlikle tavsiye ederim.", likes: 24 },
  { name: "Fatma D.", rating: 3, comment: "Ürün fena değil ama fiyatına göre biraz daha kaliteli olabilirdi. Rengi tam beklediğim gibi çıktı.", likes: 3 },
  { name: "Zeynep A.", rating: 4, comment: "Çok beğendim, annem için aldım çok memnun kaldı. Hızlı kargo için teşekkürler.", likes: 6 },
  { name: "Hafize B.", rating: 3, comment: "Beden tablosuna göre 38 beden aldım ama biraz büyük geldi, 40 beden kesimi gibi durdu. Dikkat edin.", likes: 1 },
  { name: "Gülay S.", rating: 5, comment: "Paketleme çok özenliydi, ürün harika geldi. Kalitesi fotoğraftaki gibi, hatta daha iyi bile.", likes: 19 },
  { name: "Canan M.", rating: 4, comment: "İkinci kez sipariş verdim, marka artık favorilerimde. Sadece teslimat biraz gecikmeli oldu.", likes: 5 },
  { name: "Sevgi K.", rating: 3, comment: "Orta düzey bir ürün. Ne çok kötü ne çok iyi. Fiyat performans açısından makul sayılır.", likes: 2 },
  { name: "Nurcan Ö.", rating: 5, comment: "Çok şık ve kaliteli. Arkadaşım da beğendi, o da sipariş verdi. Teşekkürler Big Boss!", likes: 31 },
  { name: "Hülya P.", rating: 3, comment: "Ürün güzeldi ama bedeni tam bana uymadı. Müşteri hizmetleri sadece biraz daha hızlı olabilirdi.", likes: 7 },
  { name: "Emine R.", rating: 4, comment: "Kaliteli bir ürün. Kumaşı güzel, dikişleri sağlam. Beklediğimden iyi çıktı.", likes: 9 },
  { name: "Leyla Ç.", rating: 5, comment: "Harika! Rengi bire bir fotoğraftaki gibi geldi. Hızlı kargo, özenli paket. Çok memnunum.", likes: 22 },
  { name: "Bahar Y.", rating: 2, comment: "Ürün pek beğenmedim, dikişlerde küçük bir sorun vardı. Ücretsiz iade işe yaradı neyse.", likes: 11 },
  { name: "Dilek F.", rating: 4, comment: "İkinci ürünüm bu markadan ve yine memnun kaldım. Hem ürün kalitesi hem de müşteri hizmetleri güzel.", likes: 4 },
  { name: "Pınar G.", rating: 5, comment: "Bu fiyata bu kalite süper. Arkadaşlarıma da önereceğim. Paket çok güzel geldi.", likes: 17 },
  { name: "Aysun H.", rating: 3, comment: "Beklediğim kadar iyi değildi ama tamamen kötü de değil. Aynı fiyata daha iyisini bulmak zor.", likes: 1 },
  { name: "Rukiye İ.", rating: 5, comment: "Mükemmel bir ürün, çok memnun kaldım. Anneme de aldım, o da çok beğendi.", likes: 28 },
  { name: "Hacer J.", rating: 4, comment: "Genel olarak beğendim. Sadece kargonun biraz daha hızlı olmasını isterdim.", likes: 6 },
  { name: "Şükran L.", rating: 3, comment: "Ürün idare eder. Beden biraz küçük geldi, bir üst beden alın derim.", likes: 8 },
  { name: "Münevver N.", rating: 5, comment: "Tam aradığım ürün! Kumaşı kaliteli ve çok rahat. Kesinlikle tekrar alacağım.", likes: 15 },
  { name: "Raziye O.", rating: 4, comment: "Çok güzel ürün. Fiyat biraz yüksek ama kalitesi var. Öneririm.", likes: 7 },
  { name: "Tuba Ş.", rating: 2, comment: "Renk biraz farklı geldi, fotoğraftaki kadar canlı değildi. Yine de iade etmedim.", likes: 9 },
  { name: "Vildan U.", rating: 5, comment: "Harika! Her şey çok güzel. Paketten çıkardığımda sevinçten bağırdım :) Teşekkürler!", likes: 33 },
  { name: "Yıldız V.", rating: 4, comment: "Ürün güzel geldi, dikişleri kaliteli. Bir dahaki alışverişimde tekrar tercih edeceğim.", likes: 5 },
  { name: "Zeliha W.", rating: 3, comment: "Ne iyiydi ne kötüydü. Standart bir ürün. Fiyat-performans olarak orta düzey diyebilirim.", likes: 2 },
  { name: "Aynur X.", rating: 5, comment: "Kesinlikle beklentilerimin üzerinde çıktı! Kalite, teslimat ve paketleme her şey tam puandı.", likes: 21 },
  { name: "Berna Z.", rating: 4, comment: "Genel olarak memnunum. Ürün açıklamasıyla birebir örtüşüyor, doğru beden seçin.", likes: 10 },
  { name: "Döndü B.", rating: 5, comment: "Süper ürün! Hem şık hem rahat. Herkese tavsiye ederim.", likes: 16 },
];

// Deterministik seçim: productId bazlı farklı yorumlar göster
function pickFakeReviews(productId, count = 5) {
  const seed = productId * 31 + 7;
  const shuffled = FAKE_POOL.map((r, i) => ({ ...r, sortKey: (seed * (i + 1) * 1103515245 + 12345) % 2147483647 }));
  shuffled.sort((a, b) => a.sortKey - b.sortKey);
  // Tarihleri de deterministik yap
  const baseYear = 2024;
  return shuffled.slice(0, count).map((r, i) => {
    const monthOffset = (seed + i * 13) % 12;
    const dayOffset = (seed + i * 7) % 28 + 1;
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    return { ...r, id: `fake-${productId}-${i}`, date: `${dayOffset} ${months[monthOffset]} ${baseYear}`, isFake: true };
  });
}

// Sahte özet istatistikler (productId bazlı farklı)
function getFakeStats(productId) {
  const seed = productId * 17 + 3;
  const fiveStarPct = 38 + (seed % 15);
  const fourStarPct = 25 + (seed % 10);
  const threeStarPct = 15 + (seed % 8);
  const twoStarPct = 8 + (seed % 5);
  const oneStarPct = 100 - fiveStarPct - fourStarPct - threeStarPct - twoStarPct;
  const total = 60 + (seed % 120);
  const avg = ((fiveStarPct * 5 + fourStarPct * 4 + threeStarPct * 3 + twoStarPct * 2 + oneStarPct * 1) / 100).toFixed(1);
  return {
    total,
    average: parseFloat(avg),
    distribution: [
      { star: 5, percent: fiveStarPct },
      { star: 4, percent: fourStarPct },
      { star: 3, percent: threeStarPct },
      { star: 2, percent: twoStarPct },
      { star: 1, percent: oneStarPct },
    ]
  };
}

// ─── YILDIZ GÖSTERME ────────────────────────────────────────────────────────
const StarDisplay = ({ rating, size = 14 }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < rating ? "currentColor" : "none"}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ))}
  </div>
);

// ─── YILDIZ SEÇİCİ (form için) ───────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="focus:outline-none"
      >
        <Star
          size={28}
          fill={star <= value ? "currentColor" : "none"}
          className={star <= value ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300 transition-colors"}
        />
      </button>
    ))}
  </div>
);

// ─── ANA BİLEŞEN ─────────────────────────────────────────────────────────────
const Reviews = ({ productId }) => {
  const [realReviews, setRealReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Kullanıcı durumu
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  // Gerçek yorumları yükle
  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoadingReviews(true);
    try {
      const res = await fetch(`${apiUrl}/api/reviews/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setRealReviews(data.reviews || []);
      }
    } catch {
      // sessizce geç, sahte yorumlar gösterilir
    } finally {
      setLoadingReviews(false);
    }
  }, [productId, apiUrl]);

  // Kullanıcının yorum yapıp yapamayacağını kontrol et
  const fetchCanReview = useCallback(async () => {
    if (!token || !productId) return;
    try {
      const res = await fetch(`${apiUrl}/api/reviews/${productId}/can-review`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCanReview(data.canReview);
        setAlreadyReviewed(data.alreadyReviewed);
      }
    } catch {
      // sessizce geç
    }
  }, [productId, token, apiUrl]);

  useEffect(() => {
    fetchReviews();
    fetchCanReview();
  }, [fetchReviews, fetchCanReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Lütfen yıldız puanı seçin.');
    if (comment.trim().length < 10) return toast.error('Yorum en az 10 karakter olmalıdır.');
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/reviews/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || 'Bir hata oluştu.');
      toast.success('Değerlendirmeniz eklendi!');
      setShowForm(false);
      setRating(0);
      setComment('');
      fetchReviews();
      setCanReview(false);
      setAlreadyReviewed(true);
    } catch {
      toast.error('Bağlantı hatası, lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  // Sahte yorumları belirle (productId bazlı)
  const fakeReviews = productId ? pickFakeReviews(productId, 4) : [];
  const fakeStats = productId ? getFakeStats(productId) : { total: 0, average: 0, distribution: [] };

  // Gerçek + sahte kombinasyonu
  const allDisplayReviews = [...realReviews, ...fakeReviews];

  // Özet istatistik: gerçek yorum varsa gerçeği, yoksa sahteyi kullan
  const totalCount = realReviews.length > 0
    ? realReviews.length + fakeStats.total
    : fakeStats.total;

  const averageRating = realReviews.length > 0
    ? ((realReviews.reduce((s, r) => s + r.rating, 0) / realReviews.length + fakeStats.average) / 2).toFixed(1)
    : fakeStats.average.toFixed(1);

  const displayDistribution = fakeStats.distribution;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
                    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="mt-16 border-t border-gray-100 pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* SOL: ÖZET VE PUANLAMA */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Değerlendirmeler</h2>

          <div className="flex items-end gap-4">
            <span className="text-6xl font-black text-gray-900 leading-none">{averageRating}</span>
            <div className="flex flex-col mb-1">
              <StarDisplay rating={Math.round(parseFloat(averageRating))} size={18} />
              <span className="text-sm text-gray-500 mt-1">{totalCount} Değerlendirme</span>
            </div>
          </div>

          {/* Yıldız Dağılım Çubukları */}
          <div className="space-y-2">
            {displayDistribution.map(({ star, percent }) => (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-3 font-bold">{star}</span>
                <Star size={10} className="text-gray-400" />
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-black" style={{ width: `${percent}%` }} />
                </div>
                <span className="text-gray-400 w-6">{percent}%</span>
              </div>
            ))}
          </div>

          {/* Değerlendirme Yaz Butonu */}
          {token ? (
            canReview ? (
              <button
                onClick={() => setShowForm(v => !v)}
                className="w-full border border-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
              >
                {showForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showForm ? 'Formu Kapat' : 'Değerlendirme Yaz'}
              </button>
            ) : alreadyReviewed ? (
              <div className="w-full border border-green-200 bg-green-50 py-3 text-xs font-medium text-green-700 text-center">
                Bu ürünü değerlendirdiniz ✓
              </div>
            ) : (
              <div className="w-full border border-gray-200 py-3 text-xs text-gray-500 text-center leading-relaxed">
                Yorum yapabilmek için<br />bu ürünü satın almış olmanız gerekir.
              </div>
            )
          ) : (
            <button
              onClick={() => window.location.href = '/giris'}
              className="w-full border border-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
            >
              Giriş Yap & Değerlendir
            </button>
          )}
        </div>

        {/* SAĞ: YORUM LİSTESİ + FORM */}
        <div className="lg:col-span-2 space-y-8">

          {/* YORUM FORMU */}
          {showForm && canReview && (
            <form
              onSubmit={handleSubmit}
              className="border border-gray-200 rounded p-6 space-y-4 bg-gray-50"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Değerlendirmenizi Yazın</h3>

              <div>
                <p className="text-xs text-gray-500 mb-2">Puan</p>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Yorumunuz</p>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                />
                <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/500</p>
              </div>

              <button
                type="submit"
                disabled={submitting || rating === 0}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {submitting ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </form>
          )}

          {/* YORUM LİSTESİ */}
          {loadingReviews ? (
            <div className="flex justify-center py-8">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          ) : (
            allDisplayReviews.map((review) => {
              const isReal = !review.isFake;
              const displayName = isReal
                ? review.user?.name?.replace(/(\S+)\s+(\S).*/, '$1 $2.') || 'Müşteri'
                : review.name;
              const displayDate = isReal ? formatDate(review.createdAt) : review.date;

              return (
                <div key={review.id} className="border-b border-gray-50 pb-8 last:border-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{displayName}</h4>
                        <div className="flex gap-2 text-xs text-gray-400 mt-0.5">
                          <span>{displayDate}</span>
                          <span>•</span>
                          <span className="text-green-600 font-medium">Satın Aldı</span>
                        </div>
                      </div>
                    </div>
                    <StarDisplay rating={review.rating} size={14} />
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed pl-14">
                    {review.comment}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
