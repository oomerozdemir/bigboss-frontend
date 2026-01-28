import React, { useState } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { Upload, Download, FileText, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const BulkUploadPage = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // FileList
  const [parsedData, setParsedData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);

  // 1. CSV İNDİRME
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
      a.download = 'urunler_taslak.csv';
      a.click();
    } catch (error) {
      toast.error("CSV indirilemedi");
    }
  };

  // 2. CSV YÜKLEME VE PARSE ETME
  const handleCsvSelect = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data);
        toast.success(`${results.data.length} satır ürün okundu.`);
      },
      error: (err) => {
        toast.error("CSV okuma hatası: " + err.message);
      }
    });
  };

  // 3. SUNUCUYA GÖNDERME
  const handleUpload = async () => {
    if (parsedData.length === 0) return toast.error("Önce CSV yükleyin");
    setUploading(true);
    setLogs([]);
    setSummary(null);

    const BATCH_SIZE = 10; // Her seferde 10 ürün gönder
    const token = localStorage.getItem('token');

    let allResults = [];

    for (let i = 0; i < parsedData.length; i += BATCH_SIZE) {
      const batch = parsedData.slice(i, i + BATCH_SIZE);
      const formData = new FormData();
      
      // JSON Verisini Ekle
      formData.append('data', JSON.stringify(batch));

      // Sadece bu partideki ürünlerin resimlerini bul ve ekle
      batch.forEach(item => {
        if (item.mainImageName) {
          for (let j = 0; j < imageFiles.length; j++) {
            if (imageFiles[j].name === item.mainImageName.trim()) {
              formData.append('images', imageFiles[j]);
              break;
            }
          }
        }
      });

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

        setLogs(prev => [...prev, `Batch ${Math.floor(i/BATCH_SIZE) + 1}: ${result.processed || 0} ürün işlendi.`]);
      } catch (error) {
        setLogs(prev => [...prev, `Batch ${Math.floor(i/BATCH_SIZE) + 1} HATALI!`]);
        console.error(error);
      }
    }

    // Özet oluştur
    const updated = allResults.filter(r => r.status?.includes("GÜNCELLENDİ")).length;
    const notFound = allResults.filter(r => r.status?.includes("BULUNAMADI")).length;
    const errors = allResults.filter(r => r.status?.includes("HATA")).length;
    const noChange = allResults.filter(r => r.status?.includes("DEĞİŞİKLİK YOK")).length;

    setSummary({ updated, notFound, errors, noChange, total: allResults.length });

    setUploading(false);
    
    if (updated > 0) {
      toast.success(`✅ ${updated} ürün güncellendi!`);
    }
    if (notFound > 0) {
      toast.error(`❌ ${notFound} ürün bulunamadı (yeni ürün oluşturulmadı)`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Upload size={28} /> Toplu Ürün Güncelleme
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          ⚠️ Bu sistem <strong>sadece mevcut ürünleri günceller</strong>, yeni ürün oluşturmaz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* ADIM 1: CSV İNDİR/YÜKLE */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FileText className="text-green-600"/> 1. Ürün Listesi (CSV)
          </h2>
          
          <button 
            onClick={handleDownloadCsv} 
            className="w-full mb-4 py-2 px-4 border border-green-600 text-green-700 rounded-lg hover:bg-green-50 flex items-center justify-center gap-2 text-sm font-bold"
          >
            <Download size={16}/> Mevcut Listeyi İndir
          </button>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition">
            <input type="file" accept=".csv" onChange={handleCsvSelect} className="hidden" id="csvInput"/>
            <label htmlFor="csvInput" className="cursor-pointer block">
              <span className="text-gray-500 text-sm block mb-1">Düzenlenmiş CSV dosyasını seç</span>
              <span className="bg-green-600 text-white px-3 py-1 rounded text-xs">Dosya Seç</span>
            </label>
            {csvFile && <p className="mt-2 text-sm font-bold text-green-700">{csvFile.name}</p>}
          </div>
        </div>

        {/* ADIM 2: RESİMLERİ SEÇ */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <ImageIcon className="text-blue-600"/> 2. Görseller
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            CSV'deki "mainImageName" ile eşleşen resimleri içeren klasördeki TÜM resimleri seçin.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={(e) => setImageFiles(e.target.files)} 
              className="hidden" 
              id="imgInput"
            />
            <label htmlFor="imgInput" className="cursor-pointer block">
              <span className="text-gray-500 text-sm block mb-1">Resimleri toplu olarak seçin</span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                Resimleri Seç ({imageFiles.length})
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* ADIM 3: ÖNİZLEME VE GÖNDER */}
      {parsedData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Önizleme ({parsedData.length} Ürün)</h3>
            <button 
              onClick={handleUpload} 
              disabled={uploading}
              className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? <Loader2 className="animate-spin"/> : <Upload size={20}/>}
              {uploading ? "Yükleniyor..." : "Güncellemeyi Başlat"}
            </button>
          </div>

          {/* ÖZET KART */}
          {summary && (
            <div className="mb-4 grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-700">{summary.total}</div>
                <div className="text-xs text-gray-500">Toplam</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{summary.updated}</div>
                <div className="text-xs text-green-700">Güncellendi</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">{summary.notFound}</div>
                <div className="text-xs text-red-700">Bulunamadı</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">{summary.noChange}</div>
                <div className="text-xs text-yellow-700">Değişiklik Yok</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{summary.errors}</div>
                <div className="text-xs text-orange-700">Hata</div>
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto bg-gray-50 rounded border p-2 text-sm">
            <table className="w-full text-left">
              <thead className="text-xs text-gray-500 uppercase border-b">
                <tr>
                  <th className="p-2">Ürün Kodu</th>
                  <th className="p-2">Resim Dosyası</th>
                  <th className="p-2">Fiyat</th>
                  <th className="p-2">Stok</th>
                  <th className="p-2">Durum</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.slice(0, 15).map((row, i) => {
                  const hasImage = Array.from(imageFiles).some(f => f.name === row.mainImageName?.trim());
                  return (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-100">
                      <td className="p-2 font-mono text-xs">{row.productCode || row.name}</td>
                      <td className="p-2 text-xs">
                        {row.mainImageName} 
                        {row.mainImageName && (
                          hasImage 
                            ? <CheckCircle size={14} className="inline ml-2 text-green-600" /> 
                            : <XCircle size={14} className="inline ml-2 text-red-500" />
                        )}
                      </td>
                      <td className="p-2">{row.price || '-'}</td>
                      <td className="p-2">{row.stock || '-'}</td>
                      <td className="p-2 text-gray-400">Bekliyor</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {parsedData.length > 15 && (
              <p className="text-center text-xs text-gray-400 mt-2">
                ... ve {parsedData.length - 15} ürün daha
              </p>
            )}
          </div>

          {/* LOGLAR */}
          {logs.length > 0 && (
            <div className="mt-4 bg-black text-green-400 p-4 rounded-lg font-mono text-xs max-h-40 overflow-y-auto">
              {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
          )}
        </div>
      )}

      {/* BİLGİLENDİRME */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle size={18}/> Önemli Bilgiler
        </h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>CSV'deki <code>productCode</code> ile mevcut ürünler eşleştirilir</li>
          <li>Bulunamayan ürünler için <strong>yeni ürün oluşturulmaz</strong></li>
          <li>Sadece belirtilen alanlar güncellenir (fiyat, stok, resim)</li>
          <li>Varyant verileri korunur, sadece resimleri güncellenir</li>
        </ul>
      </div>
    </div>
  );
};

export default BulkUploadPage;