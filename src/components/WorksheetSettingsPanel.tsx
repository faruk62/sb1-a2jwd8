import React from 'react';
import { Tooltip } from './Tooltip';

interface WorksheetSettingsProps {
  settings: {
    grid: {
      columns: number;
      rows: number;
      itemWidth: number;
      itemHeight: number;
      rowSpacing: number;
      columnSpacing: number;
    };
    operands: {
      min: number;
      max: number;
    };
  };
  onSettingsChange: (settings: WorksheetSettingsProps['settings']) => void;
  onUpdate: () => void;
}

export const WorksheetSettingsPanel: React.FC<WorksheetSettingsProps> = ({
  settings,
  onSettingsChange,
  onUpdate,
}) => {
  const handleGridChange = (key: keyof typeof settings.grid, value: number) => {
    onSettingsChange({
      ...settings,
      grid: {
        ...settings.grid,
        [key]: value,
      },
    });
    onUpdate();
  };

  const handleOperandsChange = (key: keyof typeof settings.operands, value: number) => {
    onSettingsChange({
      ...settings,
      operands: {
        ...settings.operands,
        [key]: value,
      },
    });
    onUpdate();
  };

  return (
    <div className="w-80 bg-white border-r overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Worksheet Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Customize problem layout and complexity</p>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Grid Layout</h3>
          
          <div className="space-y-3">
            <Tooltip content="Number of problems per row">
              <div>
                <label className="text-sm text-gray-600">Columns:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={settings.grid.columns}
                    onChange={(e) => handleGridChange('columns', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-8 text-right">{settings.grid.columns}</span>
                </div>
              </div>
            </Tooltip>

            <Tooltip content="Number of rows per page">
              <div>
                <label className="text-sm text-gray-600">Rows:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={settings.grid.rows}
                    onChange={(e) => handleGridChange('rows', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-8 text-right">{settings.grid.rows}</span>
                </div>
              </div>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Spacing</h3>
          
          <div className="space-y-3">
            <Tooltip content="Space between rows">
              <div>
                <label className="text-sm text-gray-600">Row Spacing (px):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="8"
                    max="48"
                    step="4"
                    value={settings.grid.rowSpacing}
                    onChange={(e) => handleGridChange('rowSpacing', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-8 text-right">{settings.grid.rowSpacing}</span>
                </div>
              </div>
            </Tooltip>

            <Tooltip content="Space between columns">
              <div>
                <label className="text-sm text-gray-600">Column Spacing (px):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="8"
                    max="48"
                    step="4"
                    value={settings.grid.columnSpacing}
                    onChange={(e) => handleGridChange('columnSpacing', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-8 text-right">{settings.grid.columnSpacing}</span>
                </div>
              </div>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Problem Size</h3>
          
          <div className="space-y-3">
            <Tooltip content="Width of each problem">
              <div>
                <label className="text-sm text-gray-600">Width (px):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="80"
                    max="200"
                    step="10"
                    value={settings.grid.itemWidth}
                    onChange={(e) => handleGridChange('itemWidth', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-8 text-right">{settings.grid.itemWidth}</span>
                </div>
              </div>
            </Tooltip>

            <Tooltip content="Height of each problem">
              <div>
                <label className="text-sm text-gray-600">Height (px):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="60"
                    max="160"
                    step="10"
                    value={settings.grid.itemHeight}
                    onChange={(e) => handleGridChange('itemHeight', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-8 text-right">{settings.grid.itemHeight}</span>
                </div>
              </div>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Number Range</h3>
          
          <div className="space-y-3">
            <Tooltip content="Minimum value for operands">
              <div>
                <label className="text-sm text-gray-600">Minimum:</label>
                <input
                  type="number"
                  min="0"
                  max={settings.operands.max}
                  value={settings.operands.min}
                  onChange={(e) => handleOperandsChange('min', parseInt(e.target.value))}
                  className="w-full px-2 py-1 mt-1 border rounded text-sm"
                />
              </div>
            </Tooltip>

            <Tooltip content="Maximum value for operands">
              <div>
                <label className="text-sm text-gray-600">Maximum:</label>
                <input
                  type="number"
                  min={settings.operands.min}
                  max="100"
                  value={settings.operands.max}
                  onChange={(e) => handleOperandsChange('max', parseInt(e.target.value))}
                  className="w-full px-2 py-1 mt-1 border rounded text-sm"
                />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};