import React from 'react';

const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-2 border-blue-600 border-t-transparent ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default Spinner;