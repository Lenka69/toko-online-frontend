import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
        await axios.delete(`https://toko-online-backend-96jc.onrender.com/api/products/${id}`);
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
                  <button onClick={() => handleDelete(product._id)} className="btn-danger">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
