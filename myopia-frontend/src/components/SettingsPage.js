import React, { useState } from 'react';

const SettingsPage = () => {
  // State for settings
  const [settings, setSettings] = useState({
    diagnosisThreshold: 0.75,
    autoSaveReports: true,
    notificationsEnabled: true,
    darkMode: false,
    imageQuality: 'high',
    anonymizeData: true,
    language: 'english',
    retinaScanResolution: 'standard',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle numeric input changes with validation
  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
      setSettings({
        ...settings,
        [name]: numValue,
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would save settings to your backend or localStorage
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">System Settings</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Diagnosis Settings Section */}
            <div className="col-span-full">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Diagnosis Settings</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosis Threshold (0-1)
                </label>
                <input
                  type="number"
                  name="diagnosisThreshold"
                  value={settings.diagnosisThreshold}
                  onChange={handleNumericChange}
                  step="0.01"
                  min="0"
                  max="1"
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Higher values increase specificity, lower values increase sensitivity.
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Retina Scan Resolution
                </label>
                <select
                  name="retinaScanResolution"
                  value={settings.retinaScanResolution}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="standard">Standard (1024×768)</option>
                  <option value="high">High (2048×1536)</option>
                  <option value="ultra">Ultra (4096×3072)</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Quality
                </label>
                <select
                  name="imageQuality"
                  value={settings.imageQuality}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low (faster processing)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (better diagnosis)</option>
                </select>
              </div>
            </div>

            {/* System Settings Section */}
            <div className="col-span-full">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">System Settings</h2>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="autoSaveReports"
                  name="autoSaveReports"
                  checked={settings.autoSaveReports}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoSaveReports" className="ml-2 block text-sm text-gray-700">
                  Auto-save reports after diagnosis
                </label>
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="notificationsEnabled"
                  name="notificationsEnabled"
                  checked={settings.notificationsEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-gray-700">
                  Enable notifications
                </label>
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="darkMode"
                  name="darkMode"
                  checked={settings.darkMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
                  Dark mode
                </label>
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="anonymizeData"
                  name="anonymizeData"
                  checked={settings.anonymizeData}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="anonymizeData" className="ml-2 block text-sm text-gray-700">
                  Anonymize patient data for research
                </label>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  System Language
                </label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="chinese">Chinese</option>
                  <option value="japanese">Japanese</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => window.location.reload()}
            >
              Reset to Default
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
  );
};

export default SettingsPage;