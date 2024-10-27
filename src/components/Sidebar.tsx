import React from 'react';

interface SidebarProps {
  onOperatorSelect: (operator: '+' | '-' | '×' | '÷') => void;
  currentOperator: '+' | '-' | '×' | '÷';
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOperatorSelect,
  currentOperator,
}) => {
  const operators = [
    { symbol: '+', name: 'Addition', color: 'bg-green-100 text-green-800' },
    { symbol: '-', name: 'Subtraction', color: 'bg-blue-100 text-blue-800' },
    { symbol: '×', name: 'Multiplication', color: 'bg-purple-100 text-purple-800' },
    { symbol: '÷', name: 'Division', color: 'bg-red-100 text-red-800' },
  ] as const;

  return (
    <div className="w-64 bg-white border-r">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">Templates</h2>
        <p className="text-sm text-gray-600 mt-1">Choose operation type</p>
      </div>

      <div className="px-2">
        {operators.map(({ symbol, name, color }) => (
          <button
            key={symbol}
            onClick={() => onOperatorSelect(symbol)}
            className={`w-full p-4 mb-2 rounded-lg transition-all ${
              currentOperator === symbol
                ? `${color} shadow-sm`
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                currentOperator === symbol ? color : 'bg-gray-100'
              }`}>
                {symbol}
              </span>
              <div className="text-left">
                <div className="font-medium">{name}</div>
                <div className="text-sm text-gray-500">Basic {name.toLowerCase()}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};