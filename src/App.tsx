import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;