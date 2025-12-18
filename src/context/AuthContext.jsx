import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL Backend yang sudah diperbarui
  const API_URL = 'https://backend-lift-it.vercel.app/api/auth';

  // Cek apakah ada user login saat aplikasi pertama dibuka
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Fungsi Login
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Login gagal');
      }

      // Simpan data ke browser
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      return { success: true };
    } catch (error) {
      // Kita pakai 'message' agar sesuai dengan yang dibaca di Masuk.jsx
      return { success: false, message: error.message };
    }
  };

  // Fungsi Register (Diupdate agar bisa terima Object formData)
  const register = async (arg1, arg2, arg3) => {
    let username, email, password;

    // Cek apakah inputnya object (dari form Daftar.jsx) atau terpisah
    if (typeof arg1 === 'object' && arg1 !== null) {
      username = arg1.nama; 
      email = arg1.email;
      password = arg1.password;
    } else {
      username = arg1;
      email = arg2;
      password = arg3;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Registrasi gagal');
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Fungsi Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
