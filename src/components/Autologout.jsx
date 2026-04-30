import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const AutoLogout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timeoutId;

    // Fungsi yang akan dijalankan ketika waktu habis (User AFK/Idle)
    const handleLogout = () => {
      const token = localStorage.getItem('token');
      // Pastikan user memang sedang login sebelum melakukan logout paksa
      if (token) {
        localStorage.clear(); // Hapus data login
        toast.error('Sesi Anda berakhir karena tidak ada aktivitas.', { 
          icon: '⏱️',
          duration: 5000 
        });
        navigate('/login'); // Arahkan kembali ke halaman login
      }
    };

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(handleLogout, 1000); 
    };

    if (location.pathname === '/login') return;

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

export default AutoLogout;