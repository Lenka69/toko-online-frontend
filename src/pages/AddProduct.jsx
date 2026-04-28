import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('[https://toko-online-backend-96jc.onrender.com/api/products](https://toko-online-backend-96jc.onrender.com/api/products)', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Produk berhasil ditambahkan!', { icon: '✅' });
      navigate('/products');
    } catch (err) { toast.error('Gagal menambahkan produk'); }
  };

  return (
    <div className="form-card large">
      <h2 style={{ color: '#000000', marginBottom: '2rem', textAlign: 'center', fontWeight: '800', fontSize: '1.8rem' }}>
        Tambah Produk Baru
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Nama Produk</label>
          <input type="text" name="name" style={{ width: '100%', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '1rem', backgroundColor: '#f8fafc', color: '#000' }} required onChange={handleChange} />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Harga (Rp)</label>
          <input type="number" name="price" style={{ width: '100%', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '1rem', backgroundColor: '#f8fafc', color: '#000' }} required onChange={handleChange} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Link Gambar (URL)</label>
          <input type="url" name="imageUrl" style={{ width: '100%', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '1rem', backgroundColor: '#f8fafc', color: '#000' }} required onChange={handleChange} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>Deskripsi</label>
          <textarea name="description" style={{ width: '100%', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '1rem', backgroundColor: '#f8fafc', color: '#000' }} rows="5" required onChange={handleChange}></textarea>
        </div>

        <button type="submit" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem', borderRadius: '12px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
          Simpan Produk
        </button>
      </form>
    </div>
  );
};

export default AddProduct;