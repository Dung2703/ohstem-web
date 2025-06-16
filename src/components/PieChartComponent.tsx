import React from 'react';
import './PieChartComponent.scss';

const LABELS = [
  'Fall', 'Stand', 'sitting', 'sit2stand', 'Walk', 'Jog', 'Jump', 'up_stair', 'down_stair', 'stand2sit'
];

const COLORS = [
  '#ef4444', '#3b82f6', '#f472b6', '#64748b', '#10b981', '#f59e42', '#a855f7', '#fbbf24', '#6366f1', '#14b8a6'
];

interface PieChartComponentProps {
  data: number[]; // phần trăm cho từng nhãn, tổng 100
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data }) => {
  // Tính góc cho từng phần
  let cumulative = 0;
  const slices = data.map((percent, idx) => {
    const startAngle = cumulative;
    const angle = (percent / 100) * 360;
    cumulative += angle;
    const largeArc = angle > 180 ? 1 : 0;
    const x1 = 100 + 100 * Math.cos((Math.PI * (startAngle - 90)) / 180);
    const y1 = 100 + 100 * Math.sin((Math.PI * (startAngle - 90)) / 180);
    const x2 = 100 + 100 * Math.cos((Math.PI * (startAngle + angle - 90)) / 180);
    const y2 = 100 + 100 * Math.sin((Math.PI * (startAngle + angle - 90)) / 180);
    const d = `M100,100 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`;
    return (
      <path key={idx} d={d} fill={COLORS[idx]} />
    );
  });

  return (
    <div className="pie-chart">
      <svg viewBox="0 0 200 200" className="pie-chart__svg">
        {slices}
      </svg>
      <div className="pie-chart__legend-rows">
        <div className="pie-chart__legend-row">
          {LABELS.slice(0, 4).map((label, idx) => (
            <div className="pie-chart__legend-item" key={label}>
              <span className="pie-chart__legend-color" style={{ background: COLORS[idx] }}></span>
              <span className="pie-chart__legend-label">{label}</span>
              <span className="pie-chart__legend-value">{data[idx]}%</span>
            </div>
          ))}
        </div>
        <div className="pie-chart__legend-row">
          {LABELS.slice(4, 7).map((label, idx) => (
            <div className="pie-chart__legend-item" key={label}>
              <span className="pie-chart__legend-color" style={{ background: COLORS[idx+4] }}></span>
              <span className="pie-chart__legend-label">{label}</span>
              <span className="pie-chart__legend-value">{data[idx+4]}%</span>
            </div>
          ))}
        </div>
        <div className="pie-chart__legend-row">
          {LABELS.slice(7).map((label, idx) => (
            <div className="pie-chart__legend-item" key={label}>
              <span className="pie-chart__legend-color" style={{ background: COLORS[idx+7] }}></span>
              <span className="pie-chart__legend-label">{label}</span>
              <span className="pie-chart__legend-value">{data[idx+7]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent; 