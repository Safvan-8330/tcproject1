import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, Mail, FileText, ArrowLeft, CheckCircle, Stethoscope, Scissors, Wrench, Sparkles, Dumbbell, SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { TIME_SLOTS, CATEGORIES, AppointmentCategory, getCategoryById } from "@/lib/appointments";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase"; 

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

const BookAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'category' | 'form'>('category');

  const preselectedCategory = searchParams.get('category') as AppointmentCategory | null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: undefined as Date | undefined,
    timeSlot: "",
    reason: "",
    category: preselectedCategory || ("" as AppointmentCategory),
  });

  useEffect(() => {
    if (preselectedCategory && CATEGORIES.find(c => c.id === preselectedCategory)) {
      setStep('form');
      setFormData(prev => ({ ...prev, category: preselectedCategory }));
    }
  }, [preselectedCategory]);

  const handleCategorySelect = (categoryId: AppointmentCategory) => {
    setFormData({ ...formData, category: categoryId });
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.date || !formData.timeSlot || !formData.category) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        toast({
          title: "Login Required",
          description: "You must be logged in to book an appointment.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // 2. Insert into Supabase matching your screenshot schema
      const { error } = await supabase
        .from('appointments')
        .insert([
          {
            user_id: user.id,
            date: format(formData.date, "yyyy-MM-dd"), // Matches 'date' column (type: date)
            time: formData.timeSlot,                  // Matches 'time' column (type: text)
            service: formData.category,               // Matches 'service' column (type: text)
            notes: formData.reason || null,           // Matches 'notes' column (type: text)
            status: 'pending'                         // Matches 'status' column (type: text)
          }
        ]);

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Success",
        description: "Your appointment has been booked successfully!",
      });
    } catch (error: any) {
      console.error("Database error:", error);
      toast({
        title: "Booking Error",
        description: error.message || "Failed to save appointment to the database.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = getCategoryById(formData.category);
  const SelectedIcon = formData.category ? categoryIcons[formData.category] : CalendarIcon;

  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-colorful animate-scale-in border-0">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className={`mx-auto w-16 h-16 rounded-full ${formData.category ? categoryGradients[formData.category] : 'gradient-hero'} flex items-center justify-center shadow-lg`}>
              <CheckCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Booking Submitted!</h2>
              <p className="text-muted-foreground">
                Your {selectedCategory?.name} appointment request has been received.
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-left space-y-2 border border-border/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium text-foreground">{selectedCategory?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium text-foreground">
                  {formData.date && format(formData.date, "MMMM dd, yyyy")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium text-foreground">{formData.timeSlot}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-warning">Pending</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button asChild variant="default" className="flex-1">
                <Link to="/my-appointments">View Appointments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'category') {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-8 md:py-12">
        <div className="container max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="text-center mb-10 animate-fade-in">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center shadow-colorful">
              <CalendarIcon className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Book an Appointment</h1>
            <p className="text-muted-foreground text-lg">
              Select the type of service you need
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((category, index) => {
              const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id as AppointmentCategory)}
                  className="group text-left animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative p-6 rounded-2xl bg-card shadow-soft hover:shadow-colorful transition-all duration-500 border border-border/50 overflow-hidden h-full">
                    <div className={`absolute top-0 right-0 w-32 h-32 ${categoryGradients[category.id as AppointmentCategory]} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity`} />
                    <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${categoryGradients[category.id as AppointmentCategory]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 md:py-12">
      <div className="container max-w-2xl">
        <button
          onClick={() => setStep('category')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Change Service
        </button>

        <Card className="shadow-colorful animate-slide-up border-0 overflow-hidden">
          <div className={`h-2 ${formData.category ? categoryGradients[formData.category] : 'gradient-hero'}`} />
          <CardHeader className="text-center pb-2">
            <div className={`mx-auto mb-4 w-14 h-14 rounded-2xl ${formData.category ? categoryGradients[formData.category] : 'gradient-hero'} flex items-center justify-center shadow-lg`}>
              <SelectedIcon className="h-7 w-7 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">{selectedCategory?.name} Appointment</CardTitle>
            <CardDescription>
              Fill in your details and select your preferred date and time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    Preferred Date *
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-11 justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => setFormData({ ...formData, date })}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Time Slot *
                  </label>
                  <Select
                    value={formData.timeSlot}
                    onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="reason" className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Additional Notes (Optional)
                </label>
                <Textarea
                  id="reason"
                  placeholder="Any specific requirements or notes..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="min-h-[100px] resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Booking Request"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookAppointment;