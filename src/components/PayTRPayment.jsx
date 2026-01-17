import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, Lock, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const PayTRPayment = ({ orderData, onSuccess, onFail }) => {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [showIframe, setShowIframe] = useState(false);

  // ✅ Sipariş Verilerini Hazırla
  const preparePaymentData = () => {
    // Sepet verilerini PayTR formatına çevir
    // Format: [['Ürün Adı', 'Fiyat', Adet], ...]
    const basketItems = orderData.items.map(item => [
      item.name.substring(0, 50), // Ürün adı (max 50 karakter)
      (item.price * 100).toString(), // Fiyat (kuruş cinsinden)
      item.quantity // Adet
    ]);

    // Base64 encode
    const user_basket = btoa(JSON.stringify(basketItems));

    // Toplam tutar (kuruş cinsinden)
    const payment_amount = (orderData.totalAmount * 100).toString();

    // Sipariş ID (Benzersiz olmalı)
    const merchant_oid = orderData.orderId || `ORDER-${Date.now()}`;

    return {
      user_basket,
      user_name: orderData.user.name,
      user_address: orderData.shippingAddress,
      user_phone: orderData.user.phone,
      user_email: orderData.user.email,
      merchant_oid,
      payment_amount,
      user_ip: orderData.userIp || '0.0.0.0' // Backend'de gerçek IP alınacak
    };
  };

  // ✅ PayTR Ödeme Başlat
  const initiatePayment = async () => {
    try {
      setLoading(true);

      const paymentData = preparePaymentData();
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/api/paytr/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success) {
        setPaymentUrl(result.iframe_url);
        setShowIframe(true);
        toast.success('Ödeme sayfası açılıyor...');
      } else {
        toast.error(result.message || 'Ödeme başlatılamadı');
        if (onFail) onFail(result);
      }

    } catch (error) {
      console.error('Payment Error:', error);
      toast.error('Ödeme işlemi başlatılamadı');
      if (onFail) onFail(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Ödeme Sonucu Dinle (PostMessage)
  useEffect(() => {
    const handleMessage = (event) => {
      // Güvenlik: Sadece PayTR'den gelen mesajları dinle
      if (event.origin !== 'https://www.paytr.com') return;

      try {
        const data = JSON.parse(event.data);
        
        if (data.status === 'success') {
          toast.success('Ödeme başarılı! Siparişiniz hazırlanıyor...');
          setShowIframe(false);
          if (onSuccess) onSuccess(data);
        } else if (data.status === 'failed') {
          toast.error('Ödeme başarısız oldu');
          setShowIframe(false);
          if (onFail) onFail(data);
        }
      } catch (error) {
        console.error('Message Parse Error:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onSuccess, onFail]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      
      {/* PayTR Logo ve Güvenlik */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Güvenli Ödeme
          </h3>
          <p className="text-sm text-gray-600">
            PayTR ile güvenli ödeme yapın
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="text-green-600" size={24} />
          <Lock className="text-gray-600" size={20} />
        </div>
      </div>

      {/* Sipariş Özeti */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Sipariş Özeti</h4>
        <div className="space-y-2 text-sm">
          {orderData.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-700">
                {item.name} x{item.quantity}
              </span>
              <span className="font-semibold text-gray-900">
                {(item.price * item.quantity).toFixed(2)} TL
              </span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Toplam</span>
              <span className="text-lg">{orderData.totalAmount.toFixed(2)} TL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Güvenlik Bilgisi */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-gray-700">
          <p className="font-semibold text-blue-900 mb-1">Güvenli Ödeme</p>
          <p>
            Ödemeniz 3D Secure ile korunmaktadır. Kart bilgileriniz hiçbir zaman 
            sistemimizde saklanmaz.
          </p>
        </div>
      </div>

      {/* PayTR iFrame veya Ödeme Butonu */}
      {!showIframe ? (
        <button
          onClick={initiatePayment}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold 
                     hover:bg-green-700 transition-colors flex items-center justify-center gap-2
                     disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={20} />
              <span>Ödeme sayfası açılıyor...</span>
            </>
          ) : (
            <>
              <CreditCard size={20} />
              <span>Ödeme Yap</span>
            </>
          )}
        </button>
      ) : (
        <div className="relative">
          {/* iFrame Yükleme Göstergesi */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <Loader className="animate-spin text-gray-600" size={40} />
          </div>
          
          {/* PayTR iFrame */}
          <iframe
            src={paymentUrl}
            className="w-full h-[600px] border-0 rounded-lg relative z-10"
            title="PayTR Güvenli Ödeme"
            frameBorder="0"
            scrolling="yes"
            onLoad={() => {
              // iFrame yüklendiğinde loading göstergesini kaldır
              document.querySelector('.absolute')?.remove();
            }}
          />
          
          {/* İptal Butonu */}
          <button
            onClick={() => {
              setShowIframe(false);
              setPaymentUrl(null);
              toast.info('Ödeme iptal edildi');
            }}
            className="mt-4 w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg 
                       hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            Ödemeyi İptal Et
          </button>
        </div>
      )}

      {/* Ödeme Yöntemleri */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-3 text-center">Kabul Edilen Kartlar</p>
        <div className="flex justify-center gap-3">
          <div className="bg-white border border-gray-200 rounded px-3 py-2">
            <span className="text-xs font-semibold text-gray-700">Visa</span>
          </div>
          <div className="bg-white border border-gray-200 rounded px-3 py-2">
            <span className="text-xs font-semibold text-gray-700">Mastercard</span>
          </div>
          <div className="bg-white border border-gray-200 rounded px-3 py-2">
            <span className="text-xs font-semibold text-gray-700">Troy</span>
          </div>
          <div className="bg-green-600 text-white rounded px-3 py-2">
            <span className="text-xs font-semibold">3D Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayTRPayment;