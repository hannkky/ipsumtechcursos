import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';


const localizer = momentLocalizer(moment);

const events = [
  { title: 'Curso Próximo', start: new Date(2024, 9, 5), end: new Date(2024, 9, 5) },
  { title: 'Curso Completo', start: new Date(2024, 9, 10), end: new Date(2024, 9, 10) },
];

const ScheduleCalendar = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Calendario de Cursos</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        components={{
          toolbar: (props) => (
            <div className="flex justify-between items-center p-2">
              <button className="text-gray-600 hover:text-black" onClick={() => props.onNavigate('PREV')}>«</button>
              <span className="text-xl font-bold">{moment(props.date).format('MMMM YYYY')}</span>
              <button className="text-gray-600 hover:text-black" onClick={() => props.onNavigate('NEXT')}>»</button>
            </div>
          ),
          month: {
            dateHeader: ({ label }) => <span className="text-gray-700 font-semibold">{label}</span>
          },
        }}
        dayPropGetter={(date) => {
          if (moment(date).day() === 0 || moment(date).day() === 6) {
            return { className: 'text-red-500' };
          }
          return { className: 'text-black' };
        }}
        eventPropGetter={() => ({
          className: 'bg-green-500 text-white rounded-full px-2 py-1'
        })}
      />
    </div>
  );
};

export default ScheduleCalendar;
