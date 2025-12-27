import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, Shield, ArrowRight, Stethoscope, Scissors, Wrench, Sparkles, Dumbbell, SmilePlus } from "lucide-react";
import { CATEGORIES, AppointmentCategory } from "@/lib/appointments";

const categoryIcons = {
  doctor: Stethoscope,
  salon: Scissors,
  'service-centre': Wrench,
  spa: Sparkles,
  fitness: Dumbbell,
  dental: SmilePlus,
};

const categoryGradients: Record<AppointmentCategory, string> = {
  doctor: 'gradient-doctor',
  salon: 'gradient-salon',
  'service-centre': 'gradient-service',
  spa: 'gradient-spa',
  fitness: 'gradient-fitness',
  dental: 'gradient-dental',
};

const Index = () => {
  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Pick your preferred date and time slot in seconds",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Track your appointment status instantly",
      color: "bg-accent/20 text-accent",
    },
    {
      icon: CheckCircle,
      title: "Quick Approval",
      description: "Get confirmation from our team promptly",
      color: "bg-success/10 text-success",
    },
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Your information is safe and protected",
      color: "bg-warning/10 text-warning",
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
              <Sparkles className="h-4 w-4" />
              Multi-Service Appointment Platform
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight animate-slide-up">
              Book Appointments{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-warning bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Doctor visits, salon appointments, service centre bookings, and more. 
              One platform for all your scheduling needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button asChild variant="hero" size="xl">
                <Link to="/book">
                  Book Appointment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/my-appointments">
                  View My Appointments
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your <span className="text-primary">Service</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Book appointments across various service categories
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category, index) => {
              const Icon = categoryIcons[category.id];
              return (
                <Link
                  key={category.id}
                  to={`/book?category=${category.id}`}
                  className="group animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative p-6 rounded-2xl bg-card shadow-soft hover:shadow-colorful transition-all duration-500 border border-border/50 overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 ${categoryGradients[category.id]} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity`} />
                    <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${categoryGradients[category.id]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Book Now <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose <span className="text-accent">BookEase</span>?
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

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-12 shadow-colorful">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/80 mb-8 text-lg">
                Book your appointment today and experience hassle-free scheduling across all services.
              </p>
              <Button asChild size="xl" className="bg-background text-foreground hover:bg-background/90 shadow-lg">
                <Link to="/book">
                  Book Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
