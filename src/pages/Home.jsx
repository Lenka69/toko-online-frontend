import { Link } from 'react-router-dom';

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

export default Home;
