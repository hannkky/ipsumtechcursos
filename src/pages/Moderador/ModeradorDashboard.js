// src/pages/Moderador/ModeradorDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useUserRole from '../../hooks/useUserRole';

const ModeradorDashboard = () => {
  const { userRole, loadingRole } = useUserRole();
  const navigate = useNavigate();

  if (loadingRole) {
    return <p>Cargando...</p>;
  }

  if (userRole !== 'moderador') {
    navigate('/'); // Redirige si no es moderador
    return null;
  }

  return (
    <div className="p-6">
      <h1>Panel de Moderador</h1>
      {/* Contenido para moderadores */}
    </div>
  );
};

export default ModeradorDashboard;
