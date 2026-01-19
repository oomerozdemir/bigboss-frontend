// pages/AdminPages/OrderManager.jsx - KARGO TAKİP NUMARASI İLE GÜNCELLENMIŞ

import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp, Loader, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  
  // ✅ YENİ: Kargo takip numarası state'leri
  const [trackingInputs, setTrackingInputs] = useState({});
  const [cargoCompanies, setCargoCompanies] = useState({});

  // --- DURUM HARİTASI ---
  const STATUS_MAP = {
    "SIPARIS_ALINDI": "Sipariş Alındı",
    "HAZIRLANIYOR": "Hazırlanıyor",
    "KARGOLANDI": "Kargolandı",
    "TESLIM_EDILDI": "Teslim Edildi",
    "IPTAL_EDILDI": "İptal Edildi",
    "IADE_EDILDI": "İade Edildi (Onaylandı) ✅"
  };

  // ✅ Kargo şirketleri listesi
  const CARGO_COMPANIES = [
    'Aras Kargo',
    'Yurtiçi Kargo',
    'MNG Kargo',
    'PTT Kargo',
    'Sürat Kargo',
    'UPS Kargo'
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/admin/all`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        
        // ✅ Mevcut tracking number'ları state'e doldur
        const trackingData = {};
        const cargoData = {};
        data.forEach(order => {
          trackingData[order.id] = order.trackingNumber || '';
          cargoData[order.id] = order.cargoCompany || 'Aras Kargo';
        });
        setTrackingInputs(trackingData);
        setCargoCompanies(cargoData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  // ✅ YENİ: Kargoya ver (tracking number ile)
  const handleShipOrder = async (orderId) => {
    const trackingNumber = trackingInputs[orderId];
    const cargoCompany = cargoCompanies[orderId];

    if (!trackingNumber || trackingNumber.trim() === '') {
      toast.error('Lütfen kargo takip numarası girin!');
      return;
    }

    setUpdatingOrderId(orderId);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/admin/status/${orderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: 'KARGOLANDI',
          trackingNumber: trackingNumber.trim(),
          cargoCompany: cargoCompany
        })
      });

      if (res.ok) {
        toast.success('Sipariş kargoya verildi! E-posta gönderildi.');
        fetchOrders();
      } else {
        toast.error('Güncelleme başarısız');
      }
    } catch (error) {
      toast.error('Hata oluştu');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // Eğer KARGOLANDI seçilirse, tracking number kontrolü yap
    if (newStatus === 'KARGOLANDI') {
      const trackingNumber = trackingInputs[orderId];
      if (!trackingNumber || trackingNumber.trim() === '') {
        toast.error('Kargoya vermek için önce takip numarası girmelisiniz!');
        return;
      }
    }

    setUpdatingOrderId(orderId);
    const token = localStorage.getItem("token");

    try {
      const payload = { status: newStatus };
      
      // Eğer KARGOLANDI ise tracking bilgilerini de gönder
      if (newStatus === 'KARGOLANDI') {
        payload.trackingNumber = trackingInputs[orderId];
        payload.cargoCompany = cargoCompanies[orderId];
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/admin/status/${orderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Sipariş durumu güncellendi');
        fetchOrders();
      } else {
        toast.error('Güncelleme başarısız');
      }
    } catch (error) {
      toast.error('Hata oluştu');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // --- RENK FONKSİYONU ---
  const getStatusColor = (status) => {
    switch (status) {
      case 'TESLIM_EDILDI': return "bg-green-100 text-green-700 border-green-200";
      case 'KARGOLANDI': return "bg-blue-100 text-blue-700 border-blue-200";
      case 'HAZIRLANIYOR': return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case 'IPTAL_EDILDI': return "bg-red-100 text-red-700 border-red-200";
      case 'IADE_EDILDI': return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Package className="text-black"/> Gelen Siparişler ({orders.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-2 sm:p-4">Sipariş ID</th>
              <th className="p-2 sm:p-4">Müşteri</th>
              <th className="p-2 sm:p-4">Tutar</th>
              <th className="p-2 sm:p-4">Durum</th>
              <th className="p-2 sm:p-4">Tarih</th>
              <th className="p-2 sm:p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-gray-50 transition cursor-pointer">
                  <td className="p-2 sm:p-4 font-mono font-bold text-xs sm:text-sm" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                    #{order.id}
                  </td>
                  <td className="p-2 sm:p-4" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm">{order.user?.name}</span>
                      <span className="text-xs text-gray-400 hidden sm:block">{order.user?.email}</span>
                    </div>
                  </td>
                  <td className="p-2 sm:p-4 font-bold text-green-600 text-xs sm:text-sm">
                    {parseFloat(order.total).toLocaleString('tr-TR')} TL
                  </td>
                  
                  <td className="p-2 sm:p-4">
                    <div className="relative">
                      {updatingOrderId === order.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                          <Loader size={16} className="animate-spin text-black" />
                        </div>
                      )}
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer appearance-none pr-6 sm:pr-8 transition-colors w-full ${getStatusColor(order.status)}`}
                      >
                        {Object.keys(STATUS_MAP).map(key => (
                          <option key={key} value={key}>
                            {STATUS_MAP[key]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                  </td>

                  <td className="p-2 sm:p-4 text-xs sm:text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="p-2 sm:p-4 text-right text-gray-400" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                    {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </td>
                </tr>
                
                {/* --- DETAY ALANI --- */}
                {expandedOrder === order.id && (
                  <tr className="bg-gray-50/50">
                    <td colSpan="6" className="p-4 sm:p-6 border-t border-gray-100 shadow-inner">
                      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                        
                        {/* Sol Kolon */}
                        <div className="flex-1 space-y-4">
                          {/* ✅ YENİ: Kargo Takip Numarası Girişi */}
                          {(order.status === 'HAZIRLANIYOR' || order.status === 'SIPARIS_ALINDI') && (
                            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                              <h4 className="font-bold text-sm uppercase text-yellow-800 mb-3 flex items-center gap-2">
                                <Truck size={18} />
                                Kargoya Ver
                              </h4>
                              
                              {/* Kargo Şirketi Seçimi */}
                              <div className="mb-3">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                  Kargo Şirketi
                                </label>
                                <select
                                  value={cargoCompanies[order.id] || 'Aras Kargo'}
                                  onChange={(e) => setCargoCompanies({...cargoCompanies, [order.id]: e.target.value})}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                                >
                                  {CARGO_COMPANIES.map(company => (
                                    <option key={company} value={company}>{company}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Takip Numarası Girişi */}
                              <div className="mb-3">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                  Kargo Takip Numarası
                                </label>
                                <input
                                  type="text"
                                  placeholder="Örn: 1234567890"
                                  value={trackingInputs[order.id] || ''}
                                  onChange={(e) => setTrackingInputs({...trackingInputs, [order.id]: e.target.value})}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                                />
                              </div>

                              <button
                                onClick={() => handleShipOrder(order.id)}
                                disabled={updatingOrderId === order.id}
                                className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {updatingOrderId === order.id ? (
                                  <>
                                    <Loader size={16} className="animate-spin" />
                                    İşleniyor...
                                  </>
                                ) : (
                                  <>
                                    <Send size={16} />
                                    Kargoya Ver
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                          {/* ✅ Kargo Bilgileri Gösterimi (Kargoya verilmişse) */}
                          {order.trackingNumber && (
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                              <h4 className="font-bold text-sm uppercase text-blue-800 mb-3 flex items-center gap-2">
                                <Truck size={18} />
                                Kargo Bilgileri
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Kargo Şirketi:</span>
                                  <span className="font-bold text-gray-900">{order.cargoCompany || 'Belirtilmemiş'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Takip No:</span>
                                  <span className="font-mono font-bold text-blue-600">{order.trackingNumber}</span>
                                </div>
                                <a
                                  href="https://kargotakip.araskargo.com.tr/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-2 text-xs font-semibold"
                                >
                                  Kargo Takip Et →
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Adres Bilgisi */}
                          <div>
                            <h4 className="font-bold text-xs uppercase text-gray-400 mb-2">Teslimat Adresi</h4>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200 whitespace-pre-line">
                              {order.addressSnapshot}
                            </p>
                          </div>

                          {/* Ödeme Detayları */}
                          <div>
                            <h4 className="font-bold text-xs uppercase text-gray-400 mb-2">Ödeme Detayları</h4>
                            <div className="bg-white p-3 rounded border border-gray-200 text-sm">
                              <div className="flex justify-between mb-1 text-gray-500">
                                <span>Ara Toplam:</span>
                                <span>{(parseFloat(order.total) + parseFloat(order.discountAmount || 0)).toLocaleString('tr-TR')} TL</span>
                              </div>
                              
                              {parseFloat(order.discountAmount) > 0 && (
                                <div className="flex justify-between text-red-600 font-bold mb-1">
                                  <span>Kupon ({order.couponCode}):</span>
                                  <span>-{parseFloat(order.discountAmount).toLocaleString('tr-TR')} TL</span>
                                </div>
                              )}
                              
                              <div className="flex justify-between font-black border-t pt-2 mt-1 text-black">
                                <span>TOPLAM:</span>
                                <span>{parseFloat(order.total).toLocaleString('tr-TR')} TL</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sağ Kolon - Sipariş İçeriği */}
                        <div className="flex-[2]">
                          <h4 className="font-bold text-xs uppercase text-gray-400 mb-3">Sipariş İçeriği</h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 bg-white p-2 sm:p-3 rounded border border-gray-200">
                                <img 
                                  src={item.product?.imageUrl} 
                                  className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded" 
                                  alt={item.product?.name} 
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold truncate">{item.product?.name}</p>
                                  <p className="text-xs text-gray-500">{item.variant} | {item.quantity} Adet</p>
                                </div>
                                <span className="font-bold text-sm whitespace-nowrap">{item.price} TL</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Henüz sipariş bulunmuyor
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManager;