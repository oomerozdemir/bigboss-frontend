import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Tag, ArrowLeft, Loader } from 'lucide-react';
import InvoiceForm from '../components/InvoiceForm'; 
import PayTRPayment from '../components/PayTRPayment'; 
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext'; 

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  // ✅ Context'i güvenli şekilde al
  const cartContext = useCart();
  
  // ✅ HATA DÜZELTMESİ: Context yoksa veya undefined ise varsayılan değerler
  const { 
    cartItems, 
    subTotal, 
    discountAmount, 
    shippingCost, 
    finalTotal, 
    appliedCoupon, 
    setAppliedCoupon,
    clearCart
  } = cartContext || {};

  // ✅ KRITIK: Array'lerin her zaman dizi olduğundan emin ol
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [invoiceData, setInvoiceData] = useState({
    invoiceType: 'INDIVIDUAL',
    tcNo: '',
    companyName: '',
    taxOffice: '',
    taxNumber: '',
    invoiceAddress: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) { 
      navigate('/login'); 
      return; 
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/address`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const addressList = Array.isArray(data) ? data : [];
        setAddresses(addressList);
        if (addressList.length > 0) setSelectedAddress(addressList[0]);
      }
    } catch (error) { 
      console.error('Adres hatası:', error); 
      setAddresses([]);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return toast.error('Kupon kodu girin');
    setCouponLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartTotal: subTotal || 0 })
      });
      const data = await response.json();
      if (response.ok) {
        if (setAppliedCoupon) setAppliedCoupon(data);
        toast.success('Kupon uygulandı!');
        setCouponCode('');
      } else {
        toast.error(data.error || 'Geçersiz kupon');
      }
    } catch (error) { 
      toast.error('Hata oluştu'); 
    } finally { 
      setCouponLoading(false); 
    }
  };

  const handleCreateOrder = async () => {
    // ✅ Güvenli kontroller
    if (!safeCartItems || safeCartItems.length === 0) {
      return toast.error('Sepetiniz boş');
    }
    
    if (!selectedAddress) {
      return toast.error('Teslimat adresi seçin');
    }

    if (invoiceData.invoiceType === 'INDIVIDUAL') {
      if (!invoiceData.tcNo || invoiceData.tcNo.length !== 11) {
        return toast.error('Geçerli TC Kimlik No girin');
      }
    } else if (invoiceData.invoiceType === 'CORPORATE') {
      if (!invoiceData.companyName || !invoiceData.taxOffice || !invoiceData.taxNumber) {
        return toast.error('Tüm kurumsal fatura bilgilerini doldurun');
      }
    }

    setLoading(true);

    try {
      const orderData = {
        items: safeCartItems.map(item => ({
          productId: item.id,
          price: item.price,
          quantity: item.quantity,
          variant: item.selectedVariant 
            ? `${item.selectedVariant.size} / ${item.selectedVariant.color}` 
            : 'Standart'
        })),
        total: finalTotal || 0,
        address: `${selectedAddress.title}\n${selectedAddress.address}\n${selectedAddress.city}\nTelefon: ${selectedAddress.phone}`,
        couponCode: appliedCoupon?.code || null,
        couponId: appliedCoupon?.id || null,
        discountAmount: discountAmount || 0,
        paymentMethod: 'PAYTR',
        paymentStatus: 'PENDING',
        
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
        setCreatedOrderId(result.id);
        setShowPayment(true);
        toast.success('Ödeme ekranına yönlendiriliyorsunuz...');
      } else {
        toast.error(result.error || 'Sipariş oluşturulamadı');
      }
    } catch (error) {
      console.error('Sipariş hatası:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    console.log("Yönlendiriliyor -> /payment-success");
    if (clearCart) clearCart(); // Sepeti temizle
    navigate('/payment-success'); // Yönlendir
  };

  const handlePaymentFail = (reason) => {
    console.log("Yönlendiriliyor -> /payment-failed", reason);
    toast.error(`Ödeme Başarısız: ${reason}`);
    navigate('/payment-failed'); // Yönlendir
  };

  // ✅ PayTR için güvenli veri hazırlama
  const getPayTRData = () => {
    if (!createdOrderId || !safeCartItems || safeCartItems.length === 0) {
      return null;
    }

    return {
      orderId: createdOrderId,
      totalAmount: finalTotal || 0,
      items: safeCartItems.map(item => ({
        name: item.name || 'Ürün',
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1
      })),
      user: {
        name: user.name || 'Misafir',
        email: user.email || 'test@test.com',
        phone: selectedAddress?.phone || '05555555555'
      },
      shippingAddress: selectedAddress 
        ? `${selectedAddress.address}, ${selectedAddress.city}` 
        : 'Adres belirtilmemiş'
    };
  };

  // ✅ Loading state
  if (!cartContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {showPayment && createdOrderId ? (
            // ✅ Ödeme Ekranı
            <div className="max-w-4xl mx-auto">
              <button 
                onClick={() => setShowPayment(false)} 
                className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 font-semibold"
              >
                <ArrowLeft size={20}/> Geri Dön
              </button>
              
              {getPayTRData() ? (
                <PayTRPayment 
                  orderData={getPayTRData()} 
                  onSuccess={handlePaymentSuccess}
                  onFail={handlePaymentFail}
                />
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-600 font-semibold">
                    Ödeme verisi hazırlanamadı. Lütfen sepeti kontrol edin.
                  </p>
                  <button
                    onClick={() => navigate('/sepet')}
                    className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                  >
                    Sepete Dön
                  </button>
                </div>
              )}
            </div>
          ) : (
            // ✅ Checkout Formu
            <>
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                  Ödeme Sayfası
                </h1>
                <p className="text-gray-600">Sipariş bilgilerinizi kontrol edin</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sol Kolon - Formlar */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Teslimat Adresi */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-4">
                      <MapPin className="text-blue-600" size={24} /> Teslimat Adresi
                    </h2>
                    
                    {addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Kayıtlı adresiniz yok</p>
                        <button 
                          onClick={() => navigate('/adreslerim')} 
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Adres Ekle
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {addresses.map((addr) => (
                          <label 
                            key={addr.id} 
                            className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedAddress?.id === addr.id 
                                ? 'border-blue-600 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input 
                                type="radio" 
                                checked={selectedAddress?.id === addr.id} 
                                onChange={() => setSelectedAddress(addr)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <span className="font-bold text-gray-900 block">{addr.title}</span>
                                <span className="text-sm text-gray-600 mt-1 block">
                                  {addr.address}
                                </span>
                                <span className="text-sm text-gray-600">{addr.city}</span>
                                <span className="text-sm text-gray-600 block mt-1">
                                  Tel: {addr.phone}
                                </span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fatura Bilgileri */}
                  <InvoiceForm 
                    invoiceData={invoiceData} 
                    setInvoiceData={setInvoiceData} 
                  />

                  {/* Kupon Kodu */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-4">
                      <Tag className="text-blue-600" size={24} /> İndirim Kuponu
                    </h2>
                    
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())} 
                        placeholder="Kupon Kodu" 
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        disabled={!!appliedCoupon}
                      />
                      <button 
                        onClick={applyCoupon} 
                        disabled={couponLoading || !!appliedCoupon} 
                        className="bg-black text-white px-6 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {couponLoading ? '...' : appliedCoupon ? 'Uygulandı ✓' : 'Uygula'}
                      </button>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="mt-3 bg-green-50 border border-green-200 p-3 rounded-lg flex items-center justify-between">
                        <span className="text-sm text-green-700">
                          🎉 <strong>{appliedCoupon.code}</strong> kuponu uygulandı
                        </span>
                        <button 
                          onClick={() => {
                            if (setAppliedCoupon) setAppliedCoupon(null); 
                            setCouponCode('');
                            toast.success('Kupon kaldırıldı');
                          }} 
                          className="text-red-600 text-sm hover:underline font-semibold"
                        >
                          Kaldır
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sağ Kolon - Sipariş Özeti */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 sticky top-24">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-4">
                      <ShoppingBag className="text-blue-600" size={24} /> Sipariş Özeti
                    </h2>
                    
                    {/* Ürünler */}
                    <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-1">
                      {safeCartItems.length > 0 ? (
                        safeCartItems.map((item, idx) => (
                          <div key={idx} className="flex gap-3 text-sm border-b pb-3">
                            <img 
                              src={item.imageUrl || '/placeholder.png'} 
                              className="w-12 h-16 object-cover rounded" 
                              alt={item.name}
                            />
                            <div className="flex-1">
                              <p className="font-bold text-gray-900">{item.name || 'Ürün'}</p>
                              <p className="text-gray-500 text-xs">
                                {item.selectedVariant?.size || 'Standart'} 
                                {item.selectedVariant?.color && ` / ${item.selectedVariant.color}`}
                              </p>
                              <p className="mt-1 text-gray-900">
                                {item.quantity} x {parseFloat(item.price || 0).toFixed(2)} TL
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-8">Sepetiniz boş</p>
                      )}
                    </div>
                    
                    {/* Toplam */}
                    <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                      <div className="flex justify-between">
                        <span>Ara Toplam:</span>
                        <span className="font-bold text-gray-900">
                          {(subTotal || 0).toFixed(2)} TL
                        </span>
                      </div>
                      
                      {appliedCoupon && discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>İndirim:</span>
                          <span className="font-bold">-{(discountAmount || 0).toFixed(2)} TL</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span>Kargo:</span>
                        {shippingCost === 0 ? (
                          <span className="text-green-600 font-bold">Ücretsiz</span>
                        ) : (
                          <span className="font-bold">{(shippingCost || 0).toFixed(2)} TL</span>
                        )}
                      </div>
                      
                      <div className="flex justify-between text-lg font-black text-black pt-2 border-t mt-2">
                        <span>TOPLAM:</span>
                        <span className="text-2xl">{(finalTotal || 0).toFixed(2)} TL</span>
                      </div>
                    </div>
                    
                    {/* Ödeme Butonu */}
                    <button 
                      onClick={handleCreateOrder} 
                      disabled={loading || safeCartItems.length === 0 || !selectedAddress} 
                      className="w-full bg-green-600 text-white py-4 rounded-lg font-bold mt-6 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-colors"
                    >
                      {loading ? (
                        <>
                          <Loader className="animate-spin" size={20} />
                          İşleniyor...
                        </>
                      ) : (
                        <>
                          <CreditCard size={20}/> 
                          Ödemeye Geç
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;