import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Home from "./index.tsx";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect based on authentication status
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // If user is authenticated, show the home page
  if (isAuthenticated) {
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