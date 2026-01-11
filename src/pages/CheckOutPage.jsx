import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, clearCart, subTotal, grandTotal, discountAmount } = useCart(); 
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  // Kargo Hesabı (2000 TL üzeri ücretsiz)
  const SHIPPING_COST = subTotal > 2000 ? 0 : 59.90;
  
  // ÖDENECEK TUTAR = (İndirimli Sepet Tutarı) + Kargo
  const FINAL_TOTAL = grandTotal + SHIPPING_COST;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fullAddress = `${formData.address}, ${formData.city} - ${formData.firstName} ${formData.lastName} (${formData.phone})`;
    
    // Sipariş verisini hazırla
    const orderItems = cartItems.map(item => ({
        productId: item.id,
        price: item.price,
        quantity: item.quantity,
        // Varyant bilgisi (Beden ve Renk)
        variant: `${item.selectedVariant?.size || 'Std'} / ${item.selectedVariant?.color || 'Std'}`
    }));
    
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Sipariş vermek için giriş yapmalısınız.");
            setLoading(false);
            return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                items: orderItems,
                total: FINAL_TOTAL, // Güncel Tutar
                address: fullAddress,
                couponCode: appliedCoupon ? appliedCoupon.code : null,
                discountAmount: discountAmount
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Sipariş oluşturulamadı");
        }

        toast.success("Siparişiniz başarıyla alındı! 🎉");
        
        if (clearCart) clearCart();
        
        // Kullanıcıyı yönlendir
        navigate('/hesabim');

    } catch (error) {
        console.error("Ödeme Hatası:", error);
        toast.error(error.message || "Bir hata oluştu.");
    } finally {
        setLoading(false);
    }
  };

  // Sepet Boşsa
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Sepetinizde ürün bulunmuyor.</h2>
        <button 
          onClick={() => navigate('/products')}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Alışverişe Başla
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center font-serif tracking-wider">ÖDEME & TESLİMAT</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SOL KOLON: ADRES VE ÖDEME FORMU */}
          <div className="lg:w-2/3">
            <form onSubmit={handlePayment} className="bg-white p-6 rounded-lg shadow-sm">
              
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Teslimat Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                  <input required name="firstName" onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-black focus:border-black outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                  <input required name="lastName" onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-black focus:border-black outline-none transition" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input required name="email" onChange={handleInputChange} type="email" className="w-full border border-gray-300 rounded p-2 focus:ring-black focus:border-black outline-none transition" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input required name="phone" onChange={handleInputChange} type="tel" className="w-full border border-gray-300 rounded p-2 focus:ring-black focus:border-black outline-none transition" placeholder="05XX XXX XX XX" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                <textarea required name="address" onChange={handleInputChange} rows="3" className="w-full border border-gray-300 rounded p-2 focus:ring-black focus:border-black outline-none transition"></textarea>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                <input required name="city" onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-black focus:border-black outline-none transition" />
              </div>

              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Ödeme Bilgileri</h2>
              <div className="bg-gray-50 p-4 rounded mb-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      🔒 Güvenli Ödeme Altyapısı (Temsili)
                  </p>
                  <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
                  <input required name="cardNumber" onChange={handleInputChange} type="text" placeholder="0000 0000 0000 0000" className="w-full border border-gray-300 rounded p-2 focus:ring-black focus:border-black outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma (Ay/Yıl)</label>
                          <input required name="expiry" onChange={handleInputChange} type="text" placeholder="MM/YY" className="w-full border border-gray-300 rounded p-2 focus:ring-black focus:border-black outline-none" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                          <input required name="cvc" onChange={handleInputChange} type="text" placeholder="123" className="w-full border border-gray-300 rounded p-2 focus:ring-black focus:border-black outline-none" />
                      </div>
                  </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full bg-black text-white py-4 rounded font-bold text-lg hover:bg-gray-800 transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Sipariş Oluşturuluyor...' : `Ödemeyi Tamamla (${FINAL_TOTAL.toLocaleString('tr-TR')} TL)`}
              </button>

            </form>
          </div>

          {/* SAĞ KOLON: SİPARİŞ ÖZETİ */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Sipariş Özeti</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto mb-4 pr-2">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-4 items-center border-b border-gray-50 pb-2 last:border-0">
                    <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                       <img 
                          src={item.imageUrl || "https://via.placeholder.com/150"} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                       />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-gray-500">
                           {item.selectedVariant?.size || 'Std'} / {item.selectedVariant?.color || 'Std'}
                      </p>
                      <p className="text-xs text-gray-500">Adet: {item.quantity}</p>
                    </div>
                    <div className="font-semibold text-sm">
                      {(item.price * item.quantity).toLocaleString('tr-TR')} TL
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                      <span>Ara Toplam</span>
                      <span>{subTotal.toLocaleString('tr-TR')} TL</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                        <span>İndirim</span>
                        <span>- {discountAmount.toLocaleString('tr-TR')} TL</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                      <span>Kargo</span>
                      {SHIPPING_COST === 0 ? (
                          <span className="text-green-600 font-medium">Ücretsiz</span>
                      ) : (
                          <span>{SHIPPING_COST.toLocaleString('tr-TR')} TL</span>
                      )}
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                      <span>Toplam</span>
                      <span>{FINAL_TOTAL.toLocaleString('tr-TR')} TL</span>
                  </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;