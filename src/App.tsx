import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/layout/Header";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/index.tsx";
import AuthenticatedHome from "./pages/AuthenticatedHome";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminRegister from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

// --- NEW CODE START ---
import { useEffect } from "react";
import { supabase } from "./lib/supabase"; // Ensure this matches your file path
import { toast } from "sonner";

const SupabaseConnectionCheck = () => {
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('id').limit(1);
        if (error) {
          console.error("Supabase Connection Error:", error.message);
          toast.error("Database connection failed: " + error.message);
        } else {
          console.log("Supabase Connected Successfully!");
          toast.success("Connected to your custom Supabase backend");
        }
      } catch (err) {
        console.error("Check failed:", err);
      }
    };
    checkConnection();
  }, []);
  return null; // This component doesn't render anything UI-wise
};
// --- NEW CODE END ---

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster position="top-right" richColors />
    {/* 1. BrowserRouter must be the top-level wrapper here */}
    <BrowserRouter>
      {/* 2. AuthProvider is now INSIDE the router, so useNavigate() will work */}
      <AuthProvider>
        {/* --- ADDED TEST COMPONENT HERE --- */}
        <SupabaseConnectionCheck /> 
        
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/book" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
              <Route path="/my-appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-register" element={<AdminRegister />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;