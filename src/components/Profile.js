import React from 'react';

const Profile = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Nella Vita</h2>
          <p className="text-gray-500">Miembro desde 2020</p>
        </div>
        <div className="rounded-full bg-gray-200 p-4">
          <img src="/path/to/profile-pic.jpg" alt="Nella Vita" className="rounded-full h-16 w-16"/>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-lg">Cursos Completados</h3>
          <p className="text-3xl">100</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-lg">Cursos en Progreso</h3>
          <p className="text-3xl">34</p>
        </div>
      </div>

      {/* Sección de progreso */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Progreso</h3>
        <div className="chart-container">
          {/* Aquí puedes integrar una gráfica, como Chart.js o otra librería */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
