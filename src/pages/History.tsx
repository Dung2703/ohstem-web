import React, { useState } from 'react';
import ChartComponent from '../components/ChartComponent';
import { Calendar, Filter } from 'lucide-react';

// Mock historical data - would come from Adafruit API in a real app
const generateMockData = (hours: number, baseValue: number, variance: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    
    data.push({
      time: time.getHours() + ':00',
      value: baseValue + (Math.random() * variance * 2 - variance)
    });
  }
  
  return data;
};

const historyData = {
  temperature: generateMockData(12, 30, 5),
  humidity: generateMockData(12, 60, 15),
  light: generateMockData(12, 80, 40)
};

const History: React.FC = () => {
  const [timeRange, setTimeRange] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">History</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white px-3 py-2 rounded-md shadow-sm">
            <Calendar size={16} className="text-gray-500 mr-2" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-none outline-none"
            />
          </div>
          
          <div className="flex items-center bg-white px-3 py-2 rounded-md shadow-sm">
            <Filter size={16} className="text-gray-500 mr-2" />
            <select 
              className="border-none outline-none bg-transparent"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="day">Last 24 hours</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <ChartComponent 
          title="Temperature History" 
          data={historyData.temperature} 
          color="#F59E0B" 
          unit="°C"
        />
        
        <ChartComponent 
          title="Humidity History" 
          data={historyData.humidity} 
          color="#EF4444" 
          unit="%"
        />
        
        <ChartComponent 
          title="Light Intensity History" 
          data={historyData.light}
          color="#6B7280" 
          unit=" LUX"
        />
      </div>
    </div>
  );
};

export default History;