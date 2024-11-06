import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CalendarIcon, AcademicCapIcon, BadgeCheckIcon, UserIcon, UsersIcon, SpeakerphoneIcon, ClipboardListIcon, LogoutIcon } from '@heroicons/react/outline';
import useUserRole from '../hooks/useUserRole';

const Sidebar = () => {
  const { userRole } = useUserRole();

  return (
    <div className="w-64 h-screen bg-blue-900 text-white flex flex-col fixed top-0 left-0 p-6">
      <h1 className="text-3xl font-bold mb-10">Ipsum Learning</h1>
      <nav className="flex flex-col space-y-4">
        {/* Opciones del usuario normal */}
        {userRole === 'user' && (
          <>
            <NavLink to="/dashboard" className="hover:bg-blue-700 p-2 rounded flex items-center">
              <HomeIcon className="h-5 w-5 mr-2" />
              Inicio
            </NavLink>
            <NavLink to="/calendar" className="hover:bg-blue-700 p-2 rounded flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Calendario
            </NavLink>
            <NavLink to="/courses" className="hover:bg-blue-700 p-2 rounded flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Cursos
            </NavLink>
            <NavLink to="/certifications" className="hover:bg-blue-700 p-2 rounded flex items-center">
              <BadgeCheckIcon className="h-5 w-5 mr-2" />
              Certificados
            </NavLink>
            <NavLink to="/profile" className="hover:bg-blue-700 p-2 rounded flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Perfil
            </NavLink>
          </>
        )}

        {/* Opciones del administrador */}
        {(userRole === 'admin' || userRole === 'principal') && (
          <>
            <NavLink to="/admin-dashboard" className="hover:bg-blue-700 p-2 rounded flex items-center">
              <HomeIcon className="h-5 w-5 mr-2" />
              Panel de Admin
            </NavLink>
            <NavLink to="/admin/users" className="hover:bg-blue-700 p-2 rounded flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              Gestión de Usuarios
            </NavLink>
            <NavLink to="/admin/courses" className="hover:bg-blue-700 p-2 rounded flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Gestión de Cursos
            </NavLink>
            <NavLink to="/admin/announcements" className="hover:bg-blue-700 p-2 rounded flex items-center">
              <SpeakerphoneIcon className="h-5 w-5 mr-2" />
              Anuncios
            </NavLink>
            <NavLink to="/admin/events" className="hover:bg-blue-700 p-2 rounded flex items-center">
              <ClipboardListIcon className="h-5 w-5 mr-2" />
              Eventos
            </NavLink>
          </>
        )}

        {/* Cerrar Sesión */}
        <NavLink to="/logout" className="hover:bg-blue-700 p-2 rounded flex items-center mt-6">
          <LogoutIcon className="h-5 w-5 mr-2" />
          Cerrar Sesión
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
