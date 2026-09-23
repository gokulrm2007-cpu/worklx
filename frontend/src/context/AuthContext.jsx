import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('worklx_token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch current user details on mount or token change
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setUser(null);
        setWorkerProfile(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          setWorkerProfile(res.data.workerProfile || null);
          localStorage.setItem('worklx_user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.warn('Auth token expired or invalid:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('worklx_token', res.data.token);
      localStorage.setItem('worklx_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('worklx_token', res.data.token);
      localStorage.setItem('worklx_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setWorkerProfile(null);
    localStorage.removeItem('worklx_token');
    localStorage.removeItem('worklx_user');
  };

  const updateProfileState = (updatedUser, updatedProfile = null) => {
    setUser(updatedUser);
    if (updatedProfile) setWorkerProfile(updatedProfile);
    localStorage.setItem('worklx_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workerProfile,
        token,
        loading,
        login,
        register,
        logout,
        updateProfileState,
        isAuthenticated: !!token && !!user,
        isSeeker: user?.role === 'SEEKER',
        isWorker: user?.role === 'WORKER',
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
