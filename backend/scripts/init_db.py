import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.models import create_tables

def main():
    """Initialize database tables."""
    print("Creating database tables...")
    try:
        create_tables()
        print("✓ Database tables created successfully!")
    except Exception as e:
        print(f"✗ Error creating database tables: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()