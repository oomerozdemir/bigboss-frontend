import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Save, Search, ArrowLeft } from 'lucide-react';
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
      const res = await fetch(`${apiUrl}/api/products?limit=1000`, { // Limiti yüksek tutun
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      }
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
    // UI'ı güncelle
    setFilteredProducts(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));

    // Değişikliği kaydet (Modified Tracking)
    setModifiedRows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        id: id,
        [field]: field === 'price' || field === 'stock' ? Number(value) : value
      }
    }));
  };

  // 4. Kaydetme İşlemi
  const handleSave = async () => {
    const updates = Object.values(modifiedRows);

    if (updates.length === 0) {
      toast.info("Değişiklik yapılmadı.");
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
        fetchProducts(); // Listeyi yenile
      } else {
        toast.error(data.message || "Güncelleme başarısız");
      }
    } catch (error) {
      console.error(error);
      toast.error("Kaydetme hatası");
    }
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Toplu Ürün Düzenle</h1>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Ürün ara..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={Object.keys(modifiedRows).length === 0}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white transition-all
              ${Object.keys(modifiedRows).length > 0 
                ? 'bg-green-600 hover:bg-green-700 shadow-lg scale-105' 
                : 'bg-gray-400 cursor-not-allowed'}`}
          >
            <Save size={20} />
            KAYDET ({Object.keys(modifiedRows).length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase font-bold">
            <tr>
              <th className="px-4 py-3 w-16">ID</th>
              <th className="px-4 py-3 w-16">Görsel</th>
              <th className="px-4 py-3">Ürün Adı</th>
              <th className="px-4 py-3 w-32">Fiyat (TL)</th>
              <th className="px-4 py-3 w-24">Stok</th>
              <th className="px-4 py-3 w-32">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => {
              const isModified = modifiedRows[product.id];
              return (
                <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${isModified ? 'bg-yellow-50' : ''}`}>
                  <td className="px-4 py-3 text-gray-500">#{product.id}</td>
                  <td className="px-4 py-3">
                    <img 
                      src={product.image || product.images?.[0] || 'https://via.placeholder.com/40'} 
                      alt="" 
                      className="w-10 h-10 object-cover rounded border"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input 
                        type="text" 
                        value={product.name}
                        onChange={(e) => handleCellChange(product.id, 'name', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none py-1"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="number" 
                      value={product.price}
                      onChange={(e) => handleCellChange(product.id, 'price', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="number" 
                      value={product.stock}
                      onChange={(e) => handleCellChange(product.id, 'stock', e.target.value)}
                      className={`w-full p-2 border rounded focus:ring-2 outline-none ${product.stock < 5 ? 'text-red-600 font-bold bg-red-50' : ''}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select 
                      value={product.isActive ? 'true' : 'false'} // isActive veya status alan adınızı kontrol edin
                      onChange={(e) => handleCellChange(product.id, 'isActive', e.target.value === 'true')}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Pasif</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-gray-500">Ürün bulunamadı.</div>
        )}
      </div>
    </div>
  );
};

export default BulkProductEditor;