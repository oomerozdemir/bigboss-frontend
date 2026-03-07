import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Plus, Shirt } from 'lucide-react';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL;

const CombinationManager = () => {
  // Ürün arama (kaynak ürün)
  const [sourceSearch, setSourceSearch] = useState('');
  const [sourceResults, setSourceResults] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);

  // Seçili kaynak ürünün kombinleri
  const [combinations, setCombinations] = useState([]);
  const [combinationsLoading, setCombinationsLoading] = useState(false);

  // Kombin eklenecek ürün arama
  const [targetSearch, setTargetSearch] = useState('');
  const [targetResults, setTargetResults] = useState([]);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const sourceRef = useRef(null);
  const targetRef = useRef(null);

  // Dışarı tıklayınca dropdown kapat
  useEffect(() => {
    const handler = (e) => {
      if (sourceRef.current && !sourceRef.current.contains(e.target)) setShowSourceDropdown(false);
      if (targetRef.current && !targetRef.current.contains(e.target)) setShowTargetDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Kaynak ürün arama
  useEffect(() => {
    if (sourceSearch.length < 2) { setSourceResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/products?isAdmin=true&search=${encodeURIComponent(sourceSearch)}&limit=8`);
        const data = await res.json();
        setSourceResults(data.products || []);
        setShowSourceDropdown(true);
      } catch { setSourceResults([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [sourceSearch]);

  // Hedef ürün arama
  useEffect(() => {
    if (targetSearch.length < 2) { setTargetResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/products?isAdmin=true&search=${encodeURIComponent(targetSearch)}&limit=8`);
        const data = await res.json();
        // Kaynak ürünü ve zaten kombinlenenleri filtrele
        const existingIds = new Set(combinations.map(c => c.product.id));
        if (selectedSource) existingIds.add(selectedSource.id);
        setTargetResults((data.products || []).filter(p => !existingIds.has(p.id)));
        setShowTargetDropdown(true);
      } catch { setTargetResults([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [targetSearch, combinations, selectedSource]);

  // Seçili ürünün kombinlerini getir
  const fetchCombinations = async (productId) => {
    setCombinationsLoading(true);
    try {
      const res = await fetch(`${API}/api/products/${productId}/combinations`);
      const data = await res.json();
      setCombinations(data);
    } catch {
      toast.error('Kombinler yüklenemedi.');
      setCombinations([]);
    } finally {
      setCombinationsLoading(false);
    }
  };

  const handleSelectSource = (product) => {
    setSelectedSource(product);
    setSourceSearch(product.name);
    setShowSourceDropdown(false);
    fetchCombinations(product.id);
  };

  const handleAddCombination = async (targetProduct) => {
    if (!selectedSource) return;
    setAddingId(targetProduct.id);
    setShowTargetDropdown(false);
    setTargetSearch('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/products/${selectedSource.id}/combinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ combinedProductId: targetProduct.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Eklenemedi');
      }
      const newCombo = await res.json();
      setCombinations(prev => [...prev, newCombo]);
      toast.success(`"${targetProduct.name}" kombine eklendi.`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAddingId(null);
    }
  };

  const handleRemoveCombination = async (targetProductId, targetProductName) => {
    if (!selectedSource) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/products/${selectedSource.id}/combinations/${targetProductId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Kaldırılamadı');
      setCombinations(prev => prev.filter(c => c.product.id !== targetProductId));
      toast.success(`"${targetProductName}" kombininden kaldırıldı.`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getThumb = (product) => {
    if (!product) return null;
    return product.variants?.[0]?.vImageUrls?.[0]
      || product.variants?.[0]?.vImageUrl
      || product.imageUrl;
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Shirt size={22} />
          Kombin Yöneticisi
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Bir ürün seçin, ardından o ürünle birlikte önerilecek ürünleri eşleştirin.
        </p>
      </div>

      {/* Kaynak Ürün Seçimi */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          1. Ürün Seçin
        </label>
        <div className="relative" ref={sourceRef}>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 h-11 focus-within:border-black transition">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Ürün adı ile ara..."
              value={sourceSearch}
              onChange={(e) => { setSourceSearch(e.target.value); setSelectedSource(null); }}
              onFocus={() => sourceSearch.length >= 2 && setShowSourceDropdown(true)}
              className="flex-1 outline-none text-sm"
            />
            {sourceSearch && (
              <button onClick={() => { setSourceSearch(''); setSelectedSource(null); setCombinations([]); }}>
                <X size={14} className="text-gray-400 hover:text-gray-700" />
              </button>
            )}
          </div>

          {showSourceDropdown && sourceResults.length > 0 && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto">
              {sourceResults.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectSource(p)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                >
                  {getThumb(p) ? (
                    <img src={getThumb(p)} className="w-9 h-9 rounded-lg object-cover shrink-0" alt="" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">#{p.id}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedSource && (
          <div className="mt-3 flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
            {getThumb(selectedSource) ? (
              <img src={getThumb(selectedSource)} className="w-12 h-14 rounded-lg object-cover shrink-0" alt="" />
            ) : (
              <div className="w-12 h-14 rounded-lg bg-gray-200 shrink-0" />
            )}
            <div>
              <p className="font-bold text-gray-900 text-sm">{selectedSource.name}</p>
              <p className="text-xs text-gray-400">ID: {selectedSource.id}</p>
            </div>
          </div>
        )}
      </div>

      {/* Mevcut Kombinler */}
      {selectedSource && (
        <>
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              2. Kombin Ürün Ekle
            </label>
            <div className="relative" ref={targetRef}>
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 h-11 focus-within:border-black transition">
                <Plus size={16} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Eklenecek ürünü ara..."
                  value={targetSearch}
                  onChange={(e) => setTargetSearch(e.target.value)}
                  onFocus={() => targetSearch.length >= 2 && setShowTargetDropdown(true)}
                  className="flex-1 outline-none text-sm"
                />
                {targetSearch && (
                  <button onClick={() => setTargetSearch('')}>
                    <X size={14} className="text-gray-400 hover:text-gray-700" />
                  </button>
                )}
              </div>

              {showTargetDropdown && targetResults.length > 0 && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto">
                  {targetResults.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleAddCombination(p)}
                      disabled={addingId === p.id}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left disabled:opacity-50"
                    >
                      {getThumb(p) ? (
                        <img src={getThumb(p)} className="w-9 h-9 rounded-lg object-cover shrink-0" alt="" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">#{p.id}</p>
                      </div>
                      <span className="text-xs text-green-600 font-bold shrink-0">+ Ekle</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Kombinler Listesi */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-700">
                Mevcut Kombinler
                <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {combinations.length}
                </span>
              </h3>
            </div>

            {combinationsLoading ? (
              <p className="text-sm text-gray-400 text-center py-6">Yükleniyor...</p>
            ) : combinations.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Shirt size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Henüz kombin ürün eklenmedi.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {combinations.map(({ combinationId, product }) => (
                  <div key={combinationId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition group">
                    {getThumb(product) ? (
                      <img src={getThumb(product)} className="w-12 h-14 rounded-lg object-cover shrink-0" alt="" />
                    ) : (
                      <div className="w-12 h-14 rounded-lg bg-gray-200 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">ID: {product.id}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveCombination(product.id, product.name)}
                      className="p-2 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                      title="Kombindan kaldır"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CombinationManager;
