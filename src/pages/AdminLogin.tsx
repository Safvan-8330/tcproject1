import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { registerAdmin, login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For admin login, we'll use the regular login method
      // In a real app, you might have different logic for admin authentication
      const result = await login(username, password);
      
      if (result.success) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${username}!`,
        });
        
        // Redirect to admin dashboard after successful login
        navigate("/admin");
      } else {
        throw new Error(result.error || "Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (password.length < 6) {
      toast({
        title: "Registration Failed",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Check if admin key is correct
    if (adminKey !== "admin-register-key") {
      toast({
        title: "Registration Failed",
        description: "Invalid admin registration key.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const success = await registerAdmin(username, email, password);
      
      if (success) {
        toast({
          title: "Admin Registration Successful",
          description: `Welcome, ${username}! You have registered as an admin.`,
        });
        
        // Switch to login mode after successful registration
        setIsRegisterMode(false);
        toast({
          title: "Registration Successful",
          description: `Admin account created successfully. You can now login.`,
        });
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isRegisterMode ? "Admin Registration" : "Admin Login"}
          </CardTitle>
          <CardDescription>
            {isRegisterMode 
              ? "Register as an admin with your credentials" 
              : "Access your admin account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isRegisterMode ? handleAdminRegister : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {isRegisterMode && (
              <>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="adminKey" className="text-sm font-medium">Admin Registration Key</label>
                  <Input
                    id="adminKey"
                    type="password"
                    placeholder="Enter admin registration key"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact system administrator for the admin registration key
                  </p>
                </div>
              </>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? (isRegisterMode ? "Creating Admin Account..." : "Signing in...") 
                : (isRegisterMode ? "Create Admin Account" : "Sign In")}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isRegisterMode ? (
              <>
                Already have an admin account?{" "}
                <button 
                  type="button" 
                  onClick={() => setIsRegisterMode(false)}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an admin account?{" "}
                <button 
                  type="button" 
                  onClick={() => setIsRegisterMode(true)}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Register
                </button>
              </>
            )}
          </div>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <Link to="/" className="underline underline-offset-4 hover:text-primary">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;