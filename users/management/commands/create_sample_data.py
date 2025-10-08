from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from projects.models import Project, Task, ProjectMember
from datetime import date, timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Create sample data for the project management system'

    def handle(self, *args, **options):
        # Create users
        admin_user, created = User.objects.get_or_create(
            email='admin@example.com',
            defaults={
                'full_name': 'Admin User',
                'role': 'Admin',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created admin user'))

        manager_user, created = User.objects.get_or_create(
            email='manager@example.com',
            defaults={
                'full_name': 'Project Manager',
                'role': 'Manager'
            }
        )
        if created:
            manager_user.set_password('manager123')
            manager_user.save()
            self.stdout.write(self.style.SUCCESS('Created manager user'))

        developer1, created = User.objects.get_or_create(
            email='dev1@example.com',
            defaults={
                'full_name': 'Developer One',
                'role': 'Developer'
            }
        )
        if created:
            developer1.set_password('dev123')
            developer1.save()
            self.stdout.write(self.style.SUCCESS('Created developer 1'))

        developer2, created = User.objects.get_or_create(
            email='dev2@example.com',
            defaults={
                'full_name': 'Developer Two',
                'role': 'Developer'
            }
        )
        if created:
            developer2.set_password('dev123')
            developer2.save()
            self.stdout.write(self.style.SUCCESS('Created developer 2'))

        # Create projects
        project1, created = Project.objects.get_or_create(
            name='E-commerce Website',
            defaults={
                'description': 'A modern e-commerce platform with user authentication, product catalog, and payment processing',
                'start_date': date.today(),
                'end_date': date.today() + timedelta(days=90),
                'status': 'Active',
                'created_by': admin_user
            }
        )
        if created:
            # Add team members
            ProjectMember.objects.get_or_create(project=project1, user=manager_user, defaults={'role_in_project': 'Project Manager'})
            ProjectMember.objects.get_or_create(project=project1, user=developer1, defaults={'role_in_project': 'Frontend Developer'})
            ProjectMember.objects.get_or_create(project=project1, user=developer2, defaults={'role_in_project': 'Backend Developer'})
            self.stdout.write(self.style.SUCCESS('Created e-commerce project'))

        project2, created = Project.objects.get_or_create(
            name='Mobile App Development',
            defaults={
                'description': 'Cross-platform mobile application for iOS and Android',
                'start_date': date.today() + timedelta(days=7),
                'end_date': date.today() + timedelta(days=120),
                'status': 'Active',
                'created_by': manager_user
            }
        )
        if created:
            ProjectMember.objects.get_or_create(project=project2, user=developer1, defaults={'role_in_project': 'Mobile Developer'})
            ProjectMember.objects.get_or_create(project=project2, user=developer2, defaults={'role_in_project': 'UI/UX Designer'})
            self.stdout.write(self.style.SUCCESS('Created mobile app project'))

        # Create tasks
        tasks_data = [
            {
                'project': project1,
                'title': 'Setup Database Schema',
                'description': 'Create database tables for users, products, orders, and payments',
                'assignee': developer2,
                'status': 'DONE',
                'priority': 'High',
                'due_date': date.today() - timedelta(days=5),
                'created_by': manager_user
            },
            {
                'project': project1,
                'title': 'Design User Interface',
                'description': 'Create wireframes and mockups for the main pages',
                'assignee': developer1,
                'status': 'IN_PROGRESS',
                'priority': 'High',
                'due_date': date.today() + timedelta(days=10),
                'created_by': manager_user
            },
            {
                'project': project1,
                'title': 'Implement User Authentication',
                'description': 'Build login, registration, and password reset functionality',
                'assignee': developer2,
                'status': 'TODO',
                'priority': 'Medium',
                'due_date': date.today() + timedelta(days=15),
                'created_by': manager_user
            },
            {
                'project': project1,
                'title': 'Product Catalog System',
                'description': 'Implement product listing, search, and filtering',
                'assignee': developer1,
                'status': 'TODO',
                'priority': 'Medium',
                'due_date': date.today() + timedelta(days=20),
                'created_by': manager_user
            },
            {
                'project': project2,
                'title': 'Setup React Native Environment',
                'description': 'Initialize the React Native project and configure development environment',
                'assignee': developer1,
                'status': 'DONE',
                'priority': 'High',
                'due_date': date.today() - timedelta(days=2),
                'created_by': manager_user
            },
            {
                'project': project2,
                'title': 'Design App Wireframes',
                'description': 'Create detailed wireframes for all app screens',
                'assignee': developer2,
                'status': 'IN_PROGRESS',
                'priority': 'High',
                'due_date': date.today() + timedelta(days=5),
                'created_by': manager_user
            }
        ]

        for task_data in tasks_data:
            task, created = Task.objects.get_or_create(
                title=task_data['title'],
                project=task_data['project'],
                defaults=task_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created task: {task.title}'))

        self.stdout.write(self.style.SUCCESS('Sample data creation completed!'))
        self.stdout.write(self.style.WARNING('Login credentials:'))
        self.stdout.write('Admin: admin@example.com / admin123')
        self.stdout.write('Manager: manager@example.com / manager123')
        self.stdout.write('Developer: dev1@example.com / dev123')
        self.stdout.write('Developer: dev2@example.com / dev123')
