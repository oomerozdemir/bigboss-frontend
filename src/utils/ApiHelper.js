// src/utils/apiHelper.js
import toast from 'react-hot-toast';

/**
 * API isteklerini token kontrolü ile yapar
 * Token süresi dolmuşsa otomatik logout yapar
 */
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Default headers
  const headers = {
    ...options.headers,
  };

  // Token varsa ekle
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // FormData için Content-Type ekleme (browser otomatik halleder)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // ✅ Token süresi dolmuşsa veya geçersizse
    if (response.status === 401) {
      const errorData = await response.json();
      
      if (errorData.code === 'TOKEN_EXPIRED' || errorData.code === 'INVALID_TOKEN' || errorData.code === 'NO_TOKEN') {
        // Kullanıcıyı logout yap
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        toast.error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.', {
          duration: 4000,
          icon: '🔒'
        });
        
        // Admin sayfasındaysa admin login'e, değilse normal login'e yönlendir
        const isAdminPage = window.location.pathname.includes('/admin');
        setTimeout(() => {
          window.location.href = isAdminPage ? '/admin/login' : '/login';
        }, 1500);
        
        throw new Error('TOKEN_EXPIRED');
      }
      
      throw new Error(errorData.error || 'Yetkisiz erişim');
    }

    // ✅ Diğer HTTP hatalarını kontrol et
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// ✅ Token'ın süresini kontrol et
export const isTokenExpired = () => {
  const token = localStorage.getItem('token');
  if (!token) return true;

  try {
    // JWT payload'ı decode et (base64)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Saniyeden milisaniyeye çevir
    
    return Date.now() >= exp;
  } catch (error) {
    console.error('Token decode hatası:', error);
    return true;
  }
};

// ✅ Token'ın kalan süresini al (dakika olarak)
export const getTokenRemainingTime = () => {
  const token = localStorage.getItem('token');
  if (!token) return 0;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    const remaining = exp - Date.now();
    
    return Math.floor(remaining / 60000); // Dakikaya çevir
  } catch (error) {
    return 0;
  }
};

// ✅ Kullanıcı bilgilerini token'dan al
export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      email: payload.email,
      username: payload.username,
      isAdmin: payload.isAdmin || payload.role === 'admin'
    };
  } catch (error) {
    console.error('Token parse hatası:', error);
    return null;
  }
};

// ✅ Token kontrolü yapan hook (React komponentlerinde kullanmak için)
export const useTokenCheck = () => {
  const checkToken = () => {
    if (isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const isAdminPage = window.location.pathname.includes('/admin');
      window.location.href = isAdminPage ? '/admin/login' : '/login';
    }
  };

  return checkToken;
};