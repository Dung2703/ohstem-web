import React, { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';

const Settings: React.FC = () => {
  const [adafruitUsername, setAdafruitUsername] = useState('');
  const [adafruitKey, setAdafruitKey] = useState('');
  const [adafruitGroup, setAdafruitGroup] = useState('');
  const [dashboardRefreshRate, setDashboardRefreshRate] = useState(30);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Adafruit Configuration</h2>
        
        <form onSubmit={handleSave}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adafruit IO Username
              </label>
              <input
                type="text"
                value={adafruitUsername}
                onChange={(e) => setAdafruitUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your Adafruit IO username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adafruit IO Key
              </label>
              <input
                type="password"
                value={adafruitKey}
                onChange={(e) => setAdafruitKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your Adafruit IO key"
              />
              <p className="mt-1 text-xs text-gray-500">
                Your API key can be found in your Adafruit IO profile
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adafruit Group/Feed ID
              </label>
              <input
                type="text"
                value={adafruitGroup}
                onChange={(e) => setAdafruitGroup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., ohstem-sensors"
              />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Dashboard Settings</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dashboard Refresh Rate (seconds)
              </label>
              <input
                type="number"
                min="5"
                max="300"
                value={dashboardRefreshRate}
                onChange={(e) => setDashboardRefreshRate(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saveStatus === 'saving'}
              className={`
                flex items-center px-4 py-2 rounded-md text-white transition-colors
                ${saveStatus === 'saving' ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw size={16} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
          
          {saveStatus === 'success' && (
            <div className="mt-4 p-2 bg-green-50 text-green-700 rounded-md text-sm">
              Settings saved successfully!
            </div>
          )}
          
          {saveStatus === 'error' && (
            <div className="mt-4 p-2 bg-red-50 text-red-700 rounded-md text-sm">
              Error saving settings. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Settings;