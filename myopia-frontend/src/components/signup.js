import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ userType: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User type:', formData.userType);

    if (formData.userType === 'Professional Account') {
      navigate('/ProfessionalRegistration');
    }
    if (formData.userType === 'Normal Account') {
      navigate('/NormalAccountForm');
    }

    console.log('Form submitted:', formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Choose Type of Account</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Note: Professional accounts are for medical personnel
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="professional" className="flex items-center">
              <input
                type="radio"
                id="professional"
                name="userType"
                value="Professional Account"
                onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                required
                className="mr-2 text-primary focus:ring-primary focus:ring-offset-0 focus:ring-2"
              />
              <span className="text-gray-700">Professional Account</span>
            </label>
          </div>
          <div className="mb-6">
            <label htmlFor="normal" className="flex items-center">
              <input
                type="radio"
                id="normal"
                name="userType"
                value="Normal Account"
                onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                required
                className="mr-2 text-primary focus:ring-primary focus:ring-offset-0 focus:ring-2"
              />
              <span className="text-gray-700">Normal Account</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
