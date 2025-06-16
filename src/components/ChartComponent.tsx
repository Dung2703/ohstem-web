import React, { useEffect, useState } from 'react';
import './ChartComponent.scss';

interface DataPoint {
  time?: string;
  value?: number;
  x?: number;
  y?: number;
}

interface ChartComponentProps {
  title?: string;
  data: DataPoint[];
  color: string;
  unit: string;
  xLabel?: string;
  yLabel?: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ title, data, color, unit, xLabel, yLabel, xMin, xMax, yMin, yMax }) => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  
  useEffect(() => {
    setChartData(data);
  }, [data]);

  // Nếu là dữ liệu dạng {x, y} (fall time)
  const isXY = data.length > 0 && data[0].x !== undefined && data[0].y !== undefined;

  // Xử lý cho dữ liệu dạng {x, y}
  let minX = xMin ?? 0;
  let maxX = xMax ?? 1;
  let minY = yMin ?? 0;
  let maxY = yMax ?? 1;
  if (isXY) {
    minX = xMin ?? Math.min(...data.map(p => p.x!));
    maxX = xMax ?? Math.max(...data.map(p => p.x!));
    minY = yMin ?? Math.min(...data.map(p => p.y!));
    maxY = yMax ?? Math.max(...data.map(p => p.y!));
  }
  const chartHeight = 200;
  const chartWidth = 1000;

  // Hàm chuyển đổi giá trị y sang toạ độ SVG
  const normalizeY = (y: number) => {
    return chartHeight - ((y - minY) / (maxY - minY)) * chartHeight;
  };
  // Hàm chuyển đổi giá trị x sang toạ độ SVG
  const normalizeX = (x: number) => {
    return ((x - minX) / (maxX - minX)) * chartWidth;
  };

  // Chuẩn bị sẵn các giá trị min/max cho kiểu cũ
  const minValue = Math.min(...data.map(point => point.value ?? 0)) * 0.9;
  const maxValue = Math.max(...data.map(point => point.value ?? 0)) * 1.1;
  // Hàm chuyển value sang toạ độ SVG cho kiểu cũ
  const normalizeValue = (value: number) => {
    return chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
  };
  // Chuẩn bị sẵn dPath cho kiểu cũ
  let dPath = '';
  if (!isXY && chartData.length > 1) {
    dPath = 'M ' + chartData.map((point, index) => {
      const x = (index / (chartData.length - 1)) * 100 + '%';
      const y = normalizeValue(point.value!);
      return `${x} ${y}`;
    }).join(' L ');
  }

  // Tạo nhãn trục Ox cho dữ liệu dạng {x, y} (giờ)
  let xTicks: number[] = [];
  if (isXY) {
    for (let h = minX; h <= maxX; h += 2) {
      xTicks.push(h);
    }
  }

  // Tạo nhãn trục Oy cho dữ liệu dạng {x, y} (fall time)
  let yTicks: number[] = [];
  if (isXY) {
    for (let y = minY; y <= maxY; y += 5) {
      yTicks.push(y);
    }
  }

  return (
    <div className="chart">
      {title && <h3 className="chart__title">{title}</h3>}
      
      <div className="chart__container" style={isXY ? {height: chartHeight, width: chartWidth, position: 'relative'} : {}}>
        {/* Y-axis labels */}
        <div className="chart__y-axis" style={isXY ? {height: chartHeight, position: 'absolute', left: 0, top: 0, width: 40} : {}}>
          {isXY ? (
            yTicks.map((tick, idx) => (
              <span key={idx} style={{
                position: 'absolute',
                top: `${((maxY - tick) / (maxY - minY)) * 100}%`,
                left: 0,
                transform: 'translateY(50%)',
                fontSize: '0.75rem',
                color: '#6b7280',
                width: '100%',
                display: 'block'
              }}>{tick}{unit}</span>
            ))
          ) : (
            <>
              <span>{Math.round(Math.max(...data.map(point => point.value!)) * 1.1 * 10) / 10}{unit}</span>
              <span>{Math.round(((Math.max(...data.map(point => point.value!)) * 1.1 + Math.min(...data.map(point => point.value!)) * 0.9) / 2) * 10) / 10}{unit}</span>
              <span>{Math.round(Math.min(...data.map(point => point.value!)) * 0.9 * 10) / 10}{unit}</span>
            </>
          )}
        </div>
        
        {/* Chart area */}
        <div className="chart__area" style={isXY ? {left: 40, right: 0, width: chartWidth, height: chartHeight} : {}}>
          {/* Grid lines cho XY */}
          {isXY && (
            <>
              <line x1={0} y1={normalizeY(maxY)} x2={chartWidth} y2={normalizeY(maxY)} stroke="#f3f4f6" strokeWidth={1} />
              <line x1={0} y1={normalizeY((maxY+minY)/2)} x2={chartWidth} y2={normalizeY((maxY+minY)/2)} stroke="#f3f4f6" strokeWidth={1} />
              <line x1={0} y1={normalizeY(minY)} x2={chartWidth} y2={normalizeY(minY)} stroke="#f3f4f6" strokeWidth={1} />
            </>
          )}
          {/* Line chart XY */}
          {isXY ? (
            <svg width={chartWidth} height={chartHeight} className="chart__line">
              {chartData.length > 1 && (
                <polyline
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  points={chartData.map(point => `${normalizeX(point.x!)} ${normalizeY(point.y!)}`).join(' ')}
                  className="chart__path"
                />
              )}
              {/* Data points */}
              {chartData.map((point, index) => (
                <circle
                  key={index}
                  cx={normalizeX(point.x!)}
                  cy={normalizeY(point.y!)}
                  r="3"
                  fill="white"
                  stroke={color}
                  strokeWidth="2"
                  className="chart__point"
                />
              ))}
            </svg>
          ) : (
            // Kiểu cũ
            <svg className="chart__line">
              {chartData.length > 1 && (
                <path
                  d={dPath}
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
                  cy={normalizeValue(point.value!)}
                  r="3"
                  fill="white"
                  stroke={color}
                  strokeWidth="2"
                  className="chart__point"
                />
              ))}
            </svg>
          )}
          
          {/* X-axis labels */}
          <div className="chart__x-axis">
            {isXY ? (
              xTicks.map((tick, idx) => (
                <span key={idx} style={{
                  position: 'absolute',
                  left: `${((tick - minX) / (maxX - minX)) * 100}%`,
                  transform: 'translateX(-50%)'
                }}>{tick}h</span>
              ))
            ) : (
              chartData.filter((_, i) => i % Math.ceil(chartData.length / 5) === 0 || i === chartData.length - 1).map((point, index) => (
                <span key={index}>{point.time}</span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;