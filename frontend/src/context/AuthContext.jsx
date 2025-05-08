import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5001';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Login (Matches FR01.2)
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/login', { email, password });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Login failed');
    }
  };

  // Registration (Matches FR01.1)
  const register = async (username, email, password) => {
    try {
      await axios.post('/api/register', { username, email, password });
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Registration failed');
    }
  };

  // Logout (Matches FR01.3)
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Check auth status on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.log('🚫 No token found — skipping auth check');
        setUser(null);
        setLoading(false);
        return;
      }
  
      try {
        const res = await axios.get('http://localhost:5001/api/check-auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('🔐 Token:', req.headers.authorization);
        console.log('✅ User authenticated:', res.data.user);
        setUser(res.data.user);
      } catch (err) {
        console.error('❌ Auth check failed:', err.response?.data || err.message || err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);