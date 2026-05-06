import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const tokens = localStorage.getItem("tokens");
      if (tokens && !user) {
        authService
          .getProfile()
          .then((data) => {
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
          })
          .catch(() => {
            localStorage.removeItem("tokens");
            localStorage.removeItem("user");
            setUser(null);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } catch {
      localStorage.removeItem("tokens");
      localStorage.removeItem("user");
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem("tokens", JSON.stringify(data.tokens));
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await authService.register(userData);
    localStorage.setItem("tokens", JSON.stringify(data.tokens));
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isVendor: user?.role?.toLowerCase() === "vendor",
    isAdmin: user?.role?.toLowerCase() === "admin",
    isCustomer: user?.role?.toLowerCase() === "customer",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
