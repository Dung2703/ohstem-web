import React, { useState } from 'react';
import './WifiConfig.scss';

const WifiConfig: React.FC = () => {
  const [wifiName, setWifiName] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wifiName || !wifiPassword) {
      setError('Please enter both WiFi name and password.');
      return;
    }
    setError('');
    alert(`Connecting to WiFi: ${wifiName}`);
    // Here you would typically send the data to a backend or a device
  };

  return (
    <div className="wifi-config">
      <div className="wifi-config__container">
        <h1 className="wifi-config__title">Configure WiFi</h1>
        <form className="wifi-config__form" onSubmit={handleSubmit}>
          <div className="wifi-config__form-group">
            <label className="wifi-config__form-label">WiFi Name</label>
            <input
              type="text"
              className="wifi-config__form-input"
              value={wifiName}
              onChange={e => setWifiName(e.target.value)}
              placeholder="Enter WiFi name"
              required
            />
          </div>
          <div className="wifi-config__form-group">
            <label className="wifi-config__form-label">WiFi Password</label>
            <input
              type="password"
              className="wifi-config__form-input"
              value={wifiPassword}
              onChange={e => setWifiPassword(e.target.value)}
              placeholder="Enter WiFi password"
              required
            />
          </div>
          {error && <div className="wifi-config__error">{error}</div>}
          <button type="submit" className="wifi-config__submit">Connect WiFi</button>
        </form>
        <div className="wifi-config__footer">
          {/* Removed "Need help?" text as requested */}
          {/* You can add a link to a help page here if needed */}
        </div>
      </div>
    </div>
  );
};

export default WifiConfig; 