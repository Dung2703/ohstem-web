import React from 'react';
import { PowerIcon, SunIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import './DeviceControl.scss';

interface DeviceControlProps {
  device: {
    id: 'door' | 'light';
    name: string;
    type: string;
    status: 'on' | 'off';
    brightness?: number;
  };
  onToggle: (id: 'door' | 'light') => void;
  onBrightnessChange: (id: 'door' | 'light', value: number) => void;
}

const DeviceControl: React.FC<DeviceControlProps> = ({ device, onToggle, onBrightnessChange }) => {
  return (
    <div className="device">
      <div className="device__header">
        <div className="device__title">
          {device.type === 'light' ? <SunIcon className="w-6 h-6" /> : <PowerIcon className="w-6 h-6" />}
          {device.name}
        </div>
        <div className={`device__status device__status--${device.status}`} />
      </div>

      <div className="device__features">
        <div className="device__feature device__feature--blue">
          <PowerIcon className="w-4 h-4" />
          Power <span>{device.status}</span>
        </div>
        {device.type === 'light' && (
          <div className="device__feature device__feature--green">
            <SunIcon className="w-4 h-4" />
            Brightness <span>{device.brightness}%</span>
          </div>
        )}
      </div>

      <div className="device__actions">
        <button
          className="device__button device__button--blue"
          onClick={() => onToggle(device.id)}
        >
          <PowerIcon className="w-4 h-4" />
          {device.status === 'on' ? 'Turn Off' : 'Turn On'}
        </button>

        {device.type === 'light' && (
          <button className="device__button device__button--purple">
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
            Settings
          </button>
        )}
      </div>

      {device.type === 'light' && (
        <div className="device__brightness">
          <label className="device__brightness-label">Brightness</label>
          <input
            type="range"
            min="0"
            max="100"
            value={device.brightness}
            onChange={(e) => onBrightnessChange(device.id, parseInt(e.target.value))}
            className="device__brightness-slider"
          />
        </div>
      )}
    </div>
  );
};

export default DeviceControl;