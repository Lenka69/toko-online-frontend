import { Link, useNavigate, MemoryRouter, useInRouterContext } from 'react-router-dom';

const NavbarContent = () => {
  const navigate = useNavigate();
  // Mengambil status login dari memori browser
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    // Menghapus semua data sesi pengguna dari browser
    localStorage.clear();
    // Melempar kembali ke halaman login
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span style={{ fontSize: '1.8rem' }}>⚡️</span> TokoTech
      </Link>
      
      <ul className="nav-links">
        {/* Jika pengguna sudah login (punya token), tampilkan menu */}
        {token ? (
          <>
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/products">Katalog</Link></li>
            
            {/* Tombol Tambah Barang HANYA muncul untuk Admin */}
            {role === 'admin' && (
              <li><Link to="/admin/add" className="btn-nav-add">Tambah Barang</Link></li>
            )}
            
            <li>
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: '#ef4444', 
                  fontWeight: '700', 
                  fontSize: '0.95rem',
                  cursor: 'pointer' 
                }}
              >
                Keluar
              </button>
            </li>
          </>
        ) : (
          /* Jika pengguna belum login, hanya tampilkan tombol Login */
          <li><Link to="/login" style={{ color: '#4f46e5', fontWeight: '700' }}>Masuk / Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

// Komponen utama yang diekspor
const Navbar = () => {
  // Mengecek apakah komponen ini dipanggil di dalam konteks Router
  const inRouter = useInRouterContext();

  if (!inRouter) {
    return (
      <MemoryRouter>
        <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          <NavbarContent />
        </div>
      </MemoryRouter>
    );
  }

  return <NavbarContent />;
};

export default Navbar;