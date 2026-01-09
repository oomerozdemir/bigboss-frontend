import React, { useState, useEffect } from 'react';
import { RefreshCcw, Check, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const ReturnManager = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/returns`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setReturns(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (id, status) => {
    if(!confirm(`Bu iade talebini ${status === 'ONAYLANDI' ? 'onaylamak' : 'reddetmek'} istediğinize emin misiniz?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/returns/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        toast.success("İşlem başarılı");
        fetchReturns(); // Listeyi yenile
      } else {
        toast.error("Hata oluştu");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold flex items-center gap-2">
            <RefreshCcw className="text-orange-500"/> İade Talepleri
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="p-4">Talep ID</th>
              <th className="p-4">Sipariş ID</th>
              <th className="p-4">Müşteri</th>
              <th className="p-4">Durum</th>
              <th className="p-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {returns.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono">#{req.id}</td>
                <td className="p-4 font-mono">#{req.orderId}</td>
                <td className="p-4 text-sm">
                    <div className="font-bold">{req.order.user.name}</div>
                    <div className="text-gray-400 text-xs">{req.order.user.email}</div>
                </td>
                <td className="p-4">
                    {req.status === 'BEKLIYOR' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold flex w-fit gap-1 items-center"><Clock size={12}/> Bekliyor</span>}
                    {req.status === 'ONAYLANDI' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex w-fit gap-1 items-center"><Check size={12}/> Onaylandı</span>}
                    {req.status === 'REDDEDILDI' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex w-fit gap-1 items-center"><X size={12}/> Reddedildi</span>}
                </td>
                <td className="p-4 text-right">
                    {req.status === 'BEKLIYOR' && (
                        <div className="flex justify-end gap-2">
                            <button onClick={() => handleProcess(req.id, 'ONAYLANDI')} className="bg-green-500 text-white p-2 rounded hover:bg-green-600"><Check size={16}/></button>
                            <button onClick={() => handleProcess(req.id, 'REDDEDILDI')} className="bg-red-500 text-white p-2 rounded hover:bg-red-600"><X size={16}/></button>
                        </div>
                    )}
                </td>
              </tr>
            ))}
            {returns.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400">İade talebi bulunmuyor.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnManager;