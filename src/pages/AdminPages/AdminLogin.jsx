import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import toast from 'react-hot-toast'; 

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("token", data.token); 
      localStorage.setItem("user", JSON.stringify({ username: data.username, isAdmin: true }));
      
      toast.success("Hoşgeldin Big Boss!"); 
      
      navigate("/admin-panel");

    } catch (err) {
      setError(err.message);
      toast.error(err.message); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-96 border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 tracking-widest text-blue-500">BIG BOSS <br/><span className="text-white text-lg">YÖNETİM</span></h2>
        
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Kullanıcı Adı</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-3 focus:outline-none focus:border-blue-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Şifre</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-3 focus:outline-none focus:border-blue-500 text-white"
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition duration-300">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;