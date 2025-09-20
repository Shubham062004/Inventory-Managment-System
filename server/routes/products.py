from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models.product import Product
from models.supabase_client import supabase_service
import sys

products_bp = Blueprint('products', __name__, url_prefix='/api/products')

@products_bp.route('/', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:8080', 'http://127.0.0.1:8080'])
def get_all_products():
    """Get all products."""
    print("📦 === GET ALL PRODUCTS ENDPOINT CALLED ===")
    
    # Handle preflight
    if request.method == 'OPTIONS':
        print("✅ OPTIONS preflight handled for products")
        return '', 200
    
    try:
        category = request.args.get('category')
        search = request.args.get('search')
        
        print(f"🔍 Query params - Category: {category}, Search: {search}")
        
        if search:
            print(f"🔍 Searching for: {search}")
            products = Product.search_products(search)
        elif category and category != 'All':
            print(f"📂 Getting products by category: {category}")
            products = Product.get_by_category(category)
        else:
            print("📦 Getting all products")
            products = Product.get_all_products()
        
        products_data = [product.to_dict() for product in products]
        
        print(f"✅ Found {len(products_data)} products")
        response_data = {
            'success': True,
            'data': products_data,
            'count': len(products_data)
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"💥 ERROR getting products: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': f'Failed to get products: {str(e)}'
        }), 500

@products_bp.route('/categories', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:8080', 'http://127.0.0.1:8080'])
def get_categories():
    """Get all product categories."""
    print("📂 === GET CATEGORIES ENDPOINT CALLED ===")
    
    # Handle preflight
    if request.method == 'OPTIONS':
        print("✅ OPTIONS preflight handled for categories")
        return '', 200
    
    try:
        print("🔗 Getting Supabase client...")
        supabase = supabase_service.get_client()
        print("✅ Supabase client obtained")
        
        print("🔍 Querying categories...")
        response = supabase.table('products').select('category').execute()
        print(f"📡 Database response: {len(response.data)} rows")
        
        if response.data:
            categories = list(set([product['category'] for product in response.data]))
            categories.sort()
            
            print(f"✅ Found categories: {categories}")
            return jsonify({
                'success': True,
                'data': categories
            }), 200
        else:
            print("⚠️ No products found, returning default categories")
            default_categories = ['Dairy', 'Bakery', 'Grains', 'Fruits', 'Vegetables']
            return jsonify({
                'success': True,
                'data': default_categories
            }), 200
        
    except Exception as e:
        print(f"💥 ERROR getting categories: {e}")
        import traceback
        traceback.print_exc()
        # Return fallback categories if database fails
        default_categories = ['Dairy', 'Bakery', 'Grains', 'Fruits', 'Vegetables']
        return jsonify({
            'success': True,
            'data': default_categories
        }), 200

@products_bp.route('/<int:product_id>', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:8080', 'http://127.0.0.1:8080'])
def get_product_by_id(product_id):
    """Get product by ID."""
    print(f"🔍 === GET PRODUCT BY ID: {product_id} ===")
    
    # Handle preflight
    if request.method == 'OPTIONS':
        print("✅ OPTIONS preflight handled for product by ID")
        return '', 200
    
    try:
        supabase = supabase_service.get_client()
        response = supabase.table('products').select('*').eq('id', product_id).execute()
        
        if response.data:
            product_data = response.data[0]
            product = Product(
                id=product_data['id'],
                name=product_data['name'],
                category=product_data['category'],
                price=product_data['price'],
                description=product_data['description'],
                image=product_data['image'],
                stock=product_data['stock'],
                rating=product_data.get('rating', 4.5),
                reviews=product_data.get('reviews', 0)
            )
            
            print(f"✅ Product found: {product.name}")
            return jsonify({
                'success': True,
                'data': product.to_dict()
            }), 200
        else:
            print(f"❌ Product not found: {product_id}")
            return jsonify({
                'success': False,
                'message': 'Product not found'
            }), 404
            
    except Exception as e:
        print(f"💥 ERROR getting product: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': f'Failed to get product: {str(e)}'
        }), 500
