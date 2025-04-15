import React from 'react';
import { Eye, AlertTriangle, Info } from 'lucide-react';

const DetectionResult = ({ result }) => {
  const { severity_analysis, image_url } = result;
  const { severity, num_lesions, avg_confidence, affected_areas } = severity_analysis;

  // Get severity color and icon
  const getSeverityStyle = (severity) => {
    switch (severity.toLowerCase()) {
      case 'no myopia':
        return { color: 'text-green-600', bg: 'bg-green-100', icon: <Info className="w-5 h-5" /> };
      case 'low':
        return { color: 'text-blue-600', bg: 'bg-blue-100', icon: <Info className="w-5 h-5" /> };
      case 'mild':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: <AlertTriangle className="w-5 h-5" /> };
      case 'moderate':
        return { color: 'text-orange-600', bg: 'bg-orange-100', icon: <AlertTriangle className="w-5 h-5" /> };
      case 'high':
        return { color: 'text-red-600', bg: 'bg-red-100', icon: <AlertTriangle className="w-5 h-5" /> };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', icon: <Info className="w-5 h-5" /> };
    }
  };

  const severityStyle = getSeverityStyle(severity);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Detection Results</h2>
        <div className={`flex items-center px-4 py-2 rounded-lg ${severityStyle.bg}`}>
          {severityStyle.icon}
          <span className={`ml-2 font-medium ${severityStyle.color}`}>
            Severity: {severity}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Section */}
        <div className="relative">
          <img
            src={image_url}
            alt="Detection Result"
            className="w-full h-auto rounded-lg shadow-md"
          />
          {/* Overlay affected areas */}
          {affected_areas.map((area, index) => (
            <div
              key={index}
              className="absolute border-2 border-red-500"
              style={{
                left: `${area.xmin}px`,
                top: `${area.ymin}px`,
                width: `${area.xmax - area.xmin}px`,
                height: `${area.ymax - area.ymin}px`,
              }}
            />
          ))}
        </div>

        {/* Analysis Section */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Analysis Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Lesions:</span>
                <span className="font-medium">{num_lesions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Confidence:</span>
                <span className="font-medium">{(avg_confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Affected Areas</h3>
            <div className="space-y-2">
              {affected_areas.map((area, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">Area {index + 1}</span>
                  <span className="text-sm text-gray-500">
                    Confidence: {(area.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Recommendations</h3>
            <div className="space-y-2">
              {severity === 'No Myopia' && (
                <p className="text-green-600">No immediate treatment required. Regular check-ups recommended.</p>
              )}
              {severity === 'Low' && (
                <p className="text-blue-600">Monitor progression. Consider lifestyle modifications.</p>
              )}
              {severity === 'Mild' && (
                <p className="text-yellow-600">Consider treatment options. Regular monitoring advised.</p>
              )}
              {severity === 'Moderate' && (
                <p className="text-orange-600">Treatment recommended. Schedule follow-up appointment.</p>
              )}
              {severity === 'High' && (
                <p className="text-red-600">Immediate treatment required. Schedule urgent consultation.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionResult; 