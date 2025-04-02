import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const Detection = () => {
  const [file, setFile] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [resultPdf, setResultPdf] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  // State for patient search and selection
  const [existingPatients, setExistingPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Clinical measurements
  const [specialistReview, setSpecialistReview] = useState("");

  // Fetch existing patients on component mount
  useEffect(() => {
    fetchExistingPatients();
  }, []);

  const fetchExistingPatients = async () => {
    try {
      // will replace with actual endpoint
      const response = await axios.get("http://127.0.0.1:5000/patients");
      setExistingPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      // sample data
      setExistingPatients([
        { id: 1, name: "John Doe", age: 42 },
        { id: 2, name: "Jane Smith", age: 35 },
        { id: 3, name: "Robert Johnson", age: 58 }
      ]);
    }
  };

  const handlePatientSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowPatientDropdown(true);
    
    if (term.trim() === "") {
      setFilteredPatients([]);
      return;
    }
    
    const filtered = existingPatients.filter(patient => 
      patient.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const selectPatient = (patient) => {
    setPatientName(patient.name);
    setPatientAge(patient.age.toString());
    setSearchTerm(patient.name);
    setShowPatientDropdown(false);
    setIsNewPatient(false);
  };

  const handleToggleNewPatient = () => {
    setIsNewPatient(!isNewPatient);
    if (!isNewPatient) {
      setPatientName("");
      setPatientAge("");
      setSearchTerm("");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !patientName) {
      alert("Please select a file and enter the patient's name!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient_name", patientName);
    formData.append("patient_age", patientAge);
    formData.append("is_new_patient", isNewPatient.toString());
    formData.append("specialist_review", specialistReview);

    try {
      const response = await axios.post("http://127.0.0.1:5000/detect", formData);
      setResultImage(response.data.image_url);
      setResultPdf(response.data.pdf_url);
      
      // If successful and it's a new patient, refresh the patient list
      if (isNewPatient) {
        fetchExistingPatients();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while processing the file.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Myopia Detection & Analysis</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Patient Selection Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-lg font-semibold text-gray-700">
                Patient Information
              </label>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">New Patient</span>
                <button 
                  type="button"
                  onClick={handleToggleNewPatient}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    isNewPatient ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isNewPatient ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            {isNewPatient ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newPatientName" className="block text-xs text-gray-500 mb-1">
                    Patient's Full Name
                  </label>
                  <input
                    id="newPatientName"
                    type="text"
                    placeholder="Enter full name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="patientAge" className="block text-xs text-gray-500 mb-1">
                    Patient's Age
                  </label>
                  <input
                    id="patientAge"
                    type="number"
                    placeholder="Enter age"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for existing patient"
                  value={searchTerm}
                  onChange={handlePatientSearch}
                  onFocus={() => setShowPatientDropdown(true)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                {showPatientDropdown && filteredPatients.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredPatients.map(patient => (
                      <div 
                        key={patient.id}
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex justify-between"
                        onClick={() => selectPatient(patient)}
                      >
                        <span>{patient.name}</span>
                        <span className="text-gray-500">{patient.age} years</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Drag and Drop Area */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Upload Retinal Image or Video
            </label>
            <div 
              className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                accept="image/*,video/*"
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-700">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">Images only</p>
                {file && (
                  <p className="mt-3 text-sm font-medium text-blue-600">{file.name}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Specialist Review */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Specialist Review
            </label>
            <textarea
              placeholder="Add your clinical observations and assessment here..."
              value={specialistReview}
              onChange={(e) => setSpecialistReview(e.target.value)}
              className="w-full min-h-[120px] p-4 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-base"
            >
              Analyse Image
            </button>
          </div>
        </form>

        {resultImage && (
          <div className="mt-10 border-t pt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Detection Results</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <img 
                  src={resultImage} 
                  alt="Detection Result"
                  className="w-full rounded-lg shadow"
                />
              </div>
              
              <div className="space-y-5">
                <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-3">Patient Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name:</p>
                      <p className="font-medium">{patientName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Age:</p>
                      <p className="font-medium">{patientAge} years</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-3">Report</h4>
                  <a 
                    href={resultPdf} 
                    download
                    className="inline-flex items-center text-blue-600 hover:underline"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                    </svg>
                    Download Detailed PDF Report
                  </a>
                </div>
                
                <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-3">Specialist Review</h4>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200 min-h-[100px]">
                    {specialistReview ? 
                      <p>{specialistReview}</p> : 
                      <p className="text-gray-400 italic">No specialist review provided yet</p>
                    }
                  </div>
                  <button 
                    onClick={handleSubmit}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Update Review
                  </button>
                </div>
                
                <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-3">Myopia Dx Recommendation</h4>
                  <Link className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors" to="/Recommendation">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    View AI Treatment Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detection;