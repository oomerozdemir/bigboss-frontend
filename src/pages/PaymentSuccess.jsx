import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Pixel'in mükerrer çalışmasını önlemek için ref kullanıyoruz
  const pixelFired = useRef(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // URL'den sipariş ID'sini al
        const orderId = searchParams.get('merchant_oid');
        
        if (!orderId) {
          setLoading(false);
          return;
        }

        // Sipariş detaylarını getir
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem('token');

        const response = await fetch(`${apiUrl}/api/paytr/status/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          setOrderDetails(data.payment);
        }
      } catch (error) {
        console.error('Order fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams]);

  // ✅ META PIXEL: Alışveriş (Purchase) Olayını Gönder
  useEffect(() => {
    if (orderDetails && window.fbq && !pixelFired.current) {
      
      window.fbq('track', 'Purchase', {
        value: orderDetails.amount,       // Toplam Tutar
        currency: 'TRY',                  // Para Birimi
        content_type: 'product',
        order_id: orderDetails.orderId    // Sipariş Numarası
      });

      pixelFired.current = true; // Tekrar çalışmasını engelle
      console.log("✅ Meta Pixel: Purchase olayı gönderildi.", orderDetails.amount);
    }
  }, [orderDetails]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Başarı İkonu */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="text-green-600" size={48} />
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-3">
              Ödeme Başarılı!
            </h1>
            <p className="text-gray-600 mb-8">
              Siparişiniz başarıyla alındı. Teşekkür ederiz!
            </p>

            {/* Sipariş Bilgileri */}
            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-gray-900 mb-4">Sipariş Detayları</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sipariş No:</span>
                    <span className="font-semibold text-gray-900">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Toplam Tutar:</span>
                    <span className="font-semibold text-gray-900">{orderDetails.amount} TL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ödeme Tarihi:</span>
                    <span className="font-semibold text-gray-900">
                      {orderDetails.paidAt ? new Date(orderDetails.paidAt).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Sonraki Adımlar */}
            <div className="border-t border-gray-200 pt-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Sonraki Adımlar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Sipariş Hazırlanıyor</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Siparişiniz hazırlanmaya başlandı
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Kargoya Verilecek</p>
                    <p className="text-xs text-gray-600 mt-1">
                      1-2 iş günü içinde kargoya verilecek
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* E-posta Bildirimi */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-700">
                Sipariş detayları e-posta adresinize gönderildi. 
                Kargo takip bilgileri SMS ile iletilecektir.
              </p>
            </div>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/hesabim')}
                className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Siparişlerimi Görüntüle
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={20} />
                <span>Ana Sayfaya Dön</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;