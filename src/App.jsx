import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';

import ToastContainer from "./config/toastConfig";

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

import TermsOfService from './pages/LegalPages/TermsOfService';
import PrivacyPolicy from './pages/LegalPages/PrivacyPolicy';
import ReturnPolicy from './pages/LegalPages/ReturnPolicy';
import CookiePolicy from './pages/LegalPages/CookiePolicy';

import { FavoritesProvider } from './context/FavoritesContext';


{/* Admin Routes */}
import AdminLogin from './pages/AdminPages/AdminLogin';
import AdminPanel from './pages/AdminPages/AdminPanel';
import ProtectedRoute from './utils/ProtectedRoute';


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

function App() {
  return (
    <FavoritesProvider>
    <Router>
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


          {/* Legal Rotalar */}
          <Route path="/mesafeli-satis-sozlesmesi" element={<TermsOfService />} />
          <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
          <Route path="/iade-politikasi" element={<ReturnPolicy />} />
          <Route path="/cerez-politikasi" element={<CookiePolicy />} />




          </Route>

          {/* Admin Giriş Rotası */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-panel" element={<ProtectedRoute isAdmin={true}><AdminPanel /> </ProtectedRoute> } />
          
        </Routes>
        </CartProvider>
      </div>
    </Router>
    </FavoritesProvider>
  );
}
export default App;

/* 
urunlerin aciklamasi mutlaka olmali
urun detay sayfasi assagiya dogru uzamali bir seyler ekle oraya


urunler cok fazla hepsini duzenlerken tek tek ugrasmamak toplu duzenleme yapmak icin cozum bulalim

odeme basarili ise paytr den gelen payment-succes page e gitsin degilse payment-failed

e-posta gitmiyor
📧 Ödeme Onaylandı. Mail gönderiliyor: oomerozdemir40@gmail.com
❌ E-posta Gönderme Hatası: TypeError: Cannot read properties of undefined (reading 'map')
    at sendOrderConfirmationEmail (file:///opt/render/project/src/src/utils/emailService.js:22:40)
    at paytrCallback (file:///opt/render/project/src/src/controller/paytrController.js:196:21)

mobil responsiveligi kontrol et her sayfa icin


console dan paytr istegini sil backend de

ahfres kaydet

siparislerim kisminda teslim edildikten sonra o urun icin degerlendirme modali acilsin
siparis tamamlandiktan sonra sepet silinsin

maildeki iletisim bilgilerini duzenle
siparislerim butonunu duzenle maildeki

sepetinde urun biraknalara mail gonderelim zamanla dongu halinde 

### Sonra Yap (İleride)
🔄 **Level 2-3 için plan yap**
- Admin panel hero editor
- Slider/carousel
- Dynamic content
- A/B testing
*/