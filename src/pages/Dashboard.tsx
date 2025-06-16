import React, { useState } from 'react';
import ChartComponent from '../components/ChartComponent';
import PieChartComponent from '../components/PieChartComponent';
import { Calendar, Filter } from 'lucide-react';
import './Dashboard.scss';

// Dummy data cố định cho line chart (giờ, số lần té)
const fallTimeByHour = [
  { x: 0, y: 0 },
  { x: 2, y: 0 },
  { x: 4, y: 0},
  { x: 6, y: 10},
  { x: 8, y: 55 },
  { x: 10, y: 40 },
  { x: 12, y: 60 },
  { x: 14, y: 30 },
  { x: 16, y: 80 },
  { x: 18, y: 70 },
  { x: 20, y: 85 },
  { x: 22, y: 45 },
  { x: 24, y: 0}
];

// Dummy data cố định cho pie chart
const pieData = [12, 18, 10, 8, 7, 10, 9, 6, 12, 8];

const dashboardData = {
  fallTimeByHour,
  pie: pieData
};

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Dashboard</h1>
      </div>
      <div className="dashboard__controls">
        <div className="dashboard__date-picker">
          <Calendar size={16} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="dashboard__time-range">
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
      <div className="dashboard__charts">
        <ChartComponent
          data={dashboardData.fallTimeByHour}
          color="#F59E0B"
          unit=""
          xLabel="Hour"
          yLabel="Fall Time"
          xMin={0}
          xMax={24}
          yMin={0}
          yMax={100}
        />
        <div style={{ marginTop: '2rem' }}>
          <PieChartComponent data={dashboardData.pie} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;