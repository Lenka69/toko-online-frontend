import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // Jika tidak punya token, lempar ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika punya token, tapi rolenya tidak termasuk di yang diizinkan (bukan admin)
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />; // Lempar ke beranda biasa
  }

  return children;
};

export default ProtectedRoute;