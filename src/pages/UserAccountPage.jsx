import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, User, LogOut, ChevronDown, ChevronUp, Truck, FileText, Box, RefreshCcw, Plus, Trash2, X, Heart, Star, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const UserAccountPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState(null);
  
  // Veriler
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  
  // Yüklenme Durumları
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  
  // UI Kontrolleri
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Değerlendirme Modalı
  const [reviewModal, setReviewModal] = useState({ open: false, product: null });
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewedProductIds, setReviewedProductIds] = useState(new Set());
  
  // Yeni Adres Formu
  const [newAddress, setNewAddress] = useState({
    title: 'Ev',
    city: '',
    address: '',
    phone: ''
  });

  const token = localStorage.getItem('token');

  // --- DURUM ÇEVİRİLERİ ---
  const STATUS_MAP = {
    "SIPARIS_ALINDI": { label: "Sipariş Alındı", color: "bg-blue-100 text-blue-700" },
    "HAZIRLANIYOR": { label: "Hazırlanıyor", color: "bg-yellow-100 text-yellow-700" },
    "KARGOLANDI": { label: "Kargoya Verildi", color: "bg-orange-100 text-orange-700" },
    "SHIPPED": { label: "Kargoya Verildi", color: "bg-orange-100 text-orange-700" },
    "TESLIM_EDILDI": { label: "Teslim Edildi", color: "bg-green-100 text-green-700" },
    "DELIVERED": { label: "Teslim Edildi", color: "bg-green-100 text-green-700" },
    "IPTAL_EDILDI": { label: "İptal Edildi", color: "bg-red-100 text-red-700" },
    "IADE_EDILDI": { label: "İade Edildi", color: "bg-gray-100 text-gray-700" },
    "ODEME_BEKLENIYOR": { label: "Ödeme Bekleniyor", color: "bg-purple-100 text-purple-700" }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
      fetchOrders();
      fetchAddresses();
    }
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    navigate('/');
    window.location.reload();
  };

  // --- VERİ ÇEKME İŞLEMLERİ ---
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      // 🟢 DÜZELTME BURADA YAPILDI: '/api/orders/my-orders' yerine '/api/orders'
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
          setOrders(data);
      } else {
          console.error("Sipariş verisi hatalı:", data);
          setOrders([]);
      }
    } catch (error) {
      console.error("Sipariş hatası:", error);
      toast.error("Siparişler yüklenemedi");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/address`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) setAddresses(data);
    } catch (error) {
      console.error("Adres hatası:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // --- İADE İŞLEMİ ---
  const handleReturnRequest = async (orderId) => {
    if (!window.confirm("Bu sipariş için iade talebi oluşturmak istiyor musunuz?")) return;

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/returns`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ orderId })
        });

        if (res.ok) {
            toast.success("İade talebiniz alındı.");
            fetchOrders(); 
        } else {
            const data = await res.json();
            toast.error(data.error || "İşlem başarısız.");
        }
    } catch (error) {
        toast.error("Bir hata oluştu.");
    }
  };

  // --- ADRES EKLEME / SİLME ---
  const handleAddAddress = async (e) => {
    e.preventDefault();
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
            setNewAddress({ title: 'Ev', city: '', address: '', phone: '' }); 
            fetchAddresses(); 
        } else {
            toast.error("Hata oluştu");
        }
    } catch (error) {
        toast.error("Bir hata oluştu");
    }
  };

  const handleDeleteAddress = async (id) => {
    if(!window.confirm("Adresi silmek istediğinize emin misiniz?")) return;
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/address/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            toast.success("Adres silindi");
            fetchAddresses();
        }
    } catch (error) {
        toast.error("Silinemedi");
    }
  };

  // --- DEĞERLENDİRME ---
  const openReviewModal = (product) => {
    setReviewModal({ open: true, product });
    setReviewRating(0);
    setReviewComment('');
  };

  const closeReviewModal = () => {
    setReviewModal({ open: false, product: null });
    setReviewRating(0);
    setReviewComment('');
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) return toast.error('Lütfen yıldız puanı seçin.');
    if (reviewComment.trim().length < 10) return toast.error('Yorum en az 10 karakter olmalıdır.');
    setReviewSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewModal.product.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });
      const data = await res.json();
      if (res.status === 409) {
        toast.error('Bu ürünü zaten değerlendirdiniz.');
        setReviewedProductIds(prev => new Set([...prev, reviewModal.product.id]));
        closeReviewModal();
        return;
      }
      if (!res.ok) return toast.error(data.error || 'Bir hata oluştu.');
      toast.success('Değerlendirmeniz eklendi, teşekkürler!');
      setReviewedProductIds(prev => new Set([...prev, reviewModal.product.id]));
      closeReviewModal();
    } catch {
      toast.error('Bağlantı hatası, lütfen tekrar deneyin.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // --- YARDIMCI FONKSİYONLAR ---
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusInfo = (status) => {
    return STATUS_MAP[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
  };

  const tabs = [
    { id: 'profile', label: 'Profilim', icon: User },
    { id: 'orders', label: 'Siparişlerim', icon: Package },
    { id: 'addresses', label: 'Adreslerim', icon: MapPin },
    { id: 'favorites', label: 'Favorilerim', icon: Heart, action: () => navigate('/favoriler') },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Hesabım" noindex={true} />
      <div className="max-w-6xl mx-auto">
        
        {/* Üst Başlık ve Çıkış */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Hesabım</h1>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium">
                <LogOut size={18} /> Çıkış Yap
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SOL MENÜ */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                <div className="p-6 border-b border-gray-50 text-center">
                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <nav className="p-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => tab.action ? tab.action() : setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                                activeTab === tab.id 
                                ? 'bg-black text-white shadow-md' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                            }`}
                        >
                            <tab.icon size={18}/> {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
          </div>

          {/* SAĞ İÇERİK */}
          <div className="flex-1">
            
            {/* --- PROFİL SEKMESİ --- */}
            {activeTab === 'profile' && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-in fade-in">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <User size={24} className="text-blue-600"/> Üyelik Bilgileri
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <label className="text-xs font-bold text-gray-400 uppercase">Ad Soyad</label>
                            <p className="font-semibold text-gray-900 text-lg">{user.name}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <label className="text-xs font-bold text-gray-400 uppercase">E-posta</label>
                            <p className="font-semibold text-gray-900 text-lg">{user.email}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SİPARİŞLER SEKMESİ --- */}
            {activeTab === 'orders' && (
                <div className="space-y-6 animate-in fade-in">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                        <Package size={24} className="text-blue-600"/> Sipariş Geçmişi
                    </h2>

                    {loadingOrders ? (
                        <p className="text-center py-10 text-gray-500">Siparişler yükleniyor...</p>
                    ) : orders.length === 0 ? (
                        <div className="bg-white p-10 text-center rounded-xl border border-dashed border-gray-300">
                            <Package size={48} className="mx-auto text-gray-300 mb-3"/>
                            <p className="text-gray-500 font-medium">Henüz bir siparişiniz bulunmuyor.</p>
                            <button onClick={() => navigate('/products')} className="mt-4 text-blue-600 hover:underline">Alışverişe Başla</button>
                        </div>
                    ) : (
                        orders.map(order => {
                            const statusInfo = getStatusInfo(order.status);
                            const returnStatus = order.returnRequest?.status;

                            return (
                                <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    
                                    {/* Sipariş Özeti (Header) */}
                                    <div 
                                        onClick={() => toggleOrderDetails(order.id)}
                                        className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex gap-6">
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Sipariş No</p>
                                                <p className="font-bold text-gray-900">#{order.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Tarih</p>
                                                <p className="font-medium text-gray-700">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Tutar</p>
                                                <p className="font-bold text-green-600">{parseFloat(order.total).toLocaleString('tr-TR')} TL</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                            {expandedOrderId === order.id ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
                                        </div>
                                    </div>

                                    {/* Genişletilmiş Detaylar (Accordion Body) */}
                                    {expandedOrderId === order.id && (
                                        <div className="p-6 border-t border-gray-100 bg-white">
                                            
                                            {/* 1. Kargo Takip (Varsa) */}
                                            {(order.status === 'KARGOLANDI' || order.status === 'SHIPPED' || order.trackingNumber) && (
                                                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-4">
                                                    <div className="p-3 bg-white rounded-full text-blue-600 shadow-sm"><Truck size={24}/></div>
                                                    <div>
                                                        <p className="text-sm font-bold text-blue-900">Kargo Bilgileri</p>
                                                        <p className="text-sm text-blue-700">Firma: <strong>{order.cargoCompany || 'Belirtilmedi'}</strong></p>
                                                        <p className="text-sm text-blue-700">Takip No: <strong>{order.trackingNumber || 'Henüz girilmedi'}</strong></p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                                {/* 2. Adresler */}
                                                <div>
                                                    <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-3 text-sm uppercase">
                                                        <MapPin size={16}/> Teslimat Adresi
                                                    </h4>
                                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 leading-relaxed whitespace-pre-line">
                                                        {order.addressSnapshot}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-3 text-sm uppercase">
                                                        <FileText size={16}/> Fatura Adresi
                                                    </h4>
                                                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                                                        {order.invoiceType === 'CORPORATE' ? (
                                                            <>
                                                                <p><strong>Firma:</strong> {order.companyName}</p>
                                                                <p><strong>V.D:</strong> {order.taxOffice} - <strong>V.No:</strong> {order.taxNumber}</p>
                                                            </>
                                                        ) : (
                                                            <p><strong>TCKN:</strong> {order.tcNo || 'Belirtilmedi'}</p>
                                                        )}
                                                        <p className="mt-2 pt-2 border-t border-gray-200 whitespace-pre-line">
                                                            {order.invoiceAddress || order.addressSnapshot}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 3. Ürün Listesi */}
                                            <div>
                                                <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-3 text-sm uppercase">
                                                    <Box size={16}/> Sipariş İçeriği
                                                </h4>
                                                <div className="border rounded-lg overflow-hidden">
                                                    {order.items?.map((item) => {
                                                      const isDelivered = order.status === 'TESLIM_EDILDI' || order.status === 'DELIVERED';
                                                      const alreadyReviewed = reviewedProductIds.has(item.productId || item.product?.id);
                                                      return (
                                                        <div key={item.id} className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-gray-50">
                                                            <img
                                                                src={item.product?.imageUrl || "https://via.placeholder.com/80"}
                                                                alt={item.product?.name}
                                                                className="w-16 h-16 object-cover rounded border"
                                                            />
                                                            <div className="flex-1">
                                                                <p className="font-bold text-sm text-gray-900">{item.product?.name}</p>
                                                                <p className="text-xs text-gray-500">{item.variant}</p>
                                                                {isDelivered && (
                                                                  alreadyReviewed ? (
                                                                    <span className="text-xs text-green-600 font-medium mt-1 inline-block">✓ Değerlendirildi</span>
                                                                  ) : (
                                                                    <button
                                                                      onClick={(e) => { e.stopPropagation(); openReviewModal(item.product); }}
                                                                      className="mt-1.5 flex items-center gap-1 text-xs font-bold text-white bg-black hover:bg-gray-800 px-2.5 py-1 rounded transition-colors"
                                                                    >
                                                                      <Star size={11} fill="currentColor" /> Değerlendir
                                                                    </button>
                                                                  )
                                                                )}
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-medium">{item.quantity} Adet</p>
                                                                <p className="text-sm font-bold text-gray-900">{parseFloat(item.price).toLocaleString('tr-TR')} TL</p>
                                                            </div>
                                                        </div>
                                                      );
                                                    })}
                                                </div>
                                            </div>

                                            {/* 4. Alt Toplam ve İade Butonu */}
                                            <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100 gap-4">
                                                <div className="w-full md:w-auto">
                                                    {/* İade Durum Kontrolü */}
                                                    {returnStatus ? (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-xs font-bold border">
                                                            <RefreshCcw size={14}/>
                                                            İade Durumu: 
                                                            <span className={
                                                                returnStatus === 'ONAYLANDI' ? 'text-green-600' : 
                                                                returnStatus === 'REDDEDILDI' ? 'text-red-600' : 'text-orange-600'
                                                            }>
                                                                {returnStatus === 'BEKLIYOR' ? 'İnceleniyor' : returnStatus}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        (order.status === 'TESLIM_EDILDI' || order.status === 'DELIVERED') && (
                                                            <button 
                                                                onClick={() => handleReturnRequest(order.id)}
                                                                className="flex items-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                                                            >
                                                                <RefreshCcw size={16}/> İade Talep Et
                                                            </button>
                                                        )
                                                    )}
                                                </div>

                                                <div className="text-right">
                                                    {parseFloat(order.discountAmount) > 0 && (
                                                        <p className="text-sm text-green-600 font-medium mb-1">
                                                            İndirim: -{parseFloat(order.discountAmount).toLocaleString('tr-TR')} TL
                                                        </p>
                                                    )}
                                                    <p className="text-xl font-black text-gray-900">
                                                        Toplam: {parseFloat(order.total).toLocaleString('tr-TR')} TL
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* --- ADRESLER SEKMESİ --- */}
            {activeTab === 'addresses' && (
                <div className="animate-in fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <MapPin size={24} className="text-blue-600"/> Kayıtlı Adreslerim
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Adres Listesi */}
                        {addresses.map(addr => (
                            <div key={addr.id} className="border border-gray-200 rounded-xl p-5 relative bg-white group hover:border-black transition-colors">
                                <button onClick={() => handleDeleteAddress(addr.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 p-1">
                                    <Trash2 size={18}/>
                                </button>
                                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase mb-2 inline-block">
                                    {addr.title}
                                </span>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {addr.address} <br/>
                                    <span className="font-semibold text-black">{addr.city}</span> <br/>
                                    <span className="text-xs text-gray-500">{addr.phone}</span>
                                </p>
                            </div>
                        ))}

                        {/* Adres Ekle Butonu */}
                        <button 
                            onClick={() => setIsAddressModalOpen(true)}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all min-h-[180px]"
                        >
                            <Plus size={32} className="mb-2"/>
                            <span className="font-bold text-sm">YENİ ADRES EKLE</span>
                        </button>
                    </div>
                </div>
            )}

          </div>
        </div>
      </div>

      {/* DEĞERLENDİRME MODALI */}
      {reviewModal.open && reviewModal.product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900">Ürünü Değerlendir</h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[280px]">{reviewModal.product.name}</p>
              </div>
              <button onClick={closeReviewModal} className="text-gray-500 hover:text-black"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Yıldız Seçici */}
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Puanınız</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={() => setReviewRating(star)} className="focus:outline-none">
                      <Star
                        size={32}
                        fill={star <= reviewRating ? "currentColor" : "none"}
                        className={star <= reviewRating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300 transition-colors"}
                      />
                    </button>
                  ))}
                </div>
                {reviewRating > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {reviewRating === 1 ? 'Çok Kötü' : reviewRating === 2 ? 'Kötü' : reviewRating === 3 ? 'Orta' : reviewRating === 4 ? 'İyi' : 'Mükemmel'}
                  </p>
                )}
              </div>

              {/* Yorum Alanı */}
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Yorumunuz</p>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="Bu ürün hakkındaki düşüncelerinizi paylaşın..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                />
                <p className="text-xs text-gray-400 text-right mt-1">{reviewComment.length}/500</p>
              </div>

              <button
                onClick={handleSubmitReview}
                disabled={reviewSubmitting || reviewRating === 0}
                className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {reviewSubmitting ? 'Gönderiliyor...' : 'Değerlendirmeyi Gönder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADRES EKLEME MODALI */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Yeni Adres Ekle</h3>
                    <button onClick={() => setIsAddressModalOpen(false)} className="text-gray-500 hover:text-black"><X size={20}/></button>
                </div>
                <form onSubmit={handleAddAddress} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Başlık (Ev, İş)</label>
                        <input type="text" className="w-full border rounded-lg p-2.5 text-sm focus:border-black outline-none" 
                            value={newAddress.title} onChange={e => setNewAddress({...newAddress, title: e.target.value})} required/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Şehir</label>
                        <input type="text" className="w-full border rounded-lg p-2.5 text-sm focus:border-black outline-none" 
                            value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Telefon</label>
                        <input type="text" className="w-full border rounded-lg p-2.5 text-sm focus:border-black outline-none" 
                            value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} required/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Açık Adres</label>
                        <textarea rows="3" className="w-full border rounded-lg p-2.5 text-sm focus:border-black outline-none" 
                            value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800">KAYDET</button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default UserAccountPage;