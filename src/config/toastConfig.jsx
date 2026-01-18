import { Toaster } from 'react-hot-toast';

// ✅ Toast Varsayılan Ayarları
export const toastOptions = {
  // Pozisyon: Ekranın ortası
  position: 'top-center',
  
  // Süre ayarları
  duration: 4000, // 4 saniye
  
  // Stil ayarları
  style: {
    background: '#333',
    color: '#fff',
    padding: '16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    maxWidth: '500px',
  },
  
  // Başarı toast'ları
  success: {
    duration: 3000,
    style: {
      background: '#10b981', // Yeşil
      color: '#fff',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  },
  
  // Hata toast'ları
  error: {
    duration: 4000,
    style: {
      background: '#ef4444', // Kırmızı
      color: '#fff',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  },
  
  // Bilgi toast'ları
  loading: {
    style: {
      background: '#3b82f6', // Mavi
      color: '#fff',
    },
  },
};

export const ToastContainer = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: 80, // Navbar'ın altında
      }}
      toastOptions={{
        // Varsayılan ayarlar
        className: '',
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          fontSize: '15px',
          fontWeight: '500',
          maxWidth: '600px',
        },

        // Başarı toast
        success: {
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        },

        // Hata toast
        error: {
          duration: 5000,
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        },

        // Yükleniyor toast
        loading: {
          style: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#3b82f6',
          },
        },
      }}
    />
  );
};

export default ToastContainer;