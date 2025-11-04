export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  location: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  type: 'interview' | 'meeting' | 'other';
  participants: string[]; // User IDs or emails
  createdBy: string; // ID of the user who created the appointment
  createdAt: Date;
  updatedAt: Date;
}