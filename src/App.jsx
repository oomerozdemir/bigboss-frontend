import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './components/MainLayout';

import ToastContainer from "./config/toastConfig";
import { UIProvider } from './context/UIContext';

import Hero from './components/heroSection';
import Products from './components/Products';
import Newsletter from './components/NewsLetter';
import Features from './components/Features';
import BrandStory from './components/BrandStory';
import { CartProvider } from './context/CartContext';
import HomeReviews from './components/HomeReviews';
import HomeFAQ from './components/HomeFaq';

import FavoritesPage from './pages/FavoritesPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import FAQPage from './pages/FaqPage';
import CheckoutPage from './pages/CheckOutPage';
import UserAccountPage from './pages/UserAccountPage';
import PaymentFailed from './pages/PaymentFailed';
import PaymentSuccess from './pages/PaymentSuccess';
import ContactPage from "./pages/ContactPage";

import TermsOfService from './pages/LegalPages/TermsOfService';
import PrivacyPolicy from './pages/LegalPages/PrivacyPolicy';
import ReturnPolicy from './pages/LegalPages/ReturnPolicy';
import CookiePolicy from './pages/LegalPages/CookiePolicy';

import { FavoritesProvider } from './context/FavoritesContext';

{/* Admin Routes */}
import AdminLogin from './pages/AdminPages/AdminLogin';
import AdminPanel from './pages/AdminPages/AdminPanel';
import ProtectedRoute from './utils/ProtectedRoute';
import BulkProductEditor from './pages/AdminPages/BulkProductEditor';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const MetaPixelTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Sayfa değiştiğinde PageView gönder
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location]);

  return null;
};

const HomePage = () => {
  return (
    <>
      <Hero />
      <Products />
      <Features />
      <HomeReviews />
      <HomeFAQ />
      <BrandStory />
      <Newsletter />
    </>
  );
};

// JWT exp alanını decode ederek süre dolmuş mu kontrol eder
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

function App() {
  const { i18n } = useTranslation();

  // Uygulama açıldığında ve periyodik olarak normal kullanıcı token'ını kontrol et
  useEffect(() => {
    const checkUserToken = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user && isTokenExpired(token)) {
        try {
          const parsedUser = JSON.parse(user);
          // Admin oturumları ProtectedRoute tarafından yönetilir
          if (!parsedUser?.isAdmin) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    };

    checkUserToken();
    const interval = setInterval(checkUserToken, 5 * 60 * 1000); // 5 dakikada bir
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <HelmetProvider>
    <FavoritesProvider>
      <UIProvider>
    <Router>
      <ScrollToTop />
      <MetaPixelTracker />
      
      <div className="font-sans">
        <ToastContainer />
        <CartProvider>
        <Routes>
          <Route element={<MainLayout />}>
          {/* Anasayfa Rotası */}
          <Route path="/" element={<HomePage />} />
          <Route path="/favoriler" element={<FavoritesPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/sepet" element={<CartPage />} />
          <Route path="/sss" element={<FAQPage />} />
          <Route path="/odeme-sayfasi" element={<CheckoutPage />} />
          <Route path="/hesabim" element={<UserAccountPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/iletisim" element={<ContactPage />} />

          {/* Legal Rotalar */}
          <Route path="/mesafeli-satis-sozlesmesi" element={<TermsOfService />} />
          <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
          <Route path="/iade-politikasi" element={<ReturnPolicy />} />
          <Route path="/cerez-politikasi" element={<CookiePolicy />} />

          </Route>

          {/* Admin Giriş Rotası */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-panel" element={<ProtectedRoute isAdmin={true}><AdminPanel /> </ProtectedRoute> } />
          <Route path="/admin/bulk-edit" element={<ProtectedRoute isAdmin={true}><BulkProductEditor /></ProtectedRoute>} />
        </Routes>
        </CartProvider>
      </div>
    </Router>
    </UIProvider>
    </FavoritesProvider>
    </HelmetProvider>
  );
}
export default App;



/* 

seo çalışmas

ahfres kaydet


kargo ücretsizi daha belirgin hale getirilecek
tüm Türkiye'ye ücretsiz kargo' yapılabilir.


degerlendirme modalını ekle
siparislerim kisminda teslim edildikten sonra o urun icin degerlendirme modali acilsin

siparis tamamlandiktan sonra sepet silinsin


dil secenegi eklenicek

Gelecek Geliştirmeler
 Zamanlı indirimler (başlangıç/bitiş tarihi)
 Flash sale özelliği
 Kupon sistemine entegrasyon
 Rich text editor ile detay düzenleme
 Detay şablonları (hazır içerikler)


### Sonra Yap (İleride)
🔄 **Level 2-3 için plan yap**
- Admin panel hero editor
- Slider/carousel
- Dynamic content
- A/B testing
*/