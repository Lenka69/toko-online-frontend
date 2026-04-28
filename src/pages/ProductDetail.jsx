import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

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
    <div className="detail-layout">
      <img src={product.imageUrl} alt={product.name} className="detail-img" />
      <div className="detail-info">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>{product.name}</h1>
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
