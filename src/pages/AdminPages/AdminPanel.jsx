import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Users, Settings, Plus, Trash2, Edit, Search, Layers, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast'; 
import CategoryManager from './CategoryManager';
import AddProductModal from '../../utils/AddProductModal';
import DeleteModal from '../../utils/DeleteModal'; 
import EditProductModal from '../../utils/EditProductModal';
import OrderManager from './OrderManager'; 
import ReturnManager from './ReturnManager';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Silme İşlemi State'leri
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Hata:", error);
      toast.error("Ürünler yüklenirken hata oluştu");
      setLoading(false);
    }
  };

  // --- SİLME İŞLEMİ (MODAL İLE) ---
  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${productToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast.success("Ürün silindi!"); 
        fetchProducts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Silinemedi"); 
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
        activeTab === id 
          ? "bg-black text-white shadow-lg" 
          : "text-gray-500 hover:bg-gray-100 hover:text-black"
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* SOL SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block fixed h-full z-10">
        <div className="p-6">
          <a href='/'><h2 className="text-2xl font-black tracking-tighter">BIG<span className="text-gray-400">BOSS</span></h2></a>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">Admin Panel</p>
        </div>

        <nav className="px-4 space-y-2 mt-4">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Genel Bakış" />
          <SidebarItem id="orders" icon={ShoppingBag} label="Siparişler" />
          <SidebarItem id="returns" icon={RefreshCcw} label="İade Talepleri" />
          <SidebarItem id="categories" icon={Layers} label="Kategoriler" />
          <SidebarItem id="products" icon={Package} label="Ürün Yönetimi" />
          <SidebarItem id="users" icon={Users} label="Müşteriler" />
          <SidebarItem id="settings" icon={Settings} label="Ayarlar" />
        </nav>
      </aside>

      {/* SAĞ İÇERİK */}
      <main className="flex-1 md:ml-64 p-8">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
                {activeTab === 'products' ? "Ürün Yönetimi" : activeTab === 'categories' ? "Kategori Yönetimi" : activeTab === 'orders' ? "Sipariş Yönetimi" : "Panel"}
            </h1>
            <p className="text-gray-500 text-sm">Yönetim panelinize hoşgeldiniz.</p>
          </div>
          
          {activeTab === 'products' && (
            <button 
                onClick={() => setIsProductModalOpen(true)} 
                className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition shadow-lg"
            >
                <Plus size={20} />
                Yeni Ürün Ekle
            </button>
          )}
        </header>

        {/* ÜRÜN TABLOSU */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input type="text" placeholder="Ürün ara..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"/>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Ürün</th>
                    <th className="p-4 font-semibold">Kategori</th>
                    <th className="p-4 font-semibold">Fiyat</th>
                    <th className="p-4 font-semibold">Stok</th>
                    <th className="p-4 font-semibold text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">Yükleniyor...</td></tr>
                  ) : products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={product.imageUrl || "https://via.placeholder.com/50"} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200"/>
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">ID: #{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                            {product.categories && product.categories.length > 0 ? (
                            product.categories.map((cat) => (
                                <span key={cat.id} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                                {cat.name}
                                </span>
                            ))
                            ) : (
                            <span className="text-gray-400 text-xs">Kategori Yok</span>
                            )}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-900">{product.price} TL</td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {product.stock > 0 ? "Stokta" : "Tükendi"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                          onClick={() => {
                            setEditingProduct(product); 
                            setIsEditModalOpen(true);   
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit size={18} />
                        </button>
                          
                          <button 
                            onClick={() => handleDeleteClick(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
             <OrderManager />
        )}

        {activeTab === 'returns' && <ReturnManager />}

        {activeTab === 'categories' && (
          <CategoryManager /> 
        )}

        <AddProductModal 
            isOpen={isProductModalOpen} 
            onClose={() => setIsProductModalOpen(false)} 
            onSuccess={fetchProducts} 
        />

        <EditProductModal 
           isOpen={isEditModalOpen}
           onClose={() => setIsEditModalOpen(false)}
           product={editingProduct} 
           onSuccess={fetchProducts} 
        />

        {/* ÜRÜN SİLME MODALI */}
        <DeleteModal 
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDeleteProduct}
            title="Ürünü Sil"
            message="Bu ürünü kalıcı olarak silmek istediğine emin misin?"
        />

      </main>
    </div>
  );
};

export default AdminPanel;