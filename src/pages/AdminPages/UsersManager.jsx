import React, { useState, useEffect } from 'react';
import { Users, Search, ShoppingBag, TrendingUp, Mail, Calendar, Heart, ShoppingCart } from 'lucide-react';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFiltered(users);
    } else {
      const q = searchTerm.toLowerCase();
      setFiltered(users.filter(u =>
        u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      ));
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users || []);
      setFiltered(data.users || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Kullanıcı listesi hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency', currency: 'TRY', maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const totalOrders = users.reduce((s, u) => s + (u.orderCount || 0), 0);
  const totalRevenue = users.reduce((s, u) => s + (u.totalSpent || 0), 0);
  const activeCustomers = users.filter(u => u.orderCount > 0).length;
  const usersWithCart = users.filter(u => u.cartItemCount > 0).length;

  const StatBadge = ({ value, color }) => {
    if (!value || value === 0) return <span className="text-gray-300 text-xs">–</span>;
    const colors = {
      green: 'bg-green-100 text-green-700',
      red: 'bg-red-100 text-red-600',
      blue: 'bg-blue-100 text-blue-600',
    };
    return (
      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${colors[color]}`}>
        {value}
      </span>
    );
  };

  return (
    <div className="space-y-6">

      {/* ÖZET KARTLAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Toplam Üye</p>
            <p className="text-2xl font-black text-gray-900">{total}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
            <ShoppingBag size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Sipariş Veren</p>
            <p className="text-2xl font-black text-gray-900">{activeCustomers}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
            <ShoppingCart size={20} className="text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Sepette Bekleyen</p>
            <p className="text-2xl font-black text-gray-900">{usersWithCart}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
            <TrendingUp size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Toplam Ciro</p>
            <p className="text-xl font-black text-gray-900">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
      </div>

      {/* TABLO */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        {/* ARAMA BARI */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="İsim veya e-posta ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black text-sm"
            />
          </div>
          <span className="text-sm text-gray-500 ml-auto">
            <b>{filtered.length}</b> müşteri
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-5 py-3 font-semibold">#</th>
                <th className="px-5 py-3 font-semibold">Müşteri</th>
                <th className="px-5 py-3 font-semibold">
                  <span className="flex items-center gap-1"><Mail size={13} /> E-posta</span>
                </th>
                <th className="px-5 py-3 font-semibold">
                  <span className="flex items-center gap-1"><Calendar size={13} /> Kayıt</span>
                </th>
                <th className="px-5 py-3 font-semibold text-center">
                  <span className="flex items-center justify-center gap-1"><ShoppingBag size={13} /> Sipariş</span>
                </th>
                <th className="px-5 py-3 font-semibold text-center">
                  <span className="flex items-center justify-center gap-1"><Heart size={13} /> Favori</span>
                </th>
                <th className="px-5 py-3 font-semibold text-center">
                  <span className="flex items-center justify-center gap-1"><ShoppingCart size={13} /> Sepet</span>
                </th>
                <th className="px-5 py-3 font-semibold text-right">Toplam Harcama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-16 text-center text-gray-400">
                    <Users size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Müşteri bulunamadı</p>
                  </td>
                </tr>
              ) : (
                filtered.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-xs text-gray-400 font-mono">{idx + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-black text-gray-600">
                          {user.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{user.name || '-'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-4 text-center">
                      <StatBadge value={user.orderCount} color="green" />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <StatBadge value={user.favoriteCount} color="red" />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <StatBadge value={user.cartItemCount} color="blue" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      {user.totalSpent > 0 ? (
                        <span className="font-bold text-gray-900 text-sm">{formatCurrency(user.totalSpent)}</span>
                      ) : (
                        <span className="text-gray-300 text-xs">–</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* TABLO ALTI */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/30 text-xs text-gray-500">
            Toplam <b>{totalOrders}</b> sipariş · <b>{formatCurrency(totalRevenue)}</b> ciro
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManager;
