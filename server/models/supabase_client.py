from supabase import create_client, Client
from decouple import config
import os
import sys

class SupabaseService:
    def __init__(self):
        print("🔗 === INITIALIZING SUPABASE SERVICE ===")
        supabase_url = config('SUPABASE_URL')
        supabase_key = config('SUPABASE_KEY')
        
        print(f"🌐 Supabase URL: {supabase_url}")
        print(f"🔑 API Key: {supabase_key[:20]}...{supabase_key[-10:]}")
        
        try:
            self.client: Client = create_client(supabase_url, supabase_key)
            print("✅ Supabase client created successfully")
        except Exception as e:
            print(f"💥 Failed to create Supabase client: {e}")
            raise e
        
        print("🔗 === SUPABASE SERVICE INITIALIZED ===")
    
    def get_client(self) -> Client:
        print("📡 Getting Supabase client...")
        return self.client

# Global instance
print("🚀 Creating global Supabase service instance...")
supabase_service = SupabaseService()
