import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden scale-100 transition-transform">
        
        {/* Üst Kısım: İkon ve Başlık */}
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title || "Emin misin?"}</h3>
          <p className="text-sm text-gray-500 mt-2">
            {message || "Bu işlem geri alınamaz. Silmek istediğine emin misin?"}
          </p>
        </div>

        {/* Alt Kısım: Butonlar */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="flex-1 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Vazgeç
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 shadow-md transition transform active:scale-95"
          >
            Evet, Sil
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteModal;