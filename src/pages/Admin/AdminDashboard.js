// src/pages/Admin/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <button 
          onClick={() => navigate('/admin/users')} 
          className="bg-blue-600 text-white py-4 rounded-lg text-center font-semibold hover:bg-blue-700"
        >
          Gestión de Usuarios
        </button>
        <button 
          onClick={() => navigate('/admin/courses')} 
          className="bg-green-600 text-white py-4 rounded-lg text-center font-semibold hover:bg-green-700"
        >
          Gestión de Cursos
        </button>
        <button className="bg-purple-600 text-white py-4 rounded-lg text-center font-semibold hover:bg-purple-700">
          Ver Estadísticas de Cursos
        </button>
      </div>

      {/* Línea de Actividad */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Línea de Actividad</h2>
        {/* Aquí agregarás un componente de actividad o una lista de actividades recientes */}
        <ul className="bg-white shadow rounded-lg p-4">
          <li>Usuario A inició el curso "Introducción a React".</li>
          <li>Usuario B completó el curso "JavaScript Avanzado".</li>
          <li>Usuario C se registró en la plataforma.</li>
          {/* Añade más eventos aquí */}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
