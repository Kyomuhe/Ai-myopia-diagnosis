import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, FileText, Search, Users } from 'lucide-react';

const PatientHistoryPage = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  
  // Sample patient data
  const patient = {
    id: "PM-20250307-0042",
    name: "Sarah Mitchell",
    age: 42,
    firstDiagnosed: "March 7, 2023",
    riskLevel: "High"
  };
  
  // Sample patients for search results
  const samplePatients = [
    { id: "PM-20250307-0042", name: "Sarah Mitchell", age: 42 },
    { id: "PM-20250216-0038", name: "David Thompson", age: 56 },
    { id: "PM-20250122-0027", name: "Maria Garcia", age: 38 },
    { id: "PM-20241118-0015", name: "James Wilson", age: 61 },
    { id: "PM-20241005-0009", name: "Linda Chen", age: 45 }
  ];
  
  // Sample examination history
  const examHistory = [
    {
      id: 1,
      date: "March 7, 2023",
      doctor: "Dr. Emily Chen",
      axialLength: { right: 27.6, left: 28.1 },
      refraction: { right: "-8.75", left: "-9.25" },
      visualAcuity: { right: "20/70", left: "20/100" },
      fundusImaging: true,
      octScan: true,
      findings: "Initial diagnosis. Posterior staphyloma in both eyes. Early signs of lacquer cracks in left eye. Recommend quarterly monitoring.",
      risk: "Moderate",
      recommendations: "Blue light filtering lenses, regular monitoring, limited screen time."
    },
    {
      id: 2,
      date: "June 15, 2023",
      doctor: "Dr. Emily Chen",
      axialLength: { right: 27.8, left: 28.3 },
      refraction: { right: "-9.00", left: "-9.50" },
      visualAcuity: { right: "20/80", left: "20/120" },
      fundusImaging: true,
      octScan: true,
      findings: "Progression noted. Increased chorioretinal atrophy in left eye. New small lacquer cracks in right eye.",
      risk: "High",
      recommendations: "Consider anti-VEGF therapy for left eye. Continue monitoring. Consult with retinal specialist."
    },
    {
      id: 3,
      date: "October 3, 2023",
      doctor: "Dr. Michael Wong",
      axialLength: { right: 27.9, left: 28.4 },
      refraction: { right: "-9.25", left: "-9.75" },
      visualAcuity: { right: "20/90", left: "20/150" },
      fundusImaging: true,
      octScan: true,
      findings: "Myopic CNV developing in left eye. Increased lacquer cracks in right eye. Recommend immediate treatment.",
      risk: "Severe",
      recommendations: "Immediate anti-VEGF injections for left eye. Monthly monitoring. Photodynamic therapy consideration."
    },
    {
      id: 4,
      date: "January 18, 2024",
      doctor: "Dr. Michael Wong",
      axialLength: { right: 27.9, left: 28.5 },
      refraction: { right: "-9.25", left: "-10.00" },
      visualAcuity: { right: "20/90", left: "20/200" },
      fundusImaging: true,
      octScan: true,
      findings: "Post-treatment evaluation. CNV shows response to anti-VEGF. Continued monitoring needed.",
      risk: "High",
      recommendations: "Continue anti-VEGF therapy. Monthly monitoring. Low vision aids for daily activities."
    },
    {
      id: 5,
      date: "March 2, 2025",
      doctor: "Dr. Emily Chen",
      axialLength: { right: 28.0, left: 28.5 },
      refraction: { right: "-9.50", left: "-10.00" },
      visualAcuity: { right: "20/100", left: "20/200" },
      fundusImaging: true,
      octScan: true,
      findings: "Stabilization in left eye after treatment course. Minor progression in right eye. Recommend continued monitoring.",
      risk: "High",
      recommendations: "Continue monitoring. Consider prophylactic treatment for right eye. Vision rehabilitation consultation."
    }
  ];
  
  // Risk level color mapping
  const getRiskColor = (risk) => {
    switch(risk) {
      case "Low": return "bg-green-100 text-green-800";
      case "Moderate": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Severe": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Filter patients based on search query
  const filteredPatients = samplePatients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="p-6 bg-gray-50">
      {/* Patient Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Patient History</h2>
          <div className="relative">
            <div className="flex">
              <div className="relative w-64 mr-2">
                <input
                  type="text"
                  className="w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search patient name or ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowPatientDropdown(true);
                  }}
                  onFocus={() => setShowPatientDropdown(true)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                
                {showPatientDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((p) => (
                        <div 
                          key={p.id} 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                          onClick={() => {
                            setSearchQuery('');
                            setShowPatientDropdown(false);
                          }}
                        >
                          <span>{p.name}</span>
                          <span className="text-gray-500 text-sm">{p.id}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">No patients found</div>
                    )}
                  </div>
                )}
              </div>
              
              <button 
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                onClick={() => setShowPatientDropdown(!showPatientDropdown)}
              >
                <Users className="h-4 w-4 mr-2" />
                Patient List
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Patient Info Card */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
            <p className="text-gray-600">Patient ID: {patient.id} | Age: {patient.age}</p>
            <p className="text-gray-600">First Diagnosed: {patient.firstDiagnosed}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(patient.riskLevel)}`}>
            {patient.riskLevel} Risk
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Timeline List */}
        <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Examination History</h3>
          
          <div className="space-y-3">
            {examHistory.map((exam) => (
              <div 
                key={exam.id}
                className={`border-l-2 pl-3 py-2 cursor-pointer transition hover:bg-gray-50 ${
                  selectedRecord === exam.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedRecord(exam.id)}
              >
                <div className="flex justify-between">
                  <p className="font-medium text-gray-800">{exam.date}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(exam.risk)}`}>
                    {exam.risk}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{exam.doctor}</p>
                {exam.risk === "Severe" && (
                  <div className="flex items-center mt-1 text-red-600 text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    <span>Critical findings</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Detailed Record View */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
          {selectedRecord ? (
            <div>
              {(() => {
                const exam = examHistory.find(e => e.id === selectedRecord);
                return (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Examination Details
                      </h3>
                      <div className="flex space-x-2">
                        <button 
                          className="p-1 rounded hover:bg-gray-100 text-gray-600" 
                          onClick={() => setSelectedRecord(Math.max(1, selectedRecord - 1))}
                          disabled={selectedRecord === 1}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button 
                          className="p-1 rounded hover:bg-gray-100 text-gray-600" 
                          onClick={() => setSelectedRecord(Math.min(examHistory.length, selectedRecord + 1))}
                          disabled={selectedRecord === examHistory.length}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{exam.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Doctor</p>
                        <p className="font-medium">{exam.doctor}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">Measurements</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs text-gray-500">Axial Length</p>
                          <div className="flex justify-between mt-1">
                            <div>
                              <span className="text-xs text-gray-500">R</span>
                              <p className="font-semibold">{exam.axialLength.right} mm</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">L</span>
                              <p className="font-semibold">{exam.axialLength.left} mm</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs text-gray-500">Refraction</p>
                          <div className="flex justify-between mt-1">
                            <div>
                              <span className="text-xs text-gray-500">R</span>
                              <p className="font-semibold">{exam.refraction.right}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">L</span>
                              <p className="font-semibold">{exam.refraction.left}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs text-gray-500">Visual Acuity</p>
                          <div className="flex justify-between mt-1">
                            <div>
                              <span className="text-xs text-gray-500">R</span>
                              <p className="font-semibold">{exam.visualAcuity.right}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">L</span>
                              <p className="font-semibold">{exam.visualAcuity.left}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">Specialist Findings</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-700">{exam.findings}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Recommendations</h4>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-blue-700">{exam.recommendations}</p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FileText className="h-10 w-10 mb-2" />
              <p>Select an examination record to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHistoryPage;