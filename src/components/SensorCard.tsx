import React from 'react';
import { Thermometer, Droplets, LightbulbIcon, Cpu } from 'lucide-react';

type SensorType = 'temperature' | 'humidity' | 'light' | 'devices';

interface SensorCardProps {
  type: SensorType;
  value: string | number;
  status: 'High' | 'Low' | 'Normal';
}

const SensorCard: React.FC<SensorCardProps> = ({ type, value, status }) => {
  const getCardStyle = () => {
    switch (type) {
      case 'temperature':
        return {
          bgColor: 'bg-gradient-to-r from-amber-50 to-amber-100',
          textColor: 'text-amber-500',
          borderColor: 'border-amber-200',
          icon: <Thermometer size={24} className="text-amber-500" />,
          title: 'Temperature',
          rightIcon: <Thermometer size={24} className="text-amber-500" />,
        };
      case 'humidity':
        return {
          bgColor: 'bg-gradient-to-r from-red-50 to-red-100',
          textColor: 'text-red-500',
          borderColor: 'border-red-200',
          icon: <Droplets size={24} className="text-red-500" />,
          title: 'Humid',
          rightIcon: <Droplets size={24} className="text-red-500" />,
        };
      case 'light':
        return {
          bgColor: 'bg-gradient-to-r from-gray-50 to-gray-100',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-200',
          icon: <LightbulbIcon size={24} className="text-gray-600" />,
          title: 'Light',
          rightIcon: <LightbulbIcon size={24} className="text-gray-600" />,
        };
      case 'devices':
        return {
          bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100',
          textColor: 'text-blue-600',
          borderColor: 'border-blue-200',
          icon: <Cpu size={24} className="text-blue-600" />,
          title: 'Devices',
          rightIcon: <Cpu size={24} className="text-blue-600" />,
        };
      default:
        return {
          bgColor: 'bg-white',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          icon: null,
          title: type,
          rightIcon: null,
        };
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'High':
        return 'text-red-500';
      case 'Low':
        return 'text-blue-500';
      case 'Normal':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatValue = () => {
    switch (type) {
      case 'temperature':
        return `${value}°C`;
      case 'humidity':
        return `${value}%`;
      case 'light':
        return `${value} LUX`;
      case 'devices':
        return value;
      default:
        return value;
    }
  };

  const cardStyle = getCardStyle();
  const statusColor = getStatusColor();

  return (
    <div className={`rounded-xl border ${cardStyle.borderColor} ${cardStyle.bgColor} p-6 shadow-sm transition-all duration-300 hover:shadow-md`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {cardStyle.icon}
          <span className={`ml-2 text-lg font-medium ${cardStyle.textColor}`}>{cardStyle.title}</span>
        </div>
        <div>{cardStyle.rightIcon}</div>
      </div>
      
      <div className="mt-4 flex items-end justify-between">
        <div className="text-3xl font-bold">{formatValue()}</div>
        <div className={`font-semibold ${statusColor}`}>{status}</div>
      </div>
    </div>
  );
};

export default SensorCard;