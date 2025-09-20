from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models.supabase_client import supabase_service
import sys

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

@orders_bp.route('/', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_orders():
    """Get all orders - for testing without auth first."""
    print("🛒 === GET ORDERS ENDPOINT CALLED ===")
    
    if request.method == 'OPTIONS':
        print("✅ OPTIONS request handled for orders")
        return '', 200
    
    try:
        print("📥 Getting all orders...")
        supabase = supabase_service.get_client()
        response = supabase.table('orders').select('*').execute()
        
        print(f"✅ Found {len(response.data)} orders")
        return jsonify({
            'success': True,
            'data': response.data,
            'count': len(response.data)
        }), 200
        
    except Exception as e:
        print(f"💥 ERROR getting orders: {e}")
        return jsonify({
            'success': False,
            'message': f'Failed to get orders: {str(e)}'
        }), 500

@orders_bp.route('/', methods=['POST'])
@cross_origin()
def create_order():
    """Create a new order - for testing without auth first."""
    print("🛒 === CREATE ORDER ENDPOINT CALLED ===")
    
    try:
        print("📥 Processing order creation...")
        data = request.get_json()
        print(f"📋 Received data: {data}")
        
        if not data:
            print("❌ No data provided")
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        supabase = supabase_service.get_client()
        
        # For testing, we'll require user_id to be provided
        required_fields = ['user_id', 'total_amount', 'delivery_address']
        for field in required_fields:
            if not data.get(field):
                print(f"❌ Missing required field: {field}")
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400
        
        order_data = {
            'user_id': data.get('user_id'),  # This should be a UUID string
            'total_amount': data.get('total_amount'),
            'delivery_address': data.get('delivery_address'),
            'phone': data.get('phone'),
            'payment_method': data.get('payment_method', 'cash_on_delivery'),
            'payment_status': data.get('payment_status', 'pending'),
            'notes': data.get('notes', '')
        }
        
        print(f"📦 Creating order with data: {order_data}")
        order_response = supabase.table('orders').insert(order_data).execute()
        
        if order_response.data:
            order = order_response.data[0]
            print(f"✅ Order created successfully: {order['id']}")
            return jsonify({
                'success': True,
                'message': 'Order created successfully',
                'data': order
            }), 201
        else:
            print("❌ No data returned from database")
            return jsonify({
                'success': False,
                'message': 'Failed to create order - no data returned'
            }), 500
            
    except Exception as e:
        print(f"💥 CREATE ORDER ERROR: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Failed to create order: {str(e)}'
        }), 500

@orders_bp.route('/test', methods=['GET'])
@cross_origin()
def test_orders_endpoint():
    """Test endpoint to verify orders route is working."""
    print("🧪 === ORDERS TEST ENDPOINT CALLED ===")
    return jsonify({
        'success': True,
        'message': 'Orders endpoint is working!',
        'routes': [
            'GET /api/orders/ - Get all orders',
            'POST /api/orders/ - Create new order',
            'GET /api/orders/test - This test endpoint'
        ]
    }), 200
