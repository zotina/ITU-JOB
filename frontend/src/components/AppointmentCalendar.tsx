import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { Appointment } from '@/types/appointment';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  userType: 'student' | 'recruiter';
  onAppointmentClick?: (appointment: Appointment) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ 
  appointments, 
  userType,
  onAppointmentClick 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Filter appointments based on user type
  const filteredAppointments = appointments;

  // Get all appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return filteredAppointments.filter(app => isSameDay(new Date(app.date), date));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add days from previous and next months to fill out the grid
  const startWeek = new Date(monthStart);
  startWeek.setDate(monthStart.getDate() - monthStart.getDay()); // Start from Sunday

  const endWeek = new Date(monthEnd);
  endWeek.setDate(monthEnd.getDate() + (6 - monthEnd.getDay())); // End on Saturday

  const allDays = eachDayOfInterval({ start: startWeek, end: endWeek });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Mes Rendez-vous</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
          >
            Aujourd'hui
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          {userType === 'student' 
            ? 'Affichage de vos entretiens programmés' 
            : 'Affichage de tous vos rendez-vous'}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {allDays.map((day, index) => {
          const dayAppointments = getAppointmentsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={index}
              className={`
                min-h-24 p-1 border rounded
                ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                ${isSelected ? 'border-blue-500 border-2' : 'border-gray-200'}
                ${isToday ? 'bg-blue-50' : ''}
              `}
              onClick={() => setSelectedDate(day)}
            >
              <div className={`text-right text-sm p-1 ${isToday ? 'font-bold text-blue-600' : ''}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {dayAppointments.slice(0, 2).map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`text-xs p-1 rounded truncate cursor-pointer ${getStatusColor(appointment.status)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAppointmentClick?.(appointment);
                    }}
                  >
                    <div className="font-medium">{appointment.title}</div>
                    <div className="flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{appointment.startTime}</span>
                    </div>
                  </div>
                ))}
                {dayAppointments.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayAppointments.length - 2} autres
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            Rendez-vous du {format(selectedDate, 'd MMMM yyyy', { locale: fr })}
          </h3>
          <div className="space-y-3">
            {getAppointmentsForDate(selectedDate).length > 0 ? (
              getAppointmentsForDate(selectedDate).map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onAppointmentClick?.(appointment)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-lg">{appointment.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{appointment.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{appointment.startTime} - {appointment.endTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{appointment.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <User className="w-4 h-4 mr-1" />
                    <span>Type: {appointment.type}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">Aucun rendez-vous pour cette date.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;