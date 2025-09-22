// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");
    if (token && (email || username)) {
      setUser({ email, username });
    }
    setBooting(false);
  }, []);

  useEffect(() => {
    if (booting) return;
    const token = localStorage.getItem("token");
    const publicRoutes = ["/login", "/signup", "/"];
    if (!token && !publicRoutes.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [booting, location.pathname, navigate]);

  const login = ({ token, email, username }) => {
    localStorage.setItem("token", token);
    if (email) localStorage.setItem("email", email);
    if (username) localStorage.setItem("username", username);
    setUser({ email, username });
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, booting }}>
      {children}
    </AuthContext.Provider>
  );
};
