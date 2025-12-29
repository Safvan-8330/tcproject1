import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase"; // Import the client you created

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  // Supabase uses 'email' and 'id' primarily, but we keep your 'username' for the UI
  user: { username: string; email?: string; role?: string; id?: string } | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  registerAdmin: (username: string, email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean; // Added to prevent redirect loops while checking session
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
  const [user, setUser] = useState<{ username: string; email?: string; role?: string; id?: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for active session on load
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        handleUserSession(session.user);
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleUserSession(session.user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper to fetch roles and set user state
  const handleUserSession = async (supabaseUser: any) => {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', supabaseUser.id)
      .single();

    const userData = {
      id: supabaseUser.id,
      email: supabaseUser.email,
      username: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0],
      role: roleData?.role || 'user'
    };

    setUser(userData);
    setIsAuthenticated(true);
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    // --- FIX APPLIED HERE ---
    // Manually await the session update so state is ready before navigation happens
    if (data.session) {
      await handleUserSession(data.session.user);
    }
    // ----------------------

    return { success: true };
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: username, // This stores the username in Supabase metadata
        }
      }
    });

    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Please check your email to confirm registration.",
    });
    return true;
  };

  const registerAdmin = async (username: string, email: string, password: string): Promise<boolean> => {
    // Note: Admin role usually needs manual approval in Supabase dashboard for security
    return register(username, email, password);
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};