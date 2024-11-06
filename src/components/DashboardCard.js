import React from 'react';

const DashboardCard = ({ title, count, icon, bgColor }) => {
  return (
    <div className={`${bgColor} p-4 rounded-lg flex items-center justify-between`}>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-4xl font-bold">{count}</p>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  );
};

export default DashboardCard;
