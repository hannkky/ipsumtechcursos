// src/components/AdminSidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, AcademicCapIcon } from '@heroicons/react/outline';

const AdminSidebar = () => {
  return (
    <div className="w-64 h-screen bg-blue-900 text-white flex flex-col fixed top-0 left-0 p-6">
      <h1 className="text-3xl font-bold mb-10">Ipsum Admin</h1>
      <nav className="flex flex-col space-y-4">
        <NavLink to="/admin/dashboard" className="hover:bg-blue-700 p-2 rounded flex items-center">
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
        <NavLink to="/admin/roles" className="hover:bg-blue-700 p-2 rounded flex items-center">
          <UsersIcon className="h-5 w-5 mr-2" />
          Roles
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
