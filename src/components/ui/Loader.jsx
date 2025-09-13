import React from 'react';

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-[#915eff]/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-[#915eff] rounded-full animate-spin"></div>
      </div>
      
      <p className="text-[#bdbdfc] text-sm animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loader;