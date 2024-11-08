import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/User/Dashboard';
import Calendar from './pages/User/Calendar';
import Courses from './pages/User/Courses';
import Certifications from './pages/User/Certifications';
import UserProfile from './pages/User/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import AdminCourseManagement from './pages/Admin/CourseManagement';
import AdminAnnouncements from './pages/Admin/Announcements';
import AdminEvents from './pages/Admin/Events';
import ModeradorDashboard from './pages/Moderador/ModeradorDashboard';
import Announcements from './pages/Moderador/Announcements';
import Events from './pages/Moderador/Events';
import Profile from './pages/Moderador/Profile';
import CourseManagement from './pages/Moderador/CourseManagement';
import LoginScreen from './pages/Welcome/LoginScreen';
import RegisterScreen from './pages/Welcome/RegisterScreen';
import ProfileSetupPage from './pages/Welcome/ProfileSetupPage';
import './App.css';

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
          <Route path="/user/dashboard" element={<Dashboard />} />
          <Route path="/user/calendar" element={<Calendar />} />
          <Route path="/user/courses" element={<Courses />} />
          <Route path="/user/certifications" element={<Certifications />} />
          <Route path="/user/profile" element={<Profile />} />
          
          {/* Rutas específicas para el administrador */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/courses" element={<AdminCourseManagement />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/events" element={<AdminEvents />} />

          {/* Rutas específicas para el moderador */}
          <Route path="/moderador-dashboard" element={<ModeradorDashboard />} />
          <Route path="/moderador/courses" element={<CourseManagement />} />
          <Route path="/moderador/announcements" element={<Announcements />} />
          <Route path="/moderador/events" element={<Events />} />
          <Route path="/moderador/profile" element={<Profile />} />
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
          <Route path="/user/dashboard" element={<Dashboard />} />
          <Route path="/user/calendar" element={<Calendar />} />
          <Route path="/user/courses" element={<Courses />} />
          <Route path="/user/certifications" element={<Certifications />} />
          <Route path="/user/profile" element={<UserProfile />} />

          {/* Rutas del administrador */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/courses" element={<AdminCourseManagement />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/events" element={<AdminEvents />} />

          {/* Rutas del moderador */}
          <Route path="/moderador-dashboard" element={<ModeradorDashboard />} />
          <Route path="/moderador/courses" element={<CourseManagement />} />
          <Route path="/moderador/announcements" element={<Announcements />} />
          <Route path="/moderador/events" element={<Events />} />
          <Route path="/moderador/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}
