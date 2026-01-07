import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, User, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/admin/all`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        toast.error("Siparişler yüklenemedi");
      }
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
        case 'Teslim Edildi': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Teslim Edildi</span>;
        case 'Kargoda': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Truck size={12}/> Kargoda</span>;
        default: return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12}/> Hazırlanıyor</span>;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
              <th className="p-4">Durum</th>
              <th className="p-4">Tarih</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                  <td className="p-4 font-mono font-bold">#{order.id}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{order.user?.name}</span>
                        <span className="text-xs text-gray-400">{order.user?.email}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-green-600">
                    {parseFloat(order.total).toLocaleString('tr-TR')} TL
                  </td>
                  <td className="p-4">{getStatusBadge(order.status)}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="p-4 text-right text-gray-400">
                    {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </td>
                </tr>
                
                {/* DETAY ALANI (AÇILIR KAPANIR) */}
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
                                                <img src={item.product?.imageUrl} className="w-10 h-10 object-cover rounded" />
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