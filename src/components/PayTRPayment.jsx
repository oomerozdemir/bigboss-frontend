// DOSYA: src/components/PayTRPayment.jsx
import React, { useState, useEffect } from 'react';
import { Shield, Lock, AlertCircle, Loader, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PayTRPayment = ({ orderData, onSuccess, onFail }) => {
  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1. Ödemeyi Başlat (Backend'den Token Al)
  const startPaymentProcess = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Oturum süreniz doldu.');
        navigate('/admin');
        return;
      }

      // Sepet verisini hazırla
      let userBasket = orderData.user_basket;
      if (!userBasket && orderData.items) {
          const basketItems = orderData.items.map(item => [
              item.name.substring(0, 50), 
              (item.price * 100).toString(), 
              item.quantity
          ]);
          userBasket = JSON.stringify(basketItems);
      }

      const payload = {
          ...orderData,
          user_basket: userBasket,
          payment_amount: orderData.payment_amount || Math.round((orderData.totalAmount || 0) * 100)
      };

      // Backend'e istek at
      const response = await fetch(`${apiUrl}/api/paytr/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        setPaymentUrl(result.iframe_url);
      } else {
        setError(result.message || 'Ödeme başlatılamadı');
        setLoading(false);
      }

    } catch (err) {
      console.error('Hata:', err);
      setError('Sunucu hatası oluştu');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderData) startPaymentProcess();
  }, [orderData]);

  // 2. Iframe Mesajlarını Dinle (YÖNLENDİRME BURADA YAPILIR)
  useEffect(() => {
    const handleMessage = (event) => {
      // Backend'den gelen 'success' mesajını yakala
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        if (data.status === 'success') {
          console.log("✅ Ödeme Başarılı! Yönlendiriliyor...");
          toast.success('Ödeme başarılı! Yönlendiriliyorsunuz...');
          
          // Eğer dışarıdan onSuccess geldiyse onu çalıştır (CheckOutPage.jsx içindeki fonksiyon)
          if (onSuccess) onSuccess(data); 
          
        } else if (data.status === 'failed') {
          console.error("❌ Ödeme Başarısız:", data.reason);
          toast.error('Ödeme başarısız');
          if (onFail) onFail(data.reason);
        }
      } catch (e) {
        // Önemsiz JSON hatalarını yoksay
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, onFail]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Güvenli Ödeme</h3>
          <p className="text-sm text-gray-600">PayTR altyapısı ile şifreli işlem</p>
        </div>
        <Shield className="text-green-600" size={24} />
      </div>

      <div className="relative w-full min-h-[600px] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white z-30">
            <AlertCircle className="text-red-500 mb-3" size={48} />
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={startPaymentProcess} className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2">
              <RotateCcw size={20} /> Tekrar Dene
            </button>
          </div>
        ) : (
          <>
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
                <Loader className="animate-spin text-blue-600 mb-4" size={40} />
                <span className="text-gray-500 font-medium">Ödeme ekranı yükleniyor...</span>
              </div>
            )}
            {paymentUrl && (
              <iframe
                src={paymentUrl}
                className="w-full h-full border-0 relative z-10"
                // 🔴 Yönlendirme için gerekli izinler:
                sandbox="allow-forms allow-modals allow-popups allow-scripts allow-same-origin allow-top-navigation"
                allow="payment"
                onLoad={() => setLoading(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PayTRPayment;