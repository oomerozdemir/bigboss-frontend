import React, { useState, useEffect } from 'react';
import { Shield, Lock, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const PayTRPayment = ({ orderData, onSuccess, onFail }) => {
  const [loading, setLoading] = useState(true); // API isteği ve iframe yüklenmesi için ortak loading
  const [iframeUrl, setIframeUrl] = useState(null);

  // 1. Bileşen Açılınca Token Al (Otomatik)
  useEffect(() => {
    const fetchPaytrToken = async () => {
      try {
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
            payment_amount: orderData.payment_amount
        };

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/paytr/create-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status === 'success') {
          setIframeUrl(result.iframe_url);
          // Loading'i kapatmıyoruz, iframe onLoad olunca kapatacağız
        } else {
          console.error('PayTR Hatası:', result.message);
          toast.error(`Hata: ${result.message}`);
          if (onFail) onFail(result.message);
          setLoading(false);
        }
      } catch (error) {
        console.error('Bağlantı Hatası:', error);
        toast.error('Ödeme sunucusuna bağlanılamadı');
        if (onFail) onFail('Sunucu hatası');
        setLoading(false);
      }
    };

    if (orderData) {
      fetchPaytrToken();
    }
  }, [orderData]);

  // 2. Iframe Sonucunu Dinle
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.status === 'success') {
        if (onSuccess) onSuccess();
      } else if (event.data.status === 'failed') {
        if (onFail) onFail(event.data.reason || 'Ödeme başarısız');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, onFail]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      
      {/* Başlık ve Güvenlik İkonları */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Güvenli Ödeme</h3>
          <p className="text-sm text-gray-600">3D Secure ile korumalı işlem</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="text-green-600" size={24} />
          <Lock className="text-gray-600" size={20} />
        </div>
      </div>

      {/* Sipariş Özeti */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
        <div className="flex justify-between items-center font-bold text-gray-900">
          <span>Ödenecek Tutar</span>
          <span className="text-lg text-green-600">{orderData.totalAmount?.toFixed(2)} TL</span>
        </div>
      </div>

      {/* Iframe Alanı */}
      <div className="relative w-full min-h-[600px] border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        
        {/* Yükleniyor Göstergesi (Hem API isteği hem iframe yüklenirken görünür) */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
            <Loader className="animate-spin text-blue-600 mb-4" size={40} />
            <span className="text-gray-500 font-medium animate-pulse">
                {iframeUrl ? 'PayTR ekranı yükleniyor...' : 'Ödeme başlatılıyor...'}
            </span>
          </div>
        )}
        
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            className="w-full h-full min-h-[600px] border-0 relative z-10"
            title="PayTR Ödeme"
            allow="payment"
            onLoad={() => setLoading(false)} // ✅ React State ile loading kapatma (Doğrusu budur)
          />
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center h-full text-red-500 gap-2">
                <AlertCircle size={32}/>
                <p>Ödeme formu yüklenemedi. Lütfen sayfayı yenileyin.</p>
            </div>
          )
        )}
      </div>

      {/* Alt Bilgi */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
            Kredi kartı bilgileriniz sistemimizde saklanmaz ve doğrudan PayTR güvenli ödeme altyapısına iletilir.
        </p>
      </div>

    </div>
  );
};

export default PayTRPayment;