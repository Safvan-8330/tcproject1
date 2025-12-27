import { Link, useLocation } from "react-router-dom";
import { Calendar, LayoutDashboard, ListChecks, Sparkles, LogIn, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  
  // Hide navigation items on login and register pages
  const hideNavItems = ["/login", "/register", "/admin-register"].includes(location.pathname);

  // Different navigation items based on user role
  const navItems = [];

  if (isAdmin) {
    // Admin users only see the admin dashboard
    navItems.push({ path: "/admin", label: "Admin", icon: LayoutDashboard });
  } else {
    // Regular users see home and appointments
    navItems.push({ path: "/", label: "Home", icon: Calendar });
    navItems.push({ path: "/my-appointments", label: "My Appointments", icon: ListChecks });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero shadow-lg group-hover:shadow-colorful transition-shadow duration-300">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-warning bg-clip-text text-transparent">
            BookEase
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {!hideNavItems && navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "gradient-hero text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
          
          {!hideNavItems && isAuthenticated ? (
            <div className="flex items-center gap-2 ml-2">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-foreground">
                <User className="h-4 w-4 mr-1" />
                {user?.username}
                {isAdmin && (
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-destructive text-destructive-foreground">
                    ADMIN
                  </span>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="px-4"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : !hideNavItems ? (
            <div className="flex gap-2 ml-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <LogIn className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Header;
