import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, Navigate, MemoryRouter, useInRouterContext, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import './App.css';

// ==========================================
// 1. KOMPONEN AUTO LOGOUT
// ==========================================
const AutoLogout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timeoutId;
    const handleLogout = () => {
      if (localStorage.getItem('token')) {
        localStorage.clear();
        toast.error('Sesi berakhir karena tidak ada aktivitas.', { icon: '⏱️' });
        navigate('/login');
      }
    };
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleLogout, 15 * 60 * 1000); 
    };
    if (location.pathname === '/login' || location.pathname === '/register') return;
    const activeEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    activeEvents.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activeEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [navigate, location.pathname]);

  return null; 
};

// ==========================================
// 2. PROTEKSI RUTE & NAVBAR
// ==========================================
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/" replace />;
  return children;
};

const NavbarContent = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo"><span style={{ fontSize: '1.8rem' }}>⚡️</span> TokoTech</Link>
      <ul className="nav-links">
        {token ? (
          <>
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/products">Katalog</Link></li>
            {role === 'admin' && <li><Link to="/admin/add" className="btn-nav-add">+ Tambah Barang</Link></li>}
            <li><button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}>Keluar</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" style={{ color: '#4f46e5', fontWeight: '700' }}>Masuk</Link></li>
            <li><Link to="/register" className="btn-nav-add" style={{ background: '#ec4899', color: 'white' }}>Daftar Akun</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

const Navbar = () => {
  const inRouter = useInRouterContext();
  if (!inRouter) return <MemoryRouter><NavbarContent /></MemoryRouter>;
  return <NavbarContent />;
};

// ==========================================
// 3. HALAMAN LOGIN & REGISTER
// ==========================================
const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading('Sedang menghubungi server...');
    try {
      const res = await axios.post('https://toko-online-backend-96jc.onrender.com/api/auth/login', credentials);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role); 
      localStorage.setItem('username', res.data.username);
      toast.dismiss(loadingToast);
      toast.success(`Selamat datang, ${res.data.username}!`);
      if (res.data.role === 'admin') navigate('/admin/add');
      else navigate('/');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || 'Gagal login! Periksa username/password.');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="form-card">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#0f172a', fontWeight: '800' }}>Masuk ke Akun</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>Username</label>
            <input type="text" placeholder="Masukkan username" style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '1rem' }} onChange={(e) => setCredentials({...credentials, username: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input type={showPassword ? "text" : "password"} placeholder="Masukkan password" style={{ width: '100%', padding: '1rem', paddingRight: '5.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '1rem' }} onChange={(e) => setCredentials({...credentials, password: e.target.value})} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '8px', background: '#e2e8f0', border: 'none', color: '#4f46e5', fontWeight: '700', cursor: 'pointer', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>{showPassword ? 'Tutup' : 'Lihat'}</button>
            </div>
        </div>
        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '1rem', background: isLoading ? '#94a3b8' : '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '1rem' }}>
            {isLoading ? 'Memproses...' : 'Login Sekarang'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>
        Belum punya akun? <Link to="/register" style={{ color: '#ec4899', fontWeight: '700', textDecoration: 'none' }}>Daftar di sini</Link>
      </div>
    </div>
  );
};

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
      navigate('/login'); 
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || 'Gagal mendaftar!');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="form-card">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#0f172a', fontWeight: '800' }}>Daftar Akun Baru</h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>Username</label>
            <input type="text" placeholder="Pilih username unik" style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '1rem' }} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>Email</label>
            <input type="email" placeholder="nama@email.com" style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '1rem' }} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input type={showPassword ? "text" : "password"} placeholder="Buat password" style={{ width: '100%', padding: '1rem', paddingRight: '5.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '1rem' }} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '8px', background: '#e2e8f0', border: 'none', color: '#4f46e5', fontWeight: '700', cursor: 'pointer', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>{showPassword ? 'Tutup' : 'Lihat'}</button>
            </div>
        </div>
        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '1rem', background: isLoading ? '#94a3b8' : '#ec4899', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '1rem' }}>
            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>
        Sudah punya akun? <Link to="/login" style={{ color: '#4f46e5', fontWeight: '700', textDecoration: 'none' }}>Login di sini</Link>
      </div>
    </div>
  );
};

// ==========================================
// 4. HALAMAN LAINNYA (HOME, LIST, DETAIL, ADD)
// ==========================================
const Home = () => (
  <div className="hero-section">
    <h1 className="hero-title">Gadget Impian, <br /><span style={{ color: '#4f46e5' }}>Kini di Genggaman.</span></h1>
    <p className="hero-subtitle">Temukan koleksi teknologi terbaru dengan harga terbaik.</p>
    <Link to="/products" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>Jelajahi Produk &rarr;</Link>
  </div>
);

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const role = localStorage.getItem('role');

  const fetchProducts = () => {
    setIsLoading(true);
    axios.get('https://toko-online-backend-96jc.onrender.com/api/products')
      .then(res => { setProducts(res.data); setIsLoading(false); })
      .catch(err => { console.error(err); setIsLoading(false); });
  };
  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if(window.confirm("Yakin ingin menghapus?")) {
      try {
        await axios.delete(`https://toko-online-backend-96jc.onrender.com/api/products/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
        toast.success('Berhasil dihapus!'); fetchProducts(); 
      } catch (error) { toast.error('Gagal menghapus'); }
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div className="search-container">
        <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Katalog Produk</h2>
        <input type="text" placeholder="Cari gadget..." className="search-bar" onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      {isLoading ? <div style={{ textAlign: 'center', marginTop: '4rem' }}><h3>Memuat produk... ⏳</h3></div> : 
      filtered.length === 0 ? <div style={{ textAlign: 'center', marginTop: '4rem' }}><h3>Produk tidak ditemukan</h3></div> : (
        <div className="product-grid">
          {filtered.map(product => (
            <div key={product._id} className="product-card">
              <div className="image-container"><img src={product.imageUrl} alt={product.name} /></div>
              <div className="card-content">
                <h3>{product.name}</h3><p className="price-tag">Rp {product.price.toLocaleString('id-ID')}</p>
                <div className="card-actions">
                  <Link to={`/products/${product._id}`} className="btn-primary">Lihat Detail</Link>
                  {role === 'admin' && <button onClick={() => handleDelete(product._id)} className="btn-danger">Hapus</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  useEffect(() => { axios.get(`https://toko-online-backend-96jc.onrender.com/api/products/${id}`).then(res => setProduct(res.data)); }, [id]);
  if (!product) return <p style={{textAlign: 'center'}}>Memuat data...</p>;
  return (
    <div className="detail-layout">
      <img src={product.imageUrl} alt={product.name} className="detail-img" />
      <div className="detail-info">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h1>
        <h2 style={{ color: '#2563eb', fontSize: '2rem', marginBottom: '1.5rem' }}>Rp {product.price.toLocaleString('id-ID')}</h2>
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <p>{product.description}</p>
        </div>
        <Link to="/products" className="btn-primary" style={{ background: '#64748b' }}>&larr; Kembali</Link>
      </div>
    </div>
  );
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://toko-online-backend-96jc.onrender.com/api/products', formData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
      toast.success('Berhasil ditambahkan!'); navigate('/products');
    } catch (err) { toast.error('Gagal menambahkan'); }
  };
  return (
    <div className="form-card large">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Tambah Produk</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nama Produk" required onChange={handleChange} style={{width:'100%', padding:'1rem', marginBottom:'1rem', borderRadius:'10px', border:'1px solid #ccc'}} />
        <input type="number" name="price" placeholder="Harga (Rp)" required onChange={handleChange} style={{width:'100%', padding:'1rem', marginBottom:'1rem', borderRadius:'10px', border:'1px solid #ccc'}} />
        <input type="url" name="imageUrl" placeholder="Link Gambar URL" required onChange={handleChange} style={{width:'100%', padding:'1rem', marginBottom:'1rem', borderRadius:'10px', border:'1px solid #ccc'}} />
        <textarea name="description" placeholder="Deskripsi" required onChange={handleChange} style={{width:'100%', padding:'1rem', marginBottom:'1rem', borderRadius:'10px', border:'1px solid #ccc'}} rows="4" />
        <button type="submit" className="btn-primary" style={{width:'100%'}}>Simpan Produk</button>
      </form>
    </div>
  );
};

// ==========================================
// 5. RENDER UTAMA
// ==========================================
export default function App() {
  return (
    <Router>
      <AutoLogout />
      <Navbar />
      <Toaster position="top-center" />
      <div className="container">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/admin/add" element={<ProtectedRoute allowedRoles={['admin']}><AddProduct /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}