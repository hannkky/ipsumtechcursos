import React from 'react';

const CourseTable = ({ type }) => {
  // Fetch the relevant data based on type ("ongoing" or "completed")
  const courses = type === 'ongoing' ? getOngoingCourses() : getCompletedCourses();

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr>
          <th className="border-b p-2">Nombre</th>
          <th className="border-b p-2">Progreso</th>
          <th className="border-b p-2">Fecha de Inicio</th>
          <th className="border-b p-2">Fecha de Fin</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td className="border-b p-2">{course.name}</td>
            <td className="border-b p-2">
              {type === 'ongoing' ? (
                <div className="w-full bg-gray-200 rounded">
                  <div
                    className="bg-blue-500 h-4 rounded"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              ) : (
                'Completado'
              )}
            </td>
            <td className="border-b p-2">{course.startDate}</td>
            <td className="border-b p-2">{course.endDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Dummy functions to simulate fetching data
const getOngoingCourses = () => [
  { id: 1, name: 'UI Design Beginner', progress: 80, startDate: '2024-10-01', endDate: '2024-11-01' },
  { id: 2, name: 'UX Research', progress: 62, startDate: '2024-09-01', endDate: '2024-10-15' }
];

const getCompletedCourses = () => [
  { id: 3, name: 'Full Stack Developer', progress: 100, startDate: '2024-05-01', endDate: '2024-07-01' }
];

export default CourseTable;
