import os
from pathlib import Path
import torch
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from fpdf import FPDF
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

class RecommendationPDF(FPDF):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        font_path = os.path.join(os.path.dirname(__file__), 'DejaVuSans.ttf')
        
        try:
            self.add_font('DejaVu', '', font_path, uni=True)
            self.add_font('DejaVu', 'B', font_path, uni=True)
        except Exception as e:
            print(f"Font loading error: {e}")
            self.set_font('Arial', '', 12)

    def header(self):
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, 'Myopia Treatment Recommendation', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', '', 8)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', 0, 0, 'C')


# Defining paths
MODEL_PATH = "../yolov5/runs/train/exp26/weights/best.pt"
UPLOAD_FOLDER = "uploads"
PDF_FOLDER = "pdfs"
RECOMMENDATION_FOLDER = "recommendations"

# Ensuring necessary directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PDF_FOLDER, exist_ok=True)
os.makedirs(RECOMMENDATION_FOLDER, exist_ok=True)

# Loading YOLOv5 model
model = torch.hub.load("ultralytics/yolov5", "custom", path=MODEL_PATH)

def get_latest_results_dir():
    """Find the latest runs/detect/expX directory."""
    runs_dir = Path("runs/detect")
    if not runs_dir.exists():
        return None
    exp_dirs = sorted(runs_dir.glob("exp*"), key=os.path.getmtime, reverse=True)
    return exp_dirs[0] if exp_dirs else None

def calculate_myopia_risk(axial_length, refraction, visual_acuity):
    """
    Comprehensive risk assessment for myopia treatment
    
    Args:
        axial_length (float): Axial length in mm
        refraction (float): Spherical equivalent refraction
        visual_acuity (float): Visual acuity decimal
    
    Returns:
        dict: Comprehensive risk assessment
    """
    risk_parameters = {
        "axial_length_risk": {
            "value": axial_length,
            "risk_category": "High" if axial_length > 26 else "Moderate" if axial_length > 24.5 else "Low"
        },
        "refraction_risk": {
            "value": refraction,
            "risk_category": "High" if abs(refraction) > 6 else "Moderate" if abs(refraction) > 3 else "Low"
        },
        "visual_acuity_risk": {
            "value": visual_acuity,
            "risk_category": "High" if visual_acuity < 0.5 else "Moderate" if visual_acuity < 0.8 else "Low"
        }
    }

    # Determine overall risk
    risk_scores = {
        "Low": 1,
        "Moderate": 2,
        "High": 3
    }

    risk_levels = [param['risk_category'] for param in risk_parameters.values()]
    avg_risk_score = sum(risk_scores[level] for level in risk_levels) / len(risk_levels)

    overall_risk_summary = (
        "High Risk Myopia Progression" if avg_risk_score > 2.3 else 
        "Moderate Myopia Risk" if avg_risk_score > 1.7 else 
        "Low Myopia Risk"
    )

    # Generate treatment recommendations
    primary_recommendations = []
    secondary_recommendations = []

    if overall_risk_summary == "High Risk Myopia Progression":
        primary_recommendations = [
            "Immediate Orthokeratology (Ortho-K) Lens Treatment",
            "Atropine Low-Dose Therapy (0.01%)",
            "Frequent Myopia Progression Monitoring (Every 3 months)"
        ]
        secondary_recommendations = [
            "Multifocal Contact Lens Consideration",
            "Outdoor Activity Increase (Minimum 2 hours/day)",
            "Screen Time Reduction Strategy"
        ]
    elif overall_risk_summary == "Moderate Myopia Risk":
        primary_recommendations = [
            "Multifocal Soft Contact Lens Evaluation",
            "Quarterly Eye Examinations",
            "Blue Light Filtering Lens Options"
        ]
        secondary_recommendations = [
            "Active Lifestyle Promotion",
            "Digital Eye Strain Prevention",
            "Potential Ortho-K Consultation"
        ]
    else:
        primary_recommendations = [
            "Annual Comprehensive Eye Examination",
            "Standard Corrective Lens Prescription",
            "Lifestyle Guidance for Eye Health"
        ]
        secondary_recommendations = [
            "Vision Therapy Consultation",
            "Nutrition Advice for Eye Health",
            "Digital Screen Ergonomics"
        ]

    # Visualization of Risk Parameters
    plt.figure(figsize=(10, 6))
    categories = list(risk_parameters.keys())
    values = [risk_scores[param['risk_category']] for param in risk_parameters.values()]
    
    plt.bar(categories, values, color=['green' if v==1 else 'yellow' if v==2 else 'red' for v in values])
    plt.title('Myopia Risk Assessment')
    plt.ylabel('Risk Level')
    plt.ylim(0, 3)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    
    risk_chart_path = os.path.join(RECOMMENDATION_FOLDER, f"risk_chart_{hash(str(axial_length))}.png")
    plt.savefig(risk_chart_path)
    plt.close()

    return {
        "overall_risk_summary": overall_risk_summary,
        "risk_parameters": risk_parameters,
        "primary_recommendations": primary_recommendations,
        "secondary_recommendations": secondary_recommendations,
        "risk_chart_path": risk_chart_path
    }

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
        
        
        return jsonify({
            "image_url": f"http://127.0.0.1:5000/{saved_image_path}",
            "pdf_url": f"http://127.0.0.1:5000/{pdf_path}",
        })
    except Exception as e:
        return jsonify({"error": f"Error during processing: {str(e)}"}), 500

@app.route("/recommend", methods=["POST"])
def generate_recommendation():
    """
    Generate AI-powered treatment recommendation based on clinical measurements
    """
    try:
        data = request.get_json()
        axial_length = data.get('axial_length')
        refraction = data.get('refraction')
        visual_acuity = data.get('visual_acuity')

        # Validate input
        if not all([axial_length, refraction is not None, visual_acuity is not None]):
            return jsonify({"error": "Missing required clinical measurements"}), 400

        # Generate recommendation
        recommendation = calculate_myopia_risk(axial_length, refraction, visual_acuity)
        
        return jsonify(recommendation)

    except Exception as e:
        return jsonify({"error": f"Error generating recommendation: {str(e)}"}), 500

@app.route("/save-recommendation", methods=["POST"])
def save_recommendation():
    try:
        data = request.get_json(force=True)
        patient_name = data.get('patient_name', 'Unknown Patient')
        recommendation = data.get('recommendation', {})
        
        # Use the RecommendationPDF class that has Unicode support
        pdf = RecommendationPDF(orientation='P', unit='mm', format='A4')
        pdf.alias_nb_pages()
        pdf.add_page()
        
        page_width = pdf.w - 2 * pdf.l_margin
        
        # Try to use DejaVu font that supports Unicode characters
        try:
            pdf.set_font('DejaVu', '', 12)
        except:
            pdf.set_font('Arial', '', 12)
        
        # Patient and Document Header
        try:
            pdf.set_font('DejaVu', 'B', 14)
        except:
            pdf.set_font('Arial', 'B', 14)
        pdf.cell(page_width, 10, f"Myopia Treatment Recommendation for {patient_name}", 0, 1, 'C')
        pdf.ln(5)
        
        # Overall Risk Summary
        # Check if we need to add a page break before this section
        if pdf.get_y() > 260:  # If less than 30mm available, add new page
            pdf.add_page()
            
        try:
            pdf.set_font('DejaVu', 'B', 12)
        except:
            pdf.set_font('Arial', 'B', 12)
        pdf.cell(page_width, 10, "Overall Risk Summary", 0, 1)
        
        try:
            pdf.set_font('DejaVu', '', 11)
        except:
            pdf.set_font('Arial', '', 11)
        pdf.multi_cell(page_width, 10, recommendation.get('overall_risk_summary', 'No summary available'))
        pdf.ln(5)
        
        # Risk Parameters
        # Check if we need to add a page break before this section
        if pdf.get_y() > 240:  # Need more space for risk parameters
            pdf.add_page()
            
        try:
            pdf.set_font('DejaVu', 'B', 12)
        except:
            pdf.set_font('Arial', 'B', 12)
        pdf.cell(page_width, 10, "Risk Parameters", 0, 1)
        
        try:
            pdf.set_font('DejaVu', '', 11)
        except:
            pdf.set_font('Arial', '', 11)
            
        risk_params = recommendation.get('risk_parameters', {})
        for key, value in risk_params.items():
            # Check if we need to add a page break
            if pdf.get_y() > 270:
                pdf.add_page()
                
            if isinstance(value, dict):
                display_value = f"{value.get('value', 'N/A')} (Risk: {value.get('risk_category', 'N/A')})"
            else:
                display_value = str(value)
            pdf.multi_cell(page_width, 10, f"{key.replace('_', ' ').title()}: {display_value}")
        pdf.ln(5)
        
        # Primary Recommendations
        # Check if we need to add a page break before this section
        if pdf.get_y() > 240:  # Need more space for recommendations
            pdf.add_page()
            
        try:
            pdf.set_font('DejaVu', 'B', 12)
        except:
            pdf.set_font('Arial', 'B', 12)
        pdf.cell(page_width, 10, "Primary Recommendations", 0, 1)
        
        try:
            pdf.set_font('DejaVu', '', 11)
        except:
            pdf.set_font('Arial', '', 11)
            
        primary_recs = recommendation.get('primary_recommendations', [])
        for rec in primary_recs:
            # Check if we need to add a page break
            if pdf.get_y() > 270:
                pdf.add_page()
                
            pdf.multi_cell(page_width, 10, f"- {rec}")
        pdf.ln(5)
        
        # Secondary Recommendations
        # Check if we need to add a page break before this section
        if pdf.get_y() > 240:  # Need more space for secondary recommendations
            pdf.add_page()
            
        try:
            pdf.set_font('DejaVu', 'B', 12)
        except:
            pdf.set_font('Arial', 'B', 12)
        pdf.cell(page_width, 10, "Secondary Recommendations", 0, 1)
        
        try:
            pdf.set_font('DejaVu', '', 11)
        except:
            pdf.set_font('Arial', '', 11)
            
        secondary_recs = recommendation.get('secondary_recommendations', [])
        for rec in secondary_recs:
            # Check if we need to add a page break
            if pdf.get_y() > 270:
                pdf.add_page()
                
            pdf.multi_cell(page_width, 10, f"- {rec}")
        pdf.ln(5)
        
        # Risk Chart - Always start on a new page for the chart
        if recommendation.get('risk_chart_path'):
            try:
                pdf.add_page()
                try:
                    pdf.set_font('DejaVu', 'B', 12)
                except:
                    pdf.set_font('Arial', 'B', 12)
                pdf.cell(page_width, 10, "Risk Assessment Visualization", 0, 1)
                
                # Center the chart and make sure it fits properly
                chart_width = 160  # mm
                chart_height = 100  # approximate height in mm
                x_position = (page_width - chart_width) / 2 + pdf.l_margin
                
                pdf.image(recommendation['risk_chart_path'], x=x_position, y=pdf.get_y() + 5, w=chart_width)
            except Exception as e:
                print(f"Error adding risk chart to PDF: {e}")
        
        # Generate filename
        pdf_filename = f"{patient_name}_myopia_recommendation.pdf"
        pdf_path = os.path.join(RECOMMENDATION_FOLDER, pdf_filename)
        
        os.makedirs(RECOMMENDATION_FOLDER, exist_ok=True)
        pdf.output(pdf_path)
        
        return jsonify({
            "message": "Recommendation saved successfully",
            "filename": pdf_filename
        })
    
    except Exception as e:
        print(f"Error saving recommendation: {str(e)}")
        return jsonify({"error": f"Error saving recommendation: {str(e)}"}), 500# ... [rest of the code remains the same]
@app.route("/download-recommendation/<filename>")
def download_recommendation(filename):
    """
    Download a saved recommendation PDF
    """
    try:
        # Validate filename to prevent directory traversal
        safe_filename = os.path.basename(filename)
        file_path = os.path.join(RECOMMENDATION_FOLDER, safe_filename)

        # Check if file exists
        if not os.path.exists(file_path):
            return jsonify({"error": "File not found"}), 404

        # Send the file for download
        return send_file(
            file_path, 
            as_attachment=True, 
            download_name=safe_filename,
            mimetype='application/pdf'
        )

    except Exception as e:
        return jsonify({"error": f"Error downloading recommendation: {str(e)}"}), 500

@app.route("/<path:filename>", methods=["GET"])
def serve_file(filename):
    try:
        return send_file(filename)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)