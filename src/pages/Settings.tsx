import React, { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import './Settings.scss';

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
    <div className="settings">
      <h1 className="settings__title">Settings</h1>
      
      <div className="settings__container">
        <h2 className="settings__section-title">Adafruit Configuration</h2>
        
        <form onSubmit={handleSave}>
          <div className="settings__form-group">
            <label className="settings__form-label">
              Adafruit IO Username
            </label>
            <input
              type="text"
              value={adafruitUsername}
              onChange={(e) => setAdafruitUsername(e.target.value)}
              className="settings__form-input"
              placeholder="Your Adafruit IO username"
            />
          </div>
          
          <div className="settings__form-group">
            <label className="settings__form-label">
              Adafruit IO Key
            </label>
            <input
              type="password"
              value={adafruitKey}
              onChange={(e) => setAdafruitKey(e.target.value)}
              className="settings__form-input"
              placeholder="Your Adafruit IO key"
            />
            <p className="settings__form-help">
              Your API key can be found in your Adafruit IO profile
            </p>
          </div>
          
          <div className="settings__form-group">
            <label className="settings__form-label">
              Adafruit Group/Feed ID
            </label>
            <input
              type="text"
              value={adafruitGroup}
              onChange={(e) => setAdafruitGroup(e.target.value)}
              className="settings__form-input"
              placeholder="e.g., ohstem-sensors"
            />
          </div>
          
          <h2 className="settings__section-title">Dashboard Settings</h2>
          
          <div className="settings__form-group">
            <label className="settings__form-label">
              Dashboard Refresh Rate (seconds)
            </label>
            <input
              type="number"
              min="5"
              max="300"
              value={dashboardRefreshRate}
              onChange={(e) => setDashboardRefreshRate(parseInt(e.target.value))}
              className="settings__form-input"
            />
          </div>
          
          <div className="settings__actions">
            <button
              type="submit"
              disabled={saveStatus === 'saving'}
              className={`settings__save-button ${saveStatus === 'saving' ? 'settings__save-button--saving' : 'settings__save-button--default'}`}
            >
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Settings
                </>
              )}
            </button>
          </div>
          
          {saveStatus === 'success' && (
            <div className="settings__status settings__status--success">
              Settings saved successfully!
            </div>
          )}
          
          {saveStatus === 'error' && (
            <div className="settings__status settings__status--error">
              Error saving settings. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Settings;