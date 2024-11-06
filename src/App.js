import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/User/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ModeradorDashboard from './pages/Moderador/ModeradorDashboard';
import Calendar from './components/Calendar';
import Courses from './components/Courses';
import Certifications from './components/Certifications';
import Profile from './components/Profile';
import UserManagement from './pages/Admin/UserManagement';
import CourseManagement from './pages/Admin/CourseManagement';
import Announcements from './pages/Admin/Announcements';
import Events from './pages/Admin/Events';
import './App.css';

import LoginScreen from './pages/Welcome/LoginScreen';
import RegisterScreen from './pages/Welcome/RegisterScreen';
import ProfileSetupPage from './pages/Welcome/ProfileSetupPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas de autenticación */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/profile-setup" element={<ProfileSetupPage />} />

        {/* Layout con Sidebar para rutas protegidas */}
        <Route element={<WithSidebarLayout />}>
          {/* Rutas del usuario estándar */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/certificates" element={<Certifications />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Rutas específicas para el administrador */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/courses" element={<CourseManagement />} />
          <Route path="/admin/announcements" element={<Announcements />} />
          <Route path="/admin/events" element={<Events />} />

          {/* Rutas específicas para el moderador */}
          <Route path="/moderador-dashboard" element={<ModeradorDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

// Componente Layout que contiene el Sidebar
function WithSidebarLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100 min-h-screen ml-64">
        <Routes>
          {/* Rutas compartidas */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/certificates" element={<Certifications />} />
          <Route path="/profile" element={<Profile />} />

          {/* Rutas del administrador */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/courses" element={<CourseManagement />} />
          <Route path="/admin/announcements" element={<Announcements />} />
          <Route path="/admin/events" element={<Events />} />

          {/* Rutas del moderador */}
          <Route path="/moderador-dashboard" element={<ModeradorDashboard />} />
        </Routes>
      </div>
    </div>
  );
}
