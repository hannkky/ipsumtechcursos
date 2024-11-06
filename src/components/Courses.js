import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Calendario = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Calendario de Cursos</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Calendar
          onChange={setDate}
          value={date}
          className="mx-auto border-none shadow-none"
        />
        <p className="mt-4 text-center text-gray-700">
          Cursos asignados para la fecha: <span className="font-bold">{date.toDateString()}</span>
        </p>
      </div>
    </div>
  );
};

export default Calendario;
