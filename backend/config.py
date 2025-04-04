# config.py
import os

class Config:
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/myopiaDx')
    SECRET_KEY = os.environ.get('SECRET_KEY', 'myopiadx-secret-key')
    DEBUG = os.environ.get('FLASK_DEBUG', 'True') == 'True'