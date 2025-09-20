import bcrypt
from datetime import datetime
from models.supabase_client import supabase_service
from typing import Optional, Dict, Any
import sys

class User:
    def __init__(self, id=None, email=None, password=None, name=None, phone=None, role='customer'):
        # Handle UUID properly - convert to string for consistency
        self.id = str(id) if id else None
        self.email = email
        self.name = name
        self.phone = phone
        self.role = role
        if password:
            self.password_hash = self.hash_password(password)
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password for storing."""
        print("🔐 Hashing password...")
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        print("✅ Password hashed successfully")
        return hashed
    
    def check_password(self, password: str) -> bool:
        """Check if provided password matches the hashed password."""
        print("🔍 Checking password...")
        result = bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
        print(f"🔐 Password check result: {'✅ MATCH' if result else '❌ NO MATCH'}")
        return result
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert user object to dictionary."""
        user_dict = {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'created_at': getattr(self, 'created_at', None),
            'updated_at': getattr(self, 'updated_at', None)
        }
        print(f"📋 User converted to dict: {user_dict}")
        return user_dict
    
    @classmethod
    def create_user(cls, email: str, password: str, name: str = None, phone: str = None, role: str = 'customer'):
        """Create a new user in Supabase."""
        print(f"👤 === CREATING USER: {email} ===")
        try:
            print("🔗 Getting Supabase client...")
            supabase = supabase_service.get_client()
            print("✅ Supabase client obtained")
            
            print("📦 Preparing user data...")
            user_data = {
                'email': email,
                'password_hash': cls.hash_password(password),
                'name': name,
                'phone': phone,
                'role': role,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            print(f"📋 User data prepared: {user_data}")
            
            print("💾 Inserting user into database...")
            response = supabase.table('users').insert(user_data).execute()
            print(f"📡 Database response: {response}")
            
            if response.data:
                user_dict = response.data[0]
                print(f"✅ User created in database: {user_dict}")
                
                user = cls(
                    id=user_dict['id'],
                    email=user_dict['email'],
                    name=user_dict['name'],
                    phone=user_dict['phone'],
                    role=user_dict['role']
                )
                user.password_hash = user_dict['password_hash']
                user.created_at = user_dict['created_at']
                user.updated_at = user_dict['updated_at']
                
                print(f"✅ User object created successfully")
                print("👤 === USER CREATION COMPLETED ===")
                return user
            else:
                print("❌ No data returned from database")
                return None
        except Exception as e:
            print(f"💥 Error creating user: {e}")
            print("👤 === USER CREATION FAILED ===")
            return None
    
    @classmethod
    def find_by_email(cls, email: str) -> Optional['User']:
        """Find user by email."""
        print(f"🔍 === SEARCHING FOR USER: {email} ===")
        try:
            print("🔗 Getting Supabase client...")
            supabase = supabase_service.get_client()
            print("✅ Supabase client obtained")
            
            print(f"🔍 Querying database for user: {email}")
            response = supabase.table('users').select('*').eq('email', email).execute()
            print(f"📡 Database response: {response}")
            
            if response.data:
                user_dict = response.data[0]
                print(f"✅ User found in database: {user_dict}")
                
                user = cls(
                    id=user_dict['id'],
                    email=user_dict['email'],
                    name=user_dict['name'],
                    phone=user_dict['phone'],
                    role=user_dict['role']
                )
                user.password_hash = user_dict['password_hash']
                user.created_at = user_dict.get('created_at')
                user.updated_at = user_dict.get('updated_at')
                
                print("✅ User object created from database data")
                print("🔍 === USER SEARCH COMPLETED ===")
                return user
            else:
                print(f"❌ User not found: {email}")
                print("🔍 === USER SEARCH COMPLETED (NOT FOUND) ===")
                return None
        except Exception as e:
            print(f"💥 Error finding user: {e}")
            print("🔍 === USER SEARCH FAILED ===")
            return None
    
    @classmethod
    def find_by_id(cls, user_id: int) -> Optional['User']:
        """Find user by ID."""
        print(f"🔍 === SEARCHING FOR USER BY ID: {user_id} ===")
        try:
            supabase = supabase_service.get_client()
            
            response = supabase.table('users').select('*').eq('id', user_id).execute()
            print(f"📡 Database response: {response}")
            
            if response.data:
                user_dict = response.data[0]
                user = cls(
                    id=user_dict['id'],
                    email=user_dict['email'],
                    name=user_dict['name'],
                    phone=user_dict['phone'],
                    role=user_dict['role']
                )
                user.password_hash = user_dict['password_hash']
                user.created_at = user_dict.get('created_at')
                user.updated_at = user_dict.get('updated_at')
                print("✅ User found by ID")
                return user
            return None
        except Exception as e:
            print(f"💥 Error finding user by ID: {e}")
            return None
