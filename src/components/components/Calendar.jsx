import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Calendar({ events = [], onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get first day of month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Days of week
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  // Month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Check if a date has events
  const getEventsForDate = (day) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toISOString().split('T')[0] === dateString;
    });
  };
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty slots for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-10 border border-transparent"></div>);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const isToday = new Date().toDateString() === date.toDateString();
    const dayEvents = getEventsForDate(day);
    const hasEvents = dayEvents.length > 0;
    
    calendarDays.push(
      <div
        key={day}
        onClick={() => onDateClick && onDateClick(date, dayEvents)}
        className={`h-10 border flex flex-col items-center justify-center cursor-pointer relative
          ${isToday ? 'bg-blue-50 border-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}
      >
        <span className={`text-sm ${isToday ? 'font-bold text-blue-600' : ''}`}>{day}</span>
        {hasEvents && (
          <div className="absolute bottom-1 rounded-full h-1.5 w-1.5 bg-blue-500"></div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {months[currentMonth]} {currentYear}
        </h2>
        <div className="flex space-x-1">
          <button 
            onClick={goToPreviousMonth}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={goToNextMonth}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Days of the week */}
        {daysOfWeek.map(day => (
          <div key={day} className="h-10 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-500">{day}</span>
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays}
      </div>
    </div>
  );
}
