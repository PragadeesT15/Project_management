#!/usr/bin/env python
"""
Setup script for Project Management Tool
Run this script to set up the project with sample data
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_project():
    """Setup the project with migrations and sample data"""
    
    print("🚀 Setting up Project Management Tool...")
    
    # Set up Django environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_management.settings')
    django.setup()
    
    try:
        # Run migrations
        print("📦 Running database migrations...")
        execute_from_command_line(['manage.py', 'makemigrations'])
        execute_from_command_line(['manage.py', 'migrate'])
        
        # Create sample data
        print("👥 Creating sample data...")
        execute_from_command_line(['manage.py', 'create_sample_data'])
        
        print("\n✅ Setup completed successfully!")
        print("\n📋 Login Credentials:")
        print("Admin: admin@example.com / admin123")
        print("Manager: manager@example.com / manager123")
        print("Developer: dev1@example.com / dev123")
        print("Developer: dev2@example.com / dev123")
        print("\n🌐 Start the server with: python manage.py runserver")
        print("🔗 Then visit: http://127.0.0.1:8000")
        
    except Exception as e:
        print(f"❌ Error during setup: {e}")
        sys.exit(1)

if __name__ == '__main__':
    setup_project()
