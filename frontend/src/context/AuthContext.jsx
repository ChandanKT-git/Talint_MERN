import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        setUser(response.data);
        setIsSignedIn(true);
      } catch (error) {
        setUser(null);
        setIsSignedIn(false);
      } finally {
        setIsLoaded(true);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      setUser(response.data);
      setIsSignedIn(true);
      toast.success("Logged in successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axiosInstance.post("/auth/register", { name, email, password });
      setUser(response.data);
      setIsSignedIn(true);
      toast.success("Registered successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
      return false;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      setIsSignedIn(false);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoaded, isSignedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
