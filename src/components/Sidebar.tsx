import React from 'react';
import { Home, LayoutDashboard, History, LogOut, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: <Home size={24} />, label: 'Home' },
    { path: '/dashboard', icon: <LayoutDashboard size={24} />, label: 'Dashboard' },
    { path: '/history', icon: <History size={24} />, label: 'History' },
    { path: '/settings', icon: <Settings size={24} />, label: 'Settings' },
  ];

  return (
    <div className="sidebar h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-purple-800 text-white w-72 flex flex-col relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      {/* Logo section */}
      <div className="relative p-8">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl p-3 rounded-2xl">
            <img 
              src="https://ohstem.vn/wp-content/uploads/2022/01/OhStem-Logo-2.png" 
              alt="OhStem Logo" 
              className="w-10 h-10 object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-xl">OhStem</h1>
            <p className="text-xs text-white/60">Adafruit Dashboard</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center px-4 py-3 rounded-xl transition-all duration-200
                  ${location.pathname === item.path
                    ? 'bg-white/15 shadow-lg shadow-white/5'
                    : 'hover:bg-white/10'
                  }
                `}
              >
                <span className={`
                  p-2 rounded-lg mr-3 transition-colors duration-200
                  ${location.pathname === item.path
                    ? 'bg-white/20 text-white'
                    : 'text-white/60'
                  }
                `}>
                  {item.icon}
                </span>
                <span className={`font-medium ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-white/60'
                }`}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User section */}
      <div className="p-4 mt-6">
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
              <span className="text-lg font-semibold">A</span>
            </div>
            <div>
              <h3 className="font-medium">Admin User</h3>
              <p className="text-xs text-white/60">admin@ohstem.vn</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg py-2 text-sm">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;