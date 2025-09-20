import os
from decouple import config
from datetime import timedelta

class Config:
    SECRET_KEY = config('SECRET_KEY', default='your-secret-key-change-in-production')
    JWT_SECRET_KEY = config('JWT_SECRET_KEY', default='jwt-secret-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Database configuration - Handle PostgreSQL properly
    DATABASE_URL = config('DATABASE_URL', default='sqlite:///balaji_store.db')
    
    # Fix postgres:// to postgresql:// for SQLAlchemy compatibility
    if DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # CORS settings
    CORS_ORIGINS = config('CORS_ORIGINS', default='http://localhost:3000').split(',')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
    # Additional production settings for better PostgreSQL performance
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
