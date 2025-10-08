# Project Management Tool

A comprehensive web application for managing software projects, tasks, teams, and tracking progress. Built with Django REST Framework backend and modern JavaScript frontend.

## 🌟 Features

### Core Functionality

- **User Management**: Role-based access control (Admin, Manager, Developer)
- **Project Management**: Create, edit, delete, and track project progress
- **Task Management**: Full CRUD operations with status tracking (To Do, In Progress, Done)
- **Team Collaboration**: Assign tasks to team members and track deadlines
- **Dashboard**: Real-time metrics and project overview
- **Authentication**: JWT-based secure authentication

### Bonus Features

- **AI-Powered User Story Generator**: Automatically generate user stories from project descriptions using OpenAI API
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Updates**: Dynamic dashboard with live project metrics

## 🛠 Tech Stack

### Backend

- **Python 3.8+**
- **Django 5.2.3** - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database (configurable to PostgreSQL/MySQL)
- **JWT Authentication** - Secure token-based auth
- **Swagger/OpenAPI** - API documentation

### Frontend

- **Vanilla JavaScript (ES6+)**
- **Bootstrap 5** - UI framework
- **Font Awesome** - Icons
- **Responsive Design** - Mobile-first approach

### Additional Tools

- **DRF-YASG** - Swagger documentation
- **CORS Headers** - Cross-origin resource sharing
- **Python-dotenv** - Environment variable management

## 📦 Installation & Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd internship
```

### 2. Create Virtual Environment

```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
OPENAI_API_KEY=your-openai-api-key-here
DB_NAME=pm_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
```

### 5. Database Setup

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Sample Data

```bash
python manage.py create_sample_data
```

### 7. Run the Application

```bash
python manage.py runserver
```

The application will be available at `http://127.0.0.1:8000`

## 🚀 Quick Start

### Default Login Credentials

After running `create_sample_data`, use these credentials:

- **Admin**: `admin@example.com` / `admin123`
- **Manager**: `manager@example.com` / `manager123`
- **Developer**: `dev1@example.com` / `dev123`
- **Developer**: `dev2@example.com` / `dev123`

### First Steps

1. **Create a new account** or login with the provided demo credentials
2. Explore the Dashboard to see project metrics
3. Create new projects in the Projects section
4. Add tasks and assign them to team members
5. Try the AI User Story Generator for project planning

### Registration

- Click "Create Account" on the login page
- Fill in your details and select your role (Developer or Manager)
- Admin roles can only be assigned by existing admins
- After registration, you can immediately login with your new account

## 📚 API Documentation

### Base URL

```
http://127.0.0.1:8000/api/
```

### Authentication

All API endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

#### Authentication

- `POST /api/token/` - Login (email, password)
- `POST /api/token/refresh/` - Refresh JWT token
- `POST /api/users/register/` - Register new user account

#### Users

- `GET /api/users/` - List all users
- `POST /api/users/` - Create new user
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user

#### Projects

- `GET /api/projects/` - List all projects
- `POST /api/projects/` - Create new project
- `GET /api/projects/{id}/` - Get project details
- `PUT /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project
- `POST /api/projects/{id}/add-member/` - Add team member
- `GET /api/projects/{id}/summary/` - Get project summary

#### Tasks

- `GET /api/tasks/` - List all tasks
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/{id}/` - Get task details
- `PUT /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task

#### AI Features

- `POST /api/ai/generate-user-stories/` - Generate user stories from project description

### Interactive API Documentation

Visit `http://127.0.0.1:8000/swagger/` for interactive Swagger documentation.

## 🏗 Project Structure

```
internship/
├── project_management/          # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── views.py
├── users/                       # User management app
│   ├── models.py               # Custom User model
│   ├── views.py                # UserViewSet
│   ├── serializers.py          # User serializers
│   └── management/commands/    # Custom management commands
├── projects/                    # Projects and tasks app
│   ├── models.py               # Project, Task, Comment models
│   ├── views.py                # ProjectViewSet, TaskViewSet
│   └── serializers.py          # Project and task serializers
├── ai/                         # AI features app
│   ├── views.py                # AI story generator
│   └── urls.py                 # AI endpoints
├── templates/                  # HTML templates
│   ├── base.html              # Main application template
│   └── modals.html            # Modal dialogs
├── static/                     # Static files
│   └── js/
│       └── app.js             # Frontend JavaScript
├── requirements.txt            # Python dependencies
└── README.md                  # This file
```

## 🎯 User Roles & Permissions

### Admin

- Full access to all features
- Can manage all users, projects, and tasks
- Can access admin panel at `/admin/`

### Manager

- Can create and edit projects
- Can assign tasks to team members
- Can view all projects and tasks

### Developer

- Can view assigned tasks
- Can update task status and add comments
- Limited access to project management

## 🤖 AI User Story Generator

### How to Use

1. Navigate to the "AI Stories" section
2. Select a project from the dropdown
3. Enter a detailed project description
4. Click "Generate User Stories"
5. Review and use the generated stories for task planning

### Example Input

```
An ecommerce website where customers can browse products, add to cart, and make payments online. Admin should manage products and view orders.
```

### Expected Output

```
- As a customer, I want to browse products, so that I can choose what to buy.
- As a customer, I want to add products to a cart, so that I can purchase them later.
- As an admin, I want to manage the product catalog, so that the website reflects correct inventory.
```

## 🧪 Testing

### Run Tests

```bash
python manage.py test
```

### Manual Testing

Use the provided Postman collection or test via the Swagger interface at `/swagger/`.

## 📊 Database Schema

### Key Models

#### User Model

- `email` (unique)
- `full_name`
- `role` (Admin, Manager, Developer)
- `is_active`, `is_staff`

#### Project Model

- `name`, `description`
- `start_date`, `end_date`
- `status` (Active, Completed, On Hold)
- `created_by` (FK to User)
- `members` (Many-to-many through ProjectMember)

#### Task Model

- `title`, `description`
- `project` (FK to Project)
- `assignee` (FK to User)
- `status` (TODO, IN_PROGRESS, DONE)
- `priority`, `due_date`
- `created_by` (FK to User)

## 🚀 Deployment

### Production Settings

1. Set `DEBUG = False` in settings
2. Configure proper database (PostgreSQL recommended)
3. Set up static file serving
4. Configure environment variables
5. Use a production WSGI server (Gunicorn)

### Docker Deployment (Optional)

```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "project_management.wsgi:application"]
```

## 🔧 Configuration

### Environment Variables

- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `DB_*`: Database configuration variables

### Customization

- Modify `settings.py` for additional configuration
- Update `templates/` for UI changes
- Extend `models.py` for additional features
- Add new endpoints in `views.py`

## 🐛 Troubleshooting

### Common Issues

1. **ImportError: cannot import name 'UserViewSet'**

   - Solution: Ensure all migrations are applied and models are properly defined

2. **Static files not loading**

   - Solution: Run `python manage.py collectstatic`

3. **AI features not working**

   - Solution: Check OPENAI_API_KEY in .env file
4. **Database connection issues**
   - Solution: Verify database settings and ensure database server is running
   - 
## 📈 Future Improvements
- [ ] Real-time notifications
- [ ] File upload for tasks
- [ ] Advanced reporting and analytics
- [ ] Integration with external tools (Slack, GitHub)
- [ ] Mobile app development
- [ ] Advanced AI features (task prioritization, time estimation)
## 👥 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
## 📄 License
This project is licensed under the MIT License.
## 📞 Support
For support and questions, please contact:
- Email: [pragadeeswaranthangavel@gmail.com]

---

**Note**: This is a demonstration project for internship evaluation. Ensure proper security measures and testing before using in production environments.
