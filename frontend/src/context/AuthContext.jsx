import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rcorp_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('rcorp_access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem('rcorp_access_token');
      if (savedToken) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          localStorage.setItem('rcorp_user', JSON.stringify(profile));
        } catch (err) {
          console.error("Token verification failed:", err);
          logout();
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  const saveAuthData = (data) => {
    localStorage.setItem('rcorp_access_token', data.tokens.access);
    localStorage.setItem('rcorp_refresh_token', data.tokens.refresh);
    localStorage.setItem('rcorp_user', JSON.stringify(data.user));
    setToken(data.tokens.access);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    saveAuthData(data);
    return data;
  };

  const googleLogin = async (payload) => {
    const data = await authService.googleLogin(payload);
    saveAuthData(data);
    return data;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    saveAuthData(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('rcorp_access_token');
    localStorage.removeItem('rcorp_refresh_token');
    localStorage.removeItem('rcorp_user');
    setToken(null);
    setUser(null);
  };

  const quickLoginAs = async (roleType) => {
    const roleEmails = {
      super_admin: 'superadmin@rcorporation.com',
      admin: 'admin@rcorporation.com',
      support_agent: 'agent@rcorporation.com',
      customer: 'customer@rcorporation.com',
    };
    const email = roleEmails[roleType] || 'customer@rcorporation.com';
    return await login(email, 'Password123!');
  };

  const value = {
    user,
    token,
    role: user?.role || 'guest',
    isAuthenticated: !!token && !!user,
    isAgent: ['support_agent', 'admin', 'super_admin'].includes(user?.role),
    isAdmin: ['admin', 'super_admin'].includes(user?.role),
    isSuperAdmin: user?.role === 'super_admin',
    loading,
    login,
    googleLogin,
    register,
    logout,
    quickLoginAs,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
