# app/auth/__init__.py
from flask import Blueprint

bp = Blueprint('auth', __name__)

from app.auth import routes

# app/auth/routes.py
from flask import request, jsonify
from app import mongo
from app.auth import bp
from werkzeug.security import generate_password_hash
from datetime import datetime
from bson.json_util import dumps

@bp.route('/register', methods=['POST'])
def register():
    # Get registration data from request
    data = request.json
    
    # Check if required fields are present
    required_fields = ['fullName', 'email', 'medicalId', 'specialty', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"success": False, "message": f"{field} is required"}), 400
    
    # Check if user already exists with the email
    existing_email = mongo.db.specialists.find_one({"email": data['email']})
    if existing_email:
        return jsonify({"success": False, "message": "Email already registered"}), 400
    
    # Check if user already exists with the medical ID
    existing_medical_id = mongo.db.specialists.find_one({"medicalId": data['medicalId']})
    if existing_medical_id:
        return jsonify({"success": False, "message": "Medical ID already registered"}), 400
    
    # Validate specialty
    specialties = [
        "Ophthalmology",
        "Optometry",
        "Pediatric Ophthalmology",
        "Retina Specialist",
        "Cornea Specialist",
        "Glaucoma Specialist", 
        "Neuro-ophthalmology",
        "Oculoplastics",
        "Other"
    ]
    
    if data['specialty'] not in specialties:
        return jsonify({"success": False, "message": "Invalid specialty"}), 400
    
    # Create new specialist object
    new_specialist = {
        "fullName": data['fullName'],
        "email": data['email'],
        "medicalId": data['medicalId'],
        "specialty": data['specialty'],
        "hospital": data.get('hospital', ''),
        "yearsOfExperience": data.get('yearsOfExperience', ''),
        "password": generate_password_hash(data['password']),
        "createdAt": datetime.now()
    }
    
    # Insert new specialist into database
    try:
        result = mongo.db.specialists.insert_one(new_specialist)
        
        # Create response object (without sensitive info)
        response_data = {
            "id": str(result.inserted_id),
            "fullName": data['fullName'],
            "email": data['email']
        }
        
        return jsonify({
            "success": True,
            "message": "Specialist registered successfully",
            "data": response_data
        }), 201
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Server error during registration",
            "error": str(e)
        }), 500

# run.py (in the root directory)
from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)