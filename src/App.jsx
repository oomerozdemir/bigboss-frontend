import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { Toaster } from 'react-hot-toast';


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
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: 'green',
              },
            },
            error: {
              style: {
                background: 'red',
              },
            },
          }}
        />
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


tuadaki gibi siparis yonetimi ve iade yapisi eklenecek

kupon yapisi eklenicek

toast bildirimi ekranin sag ustu yerine ortada 

sipariş sonrası mail gönderimi yapısı sipariş alındığında, kargoya verildiğinde ve teslim edildiğindee mail gitmeli

*/