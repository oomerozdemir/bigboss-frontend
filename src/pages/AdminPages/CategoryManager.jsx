import React, { useState, useEffect } from 'react';
import { Plus, Tag, Layers, ChevronRight, Trash2, Edit2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import DeleteModal from '../../utils/DeleteModal'; 

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ekleme State'leri
  const [newMainCategory, setNewMainCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [selectedMainId, setSelectedMainId] = useState("");
  const [newIsShowOnNavbar, setNewIsShowOnNavbar] = useState(false);

  // Düzenleme State'leri
  const [editingItem, setEditingItem] = useState({ id: null, type: null });
  const [editName, setEditName] = useState(""); 
  const [editIsShowOnNavbar, setEditIsShowOnNavbar] = useState(false); // 👈 YENİ: Düzenleme için state

  // Silme İşlemi State'leri
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // --- 1. KATEGORİLERİ GETİR ---
 const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      const data = await res.json();
      
      // API'den dizi gelmezse boş dizi ata (Site çökmez)
      if (Array.isArray(data)) {
          setCategories(data);
      } else {
          console.error("Kategori hatası:", data);
          setCategories([]);
      }
      setLoading(false);
   } catch (error) {
      toast.error("Kategoriler yüklenemedi!");
      setCategories([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    fetchCategories();
  }, []);

const handleAddMain = async (e) => {
    e.preventDefault();
    if (!newMainCategory) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/main`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: newMainCategory, isShowOnNavbar: newIsShowOnNavbar })
      });
      if (res.ok) { setNewMainCategory(""); setNewIsShowOnNavbar(false); fetchCategories(); toast.success("Eklendi!"); }
    } catch (error) { console.error(error); }
  };

  const handleAddSub = async (e) => {
    e.preventDefault();
    if (!newSubCategory || !selectedMainId) { toast.error("Ana kategori seçin."); return; }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/sub`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: newSubCategory, mainCategoryId: selectedMainId })
      });
      if (res.ok) { setNewSubCategory(""); fetchCategories(); toast.success("Eklendi!"); }
    } catch (error) { console.error(error); }
  };

  const confirmDelete = (id, type) => { setItemToDelete({ id, type }); setDeleteModalOpen(true); };
  const executeDelete = async () => {
    if (!itemToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const endpoint = itemToDelete.type === 'main' ? `main/${itemToDelete.id}` : `sub/${itemToDelete.id}`;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${endpoint}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) { fetchCategories(); toast.success("Silindi."); } else { toast.error("Silinemedi."); }
    } catch (error) { toast.error("Hata."); }
  };
const startEditing = (item, type) => { setEditingItem({ id: item.id, type }); setEditName(item.name); if (type === 'main') setEditIsShowOnNavbar(item.isShowOnNavbar || false); };
  const cancelEditing = () => { setEditingItem({ id: null, type: null }); setEditName(""); setEditIsShowOnNavbar(false); };
  const saveEditing = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = editingItem.type === 'main' ? `main/${editingItem.id}` : `sub/${editingItem.id}`;
      const bodyData = { name: editName, ...(editingItem.type === 'main' && { isShowOnNavbar: editIsShowOnNavbar }) };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${endpoint}`, { method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(bodyData) });
      if (res.ok) { fetchCategories(); setEditingItem({ id: null, type: null }); toast.success("Güncellendi!"); } else { toast.error("Güncellenemedi."); }
    } catch (error) { console.error(error); }
  };

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* SOL: FORM ALANLARI */}
      <div className="space-y-8">
        {/* Ana Kategori Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-indigo-600">
            <Layers size={24} />
            <h3 className="text-lg font-bold text-gray-800">Ana Kategori Oluştur</h3>
          </div>
          <form onSubmit={handleAddMain} className="flex flex-col gap-3">
            <div className="flex gap-2">
                <input 
                type="text" 
                value={newMainCategory}
                onChange={(e) => setNewMainCategory(e.target.value)}
                placeholder="Kategori Adı"
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                <Plus size={20} />
                </button>
            </div>
            
            <div 
                onClick={() => setNewIsShowOnNavbar(!newIsShowOnNavbar)}
                className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600 hover:text-indigo-600 w-fit"
            >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newIsShowOnNavbar ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300"}`}>
                    {newIsShowOnNavbar && <Check size={14} className="text-white" />}
                </div>
                <span>Bu kategoriyi Navbar'da göster</span>
            </div>
            
          </form>
        </div>

        {/* Alt Kategori Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-pink-600">
            <Tag size={24} />
            <h3 className="text-lg font-bold text-gray-800">Alt Kategori Oluştur</h3>
          </div>
          <form onSubmit={handleAddSub} className="space-y-4">
            <select 
              value={selectedMainId}
              onChange={(e) => setSelectedMainId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500 bg-white"
            >
              <option value="">Bir Ana Kategori Seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                placeholder="Alt Kategori Adı"
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
              />
              <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition">
                <Plus size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SAĞ: KATEGORİ LİSTESİ */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Mevcut Kategori Ağacı</h3>
        
        {loading ? (
          <p className="text-gray-400">Yükleniyor...</p>
        ) : (
          <div className="space-y-4">
            {categories.map((main) => (
              <div key={main.id} className="border border-gray-100 rounded-lg overflow-hidden group">
                
                {/* Ana Kategori Satırı */}
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3 flex-1">
                    {editingItem.id === main.id && editingItem.type === 'main' ? (
                      // --- DÜZENLEME MODU (MAIN) ---
                      <div className="flex items-center gap-2 w-full">
                        {/* İsim Inputu */}
                        <input 
                            type="text" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)} 
                            className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:border-blue-500"
                        />
                        
                        {/* Navbar Göster Checkbox'ı */}
                        <label className="flex items-center gap-1 cursor-pointer select-none bg-white px-2 py-1 border rounded hover:border-indigo-500">
                             <input 
                                type="checkbox" 
                                checked={editIsShowOnNavbar} 
                                onChange={(e) => setEditIsShowOnNavbar(e.target.checked)}
                                className="accent-indigo-600 w-4 h-4"
                             />
                             <span className="text-xs text-gray-600 font-medium">Navbar</span>
                        </label>

                        <button onClick={saveEditing} className="text-green-600 hover:bg-green-100 p-1 rounded"><Check size={18}/></button>
                        <button onClick={cancelEditing} className="text-red-600 hover:bg-red-100 p-1 rounded"><X size={18}/></button>
                      </div>
                    ) : (
                      // --- NORMAL MOD (MAIN) ---
                      <>
                        <span className="font-bold text-gray-800">{main.name}</span>
                        {/* Navbar Göstergesi / Badge */}
                        {main.isShowOnNavbar && (
                             <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-200">NAVBAR</span>
                        )}
                        <span className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                          {main.subCategories?.length || 0}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Düzenleme Butonları (Normal Modda Görünür) */}
                  {!(editingItem.id === main.id && editingItem.type === 'main') && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEditing(main, 'main')} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded" title="Düzenle">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => confirmDelete(main.id, 'main')} className="p-1.5 text-red-600 hover:bg-red-100 rounded" title="Sil">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Alt Kategori Listesi */}
                <div className="divide-y divide-gray-100 bg-white">
                  {main.subCategories?.length > 0 ? (
                    main.subCategories.map((sub) => (
                      <div key={sub.id} className="px-4 py-2 text-sm text-gray-600 flex justify-between items-center pl-8 hover:bg-gray-50 group/sub">
                        <div className="flex items-center gap-2 flex-1">
                          <ChevronRight size={14} className="text-gray-300" />
                          {editingItem.id === sub.id && editingItem.type === 'sub' ? (
                            // --- DÜZENLEME MODU (SUB) ---
                            <div className="flex items-center gap-2 w-full">
                              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-xs w-full focus:outline-none focus:border-pink-500"/>
                              <button onClick={saveEditing} className="text-green-600 hover:bg-green-100 p-1 rounded"><Check size={14}/></button>
                              <button onClick={cancelEditing} className="text-red-600 hover:bg-red-100 p-1 rounded"><X size={14}/></button>
                            </div>
                          ) : (
                            // --- NORMAL MOD (SUB) ---
                            <span>{sub.name}</span>
                          )}
                        </div>
                        {!(editingItem.id === sub.id && editingItem.type === 'sub') && (
                          <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                            <button onClick={() => startEditing(sub, 'sub')} className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => confirmDelete(sub.id, 'sub')} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-xs text-gray-400 italic pl-8">Alt kategori yok</div>
                  )}
                </div>

              </div>
            ))}

            {categories.length === 0 && (
              <p className="text-center text-gray-400 py-4">Henüz kategori eklenmemiş.</p>
            )}
          </div>
        )}
      </div>

    </div>
    
    <DeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Kategoriyi Sil"
        message="Bu kategoriyi silmek istediğine emin misin? Bu işlem geri alınamaz."
    />
    </>
  );
};

export default CategoryManager;