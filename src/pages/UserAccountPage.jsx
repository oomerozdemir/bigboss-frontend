import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Heart, LogOut, Plus, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserAccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]); // Adresleri tutacak state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  
  // Adres Form State
  const [newAddress, setNewAddress] = useState({
    title: 'Ev',
    city: '',
    address: '',
    phone: ''
  });

  const navigate = useNavigate();

  // 1. Kullanıcıyı ve Adresleri Çek
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      fetchAddresses(token);
      fetchOrders(token);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchOrders = async (token) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setOrders(data);
        }
    } catch (error) {
        console.error("Siparişler çekilemedi");
    }
  };

  // Adresleri API'den Getir
  const fetchAddresses = async (token) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/address`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setAddresses(data);
        }
    } catch (error) {
        console.error("Adresler çekilemedi");
    }
  };

  // Yeni Adres Ekle
  const handleAddAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/address`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(newAddress)
        });

        if (res.ok) {
            toast.success("Adres eklendi");
            setIsAddressModalOpen(false);
            setNewAddress({ title: 'Ev', city: '', address: '', phone: '' }); // Formu sıfırla
            fetchAddresses(token); // Listeyi güncelle
        } else {
            toast.error("Adres eklenirken hata oluştu");
        }
    } catch (error) {
        toast.error("Bir hata oluştu");
    }
  };

  // Adres Sil
  const handleDeleteAddress = async (id) => {
    if(!window.confirm("Bu adresi silmek istediğinize emin misiniz?")) return;

    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/address/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            toast.success("Adres silindi");
            fetchAddresses(token);
        }
    } catch (error) {
        toast.error("Silinemedi");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Profil Bilgilerim', icon: User },
    { id: 'orders', label: 'Siparişlerim', icon: Package },
    { id: 'addresses', label: 'Adreslerim', icon: MapPin },
    { id: 'favorites', label: 'Favorilerim', icon: Heart, action: () => navigate('/favoriler') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-8 text-center md:text-left">Hesabım</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* SOL: Sidebar Menü */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Hoşgeldin</p>
                    <p className="font-bold text-gray-900 truncate">{user.name}</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-2 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => tab.action ? tab.action() : setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-black text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                    }`}
                  >
                    <tab.icon size={18} strokeWidth={2} />
                    {tab.label}
                  </button>
                ))}
                
                <div className="pt-2 mt-2 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={18} strokeWidth={2} />
                    Çıkış Yap
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* SAĞ: İçerik Alanı */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
              
              {/* --- PROFİL --- */}
              {activeTab === 'profile' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <User size={24} className="text-gray-400"/> Profil Bilgileri
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ad Soyad</label>
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-900">
                        {user.name}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">E-posta Adresi</label>
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-900">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- SİPARİŞLER --- */}
              {activeTab === 'orders' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Package size={24} className="text-gray-400"/> Siparişlerim
                  </h2>
                  
                  {orders.length === 0 ? (
                    // BOŞ SİPARİŞ GÖRÜNÜMÜ (Aynı kalabilir)
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 rounded-xl">
                        {/* ... (eski kod) ... */}
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Henüz Siparişiniz Yok</h3>
                    </div>
                  ) : (
                    // DOLU SİPARİŞ LİSTESİ
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                {/* Sipariş Başlığı */}
                                <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase font-bold">Sipariş Tarihi</p>
                                        <p className="font-medium text-gray-900">
                                            {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase font-bold">Toplam Tutar</p>
                                        <p className="font-bold text-green-600">
                                            {parseFloat(order.total).toLocaleString('tr-TR')} TL
                                        </p>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            order.status === 'Teslim Edildi' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Sipariş Ürünleri */}
                                <div className="p-4 space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                {/* Ürün resmi */}
                                                <img 
                                                    src={item.product?.imageUrl || "https://via.placeholder.com/100"} 
                                                    alt={item.product?.name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.product?.name}</h4>
                                                <p className="text-xs text-gray-500">
                                                    {item.variant} | {item.quantity} Adet
                                                </p>
                                                <p className="text-sm font-semibold mt-1">
                                                    {parseFloat(item.price).toLocaleString('tr-TR')} TL
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* --- ADRESLER --- */}
              {activeTab === 'addresses' && (
                <div className="animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <MapPin size={24} className="text-gray-400"/> Kayıtlı Adresler
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Adres Listesi */}
                     {addresses.map((addr) => (
                        <div key={addr.id} className="border border-gray-200 rounded-xl p-5 relative group hover:border-black hover:shadow-md transition-all duration-300 bg-white">
                            <button 
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase">{addr.title}</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                <span className="font-bold text-gray-900 block mb-1">{user.name}</span>
                                {addr.address}<br/>
                                <span className="font-semibold text-black mt-1 block">{addr.city}</span>
                                <span className="text-xs text-gray-400 mt-1 block">{addr.phone}</span>
                            </p>
                        </div>
                     ))}
                     
                     {/* Yeni Ekle Butonu */}
                     <button 
                        onClick={() => setIsAddressModalOpen(true)}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black hover:bg-gray-50 transition-all duration-300 min-h-[160px]"
                     >
                        <Plus size={32} className="mb-2" />
                        <span className="font-bold text-sm">YENİ ADRES EKLE</span>
                     </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* --- ADRES EKLEME MODALI --- */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg">Yeni Adres Ekle</h3>
                    <button onClick={() => setIsAddressModalOpen(false)}><X size={20} className="text-gray-500" /></button>
                </div>
                <form onSubmit={handleAddAddress} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Adres Başlığı</label>
                        <input 
                            type="text" 
                            placeholder="Örn: Ev, İş" 
                            className="w-full border rounded-lg p-3 text-sm focus:ring-black focus:border-black"
                            value={newAddress.title}
                            onChange={(e) => setNewAddress({...newAddress, title: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Şehir</label>
                        <input 
                            type="text" 
                            placeholder="İstanbul" 
                            className="w-full border rounded-lg p-3 text-sm focus:ring-black focus:border-black"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Telefon</label>
                        <input 
                            type="text" 
                            placeholder="05XX..." 
                            className="w-full border rounded-lg p-3 text-sm focus:ring-black focus:border-black"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Açık Adres</label>
                        <textarea 
                            rows="3"
                            placeholder="Mahalle, Cadde, Sokak, No..." 
                            className="w-full border rounded-lg p-3 text-sm focus:ring-black focus:border-black"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                        KAYDET
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default UserAccountPage;