import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Tag, Loader, ArrowLeft } from 'lucide-react';
import InvoiceForm from '../components/InvoiceForm'; 
import PayTRPayment from '../components/PayTRPayment'; // ✅ PayTR bileşeni eklendi
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false); // ✅ Ödeme ekranı kontrolü
  
  // Sepet bilgileri
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  // Kupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  
  // Fatura bilgileri
  const [invoiceData, setInvoiceData] = useState({
    invoiceType: 'INDIVIDUAL',
    tcNo: '',
    companyName: '',
    taxOffice: '',
    taxNumber: '',
    invoiceAddress: ''
  });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAddresses(data);
      if (data.length > 0) setSelectedAddress(data[0]);
    } catch (error) { console.error('Hata:', error); }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return toast.error('Kupon kodu girin');
    setCouponLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartTotal: calculateSubtotal() })
      });
      const data = await response.json();
      if (response.ok) { setAppliedCoupon(data); toast.success('Kupon uygulandı!'); } 
      else { toast.error(data.error || 'Geçersiz kupon'); }
    } catch (error) { toast.error('Hata oluştu'); } 
    finally { setCouponLoading(false); }
  };

  const calculateSubtotal = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.discountType === 'PERCENTAGE' 
      ? (calculateSubtotal() * parseFloat(appliedCoupon.discountValue)) / 100 
      : parseFloat(appliedCoupon.discountValue);
  };
  const calculateTotal = () => calculateSubtotal() - calculateDiscount();

  // ✅ Ödeme Adımına Geçiş Kontrolü
  const handleProceedToPayment = () => {
    if (cartItems.length === 0) return toast.error('Sepetiniz boş');
    if (!selectedAddress) return toast.error('Teslimat adresi seçin');

    if (invoiceData.invoiceType === 'INDIVIDUAL') {
      if (!invoiceData.tcNo || invoiceData.tcNo.length !== 11) return toast.error('Geçerli TC Kimlik No girin');
    } else {
      if (!invoiceData.companyName || !invoiceData.taxOffice || !invoiceData.taxNumber) return toast.error('Fatura bilgilerini doldurun');
    }

    setShowPayment(true); // ✅ PayTR bileşenini göster
  };

  // ✅ Ödeme Başarılı Olunca Siparişi Kaydet
  const handlePaymentSuccess = async (paymentResult) => {
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          price: item.price,
          quantity: item.quantity,
          variant: item.selectedVariant ? `${item.selectedVariant.size} / ${item.selectedVariant.color}` : 'Standart'
        })),
        total: calculateTotal(),
        address: `${selectedAddress.title}\n${selectedAddress.address}\n${selectedAddress.city}\nTelefon: ${selectedAddress.phone}`,
        couponCode: appliedCoupon?.code || null,
        discountAmount: calculateDiscount(),
        paymentMethod: 'PAYTR',
        paymentId: paymentResult?.merchant_oid || null, // PayTR sipariş numarası
        
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

      if (response.ok) {
        localStorage.removeItem('cart');
        navigate('/payment-success');
      } else {
        toast.error('Ödeme alındı ancak sipariş kaydedilemedi. Lütfen destek ile iletişime geçin.');
        navigate('/payment-failed');
      }
    } catch (error) {
      console.error('Order Error:', error);
      toast.error('Sipariş oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  // ✅ PayTR için veri hazırlığı
  const getOrderDataForPayTR = () => {
    return {
      items: cartItems,
      totalAmount: calculateTotal(),
      orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Geçici benzersiz ID
      user: {
        name: user.name || 'Misafir',
        email: user.email,
        phone: selectedAddress?.phone || '05555555555'
      },
      shippingAddress: `${selectedAddress?.address} ${selectedAddress?.city}`
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            {showPayment ? 'Güvenli Ödeme' : 'Ödeme Sayfası'}
          </h1>
          <p className="text-gray-600">
            {showPayment ? 'Kart bilgilerinizi girerek işlemi tamamlayın.' : 'Sipariş bilgilerinizi kontrol edin.'}
          </p>
        </div>

        {/* ✅ Ödeme Ekranı */}
        {showPayment ? (
          <div className="grid grid-cols-1 gap-6">
            <button 
              onClick={() => setShowPayment(false)} 
              className="flex items-center gap-2 text-gray-600 hover:text-black mb-4 w-fit"
            >
              <ArrowLeft size={20} /> Bilgilere Geri Dön
            </button>
            
            <PayTRPayment 
              orderData={getOrderDataForPayTR()} 
              onSuccess={handlePaymentSuccess}
              onFail={(err) => {
                toast.error('Ödeme başarısız oldu.');
                console.error(err);
              }}
            />
          </div>
        ) : (
          /* ✅ Bilgi Giriş Ekranı (Eski Checkout) */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-blue-600" size={24} />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Teslimat Adresi</h2>
                </div>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Henüz kayıtlı adresiniz yok</p>
                    <button onClick={() => navigate('/adreslerim')} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Adres Ekle</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <label key={address.id} className={`block p-4 border-2 rounded-lg cursor-pointer ${selectedAddress?.id === address.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                        <div className="flex items-start gap-3">
                          <input type="radio" checked={selectedAddress?.id === address.id} onChange={() => setSelectedAddress(address)} className="mt-1"/>
                          <div>
                            <p className="font-semibold">{address.title}</p>
                            <p className="text-sm text-gray-600">{address.address} / {address.city}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />

              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="text-blue-600" size={24} />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">İndirim Kuponu</h2>
                </div>
                <div className="flex gap-3">
                  <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Kupon Kodu" className="flex-1 px-4 py-3 border rounded-lg" disabled={appliedCoupon}/>
                  <button onClick={applyCoupon} disabled={couponLoading || appliedCoupon} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
                    {couponLoading ? '...' : appliedCoupon ? 'Uygulandı' : 'Uygula'}
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-3 p-3 bg-green-50 text-green-800 rounded-lg flex justify-between">
                    <span>🎉 <strong>{appliedCoupon.code}</strong> uygulandı</span>
                    <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-red-600 hover:underline">Kaldır</button>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Sipariş Özeti</h2>
                </div>
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex gap-3 pb-3 border-b">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded"/>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.selectedVariant?.size} / {item.selectedVariant?.color}</p>
                        <p className="text-sm mt-1">{item.quantity} x {item.price} TL</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm"><span>Ara Toplam:</span><span>{calculateSubtotal().toFixed(2)} TL</span></div>
                  {appliedCoupon && <div className="flex justify-between text-sm text-green-600"><span>İndirim:</span><span>-{calculateDiscount().toFixed(2)} TL</span></div>}
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg"><span>Toplam:</span><span className="text-blue-600">{calculateTotal().toFixed(2)} TL</span></div>
                </div>
                
                <button 
                  onClick={handleProceedToPayment}
                  disabled={loading || !selectedAddress || cartItems.length === 0}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 flex justify-center gap-2 disabled:bg-gray-400"
                >
                  <CreditCard size={20} /> Ödemeye Geç
                </button>
                <p className="mt-4 text-xs text-center text-gray-500">🔒 Güvenli ödeme • 3D Secure</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;