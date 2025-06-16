import React from 'react';
import { ArrowRightCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="p-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to OhStem Dashboard</h1>
        <p className="text-blue-100 mb-6">Monitor and control your connected devices with ease</p>
        
        <Link 
          to="/dashboard" 
          className="inline-flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Go to Dashboard
          <ArrowRightCircle size={18} className="ml-2" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-blue-600 text-xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Real-time Monitoring</h3>
          <p className="text-gray-600">
            Track temperature, humidity, light levels and more in real time from your Adafruit feeds
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-green-600 text-xl">🔌</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Device Control</h3>
          <p className="text-gray-600">
            Manage connected devices remotely - toggle lights, control door locks and more
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-purple-600 text-xl">📈</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Data History</h3>
          <p className="text-gray-600">
            View historical data and trends to better understand your environment
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>
            <span className="font-medium">Connect your OhStem device</span> - Ensure your device is properly connected and sending data to Adafruit
          </li>
          <li>
            <span className="font-medium">Configure your Adafruit account</span> - Enter your Adafruit credentials in the Settings page
          </li>
          <li>
            <span className="font-medium">Explore the dashboard</span> - View real-time data and control your connected devices
          </li>
          <li>
            <span className="font-medium">Check history</span> - Analyze trends and patterns in your data over time
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Home;