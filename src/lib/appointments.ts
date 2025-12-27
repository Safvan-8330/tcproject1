export type AppointmentCategory = 'doctor' | 'salon' | 'service-centre' | 'spa' | 'fitness' | 'dental';

export interface CategoryInfo {
  id: AppointmentCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'doctor', name: 'Doctor', icon: 'Stethoscope', description: 'Medical consultations & checkups', color: 'doctor' },
  { id: 'salon', name: 'Salon', icon: 'Scissors', description: 'Haircuts, styling & beauty', color: 'salon' },
  { id: 'service-centre', name: 'Service Centre', icon: 'Wrench', description: 'Vehicle & appliance repairs', color: 'service' },
  { id: 'spa', name: 'Spa & Wellness', icon: 'Sparkles', description: 'Massage, relaxation & therapy', color: 'spa' },
  { id: 'fitness', name: 'Fitness', icon: 'Dumbbell', description: 'Gym, yoga & personal training', color: 'fitness' },
  { id: 'dental', name: 'Dental', icon: 'SmilePlus', description: 'Dental care & treatments', color: 'dental' },
];

export interface Appointment {
  id: string;
  name: string;
  email: string;
  date: string;
  timeSlot: string;
  reason?: string;
  category: AppointmentCategory;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const STORAGE_KEY = 'appointments';

export const getAppointments = (): Appointment[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveAppointment = (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Appointment => {
  const appointments = getAppointments();
  const newAppointment: Appointment = {
    ...appointment,
    id: crypto.randomUUID(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  appointments.push(newAppointment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  return newAppointment;
};

export const updateAppointmentStatus = (id: string, status: 'approved' | 'rejected'): void => {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    appointments[index].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }
};

export const getAppointmentsByEmail = (email: string): Appointment[] => {
  return getAppointments().filter(a => a.email.toLowerCase() === email.toLowerCase());
};

export const TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
];

export const getCategoryById = (id: AppointmentCategory): CategoryInfo | undefined => {
  return CATEGORIES.find(c => c.id === id);
};
