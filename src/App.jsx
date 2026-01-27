import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
      <ScrollToTop />
      
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
    </FavoritesProvider>
  );
}
export default App;