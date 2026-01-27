// src/pages/AdminPages/BulkProductEditor.jsx

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; 
import { Save, Search, ArrowLeft, Star, StarOff, Eye, EyeOff, CheckSquare, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BulkProductEditor = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modifiedRows, setModifiedRows] = useState({}); 
  
  // Pagination State'leri
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  // Arama değişince 1. sayfaya dön
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        fetchProducts(1); 
        setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Sayfa değişince veri çek
  useEffect(() => {
    if (currentPage > 1) { 
        fetchProducts(currentPage);
    }
  }, [currentPage]);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/products/bulk-list?page=${page}&limit=500&search=${search}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setProducts(data.products || []);
        if (data.meta) {
            setTotalPages(data.meta.totalPages);
            setTotalCount(data.meta.totalCount);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Ürünler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Tekil Değişiklik
  const handleCellChange = (id, field, value) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));

    setModifiedRows(prev => ({
      ...prev,
      [id]: {
        ...prev[id] || { id }, 
        [field]: field === 'price' || field === 'stock' ? Number(value) : value
      }
    }));
  };

  // ✅ YENİ: Toplu Aç/Kapat (Select All Logic)
  const handleBulkToggle = (field) => {
    if (products.length === 0) return;

    // Hepsi zaten seçili mi kontrol et
    const allAreTrue = products.every(p => p[field] === true);
    const targetValue = !allAreTrue; // Hepsi seçiliyse kapat, değilse aç

    // 1. Görüntüyü Güncelle
    setProducts(prev => prev.map(p => ({
      ...p,
      [field]: targetValue
    })));

    // 2. Kaydedilecekler Listesini Güncelle
    setModifiedRows(prev => {
      const nextState = { ...prev };
      products.forEach(p => {
        nextState[p.id] = {
          ...(nextState[p.id] || { id: p.id }),
          [field]: targetValue
        };
      });
      return nextState;
    });

    const label = field === 'isFeatured' ? 'Vitrin' : 'Durum';
    toast.success(targetValue 
      ? `Bu sayfadaki tüm ürünler ${label} için AKTİF edildi` 
      : `Bu sayfadaki tüm ürünler ${label} için PASİF edildi`, { icon: '🔄' });
  };

  const handleSave = async () => {
    const updates = Object.values(modifiedRows);

    if (updates.length === 0) {
      toast("Değişiklik yapılmadı.", { icon: 'ℹ️' });
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/products/bulk-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ updates })
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`${updates.length} ürün güncellendi!`);
        setModifiedRows({}); 
      } else {
        toast.error(data.message || "Güncelleme başarısız");
      }
    } catch (error) {
      console.error(error);
      toast.error("Kaydetme hatası");
    }
  };

  // Header Checkbox Durumları
  const isAllFeatured = products.length > 0 && products.every(p => p.isFeatured);
  const isAllActive = products.length > 0 && products.every(p => p.isActive);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 shadow-sm border-b border-gray-100 z-20">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Toplu Ürün Düzenle</h1>
              <p className="text-xs text-gray-400 font-medium">
                  {totalCount} ürün • Sayfa {currentPage}/{totalPages}
              </p>
            </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto items-center">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Ara (İsim veya ID)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={Object.keys(modifiedRows).length === 0}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white transition-all shadow-md
              ${Object.keys(modifiedRows).length > 0 
                ? 'bg-green-600 hover:bg-green-700 hover:scale-105' 
                : 'bg-gray-300 cursor-not-allowed'}`}
          >
            <Save size={20} />
            KAYDET ({Object.keys(modifiedRows).length})
          </button>
        </div>
      </div>

      {/* TABLE CONTENT */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-[800px]">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="px-4 py-3 w-16 bg-gray-50">ID</th>
                        <th className="px-4 py-3 w-16 bg-gray-50">Görsel</th>
                        <th className="px-4 py-3 min-w-[200px] bg-gray-50">Ürün Adı</th>
                        <th className="px-4 py-3 w-32 bg-gray-50">Fiyat (TL)</th>
                        <th className="px-4 py-3 w-24 bg-gray-50">Stok</th>
                        
                        {/* ✅ VİTRİN HEADER (Select All) */}
                        <th className="px-4 py-3 w-32 text-center bg-gray-50">
                          <button 
                            onClick={() => handleBulkToggle('isFeatured')}
                            className="flex items-center justify-center gap-1 w-full hover:bg-gray-200 py-1 rounded transition group"
                            title="Tümünü Vitrine Ekle/Çıkar"
                          >
                            <span>Vitrin</span>
                            {isAllFeatured ? <CheckSquare size={16} className="text-blue-600"/> : <Square size={16} className="text-gray-400 group-hover:text-blue-600"/>}
                          </button>
                        </th>

                        {/* ✅ DURUM HEADER (Select All) */}
                        <th className="px-4 py-3 w-32 bg-gray-50">
                          <button 
                            onClick={() => handleBulkToggle('isActive')}
                            className="flex items-center gap-1 w-full hover:bg-gray-200 py-1 rounded transition group"
                            title="Tümünü Yayınla/Gizle"
                          >
                            <span>Durum</span>
                            {isAllActive ? <CheckSquare size={16} className="text-blue-600"/> : <Square size={16} className="text-gray-400 group-hover:text-blue-600"/>}
                          </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {products.map((product) => {
                        const isModified = modifiedRows[product.id];
                        return (
                        <tr key={product.id} className={`hover:bg-blue-50/30 transition-colors ${isModified ? 'bg-yellow-50/50' : ''}`}>
                            <td className="px-4 py-3 text-gray-400 font-mono">#{product.id}</td>
                            <td className="px-4 py-3">
                            <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden bg-white">
                                <img 
                                src={product.imageUrl || 'https://via.placeholder.com/40'} 
                                alt="" 
                                className="w-full h-full object-cover"
                                />
                            </div>
                            </td>
                            <td className="px-4 py-3">
                            <input 
                                type="text" 
                                value={product.name}
                                onChange={(e) => handleCellChange(product.id, 'name', e.target.value)}
                                className="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none py-1 text-gray-900 font-medium transition-colors"
                            />
                            </td>
                            <td className="px-4 py-3">
                            <input 
                                type="number" 
                                value={product.price}
                                onChange={(e) => handleCellChange(product.id, 'price', e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                            </td>
                            <td className="px-4 py-3">
                            <input 
                                type="number" 
                                value={product.stock}
                                onChange={(e) => handleCellChange(product.id, 'stock', e.target.value)}
                                className={`w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold ${
                                product.stock < 5 ? 'text-red-600 bg-red-50' : 'text-gray-700'
                                }`}
                            />
                            </td>

                            <td className="px-4 py-3 text-center">
                            <button
                                onClick={() => handleCellChange(product.id, 'isFeatured', !product.isFeatured)}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                product.isFeatured 
                                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                            >
                                {product.isFeatured ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
                            </button>
                            </td>

                            <td className="px-4 py-3">
                            <div className="relative">
                                <select 
                                value={product.isActive ? 'true' : 'false'} 
                                onChange={(e) => handleCellChange(product.id, 'isActive', e.target.value === 'true')}
                                className={`w-full p-2 pl-9 border rounded-lg appearance-none cursor-pointer outline-none font-medium transition-colors ${
                                    product.isActive 
                                    ? 'bg-green-50 text-green-700 border-green-200 focus:ring-green-500' 
                                    : 'bg-red-50 text-red-700 border-red-200 focus:ring-red-500'
                                }`}
                                >
                                <option value="true">Yayında</option>
                                <option value="false">Gizli</option>
                                </select>
                                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                {product.isActive 
                                    ? <Eye size={16} className="text-green-600" /> 
                                    : <EyeOff size={16} className="text-red-600" />
                                }
                                </div>
                            </div>
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="p-12 text-center text-gray-400">Aradığınız kriterlere uygun ürün bulunamadı.</div>
                )}
            </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="bg-white border-t border-gray-200 p-3 flex justify-between items-center z-20">
        <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
            <ChevronLeft size={18} /> Önceki
        </button>
        
        <div className="font-bold text-gray-700">
            Sayfa {currentPage} / {totalPages}
        </div>

        <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
            Sonraki <ChevronRight size={18} />
        </button>
      </div>

    </div>
  );
};

export default BulkProductEditor;