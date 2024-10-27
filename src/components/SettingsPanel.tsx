import React from 'react';

interface SettingsPanelProps {
  settings: {
    pageSize: 'letter' | 'a4';
    pageNumbering: {
      enabled: boolean;
      startFrom: number;
      centered: boolean;
    };
    margins: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    showMargins: boolean;
    pagesToDownload: 'all' | number[];
  };
  onSettingsChange: (settings: SettingsPanelProps['settings']) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="w-80 bg-white border-r overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Customize worksheet appearance</p>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Page Size</h3>
          <div className="grid grid-cols-2 gap-2">
            {['letter', 'a4'].map((size) => (
              <button
                key={size}
                onClick={() => onSettingsChange({
                  ...settings,
                  pageSize: size as 'letter' | 'a4'
                })}
                className={`p-3 rounded-lg border text-center transition-all ${
                  settings.pageSize === size
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Page Numbering</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.pageNumbering.enabled}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  pageNumbering: {
                    ...settings.pageNumbering,
                    enabled: e.target.checked
                  }
                })}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">Show page numbers</span>
            </label>

            {settings.pageNumbering.enabled && (
              <div className="space-y-3 pl-6">
                <div>
                  <label className="text-sm text-gray-600">Start from:</label>
                  <input
                    type="number"
                    value={settings.pageNumbering.startFrom}
                    onChange={(e) => onSettingsChange({
                      ...settings,
                      pageNumbering: {
                        ...settings.pageNumbering,
                        startFrom: parseInt(e.target.value)
                      }
                    })}
                    className="w-20 px-2 py-1 ml-2 border rounded text-sm"
                    min="1"
                  />
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.pageNumbering.centered}
                    onChange={(e) => onSettingsChange({
                      ...settings,
                      pageNumbering: {
                        ...settings.pageNumbering,
                        centered: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-600">Center align numbers</span>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Margins (inches)</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(settings.margins).map(([side, value]) => (
              <div key={side}>
                <label className="text-sm text-gray-600 capitalize">{side}:</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    margins: {
                      ...settings.margins,
                      [side]: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full px-2 py-1 mt-1 border rounded text-sm"
                  step="0.1"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};