import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Check, Loader2, Trash2, Plus, Image as ImageIcon, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { sortVariantsByOrder } from './sortHelpers';
// ✅ 1. Sıkıştırma kütüphanesini import et
import imageCompression from 'browser-image-compression';

const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ana Resim
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Varyant Listesi
  const [variants, setVariants] = useState([]);

  // --- TOPLU EKLEME STATE'LERİ ---
  const [groupColor, setGroupColor] = useState(""); 
  const [groupImage, setGroupImage] = useState(null); 
  const [groupSizes, setGroupSizes] = useState([]); 
  
  const [tempSize, setTempSize] = useState("");
  const [tempStock, setTempStock] = useState("");

  const [formData, setFormData] = useState({
    name: "", description: "", price: "", isFeatured: false, categoryIds: []
  });

  // ✅ 2. Sıkıştırma Fonksiyonu
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.8,          // Hedeflenen maksimum boyut (MB)
      maxWidthOrHeight: 1200,  // Maksimum genişlik/yükseklik (piksel)
      useWebWorker: true,      // Performans için web worker kullan
      fileType: "image/webp"   // Çıktı formatı (WebP daha hafiftir)
    };

    try {
      // Toast ile kullanıcıya bilgi verelim (büyük dosyalarda bekleme olabilir)
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Sıkıştırma hatası:", error);
      return file; // Hata olursa orijinal dosyayı döndür
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setFormData({ name: "", description: "", price: "", isFeatured: false, categoryIds: [] });
      setVariants([]); 
      setSelectedFile(null);
      setPreviewUrl("");
      resetGroupInputs();
    }
  }, [isOpen]);

  const resetGroupInputs = () => {
    setGroupColor("");
    setGroupImage(null);
    setGroupSizes([]);
    setTempSize("");
    setTempStock("");
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) { console.error(error); }
  };

  const handleCategoryToggle = (subCategoryId) => {
    setFormData(prev => {
      const currentIds = prev.categoryIds;
      if (currentIds.includes(subCategoryId)) {
        return { ...prev, categoryIds: currentIds.filter(id => id !== subCategoryId) };
      } else {
        return { ...prev, categoryIds: [...currentIds, subCategoryId] };
      }
    });
  };

  // ✅ 3. Ana Resim Seçimi (Sıkıştırmalı)
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await compressImage(file);
      setSelectedFile(compressed);
      setPreviewUrl(URL.createObjectURL(compressed)); 
    }
  };

  // ✅ 4. Grup Resmi Seçimi (Sıkıştırmalı)
  const handleGroupImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await compressImage(file);
      setGroupImage(compressed);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const addSizeToGroup = () => {
    if (!tempSize || !tempStock) {
        toast.error("Beden ve Stok giriniz");
        return;
    }
    setGroupSizes([...groupSizes, { size: tempSize.toUpperCase(), stock: tempStock }]);
    setTempSize("");
    setTempStock("");
  };

  const removeSizeFromGroup = (idx) => {
    setGroupSizes(groupSizes.filter((_, i) => i !== idx));
  };

  const addGroupToVariants = () => {
    if (!groupColor) {
        toast.error("Lütfen bir renk girin (Örn: Mavi)");
        return;
    }
    if (groupSizes.length === 0) {
        toast.error("Lütfen en az bir beden ekleyin");
        return;
    }

    const newVariants = groupSizes.map(item => ({
        color: groupColor,
        size: item.size,
        stock: item.stock,
        file: groupImage, // Sıkıştırılmış dosya kullanılır
        preview: groupImage ? URL.createObjectURL(groupImage) : null
    }));

    setVariants(prev => sortVariantsByOrder([...prev, ...newVariants]));
    resetGroupInputs();
    toast.success(`${newVariants.length} varyant eklendi!`);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (variants.length === 0) {
        toast.error("Lütfen en az bir varyant ekleyin.");
        return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("isFeatured", formData.isFeatured);
    data.append("categoryIds", JSON.stringify(formData.categoryIds));

    if (selectedFile) data.append("image", selectedFile);

    const variantsData = variants.map(v => ({
        size: v.size,
        color: v.color,
        stock: v.stock
    }));
    data.append("variants", JSON.stringify(variantsData));

    variants.forEach((v, index) => {
        if (v.file) {
            data.append(`variantImage_${index}`, v.file);
        }
    });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`,  {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: data 
      });

      if (res.ok) {
        toast.success("✅ Ürün başarıyla eklendi!");
        onSuccess(); onClose();
      } else {
        const error = await res.json();
        toast.error("Hata: " + error.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Sunucu hatası oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Yeni Ürün Ekle</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Ürün Adı</label>
              <input required type="text" className="w-full border rounded-lg px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fiyat (TL)</label>
              <input required type="number" className="w-full border rounded-lg px-3 py-2" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
                <Layers className="text-blue-600" size={20} />
                <h3 className="font-bold text-blue-900">Varyant Oluşturucu</h3>
            </div>
            
            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    <label className="text-xs font-bold text-blue-800 mb-1 block">1. Renk Seç</label>
                    <input type="text" placeholder="Örn: Kırmızı" className="w-full border border-blue-200 rounded-lg px-3 py-2"
                        value={groupColor} onChange={e => setGroupColor(e.target.value)} />
                </div>
                
                <div className="flex-1">
                    <label className="text-xs font-bold text-blue-800 mb-1 block">2. Renk Görseli (Opsiyonel)</label>
                    <label className={`cursor-pointer border border-dashed border-blue-300 bg-white rounded-lg h-[42px] flex items-center justify-center gap-2 text-sm text-blue-600 hover:bg-blue-50 ${groupImage ? "border-solid border-green-500 bg-green-50 text-green-700" : ""}`}>
                        <ImageIcon size={18} />
                        {groupImage ? "Görsel Seçildi" : "Görsel Yükle"}
                        {/* ✅ 5. Yeni Sıkıştırmalı Handler */}
                        <input type="file" className="hidden" accept="image/*" onChange={handleGroupImageSelect} />
                    </label>
                </div>
            </div>

            <div className="mb-4">
                <label className="text-xs font-bold text-blue-800 mb-1 block">3. Beden ve Stokları Ekle</label>
                <div className="flex gap-2">
                    <input type="text" placeholder="Beden (S)" className="w-24 border border-blue-200 rounded-lg px-3 py-2"
                        value={tempSize} onChange={e => setTempSize(e.target.value)} />
                    <input type="number" placeholder="Stok (10)" className="w-24 border border-blue-200 rounded-lg px-3 py-2"
                        value={tempStock} onChange={e => setTempStock(e.target.value)} />
                    <button type="button" onClick={addSizeToGroup} className="bg-blue-600 text-white px-3 rounded-lg hover:bg-blue-700 font-bold text-sm">
                        + Ekle
                    </button>
                </div>
                
                {groupSizes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {groupSizes.map((item, idx) => (
                            <div key={idx} className="bg-white border border-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2 text-blue-800">
                                <b>{item.size}</b> ({item.stock})
                                <button type="button" onClick={() => removeSizeFromGroup(idx)} className="text-red-400 hover:text-red-600"><X size={14}/></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button type="button" onClick={addGroupToVariants} className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 shadow-sm flex justify-center items-center gap-2">
                <Check size={18} /> Bu Rengi ve Bedenleri Listeye Ekle
            </button>
          </div>

          {variants.length > 0 && (
            <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b text-xs font-bold text-gray-500 uppercase">Eklenecek Varyantlar ({variants.length})</div>
                <div className="max-h-40 overflow-y-auto p-2 space-y-2 bg-gray-50">
                    {variants.map((v, index) => (
                        <div key={index} className="flex justify-between items-center bg-white border p-2 rounded-lg text-sm shadow-sm">
                            <div className="flex items-center gap-3">
                                {v.preview ? <img src={v.preview} className="w-8 h-8 rounded object-cover border"/> : <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center"><ImageIcon size={14}/></div>}
                                <div>
                                    <span className="font-bold text-gray-800">{v.color}</span>
                                    <span className="mx-2 text-gray-300">|</span>
                                    <span className="font-bold">{v.size}</span>
                                    <span className="mx-2 text-gray-300">|</span>
                                    <span className="text-gray-600">{v.stock} Adet</span>
                                </div>
                            </div>
                            <button type="button" onClick={() => removeVariant(index)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                        </div>
                    ))}
                </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Ürün Ana Görseli</label>
            {!previewUrl ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Ana Resim Seç</p>
                    {/* ✅ 6. Sıkıştırmalı Handler */}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                </label>
            ) : (
                <div className="relative w-full h-32 border rounded-lg overflow-hidden group">
                    <img src={previewUrl} className="w-full h-full object-cover" />
                    <button type="button" onClick={removeImage} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white"><Trash2 size={24} /></button>
                </div>
            )}
          </div>

          <div>
             <label className="block text-sm font-medium mb-1">Açıklama</label>
             <textarea rows="3" className="w-full border rounded-lg px-3 py-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-sm font-bold mb-2">Kategoriler</label>
            <div className="grid grid-cols-2 gap-4 max-h-40 overflow-y-auto">
              {categories.map((main) => (
                <div key={main.id}>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">{main.name}</h4>
                  <div className="pl-2 border-l-2">
                    {main.subCategories?.map((sub) => (
                      <label key={sub.id} className="flex items-center gap-2 cursor-pointer p-1">
                         <input type="checkbox" checked={formData.categoryIds.includes(sub.id)} onChange={() => handleCategoryToggle(sub.id)} />
                         <span className="text-sm">{sub.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="checkbox" className="w-5 h-5 accent-black" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} />
            <span className="font-medium">Vitrine Ekle</span>
          </label>

          <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 flex justify-center gap-2">
            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Kaydet</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;