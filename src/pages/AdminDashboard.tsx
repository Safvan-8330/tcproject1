import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, ArrowLeft, Calendar, Users, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCard from "@/components/AppointmentCard";
import { getAppointments, updateAppointmentStatus, Appointment, CATEGORIES, AppointmentCategory } from "@/lib/appointments";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "admin123";

const categoryColors: Record<AppointmentCategory, string> = {
  doctor: 'bg-doctor/10 text-doctor',
  salon: 'bg-salon/10 text-salon',
  'service-centre': 'bg-service/10 text-service',
  spa: 'bg-spa/10 text-spa',
  fitness: 'bg-fitness/10 text-fitness',
  dental: 'bg-dental/10 text-dental',
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    }
  }, [isAuthenticated]);

  const loadAppointments = () => {
    const all = getAppointments().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setAppointments(all);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Welcome, Admin!",
        description: "You are now logged in to the dashboard.",
      });
    } else {
      toast({
        title: "Invalid Password",
        description: "Please enter the correct admin password.",
        variant: "destructive",
      });
    }
  };

  const handleApprove = (id: string) => {
    updateAppointmentStatus(id, "approved");
    loadAppointments();
    toast({
      title: "Appointment Approved",
      description: "The appointment has been approved successfully.",
    });
  };

  const handleReject = (id: string) => {
    updateAppointmentStatus(id, "rejected");
    loadAppointments();
    toast({
      title: "Appointment Rejected",
      description: "The appointment has been rejected.",
    });
  };

  const filteredAppointments = appointments.filter((apt) => {
    const statusMatch = activeTab === "all" || apt.status === activeTab;
    const categoryMatch = categoryFilter === "all" || apt.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    approved: appointments.filter((a) => a.status === "approved").length,
    rejected: appointments.filter((a) => a.status === "rejected").length,
  };

  const categoryStats = CATEGORIES.map(cat => ({
    ...cat,
    count: appointments.filter(a => a.category === cat.id).length,
  }));

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-colorful animate-scale-in border-0">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center shadow-lg">
              <LayoutDashboard className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <CardDescription>
              Enter the admin password to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Hint: admin123
                </p>
              </div>
              <Button type="submit" variant="hero" className="w-full">
                Login to Dashboard
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="inline h-4 w-4 mr-1" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 md:py-12">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all appointment requests</p>
          </div>
          <Button variant="outline" onClick={loadAppointments} className="self-start sm:self-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-soft border-0 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-0 bg-gradient-to-br from-warning/5 to-warning/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-0 bg-gradient-to-br from-success/5 to-success/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-0 bg-gradient-to-br from-destructive/5 to-destructive/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {categoryStats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(categoryFilter === cat.id ? "all" : cat.id)}
              className={`p-3 rounded-xl text-center transition-all ${
                categoryFilter === cat.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:shadow-md'
              } ${categoryColors[cat.id]} border border-border/50`}
            >
              <p className="text-lg font-bold">{cat.count}</p>
              <p className="text-xs font-medium truncate">{cat.name}</p>
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <Card className="shadow-colorful border-0">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Review and manage appointment requests</CardDescription>
              </div>
              {categoryFilter !== "all" && (
                <Button variant="ghost" size="sm" onClick={() => setCategoryFilter("all")}>
                  Clear filter
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 bg-muted/50">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {filteredAppointments.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredAppointments.map((appointment, index) => (
                      <div
                        key={appointment.id}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <AppointmentCard
                          appointment={appointment}
                          isAdmin
                          onApprove={handleApprove}
                          onReject={handleReject}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Appointments
                    </h3>
                    <p className="text-muted-foreground">
                      {activeTab === "all" && categoryFilter === "all"
                        ? "No appointments have been booked yet."
                        : `No matching appointments found.`}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
