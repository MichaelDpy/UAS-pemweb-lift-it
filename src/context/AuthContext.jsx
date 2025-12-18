import React, { createContext, useState, useContext, useEffect } from 'react';
import auth from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('liftit_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth from localStorage
    const savedUser = localStorage.getItem('liftit_current_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        auth.currentUser = parsedUser;
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('liftit_current_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const result = auth.login(email, password);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('liftit_current_user', JSON.stringify(result.user));
    }
    return result;
  };

  const register = (userData) => {
    const result = auth.register(userData);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('liftit_current_user', JSON.stringify(result.user));
    }
    return result;
  };

  const logout = () => {
    const result = auth.logout();
    if (result.success) {
      setUser(null);
      localStorage.removeItem('liftit_current_user');
    }
    return result;
  };

  const updateUser = (userId, newData) => {
    const success = auth.updateUserData(userId, newData);
    if (success && auth.currentUser) {
      setUser(auth.currentUser);
      localStorage.setItem('liftit_current_user', JSON.stringify(auth.currentUser));
    }
    return success;
  };

  // Tambahkan fungsi refresh
  const refreshUserData = () => {
    if (user?.id) {
      const freshUser = auth.getUserById(user.id);
      if (freshUser) {
        setUser(freshUser);
        auth.currentUser = freshUser;
        localStorage.setItem('liftit_current_user', JSON.stringify(freshUser));
        return true;
      }
    }
    return false;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    refreshUserData, // <-- Tambahkan ini
    isLoggedIn: auth.isLoggedIn,
    getCurrentUser: auth.getCurrentUser,
    getUserById: auth.getUserById
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};