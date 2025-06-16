import React, { useEffect, useState } from 'react';
import './ChartComponent.scss';

interface DataPoint {
  time: string;
  value: number;
}

interface ChartComponentProps {
  title: string;
  data: DataPoint[];
  color: string;
  unit: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ title, data, color, unit }) => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  
  useEffect(() => {
    setChartData(data);
  }, [data]);

  const maxValue = Math.max(...data.map(point => point.value)) * 1.1;
  const minValue = Math.min(...data.map(point => point.value)) * 0.9;
  const chartHeight = 200;
  
  const normalizeValue = (value: number) => {
    return chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
  };

  return (
    <div className="chart">
      <h3 className="chart__title">{title}</h3>
      
      <div className="chart__container">
        {/* Y-axis labels */}
        <div className="chart__y-axis">
          <span>{Math.round(maxValue * 10) / 10}{unit}</span>
          <span>{Math.round(((maxValue + minValue) / 2) * 10) / 10}{unit}</span>
          <span>{Math.round(minValue * 10) / 10}{unit}</span>
        </div>
        
        {/* Chart area */}
        <div className="chart__area">
          {/* Horizontal grid lines */}
          <div className="chart__grid chart__grid--top"></div>
          <div className="chart__grid chart__grid--middle"></div>
          <div className="chart__grid chart__grid--bottom"></div>
          
          {/* Line chart */}
          <svg className="chart__line">
            {chartData.length > 1 && (
              <path
                d={`M ${chartData.map((point, index) => 
                  `${(index / (chartData.length - 1)) * 100}% ${normalizeValue(point.value)}`
                ).join(' L ')}`}
                fill="none"
                stroke={color}
                strokeWidth="2"
                className="chart__path"
              />
            )}
            
            {/* Data points */}
            {chartData.map((point, index) => (
              <circle
                key={index}
                cx={`${(index / (chartData.length - 1)) * 100}%`}
                cy={normalizeValue(point.value)}
                r="3"
                fill="white"
                stroke={color}
                strokeWidth="2"
                className="chart__point"
              />
            ))}
          </svg>
          
          {/* X-axis labels */}
          <div className="chart__x-axis">
            {chartData.filter((_, i) => i % Math.ceil(chartData.length / 5) === 0 || i === chartData.length - 1).map((point, index) => (
              <span key={index}>{point.time}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;