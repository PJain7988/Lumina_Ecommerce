import React from 'react';

const EmptyState = ({ title, description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl shadow-card border border-gray-100/50 animate-fade-in">
      {icon && (
        <div className="w-24 h-24 mb-6 text-gray-400 bg-gray-50 rounded-full flex items-center justify-center animate-float">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">{title}</h3>
      <p className="text-gray-500 mb-8 max-w-md">{description}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
