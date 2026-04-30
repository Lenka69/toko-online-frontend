import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); // State baru untuk Loading
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Nyalakan loading saat tombol diklik
    
    // Toast informasi jika server Render sedang bangun (karena butuh waktu)
    const loadingToast = toast.loading('Sedang menghubungi server, mohon tunggu beberapa detik...');

    try {
      const res = await axios.post('https://toko-online-backend-96jc.onrender.com/api/auth/login', credentials);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role); 
      localStorage.setItem('username', res.data.username);
      
      toast.dismiss(loadingToast); // Matikan toast loading
      toast.success(`Selamat datang, ${res.data.username}!`);
      
      if (res.data.role === 'admin') navigate('/admin/add');
      else navigate('/');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || 'Gagal login! Periksa username/password.');
    } finally {
      setIsLoading(false); // Matikan loading baik sukses maupun gagal
    }
  };

  return (
    <div className="form-card">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#0f172a', fontWeight: '800' }}>Masuk ke Akun</h2>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Username</label>
            <input type="text" placeholder="Masukkan username Anda" style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '1rem', color: '#000' }} onChange={(e) => setCredentials({...credentials, username: e.target.value})} required />
        </div>

        <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input type={showPassword ? "text" : "password"} placeholder="Masukkan password Anda" style={{ width: '100%', padding: '1rem', paddingRight: '5.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '1rem', color: '#000' }} onChange={(e) => setCredentials({...credentials, password: e.target.value})} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '8px', background: '#e2e8f0', border: 'none', color: '#4f46e5', fontWeight: '700', cursor: 'pointer', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                {showPassword ? 'Tutup' : 'Lihat'}
              </button>
            </div>
        </div>

        {/* Tombol akan berubah abu-abu dan tidak bisa diklik saat loading */}
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '1rem', 
            background: isLoading ? '#94a3b8' : '#4f46e5', 
            color: 'white', 
            border: 'none', 
            borderRadius: '10px', 
            fontWeight: 'bold', 
            cursor: isLoading ? 'not-allowed' : 'pointer', 
            fontSize: '1rem',
            transition: 'all 0.3s'
          }}
        >
            {isLoading ? 'Memproses...' : 'Login Sekarang'}
        </button>
      </form>
    </div>
  );
};

export default Login;