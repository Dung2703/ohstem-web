import React, { useRef, useEffect, useState } from 'react';
import './BarChartComponent.scss';

interface BarData {
  date: string; // ví dụ: '2024-06-10'
  value: number;
}

interface BarChartComponentProps {
  data: BarData[];
  color?: string;
  yMax?: number;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data, color = '#F59E0B', yMax = 50 }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const chartHeight = 200;
  const maxValue = yMax;

  useEffect(() => {
    const updateWidth = () => {
      if (chartContainerRef.current) {
        setContainerWidth(chartContainerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Calculate barWidth and gap dynamically
  let barWidth = 0;
  let gap = 0;
  let svgWidth = containerWidth; // SVG width is the container width

  if (containerWidth > 0 && data.length > 0) {
    const minBarWidth = 30; // Minimum desired bar width to avoid too thin bars
    const minGap = 10; // Minimum gap between bars
    const totalMinBarSpace = minBarWidth * data.length;
    const totalMinGapSpace = minGap * (data.length - 1);
    
    if (totalMinBarSpace + totalMinGapSpace <= containerWidth) {
      // Enough space to fit all bars with min width and gap, distribute remaining space
      gap = minGap;
      barWidth = (containerWidth - totalMinGapSpace) / data.length;
    } else {
      // Not enough space, prioritize bar width over gap
      barWidth = Math.max(10, (containerWidth / data.length) * 0.8); // Ensure bar is not too small
      gap = (containerWidth - (barWidth * data.length)) / (data.length > 1 ? data.length - 1 : 1); // Calculate gap based on remaining space
      if (gap < 0) gap = 0; // Ensure gap is not negative
    }
  } else {
      // Fallback for initial render or empty data
      barWidth = 32;
      gap = 16;
      svgWidth = (barWidth + gap) * data.length; // Use fallback svgWidth if containerWidth is 0
  }

  return (
    <div className="bar-chart" ref={chartContainerRef}>
      <div className="bar-chart__container" style={{ height: chartHeight, width: '100%' }}>
        {/* Y-axis labels */}
        <div className="bar-chart__y-axis">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue / 2)}</span>
          <span>0</span>
        </div>
        {/* Bars */}
        <svg width={svgWidth} height={chartHeight} className="bar-chart__svg">
          {data.map((d, idx) => {
            const barHeight = (d.value / maxValue) * chartHeight;
            return (
              <g key={d.date}>
                <rect
                  x={idx * (barWidth + gap)}
                  y={chartHeight - barHeight}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  rx={6}
                />
                <text
                  x={idx * (barWidth + gap) + barWidth / 2}
                  y={chartHeight - barHeight - 8}
                  textAnchor="middle"
                  fontSize={14}
                  fill="#374151"
                >{d.value}</text>
              </g>
            );
          })}
        </svg>
        {/* X-axis labels */}
        <div className="bar-chart__x-axis" style={{ width: svgWidth }}>
          {data.map((d, idx) => (
            <span
              key={d.date}
              style={{
                position: 'absolute',
                left: `${idx * (barWidth + gap) + barWidth / 2}px`,
                transform: 'translateX(-50%)',
                minWidth: barWidth, // Use minWidth to allow wrapping/truncation if needed
                maxWidth: barWidth + gap, // Max width for the label container
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              {d.date}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarChartComponent; 