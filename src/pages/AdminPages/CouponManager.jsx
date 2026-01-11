import React, { useState, useEffect } from 'react';
import { Ticket, Trash2, Plus, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'PERCENTAGE', // veya 'FIXED_AMOUNT'
    discountValue: '',
    minOrderAmount: '',
    expirationDate: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setCoupons(await res.json());
        setLoading(false);
    } catch (err) {
        console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons`, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(newCoupon)
        });

        if(res.ok) {
            toast.success("Kupon oluşturuldu");
            setNewCoupon({ code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderAmount: '', expirationDate: '' });
            fetchCoupons();
        } else {
            const d = await res.json();
            toast.error(d.error || "Hata");
        }
    } catch (error) {
        toast.error("Bir hata oluştu");
    }
  };

  const handleDelete = async (id) => {
      if(!confirm("Silmek istediğinize emin misiniz?")) return;
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_URL}/api/coupons/${id}`, {
          method: 'DELETE',
          headers: { "Authorization": `Bearer ${token}` }
      });
      fetchCoupons();
      toast.success("Silindi");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Ticket className="text-blue-500"/> Kupon Yönetimi
        </h2>

        {/* --- EKLEME FORMU --- */}
        <form onSubmit={handleCreate} className="bg-gray-50 p-4 rounded-xl mb-8 border border-gray-200 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
                <label className="text-xs font-bold uppercase text-gray-500">Kupon Kodu</label>
                <input 
                    type="text" 
                    placeholder="Örn: YAZ50"
                    className="w-full p-2 border rounded"
                    value={newCoupon.code}
                    onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                    required
                />
            </div>
            <div>
                <label className="text-xs font-bold uppercase text-gray-500">Tip</label>
                <select 
                    className="w-full p-2 border rounded"
                    value={newCoupon.discountType}
                    onChange={e => setNewCoupon({...newCoupon, discountType: e.target.value})}
                >
                    <option value="PERCENTAGE">Yüzde (%)</option>
                    <option value="FIXED_AMOUNT">Sabit Tutar (TL)</option>
                </select>
            </div>
            <div>
                <label className="text-xs font-bold uppercase text-gray-500">Değer</label>
                <input 
                    type="number" 
                    placeholder="10 veya 100"
                    className="w-full p-2 border rounded"
                    value={newCoupon.discountValue}
                    onChange={e => setNewCoupon({...newCoupon, discountValue: e.target.value})}
                    required
                />
            </div>
             <div>
                <label className="text-xs font-bold uppercase text-gray-500">Min. Sepet (Ops)</label>
                <input 
                    type="number" 
                    placeholder="0"
                    className="w-full p-2 border rounded"
                    value={newCoupon.minOrderAmount}
                    onChange={e => setNewCoupon({...newCoupon, minOrderAmount: e.target.value})}
                />
            </div>
            <button type="submit" className="bg-black text-white p-2 rounded font-bold hover:bg-gray-800 flex justify-center items-center gap-2">
                <Plus size={18}/> Oluştur
            </button>
        </form>

        {/* --- LİSTE --- */}
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="p-3">Kod</th>
                        <th className="p-3">İndirim</th>
                        <th className="p-3">Min. Sepet</th>
                        <th className="p-3">Bitiş Tarihi</th>
                        <th className="p-3 text-right">İşlem</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {coupons.map(c => (
                        <tr key={c.id}>
                            <td className="p-3 font-bold">{c.code}</td>
                            <td className="p-3">
                                {c.discountType === 'PERCENTAGE' ? `%${c.discountValue}` : `${c.discountValue} TL`}
                            </td>
                            <td className="p-3">{c.minOrderAmount > 0 ? `${c.minOrderAmount} TL` : '-'}</td>
                            <td className="p-3 text-gray-500">
                                {c.expirationDate ? new Date(c.expirationDate).toLocaleDateString('tr-TR') : 'Süresiz'}
                            </td>
                            <td className="p-3 text-right">
                                <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                    <Trash2 size={16}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {coupons.length === 0 && <p className="text-center p-4 text-gray-500">Henüz kupon yok.</p>}
        </div>
    </div>
  );
};

export default CouponManager;