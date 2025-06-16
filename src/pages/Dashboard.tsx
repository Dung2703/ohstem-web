import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SensorCard from '../components/SensorCard';
import DeviceControl from '../components/DeviceControl';
import { RefreshCw, AlertCircle } from 'lucide-react';
import adafruitService from '../services/adafruitService';

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
      setSensorData(data);
      setLastUpdated(new Date());
    });

    return () => unsubscribe();
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleDeviceControl = async (deviceId: 'door' | 'light', state: boolean) => {
    await adafruitService.controlDevice(deviceId, state);
  };

  const getTemperatureStatus = (value: number) => value > 30 ? 'High' : value < 20 ? 'Low' : 'Normal';
  const getHumidityStatus = (value: number) => value > 60 ? 'High' : value < 30 ? 'Low' : 'Normal';
  const getLightStatus = (value: number) => value > 100 ? 'High' : value < 50 ? 'Low' : 'Normal';

  if (sensorData.error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Connection Error</h2>
          <p className="text-red-600 mb-4">{sensorData.error}</p>
          <button
            onClick={() => navigate('/settings')}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
          >
            Go to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-4">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button 
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-md transition-colors"
          >
            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
      
      <h2 className="text-xl font-bold mb-4">Devices</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DeviceControl 
          type="door" 
          name="Smart Door"
          initialState={adafruitService.getDeviceState('door')}
          onToggle={(state) => handleDeviceControl('door', state)}
        />
        <DeviceControl 
          type="light" 
          name="Smart Light"
          initialState={adafruitService.getDeviceState('light')}
          onToggle={(state) => handleDeviceControl('light', state)}
        />
      </div>
    </div>
  );
};

export default Dashboard;