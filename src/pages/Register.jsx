import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading('Sedang mendaftarkan akun...');

    try {
      await axios.post('https://toko-online-backend-96jc.onrender.com/api/auth/register', formData);
      toast.dismiss(loadingToast);
      toast.success('Pendaftaran berhasil! Silakan Login.');
      navigate('/login'); // Lempar ke halaman login setelah sukses
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || 'Gagal mendaftar!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#0f172a', fontWeight: '800' }}>Daftar Akun Baru</h2>
      <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem', fontSize: '0.95rem' }}>
        Bergabunglah untuk mulai berbelanja gadget impian Anda!
      </p>
      
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Username</label>
            <input type="text" placeholder="Pilih username unik" style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '1rem', color: '#000' }} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Alamat Email</label>
            <input type="email" placeholder="nama@email.com" style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '1rem', color: '#000' }} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>

        <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input type={showPassword ? "text" : "password"} placeholder="Buat password yang kuat" style={{ width: '100%', padding: '1rem', paddingRight: '5.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '1rem', color: '#000' }} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '8px', background: '#e2e8f0', border: 'none', color: '#4f46e5', fontWeight: '700', cursor: 'pointer', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                {showPassword ? 'Tutup' : 'Lihat'}
              </button>
            </div>
        </div>

        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '1rem', background: isLoading ? '#94a3b8' : '#ec4899', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '1rem', transition: 'all 0.3s' }}>
            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>
        Sudah punya akun? <Link to="/login" style={{ color: '#4f46e5', fontWeight: '700', textDecoration: 'none' }}>Login di sini</Link>
      </div>
    </div>
  );
};

export default Register;