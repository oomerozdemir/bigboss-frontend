import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, Lock, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // ✅ Yönlendirme için eklendi

const PayTRPayment = ({ orderData, onSuccess, onFail }) => {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [showIframe, setShowIframe] = useState(false);
  const navigate = useNavigate(); // ✅ Hook eklendi

  // Sipariş Verilerini Hazırla
  const preparePaymentData = () => {
    const basketItems = orderData.items.map(item => [
      item.name.substring(0, 50), 
      (item.price * 100).toString(), 
      item.quantity
    ]);

    const user_basket = JSON.stringify(basketItems);

    return {
      user_basket,
      user_name: orderData.user.name,
      user_address: orderData.shippingAddress,
      user_phone: orderData.user.phone,
      user_email: orderData.user.email,
      merchant_oid: orderData.orderId || `ORDER-${Date.now()}`,
      payment_amount: (orderData.totalAmount * 100).toString(),
      user_ip: orderData.userIp || '0.0.0.0'
    };
  };

  // PayTR Ödeme Başlat
  const initiatePayment = async () => {
    try {
      setLoading(true);

      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');

      // 🔴 1. Token Kontrolü (Client Tarafı)
      if (!token) {
        toast.error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
        navigate('/login'); // Giriş sayfasına at
        return;
      }

      const paymentData = preparePaymentData();

      const response = await fetch(`${apiUrl}/api/paytr/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Token'ı header'a ekle
        },
        body: JSON.stringify(paymentData)
      });

      // 🔴 2. 401 Yetki Hatası Kontrolü (Server Tarafı)
      if (response.status === 401) {
        localStorage.removeItem('token'); // Geçersiz token'ı temizle
        toast.error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
        navigate('/login');
        return;
      }

      const result = await response.json();

      if (result.success) { // Backend 'success' veya 'status: success' dönebilir, kontrol edin
        setPaymentUrl(result.iframe_url);
        setShowIframe(true);
        toast.success('Ödeme sayfası açılıyor...');
      } else {
        // Hata mesajını güvenli al
        const errorMsg = result.message || result.error || 'Ödeme başlatılamadı';
        console.error('PayTR Hatası:', errorMsg);
        toast.error(errorMsg);
        if (onFail) onFail(errorMsg);
      }

    } catch (error) {
      console.error('Payment Error:', error);
      toast.error('Sunucu bağlantı hatası');
      if (onFail) onFail(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Ödeme Sonucu Dinle
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'https://www.paytr.com') return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        if (data.status === 'success') {
          toast.success('Ödeme başarılı!');
          setShowIframe(false);
          if (onSuccess) onSuccess(data);
        } else if (data.status === 'failed') {
          toast.error('Ödeme başarısız oldu');
          setShowIframe(false);
          if (onFail) onFail(data.reason || 'Bilinmeyen hata');
        }
      } catch (error) {
        // console.error('Message Parse Error:', error); // Gereksiz log kirliliğini önlemek için kapalı
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, onFail]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Güvenli Ödeme</h3>
          <p className="text-sm text-gray-600">PayTR altyapısı ile şifreli işlem</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="text-green-600" size={24} />
          <Lock className="text-gray-600" size={20} />
        </div>
      </div>

      {/* Sipariş Özeti */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Ödenecek Tutar</h4>
        <div className="flex justify-between items-center">
            <span className="text-gray-600">Toplam</span>
            <span className="text-2xl font-bold text-green-600">{orderData.totalAmount?.toFixed(2)} TL</span>
        </div>
      </div>

      {/* Buton veya Iframe */}
      {!showIframe ? (
        <button
          onClick={initiatePayment}
          disabled={loading}
          className="w-full bg-black text-white py-4 px-6 rounded-lg font-bold text-lg
                     hover:bg-gray-800 transition-all flex items-center justify-center gap-3
                     disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={24} />
              <span>Bağlanıyor...</span>
            </>
          ) : (
            <>
              <CreditCard size={24} />
              <span>Kart ile Öde</span>
            </>
          )}
        </button>
      ) : (
        <div className="relative animate-in fade-in duration-500">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg -z-10">
            <Loader className="animate-spin text-gray-400" size={40} />
          </div>
          
          <iframe
            src={paymentUrl}
            className="w-full h-[600px] border-0 rounded-lg shadow-sm"
            title="PayTR Güvenli Ödeme"
            onLoad={() => {
                // Iframe yüklendiğinde loading animasyonunu kaldır (CSS/DOM ile gerek yok, z-index halleder)
            }}
          />
          
          <button
            onClick={() => {
              setShowIframe(false);
              setPaymentUrl(null);
              toast('İşlem iptal edildi', { icon: 'ℹ️' });
            }}
            className="mt-4 w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            İptal Et ve Geri Dön
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <div className="flex justify-center items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
            {/* Temsili Kart Logoları - Metin veya SVG */}
            <span className="font-bold text-xs border px-2 py-1 rounded">VISA</span>
            <span className="font-bold text-xs border px-2 py-1 rounded">MasterCard</span>
            <span className="font-bold text-xs border px-2 py-1 rounded text-red-600">Troy</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">Kart bilgileriniz sistemimizde saklanmaz.</p>
      </div>
    </div>
  );
};

export default PayTRPayment;