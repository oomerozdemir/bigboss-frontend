// src/pages/AdminPages/BulkProductEditor.jsx

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // ✅ Düzeltildi: react-hot-toast kullanılıyor
import { Save, Search, ArrowLeft, Star, StarOff, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BulkProductEditor = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modifiedRows, setModifiedRows] = useState({}); // Değişen satırları tutar
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  // 1. Ürünleri Getir
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // ✅ Düzeltme: isAdmin=true parametresi eklendi, böylece gizli ürünler de gelir
      const res = await fetch(`${apiUrl}/api/products?isAdmin=true&limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      // Backend yapınıza göre products dizisini alıyoruz
      let productList = [];
      if (data.success && Array.isArray(data.products)) {
        productList = data.products;
      } else if (Array.isArray(data)) {
        productList = data;
      }

      setProducts(productList);
      setFilteredProducts(productList);
    } catch (error) {
      console.error(error);
      toast.error("Ürünler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // 2. Arama Filtresi
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(lowerSearch) || 
      p.id.toString().includes(lowerSearch)
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  // 3. Hücre Değişikliği
  const handleCellChange = (id, field, value) => {
    // UI'ı anlık güncelle (Kullanıcı değişikliği görsün)
    setFilteredProducts(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));

    // Değişikliği kaydet (Backend'e gönderilecek paket)
    setModifiedRows(prev => ({
      ...prev,
      [id]: {
        ...prev[id] || { id }, // Önceki değişiklikleri koru veya yeni obje oluştur
        [field]: field === 'price' || field === 'stock' ? Number(value) : value
      }
    }));
  };

  // 4. Kaydetme İşlemi
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
        setModifiedRows({}); // Değişiklik listesini temizle
        // Listeyi tekrar çekmeye gerek yok, UI zaten güncel ama garanti olsun diye çekebiliriz:
        // fetchProducts(); 
      } else {
        toast.error(data.message || "Güncelleme başarısız");
      }
    } catch (error) {
      console.error(error);
      toast.error("Kaydetme hatası");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-lg shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Toplu Ürün Düzenle</h1>
              <p className="text-xs text-gray-400 font-medium">Excel modunda hızlı düzenleme</p>
            </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto items-center">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Ürün ara..." 
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
              <tr>
                <th className="px-4 py-3 w-16">ID</th>
                <th className="px-4 py-3 w-16">Görsel</th>
                <th className="px-4 py-3 min-w-[200px]">Ürün Adı</th>
                <th className="px-4 py-3 w-32">Fiyat (TL)</th>
                <th className="px-4 py-3 w-24">Stok</th>
                <th className="px-4 py-3 w-32 text-center">Vitrin</th>
                <th className="px-4 py-3 w-32">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const isModified = modifiedRows[product.id];
                return (
                  <tr key={product.id} className={`hover:bg-blue-50/30 transition-colors ${isModified ? 'bg-yellow-50/50' : ''}`}>
                    <td className="px-4 py-3 text-gray-400 font-mono">#{product.id}</td>
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden bg-white">
                        <img 
                          src={product.imageUrl || product.images?.[0] || 'https://via.placeholder.com/40'} 
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
                          className="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none py-1 text-gray-900 font-medium placeholder-gray-300 transition-colors"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        value={product.price}
                        onChange={(e) => handleCellChange(product.id, 'price', e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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

                    {/* ✅ VİTRİN (SHOWCASE) SÜTUNU */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleCellChange(product.id, 'isFeatured', !product.isFeatured)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          product.isFeatured 
                            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={product.isFeatured ? "Vitrinden Kaldır" : "Vitrine Ekle"}
                      >
                        {product.isFeatured ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
                      </button>
                    </td>

                    {/* ✅ DURUM (AKTİF/PASİF) SÜTUNU */}
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
                        {/* İkon */}
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
          
          {filteredProducts.length === 0 && !loading && (
              <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                <Search size={48} className="mb-4 opacity-20" />
                <p>Aradığınız kriterlere uygun ürün bulunamadı.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkProductEditor;