import React, { useEffect, useState } from 'react';

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
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      
      <div className="relative h-[200px] w-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>{Math.round(maxValue * 10) / 10}{unit}</span>
          <span>{Math.round(((maxValue + minValue) / 2) * 10) / 10}{unit}</span>
          <span>{Math.round(minValue * 10) / 10}{unit}</span>
        </div>
        
        {/* Chart area */}
        <div className="absolute left-8 right-0 h-full border-l border-b border-gray-200">
          {/* Horizontal grid lines */}
          <div className="absolute w-full h-0 top-0 border-t border-gray-100"></div>
          <div className="absolute w-full h-0 top-1/2 border-t border-gray-100"></div>
          <div className="absolute w-full h-0 bottom-0 border-t border-gray-100"></div>
          
          {/* Line chart */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {chartData.length > 1 && (
              <path
                d={`M ${chartData.map((point, index) => 
                  `${(index / (chartData.length - 1)) * 100}% ${normalizeValue(point.value)}`
                ).join(' L ')}`}
                fill="none"
                stroke={color}
                strokeWidth="2"
                className="transition-all duration-500"
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
                className="transition-all duration-500"
              />
            ))}
          </svg>
          
          {/* X-axis labels */}
          <div className="absolute bottom-[-20px] w-full flex justify-between text-xs text-gray-500">
            {chartData.filter((_, i) => i % Math.ceil(chartData.length / 5) === 0 || i === chartData.length - 1).map((point, index) => (
              <span key={index} className="transform -translate-x-1/2">{point.time}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;