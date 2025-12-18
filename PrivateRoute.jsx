// File: src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Tampilkan loading sebentar saat cek token
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  }

  // Kalau user ada, izinkan masuk. Kalau tidak, lempar ke /masuk
  return user ? children : <Navigate to="/masuk" />;
};

export default PrivateRoute;
