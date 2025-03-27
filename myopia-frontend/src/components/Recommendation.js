import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Recommendation = () => {
  const [patientName, setPatientName] = useState("");
  const [axialLength, setAxialLength] = useState("");
  const [refraction, setRefraction] = useState({
    right: "",
    left: ""
  });
  const [visualAcuity, setVisualAcuity] = useState({
    right: "",
    left: ""
  });

  const [recommendations, setRecommendations] = useState(null);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);

  const generateRecommendation = async () => {
    // Validate required fields
    if (!axialLength || !refraction.right || !visualAcuity.right) {
      alert("Please fill in axial length, right eye refraction, and right eye visual acuity.");
      return;
    }

    setIsGeneratingRecommendation(true);

    try {
      // Convert visual acuity to decimal (assuming standard Snellen notation)
      const parseVisualAcuity = (acuity) => {
        const parts = acuity.split('/');
        return parts.length === 2 ? parseFloat(parts[1]) / 20 : parseFloat(acuity);
      };

      const response = await axios.post("http://127.0.0.1:5000/recommend", {
        axial_length: parseFloat(axialLength),
        refraction: parseFloat(refraction.right),
        visual_acuity: parseVisualAcuity(visualAcuity.right)
      });

      setRecommendations(response.data);
      setIsGeneratingRecommendation(false);
    } catch (error) {
      console.error("Error generating recommendation:", error);
      alert(`Failed to generate recommendation: ${error.response?.data?.message || error.message}`);
      setIsGeneratingRecommendation(false);
    }
  };

  const saveRecommendation = async () => {
    if (!recommendations || !patientName) {
      alert("Please generate a recommendation and enter patient name.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/save-recommendation", {
        patient_name: patientName,
        recommendation: recommendations
      });
      alert("Recommendation saved successfully!");
    } catch (error) {
      console.error("Error saving recommendation:", error);
      alert("Failed to save recommendation.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="mt-8 border-t pt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">AI Treatment Recommendation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Clinical Measurements for Recommendation</h4>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    id="patientName"
                    type="text"
                    placeholder="Enter patient name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="recAxialLength" className="block text-sm font-medium text-gray-700 mb-1">
                    Axial Length (mm)
                  </label>
                  <input
                    id="recAxialLength"
                    type="text"
                    placeholder="e.g., 24.2"
                    value={axialLength}
                    onChange={(e) => setAxialLength(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="recRefractionRight" className="block text-sm font-medium text-gray-700 mb-1">
                      Refraction (Right)
                    </label>
                    <input
                      id="recRefractionRight"
                      type="text"
                      placeholder="e.g., -2.50"
                      value={refraction.right}
                      onChange={(e) => setRefraction({...refraction, right: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="recVisualAcuityRight" className="block text-sm font-medium text-gray-700 mb-1">
                      Visual Acuity (Right)
                    </label>
                    <input
                      id="recVisualAcuityRight"
                      type="text"
                      placeholder="e.g., 20/40"
                      value={visualAcuity.right}
                      onChange={(e) => setVisualAcuity({...visualAcuity, right: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={generateRecommendation}
                    disabled={isGeneratingRecommendation}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingRecommendation ? 'Generating...' : 'Generate Recommendation'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg">
              {recommendations ? (
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">AI Treatment Recommendation</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h5 className="font-medium text-gray-700 mb-2">Overall Risk Summary</h5>
                      <p className="text-sm text-gray-600">{recommendations.overall_risk_summary || 'No summary available'}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Primary Recommendations</h5>
                      {recommendations.primary_recommendations && recommendations.primary_recommendations.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {recommendations.primary_recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No primary recommendations available</p>
                      )}
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Secondary Recommendations</h5>
                      {recommendations.secondary_recommendations && recommendations.secondary_recommendations.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {recommendations.secondary_recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No secondary recommendations available</p>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h5 className="font-medium text-gray-700 mb-2">Risk Parameters</h5>
                      {recommendations.risk_parameters ? (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(recommendations.risk_parameters).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-gray-500 capitalize">{key.replace('_', ' ')}:</p>
                              <p className="font-medium">
                                {typeof value === 'object' 
                                  ? `${value.value} (${value.risk_category || value.severity || value.impact_level || 'N/A'})`
                                  : value || 'N/A'}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No risk parameters available</p>
                      )}
                    </div>
                    
                    {recommendations.risk_chart_path && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-700 mb-2">Risk Assessment Chart</h5>
                        <img 
                          src={`http://127.0.0.1:5000/${recommendations.risk_chart_path}`} 
                          alt="Risk Assessment Chart" 
                          className="w-full rounded-md shadow-md"
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <button 
                        onClick={saveRecommendation}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        Save Recommendation
                      </button>
                      <button 
                        onClick={() => setRecommendations(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p>Generate an AI recommendation based on clinical measurements</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
