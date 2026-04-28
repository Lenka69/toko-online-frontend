import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://toko-online-backend-96jc.onrender.com/api/auth/login', credentials);
      
      // Simpan data sesi ke local storage browser
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role); 
      localStorage.setItem('username', res.data.username);
      
      toast.success(`Selamat datang, ${res.data.username}!`);
      
      // Arahkan halaman sesuai dengan role/peran pengguna
      if (res.data.role === 'admin') {
        navigate('/admin/add');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal login! Periksa username/password.');
      console.error(err);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '4rem auto', 
      padding: '2.5rem', 
      background: 'white', 
      borderRadius: '16px', 
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
      border: '1px solid #f1f5f9', 
      fontFamily: '"Plus Jakarta Sans", sans-serif' 
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#0f172a', fontWeight: '800' }}>
        Masuk ke Akun
      </h2>
      
      <form onSubmit={handleLogin}>
        {/* Input Username */}
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>
              Username
            </label>
            <input 
              type="text" 
              placeholder="Masukkan username Anda" 
              style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#000000', backgroundColor: '#f8fafc', fontSize: '1rem' }}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
            />
        </div>

        {/* Input Password dengan Tombol Lihat */}
        <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Masukkan password Anda" 
                style={{ width: '100%', padding: '1rem', paddingRight: '5.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#000000', backgroundColor: '#f8fafc', fontSize: '1rem' }}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
              />
              
              {/* Tombol Toggle Lihat/Sembunyikan */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: '#e2e8f0',
                  border: 'none',
                  color: '#4f46e5',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem'
                }}
              >
                {showPassword ? 'Tutup' : 'Lihat'}
              </button>
            </div>
        </div>

        {/* Tombol Login */}
        <button 
          type="submit" 
          style={{ width: '100%', padding: '1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
        >
            Login Sekarang
        </button>
      </form>
    </div>
  );
};

export default Login;