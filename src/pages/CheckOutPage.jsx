import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Tag, Loader } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import InvoiceForm from '../components/InvoiceForm'; 
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Sepet bilgileri
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  // Kupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  
  // ✅ YENİ: Fatura bilgileri state
  const [invoiceData, setInvoiceData] = useState({
    invoiceType: 'INDIVIDUAL',
    tcNo: '',
    companyName: '',
    taxOffice: '',
    taxNumber: '',
    invoiceAddress: ''
  });

  // Kullanıcı bilgileri
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Sepet ve adres bilgilerini yükle
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCart();
    fetchAddresses();
  }, []);

  const fetchCart = async () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/address`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAddresses(data);
      if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    } catch (error) {
      console.error('Adres yükleme hatası:', error);
    }
  };

  // Kupon uygula
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Lütfen kupon kodu girin');
      return;
    }

    setCouponLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: couponCode,
          cartTotal: calculateSubtotal()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAppliedCoupon(data);
        toast.success('Kupon başarıyla uygulandı!');
      } else {
        toast.error(data.error || 'Geçersiz kupon');
      }
    } catch (error) {
      toast.error('Kupon kontrol edilemedi');
    } finally {
      setCouponLoading(false);
    }
  };

  // Hesaplamalar
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      return (calculateSubtotal() * parseFloat(appliedCoupon.discountValue)) / 100;
    } else {
      return parseFloat(appliedCoupon.discountValue);
    }
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  // ✅ Sipariş oluştur (Fatura bilgileri ile)
  const handleCheckout = async () => {
    // Validasyonlar
    if (cartItems.length === 0) {
      toast.error('Sepetiniz boş');
      return;
    }

    if (!selectedAddress) {
      toast.error('Lütfen teslimat adresi seçin');
      return;
    }

    // ✅ Fatura bilgileri validasyonu
    if (invoiceData.invoiceType === 'INDIVIDUAL') {
      if (!invoiceData.tcNo || invoiceData.tcNo.length !== 11) {
        toast.error('Lütfen geçerli bir TC Kimlik No girin');
        return;
      }
    } else if (invoiceData.invoiceType === 'CORPORATE') {
      if (!invoiceData.companyName || !invoiceData.taxOffice || !invoiceData.taxNumber) {
        toast.error('Lütfen tüm kurumsal fatura bilgilerini doldurun');
        return;
      }
      if (invoiceData.taxNumber.length !== 10) {
        toast.error('Vergi numarası 10 haneli olmalıdır');
        return;
      }
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          price: item.price,
          quantity: item.quantity,
          variant: item.selectedVariant ? 
            `${item.selectedVariant.size} / ${item.selectedVariant.color}` : 
            'Standart'
        })),
        total: calculateTotal(),
        address: `${selectedAddress.title}\n${selectedAddress.address}\n${selectedAddress.city}\nTelefon: ${selectedAddress.phone}`,
        couponCode: appliedCoupon?.code || null,
        discountAmount: calculateDiscount(),
        paymentMethod: 'PAYTR',
        
        // ✅ YENİ: Fatura bilgileri
        invoiceType: invoiceData.invoiceType,
        tcNo: invoiceData.invoiceType === 'INDIVIDUAL' ? invoiceData.tcNo : null,
        companyName: invoiceData.invoiceType === 'CORPORATE' ? invoiceData.companyName : null,
        taxOffice: invoiceData.invoiceType === 'CORPORATE' ? invoiceData.taxOffice : null,
        taxNumber: invoiceData.invoiceType === 'CORPORATE' ? invoiceData.taxNumber : null,
        invoiceAddress: invoiceData.invoiceAddress || null
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        // Sepeti temizle
        localStorage.removeItem('cart');
        
        toast.success('Sipariş başarıyla oluşturuldu!');
        
        // Ödeme sayfasına yönlendir (veya PayTR entegrasyonu)
        navigate('/payment-success');
      } else {
        toast.error(result.error || 'Sipariş oluşturulamadı');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Başlık */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              Ödeme Sayfası
            </h1>
            <p className="text-gray-600">Sipariş bilgilerinizi kontrol edin ve ödemenizi tamamlayın</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sol: Formlar */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Teslimat Adresi */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-blue-600" size={24} />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Teslimat Adresi</h2>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Henüz kayıtlı adresiniz yok</p>
                    <button
                      onClick={() => navigate('/adreslerim')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Adres Ekle
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedAddress?.id === address.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddress?.id === address.id}
                            onChange={() => setSelectedAddress(address)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{address.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                            <p className="text-sm text-gray-600">{address.city}</p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* ✅ YENİ: Fatura Bilgileri Komponenti */}
              <InvoiceForm 
                invoiceData={invoiceData}
                setInvoiceData={setInvoiceData}
              />

              {/* Kupon Kodu */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="text-blue-600" size={24} />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">İndirim Kuponu</h2>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Kupon kodunu girin"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={appliedCoupon}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading || appliedCoupon}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                  >
                    {couponLoading ? 'Kontrol...' : appliedCoupon ? 'Uygulandı ✓' : 'Uygula'}
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-green-800">
                      🎉 <strong>{appliedCoupon.code}</strong> kuponu uygulandı
                    </span>
                    <button
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode('');
                      }}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Kaldır
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sağ: Sipariş Özeti */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Sipariş Özeti</h2>
                </div>

                {/* Ürünler */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex gap-3 pb-3 border-b border-gray-200">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.selectedVariant?.size} / {item.selectedVariant?.color}</p>
                        <p className="text-sm text-gray-900 mt-1">
                          {item.quantity} x {item.price} TL
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hesaplama */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam:</span>
                    <span className="font-semibold">{calculateSubtotal().toFixed(2)} TL</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">İndirim:</span>
                      <span className="font-semibold text-green-600">-{calculateDiscount().toFixed(2)} TL</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kargo:</span>
                    <span className="font-semibold text-green-600">Ücretsiz</span>
                  </div>

                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Toplam:</span>
                      <span className="text-2xl font-black text-blue-600">{calculateTotal().toFixed(2)} TL</span>
                    </div>
                  </div>
                </div>

                {/* Ödeme Butonu */}
                <button
                  onClick={handleCheckout}
                  disabled={loading || !selectedAddress || cartItems.length === 0}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>Ödemeye Geç</span>
                    </>
                  )}
                </button>

                {/* Güvenlik */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Güvenli ödeme • 3D Secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;