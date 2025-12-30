import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast'; 
const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  
  const [error, setError] = useState(""); 

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin ? "login" : "register";
    const url = `http://localhost:5000/api/auth/${endpoint}`;

    const toastId = toast.loading("İşlem yapılıyor...");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        toast.success("Giriş Başarılı! Hoşgeldin " + data.user.name, { id: toastId });
        
        onClose();
        
        setTimeout(() => {
          window.location.reload(); 
        }, 1000);

      } else {
        toast.success("Kayıt Başarılı! Şimdi giriş yapabilirsiniz.", { id: toastId });
        setIsLogin(true); 
      }

    } catch (err) {
      toast.error(err.message, { id: toastId }); 
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        
        {/* Kapatma Butonu */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition hover:rotate-90 duration-200"
        >
          <X size={24} />
        </button>

        {/* Başlık */}
        <div className="p-8 text-center bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Tekrar Hoşgeldin!" : "Aramıza Katıl"}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin ? "Big Boss dünyasına giriş yap." : "Fırsatlardan yararlanmak için hesap oluştur."}
          </p>
        </div>

        {/* Form */}
        <div className="p-8 pt-6">
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center animate-pulse">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* İsim Alanı (Sadece Kayıtta) */}
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input 
                  type="text" 
                  name="name"
                  placeholder="Adın Soyadın" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                  required={!isLogin}
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input 
                type="email" 
                name="email"
                placeholder="E-posta Adresin" 
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                required
              />
            </div>

            {/* Şifre */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input 
                type="password" 
                name="password"
                placeholder="Şifren" 
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                required
              />
            </div>

            <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2 transform active:scale-95 duration-150">
              {isLogin ? "Giriş Yap" : "Kayıt Ol"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Hesabın yok mu? " : "Zaten hesabın var mı? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="font-bold text-black hover:underline"
            >
              {isLogin ? "Kayıt Ol" : "Giriş Yap"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;