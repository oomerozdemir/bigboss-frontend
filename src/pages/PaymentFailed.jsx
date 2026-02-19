import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, AlertTriangle, RotateCcw, Home, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [failureReason, setFailureReason] = useState('');

  useEffect(() => {
    const reason = searchParams.get('failed_reason_msg') ||
                   searchParams.get('reason') ||
                   'Ödeme işlemi tamamlanamadı';
    setFailureReason(reason);
  }, [searchParams]);

  const getFailureMessage = (reason) => {
    const keyMap = {
      'INVALID_CARD': 'payment_failed.err_invalid_card',
      'INSUFFICIENT_FUNDS': 'payment_failed.err_insufficient_funds',
      'CARD_EXPIRED': 'payment_failed.err_card_expired',
      'DECLINED': 'payment_failed.err_declined',
      'TIMEOUT': 'payment_failed.err_timeout',
      '3D_VERIFICATION_FAILED': 'payment_failed.err_3d_failed',
      'CANCELLED_BY_USER': 'payment_failed.err_cancelled'
    };

    return keyMap[reason] ? t(keyMap[reason]) : reason;
  };

  const commonIssues = [
    {
      icon: <AlertTriangle className="text-yellow-600" size={20} />,
      title: t('payment_failed.issue_limit_title'),
      description: t('payment_failed.issue_limit_desc')
    },
    {
      icon: <AlertTriangle className="text-yellow-600" size={20} />,
      title: t('payment_failed.issue_online_title'),
      description: t('payment_failed.issue_online_desc')
    },
    {
      icon: <AlertTriangle className="text-yellow-600" size={20} />,
      title: t('payment_failed.issue_3d_title'),
      description: t('payment_failed.issue_3d_desc')
    },
    {
      icon: <AlertTriangle className="text-yellow-600" size={20} />,
      title: t('payment_failed.issue_bank_title'),
      description: t('payment_failed.issue_bank_desc')
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <XCircle className="text-red-600" size={48} />
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-3">
              {t('payment_failed.title')}
            </h1>
            <p className="text-gray-600 mb-2">
              {t('payment_failed.subtitle')}
            </p>

            {/* Hata Nedeni */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-sm font-semibold text-red-900">
                {t('payment_failed.error_reason')}
              </p>
              <p className="text-sm text-red-800 mt-1">
                {getFailureMessage(failureReason)}
              </p>
            </div>

            {/* Ne Yapmalıyım? */}
            <div className="border-t border-gray-200 pt-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle size={20} />
                {t('payment_failed.what_to_do')}
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
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">{t('payment_failed.suggestions')}</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{t('payment_failed.tip1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{t('payment_failed.tip2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{t('payment_failed.tip3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{t('payment_failed.tip4')}</span>
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
                <span>{t('payment_failed.retry')}</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={20} />
                <span>{t('payment_failed.go_home')}</span>
              </button>
            </div>

            {/* Yardım */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {t('payment_failed.help_text')}{' '}
                <button
                  onClick={() => navigate('/iletisim')}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {t('payment_failed.customer_service')}
                </button>
                {' '}{t('payment_failed.help_suffix')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentFailed;
