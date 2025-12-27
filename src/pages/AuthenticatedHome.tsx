import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, MapPin } from "lucide-react";

const AuthenticatedHome = () => {
  const { user, isAdmin } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Schedule appointments with just a few clicks",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Manage your schedule efficiently",
      color: "bg-success/10 text-success",
    },
    {
      icon: MapPin,
      title: "Location Based",
      description: "Find services near you",
      color: "bg-warning/10 text-warning",
    },
    {
      icon: Users,
      title: "Team Coordination",
      description: "Collaborate with team members",
      color: "bg-destructive/10 text-destructive",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-40 left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-10 left-1/2 w-96 h-96 bg-warning/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "0.5s" }} />
        
        <div className="container relative py-16 md:py-28">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full gradient-hero px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-colorful animate-fade-in">
              <span>Welcome, {user?.username}!</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight animate-slide-up">
              Book <span className="text-primary">Appointments</span> Effortlessly
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Connect with service providers and manage your schedule in one place. 
              Simple, fast, and reliable appointment booking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/book">
                <Button size="lg" className="h-12 px-8 text-base">
                  Book Appointment
                </Button>
              </Link>
              <Link to="/my-appointments">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  View Appointments
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose <span className="text-primary">BookEase</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A seamless booking experience designed with you in mind
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl bg-card shadow-soft hover:shadow-card transition-all duration-300 animate-slide-up border border-border/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Admin CTA Section */}
      {isAdmin && (
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Admin Dashboard
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Manage appointments and system settings
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/admin">
                  <Button size="lg" className="h-12 px-8 text-base">
                    Access Admin Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who manage their appointments with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book">
                <Button size="lg" className="h-12 px-8 text-base">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthenticatedHome;