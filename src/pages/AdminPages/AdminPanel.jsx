import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Users, Settings, Plus, Trash2, Edit, Search, Layers, ShoppingBag, RefreshCcw, Ticket, CheckSquare, Square, FolderInput, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast'; 
import CategoryManager from './CategoryManager';
import AddProductModal from '../../utils/AddProductModal';
import DeleteModal from '../../utils/DeleteModal'; 
import EditProductModal from '../../utils/EditProductModal';
import OrderManager from './OrderManager'; 
import ReturnManager from './ReturnManager';
import CouponManager from './CouponManager';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sayfalama State'leri
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  
  // Modallar
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // --- TOPLU İŞLEMLER ---
  const [selectedIds, setSelectedIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isBulkCategoryModalOpen, setIsBulkCategoryModalOpen] = useState(false);
  const [selectedBulkCategory, setSelectedBulkCategory] = useState("");

  useEffect(() => {
    if (activeTab === 'products') {
        fetchProducts(currentPage, searchTerm);
        fetchCategories();
    }
  }, [activeTab, currentPage]);

  // --- ARAMA İŞLEMİ ---
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
        setCurrentPage(1);
        fetchProducts(1, searchTerm);
    }
  };

  // --- ÜRÜNLERİ GETİR ---
  const fetchProducts = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products?isAdmin=true&page=${page}&limit=20&search=${search}`);
      const data = await res.json();
      
      if (data && data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setTotalPages(data.meta?.totalPages || 1);
          setTotalCount(data.meta?.totalCount || 0);
      } else if (Array.isArray(data)) {
          // Eski API yapısı veya direkt dizi gelirse
          setProducts(data);
      } else {
          setProducts([]);
      }
    } catch (error) {
      toast.error("Ürünler yüklenirken hata oluştu");
      setProducts([]);
    } finally {
        setLoading(false);
    }
  };

  // --- KATEGORİLERİ GETİR (GÜVENLİ) ---
  const fetchCategories = async () => {
      try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
          const data = await res.json();
          // API hata objesi dönerse site çökmesin diye kontrol ediyoruz
          setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
          console.error("Kategori hatası:", err);
          setCategories([]);
      }
  };

  // --- SEÇİM FONKSİYONLARI ---
  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
        setSelectedIds([]);
    } else {
        setSelectedIds(products.map(p => p.id));
    }
  };

  const toggleSelectOne = (id) => {
      setSelectedIds(prev => {
          // prev'in dizi olduğundan emin ol (Hata burada çıkıyordu)
          const safePrev = Array.isArray(prev) ? prev : [];
          if (safePrev.includes(id)) {
              return safePrev.filter(i => i !== id);
          } else {
              return [...safePrev, id];
          }
      });
  };

  // --- TOPLU SİLME ---
  const handleBulkDelete = async () => {
      if (!confirm(`${selectedIds.length} ürünü silmek istediğinize emin misiniz?`)) return;
      
      const token = localStorage.getItem("token");
      try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/bulk-delete`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ ids: selectedIds })
          });
          
          if (res.ok) {
              toast.success("Seçili ürünler silindi");
              setSelectedIds([]);
              fetchProducts(currentPage, searchTerm);
          } else {
              toast.error("Silme başarısız");
          }
      } catch (error) {
          toast.error("Hata oluştu");
      }
  };

  // --- TOPLU KATEGORİ EKLEME ---
  const handleBulkCategoryAdd = async () => {
      if (!selectedBulkCategory) return toast.error("Kategori seçiniz");

      const token = localStorage.getItem("token");
      try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/bulk-category`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ productIds: selectedIds, categoryId: selectedBulkCategory })
          });

          if (res.ok) {
              toast.success("Kategoriye eklendi");
              setIsBulkCategoryModalOpen(false);
              setSelectedIds([]);
              fetchProducts(currentPage, searchTerm);
          } else {
              toast.error("İşlem başarısız");
          }
      } catch (error) {
          toast.error("Hata oluştu");
      }
  };

  // --- GİZLE / GÖSTER TOGGLE ---
  const toggleProductStatus = async (id, currentStatus) => {
      const token = localStorage.getItem("token");
      // UI'da hemen güncelle
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));

      try {
          await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}/status`, {
              method: 'PATCH',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ isActive: !currentStatus })
          });
          toast.success(!currentStatus ? "Ürün Yayında" : "Ürün Gizlendi");
      } catch (error) {
          toast.error("Durum değiştirilemedi");
          fetchProducts(currentPage, searchTerm);
      }
  };

  // --- TEKLİ SİLME ---
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
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Ürün silindi!"); 
        fetchProducts(currentPage, searchTerm);
      } else {
        toast.error("Silinemedi"); 
      }
    } catch (error) { toast.error("Hata"); }
  };

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
        activeTab === id ? "bg-black text-white shadow-lg" : "text-gray-500 hover:bg-gray-100 hover:text-black"
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
          <SidebarItem id="coupons" icon={Ticket} label="Kuponlar" />
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
                {activeTab === 'products' ? "Ürün Yönetimi" : "Yönetim Paneli"}
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

        {/* ÜRÜN TABLOSU & TOPLU İŞLEMLER */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
            
            {/* ÜST BAR: Arama ve Toplu İşlemler */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 bg-gray-50/50">
              
              {/* TOPLU İŞLEM BUTONLARI */}
              {selectedIds.length > 0 ? (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
                      <span className="text-sm font-bold text-black mr-2">{selectedIds.length} seçildi</span>
                      
                      <button 
                        onClick={handleBulkDelete}
                        className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-100 flex items-center gap-2 transition-colors"
                      >
                          <Trash2 size={16} /> Seçileni Sil
                      </button>

                      <button 
                        onClick={() => setIsBulkCategoryModalOpen(true)}
                        className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-100 flex items-center gap-2 transition-colors"
                      >
                          <FolderInput size={16} /> Kategoriye Ekle
                      </button>
                  </div>
              ) : (
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Ürün ara ve Enter'a bas..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
              )}
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    {/* SEÇİM KUTUSU BAŞLIĞI */}
                    <th className="p-4 w-10">
                        <button onClick={toggleSelectAll} className="text-gray-400 hover:text-black">
                            {selectedIds.length > 0 && selectedIds.length === products.length ? <CheckSquare size={20}/> : <Square size={20}/>}
                        </button>
                    </th>
                    <th className="p-4 font-semibold">Görünürlük</th>
                    <th className="p-4 font-semibold">Ürün</th>
                    <th className="p-4 font-semibold">Kategori</th>
                    <th className="p-4 font-semibold">Fiyat</th>
                    <th className="p-4 font-semibold">Stok</th>
                    <th className="p-4 font-semibold text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="7" className="p-8 text-center text-gray-500">Yükleniyor...</td></tr>
                  ) : products.map((product) => (
                    <tr key={product.id} className={`hover:bg-gray-50 transition-colors group ${selectedIds.includes(product.id) ? "bg-blue-50/30" : ""}`}>
                      
                      {/* SEÇİM KUTUSU */}
                      <td className="p-4">
                          <button onClick={() => toggleSelectOne(product.id)} className={`${selectedIds.includes(product.id) ? "text-black" : "text-gray-300"}`}>
                              {selectedIds.includes(product.id) ? <CheckSquare size={20}/> : <Square size={20}/>}
                          </button>
                      </td>

                      {/* GİZLE / GÖSTER */}
                      <td className="p-4">
                          <button 
                            onClick={() => toggleProductStatus(product.id, product.isActive)}
                            className={`p-2 rounded-full transition-colors ${product.isActive ? "text-green-600 bg-green-50 hover:bg-green-100" : "text-gray-400 bg-gray-100 hover:bg-gray-200"}`}
                            title={product.isActive ? "Yayında (Gizlemek için tıkla)" : "Gizli (Yayınlamak için tıkla)"}
                          >
                              {product.isActive ? <Eye size={18}/> : <EyeOff size={18}/>}
                          </button>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={product.imageUrl || "https://via.placeholder.com/50"} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200"/>
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-500">ID: #{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {product.categories && Array.isArray(product.categories) && product.categories.length > 0 ? (
                            product.categories.map((cat) => (
                                <span key={cat.id} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium whitespace-nowrap">
                                {cat.name}
                                </span>
                            ))
                            ) : (
                            <span className="text-gray-400 text-xs">Yok</span>
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
                          onClick={() => { setEditingProduct(product); setIsEditModalOpen(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit size={18} />
                        </button>
                          
                          <button onClick={() => handleDeleteClick(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- SAYFALAMA KONTROLLERİ --- */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                <span className="text-sm text-gray-500">
                    Toplam <b>{totalCount}</b> ürün, <b>{currentPage}</b> / {totalPages} sayfa
                </span>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {/* Sayfa Numaraları (Basit) */}
                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                             // Sayfalama mantığını basit tutuyoruz, karmaşık olursa component yapılabilir
                             let pageNum = i + 1;
                             if (totalPages > 5 && currentPage > 3) {
                                 pageNum = currentPage - 2 + i;
                                 if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                             }
                             return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold ${currentPage === pageNum ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
                                >
                                    {pageNum}
                                </button>
                             )
                        })}
                    </div>

                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

          </div>
        )}

        {/* --- DİĞER MODÜLLER --- */}
        {activeTab === 'orders' && <OrderManager />}
        {activeTab === 'returns' && <ReturnManager />}
        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'coupons' && <CouponManager />}

        <AddProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} onSuccess={() => fetchProducts(currentPage, searchTerm)} />
        <EditProductModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} product={editingProduct} onSuccess={() => fetchProducts(currentPage, searchTerm)} />
        
        <DeleteModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDeleteProduct} title="Ürünü Sil" message="Bu işlem geri alınamaz." />

        {/* --- TOPLU KATEGORİ SEÇİM MODALI --- */}
        {isBulkCategoryModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl w-96 shadow-2xl animate-in fade-in zoom-in-95">
                    <h3 className="text-lg font-bold mb-4">Kategori Seçin</h3>
                    <div className="max-h-60 overflow-y-auto mb-4 border rounded p-2">
                        {Array.isArray(categories) && categories.map(mainCat => (
                            <div key={mainCat.id} className="mb-2">
                                <p className="font-bold text-xs text-gray-400 uppercase mb-1">{mainCat.name}</p>
                                {mainCat.subCategories?.map(sub => (
                                    <label key={sub.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="bulkCategory" 
                                            value={sub.id} 
                                            onChange={(e) => setSelectedBulkCategory(e.target.value)}
                                        />
                                        <span className="text-sm">{sub.name}</span>
                                    </label>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsBulkCategoryModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded">İptal</button>
                        <button onClick={handleBulkCategoryAdd} className="px-4 py-2 text-sm font-bold bg-black text-white rounded hover:bg-gray-800">Ekle</button>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;