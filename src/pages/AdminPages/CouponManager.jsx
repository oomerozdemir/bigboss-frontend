import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Edit2, TrendingUp, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    expirationDate: '',
    usageLimit: '',
    isActive: true
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      toast.error('Kuponlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
      expirationDate: formData.expirationDate || null,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null, // ✅ YENİ
      isActive: formData.isActive
    };

    try {
      const url = editingCoupon 
        ? `${import.meta.env.VITE_API_URL}/api/coupons/${editingCoupon.id}`
        : `${import.meta.env.VITE_API_URL}/api/coupons`;
      
      const response = await fetch(url, {
        method: editingCoupon ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(editingCoupon ? 'Kupon güncellendi' : 'Kupon oluşturuldu');
        setShowModal(false);
        resetForm();
        fetchCoupons();
      } else {
        const error = await response.json();
        toast.error(error.error || 'İşlem başarısız');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm('Bu kuponu silmek istediğinize emin misiniz?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Kupon silindi');
        fetchCoupons();
      }
    } catch (error) {
      toast.error('Silinemedi');
    }
  };

  const editCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || '',
      expirationDate: coupon.expirationDate ? new Date(coupon.expirationDate).toISOString().split('T')[0] : '',
      usageLimit: coupon.usageLimit || '', // ✅ YENİ
      isActive: coupon.isActive
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderAmount: '',
      expirationDate: '',
      usageLimit: '', // ✅ YENİ
      isActive: true
    });
    setEditingCoupon(null);
  };

  // ✅ Kullanım yüzdesi hesapla
  const getUsagePercentage = (coupon) => {
    if (!coupon.usageLimit) return null;
    return Math.round((coupon.usedCount / coupon.usageLimit) * 100);
  };

  // ✅ Durum rengi
  const getStatusColor = (coupon) => {
    if (!coupon.isActive) return 'bg-gray-100 text-gray-600';
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return 'bg-red-100 text-red-600';
    if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) return 'bg-orange-100 text-orange-600';
    return 'bg-green-100 text-green-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="text-blue-600" size={28} />
            Kupon Yönetimi
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {coupons.length} adet kupon tanımlı
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-semibold"
        >
          <Plus size={20} />
          Yeni Kupon Ekle
        </button>
      </div>

      {/* Kupon Listesi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {coupons.map((coupon) => {
          const usagePercentage = getUsagePercentage(coupon);
          const isExpired = coupon.expirationDate && new Date(coupon.expirationDate) < new Date();
          const isLimitReached = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

          return (
            <div
              key={coupon.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all"
            >
              {/* Üst Kısım */}
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl sm:text-2xl font-black text-blue-600">
                        {coupon.code}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(coupon)}`}>
                        {!coupon.isActive ? 'Pasif' : isLimitReached ? 'Tükendi' : isExpired ? 'Süresi Doldu' : 'Aktif'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {coupon.discountType === 'PERCENTAGE' 
                        ? `%${coupon.discountValue} İndirim`
                        : `${coupon.discountValue} TL İndirim`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editCoupon(coupon)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Düzenle"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Detaylar */}
                <div className="space-y-2 text-sm">
                  {coupon.minOrderAmount > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-semibold">Min. Tutar:</span>
                      <span>{coupon.minOrderAmount} TL</span>
                    </div>
                  )}
                  
                  {coupon.expirationDate && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-semibold">Son Kullanma:</span>
                      <span>{new Date(coupon.expirationDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                  )}

                  {/* ✅ YENİ: Kullanım Limiti */}
                  {coupon.usageLimit && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">Kullanım Durumu</span>
                        <span className="text-xs font-bold text-gray-900">
                          {coupon.usedCount} / {coupon.usageLimit}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            usagePercentage >= 100 
                              ? 'bg-red-500' 
                              : usagePercentage >= 75 
                                ? 'bg-orange-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        />
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-1">
                        {coupon.usageLimit - coupon.usedCount > 0 
                          ? `${coupon.usageLimit - coupon.usedCount} kullanım hakkı kaldı`
                          : 'Kullanım hakkı tükendi'}
                      </p>
                    </div>
                  )}

                  {/* Sınırsız kullanım */}
                  {!coupon.usageLimit && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded">
                      <TrendingUp size={16} />
                      <span className="text-xs font-semibold">Sınırsız Kullanım</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kupon Ekleme/Düzenleme Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingCoupon ? 'Kupon Düzenle' : 'Yeni Kupon Ekle'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Kupon Kodu */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kupon Kodu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="SUMMER50"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
                    required
                  />
                </div>

                {/* İndirim Tipi */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    İndirim Tipi
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PERCENTAGE">Yüzde (%)</option>
                    <option value="FIXED">Sabit Tutar (TL)</option>
                  </select>
                </div>

                {/* İndirim Miktarı */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    İndirim Miktarı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                    placeholder={formData.discountType === 'PERCENTAGE' ? '50' : '100'}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Min. Sipariş Tutarı */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Min. Sipariş Tutarı (TL)
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                    placeholder="200"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* ✅ YENİ: Kullanım Limiti */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kullanım Limiti
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                    placeholder="100 (Boş bırakırsanız sınırsız)"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Boş bırakırsanız kupon sınırsız kullanılabilir
                  </p>
                </div>

                {/* Son Kullanma Tarihi */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Son Kullanma Tarihi
                  </label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Aktif/Pasif */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                    Aktif
                  </label>
                </div>

                {/* Butonlar */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingCoupon ? 'Güncelle' : 'Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManager;