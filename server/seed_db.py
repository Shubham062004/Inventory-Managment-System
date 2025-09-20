from app import create_app
from models.user import db, User

def seed_database():
    """Seed database with initial data."""
    app = create_app()
    
    with app.app_context():
        try:
            # Create admin user if doesn't exist
            admin_email = 'admin@example.com'
            if not User.find_by_email(admin_email):
                admin_user = User(
                    email=admin_email,
                    password='password',
                    name='Admin User',
                    role='admin'
                )
                db.session.add(admin_user)
                print("✅ Admin user created")
            
            # Create customer user if doesn't exist
            customer_email = 'customer@example.com'
            if not User.find_by_email(customer_email):
                customer_user = User(
                    email=customer_email,
                    password='password',
                    name='Customer User',
                    role='customer'
                )
                db.session.add(customer_user)
                print("✅ Customer user created")
            
            db.session.commit()
            print("✅ Database seeded successfully!")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error seeding database: {e}")

if __name__ == '__main__':
    seed_database()
