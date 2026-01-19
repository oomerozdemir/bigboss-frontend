import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Tag, ArrowLeft } from 'lucide-react';
import InvoiceForm from '../components/InvoiceForm'; 
import PayTRPayment from '../components/PayTRPayment'; 
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext'; 

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  // Context verilerini güvenli çek
  const cartContext = useCart();
  // Eğer context yüklenemediyse boş obje ata
  const { 
    cartItems = [], 
    subTotal = 0, 
    discountAmount = 0, 
    shippingCost = 0, 
    finalTotal = 0, 
    appliedCoupon, 
    setAppliedCoupon,
    clearCart
  } = cartContext || {};

  // Güvenli Sepet Listesi (Null/Undefined olsa bile [] döner)
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
    if (!token) { navigate('/login'); return; }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/address`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Gelen veri dizi mi kontrol et
        const addressList = Array.isArray(data) ? data : [];
        setAddresses(addressList);
        if (addressList.length > 0) setSelectedAddress(addressList[0]);
      }
    } catch (error) { 
        console.error('Adres hatası:', error); 
        setAddresses([]); // Hata durumunda boş dizi
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return toast.error('Kupon kodu girin');
    setCouponLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartTotal: subTotal })
      });
      const data = await response.json();
      if (response.ok) {
        setAppliedCoupon(data);
        toast.success('Kupon uygulandı!');
        setCouponCode('');
      } else {
        toast.error(data.error || 'Geçersiz kupon');
      }
    } catch (error) { toast.error('Hata oluştu'); } 
    finally { setCouponLoading(false); }
  };

  const handleCreateOrder = async () => {
    if (safeCartItems.length === 0) return toast.error('Sepetiniz boş');
    if (!selectedAddress) return toast.error('Teslimat adresi seçin');

    if (invoiceData.invoiceType === 'INDIVIDUAL' && (!invoiceData.tcNo || invoiceData.tcNo.length !== 11)) 
        return toast.error('Geçerli TC Kimlik No girin');

    setLoading(true);

    try {
      const orderData = {
        items: safeCartItems.map(item => ({
          productId: item.id,
          price: item.price,
          quantity: item.quantity,
          variant: item.selectedVariant ? `${item.selectedVariant.size} / ${item.selectedVariant.color}` : 'Standart'
        })),
        total: finalTotal,
        address: `${selectedAddress.title}\n${selectedAddress.address}\n${selectedAddress.city}\nTelefon: ${selectedAddress.phone}`,
        couponCode: appliedCoupon?.code || null,
        couponId: appliedCoupon?.id || null,
        discountAmount: discountAmount,
        paymentMethod: 'PAYTR',
        status: 'ODEME_BEKLENIYOR',
        
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
      console.error('Error:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (clearCart) clearCart();
    navigate('/payment-success');
  };

  const getPayTRData = () => {
    return {
        merchant_oid: createdOrderId,
        payment_amount: Math.round(finalTotal * 100),
        user_basket: JSON.stringify(safeCartItems.map(item => [item.name, item.price.toString(), item.quantity])),
        user_email: user.email,
        user_name: user.name || 'Misafir',
        user_address: `${selectedAddress?.address} ${selectedAddress?.city}`,
        user_phone: selectedAddress?.phone || '05555555555'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {showPayment && createdOrderId ? (
            <div className="max-w-4xl mx-auto">
                <button onClick={() => setShowPayment(false)} className="flex items-center gap-2 text-gray-600 hover:text-black mb-6">
                    <ArrowLeft size={20}/> Geri Dön
                </button>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <PayTRPayment 
                        orderData={getPayTRData()} 
                        onSuccess={handlePaymentSuccess}
                        onFail={(e) => toast.error('Ödeme başarısız oldu.')}
                    />
                </div>
            </div>
        ) : (
            <>
                <h1 className="text-3xl font-black text-gray-900 mb-8">Ödeme Sayfası</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                        <MapPin className="text-blue-600" /> Teslimat Adresi
                    </h2>
                    {addresses.length === 0 ? (
                        <button onClick={() => navigate('/adreslerim')} className="text-blue-600 hover:underline">+ Adres Ekle</button>
                    ) : (
                        <div className="space-y-3">
                        {addresses.map((addr) => (
                            <label key={addr.id} className={`block p-4 border rounded-lg cursor-pointer ${selectedAddress?.id === addr.id ? 'border-blue-600 bg-blue-50' : 'hover:border-gray-300'}`}>
                            <div className="flex gap-3">
                                <input type="radio" checked={selectedAddress?.id === addr.id} onChange={() => setSelectedAddress(addr)} />
                                <div><span className="font-bold block">{addr.title}</span><span className="text-sm text-gray-600">{addr.address} / {addr.city}</span></div>
                            </div>
                            </label>
                        ))}
                        </div>
                    )}
                    </div>

                    <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Tag className="text-blue-600" /> İndirim Kuponu</h2>
                    <div className="flex gap-3">
                        <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Kupon Kodu" className="flex-1 border rounded-lg px-4 py-2 uppercase" disabled={!!appliedCoupon}/>
                        <button onClick={applyCoupon} disabled={couponLoading || !!appliedCoupon} className="bg-black text-white px-6 rounded-lg font-bold disabled:opacity-50">{couponLoading ? '...' : appliedCoupon ? 'Uygulandı' : 'Uygula'}</button>
                    </div>
                    {appliedCoupon && <div className="mt-3 bg-green-50 p-3 rounded text-green-700 text-sm flex justify-between"><span>🎉 <strong>{appliedCoupon.code}</strong> uygulandı.</span><button onClick={() => {setAppliedCoupon(null); setCouponCode('');}} className="text-red-600 hover:underline">Kaldır</button></div>}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-24">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><ShoppingBag className="text-blue-600" /> Sipariş Özeti</h2>
                    <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-1">
                        {/* 🔴 HATA BURADAYDI: safeCartItems kullanarak çözdük */}
                        {safeCartItems.map((item, idx) => (
                        <div key={idx} className="flex gap-3 text-sm border-b pb-3">
                            <img src={item.imageUrl} className="w-12 h-16 object-cover rounded" />
                            <div className="flex-1">
                            <p className="font-bold">{item.name}</p>
                            <p className="text-gray-500 text-xs">{item.selectedVariant?.size} {item.selectedVariant?.color && `/ ${item.selectedVariant.color}`}</p>
                            <p className="mt-1">{item.quantity} x {item.price} TL</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                        <div className="flex justify-between"><span>Ara Toplam</span><span className="font-bold text-gray-900">{Number(subTotal).toFixed(2)} TL</span></div>
                        {appliedCoupon && <div className="flex justify-between text-green-600"><span>İndirim</span><span className="font-bold">-{Number(discountAmount).toFixed(2)} TL</span></div>}
                        <div className="flex justify-between"><span>Kargo</span>{shippingCost === 0 ? <span className="text-green-600 font-bold">Ücretsiz</span> : <span>{shippingCost} TL</span>}</div>
                        <div className="flex justify-between text-lg font-black text-black pt-2 border-t mt-2"><span>TOPLAM</span><span>{Number(finalTotal).toFixed(2)} TL</span></div>
                    </div>
                    <button onClick={handleCreateOrder} disabled={loading || safeCartItems.length === 0} className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold mt-6 hover:bg-blue-700 disabled:bg-gray-400 flex justify-center items-center gap-2">
                        {loading ? 'İşleniyor...' : <><CreditCard size={20}/> Ödemeye Geç</>}
                    </button>
                    </div>
                </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;