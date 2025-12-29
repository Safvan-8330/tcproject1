import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom"; // 1. Import Navigate
import { useAuth } from "@/contexts/AuthContext";
import Home from "./index.tsx";

const LandingPage = () => {
  const navigate = useNavigate();
  // 2. Destructure isAdmin from useAuth
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    // Redirect based on authentication status
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // If user is authenticated...
  if (isAuthenticated) {
    // 3. NEW CHECK: If they are an admin, redirect to Admin Dashboard
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    
    // Otherwise, show the regular Home page
    return <Home />;
  }

  // If not authenticated, they will be redirected by the useEffect
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default LandingPage;