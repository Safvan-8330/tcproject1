import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Mail, Search, ArrowLeft, CalendarX, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Appointment, getCategoryById } from "@/lib/appointments";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
// 1. Import the Alert Dialog components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MyAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const fetchAppointments = async (searchEmail: string) => {
    setIsLoading(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', searchEmail)
        .single();

      if (profileError || !profileData) {
        setAppointments([]);
        return;
      }

      const { data, error } = await supabase
        .from('appointments')
        .select(`*, profiles (full_name, email)`)
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedAppointments: Appointment[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.profiles?.full_name || "Unknown",
        email: item.profiles?.email || searchEmail,
        date: item.date,
        timeSlot: item.time,
        category: item.service,
        reason: item.notes,
        status: item.status,
        createdAt: item.created_at,
      }));

      setAppointments(mappedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    } finally {
      setHasSearched(true);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // window.confirm is removed because the UI handles it now
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments((prev) => prev.filter((appt) => appt.id !== id));

      toast({
        title: "Success",
        description: "Appointment permanently deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete from database.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await fetchAppointments(email);
  };

  useEffect(() => {
    if (user?.email) {
      fetchAppointments(user.email);
    }
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 md:py-12">
      <div className="container max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
          <p className="text-muted-foreground">View your scheduled bookings</p>
        </div>

        <Card className="shadow-colorful mb-8 border-0">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button type="submit" variant="hero" size="lg" disabled={isLoading} className="h-12">
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {hasSearched && (
          <div className="space-y-4">
            {appointments.length > 0 ? (
              <div className="grid gap-4">
                {appointments.map((appointment) => {
                  const category = getCategoryById(appointment.category);
                  return (
                    <Card key={appointment.id} className="overflow-hidden border-0 shadow-soft">
                      <div className="flex items-center justify-between p-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg capitalize">{category?.name || appointment.category}</h3>
                            <span className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                              appointment.status === 'approved' ? "bg-green-100 text-green-700" : 
                              appointment.status === 'rejected' ? "bg-red-100 text-red-700" : 
                              "bg-yellow-100 text-yellow-700"
                            )}>
                              {appointment.status}
                            </span>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {appointment.date}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {appointment.timeSlot}</span>
                          </div>
                        </div>
                        
                        {appointment.status === "pending" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Appointment?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel your {category?.name || appointment.category} session on {appointment.date}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(appointment.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete Permanently
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Appointments Found</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;