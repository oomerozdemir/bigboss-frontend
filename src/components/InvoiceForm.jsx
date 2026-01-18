// components/InvoiceForm.jsx - FATURA BİLGİLERİ KOMPONENTI

import React, { useState } from 'react';
import { FileText, Building2, User, AlertCircle } from 'lucide-react';

const InvoiceForm = ({ invoiceData, setInvoiceData }) => {
  const [invoiceType, setInvoiceType] = useState('INDIVIDUAL'); // INDIVIDUAL veya CORPORATE
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Fatura tipini değiştir
  const handleInvoiceTypeChange = (type) => {
    setInvoiceType(type);
    setInvoiceData({
      ...invoiceData,
      invoiceType: type,
      // Tip değiştiğinde diğer alanları temizle
      tcNo: '',
      companyName: '',
      taxOffice: '',
      taxNumber: ''
    });
  };

  // TC No validasyonu
  const validateTCNo = (tc) => {
    return /^[1-9][0-9]{10}$/.test(tc);
  };

  // Vergi No validasyonu
  const validateTaxNo = (taxNo) => {
    return /^[0-9]{10}$/.test(taxNo);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
      
      {/* Başlık */}
      <div className="flex items-center gap-2 mb-6">
        <FileText className="text-blue-600" size={24} />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Fatura Bilgileri</h2>
      </div>

      {/* Fatura Tipi Seçimi */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Fatura Tipi
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Bireysel Fatura */}
          <button
            type="button"
            onClick={() => handleInvoiceTypeChange('INDIVIDUAL')}
            className={`relative flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
              invoiceType === 'INDIVIDUAL'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              invoiceType === 'INDIVIDUAL' ? 'border-blue-600' : 'border-gray-300'
            }`}>
              {invoiceType === 'INDIVIDUAL' && (
                <div className="w-3 h-3 rounded-full bg-blue-600" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <User className={invoiceType === 'INDIVIDUAL' ? 'text-blue-600' : 'text-gray-500'} size={20} />
              <div className="text-left">
                <p className={`font-semibold ${invoiceType === 'INDIVIDUAL' ? 'text-blue-900' : 'text-gray-900'}`}>
                  Bireysel Fatura
                </p>
                <p className="text-xs text-gray-500">Şahıs adına</p>
              </div>
            </div>
          </button>

          {/* Kurumsal Fatura */}
          <button
            type="button"
            onClick={() => handleInvoiceTypeChange('CORPORATE')}
            className={`relative flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
              invoiceType === 'CORPORATE'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              invoiceType === 'CORPORATE' ? 'border-blue-600' : 'border-gray-300'
            }`}>
              {invoiceType === 'CORPORATE' && (
                <div className="w-3 h-3 rounded-full bg-blue-600" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Building2 className={invoiceType === 'CORPORATE' ? 'text-blue-600' : 'text-gray-500'} size={20} />
              <div className="text-left">
                <p className={`font-semibold ${invoiceType === 'CORPORATE' ? 'text-blue-900' : 'text-gray-900'}`}>
                  Kurumsal Fatura
                </p>
                <p className="text-xs text-gray-500">Şirket adına</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Bireysel Fatura Formu */}
      {invoiceType === 'INDIVIDUAL' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TC Kimlik No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength="11"
              value={invoiceData.tcNo || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Sadece rakam
                setInvoiceData({ ...invoiceData, tcNo: value });
              }}
              placeholder="12345678901 (11 haneli)"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                invoiceData.tcNo && !validateTCNo(invoiceData.tcNo)
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              required
            />
            {invoiceData.tcNo && !validateTCNo(invoiceData.tcNo) && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                TC Kimlik No 11 haneli olmalıdır
              </p>
            )}
          </div>

          {/* Bilgilendirme */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-blue-800">
              E-fatura TC Kimlik numaranıza kayıtlı e-posta adresinize gönderilecektir.
            </p>
          </div>
        </div>
      )}

      {/* Kurumsal Fatura Formu */}
      {invoiceType === 'CORPORATE' && (
        <div className="space-y-4">
          
          {/* Şirket Adı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şirket Ünvanı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={invoiceData.companyName || ''}
              onChange={(e) => setInvoiceData({ ...invoiceData, companyName: e.target.value })}
              placeholder="Örn: ABC Tekstil Ticaret Limited Şirketi"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Vergi Dairesi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vergi Dairesi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={invoiceData.taxOffice || ''}
              onChange={(e) => setInvoiceData({ ...invoiceData, taxOffice: e.target.value })}
              placeholder="Örn: Kadıköy Vergi Dairesi"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Vergi Numarası */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vergi Numarası <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength="10"
              value={invoiceData.taxNumber || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setInvoiceData({ ...invoiceData, taxNumber: value });
              }}
              placeholder="1234567890 (10 haneli)"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                invoiceData.taxNumber && !validateTaxNo(invoiceData.taxNumber)
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              required
            />
            {invoiceData.taxNumber && !validateTaxNo(invoiceData.taxNumber) && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                Vergi numarası 10 haneli olmalıdır
              </p>
            )}
          </div>

          {/* Bilgilendirme */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-green-800">
              E-fatura sistemine kayıtlı şirketinizin e-fatura adresine gönderilecektir.
            </p>
          </div>
        </div>
      )}

      {/* Fatura Adresi */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={sameAsShipping}
            onChange={(e) => {
              setSameAsShipping(e.target.checked);
              if (e.target.checked) {
                setInvoiceData({ ...invoiceData, invoiceAddress: '' });
              }
            }}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">
            Fatura adresi teslimat adresi ile aynı
          </span>
        </label>

        {!sameAsShipping && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fatura Adresi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={invoiceData.invoiceAddress || ''}
              onChange={(e) => setInvoiceData({ ...invoiceData, invoiceAddress: e.target.value })}
              placeholder="Fatura adresinizi detaylı olarak yazın..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required={!sameAsShipping}
            />
          </div>
        )}
      </div>

      {/* Alt Bilgilendirme */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          📋 Fatura Bilgisi
        </h4>
        <ul className="space-y-1 text-xs text-gray-600">
          <li>• Faturanız sipariş tamamlandıktan sonra e-posta ile gönderilecektir</li>
          <li>• E-fatura sistemi üzerinden otomatik olarak iletilecektir</li>
          <li>• Kurumsal müşterilerimiz için fatura bilgileri zorunludur</li>
        </ul>
      </div>
    </div>
  );
};

export default InvoiceForm;