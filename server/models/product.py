
from models.supabase_client import supabase_service
from typing import Optional, List, Dict, Any
from datetime import datetime

class Product:
    def __init__(self, id=None, name=None, category=None, price=None, 
                 description=None, image=None, stock=None, rating=4.5, reviews=0):
        self.id = id
        self.name = name
        self.category = category
        self.price = price
        self.description = description
        self.image = image
        self.stock = stock
        self.rating = rating
        self.reviews = reviews
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'price': self.price,
            'description': self.description,
            'image': self.image,
            'stock': self.stock,
            'rating': self.rating,
            'reviews': self.reviews,
            'created_at': getattr(self, 'created_at', None),
            'updated_at': getattr(self, 'updated_at', None)
        }
    
    @classmethod
    def get_all_products(cls) -> List['Product']:
        """Get all products from database."""
        try:
            supabase = supabase_service.get_client()
            response = supabase.table('products').select('*').execute()
            
            products = []
            for product_data in response.data:
                product = cls(
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
                product.created_at = product_data.get('created_at')
                product.updated_at = product_data.get('updated_at')
                products.append(product)
            
            return products
        except Exception as e:
            print(f"Error getting products: {e}")
            return []
    
    @classmethod
    def get_by_category(cls, category: str) -> List['Product']:
        """Get products by category."""
        try:
            supabase = supabase_service.get_client()
            response = supabase.table('products').select('*').eq('category', category).execute()
            
            products = []
            for product_data in response.data:
                product = cls(
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
                products.append(product)
            
            return products
        except Exception as e:
            print(f"Error getting products by category: {e}")
            return []
    
    @classmethod
    def search_products(cls, query: str) -> List['Product']:
        """Search products by name or description."""
        try:
            supabase = supabase_service.get_client()
            response = supabase.table('products').select('*').or_(
                f'name.ilike.%{query}%,description.ilike.%{query}%'
            ).execute()
            
            products = []
            for product_data in response.data:
                product = cls(
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
                products.append(product)
            
            return products
        except Exception as e:
            print(f"Error searching products: {e}")
            return []
