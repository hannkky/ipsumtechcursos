import React from 'react';
import Sidebar from '../../components/Sidebar';
import DashboardCard from '../../components/DashboardCard';
import AssignedCourses from '../../components/AssignedCourses';
import CompletedCourses from '../../components/CompletedCourses';
import ScheduleCalendar from '../../components/ScheduleCalendar';
import Notifications from '../../components/Notifications';
import ProfileIcon from '../../components/ProfileIcon';

const Dashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header with notifications and profile */}
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

        {/* Dashboard Title */}
        <h1 className="text-4xl font-bold mb-6">Inicio</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <DashboardCard title="Cursos Completados" count="10" icon="🎓" bgColor="bg-green-100" />
          <DashboardCard title="Cursos Iniciados" count="5" icon="📘" bgColor="bg-yellow-100" />
          <DashboardCard title="Cursos Próximos" count="3" icon="📅" bgColor="bg-purple-100" />
          <DashboardCard title="Cursos Asignados" count="2" icon="📋" bgColor="bg-blue-100" />
        </div>

        {/* Assigned Courses */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Cursos Asignados</h2>
          <AssignedCourses />
        </div>

        {/* Completed Courses and Calendar */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Cursos Completados</h2>
            <CompletedCourses />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Calendario de Cursos</h2>
            <ScheduleCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
