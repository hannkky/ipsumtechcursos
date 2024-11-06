import React, { useEffect, useState } from 'react';
import ProfileIcon from './ProfileIcon';  
import Notifications from './Notifications';  
import Sidebar from './Sidebar';  
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ActivityTimeline = () => {
  const [activities, setActivities] = useState([]);
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });

  useEffect(() => {
    // Simulación de actividades desde el backend
    fetch(`/api/getActivities?userId=user123`)
      .then(response => response.json())
      .then(data => setActivities(data))
      .catch(err => console.log(err));
  }, []);

  const filteredActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate >= dateRange.start && activityDate <= dateRange.end;
  });

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 p-8 bg-gray-100">
        
        {/* Barra superior */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Buscar..."
            className="border rounded-lg px-4 py-2 w-1/3"
          />
          <div className="flex items-center space-x-4">
            <Notifications />
            <ProfileIcon />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold mb-6">Línea de Actividad</h1>

        {/* Contenedor principal */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between min-h-[400px]">
          
          {/* Filtro por rango de fechas */}
          <div className="flex space-x-4 mt-6">
            <div>
              <label className="block text-gray-600">Fecha de inicio:</label>
              <input
                type="date"
                value={format(dateRange.start, 'yyyy-MM-dd')}
                onChange={(e) => setDateRange({ ...dateRange, start: new Date(e.target.value) })}
                className="border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-600">Fecha de fin:</label>
              <input
                type="date"
                value={format(dateRange.end, 'yyyy-MM-dd')}
                onChange={(e) => setDateRange({ ...dateRange, end: new Date(e.target.value) })}
                className="border px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Mostrar actividades */}
          <div className="space-y-8 mt-6 flex-grow">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="text-sm text-gray-500">
                    {format(new Date(activity.date), 'PPPP', { locale: es })}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{activity.activityName}</h2>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className={`text-sm ${activity.status === 'Completado' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {activity.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-6">
                <div className="bg-gray-100 p-4 rounded-lg text-center border border-gray-300">
                  <p className="text-gray-600">No se encontraron actividades en el rango de fechas seleccionado.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
