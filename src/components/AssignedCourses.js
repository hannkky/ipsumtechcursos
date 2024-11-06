import React from 'react';

const AssignedCourses = () => {
  return (
    <table className="min-w-full bg-white shadow-md rounded-lg">
      <thead className="bg-gray-50">
        <tr>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progreso</th>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        <tr>
          <td className="py-4 px-6 whitespace-nowrap">Curso de Diseño UI</td>
          <td className="py-4 px-6 whitespace-nowrap">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">En Proceso</span>
          </td>
          <td className="py-4 px-6 whitespace-nowrap">45%</td>
          <td className="py-4 px-6 whitespace-nowrap">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Ver detalles</button>
          </td>
        </tr>
        {/* Puedes agregar más filas aquí */}
      </tbody>
    </table>
  );
};

export default AssignedCourses;
