import React from 'react';

const LoadingSkeleton = ({ rows = 3, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-card w-full h-full border border-gray-100">
        <div className="w-full h-48 bg-gray-200 rounded-xl animate-shimmer mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-shimmer mb-4"></div>
        <div className="flex justify-between items-center mt-auto">
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-shimmer"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-shimmer"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-pulse space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded-xl animate-shimmer w-full"></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
