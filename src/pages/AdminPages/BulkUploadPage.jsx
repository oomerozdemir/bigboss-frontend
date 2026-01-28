import React, { useState } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { Upload, Download, FileText, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, XCircle, Zap } from 'lucide-react';

const BulkUploadPage = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);

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
      a.download = 'renk_bazli_export.csv';
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
        toast.success(`${results.data.length} renk grubu okundu.`);
      },
      error: (err) => {
        toast.error("CSV okuma hatası: " + err.message);
      }
    });
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

        setLogs(prev => [...prev, `Batch ${Math.floor(i/BATCH_SIZE) + 1}: ${result.processed || 0} renk grubu işlendi.`]);
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
      toast.success(`✅ ${updated} renk grubu güncellendi!`);
    }
    if (notFound > 0) {
      toast.error(`❌ ${notFound} bulunamadı`);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Upload size={28} /> Renk Bazlı Toplu Resim Yükleme
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          ⚡ Bir resim, tüm bedenler - Tekrar tekrar yüklemeye son!
        </p>
      </div>

      {/* AVANTAJ KUTUSU */}
      <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Zap className="text-green-600 flex-shrink-0 mt-0.5" size={24}/>
          <div>
            <p className="font-bold text-green-900 mb-2">🎯 Nasıl Çalışır?</p>
            <div className="text-sm text-green-800 space-y-1">
              <p><strong>Eski Yöntem:</strong> 36-Beyaz, 38-Beyaz, 40-Beyaz → Aynı resmi 3 kez yükle ❌</p>
              <p><strong>Yeni Yöntem:</strong> Beyaz → 1 kez yükle, sistem TÜM bedenlere atar ✅</p>
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
            <Download size={16}/> Renk Gruplarını İndir
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
            <strong className="block mb-2">📋 CSV Sütunları:</strong>
            <ul className="space-y-1 list-disc list-inside text-gray-700">
              <li><code>productBase</code> - Ürün adı (renk hariç)</li>
              <li><code>variantColor</code> - Renk adı</li>
              <li><code>variantImage</code> - Resim dosyası</li>
            </ul>
          </div>
        </div>

        {/* RESİMLER */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <ImageIcon className="text-blue-600"/> 2. Renk Resimleri
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
              <span className="text-gray-500 text-sm block mb-1">Renk resimlerini seçin</span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                Resimleri Seç ({imageFiles.length})
              </span>
            </label>
          </div>

          <div className="mt-4 space-y-2">
            <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
              <strong>💡 İpucu:</strong>
              <p className="mt-1">Her renk için sadece 1 resim yükleyin. Sistem o rengin tüm bedenlerine otomatik atar!</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg text-xs text-green-800">
              <strong>✅ Örnek:</strong>
              <ul className="mt-1 space-y-0.5 list-disc list-inside">
                <li>3360-Beyaz.jpg → 36, 38, 40, 42 (Tümüne)</li>
                <li>3360-Fusya.jpg → 36, 38, 40, 42 (Tümüne)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ÖNİZLEME */}
      {parsedData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Önizleme ({parsedData.length} Renk Grubu)</h3>
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
                  <th className="p-2">Ürün Tabanı</th>
                  <th className="p-2">Renk</th>
                  <th className="p-2">Resim</th>
                  <th className="p-2">Etki</th>
                  <th className="p-2">Durum</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((row, i) => {
                  const imgName = row.variantImage || row.mainImageName;
                  const hasImage = imgName ? Array.from(imageFiles).some(f => f.name === imgName.trim()) : false;
                  
                  return (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-100">
                      <td className="p-2 font-medium text-xs">{row.productBase}</td>
                      <td className="p-2">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                          {row.variantColor}
                        </span>
                      </td>
                      <td className="p-2 text-xs">
                        {imgName} 
                        {imgName && (
                          hasImage 
                            ? <CheckCircle size={14} className="inline ml-2 text-green-600" /> 
                            : <XCircle size={14} className="inline ml-2 text-red-500" />
                        )}
                      </td>
                      <td className="p-2">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                          TÜM BEDENLER
                        </span>
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

      {/* BİLGİLENDİRME */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
          <AlertCircle size={18}/> Önemli Bilgiler
        </h4>
        <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
          <li>Her satır bir <strong>rengi</strong> temsil eder (beden değil!)</li>
          <li>Sistem o rengin <strong>tüm bedenlerine</strong> aynı resmi atar</li>
          <li>Aynı resmi farklı bedenler için tekrar yüklemeye gerek yok</li>
          <li>Örnek: "3360 POZDA POZ Beyaz" → 36, 38, 40, 42 hepsi bu resmi alır</li>
        </ul>
      </div>
    </div>
  );
};

export default BulkUploadPage;