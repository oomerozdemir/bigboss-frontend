// components/PayTRPayment.jsx - COMPLETE NAVIGATION FIX

import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, Lock, AlertCircle, Loader, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PayTRPayment = ({ orderData, onSuccess, onFail }) => {
  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Ödeme Başlatma
  const startPaymentProcess = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Oturum bulunamadı. Lütfen giriş yapın.');
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

      if (response.status === 401) {
        localStorage.removeItem('token');
        toast.error('Oturum süreniz doldu. Tekrar giriş yapın.');
        navigate('/admin');
        return;
      }

      const result = await response.json();

      if (result.success || result.status === 'success') {
        setPaymentUrl(result.iframe_url);
        console.log('✅ PayTR iframe URL alındı');
      } else {
        const errorMsg = result.message || 'Ödeme başlatılamadı';
        console.error('❌ PayTR Hatası:', errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
      }

    } catch (err) {
      console.error('❌ Bağlantı Hatası:', err);
      setError('Sunucu ile bağlantı kurulamadı.');
      toast.error('Bağlantı hatası');
      setLoading(false);
    }
  };

  // ✅ Component mount olunca başlat
  useEffect(() => {
    if (orderData) {
      startPaymentProcess();
    }
  }, [orderData]);

  // ✅ KRITIK: PostMessage ile gelen sonuçları dinle ve YÖNLENDİR
  useEffect(() => {
    const handleMessage = (event) => {
      // Güvenlik: Sadece PayTR veya backend'den gelen mesajları kabul et
      const allowedOrigins = [
        'https://www.paytr.com',
        'https://bigboss-backend.onrender.com',
        import.meta.env.VITE_API_URL
      ];
      
      if (!allowedOrigins.includes(event.origin)) {
        console.log('🚫 İzin verilmeyen origin:', event.origin);
        return;
      }

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        console.log('📨 PayTR Mesaj alındı:', data);
        
        // ✅ BAŞARILI ÖDEME
        if (data.status === 'success') {
          console.log('✅ Ödeme başarılı! Sipariş:', data.merchant_oid);
          
          // Loading toast göster
          toast.loading('Ödeme başarılı! Yönlendiriliyorsunuz...', { duration: 1500 });
          
          // Sepeti temizle
          localStorage.removeItem('cart');
          localStorage.removeItem('appliedCoupon');
          
          // Callback varsa çağır
          if (onSuccess) {
            onSuccess(data);
          }
          
          // Kısa bir gecikme ile yönlendir (toast mesajı görünsün diye)
          setTimeout(() => {
            if (data.merchant_oid) {
              navigate(`/payment-success?merchant_oid=${data.merchant_oid}`);
            } else if (orderData.orderId) {
              navigate(`/payment-success?merchant_oid=${orderData.orderId}`);
            } else {
              navigate('/payment-success');
            }
          }, 1500);
        } 
        // ❌ BAŞARISIZ ÖDEME
        else if (data.status === 'failed') {
          console.error('❌ Ödeme başarısız:', data.reason);
          
          // Loading toast göster
          toast.loading('Ödeme başarısız, yönlendiriliyorsunuz...', { duration: 1500 });
          
          // Callback varsa çağır
          if (onFail) {
            onFail(data.reason || 'Bilinmeyen hata');
          }
          
          // Kısa bir gecikme ile yönlendir
          setTimeout(() => {
            const reason = encodeURIComponent(data.reason || 'Ödeme işlemi başarısız oldu');
            navigate(`/payment-failed?reason=${reason}`);
          }, 1500);
        }
      } catch (e) {
        console.error('❌ PayTR mesaj parse hatası:', e);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, onFail, navigate, orderData]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Güvenli Ödeme</h3>
          <p className="text-xs sm:text-sm text-gray-600">PayTR altyapısı ile şifreli işlem</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="text-green-600" size={24} />
          <Lock className="text-gray-600" size={20} />
        </div>
      </div>

      {/* Sipariş Özeti */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-6 border-2 border-green-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium text-sm sm:text-base">Ödenecek Tutar</span>
          <span className="text-xl sm:text-2xl font-black text-green-700">
            {orderData.totalAmount?.toFixed(2)} TL
          </span>
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="relative w-full min-h-[500px] sm:min-h-[600px] bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
        
        {/* HATA DURUMU */}
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white z-30">
            <AlertCircle className="text-red-500 mb-3" size={48} />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Bir Sorun Oluştu</h4>
            <p className="text-gray-600 mb-6 max-w-md">{error}</p>
            <button 
              onClick={startPaymentProcess}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              <RotateCcw size={20} />
              Tekrar Dene
            </button>
          </div>
        ) : (
          <>
            {/* LOADING */}
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
                <Loader className="animate-spin text-blue-600 mb-4" size={40} />
                <span className="text-gray-500 font-medium animate-pulse">
                  Güvenli ödeme sayfası hazırlanıyor...
                </span>
              </div>
            )}

            {/* IFRAME */}
            {paymentUrl && (
              <iframe
                src={paymentUrl}
                className="w-full h-full min-h-[500px] sm:min-h-[600px] border-0 relative z-10"
                title="PayTR Güvenli Ödeme"
                allow="payment"
                sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-popups"
                onLoad={() => {
                  setLoading(false);
                  console.log('✅ PayTR iframe yüklendi');
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-center items-center gap-3 sm:gap-4 flex-wrap">
          <span className="font-bold text-xs border-2 border-gray-300 px-3 py-1.5 rounded-md hover:border-blue-500 transition-colors">VISA</span>
          <span className="font-bold text-xs border-2 border-gray-300 px-3 py-1.5 rounded-md hover:border-blue-500 transition-colors">MasterCard</span>
          <span className="font-bold text-xs border-2 border-red-300 px-3 py-1.5 rounded-md text-red-600 hover:border-red-500 transition-colors">Troy</span>
          <span className="font-bold text-xs bg-green-600 text-white px-3 py-1.5 rounded-md">3D Secure</span>
        </div>
        <p className="text-[10px] sm:text-xs text-gray-400 mt-3 text-center">
          🔒 Kart bilgileriniz SSL ile şifrelenir ve sistemimizde saklanmaz
        </p>
      </div>
    </div>
  );
};

export default PayTRPayment;