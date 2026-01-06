import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Heart, LogOut, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserAccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Kullanıcı kontrolü
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/'); // Giriş yapmamışsa anasayfaya at
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  if (!user) return null;

  // Sidebar Menü Elemanları
  const tabs = [
    { id: 'profile', label: 'Profil Bilgilerim', icon: User },
    { id: 'orders', label: 'Siparişlerim', icon: Package },
    { id: 'addresses', label: 'Adreslerim', icon: MapPin },
    { id: 'favorites', label: 'Favorilerim', icon: Heart, action: () => navigate('/favoriler') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-8 text-center md:text-left">Hesabım</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* SOL: Sidebar Menü */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Kullanıcı Kartı */}
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
              
              {/* Menü Linkleri */}
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
              
              {/* --- PROFİL SEKME İÇERİĞİ --- */}
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
                  
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm flex gap-3 items-start">
                    <div className="mt-0.5">ℹ️</div>
                    <p>Güvenliğiniz için profil bilgilerinizi güncellemek isterseniz lütfen müşteri hizmetlerimiz ile iletişime geçiniz.</p>
                  </div>
                </div>
              )}

              {/* --- SİPARİŞLER SEKME İÇERİĞİ --- */}
              {activeTab === 'orders' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Package size={24} className="text-gray-400"/> Siparişlerim
                  </h2>
                  
                  <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 rounded-xl">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                      <Package size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Henüz Siparişiniz Yok</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mb-6">Sipariş verdiğinizde tüm detayları buradan takip edebileceksiniz.</p>
                    <button 
                      onClick={() => navigate('/products')}
                      className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-gray-800 transition shadow-lg shadow-gray-200"
                    >
                      Alışverişe Başla
                    </button>
                  </div>
                </div>
              )}

              {/* --- ADRESLER SEKME İÇERİĞİ --- */}
              {activeTab === 'addresses' && (
                <div className="animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <MapPin size={24} className="text-gray-400"/> Kayıtlı Adresler
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Örnek Adres Kartı */}
                     <div className="border border-gray-200 rounded-xl p-5 relative group hover:border-black hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-bold underline">Düzenle</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase">Ev</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            <span className="font-bold text-gray-900 block mb-1">{user.name}</span>
                            Örnek Mahallesi, Papatya Caddesi<br/>
                            No: 15 Daire: 4<br/>
                            Kadıköy / İstanbul
                        </p>
                     </div>
                     
                     {/* Yeni Ekle Butonu */}
                     <button className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black hover:bg-gray-50 transition-all duration-300 min-h-[160px]">
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
    </div>
  );
};

export default UserAccountPage;