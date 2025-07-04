import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login (Matches FR01.2)
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/login', { email, password });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
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
      try {
        const res = await axios.get('/api/check-auth');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
      setLoading(false);
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