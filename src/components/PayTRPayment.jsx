import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, Lock, AlertCircle, Loader, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PayTRPayment = ({ orderData, onSuccess, onFail }) => {
  const [loading, setLoading] = useState(true); // Başlangıçta yükleniyor
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [error, setError] = useState(null); // Hata durumunu tutmak için
  const navigate = useNavigate();

  // ✅ Tek Bir Fonksiyon: Ödeme Başlatma
  const startPaymentProcess = async () => {
    try {
      setLoading(true);
      setError(null); // Önceki hataları temizle

      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');

      // 1. Token Kontrolü
      if (!token) {
        toast.error('Oturum bulunamadı. Lütfen giriş yapın.');
        navigate('/admin'); // veya '/hesabim'
        return;
      }

      // Sepet Verisini Hazırla
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
          payment_amount: (orderData.totalAmount * 100).toString()
      };

      const response = await fetch(`${apiUrl}/api/paytr/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      // 2. Oturum Süresi Dolmuşsa (401) -> Login'e at
      if (response.status === 401) {
        localStorage.removeItem('token');
        toast.error('Oturum süreniz doldu. Tekrar giriş yapın.');
        navigate('/admin'); // veya '/hesabim'
        return;
      }

      const result = await response.json();

      if (result.success || result.status === 'success') {
        setPaymentUrl(result.iframe_url);
        // Loading'i kapatma, iframe onLoad ile kapatacağız
      } else {
        // 🔴 BURASI ÖNEMLİ: API Hatası olursa yönlendirme YAPMA, sadece hata göster.
        const errorMsg = result.message || 'Ödeme başlatılamadı';
        console.error('PayTR Hatası:', errorMsg);
        setError(errorMsg); // Ekranda hata göster
        toast.error(errorMsg);
        setLoading(false);
      }

    } catch (err) {
      console.error('Bağlantı Hatası:', err);
      setError('Sunucu ile bağlantı kurulamadı.');
      toast.error('Bağlantı hatası');
      setLoading(false);
    }
  };

  // ✅ Bileşen Açılınca Otomatik Başlat
  useEffect(() => {
    if (orderData) {
      startPaymentProcess();
    }
  }, [orderData]);

  // ✅ Iframe Mesajlarını Dinle (Başarılı/Başarısız Yönlendirmesi Burada)
  useEffect(() => {
    const handleMessage = (event) => {
      // Güvenlik: Sadece PayTR veya Kendi Backendinizden gelen mesajları kabul edin
      const allowedOrigins = ['https://www.paytr.com', 'https://bigboss-backend.onrender.com'];
      if (!allowedOrigins.includes(event.origin)) return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        if (data.status === 'success') {
          // ✅ Sadece işlem başarılıysa yönlendir
          toast.success('Ödeme başarılı!');
          if (onSuccess) onSuccess(data); 
        } else if (data.status === 'failed') {
          // ❌ Iframe içinden hata geldiyse yönlendir
          toast.error('Ödeme başarısız oldu');
          if (onFail) onFail(data.reason || 'Bilinmeyen hata');
        }
      } catch (e) {
        // JSON hatası önemsiz
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
        <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Ödenecek Tutar</span>
            <span className="text-2xl font-bold text-green-600">{orderData.totalAmount?.toFixed(2)} TL</span>
        </div>
      </div>

      {/* İçerik Alanı: Loading / Hata / Iframe */}
      <div className="relative w-full min-h-[600px] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        
        {/* DURUM 1: Hata Varsa (Retry Butonu Göster) */}
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white z-30">
            <AlertCircle className="text-red-500 mb-3" size={48} />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Bir Sorun Oluştu</h4>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={startPaymentProcess}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <RotateCcw size={20} />
              Tekrar Dene
            </button>
          </div>
        ) : (
          /* DURUM 2: Iframe veya Loading */
          <>
            {/* Loading Göstergesi (Iframe yüklenirken üstte durur) */}
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
                <Loader className="animate-spin text-blue-600 mb-4" size={40} />
                <span className="text-gray-500 font-medium animate-pulse">
                  Güvenli ödeme sayfası hazırlanıyor...
                </span>
              </div>
            )}

            {/* PayTR Iframe */}
            {paymentUrl && (
              <iframe
                src={paymentUrl}
                className="w-full h-full border-0 relative z-10"
                title="PayTR Güvenli Ödeme"
                allow="payment"
                onLoad={() => setLoading(false)} // Iframe yüklenince loading kalkar
              />
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <div className="flex justify-center items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
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