import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Tag, ArrowLeft } from 'lucide-react';
import InvoiceForm from '../components/InvoiceForm'; 
import PayTRPayment from '../components/PayTRPayment'; 
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState(null); // Backend'den gelen gerçek sipariş ID'si
  
  // Sepet & Adres
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  // Kupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  // Fatura
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
    if (!token) { navigate('/login'); return; }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/address`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAddresses(data);
      if (data.length > 0) setSelectedAddress(data[0]);
    } catch (err) { console.error(err); }
  };

  const calculateSubtotal = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.discountType === 'PERCENTAGE' 
      ? (calculateSubtotal() * parseFloat(appliedCoupon.discountValue)) / 100 
      : parseFloat(appliedCoupon.discountValue);
  };
  const calculateTotal = () => calculateSubtotal() - calculateDiscount();

  // --- 1. ADIM: SİPARİŞİ OLUŞTUR VE ÖDEMEYE GEÇ ---
  const handleCreateOrderAndPay = async () => {
    if (cartItems.length === 0) return toast.error('Sepetiniz boş');
    if (!selectedAddress) return toast.error('Teslimat adresi seçin');

    // Fatura kontrolü
    if (invoiceData.invoiceType === 'INDIVIDUAL' && (!invoiceData.tcNo || invoiceData.tcNo.length !== 11)) 
        return toast.error('Geçerli TC Kimlik No girin');
    
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
        status: 'ODEME_BEKLENIYOR', // Backend'de Enum varsa ona uygun olmalı (örn: PAYMENT_PENDING)
        
        // Fatura bilgileri
        invoiceType: invoiceData.invoiceType,
        tcNo: invoiceData.tcNo,
        companyName: invoiceData.companyName,
        taxOffice: invoiceData.taxOffice,
        taxNumber: invoiceData.taxNumber,
        invoiceAddress: invoiceData.invoiceAddress
      };

      // Backend'e siparişi kaydet
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
        setOrderId(result.id); // Oluşan gerçek sipariş ID'sini al
        setShowPayment(true);  // Ödeme ekranını aç
      } else {
        toast.error(result.error || 'Sipariş oluşturulamadı');
      }
    } catch (error) {
      console.error('Order Error:', error);
      toast.error('Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // --- 2. ADIM: ÖDEME BAŞARILI OLUNCA ---
  const handlePaymentSuccess = () => {
    localStorage.removeItem('cart');
    navigate('/payment-success');
  };

  // PayTR için veri hazırlığı
  const getOrderDataForPayTR = () => {
    return {
      items: cartItems,
      totalAmount: calculateTotal(),
      orderId: orderId, // Artık gerçek veritabanı ID'si gönderiyoruz
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
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {showPayment ? 'Güvenli Ödeme' : 'Ödeme Sayfası'}
          </h1>
        </div>

        {showPayment && orderId ? (
          <div className="grid grid-cols-1 gap-6">
            <button onClick={() => setShowPayment(false)} className="flex items-center gap-2 text-gray-600 hover:text-black mb-4 w-fit">
              <ArrowLeft size={20} /> Geri Dön
            </button>
            
            <PayTRPayment 
              orderData={getOrderDataForPayTR()} 
              onSuccess={handlePaymentSuccess}
              onFail={(err) => toast.error('Ödeme başarısız')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol Kolon: Adres ve Fatura */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="text-blue-600"/> Teslimat Adresi</h2>
                {addresses.length === 0 ? (
                   <button onClick={() => navigate('/adreslerim')} className="text-blue-600 underline">Adres Ekle</button>
                ) : (
                  addresses.map(addr => (
                    <label key={addr.id} className={`block p-4 border rounded-lg cursor-pointer mt-2 ${selectedAddress?.id === addr.id ? 'border-blue-600 bg-blue-50' : ''}`}>
                      <div className="flex gap-3">
                        <input type="radio" checked={selectedAddress?.id === addr.id} onChange={() => setSelectedAddress(addr)} />
                        <div><p className="font-bold">{addr.title}</p><p className="text-sm text-gray-600">{addr.address}</p></div>
                      </div>
                    </label>
                  ))
                )}
              </div>
              
              <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
            </div>

            {/* Sağ Kolon: Özet */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ShoppingBag className="text-blue-600"/> Sipariş Özeti</h2>
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between"><span>Ara Toplam:</span><span>{calculateSubtotal().toFixed(2)} TL</span></div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Toplam:</span><span className="text-blue-600">{calculateTotal().toFixed(2)} TL</span></div>
                </div>
                <button 
                  onClick={handleCreateOrderAndPay}
                  disabled={loading || !selectedAddress || cartItems.length === 0}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 flex justify-center gap-2 disabled:bg-gray-400"
                >
                  {loading ? 'İşleniyor...' : <><CreditCard/> Ödemeye Geç</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;