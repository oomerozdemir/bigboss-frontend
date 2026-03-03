import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Trash2, Edit, Eye, EyeOff, ChevronUp, ChevronDown,
  Save, Upload, X, Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL;

const EMPTY_FORM = { title: '', subtitle: '', buttonText: '', buttonLink: '/products' };

const PROMO_DEFAULTS = {
  promo_title1: '40%',
  promo_title2: 'İndirim',
  promo_title3: 'Var',
  promo_subtitle: 'Geçerlilik süresi dolmadan al',
  promo_button_text: 'İndirimleri Gör',
  promo_button_link: '/products?discount=true',
  cat1_label: 'Ceketler',
  cat1_link: '/products?category=Ceketler',
  cat2_label: 'Elbiseler',
  cat2_link: '/products?category=Elbiseler',
};

// ----------------------------------------------------------------
const HeroManager = () => {
  const [tab, setTab] = useState('slides');
  const token = localStorage.getItem('token');

  // ---- SLIDES STATE ----
  const [slides, setSlides] = useState([]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // ---- CONTENT STATE ----
  const [promo, setPromo] = useState(PROMO_DEFAULTS);
  const [promoSaving, setPromoSaving] = useState(false);

  // ---- FETCH ----
  useEffect(() => { fetchSlides(); fetchContent(); }, []);

  const fetchSlides = async () => {
    setSlidesLoading(true);
    try {
      const res = await fetch(`${API}/api/hero/slides?isAdmin=true`);
      const data = await res.json();
      setSlides(Array.isArray(data) ? data : []);
    } catch { toast.error('Slaytlar yüklenemedi'); }
    finally { setSlidesLoading(false); }
  };

  const fetchContent = async () => {
    try {
      const res = await fetch(`${API}/api/hero/content`);
      const data = await res.json();
      setPromo(prev => ({ ...prev, ...data }));
    } catch {}
  };

  // ---- SLIDE MODAL ----
  const openAdd = () => {
    setEditingSlide(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEdit = (slide) => {
    setEditingSlide(slide);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle || '',
      buttonText: slide.buttonText || '',
      buttonLink: slide.buttonLink || '/products',
    });
    setImageFile(null);
    setImagePreview(slide.imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingSlide(null); };

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSaveSlide = async () => {
    if (!form.title.trim()) return toast.error('Başlık zorunludur');
    if (!editingSlide && !imageFile) return toast.error('Görsel zorunludur');

    setSaving(true);
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('subtitle', form.subtitle);
    fd.append('buttonText', form.buttonText);
    fd.append('buttonLink', form.buttonLink || '/products');
    if (editingSlide) fd.append('isActive', String(editingSlide.isActive));
    if (imageFile) fd.append('image', imageFile);

    try {
      const url = editingSlide
        ? `${API}/api/hero/slides/${editingSlide.id}`
        : `${API}/api/hero/slides`;
      const method = editingSlide ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error();
      toast.success(editingSlide ? 'Slayt güncellendi' : 'Slayt eklendi');
      closeModal();
      fetchSlides();
    } catch {
      toast.error('İşlem başarısız');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu slaytı silmek istediğinize emin misiniz?')) return;
    try {
      await fetch(`${API}/api/hero/slides/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Slayt silindi');
      fetchSlides();
    } catch { toast.error('Silinemedi'); }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API}/api/hero/slides/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = await res.json();
      setSlides(prev => prev.map(s => s.id === id ? updated : s));
    } catch { toast.error('Durum değiştirilemedi'); }
  };

  const moveSlide = async (index, direction) => {
    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    setSlides(newSlides);
    try {
      await fetch(`${API}/api/hero/slides/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderedIds: newSlides.map(s => s.id) }),
      });
    } catch { toast.error('Sıralama kaydedilemedi'); fetchSlides(); }
  };

  // ---- PROMO SAVE ----
  const handleSavePromo = async () => {
    setPromoSaving(true);
    try {
      const res = await fetch(`${API}/api/hero/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ updates: promo }),
      });
      if (!res.ok) throw new Error();
      toast.success('İçerik kaydedildi');
    } catch { toast.error('Kayıt başarısız'); }
    finally { setPromoSaving(false); }
  };

  // ================================================================
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">

      {/* TAB BAR */}
      <div className="flex border-b border-gray-100">
        {[
          { key: 'slides', label: 'Hero Slaytları' },
          { key: 'content', label: 'Promo & İçerik' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
              tab === key ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* =================== SLIDES TAB =================== */}
      {tab === 'slides' && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="font-bold text-gray-800">Hero Slayt Yönetimi</h2>
              <p className="text-xs text-gray-500 mt-0.5">Ana sayfada dönen görselleri buradan yönetin</p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
            >
              <Plus size={16} /> Yeni Slayt
            </button>
          </div>

          {slidesLoading ? (
            <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
          ) : slides.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ImageIcon size={40} className="mx-auto mb-3 opacity-30" />
              <p>Henüz slayt yok. İlk slaytı ekleyin.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {slides.map((slide, i) => (
                <div
                  key={slide.id}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
                    slide.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  {/* Thumbnail */}
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-20 h-14 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${!slide.isActive ? 'text-gray-400' : 'text-gray-800'}`}>
                      {slide.title}
                    </p>
                    {slide.subtitle && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">{slide.subtitle}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      Link: <span className="text-blue-500">{slide.buttonLink}</span>
                    </p>
                  </div>

                  {/* Status badge */}
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                    slide.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {slide.isActive ? 'Aktif' : 'Gizli'}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => moveSlide(i, 'up')}
                      disabled={i === 0}
                      className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 transition"
                      title="Yukarı taşı"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => moveSlide(i, 'down')}
                      disabled={i === slides.length - 1}
                      className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 transition"
                      title="Aşağı taşı"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={() => handleToggle(slide.id)}
                      className="p-1.5 rounded hover:bg-gray-100 transition"
                      title={slide.isActive ? 'Gizle' : 'Yayınla'}
                    >
                      {slide.isActive ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} className="text-gray-400" />}
                    </button>
                    <button
                      onClick={() => openEdit(slide)}
                      className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================== CONTENT TAB =================== */}
      {tab === 'content' && (
        <div className="p-6 max-w-xl">
          <h2 className="font-bold text-gray-800 mb-1">Promosyon Banner İçeriği</h2>
          <p className="text-xs text-gray-500 mb-6">Ana sayfanın sağ üst promo bölümünü ve kategori kartlarını düzenleyin</p>

          <div className="space-y-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Başlık (3 satır)</p>
            <div className="grid grid-cols-3 gap-3">
              {['promo_title1', 'promo_title2', 'promo_title3'].map((key, i) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">{i + 1}. Satır</label>
                  <input
                    value={promo[key]}
                    onChange={e => setPromo(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Alt metin</label>
              <input
                value={promo.promo_subtitle}
                onChange={e => setPromo(p => ({ ...p, promo_subtitle: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Buton metni</label>
                <input
                  value={promo.promo_button_text}
                  onChange={e => setPromo(p => ({ ...p, promo_button_text: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Buton linki</label>
                <input
                  value={promo.promo_button_link}
                  onChange={e => setPromo(p => ({ ...p, promo_button_link: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <hr className="border-gray-100" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori Kartları</p>

            {[
              { labelKey: 'cat1_label', linkKey: 'cat1_link', title: '1. Kart' },
              { labelKey: 'cat2_label', linkKey: 'cat2_link', title: '2. Kart' },
            ].map(({ labelKey, linkKey, title }) => (
              <div key={labelKey} className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{title} — Etiket</label>
                  <input
                    value={promo[labelKey]}
                    onChange={e => setPromo(p => ({ ...p, [labelKey]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{title} — Link</label>
                  <input
                    value={promo[linkKey]}
                    onChange={e => setPromo(p => ({ ...p, [linkKey]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handleSavePromo}
              disabled={promoSaving}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              <Save size={16} />
              {promoSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      )}

      {/* =================== SLIDE MODAL =================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">{editingSlide ? 'Slayt Düzenle' : 'Yeni Slayt'}</h3>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Image upload */}
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">
                  Görsel {!editingSlide && <span className="text-red-500">*</span>}
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-gray-400 transition-colors"
                  style={{ height: imagePreview ? 'auto' : '140px' }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full max-h-52 object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <Upload size={24} className="mb-2" />
                      <p className="text-sm">Görsel seçmek için tıklayın</p>
                    </div>
                  )}
                  {imagePreview && (
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload size={24} className="text-white" />
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
              </div>

              {/* Title */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Başlık <span className="text-red-500">*</span></label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                  placeholder="Sonbahar Koleksiyonu"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Alt Başlık</label>
                <input
                  value={form.subtitle}
                  onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                  placeholder="Yeni sezon ürünleri keşfet"
                />
              </div>

              {/* Button */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Buton Metni</label>
                  <input
                    value={form.buttonText}
                    onChange={e => setForm(f => ({ ...f, buttonText: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                    placeholder="Alışverişe Başla"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Buton Linki</label>
                  <input
                    value={form.buttonLink}
                    onChange={e => setForm(f => ({ ...f, buttonLink: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                    placeholder="/products"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-gray-100">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition">
                İptal
              </button>
              <button
                onClick={handleSaveSlide}
                disabled={saving}
                className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
              >
                <Save size={15} />
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroManager;
