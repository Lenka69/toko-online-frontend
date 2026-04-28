import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`https://toko-online-backend-96jc.onrender.com${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p style={{textAlign: 'center', marginTop: '3rem'}}>Memuat data produk...</p>;

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', display: 'flex', gap: '3rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', flexWrap: 'wrap' }}>
      <img src={product.imageUrl} alt={product.name} style={{ width: '400px', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
      <div style={{ flex: 1 }}>
        <h1 style={{ color: '#000000', fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h1>
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

export default ProductDetail;
