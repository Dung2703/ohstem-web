import React, { useState } from 'react';
import { DoorClosed, DoorOpen, ShieldCheck, User, ToggleLeft, ToggleRight } from 'lucide-react';

interface DeviceControlProps {
  type: 'door' | 'light';
  name: string;
  initialState?: boolean;
  onToggle?: (newState: boolean) => void;
}

const DeviceControl: React.FC<DeviceControlProps> = ({ 
  type, 
  name, 
  initialState = false,
  onToggle 
}) => {
  const [isOn, setIsOn] = useState(initialState);
  const [isFaceRecognitionOn, setIsFaceRecognitionOn] = useState(true);
  const [status, setStatus] = useState('Safe');

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const renderDoorControl = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {isOn ? <DoorOpen size={24} className="text-blue-600" /> : <DoorClosed size={24} className="text-blue-600" />}
          <span className="ml-2 text-xl font-medium">Smart Door</span>
        </div>
        <div className={`rounded-full w-3 h-3 ${isOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>
      
      <div className="flex space-x-4 my-4">
        <div className="bg-blue-50 rounded-full px-4 py-2 flex items-center">
          <User size={16} className="text-blue-500 mr-2" />
          <span className="text-sm">Face Recognition: </span>
          <span className="text-sm font-semibold ml-1">{isFaceRecognitionOn ? 'On' : 'Off'}</span>
        </div>
        
        <div className="bg-green-50 rounded-full px-4 py-2 flex items-center">
          <ShieldCheck size={16} className="text-green-500 mr-2" />
          <span className="text-sm">Status: </span>
          <span className="text-sm font-semibold ml-1">{status}</span>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          onClick={() => setIsOn(false)}
        >
          <DoorClosed size={18} className="mr-2" />
          Lock the door
        </button>
        
        <button 
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors"
          onClick={() => setIsOn(true)}
        >
          <DoorOpen size={18} className="mr-2" />
          Open the door
        </button>
      </div>
    </div>
  );

  const renderLightControl = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <LightbulbIcon size={24} className={isOn ? "text-yellow-500" : "text-gray-400"} />
          <span className="ml-2 text-xl font-medium">Smart Light</span>
        </div>
        
        <button 
          onClick={handleToggle}
          className="relative inline-flex h-8 w-16 cursor-pointer rounded-full focus:outline-none"
        >
          <span className={`block h-8 w-16 rounded-full ${isOn ? 'bg-green-400' : 'bg-gray-300'} transition-colors duration-300`}>
            {isOn ? 
              <ToggleRight size={32} className="absolute right-0 text-white" /> : 
              <ToggleLeft size={32} className="absolute left-0 text-gray-500" />
            }
          </span>
        </button>
      </div>
      
      {isOn && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Brightness</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
    </div>
  );

  return type === 'door' ? renderDoorControl() : renderLightControl();
};

// Add LightbulbIcon component to avoid errors
const LightbulbIcon: React.FC<{ size: number, className: string }> = ({ size, className }) => {
  return <span className={className}>💡</span>;
};

export default DeviceControl;