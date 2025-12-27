import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: { username: string; email?: string; role?: string } | null;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  registerAdmin: (username: string, email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<{ username: string; email?: string; role?: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<LoginResult> => {
    // In a real app, you would send credentials to your backend
    // For this demo, we'll check if user exists in localStorage
    if (username && password) {
      // Retrieve the user from localStorage to preserve role info
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.username === username) {
            // User exists, set the user data
            setUser(parsedUser);
            setIsAuthenticated(true);
            return { success: true };
          }
        } catch (error) {
          console.error("Error parsing stored user:", error);
        }
      }
      // If user not found or parsing failed
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: "Invalid username or password" };
    }
    return { success: false, error: "Username and password are required" };
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // In a real app, you would send registration data to your backend
    // For this demo, we'll just store the user data
    if (username && email && password) {
      const userData = { username, email };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser({ username, email });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const registerAdmin = async (username: string, email: string, password: string): Promise<boolean> => {
    // In a real app, you would send registration data to your backend
    // For this demo, we'll just store the user data with admin role
    if (username && email && password) {
      const userData = { username, email, role: 'admin' };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser({ username, email, role: 'admin' });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };


  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const value = {
    user,
    login,
    logout,
    register,
    registerAdmin,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};