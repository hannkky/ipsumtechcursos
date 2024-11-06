import React from 'react';

const CompletedCourses = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Cursos Completados</h2>
      <div className="flex items-center mb-4">
        <img src="url-of-image" className="w-16 h-16 rounded-full border border-gray-300" alt="User" />
        <div className="ml-4">
          <p className="font-semibold">Curso: Scrum Master</p>
          <p className="text-sm text-gray-500">Completado el 10 de Oct, 2024</p>
        </div>
      </div>
      {/* Agrega más cursos completados aquí */}
    </div>
  );
};

export default CompletedCourses;
