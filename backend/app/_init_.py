# app/__init__.py
from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from config import Config

mongo = PyMongo()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    CORS(app)
    mongo.init_app(app)
    
    # Register blueprints
    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # Health check route
    @app.route('/', methods=['GET'])
    def health_check():
        from flask import jsonify
        return jsonify({"status": "API is running"})
    
    return app

