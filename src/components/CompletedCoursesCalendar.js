import React from 'react';
import Calendar from 'react-calendar';

const CompletedCoursesCalendar = () => {
  const courseDates = [
    { date: new Date(2024, 9, 1), type: 'completed' },
    { date: new Date(2024, 10, 1), type: 'ongoing' }
  ];

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const courseDay = courseDates.find((d) => d.date.toDateString() === date.toDateString());
      if (courseDay) {
        return courseDay.type === 'completed' ? 'bg-green-200' : 'bg-blue-200';
      }
    }
  };

  return <Calendar tileClassName={tileClassName} />;
};

export default CompletedCoursesCalendar;
