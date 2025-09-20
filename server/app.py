from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config, DevelopmentConfig, ProductionConfig
from routes.auth import auth_bp
from routes.products import products_bp
from routes.orders import orders_bp
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
    
    # Load configuration
    if os.environ.get('FLASK_ENV') == 'production':
        app.config.from_object(ProductionConfig)
        print("🚀 PRODUCTION MODE ACTIVATED")
    else:
        app.config.from_object(DevelopmentConfig)
        print("🛠️ DEVELOPMENT MODE ACTIVATED")
    
    print(f"✅ Flask app created successfully")
    
    # FIXED CORS CONFIGURATION - More explicit
    CORS(app, 
         origins=['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', 'http://127.0.0.1:8080'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
         supports_credentials=True,
         max_age=3600)
    
    print("✅ CORS configured with explicit settings")
    
    # Handle preflight OPTIONS requests globally
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            print(f"🔄 PREFLIGHT REQUEST: {request.url}")
            print(f"📍 Origin: {request.headers.get('Origin')}")
            response = jsonify({'status': 'OK'})
            response.headers.add('Access-Control-Allow-Origin', '*')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
            response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
            response.headers.add('Access-Control-Max-Age', '3600')
            return response, 200
    
    # Enhanced request logging
    @app.before_request
    def log_request_info():
        if request.method != 'OPTIONS':  # Don't spam logs with OPTIONS
            print(f"\n🔄 === {request.method} REQUEST ===")
            print(f"📍 URL: {request.url}")
            print(f"📡 Origin: {request.headers.get('Origin', 'No Origin')}")
            print(f"🔑 Headers: {dict(request.headers)}")
            sys.stdout.flush()
    
    # Enhanced response logging
    @app.after_request
    def log_response_info(response):
        if request.method != 'OPTIONS':  # Don't spam logs with OPTIONS
            print(f"📤 RESPONSE: {response.status_code}")
            print(f"📋 Response Headers: {dict(response.headers)}")
            print(f"=== END REQUEST ===\n")
        sys.stdout.flush()
        return response
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(orders_bp)
    print("✅ All blueprints registered successfully")
    
    # Health check endpoint with CORS
    @app.route('/api/health', methods=['GET', 'OPTIONS'])
    def health_check():
        if request.method == 'OPTIONS':
            return '', 200
            
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
            'database': db_status,
            'cors': 'enabled',
            'endpoints': {
                'auth': '/api/auth/',
                'products': '/api/products/',
                'orders': '/api/orders/'
            }
        }
        
        print(f"🏥 Health check response: {health_data}")
        return jsonify(health_data), 200
    
    # Error handlers with CORS
    @app.errorhandler(404)
    def not_found(error):
        print(f"❌ 404 Error - Path not found: {request.url}")
        response = jsonify({
            'success': False,
            'message': 'Endpoint not found',
            'path': request.path
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
    print("\n" + "="*60)
    print("🚀 STARTING BALAJI STORE BACKEND SERVER")
    print("="*60)
    
    port = int(os.environ.get('PORT', 5000))
    print(f"📡 Server will run on port: {port}")
    print(f"🌐 Access URL: http://localhost:{port}")
    print(f"🌐 Alternative: http://127.0.0.1:{port}")
    print(f"🏥 Health check: http://localhost:{port}/api/health")
    print(f"📦 Products API: http://localhost:{port}/api/products")
    print(f"📂 Categories API: http://localhost:{port}/api/products/categories")
    print(f"🛒 Orders API: http://localhost:{port}/api/orders")
    print("="*60 + "\n")
    
    sys.stdout.flush()
    app.run(host='0.0.0.0', port=port, debug=True, use_reloader=True)
