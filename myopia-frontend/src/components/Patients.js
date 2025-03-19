import React from 'react';
import { 
    Search, 
    UserPlus
  } from 'lucide-react';
  



const Patients = () => {
    return(
    <div>
      <h3 className="text-xl font-semibold mb-4">Patient Management</h3>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search patients..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <UserPlus size={18} className="mr-2" />
          Add Patient
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">ID</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">Name</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">Age</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">Status</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">Last Scan</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">Risk Level</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: '10124', name: 'Emma Johnson', age: 10, status: 'Active', lastScan: 'Mar 18, 2025', risk: 'High' },
                { id: '10125', name: 'Noah Williams', age: 8, status: 'Active', lastScan: 'Mar 15, 2025', risk: 'Low' },
                { id: '10126', name: 'Olivia Brown', age: 12, status: 'Active', lastScan: 'Mar 10, 2025', risk: 'Medium' },
                { id: '10127', name: 'Liam Davis', age: 9, status: 'Inactive', lastScan: 'Feb 28, 2025', risk: 'High' },
                { id: '10128', name: 'Ava Miller', age: 11, status: 'Active', lastScan: 'Feb 25, 2025', risk: 'Low' },
              ].map((patient) => (
                <tr key={patient.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{patient.id}</td>
                  <td className="py-3 px-4 font-medium">{patient.name}</td>
                  <td className="py-3 px-4">{patient.age}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{patient.lastScan}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      patient.risk === 'High' ? 'bg-red-100 text-red-800' :
                      patient.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {patient.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                      <button className="text-gray-600 hover:text-gray-800">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-500">Showing 5 of 156 patients</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default Patients;