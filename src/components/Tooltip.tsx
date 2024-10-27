import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div className="absolute left-0 bottom-full mb-2 z-10">
          <div className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg whitespace-nowrap">
            {content}
            <div className="absolute top-full left-4 -mt-1">
              <div className="border-4 border-transparent border-t-gray-800" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};