import { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/auth/profile');
      // Ensure user is admin, otherwise logout
      if (data.role !== 'admin') {
        logout();
        return;
      }
      setUser(data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    if (data.role !== 'admin') {
      throw new Error('Not authorized as admin');
    }
    localStorage.setItem('token', data.token);
    setUser(data);
    navigate('/admin');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};