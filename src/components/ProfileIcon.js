import React from 'react';

const ProfileIcon = () => {
  return (
    <div className="flex items-center">
      <img
        src="https://via.placeholder.com/40"
        alt="Perfil"
        className="rounded-full h-10 w-10"
      />
      <span className="ml-2 text-gray-600">Jackson Pierce</span>
    </div>
  );
};

export default ProfileIcon;
