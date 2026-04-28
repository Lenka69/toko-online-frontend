import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
      // Mengirim data ke Backend
      await axios.post('https://toko-online-backend-96jc.onrender.com/api/products', formData);
      toast.success('Produk berhasil ditambahkan!'); 
      navigate('/products'); 
    } catch (err) {
      toast.error('Gagal menambahkan produk');
      console.error(err);
    }
  };

  return (
    <div style={{ 
      maxWidth: '550px', 
      margin: '2rem auto', 
      background: '#ffffff', 
      padding: '2.5rem', 
      borderRadius: '20px', 
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    }}>
        <h2 style={{ 
        color: '#000000', 
        opacity: '1',
        marginBottom: '2rem', 
        textAlign: 'center', 
        fontWeight: '800', 
        fontSize: '1.8rem',
        display: 'block'
      }}>
        Tambah Produk Baru
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Nama Produk</label>
          <input 
            type="text" 
            name="name" 
            style={{ 
              width: '100%', 
              padding: '1rem', 
              border: '1px solid #cbd5e1', 
              borderRadius: '10px', 
              fontSize: '1rem', 
              color: '#000000', 
              backgroundColor: '#f8fafc' 
            }}
            required 
            placeholder="Contoh: iPhone 15 Pro Max" 
            onChange={handleChange} 
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Harga (Rp)</label>
          <input 
            type="number" 
            name="price" 
            style={{ 
              width: '100%', 
              padding: '1rem', 
              border: '1px solid #cbd5e1', 
              borderRadius: '10px', 
              fontSize: '1rem', 
              color: '#000000', 
              backgroundColor: '#f8fafc' 
            }}
            required 
            placeholder="Contoh: 20000000" 
            onChange={handleChange} 
          />
        </div>

        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Link Gambar (URL)</label>
          <input 
            type="url" 
            name="imageUrl" 
            style={{ 
              width: '100%', 
              padding: '1rem', 
              border: '1px solid #cbd5e1', 
              borderRadius: '10px', 
              fontSize: '1rem', 
              color: '#000000', 
              backgroundColor: '#f8fafc' 
            }}
            required 
            placeholder="https://images.unsplash.com/photo-xxx" 
            onChange={handleChange} 
          />
        </div>

        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Deskripsi</label>
          <textarea 
            name="description" 
            style={{ 
              width: '100%', 
              padding: '1rem', 
              border: '1px solid #cbd5e1', 
              borderRadius: '10px', 
              fontSize: '1rem', 
              color: '#000000', 
              backgroundColor: '#f8fafc' 
            }}
            rows="5" 
            required 
            placeholder="Jelaskan spesifikasi produk secara detail..." 
            onChange={handleChange}
          ></textarea>
        </div>

        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '1rem', 
            fontSize: '1.1rem', 
            marginTop: '1rem',
            borderRadius: '12px',
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            border: 'none',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          Simpan Produk Ke Database
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
