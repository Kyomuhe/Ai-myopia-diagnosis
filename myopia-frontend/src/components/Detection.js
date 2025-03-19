import React, { useState, useRef } from "react";
import axios from "axios";

const Detection = () => {
  const [file, setFile] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [resultPdf, setResultPdf] = useState("");
  const [specialistReview, setSpecialistReview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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
    formData.append("specialist_review", specialistReview);

    try {
      const response = await axios.post("http://127.0.0.1:5000/detect", formData);
      setResultImage(response.data.image_url);
      setResultPdf(response.data.pdf_url);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while processing the file.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Patient's Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Drag and Drop Area */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center cursor-pointer transition-colors ${
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
              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="mb-2 text-sm text-gray-700">
                <span className="font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">Image or video files</p>
              {file && (
                <p className="mt-2 text-sm font-medium text-blue-600">{file.name}</p>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Detect
          </button>
        </form>

        {resultImage && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Detection Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img 
                src={resultImage} 
                alt="Detection Result"
                className="w-full rounded-lg"
              />
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Report</h4>
                  <a 
                    href={resultPdf} 
                    download
                    className="text-blue-600 hover:underline"
                  >
                    Download Detailed PDF Report
                  </a>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Detailed Analysis by Specialist</h4>
                  <textarea
                    placeholder="Add specialist review here..."
                    value={specialistReview}
                    onChange={(e) => setSpecialistReview(e.target.value)}
                    className="w-full min-h-[200px] p-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={handleSubmit}
                    className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Myopia Dx Recommendation</h4>
                  <a className="text-blue-600 hover:underline cursor-pointer">
                    View AI treatment plan
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="mt-8 py-4 text-center text-sm text-gray-600 border-t border-gray-200">
        © 2025 Myopia DX. All rights reserved.
      </footer>
    </div>
  );
};

export default Detection;