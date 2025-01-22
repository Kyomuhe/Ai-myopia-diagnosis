from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from pathlib import Path
import torch

app = Flask(__name__)
CORS(app)

# Load your YOLOv5 model
MODEL_PATH = "runs/train/exp26/weights/best.pt"
model = torch.hub.load("ultralytics/yolov5", "custom", path=MODEL_PATH)

UPLOAD_FOLDER = "uploads"
RESULTS_FOLDER = "results"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

@app.route("/detect", methods=["POST"])
def detect():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    input_path = os.path.join(UPLOAD_FOLDER, file.filename)
    output_path = os.path.join(RESULTS_FOLDER, file.filename)

    file.save(input_path)

    # Perform detection
    results = model(input_path)
    results.save(RESULTS_FOLDER)

    return jsonify({"image_url": f"http://127.0.0.1:5000/{output_path}"})

@app.route("/<path:filename>", methods=["GET"])
def serve_file(filename):
    return send_file(filename)

if __name__ == "__main__":
    app.run(debug=True)
