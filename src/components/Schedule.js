import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Schedule = () => {
  const [date, setDate] = useState(new Date());
  
  return (
    <div className="p-8 grid grid-cols-2 gap-4">
      <div className="course-list">
        <h3 className="text-xl font-bold mb-4">Mis Cursos</h3>
        <div className="course-item mb-4">
          <h4 className="font-semibold">Indonesia Satay Cooking Class for Beginners</h4>
          <p>6 Jan, 10:00 AM | 90 min</p>
        </div>
        {/* Agrega más items aquí */}
      </div>
      <div className="calendar-container">
        <h3 className="text-xl font-bold mb-4">Enero 2021</h3>
        <Calendar value={date} onChange={setDate} />
      </div>
    </div>
  );
};

export default Schedule;
