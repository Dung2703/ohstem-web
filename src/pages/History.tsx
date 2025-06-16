import React, { useState } from 'react';
import ChartComponent from '../components/ChartComponent';
import { Calendar, Filter } from 'lucide-react';
import './History.scss';

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
    <div className="history">
      <div className="history__header">
        <h1 className="history__title">History</h1>
        
        <div className="history__controls">
          <div className="history__date-picker">
            <Calendar size={16} />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          
          <div className="history__time-range">
            <Filter size={16} />
            <select 
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
      
      <div className="history__charts">
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
        
        {/* <ChartComponent 
          title="Light Intensity History" 
          data={historyData.light}
          color="#6B7280" 
          unit=" LUX"
        /> */}
      </div>
    </div>
  );
};

export default History;