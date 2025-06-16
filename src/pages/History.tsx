import React, { useState } from 'react';
import BarChartComponent from '../components/BarChartComponent';
import { Calendar, Filter } from 'lucide-react';
import './History.scss';

// Dummy data cho 7 ngày gần nhất
const barData = [
  { date: '2024-06-10', value: 15 },   // ban đêm thấp
  { date: '2024-06-11', value: 60 },  // ban ngày cao
  { date: '2024-06-12', value: 75 },
  { date: '2024-06-13', value: 20 },   // ban đêm thấp
  { date: '2024-06-14', value: 85 },
  { date: '2024-06-15', value: 65 },
  { date: '2024-06-16', value: 18 }    // ban đêm thấp
];

// Dummy data cho bar chart hoạt động
const activityLabels = [
  'Fall', 'Stand', 'sitting', 'sit2stand', 'Walk', 'Jog', 'Jump', 'up_stair', 'down_stair', 'stand2sit'
];
const activityData = [12, 18, 10, 8, 7, 10, 9, 6, 12, 8];
const barActivityData = activityLabels.map((label, idx) => ({ date: label, value: activityData[idx] }));

const History: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');
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
        <BarChartComponent
          data={barData}
          color="#F59E0B"
          yMax={100}
        />
        <div style={{ marginTop: '2rem' }}>
          <BarChartComponent
            data={barActivityData}
            color="#3b82f6"
            yMax={25}
          />
        </div>
      </div>
    </div>
  );
};

export default History;