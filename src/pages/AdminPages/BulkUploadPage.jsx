import React, { useState } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { Upload, Download, FileText, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

const BulkUploadPage = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
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
      a.download = 'varyantlar_export.csv';
      a.click();
    } catch (error) {
      toast.error("CSV indirilemedi");
    }
  };

  // 2. CSV YÜKLEME
  const handleCsvSelect = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data);
        toast.success(`${results.data.length} satır okundu.`);
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

    const BATCH_SIZE = 10;
    const token = localStorage.getItem('token');
    let allResults = [];

    for (let i = 0; i < parsedData.length; i += BATCH_SIZE) {
      const batch = parsedData.slice(i, i + BATCH_SIZE);
      const formData = new FormData();
      
      formData.append('data', JSON.stringify(batch));

      batch.forEach(item => {
        const imgName = item.variantImage || item.mainImageName;
        if (imgName) {
          for (let j = 0; j < imageFiles.length; j++) {
            if (imageFiles[j].name === imgName.trim()) {
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

        setLogs(prev => [...prev, `Batch ${Math.floor(i/BATCH_SIZE) + 1}: ${result.processed || 0} satır işlendi.`]);
      } catch (error) {
        setLogs(prev => [...prev, `Batch ${Math.floor(i/BATCH_SIZE) + 1} HATALI!`]);
        console.error(error);
      }
    }

    const updated = allResults.filter(r => r.status?.includes("GÜNCELLENDİ")).length;
    const notFound = allResults.filter(r => r.status?.includes("BULUNAMADI")).length;
    const errors = allResults.filter(r => r.status?.includes("HATA") || r.status?.includes("YÜKLENEMEDİ")).length;

    setSummary({ updated, notFound, errors, total: allResults.length });

    setUploading(false);
    
    if (updated > 0) {
      toast.success(`✅ ${updated} varyant güncellendi!`);
    }
    if (notFound > 0) {
      toast.error(`❌ ${notFound} bulunamadı`);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Upload size={28} /> Toplu Varyant Resmi Güncelleme
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          🎯 Ürün adı + Beden bilgisi ile varyant resimlerini güncelleyin
        </p>
      </div>

      {/* BİLGİLENDİRME KUTUSU */}
      <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20}/>
          <div className="text-sm text-blue-800">
            <p className="font-bold mb-2">📌 Nasıl Çalışır?</p>
            <ul className="space-y-1 list-disc list-inside">
              <li><strong>Beden Belirtilirse:</strong> Sadece o beden güncellenir (örn: "36")</li>
              <li><strong>Beden Boşsa:</strong> O ürünün TÜM bedenleri güncellenir</li>
              <li><strong>productCode:</strong> Tam ürün adı (renk dahil) - örn: "3360 POZDA POZ Beyaz"</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* ADIM 1: CSV */}
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

          <div className="mt-4 bg-gray-50 p-3 rounded-lg text-xs">
            <strong className="block mb-2">📋 CSV Formatı:</strong>
            <code className="block bg-white p-2 rounded border text-xs">
              productCode,variantSize,variantImage<br/>
              "3360 POZDA POZ Beyaz","36","foto1.jpg"<br/>
              "3360 POZDA POZ Fuşya","","foto2.jpg"
            </code>
          </div>
        </div>

        {/* ADIM 2: RESİMLER */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <ImageIcon className="text-blue-600"/> 2. Resimler
          </h2>
          
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
              <span className="text-gray-500 text-sm block mb-1">Tüm resimleri seçin</span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                Resimleri Seç ({imageFiles.length})
              </span>
            </label>
          </div>

          <div className="mt-4 space-y-2">
            <div className="bg-green-50 p-3 rounded-lg text-xs text-green-800">
              <strong>✅ Doğru Örnekler:</strong>
              <ul className="mt-1 space-y-0.5 list-disc list-inside">
                <li>3360 POZDA POZ Beyaz.jpg</li>
                <li>T-SHIRT Kırmızı.jpg</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ADIM 3: ÖNİZLEME */}
      {parsedData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Önizleme ({parsedData.length} Satır)</h3>
            <button 
              onClick={handleUpload} 
              disabled={uploading}
              className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? <Loader2 className="animate-spin"/> : <Upload size={20}/>}
              {uploading ? "Yükleniyor..." : "Güncellemeyi Başlat"}
            </button>
          </div>

          {/* ÖZET */}
          {summary && (
            <div className="mb-4 grid grid-cols-4 gap-3">
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
              <div className="bg-orange-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{summary.errors}</div>
                <div className="text-xs text-orange-700">Hata</div>
              </div>
            </div>
          )}

          {/* TABLO */}
          <div className="max-h-96 overflow-y-auto bg-gray-50 rounded border p-2 text-sm">
            <table className="w-full text-left">
              <thead className="text-xs text-gray-500 uppercase border-b sticky top-0 bg-gray-50">
                <tr>
                  <th className="p-2">Ürün Kodu (Renk Dahil)</th>
                  <th className="p-2">Beden</th>
                  <th className="p-2">Resim Dosyası</th>
                  <th className="p-2">Durum</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((row, i) => {
                  const imgName = row.variantImage || row.mainImageName;
                  const hasImage = imgName ? Array.from(imageFiles).some(f => f.name === imgName.trim()) : false;
                  const beden = row.variantSize?.trim();
                  
                  return (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-100">
                      <td className="p-2 font-medium text-xs">{row.productCode || row.name}</td>
                      <td className="p-2">
                        {beden ? (
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">
                            {beden}
                          </span>
                        ) : (
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">
                            TÜM BEDENLER
                          </span>
                        )}
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