from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from pathlib import Path
import torch
from fpdf import FPDF

app = Flask(__name__)
CORS(app)

# Defining paths
MODEL_PATH = "../yolov5/runs/train/exp26/weights/best.pt"
UPLOAD_FOLDER = "uploads"
PDF_FOLDER = "pdfs"

# Ensuring necessary directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PDF_FOLDER, exist_ok=True)

# Loading YOLOv5 model
model = torch.hub.load("ultralytics/yolov5", "custom", path=MODEL_PATH)

def get_latest_results_dir():
    """Find the latest runs/detect/expX directory."""
    runs_dir = Path("runs/detect")
    if not runs_dir.exists():
        return None
    exp_dirs = sorted(runs_dir.glob("exp*"), key=os.path.getmtime, reverse=True)
    return exp_dirs[0] if exp_dirs else None

@app.route("/detect", methods=["POST"])
def detect():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    patient_name = request.form.get("patient_name", "Unknown Patient")
    specialist_review = request.form.get("specialist_review", "No review provided")

    input_path = os.path.join(UPLOAD_FOLDER, file.filename)
    pdf_path = os.path.join(PDF_FOLDER, f"{Path(file.filename).stem}.pdf")
    
    # Saving the uploaded file
    file.save(input_path)
    
    try:
        # Performing detection
        results = model(input_path)
        results.save()  # Default save location is runs/detect/expX
        
        # Locating the latest results directory
        latest_results_dir = get_latest_results_dir()
        if not latest_results_dir:
            return jsonify({"error": "No detection results found!"}), 500
        
        # Finding the processed image in the latest directory
        processed_files = list(latest_results_dir.glob("*.jpg"))
        if not processed_files:
            return jsonify({"error": "No processed images found in results!"}), 500
        
        saved_image_path = processed_files[0]  # Use the first processed image
        
        # Generating PDF report
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt="Pathological Myopia Detection Results", ln=True, align='C')
        pdf.ln(10)
        pdf.cell(200, 10, txt=f"Patient: {patient_name}", ln=True)
        pdf.cell(200, 10, txt=f"File: {file.filename}", ln=True)
        pdf.ln(10)
        pdf.cell(200, 10, txt="Specialist Review:", ln=True)
        pdf.multi_cell(0, 10, txt=specialist_review)
        pdf.ln(10)
        pdf.cell(200, 10, txt="See result image below:", ln=True)
        pdf.image(str(saved_image_path), x=10, y=pdf.get_y() + 10, w=100)
        pdf.output(pdf_path)

        # will implement this later
        detailed_results = "Detailed analysis of the results goes here."
        recommendation = "Recommended treatment options based on the analysis."
        
        return jsonify({
            "image_url": f"http://127.0.0.1:5000/{saved_image_path}",
            "pdf_url": f"http://127.0.0.1:5000/{pdf_path}",
            "detailed_results": detailed_results,
            "recommendation": recommendation
        })
    except Exception as e:
        return jsonify({"error": f"Error during processing: {str(e)}"}), 500

@app.route("/<path:filename>", methods=["GET"])
def serve_file(filename):
    try:
        return send_file(filename)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)