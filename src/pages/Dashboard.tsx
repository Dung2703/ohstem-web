import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SensorCard from '../components/SensorCard';
import DeviceControl from '../components/DeviceControl';
import { RefreshCw, AlertCircle } from 'lucide-react';
import adafruitService from '../services/adafruitService';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    light: 0,
    devices: '0/2',
    error: null as string | null
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const unsubscribe = adafruitService.subscribe((data) => {
      setSensorData({ ...data, error: data.error ?? null });
      setLastUpdated(new Date());
    });

    return () => unsubscribe();
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleDeviceToggle = async (deviceId: 'door' | 'light') => {
    const currentState = adafruitService.getDeviceState(deviceId);
    await adafruitService.controlDevice(deviceId, !currentState);
  };

  const handleBrightnessChange = async (deviceId: 'door' | 'light', value: number) => {
    // Implement brightness change logic here
    console.log(`Changing brightness of ${deviceId} to ${value}%`);
  };

  const getTemperatureStatus = (value: number) => value > 30 ? 'High' : value < 20 ? 'Low' : 'Normal';
  const getHumidityStatus = (value: number) => value > 60 ? 'High' : value < 30 ? 'Low' : 'Normal';
  const getLightStatus = (value: number) => value > 100 ? 'High' : value < 50 ? 'Low' : 'Normal';

  if (sensorData.error) {
    return (
      <div className="dashboard">
        <div className="dashboard__error-container">
          <AlertCircle className="dashboard__error-icon" />
          <h2 className="dashboard__error-title">Connection Error</h2>
          <p className="dashboard__error-message">{sensorData.error}</p>
          <button
            onClick={() => navigate('/settings')}
            className="dashboard__error-button"
          >
            Go to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Dashboard</h1>
        
        <div className="dashboard__controls">
          <span className="dashboard__last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button 
            onClick={refreshData}
            disabled={isRefreshing}
            className="dashboard__refresh-button"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>
      
      <div className="dashboard__sensors">
        <SensorCard 
          type="temperature" 
          value={sensorData.temperature} 
          status={getTemperatureStatus(sensorData.temperature)}
        />
        <SensorCard 
          type="humidity" 
          value={sensorData.humidity} 
          status={getHumidityStatus(sensorData.humidity)}
        />
        <SensorCard 
          type="light" 
          value={sensorData.light} 
          status={getLightStatus(sensorData.light)}
        />
        <SensorCard 
          type="devices" 
          value={sensorData.devices} 
          status="Normal"
        />
      </div>
      
      <h2 className="dashboard__devices-title">Devices</h2>
      <div className="dashboard__devices-grid">
        <DeviceControl 
          device={{
            id: 'door',
            name: 'Smart Door',
            type: 'door',
            status: adafruitService.getDeviceState('door') ? 'on' : 'off'
          }}
          onToggle={handleDeviceToggle}
          onBrightnessChange={handleBrightnessChange}
        />
        <DeviceControl 
          device={{
            id: 'light',
            name: 'Smart Light',
            type: 'light',
            status: adafruitService.getDeviceState('light') ? 'on' : 'off',
            brightness: 75 // You might want to get this from your service
          }}
          onToggle={handleDeviceToggle}
          onBrightnessChange={handleBrightnessChange}
        />
      </div>
    </div>
  );
};

export default Dashboard;