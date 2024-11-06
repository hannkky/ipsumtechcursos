import React from 'react';
import { BellIcon } from '@heroicons/react/outline'; // Puedes usar una librería como Heroicons

const Notifications = () => {
  return (
    <button className="relative">
      <BellIcon className="h-6 w-6 text-gray-600" />
      <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
    </button>
  );
};

export default Notifications;
