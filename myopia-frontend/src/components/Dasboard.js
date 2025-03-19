import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  History, 
  BookOpen, 
  Users, 
  Settings,
  Eye,
  PieChart,
  
} from 'lucide-react';

// Import your separate component files for other sections
import Detection from './Detection';
import PubMedArticles from './PubMedArticles';
import Patients from './Patients';

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} /> },
    { name: 'Detection', icon: <Search size={20} /> },
    { name: 'History', icon: <History size={20} /> },
    { name: 'Articles', icon: <BookOpen size={20} /> },
    { name: 'Patients', icon: <Users size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> }
  ];

  const DashboardContent = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center mb-2">
            <Eye className="text-blue-500 mr-2" />
            <h4 className="font-medium">Recent Scans</h4>
          </div>
          <p className="text-2xl font-bold">24</p>
          <p className="text-sm text-gray-500">Last 7 days</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center mb-2">
            <PieChart className="text-green-500 mr-2" />
            <h4 className="font-medium">Detection Rate</h4>
          </div>
          <p className="text-2xl font-bold">87%</p>
          <p className="text-sm text-gray-500">+2.3% from last month</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center mb-2">
            <Users className="text-purple-500 mr-2" />
            <h4 className="font-medium">Active Patients</h4>
          </div>
          <p className="text-2xl font-bold">156</p>
          <p className="text-sm text-gray-500">12 new this week</p>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow border border-gray-200">
        <h4 className="font-medium mb-3">Recent Activity</h4>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start pb-3 border-b border-gray-100">
              <div className="bg-blue-100 p-2 rounded mr-3">
                <Eye className="text-blue-600" size={16} />
              </div>
              <div>
                <p className="font-medium">Patient scan completed</p>
                <p className="text-sm text-gray-500">Patient ID: 10{i}24 • {i * 2} hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render content based on active menu item
  const renderContent = () => {
    switch (activeItem) {
      case 'Dashboard':
        return <DashboardContent />;
      case 'Detection':
        return <Detection />;
      case 'History':
        return <Detection />;
      case 'Articles':
        return <PubMedArticles />;
      case 'Patients':
        return <Patients />;
      case 'Settings':
        return <Detection />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
        {/* Logo */}

        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <h1 className="text-xl font-bold text-blue-500">MyopiaDx</h1>
            </div>
            </div>
        
        {/* Menu Items */}
        <nav className="mt-6">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name} className="mb-2">
                <button
                  onClick={() => setActiveItem(item.name)}
                  className={`flex items-center w-full px-4 py-3 transition-colors duration-200 ${
                    activeItem === item.name
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800">{activeItem}</h2>
        <div className="mt-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;