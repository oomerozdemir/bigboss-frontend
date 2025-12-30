import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();

  // Kargo Kuralı: 2000 TL üzeri ücretsiz
  const SHIPPING_COST = subtotal > 2000 ? 0 : 59.90;
  const TOTAL = subtotal + SHIPPING_COST;

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
          className="group flex items-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
        >
          Alışverişe Başla
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  // --- DOLU SEPET TASARIMI ---
  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-12">
          Sepetim ({cartItems.length} Parça)
        </h1>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* SOL TARA: ÜRÜN LİSTESİ */}
          <div className="flex-1 space-y-8">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedVariant?.size}`} className="flex gap-6 py-6 border-b border-gray-100 items-start">
                
                {/* Ürün Görseli */}
                <div className="w-24 h-32 md:w-32 md:h-44 bg-gray-100 flex-shrink-0 overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Ürün Bilgileri */}
                <div className="flex-1 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">{item.name}</h3>
                        <button 
                            onClick={() => removeFromCart(item.id, item.selectedVariant?.size)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-1">
                       Beden: <span className="text-black font-bold">{item.selectedVariant?.size}</span>
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                       Renk: <span className="text-black font-bold">{item.selectedVariant?.color || "Standart"}</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    
                    {/* Adet Kontrolü */}
                    <div className="flex items-center border border-gray-200 h-9 w-fit">
                        <button 
                            onClick={() => updateQuantity(item.id, item.selectedVariant?.size, -1)}
                            className="px-3 hover:bg-gray-50 h-full flex items-center"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item.id, item.selectedVariant?.size, 1)}
                            className="px-3 hover:bg-gray-50 h-full flex items-center"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Fiyat */}
                    <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                            {(parseFloat(item.price) * item.quantity).toLocaleString('tr-TR')} TL
                        </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SAĞ TARAF: SİPARİŞ ÖZETİ */}
          <div className="lg:w-[400px] flex-shrink-0">
            <div className="bg-gray-50 p-8 sticky top-32">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">
                Sipariş Özeti
              </h2>

              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>{subtotal.toLocaleString('tr-TR')} TL</span>
                </div>
                <div className="flex justify-between text-gray-600 items-center">
                  <span>Kargo</span>
                  {SHIPPING_COST === 0 ? (
                    <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 uppercase">Ücretsiz</span>
                  ) : (
                    <span>{SHIPPING_COST} TL</span>
                  )}
                </div>
                {/* 2000 TL Altındaysa Uyarı */}
                {SHIPPING_COST > 0 && (
                     <p className="text-[10px] text-gray-400 mt-2">
                        *2000 TL ve üzeri alışverişlerde kargo ücretsiz.
                     </p>
                )}
              </div>

              <div className="flex justify-between items-center text-xl font-black border-t border-gray-200 pt-6 mb-8">
                <span>TOPLAM</span>
                <span>{TOTAL.toLocaleString('tr-TR')} TL</span>
              </div>

              <button className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex justify-center items-center gap-2 group">
                Sepeti Onayla
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Güvenlik İkonları */}
              <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-[10px] uppercase tracking-wider">
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