import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, AlertTriangle, RotateCcw, Home, HelpCircle } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [failureReason, setFailureReason] = useState('');

  useEffect(() => {
    // URL'den hata kodunu al
    const reason = searchParams.get('failed_reason_msg') || 
                   searchParams.get('reason') ||
                   'Ödeme işlemi tamamlanamadı';
    setFailureReason(reason);
  }, [searchParams]);

  // Hata mesajlarını Türkçeleştir
  const getFailureMessage = (reason) => {
    const messages = {
      'INVALID_CARD': 'Kart bilgileri hatalı',
      'INSUFFICIENT_FUNDS': 'Yetersiz bakiye',
      'CARD_EXPIRED': 'Kartın geçerlilik süresi dolmuş',
      'DECLINED': 'Banka kartı reddetti',
      'TIMEOUT': 'İşlem zaman aşımına uğradı',
      '3D_VERIFICATION_FAILED': '3D Secure doğrulama başarısız',
      'CANCELLED_BY_USER': 'Kullanıcı tarafından iptal edildi'
    };

    return messages[reason] || reason;
  };

  // Yaygın sorunlar ve çözümler
  const commonIssues = [
    {
      icon: <AlertTriangle className="text-yellow-600" size={20} />,
      title: 'Kart Limiti',
      description: 'Kartınızın günlük veya aylık limitini aşmış olabilirsiniz'
    },
    {
      icon: <AlertTriangle className="text-yellow-600" size={20} />,
      title: 'İnternet Alışverişi',
      description: 'Kartınızın internet alışverişine kapalı olabilir'
    },
    {
      icon: <AlertTriangle className="text-yellow-600" size={20} />,
      title: '3D Secure',
      description: 'SMS şifresini hatalı girmiş olabilirsiniz'
    },
    {
      icon: <AlertTriangle className="text-yellow-600" size={20} />,
      title: 'Banka Onayı',
      description: 'Bankanız işlemi güvenlik nedeniyle reddetmiş olabilir'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hata İkonu */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <XCircle className="text-red-600" size={48} />
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-3">
              Ödeme Başarısız
            </h1>
            <p className="text-gray-600 mb-2">
              Ödeme işleminiz tamamlanamadı
            </p>
            
            {/* Hata Nedeni */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-sm font-semibold text-red-900">
                Hata Nedeni:
              </p>
              <p className="text-sm text-red-800 mt-1">
                {getFailureMessage(failureReason)}
              </p>
            </div>

            {/* Ne Yapmalıyım? */}
            <div className="border-t border-gray-200 pt-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle size={20} />
                Ne Yapmalıyım?
              </h3>
              <div className="space-y-3">
                {commonIssues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-3 bg-yellow-50 p-3 rounded-lg">
                    {issue.icon}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{issue.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{issue.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Öneriler */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">Öneriler</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Kart bilgilerinizi kontrol edin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Kartınızın internet alışverişine açık olduğundan emin olun</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Farklı bir kart ile deneyebilirsiniz</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Bankanızı arayarak işlemi onaylayabilirsiniz</span>
                </li>
              </ul>
            </div>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                <span>Tekrar Dene</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={20} />
                <span>Ana Sayfaya Dön</span>
              </button>
            </div>

            {/* Yardım */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Sorun devam ediyorsa{' '}
                <button 
                  onClick={() => navigate('/iletisim')}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  müşteri hizmetleri
                </button>
                {' '}ile iletişime geçebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentFailed;