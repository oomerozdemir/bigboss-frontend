import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // --- DURUM HARİTASI (IADE_EDILDI EKLENDİ) ---
  const STATUS_MAP = {
    "SIPARIS_ALINDI": "Sipariş Alındı",
    "HAZIRLANIYOR": "Hazırlanıyor",
    "KARGOLANDI": "Kargolandı",
    "TESLIM_EDILDI": "Teslim Edildi",
    "IPTAL_EDILDI": "İptal Edildi",
    "IADE_EDILDI": "İade Edildi (Onaylandı) ✅" // <--- YENİ EKLENEN
  };

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
      }
    } catch (error) {
      console.error(error);
      toast.error("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // İade edilmiş bir siparişin durumunu değiştirmeyi engellemek isterseniz buraya kontrol koyabilirsiniz
    // if(newStatus !== 'IADE_EDILDI') ...

    setUpdatingOrderId(orderId);
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/admin/status/${orderId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
            toast.success("Sipariş durumu güncellendi");
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } else {
            toast.error("Güncelleme başarısız");
        }
    } catch (error) {
        toast.error("Hata oluştu");
    } finally {
        setUpdatingOrderId(null);
    }
  };

  // --- RENK FONKSİYONU (IADE_EDILDI EKLENDİ) ---
  const getStatusColor = (status) => {
    switch (status) {
        case 'TESLIM_EDILDI': return "bg-green-100 text-green-700 border-green-200";
        case 'KARGOLANDI': return "bg-blue-100 text-blue-700 border-blue-200";
        case 'HAZIRLANIYOR': return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case 'IPTAL_EDILDI': return "bg-red-100 text-red-700 border-red-200";
        case 'IADE_EDILDI': return "bg-purple-100 text-purple-700 border-purple-200"; // <--- MOR RENK
        default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-black"/> Gelen Siparişler ({orders.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4">Sipariş ID</th>
              <th className="p-4">Müşteri</th>
              <th className="p-4">Tutar</th>
              <th className="p-4">Durum (Düzenle)</th>
              <th className="p-4">Tarih</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-gray-50 transition cursor-pointer">
                  <td className="p-4 font-mono font-bold" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>#{order.id}</td>
                  <td className="p-4" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{order.user?.name}</span>
                        <span className="text-xs text-gray-400">{order.user?.email}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-green-600">
                    {parseFloat(order.total).toLocaleString('tr-TR')} TL
                  </td>
                  
                  {/* --- DURUM SELECT BOX --- */}
                  <td className="p-4">
                    <div className="relative">
                        {updatingOrderId === order.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                                <Loader size={16} className="animate-spin text-black" />
                            </div>
                        )}
                        <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            // Eğer İade Edildiyse disabled yapabiliriz (isteğe bağlı)
                            // disabled={order.status === 'IADE_EDILDI'}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer appearance-none pr-8 transition-colors ${getStatusColor(order.status)}`}
                        >
                            {Object.keys(STATUS_MAP).map(key => (
                                <option key={key} value={key}>
                                    {STATUS_MAP[key]}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                  </td>

                  <td className="p-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="p-4 text-right text-gray-400" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                    {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </td>
                </tr>
                
                {expandedOrder === order.id && (
                    <tr className="bg-gray-50/50">
                        <td colSpan="6" className="p-6 border-t border-gray-100 shadow-inner">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1">
                                    <h4 className="font-bold text-xs uppercase text-gray-400 mb-3">Teslimat Adresi</h4>
                                    <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                                        {order.addressSnapshot}
                                    </p>
                                </div>
                                <div className="flex-[2]">
                                    <h4 className="font-bold text-xs uppercase text-gray-400 mb-3">Sipariş İçeriği</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 bg-white p-2 rounded border border-gray-200">
                                                <img src={item.product?.imageUrl} className="w-10 h-10 object-cover rounded" alt="" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold">{item.product?.name}</p>
                                                    <p className="text-xs text-gray-500">{item.variant} | {item.quantity} Adet</p>
                                                </div>
                                                <span className="font-bold text-sm">{item.price} TL</span>
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
      </div>
    </div>
  );
};

export default OrderManager;