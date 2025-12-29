import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, ArrowLeft, AlertCircle, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Define the shape of an appointment object based on your schema
interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  status: string;
  notes?: string;
  created_at: string;
}

const MyAppointments = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check authentication and redirect if needed
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }

    // 2. Fetch appointments automatically if user exists
    const fetchAppointments = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id) // Filter by logged-in user's ID
          .order('date', { ascending: true }); // Sort by upcoming dates

        if (error) throw error;

        setAppointments(data || []);
      } catch (error: any) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to load your appointments. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user, isAuthenticated, authLoading, navigate, toast]);

  // Helper to color-code statuses
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200';
      case 'cancelled': return 'bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200';
      case 'completed': return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200';
      default: return 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-200'; // Pending
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 md:py-12 bg-muted/30">
      <div className="container max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
            <p className="text-muted-foreground mt-1">
              Manage and view your upcoming services
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          /* Empty State */
          <Card className="border-dashed border-2 bg-transparent shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <CalendarIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No appointments yet</h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                You haven't booked any services yet. Browse our services to get started.
              </p>
              <Button asChild>
                <Link to="/book-appointment">Book Now</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Appointments List */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-3 bg-muted/30 border-b">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg font-semibold capitalize">
                      {appointment.service}
                    </CardTitle>
                    <Badge variant="outline" className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Booked on {format(new Date(appointment.created_at), "MMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Date</p>
                      <p className="font-medium">
                        {format(new Date(appointment.date), "EEEE, MMMM do, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Time</p>
                      <p className="font-medium">{appointment.time}</p>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="flex items-start gap-3 text-sm pt-2 border-t mt-2">
                      <div className="p-2 bg-muted rounded-lg text-muted-foreground mt-0.5">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Notes</p>
                        <p className="text-muted-foreground italic line-clamp-2">
                          "{appointment.notes}"
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="bg-muted/10 border-t pt-3 pb-3">
                  <Button variant="ghost" className="w-full text-xs h-8 text-muted-foreground hover:text-primary">
                    <AlertCircle className="mr-2 h-3 w-3" />
                    Need to reschedule?
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;