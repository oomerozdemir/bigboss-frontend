import React, { useState } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { Upload, Download, FileText, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, XCircle, Layers } from 'lucide-react';

const BulkUploadPage = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // FileList yerine Array kullanmak daha güvenli
  const [parsedData, setParsedData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);

  // Dosya İsimlerini Güvenli Karşılaştırma Fonksiyonu
  const areFileNamesEqual = (name1, name2) => {
    if (!name1 || !name2) return false;
    return name1.normalize('NFC').trim().toLowerCase() === name2.normalize('NFC').trim().toLowerCase();
  };

  const handleDownloadCsv = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bulk/export`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('İndirme başarısız');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'beden_renk_export.csv';
      a.click();
    } catch (error) {
      toast.error("CSV indirilemedi");
    }
  };

  const handleCsvSelect = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data);
        toast.success(`${results.data.length} varyant okundu.`);
      },
      error: (err) => {
        toast.error("CSV okuma hatası: " + err.message);
      }
    });
  };

  const handleImageSelect = (e) => {
    // FileList'i Array'e çeviriyoruz ki üzerinde rahatça dönebilelim
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (parsedData.length === 0) return toast.error("Önce CSV yükleyin");
    setUploading(true);
    setLogs([]);
    setSummary(null);

    const BATCH_SIZE = 10;
    const token = localStorage.getItem('token');
    let allResults = [];

    for (let i = 0; i < parsedData.length; i += BATCH_SIZE) {
      const batch = parsedData.slice(i, i + BATCH_SIZE);
      const formData = new FormData();
      
      // JSON verisini ekle
      formData.append('data', JSON.stringify(batch));

      // --- DÜZELTİLEN KISIM BAŞLANGIÇ ---
      // CSV'deki her satır için uygun resmi bul ve FormData'ya ekle
      batch.forEach(item => {
        const csvImgName = item.variantImage || item.mainImageName;
        
        if (csvImgName) {
          // Yüklenen dosyalar arasında ismi eşleşeni bul (Esnek arama)
          const matchedFile = imageFiles.find(file => areFileNamesEqual(file.name, csvImgName));
          
          if (matchedFile) {
            // Dosyayı sunucuya gönderirken orijinal adıyla ekliyoruz
            formData.append('images', matchedFile);
          } else {
            console.warn(`⚠️ Dosya seçilmedi veya bulunamadı: ${csvImgName}`);
          }
        }
      });
      // --- DÜZELTİLEN KISIM BİTİŞ ---

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bulk/import`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        const result = await res.json();
        
        if (result.details) {
          allResults = [...allResults, ...result.details];
        }

        setLogs(prev => [...prev, `Batch ${Math.floor(i/BATCH_SIZE) + 1}: ${result.processed || 0} varyant işlendi.`]);
      } catch (error) {
        setLogs(prev => [...prev, `Batch ${Math.floor(i/BATCH_SIZE) + 1} HATALI: ${error.message}`]);
        console.error(error);
      }
    }

    const updated = allResults.filter(r => r.status?.includes("GÜNCELLENDİ")).length;
    const notFound = allResults.filter(r => r.status?.includes("BULUNAMADI") || r.status?.includes("YOK")).length;
    const errors = allResults.filter(r => r.status?.includes("HATA") || r.status?.includes("EKSİK")).length;

    setSummary({ updated, notFound, errors, total: allResults.length });

    setUploading(false);
    
    if (updated > 0) toast.success(`✅ ${updated} varyant güncellendi!`);
    if (notFound > 0) toast.error(`❌ ${notFound} bulunamadı`);
    if (errors > 0) toast.error(`⚠️ ${errors} hata oluştu`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Upload size={28} /> Beden-Renk Bazlı Resim Yükleme
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          🎯 Her beden-renk kombinasyonu için ayrı resim yükleyin
        </p>
      </div>

      {/* BİLGİLENDİRME */}
      <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Layers className="text-purple-600 flex-shrink-0 mt-0.5" size={24}/>
          <div>
            <p className="font-bold text-purple-900 mb-2">📌 İki Mod:</p>
            <div className="text-sm text-purple-800 space-y-2">
              <div>
                <strong>Mod 1 (Beden Belirtilmiş):</strong>
                <p className="ml-4">CSV: "3360 POZDA POZ", "36", "Beyaz" → Sadece 36-Beyaz kombinasyonunu günceller</p>
              </div>
              <div>
                <strong>Mod 2 (Beden Boş):</strong>
                <p className="ml-4">CSV: "3360 POZDA POZ", "", "Beyaz" → Beyaz rengin TÜM bedenlerini günceller</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* CSV */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FileText className="text-green-600"/> 1. CSV Dosyası
          </h2>
          
          <button 
            onClick={handleDownloadCsv} 
            className="w-full mb-4 py-2 px-4 border border-green-600 text-green-700 rounded-lg hover:bg-green-50 flex items-center justify-center gap-2 text-sm font-bold"
          >
            <Download size={16}/> Mevcut Varyantları İndir
          </button>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition">
            <input type="file" accept=".csv" onChange={handleCsvSelect} className="hidden" id="csvInput"/>
            <label htmlFor="csvInput" className="cursor-pointer block">
              <span className="text-gray-500 text-sm block mb-1">CSV dosyasını seç</span>
              <span className="bg-green-600 text-white px-3 py-1 rounded text-xs">Dosya Seç</span>
            </label>
            {csvFile && <p className="mt-2 text-sm font-bold text-green-700">{csvFile.name}</p>}
          </div>
        </div>

        {/* RESİMLER */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <ImageIcon className="text-blue-600"/> 2. Varyant Resimleri
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleImageSelect} // Güncellendi
              className="hidden" 
              id="imgInput"
            />
            <label htmlFor="imgInput" className="cursor-pointer block">
              <span className="text-gray-500 text-sm block mb-1">Tüm resimleri seçin</span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                Resimleri Seç ({imageFiles.length})
              </span>
            </label>
          </div>

          <div className="mt-4 space-y-2">
            <div className="bg-green-50 p-3 rounded-lg text-xs text-green-800">
              <strong>✅ Seçilen Resimler:</strong>
              <div className="mt-1 max-h-20 overflow-y-auto">
                {imageFiles.length > 0 ? imageFiles.map(f => f.name).join(", ") : "Henüz seçilmedi"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ÖNİZLEME */}
      {parsedData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Önizleme ({parsedData.length} Varyant)</h3>
            <button 
              onClick={handleUpload} 
              disabled={uploading}
              className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? <Loader2 className="animate-spin"/> : <Upload size={20}/>}
              {uploading ? "Yükleniyor..." : "Güncellemeyi Başlat"}
            </button>
          </div>

          {/* ÖZET KUTULARI (Aynı kaldı) */}
          {summary && (
            <div className="mb-4 grid grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg text-center border">
                <div className="text-xl font-bold text-gray-700">{summary.total}</div>
                <div className="text-xs text-gray-500">Toplam</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
                <div className="text-xl font-bold text-green-600">{summary.updated}</div>
                <div className="text-xs text-green-700">Başarılı</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center border border-red-100">
                <div className="text-xl font-bold text-red-600">{summary.notFound}</div>
                <div className="text-xs text-red-700">Bulunamadı</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg text-center border border-orange-100">
                <div className="text-xl font-bold text-orange-600">{summary.errors}</div>
                <div className="text-xs text-orange-700">Hata</div>
              </div>
            </div>
          )}

          {/* TABLO */}
          <div className="max-h-96 overflow-y-auto bg-gray-50 rounded border p-2 text-sm">
            <table className="w-full text-left">
              <thead className="text-xs text-gray-500 uppercase border-b sticky top-0 bg-gray-50">
                <tr>
                  <th className="p-2">Ürün</th>
                  <th className="p-2">Beden</th>
                  <th className="p-2">Renk</th>
                  <th className="p-2">Resim</th>
                  <th className="p-2">Durum</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((row, i) => {
                  const imgName = row.variantImage || row.mainImageName;
                  // Burada da esnek kontrol yapıyoruz ki tabloda doğru gözüksün
                  const hasImage = imgName ? imageFiles.some(f => areFileNamesEqual(f.name, imgName)) : false;
                  const beden = row.variantSize?.trim();
                  
                  return (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-100">
                      <td className="p-2 font-medium text-xs">{row.productBase}</td>
                      <td className="p-2">
                        {beden ? (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{beden}</span>
                        ) : (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">TÜM</span>
                        )}
                      </td>
                      <td className="p-2">
                        <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs font-bold">{row.variantColor}</span>
                      </td>
                      <td className="p-2 text-xs">
                        {imgName} 
                        {imgName && (
                          hasImage 
                            ? <CheckCircle size={14} className="inline ml-2 text-green-600" /> 
                            : <XCircle size={14} className="inline ml-2 text-red-500" />
                        )}
                      </td>
                      <td className="p-2 text-gray-400 text-xs">Bekliyor</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* LOGLAR */}
          {logs.length > 0 && (
            <div className="mt-4 bg-black text-green-400 p-4 rounded-lg font-mono text-xs max-h-40 overflow-y-auto">
              {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkUploadPage;