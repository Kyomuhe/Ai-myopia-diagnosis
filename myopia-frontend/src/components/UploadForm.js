import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [resultImage, setResultImage] = useState("");
  const [resultPdf, setResultPdf] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

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
    <div>
      <h1>Pathological Myopia Detection</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*,video/*" />
        <button type="submit">Detect</button>
      </form>
      {resultImage && (
        <div>
          <h2>Detection Result:</h2>
          <img src={resultImage} alt="Detection Result" style={{ maxWidth: "100%" }} />
          <div>
            <h3>Download Report:</h3>
            <a href={resultPdf} download>
              Download PDF
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
