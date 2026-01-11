import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ShieldCheck, Ticket, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; 
import toast from 'react-hot-toast'; // Eksik import eklendi

const CartPage = () => {
  // Context'ten gerekli tüm verileri ve fonksiyonları çekiyoruz
  const { 
    cartItems, 
    subTotal, 
    discountAmount, 
    grandTotal, 
    appliedCoupon, 
    setAppliedCoupon, 
    removeCoupon, 
    removeFromCart, 
    updateQuantity 
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  // Kargo Kuralı: 2000 TL üzeri ücretsiz
  const SHIPPING_COST = subTotal > 2000 ? 0 : 59.90;
  
  // Ödenecek Son Tutar = (Sepet Toplamı - İndirim) + Kargo
  const FINAL_TOTAL = grandTotal + SHIPPING_COST;

  // --- KUPON UYGULA ---
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setLoading(true);

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: couponCode, cartTotal: subTotal })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            setAppliedCoupon(data);
            toast.success("Kupon başarıyla uygulandı!");
            setCouponCode("");
        } else {
            toast.error(data.error || "Geçersiz kupon kodu");
            setAppliedCoupon(null);
        }
    } catch (error) {
        toast.error("Bağlantı hatası");
    } finally {
        setLoading(false);
    }
  };

  // --- BOŞ SEPET GÖRÜNÜMÜ ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-white">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={32} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Sepetin Henüz Boş</h2>
        <p className="text-gray-500 mb-8 font-light">Tarzını yansıtacak parçaları keşfetmeye hemen başla.</p>
        <Link 
          to="/products" 
          className="group flex items-center gap-2 bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
        >
          Alışverişe Başla
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-center md:text-left">
          Alışveriş Sepetim ({cartItems.length})
        </h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SOL: ÜRÜN LİSTESİ */}
          <div className="flex-1 space-y-6">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedVariant?.size}-${item.selectedVariant?.color}`} className="flex gap-6 border-b border-gray-100 pb-6 group">
                {/* Ürün Resmi */}
                <Link to={`/product/${item.id}`} className="block w-24 h-32 md:w-32 md:h-40 bg-gray-50 overflow-hidden relative">
                   <img 
                      src={item.imageUrl || "https://via.placeholder.com/300x400"} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                   />
                </Link>

                {/* Ürün Bilgileri */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <Link to={`/product/${item.id}`} className="text-sm md:text-base font-bold text-gray-900 hover:text-gray-600 transition-colors uppercase tracking-wide line-clamp-1">
                        {item.name}
                      </Link>
                      {/* SİLME BUTONU: Beden ve Renk parametreleri eklendi */}
                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedVariant?.size, item.selectedVariant?.color)} 
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    {/* Varyant Bilgisi */}
                    <div className="text-xs text-gray-500 font-medium mb-4 space-y-1">
                      <p>BEDEN: <span className="text-black">{item.selectedVariant?.size || 'Standart'}</span></p>
                      {item.selectedVariant?.color && (
                          <p>RENK: <span className="text-black">{item.selectedVariant.color}</span></p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    {/* Miktar Arttır/Azalt: Beden ve Renk parametreleri eklendi */}
                    <div className="flex items-center border border-gray-200 h-8 md:h-10">
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedVariant?.size, item.selectedVariant?.color, -1)}
                        className="w-8 md:w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 md:w-12 text-center text-xs md:text-sm font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedVariant?.size, item.selectedVariant?.color, 1)}
                        className="w-8 md:w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Fiyat */}
                    <div className="text-right">
                      <p className="text-sm md:text-lg font-bold">
                        {(item.price * item.quantity).toLocaleString('tr-TR')} TL
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SAĞ: ÖZET KARTI */}
          <div className="lg:w-[380px]">
            <div className="bg-gray-50 p-6 md:p-8 sticky top-24 rounded-xl border border-gray-100">
              <h2 className="text-lg font-black uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">
                Sipariş Özeti
              </h2>

              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span className="font-semibold text-black">{subTotal.toLocaleString('tr-TR')} TL</span>
                </div>
                
                {/* İNDİRİM GÖSTERİMİ */}
                {appliedCoupon && (
                    <div className="flex justify-between text-green-600 font-bold animate-in fade-in">
                        <div className="flex items-center gap-1">
                            <Ticket size={14} />
                            <span>İndirim ({appliedCoupon.code})</span>
                        </div>
                        <span>- {discountAmount.toLocaleString('tr-TR')} TL</span>
                    </div>
                )}

                <div className="flex justify-between text-gray-600 items-center">
                  <span>Kargo</span>
                  {SHIPPING_COST === 0 ? (
                    <span className="text-green-600 font-bold text-[10px] uppercase">Ücretsiz</span>
                  ) : (
                    <span>{SHIPPING_COST} TL</span>
                  )}
                </div>
                {/* 2000 TL Altındaysa Uyarı */}
                {SHIPPING_COST > 0 && (
                      <p className="text-[10px] text-gray-400">
                        *2000 TL ve üzeri alışverişlerde kargo ücretsiz.
                      </p>
                )}
              </div>

              {/* KUPON GİRİŞ ALANI */}
              <div className="mb-6 pt-4 border-t border-gray-200">
                  {!appliedCoupon ? (
                      <div className="flex gap-2">
                          <input 
                              type="text" 
                              placeholder="KUPON KODU"
                              className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-xs font-bold focus:outline-none focus:border-black uppercase placeholder:font-normal"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          />
                          <button 
                              onClick={handleApplyCoupon}
                              disabled={loading || !couponCode}
                              className="bg-gray-900 text-white px-4 py-2 rounded text-xs font-bold hover:bg-black disabled:opacity-50 transition-colors"
                          >
                              {loading ? "..." : "EKLE"}
                          </button>
                      </div>
                  ) : (
                      <div className="bg-white border border-green-200 p-3 rounded flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-2 text-green-700">
                              <Ticket size={16} />
                              <span className="text-xs font-bold">{appliedCoupon.code} Uygulandı</span>
                          </div>
                          <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500 transition-colors">
                              <X size={16} />
                          </button>
                      </div>
                  )}
              </div>

              <div className="flex justify-between items-center text-xl font-black border-t border-gray-200 pt-6 mb-8">
                <span>TOPLAM</span>
                <span>{FINAL_TOTAL.toLocaleString('tr-TR')} TL</span>
              </div>

              <button 
                onClick={() => navigate('/odeme-sayfasi')} 
                className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex justify-center items-center gap-2 group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Sepeti Onayla
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Güvenlik İkonları */}
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-[10px] uppercase tracking-wider">
                <ShieldCheck size={14} />
                <span>Güvenli Ödeme Altyapısı</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;