import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const base_url = "http://localhost:5000";

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        console.log("🔐 Token found, fetching user...");
        try {
          const res = await axios.get(`${base_url}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
          console.log("✅ User fetched:", res.data);
        } catch (err) {
          console.error("❌ Failed to fetch user:", err.response?.data || err.message);
          logout();
        }
      } else {
        console.log("ℹ️ No token found, user is not logged in.");
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    try {
      console.log("➡️ Logging in with credentials:", credentials);
      const res = await axios.post(`${base_url}/api/auth/login`, credentials);
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      console.log("✅ Logged in:", res.data.user);
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      console.log("📝 Registering user:", userData);
      const res = await axios.post(`${base_url}/api/auth/register`, userData);
      setUser(res.data.user);
      console.log("✅ Registered user:", res.data.user);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      console.error("❌ Registration error:", err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    console.log("🚪 Logging out...");
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
