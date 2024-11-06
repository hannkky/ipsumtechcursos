// src/components/ProfileIcon.js
import React from 'react';

const ProfileIcon = ({ firstName, lastName, profileImageUrl }) => {
  return (
    <div className="flex items-center">
      <img
        src={profileImageUrl || 'https://via.placeholder.com/40'} // Muestra una imagen por defecto si no hay imagen de perfil
        alt="Perfil"
        className="rounded-full h-10 w-10"
      />
      <span className="ml-2 text-gray-600">
        {firstName} {lastName}
      </span>
    </div>
  );
};

export default ProfileIcon;
