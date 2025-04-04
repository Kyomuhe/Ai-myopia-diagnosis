import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Home, 
  Search, 
  History, 
  BookOpen, 
  Users, 
  Settings,
  Eye,
  PieChart,
  LogOut,
  Bell,
  Brain
} from 'lucide-react';

import Detection from './Detection';
import PubMedArticles from './PubMedArticles';
import Patients from './Patients';
import SettingsPage from './SettingsPage';
import PatientHistoryPage from './PatientHistoryPage';
import profile3 from '../images/profile3.PNG';
import Recommendation from './Recommendation';

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Check for authentication on component mount
  useEffect(() => {
    // Try to get user data from storage (localStorage first, then sessionStorage)
    const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      // If no user data found, redirect to sign-in
      navigate('/signin');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data from storage
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    
    // Redirect to sign in page
    navigate('/signin');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} /> },
    { name: 'Detection', icon: <Search size={20} /> },
    { name: 'History', icon: <History size={20} /> },
    { name: 'Articles', icon: <BookOpen size={20} /> },
    { name: 'Patients', icon: <Users size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> },
    { name: 'AI Recommendation', icon: <Brain size={20} /> }
  ];

  const DashboardContent = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, Doctor {userData ? userData.fullName : 'Doctor'}
          </h2>
          <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="text-right mr-2">
              <p className="text-sm font-medium">{userData ? userData.fullName : 'Doctor'}</p>
              <p className="text-xs text-gray-500">{userData ? userData.specialty : 'Specialist'}</p>
            </div>
            <div className="relative">
              <img 
                src={profile3} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
          </div>
        </div>
      </div>
      
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
        return <PatientHistoryPage />;
      case 'Articles':
        return <PubMedArticles />;
      case 'Patients':
        return <Patients />;
      case 'Settings':
        return <SettingsPage />;
      case 'AI Recommendation':
        return <Recommendation />;
      default:
        return <DashboardContent />;
    }
  };

  // Show loading state while checking authentication
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
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
        <nav className="mt-6 flex-grow">
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
        
        {/* Logout Button */}
        <div className="mt-auto border-t border-gray-200 p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
          >
            <span className="mr-3"><LogOut size={20} /></span>
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mt-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;