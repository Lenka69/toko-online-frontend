import Register from './pages/Register';
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import AutoLogout from './components/AutoLogout';

// --- Komponen-komponen ---
// 1. ProtectedRoute
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 2. Navbar
const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span style={{ fontSize: '1.8rem' }}>⚡️</span> TokoTech
      </Link>
      
      <ul className="nav-links">
        {token ? (
          <>
            <li><Link to="/" style={{ color: '#000000', fontWeight: '700' }}>Beranda</Link></li>
            <li><Link to="/products" style={{ color: '#000000', fontWeight: '700' }}>Katalog</Link></li>
            {role === 'admin' && (
              <li><Link to="/admin/add" style={{ color: '#aeaaaa', fontWeight: '900', fontSize: '0.95rem' }}className="btn-nav-add">Tambah Barang</Link></li>
            )}
            <li>
              <button 
                onClick={handleLogout} 
                style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}
              >
                Keluar
              </button>
            </li>
          </>
        ) : (
          <li><Link to="/login" style={{ color: '#4f46e5', fontWeight: '700' }}>Masuk / Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

// 3. Home
const Home = () => {
  return (
    <div className="hero-section">
      <h1 className="hero-title">
        Gadget Impian, <br />
        <span style={{ color: 'var(--primary)' }}>Kini di Genggaman.</span>
      </h1>
      <p className="hero-subtitle">
        Temukan koleksi laptop, smartphone, dan aksesori teknologi terbaru dengan harga terbaik dan kualitas terjamin.
      </p>
      <Link to="/products" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
        Jelajahi Produk &rarr;
      </Link>
    </div>
  );
};

// 4. ProductList
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const role = localStorage.getItem('role');

  const fetchProducts = () => {
    setIsLoading(true);
    axios.get('https://toko-online-backend-96jc.onrender.com/api/products')
      .then(res => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://toko-online-backend-96jc.onrender.com/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Berhasil dihapus!', { icon: '🗑️' });
        fetchProducts(); 
      } catch (error) {
        toast.error('Gagal menghapus produk');
      }
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="search-container">
        <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Katalog Produk</h2>
        <input 
          type="text" 
          placeholder="Cari gadget kesukaanmu..." 
          className="search-bar"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>Memuat produk... ⏳</h3>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'white', borderRadius: '16px' }}>
          <span style={{ fontSize: '4rem' }}>📭</span>
          <h3 style={{ marginTop: '1rem' }}>Produk tidak ditemukan</h3>
          <p style={{ color: 'var(--text-muted)' }}>Coba cari dengan kata kunci lain.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="image-container">
                <img src={product.imageUrl} alt={product.name} />
              </div>
              <div className="card-content">
                <h3>{product.name}</h3>
                <p className="price-tag">Rp {product.price.toLocaleString('id-ID')}</p>
                <div className="card-actions">
                  <Link to={`/products/${product._id}`} className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Lihat Detail</Link>
                  {role === 'admin' && (
                    <button onClick={() => handleDelete(product._id)} className="btn-danger">Hapus</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 5. ProductDetail
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`https://toko-online-backend-96jc.onrender.com/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p style={{textAlign: 'center', marginTop: '3rem'}}>Memuat data produk...</p>;

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', display: 'flex', gap: '3rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', flexWrap: 'wrap' }}>
      <img src={product.imageUrl} alt={product.name} style={{ width: '400px', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h1>
        <h2 style={{ color: '#2563eb', fontSize: '2rem', marginBottom: '1.5rem' }}>Rp {product.price.toLocaleString('id-ID')}</h2>
        
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Deskripsi Produk:</h3>
          <p style={{ lineHeight: '1.6', color: '#475569' }}>{product.description}</p>
        </div>

        <Link to="/products" className="btn-primary" style={{ background: '#64748b' }}>
          &larr; Kembali ke Katalog
        </Link>
      </div>
    </div>
  );
};

// 6. AddProduct
const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://toko-online-backend-96jc.onrender.com/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Produk berhasil ditambahkan!', { icon: '✅' });
      navigate('/products');
    } catch (err) {
      toast.error('Gagal menambahkan produk');
      console.error(err);
    }
  };

  return (
    <div style={{ 
      maxWidth: '550px', margin: '2rem auto', background: '#ffffff', padding: '2.5rem', 
      borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' 
    }}>
      <h2 style={{ color: '#000000', opacity: '1', marginBottom: '2rem', textAlign: 'center', fontWeight: '800', fontSize: '1.8rem' }}>
        Tambah Produk Baru
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Nama Produk</label>
          <input 
            type="text" name="name" 
            style={{ width: '100%', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '1rem', color: '#000000', backgroundColor: '#f8fafc' }}
            required placeholder="Contoh: iPhone 15 Pro Max" onChange={handleChange} 
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Harga (Rp)</label>
          <input 
            type="number" name="price" 
            style={{ width: '100%', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '1rem', color: '#000000', backgroundColor: '#f8fafc' }}
            required placeholder="Contoh: 20000000" onChange={handleChange} 
          />
        </div>

        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Link Gambar (URL)</label>
          <input 
            type="url" name="imageUrl" 
            style={{ width: '100%', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '1rem', color: '#000000', backgroundColor: '#f8fafc' }}
            required placeholder="https://images.unsplash.com/photo-xxx" onChange={handleChange} 
          />
        </div>

        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Deskripsi</label>
          <textarea 
            name="description" 
            style={{ width: '100%', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '1rem', color: '#000000', backgroundColor: '#f8fafc' }}
            rows="5" required placeholder="Jelaskan spesifikasi produk secara detail..." onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem', borderRadius: '12px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
          Simpan Produk
        </button>
      </form>
    </div>
  );
};

// 7. Login
const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://toko-online-backend-96jc.onrender.com/api/auth/login', credentials);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role); 
      localStorage.setItem('username', res.data.username);
      
      toast.success(`Selamat datang, ${res.data.username}!`);
      
      if (res.data.role === 'admin') {
        navigate('/admin/add');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal login!');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2.5rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#0f172a', fontWeight: '800' }}>Masuk ke Akun</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Username</label>
            <input 
            type="text" placeholder="Masukkan username Anda" 
            style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#000000', backgroundColor: '#f8fafc' }}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
            />
        </div>
        <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Password</label>
            <input 
            type="password" placeholder="Masukkan password Anda" 
            style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#000000', backgroundColor: '#f8fafc' }}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
            />
        </div>
        <button type="submit" style={{ width: '100%', padding: '1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            Login
        </button>
      </form>
    </div>
  );
};

// --- Komponen Utama (App) ---
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

          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/products" element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          } />
          
          <Route path="/products/:id" element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/add" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddProduct />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}