import { Appointment, getCategoryById, AppointmentCategory } from "@/lib/appointments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Clock, Mail, User, FileText, Check, X, Stethoscope, Scissors, Wrench, Sparkles, Dumbbell, SmilePlus } from "lucide-react";
import { format } from "date-fns";

const categoryIcons: Record<AppointmentCategory, typeof Stethoscope> = {
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

const categoryColors: Record<AppointmentCategory, string> = {
  doctor: 'bg-doctor/10 text-doctor border-doctor/20',
  salon: 'bg-salon/10 text-salon border-salon/20',
  'service-centre': 'bg-service/10 text-service border-service/20',
  spa: 'bg-spa/10 text-spa border-spa/20',
  fitness: 'bg-fitness/10 text-fitness border-fitness/20',
  dental: 'bg-dental/10 text-dental border-dental/20',
};

interface AppointmentCardProps {
  appointment: Appointment;
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const AppointmentCard = ({
  appointment,
  isAdmin = false,
  onApprove,
  onReject,
}: AppointmentCardProps) => {
  const statusVariant = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
  } as const;

  const category = getCategoryById(appointment.category);
  const CategoryIcon = categoryIcons[appointment.category] || Calendar;

  return (
    <Card className="shadow-card hover:shadow-colorful transition-all duration-300 animate-scale-in overflow-hidden border-0">
      <div className={`h-1.5 ${categoryGradients[appointment.category]}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${categoryGradients[appointment.category]} shadow-md`}>
              <CategoryIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{appointment.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                {appointment.email}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant={statusVariant[appointment.status]}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Badge>
            {category && (
              <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[appointment.category]}`}>
                {category.name}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-foreground">
              {format(new Date(appointment.date), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-accent" />
            <span className="text-foreground">{appointment.timeSlot}</span>
          </div>
        </div>

        {appointment.reason && (
          <div className="flex items-start gap-2 text-sm rounded-xl bg-muted/50 p-3 border border-border/50">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="text-muted-foreground">{appointment.reason}</span>
          </div>
        )}

        {isAdmin && appointment.status === "pending" && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="success"
              size="sm"
              className="flex-1"
              onClick={() => onApprove?.(appointment.id)}
            >
              <Check className="h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => onReject?.(appointment.id)}
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
