from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config, DevelopmentConfig, ProductionConfig
from routes.auth import auth_bp
from models.supabase_client import supabase_service
import os
import sys
import logging

def create_app():
    """Create and configure Flask application."""
    app = Flask(__name__)
    
    # Configure logging
    logging.basicConfig(
        level=logging.DEBUG,
        format='[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
        handlers=[logging.StreamHandler(sys.stdout)]
    )
    
    # Load configuration based on environment
    if os.environ.get('FLASK_ENV') == 'production':
        app.config.from_object(ProductionConfig)
        print("🚀 PRODUCTION MODE ACTIVATED")
    else:
        app.config.from_object(DevelopmentConfig)
        print("🛠️ DEVELOPMENT MODE ACTIVATED")
    
    print(f"✅ Flask app created successfully")
    print(f"📊 CORS Origins: {app.config['CORS_ORIGINS']}")
    
    # Enhanced CORS configuration
    CORS(app, 
         origins=app.config['CORS_ORIGINS'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'],
         supports_credentials=True)
    
    print("✅ CORS configured successfully")
    
    # Log every request
    @app.before_request
    def log_request_info():
        print(f"\n🔄 === INCOMING REQUEST ===")
        print(f"📍 Method: {request.method}")
        print(f"🌐 URL: {request.url}")
        print(f"📡 Origin: {request.headers.get('Origin', 'No Origin')}")
        print(f"📋 Headers: {dict(request.headers)}")
        if request.is_json and request.get_json():
            print(f"📦 JSON Data: {request.get_json()}")
        print(f"=== END REQUEST INFO ===\n")
        sys.stdout.flush()
    
    # Log every response
    @app.after_request
    def log_response_info(response):
        print(f"\n📤 === OUTGOING RESPONSE ===")
        print(f"📊 Status Code: {response.status_code}")
        print(f"📋 Headers: {dict(response.headers)}")
        if response.is_json:
            print(f"📦 JSON Response: {response.get_json()}")
        print(f"=== END RESPONSE INFO ===\n")
        sys.stdout.flush()
        return response
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    print("✅ Auth blueprint registered successfully")
    
    # Health check endpoint with Supabase connection test
    @app.route('/api/health', methods=['GET'])
    def health_check():
        print("🏥 Health check endpoint called")
        try:
            print("🔍 Testing Supabase connection...")
            supabase = supabase_service.get_client()
            response = supabase.table('users').select('count').execute()
            db_status = "connected"
            print("✅ Supabase connection successful")
        except Exception as e:
            db_status = f"error: {str(e)}"
            print(f"❌ Supabase connection failed: {e}")
            
        health_data = {
            'success': True,
            'message': 'Balaji Store Backend is running',
            'version': '1.0.0',
            'environment': os.environ.get('FLASK_ENV', 'development'),
            'database': db_status
        }
        
        print(f"🏥 Health check response: {health_data}")
        return jsonify(health_data), 200
    
    # Error handlers with CORS headers and logging
    @app.errorhandler(404)
    def not_found(error):
        print(f"❌ 404 Error - Path not found: {request.url}")
        response = jsonify({
            'success': False,
            'message': 'Endpoint not found'
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        print(f"💥 500 Error - Internal server error: {error}")
        response = jsonify({
            'success': False,
            'message': 'Internal server error'
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 STARTING BALAJI STORE BACKEND SERVER")
    print("="*50)
    
    port = int(os.environ.get('PORT', 5000))
    print(f"📡 Server will run on port: {port}")
    print(f"🌐 Access URL: http://localhost:{port}")
    print(f"🏥 Health check: http://localhost:{port}/api/health")
    print("="*50 + "\n")
    
    sys.stdout.flush()
    app.run(host='0.0.0.0', port=port, debug=True)
