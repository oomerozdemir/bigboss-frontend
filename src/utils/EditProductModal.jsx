import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Check, Loader2, Trash2, Plus, Edit2, Image as ImageIcon, Layers, Tag, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { sortVariantsByOrder } from './sortHelpers';

const EditProductModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [variants, setVariants] = useState([]); 

  // ✅ YENİ: DETAYLAR
  const [productDetails, setProductDetails] = useState([]);
  const [tempDetail, setTempDetail] = useState({ sectionType: 'DESCRIPTION', title: '', content: '', order: 0 });

  const [groupColor, setGroupColor] = useState(""); 
  const [groupImage, setGroupImage] = useState(null); 
  const [groupSizes, setGroupSizes] = useState([]); 
  const [tempSize, setTempSize] = useState("");
  const [tempStock, setTempStock] = useState("");

  const [editingVariantIndex, setEditingVariantIndex] = useState(null);
  const [tempVariantData, setTempVariantData] = useState({ 
    size: "", color: "", stock: "", file: null, preview: "", vImageUrl: "" 
  });

  const [formData, setFormData] = useState({
    name: "", 
    description: "", 
    price: "", 
    discountPrice: "", // ✅ YENİ
    isOnSale: false,   // ✅ YENİ
    isFeatured: false, 
    categoryIds: []
  });

  useEffect(() => {
    if (isOpen && product) {
      fetchCategories();
      
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        discountPrice: product.discountPrice || "", // ✅ YENİ
        isOnSale: product.isOnSale || false,       // ✅ YENİ
        isFeatured: product.isFeatured,
        categoryIds: product.categories ? product.categories.map(c => c.id) : []
      });

      const formattedVariants = (product.variants || []).map(v => ({
        size: v.size,
        color: v.color || "Standart",
        stock: v.stock,
        vImageUrl: v.vImageUrl,
        file: null,
        preview: v.vImageUrl
      }));

      setVariants(sortVariantsByOrder(formattedVariants));
      setPreviewUrl(product.imageUrl || "");
      setSelectedFile(null); 
      
      // ✅ YENİ: Detayları doldur
      setProductDetails(product.productDetails || []);
      
      setEditingVariantIndex(null);
      resetGroupInputs();
    }
  }, [isOpen, product]);

  const resetGroupInputs = () => {
    setGroupColor("");
    setGroupImage(null);
    setGroupSizes([]);
    setTempSize("");
    setTempStock("");
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      const data = await res.json();
      setCategories(data);
    } catch (error) { console.error(error); }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
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
        toast.error("Lütfen bir renk girin");
        return;
    }
    if (groupSizes.length === 0) {
        toast.error("Lütfen en az bir beden ekleyin");
        return;
    }

    const newVariants = groupSizes.map(item => ({
        color: groupColor,
        size: item.size,
        stock: parseInt(item.stock),
        file: groupImage, 
        preview: groupImage ? URL.createObjectURL(groupImage) : null,
        vImageUrl: null
    }));

    setVariants([...variants, ...newVariants]);
    resetGroupInputs();
    toast.success(`${newVariants.length} varyant eklendi!`);
  };

  const removeVariant = (index) => {
    if (editingVariantIndex === index) setEditingVariantIndex(null);
    setVariants(variants.filter((_, i) => i !== index));
  };

  const startEditingVariant = (index, variant) => {
    setEditingVariantIndex(index);
    setTempVariantData({ 
      size: variant.size, 
      color: variant.color, 
      stock: variant.stock,
      file: null, 
      preview: variant.preview || variant.vImageUrl, 
      vImageUrl: variant.vImageUrl 
    });
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempVariantData(prev => ({
        ...prev,
        file: file,
        preview: URL.createObjectURL(file)
      }));
    }
  };

  const saveEditingVariant = (index) => {
    if (!tempVariantData.size || !tempVariantData.stock) {
        toast.error("Beden ve stok boş olamaz");
        return;
    }

    const updatedVariants = [...variants];
    updatedVariants[index] = { 
        ...updatedVariants[index], 
        size: tempVariantData.size.toUpperCase(), 
        color: tempVariantData.color || "Standart",
        stock: parseInt(tempVariantData.stock),
        file: tempVariantData.file, 
        preview: tempVariantData.preview,
        vImageUrl: tempVariantData.vImageUrl 
    };
    
    setVariants(sortVariantsByOrder(updatedVariants));
    setEditingVariantIndex(null);
  };

  const cancelEditingVariant = () => {
    setEditingVariantIndex(null);
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

  // ✅ YENİ: DETAY YÖNETİMİ
  const addProductDetail = () => {
    if (!tempDetail.content.trim()) {
        toast.error("İçerik boş olamaz");
        return;
    }
    
    setProductDetails([...productDetails, { ...tempDetail, order: productDetails.length }]);
    setTempDetail({ sectionType: 'DESCRIPTION', title: '', content: '', order: 0 });
    toast.success("Detay eklendi!");
  };

  const removeProductDetail = (index) => {
    setProductDetails(productDetails.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (variants.length === 0) {
      toast.error("En az bir varyant eklemelisiniz.");
      return;
    }
    
    if (editingVariantIndex !== null) {
        toast.error("Lütfen düzenlediğiniz satırı kaydedin.");
        return;
    }

    // ✅ İndirim kontrolü
    if (formData.isOnSale && (!formData.discountPrice || parseFloat(formData.discountPrice) >= parseFloat(formData.price))) {
        toast.error("İndirimli fiyat normal fiyattan düşük olmalı!");
        return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("discountPrice", formData.discountPrice || ""); // ✅ YENİ
    data.append("isOnSale", formData.isOnSale); // ✅ YENİ
    data.append("isFeatured", formData.isFeatured);
    data.append("categoryIds", JSON.stringify(formData.categoryIds));
    data.append("productDetails", JSON.stringify(productDetails)); // ✅ YENİ

    const variantsData = variants.map(v => ({
        size: v.size,
        color: v.color,
        stock: v.stock,
        vImageUrl: v.vImageUrl
    }));
    data.append("variants", JSON.stringify(variantsData));

    variants.forEach((v, index) => {
        if (v.file) {
            data.append(`variantImage_${index}`, v.file);
        }
    });

    if (selectedFile) {
      data.append("image", selectedFile);
    } else if (previewUrl && !previewUrl.startsWith("blob:")) {
       data.append("imageUrl", previewUrl);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${product.id}`,{
        method: "PUT", 
        headers: { "Authorization": `Bearer ${token}` },
        body: data
      });

      if (res.ok) {
        toast.success("✅ Ürün başarıyla güncellendi!");
        onSuccess(); 
        onClose();   
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
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b bg-gray-50 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">Ürün Düzenle: {product?.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-1">
               <label className="text-sm font-medium">Ürün Adı</label>
               <input required type="text" className="w-full border rounded-lg px-3 py-2" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})}/>
             </div>
             <div className="space-y-1">
               <label className="text-sm font-medium">Fiyat (TL)</label>
               <input required type="number" step="0.01" className="w-full border rounded-lg px-3 py-2" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})}/>
             </div>
          </div>

          {/* ✅ YENİ: İNDİRİM ALANI */}
          <div className="bg-orange-50 p-5 rounded-xl border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="text-orange-600" size={20} />
              <h3 className="font-bold text-orange-900">İndirim Ayarları</h3>
            </div>
            
            <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-orange-600" 
                checked={formData.isOnSale} 
                onChange={e => setFormData({...formData, isOnSale: e.target.checked})} 
              />
              <span className="font-medium text-gray-700">Bu ürün indirimde</span>
            </label>

            {formData.isOnSale && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">İndirimli Fiyat (TL)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="w-full border border-orange-200 rounded-lg px-3 py-2" 
                  value={formData.discountPrice} 
                  onChange={e => setFormData({...formData, discountPrice: e.target.value})} 
                  placeholder="Örn: 199.90"
                />
                {formData.price && formData.discountPrice && (
                  <p className="text-xs text-orange-600 mt-1">
                    İndirim: %{Math.round((1 - parseFloat(formData.discountPrice) / parseFloat(formData.price)) * 100)}
                  </p>
                )}
              </div>
            )}
          </div>

           <div className="space-y-6">
            <label className="block text-sm font-bold text-gray-800">Varyant Yönetimi</label>

            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                    <Layers className="text-blue-600" size={20} />
                    <h3 className="font-bold text-blue-900">Yeni Varyant Grubu Ekle</h3>
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
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => setGroupImage(e.target.files[0])} />
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
                        <button type="button" onClick={addSizeToGroup} className="bg-blue-600 text-white px-3 rounded-lg hover:bg-blue-700 font-bold text-sm">+ Ekle</button>
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
                    <Check size={18} /> Grubu Listeye Ekle
                </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Mevcut Varyantlar</h4>
                {variants.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                    {variants.map((v, index) => (
                    <div key={index} className={`flex justify-between items-center border p-2 rounded text-sm shadow-sm transition-colors ${editingVariantIndex === index ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"}`}>
                        
                        {editingVariantIndex === index ? (
                            <div className="flex items-center gap-2 w-full flex-wrap">
                                <label className="cursor-pointer relative w-8 h-8 rounded border border-blue-300 overflow-hidden group">
                                    <img src={tempVariantData.preview || "https://via.placeholder.com/32"} alt="preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white"><Edit2 size={12}/></div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleEditFileChange} />
                                </label>

                                <input type="text" className="flex-1 min-w-[60px] border border-blue-300 rounded px-1 py-1" value={tempVariantData.color} onChange={(e) => setTempVariantData({...tempVariantData, color: e.target.value})} placeholder="Renk"/>
                                <input type="text" className="w-16 border border-blue-300 rounded px-1 py-1 text-center uppercase" value={tempVariantData.size} onChange={(e) => setTempVariantData({...tempVariantData, size: e.target.value})} placeholder="Beden"/>
                                <input type="number" className="w-16 border border-blue-300 rounded px-1 py-1 text-center" value={tempVariantData.stock} onChange={(e) => setTempVariantData({...tempVariantData, stock: e.target.value})} placeholder="Stok"/>
                                
                                <div className="flex ml-auto gap-1">
                                    <button type="button" onClick={() => saveEditingVariant(index)} className="text-green-600 hover:bg-green-100 p-1 rounded"><Check size={16}/></button>
                                    <button type="button" onClick={cancelEditingVariant} className="text-red-600 hover:bg-red-100 p-1 rounded"><X size={16}/></button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3">
                                    {v.preview ? (
                                        <img src={v.preview} alt="v" className="w-8 h-8 rounded object-cover border border-gray-200" />
                                    ) : (
                                        <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400"><ImageIcon size={14}/></div>
                                    )}
                                    
                                    <div className="flex flex-col sm:flex-row sm:gap-2">
                                        <span className="font-bold text-gray-800">{v.color}</span>
                                        <span className="hidden sm:inline text-gray-300">|</span>
                                        <span className="font-medium">{v.size}</span>
                                        <span className="hidden sm:inline text-gray-300">|</span>
                                        <span className="text-gray-600">{v.stock} Adet</span>
                                    </div>
                                </div>

                                <div className="flex gap-1">
                                    <button type="button" onClick={() => startEditingVariant(index, v)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded transition"><Edit2 size={16}/></button>
                                    <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition"><Trash2 size={16}/></button>
                                </div>
                            </>
                        )}
                    </div>
                    ))}
                </div>
                ) : <p className="text-xs text-gray-400 text-center py-2">Varyant yok.</p>}
                
                <div className="flex justify-end mt-3">
                <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    Toplam Stok: {variants.reduce((acc, v) => acc + parseInt(v.stock || 0), 0)}
                </span>
                </div>
            </div>
          </div>

          {/* ✅ YENİ: DETAYLAR BÖLÜMÜ */}
          <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-purple-600" size={20} />
              <h3 className="font-bold text-purple-900">Ürün Detayları</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-purple-800 mb-1 block">Bölüm Tipi</label>
                <select 
                  className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm"
                  value={tempDetail.sectionType}
                  onChange={e => setTempDetail({...tempDetail, sectionType: e.target.value})}
                >
                  <option value="DESCRIPTION">Açıklama</option>
                  <option value="FEATURES">Özellikler</option>
                  <option value="SPECIFICATIONS">Teknik Özellikler</option>
                  <option value="CARE">Bakım Talimatları</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-purple-800 mb-1 block">Başlık (Opsiyonel)</label>
                <input 
                  type="text" 
                  placeholder="Örn: Kumaş Özellikleri"
                  className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm"
                  value={tempDetail.title}
                  onChange={e => setTempDetail({...tempDetail, title: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-purple-800 mb-1 block">İçerik</label>
                <textarea 
                  rows="3"
                  placeholder="Detaylı açıklama yazın..."
                  className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm"
                  value={tempDetail.content}
                  onChange={e => setTempDetail({...tempDetail, content: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="button" 
                onClick={addProductDetail}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 text-sm flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Detay Ekle
              </button>
            </div>

            {productDetails.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-purple-800 mb-2">Eklenen Detaylar ({productDetails.length})</p>
                {productDetails.map((detail, idx) => (
                  <div key={idx} className="bg-white border border-purple-200 p-3 rounded-lg text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">{detail.sectionType}</span>
                        {detail.title && <p className="font-bold text-gray-800 mt-1">{detail.title}</p>}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeProductDetail(idx)}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-gray-600 text-xs line-clamp-2">{detail.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Ana Görseli</label>
            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Resim Değiştir</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
              </label>
            ) : (
              <div className="relative w-full h-40 border border-gray-200 rounded-lg overflow-hidden group">
                  <img src={previewUrl} alt="Önizleme" className="w-full h-full object-cover" />
                  <button type="button" onClick={removeImage} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white">
                      <Trash2 size={24} />
                  </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Kısa Açıklama</label>
            <textarea rows="2" className="w-full border rounded-lg px-3 py-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ürün kartında görünecek kısa açıklama"></textarea>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-sm font-bold text-gray-800 mb-3">Kategoriler</label>
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
            <input type="checkbox" className="w-5 h-5 accent-blue-600" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} />
            <span className="font-medium">Vitrine Ekle</span>
          </label>

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex justify-center gap-2 hover:bg-blue-700">
            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Güncelle</>}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditProductModal;