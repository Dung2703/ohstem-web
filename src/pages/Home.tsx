import React from 'react';
import { ArrowRightCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.scss';

const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="home__hero">
        <h1>Welcome to OhStem Dashboard</h1>
        <p>Monitor and control your connected devices with ease</p>
        
        <Link to="/dashboard" className="home__dashboard-link">
          Go to Dashboard
          <ArrowRightCircle size={18} />
        </Link>
      </div>
      
      <div className="home__features">
        <div className="home__feature-card">
          <div className="home__feature-icon">
            <span>📊</span>
          </div>
          <h3 className="home__feature-title">Real-time Monitoring</h3>
          <p className="home__feature-description">
            Track temperature, humidity, light levels and more in real time from your Adafruit feeds
          </p>
        </div>
        
        <div className="home__feature-card">
          <div className="home__feature-icon home__feature-icon--green">
            <span>🔌</span>
          </div>
          <h3 className="home__feature-title">Device Control</h3>
          <p className="home__feature-description">
            Manage connected devices remotely - toggle lights, control door locks and more
          </p>
        </div>
        
        <div className="home__feature-card">
          <div className="home__feature-icon home__feature-icon--purple">
            <span>📈</span>
          </div>
          <h3 className="home__feature-title">Data History</h3>
          <p className="home__feature-description">
            View historical data and trends to better understand your environment
          </p>
        </div>
      </div>
      
      <div className="home__getting-started">
        <h2>Getting Started</h2>
        
        <ol className="home__steps">
          <li>
            <span>Connect your OhStem device</span> - Ensure your device is properly connected and sending data to Adafruit
          </li>
          <li>
            <span>Configure your Adafruit account</span> - Enter your Adafruit credentials in the Settings page
          </li>
          <li>
            <span>Explore the dashboard</span> - View real-time data and control your connected devices
          </li>
          <li>
            <span>Check history</span> - Analyze trends and patterns in your data over time
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Home;