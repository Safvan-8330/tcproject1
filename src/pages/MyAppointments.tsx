import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Mail, Search, ArrowLeft, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AppointmentCard from "@/components/AppointmentCard";
import { getAppointmentsByEmail, Appointment } from "@/lib/appointments";

const MyAppointments = () => {
  const [email, setEmail] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const results = getAppointmentsByEmail(email);
    setAppointments(results.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    setHasSearched(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 md:py-12">
      <div className="container max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-8 animate-fade-in">
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center shadow-colorful">
            <Calendar className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Appointments</h1>
          <p className="text-muted-foreground text-lg">
            Enter your email to view all your bookings
          </p>
        </div>

        <Card className="shadow-colorful mb-8 animate-slide-up border-0">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 space-y-2">
                <label htmlFor="search-email" className="sr-only">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search-email"
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <Button type="submit" variant="hero" size="lg" disabled={isLoading} className="h-12">
                {isLoading ? (
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {hasSearched && (
          <div className="space-y-4">
            {appointments.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    Your Appointments <span className="text-primary">({appointments.length})</span>
                  </h2>
                </div>
                <div className="grid gap-4">
                  {appointments.map((appointment, index) => (
                    <div
                      key={appointment.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <AppointmentCard appointment={appointment} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <Card className="shadow-soft animate-scale-in border-0">
                <CardContent className="py-12 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <CalendarX className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Appointments Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any appointments for this email address.
                  </p>
                  <Button asChild variant="hero">
                    <Link to="/book">Book Your First Appointment</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="text-center py-12 animate-fade-in">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-warning/20 flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-lg">
              Enter your email address above to view your appointments
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
