import React, { useState } from "react";
import axios from "axios";
import './Dashboard.css';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [resultPdf, setResultPdf] = useState("");
  const [detailedResults, setDetailedResults] = useState("");
  const [activeTab, setActiveTab] = useState("detection");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

    try {
      const response = await axios.post("http://127.0.0.1:5000/detect", formData);
      setResultImage(response.data.image_url);
      setResultPdf(response.data.pdf_url);
      setDetailedResults(response.data.detailed_results);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while processing the file.");
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case "detection":
        return (
          <div className="content-section">
            <h2>Pathological Myopia Detection</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Patient's Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
              <div className="file-submit-container">
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  accept="image/*,video/*"
                />
                <button type="submit">Detect</button>
              </div>
            </form>

            {resultImage && (
              <div className="results-container">
                <h3>Detection Results</h3>
                <div className="results-grid">
                  <img 
                    src={resultImage} 
                    alt="Detection Result"
                  />
                  <div className="results-details">
                    <div className="result-card">
                      <h4>Report</h4>
                      <a 
                        href={resultPdf} 
                        download
                      >
                        Download Detailed PDF Report
                      </a>
                    </div>
                    <div className="result-card">
                      <h4>Detailed Analysis</h4>
                      <p>{detailedResults}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "recommendations":
        return (
          <div className="content-section">
            <h2>Medical Recommendations</h2>
            <p>Recommendations will be displayed here based on detection results.</p>
          </div>
        );
      case "articles":
        return (
          <div className="content-section">
            <h2>Related Medical Articles</h2>
            <p>Recent medical research and articles about pathological myopia will be curated here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Pathological Myopia Detection System</h1>
      </header>
      
      <div className="tabs-container">
        <div 
          className={`tab ${activeTab === "detection" ? "active" : ""}`}
          onClick={() => setActiveTab("detection")}
        >
          Detection
        </div>
        <div 
          className={`tab ${activeTab === "recommendations" ? "active" : ""}`}
          onClick={() => setActiveTab("recommendations")}
        >
          Recommendations
        </div>
        <div 
          className={`tab ${activeTab === "articles" ? "active" : ""}`}
          onClick={() => setActiveTab("articles")}
        >
          Articles
        </div>
      </div>
      

      {renderContent()}
      <footer className="footer">
        © 2025 Myopia DX. All rights reserved.
      </footer>


    </div>
    
  );
};

export default UploadForm;