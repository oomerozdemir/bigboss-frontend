// components/PayTRPayment.jsx - POLLING 30 SANİYE SONRA + KÜÇÜK OVERLAY

import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, Lock, AlertCircle, Loader, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PayTRPayment = ({ orderData, onSuccess, onFail }) => {
  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [error, setError] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const navigate = useNavigate();

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

      console.log('📤 PayTR isteği gönderiliyor');

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
        console.log('✅ PayTR iframe yüklendi');
        
        // ✅ DÜZELTME: 30 saniye sonra polling başlat (kullanıcı rahatça ödeme yapsın)
        setTimeout(() => {
          console.log('🔍 Polling başlatılıyor (30 saniye beklendi)...');
          startPaymentStatusPolling();
        }, 30000); // ✅ 30 saniye = 30000ms
        
      } else {
        const errorMsg = result.message || 'Ödeme başlatılamadı';
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

  // Polling başlat
  const startPaymentStatusPolling = () => {
    setCheckingPayment(true);
    let attempts = 0;
    const maxAttempts = 60; // 60 x 2 saniye = 2 dakika

    const pollInterval = setInterval(async () => {
      attempts++;
      
      console.log(`🔍 Ödeme durumu kontrol ediliyor... (${attempts}/${maxAttempts})`);

      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem('token');
        const orderId = orderData.orderId || orderData.merchant_oid;

        const response = await fetch(`${apiUrl}/api/orders/payment-status/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          console.log('📊 Durum:', data.paymentStatus);

          if (data.paymentStatus === 'SUCCESS') {
            clearInterval(pollInterval);
            setCheckingPayment(false);
            
            console.log('🎉 ÖDEME BAŞARILI!');
            toast.success('Ödeme başarılı! Yönlendiriliyorsunuz...');
            
            localStorage.removeItem('cart');
            localStorage.removeItem('appliedCoupon');
            
            if (onSuccess) onSuccess(data);
            
            setTimeout(() => {
              navigate(`/payment-success?order=${orderId}`);
            }, 1500);
          }
          else if (data.paymentStatus === 'FAILED') {
            clearInterval(pollInterval);
            setCheckingPayment(false);
            
            console.log('❌ ÖDEME BAŞARISIZ!');
            toast.error('Ödeme başarısız oldu');
            
            if (onFail) onFail('Ödeme başarısız');
            
            setTimeout(() => {
              navigate(`/payment-failed?reason=Ödeme başarısız`);
            }, 1500);
          }
          else {
            console.log('⏳ Ödeme bekleniyor...');
          }
        }

      } catch (error) {
        console.error('Durum kontrol hatası:', error);
      }

      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        setCheckingPayment(false);
        toast.error('Ödeme durumu kontrol edilemedi. Lütfen siparişlerim sayfasından kontrol edin.');
      }

    }, 2000);
  };

  useEffect(() => {
    if (orderData) {
      startPaymentProcess();
    }
  }, [orderData]);

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

            {/* ✅ KÜÇÜK OVERLAY - iframe'i kapatmıyor */}
            {checkingPayment && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-25">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
                  <Loader className="animate-spin" size={16} />
                  <p className="text-sm font-semibold">Ödeme kontrol ediliyor...</p>
                </div>
              </div>
            )}

            {/* IFRAME */}
            {paymentUrl && (
              <iframe
                src={paymentUrl}
                className="w-full h-full min-h-[500px] sm:min-h-[600px] border-0 relative z-10"
                title="PayTR Güvenli Ödeme"
                allow="payment"
                sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-popups allow-top-navigation"
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
          <span className="font-bold text-xs border-2 border-gray-300 px-3 py-1.5 rounded-md">VISA</span>
          <span className="font-bold text-xs border-2 border-gray-300 px-3 py-1.5 rounded-md">MasterCard</span>
          <span className="font-bold text-xs border-2 border-red-300 px-3 py-1.5 rounded-md text-red-600">Troy</span>
          <span className="font-bold text-xs bg-green-600 text-white px-3 py-1.5 rounded-md">3D Secure</span>
        </div>
        <p className="text-[10px] sm:text-xs text-gray-400 mt-3 text-center">
          🔒 Kart bilgileriniz SSL ile şifrelenir ve sistemimizde saklanmaz
        </p>
        
        {/* ✅ Test Kartı Bilgisi */}
        {paymentUrl && !checkingPayment && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-xs text-blue-700 font-semibold mb-1">
              💳 Test Kartı: 5526 0800 0000 0006
            </p>
            <p className="text-xs text-blue-600">
              CVV: 000 | 3D Şifre: 000000
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayTRPayment;