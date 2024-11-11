import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, LoginCredentials, AuthContextType } from "../types/auth";
import { mockApi } from "../api/mockApi";

export const AuthContext = createContext<AuthContextType | null>(null);

const REDIRECT_KEY = "auth_redirect_path";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const saveRequestedPath = useCallback(() => {
    const currentPath = location.pathname + location.search + location.hash;
    if (currentPath !== "/login") {
      sessionStorage.setItem(REDIRECT_KEY, currentPath);
    }
  }, [location]);

  const redirectToSavedPath = useCallback(() => {
    const savedPath = sessionStorage.getItem(REDIRECT_KEY);
    sessionStorage.removeItem(REDIRECT_KEY);
    navigate(savedPath || "/dashboard");
  }, [navigate]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      try {
        setLoading(true);
        const { user, token } = await mockApi.login(credentials);
        localStorage.setItem("token", token);
        setUser(user);
        redirectToSavedPath();
        return true;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [redirectToSavedPath]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    sessionStorage.removeItem(REDIRECT_KEY);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return false;
      }

      const { user } = await mockApi.verifyToken(token);
      setUser(user);
      return true;
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial authentication check
  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setInitialized(true);
    };

    initializeAuth();
  }, [checkAuth]);

  // Provide both loading and initialized status to determine if the app is ready
  const value: AuthContextType = {
    user,
    loading,
    initialized,
    login,
    logout,
    checkAuth,
    saveRequestedPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
