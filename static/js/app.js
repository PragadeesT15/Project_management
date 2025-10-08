class ProjectManagerApp {
    constructor() {
        this.apiBase = '/api';
        this.token = localStorage.getItem('token');
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        if (this.token) {
            this.loadUserData();
        }
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Registration form
        document.getElementById('registrationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });

        // Navigation
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(link.dataset.section);
            });
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Modal events will be added when modals are created
    }

    async login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        try {
            const response = await fetch(`${this.apiBase}/token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.token = data.access;
                localStorage.setItem('token', this.token);
                await this.loadUserData();
                this.showMainApp();
            } else {
                errorDiv.textContent = data.detail || 'Login failed';
                errorDiv.classList.remove('hidden');
            }
        } catch (error) {
            errorDiv.textContent = 'Network error. Please try again.';
            errorDiv.classList.remove('hidden');
        }
    }

    async register() {
        const email = document.getElementById('regEmail').value;
        const fullName = document.getElementById('regFullName').value;
        const role = document.getElementById('regRole').value;
        const password = document.getElementById('regPassword').value;
        const passwordConfirm = document.getElementById('regPasswordConfirm').value;
        const errorDiv = document.getElementById('registrationError');

        // Clear previous errors
        errorDiv.classList.add('hidden');
        errorDiv.textContent = '';

        // Client-side validation
        if (password !== passwordConfirm) {
            errorDiv.textContent = 'Passwords do not match';
            errorDiv.classList.remove('hidden');
            return;
        }

        if (password.length < 6) {
            errorDiv.textContent = 'Password must be at least 6 characters long';
            errorDiv.classList.remove('hidden');
            return;
        }

        if (!role) {
            errorDiv.textContent = 'Please select a role';
            errorDiv.classList.remove('hidden');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/users/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    full_name: fullName,
                    role,
                    password,
                    password_confirm: passwordConfirm
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                // Registration successful
                bootstrap.Modal.getInstance(document.getElementById('registrationModal')).hide();
                document.getElementById('registrationForm').reset();
                
                // Show success message
                const successDiv = document.createElement('div');
                successDiv.className = 'alert alert-success mt-3';
                successDiv.textContent = 'Account created successfully! You can now login.';
                document.getElementById('loginScreen').querySelector('.card-body').appendChild(successDiv);
                
                // Auto-login after registration
                document.getElementById('email').value = email;
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    if (successDiv.parentNode) {
                        successDiv.parentNode.removeChild(successDiv);
                    }
                }, 3000);
                
            } else {
                // Handle validation errors
                if (data.email) {
                    errorDiv.textContent = data.email[0];
                } else if (data.password) {
                    errorDiv.textContent = data.password[0];
                } else if (data.non_field_errors) {
                    errorDiv.textContent = data.non_field_errors[0];
                } else {
                    errorDiv.textContent = 'Registration failed. Please check your information.';
                }
                errorDiv.classList.remove('hidden');
            }
        } catch (error) {
            errorDiv.textContent = 'Network error. Please try again.';
            errorDiv.classList.remove('hidden');
        }
    }

    async loadUserData() {
        try {
            // For now, we'll get user data from the users endpoint
            // In a real app, you'd have a /me endpoint
            const response = await fetch(`${this.apiBase}/users/`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            
            if (response.ok) {
                const users = await response.json();
                // Assume first user for demo - in real app, get from /me endpoint
                this.currentUser = users.results[0] || users[0];
                this.updateUserInfo();
                this.loadDashboard();
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }

    updateUserInfo() {
        if (this.currentUser) {
            document.getElementById('userRole').textContent = this.currentUser.role;
        }
    }

    showMainApp() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('token');
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        document.getElementById('loginError').classList.add('hidden');
        
        // Clear login form
        document.getElementById('loginForm').reset();
        
        // Remove any success messages
        const successMessages = document.querySelectorAll('.alert-success');
        successMessages.forEach(msg => msg.remove());
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Show section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(`${sectionName}Section`).classList.remove('hidden');

        // Load section data
        switch(sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'projects':
                this.loadProjects();
                break;
            case 'tasks':
                this.loadTasks();
                this.loadFormData();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'ai':
                this.loadAI();
                break;
        }
    }

    async loadDashboard() {
        try {
            const [projectsResponse, tasksResponse] = await Promise.all([
                fetch(`${this.apiBase}/projects/`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                }),
                fetch(`${this.apiBase}/tasks/`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                })
            ]);

            const projects = await projectsResponse.json();
            const tasks = await tasksResponse.json();

            const projectsData = projects.results || projects;
            const tasksData = tasks.results || tasks;

            // Update counters
            document.getElementById('totalProjects').textContent = projectsData.length;
            document.getElementById('totalTasks').textContent = tasksData.length;
            document.getElementById('completedTasks').textContent = 
                tasksData.filter(t => t.status === 'DONE').length;
            document.getElementById('overdueTasks').textContent = 
                tasksData.filter(t => this.isOverdue(t.due_date)).length;

            // Show recent projects
            this.renderRecentProjects(projectsData.slice(0, 5));
            
            // Show recent tasks
            this.renderRecentTasks(tasksData.slice(0, 5));

        } catch (error) {
            console.error('Failed to load dashboard:', error);
        }
    }

    renderRecentProjects(projects) {
        const container = document.getElementById('recentProjects');
        container.innerHTML = projects.map(project => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <strong>${project.name}</strong>
                    <br><small class="text-muted">${project.status}</small>
                </div>
                <span class="badge bg-primary">${project.tasks?.length || 0} tasks</span>
            </div>
        `).join('');
    }

    renderRecentTasks(tasks) {
        const container = document.getElementById('recentTasks');
        container.innerHTML = tasks.map(task => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <strong>${task.title}</strong>
                    <br><small class="text-muted">${task.project?.name || 'No Project'}</small>
                </div>
                <span class="status-badge status-${task.status.toLowerCase().replace('_', '')}">${task.status}</span>
            </div>
        `).join('');
    }

    async loadProjects() {
        try {
            const response = await fetch(`${this.apiBase}/projects/`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const projects = await response.json();
            this.renderProjects(projects.results || projects);
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    }

    renderProjects(projects) {
        const container = document.getElementById('projectsList');
        container.innerHTML = projects.map(project => `
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h5 class="card-title">${project.name}</h5>
                            <p class="card-text">${project.description || 'No description'}</p>
                            <small class="text-muted">
                                Created: ${new Date(project.created_at).toLocaleDateString()}
                                ${project.start_date ? ` | Start: ${new Date(project.start_date).toLocaleDateString()}` : ''}
                                ${project.end_date ? ` | End: ${new Date(project.end_date).toLocaleDateString()}` : ''}
                            </small>
                        </div>
                        <div class="text-end">
                            <span class="badge bg-primary">${project.status}</span>
                            <br><br>
                            <button class="btn btn-sm btn-outline-primary me-2" onclick="app.editProject(${project.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="app.deleteProject(${project.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadTasks() {
        try {
            const response = await fetch(`${this.apiBase}/tasks/`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const tasks = await response.json();
            this.renderTasks(tasks.results || tasks);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    }

    renderTasks(tasks) {
        const container = document.getElementById('tasksList');
        container.innerHTML = tasks.map(task => `
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h5 class="card-title">${task.title}</h5>
                            <p class="card-text">${task.description || 'No description'}</p>
                            <small class="text-muted">
                                Project: ${task.project?.name || 'No Project'} | 
                                Assignee: ${task.assignee?.full_name || task.assignee?.email || 'Unassigned'} |
                                Due: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                                ${this.isOverdue(task.due_date) ? ' <span class="text-danger">(OVERDUE)</span>' : ''}
                            </small>
                        </div>
                        <div class="text-end">
                            <span class="status-badge status-${task.status.toLowerCase().replace('_', '')}">${task.status}</span>
                            <br><br>
                            <button class="btn btn-sm btn-outline-primary me-2" onclick="app.editTask(${task.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="app.deleteTask(${task.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadUsers() {
        try {
            const response = await fetch(`${this.apiBase}/users/`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const users = await response.json();
            this.renderUsers(users.results || users);
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    }

    renderUsers(users) {
        const container = document.getElementById('usersList');
        container.innerHTML = users.map(user => `
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="card-title">${user.full_name || user.email}</h5>
                            <p class="card-text text-muted">${user.email}</p>
                            <span class="badge bg-secondary">${user.role}</span>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-outline-primary me-2" onclick="app.editUser(${user.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="app.deleteUser(${user.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadAI() {
        try {
            const response = await fetch(`${this.apiBase}/projects/`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const projects = await response.json();
            const select = document.getElementById('projectSelect');
            select.innerHTML = '<option value="">Choose a project...</option>' +
                (projects.results || projects).map(p => 
                    `<option value="${p.id}">${p.name}</option>`
                ).join('');
        } catch (error) {
            console.error('Failed to load projects for AI:', error);
        }

        // Setup AI form
        document.getElementById('aiStoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateUserStories();
        });
    }

    async generateUserStories() {
        const projectId = document.getElementById('projectSelect').value;
        const description = document.getElementById('projectDescription').value;
        const container = document.getElementById('generatedStories');

        if (!projectId || !description) {
            alert('Please select a project and enter a description');
            return;
        }

        try {
            container.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Generating stories...</div>';
            
            const response = await fetch(`${this.apiBase}/ai/generate-user-stories/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    project_id: projectId,
                    projectDescription: description
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                container.innerHTML = `
                    <h5>Generated User Stories:</h5>
                    <ul class="list-group">
                        ${data.stories.map(story => `
                            <li class="list-group-item">
                                <i class="fas fa-user-story text-primary me-2"></i>
                                ${story.text}
                            </li>
                        `).join('')}
                    </ul>
                `;
            } else {
                container.innerHTML = `<div class="alert alert-danger">Error: ${data.error}</div>`;
            }
        } catch (error) {
            container.innerHTML = `<div class="alert alert-danger">Network error: ${error.message}</div>`;
        }
    }

    // Utility methods
    isOverdue(dueDate) {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    }

    // CRUD operations
    async saveProject() {
        const projectData = {
            name: document.getElementById('projectName').value,
            description: document.getElementById('projectDescription').value,
            start_date: document.getElementById('projectStartDate').value || null,
            end_date: document.getElementById('projectEndDate').value || null,
            status: document.getElementById('projectStatus').value
        };

        try {
            const response = await fetch(`${this.apiBase}/projects/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData)
            });

            if (response.ok) {
                bootstrap.Modal.getInstance(document.getElementById('projectModal')).hide();
                document.getElementById('projectForm').reset();
                this.loadProjects();
                this.showSection('projects');
            } else {
                alert('Failed to create project');
            }
        } catch (error) {
            alert('Error creating project: ' + error.message);
        }
    }

    async editProject(id) {
        try {
            const response = await fetch(`${this.apiBase}/projects/${id}/`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const project = await response.json();

            // Populate edit form
            document.getElementById('editProjectId').value = project.id;
            document.getElementById('editProjectName').value = project.name;
            document.getElementById('editProjectDescription').value = project.description || '';
            document.getElementById('editProjectStartDate').value = project.start_date || '';
            document.getElementById('editProjectEndDate').value = project.end_date || '';
            document.getElementById('editProjectStatus').value = project.status;

            // Show edit modal
            new bootstrap.Modal(document.getElementById('editProjectModal')).show();
        } catch (error) {
            alert('Error loading project: ' + error.message);
        }
    }

    async updateProject() {
        const id = document.getElementById('editProjectId').value;
        const projectData = {
            name: document.getElementById('editProjectName').value,
            description: document.getElementById('editProjectDescription').value,
            start_date: document.getElementById('editProjectStartDate').value || null,
            end_date: document.getElementById('editProjectEndDate').value || null,
            status: document.getElementById('editProjectStatus').value
        };

        try {
            const response = await fetch(`${this.apiBase}/projects/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData)
            });

            if (response.ok) {
                bootstrap.Modal.getInstance(document.getElementById('editProjectModal')).hide();
                this.loadProjects();
            } else {
                alert('Failed to update project');
            }
        } catch (error) {
            alert('Error updating project: ' + error.message);
        }
    }

    async deleteProject(id) {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                const response = await fetch(`${this.apiBase}/projects/${id}/`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${this.token}` }
                });

                if (response.ok) {
                    this.loadProjects();
                } else {
                    alert('Failed to delete project');
                }
            } catch (error) {
                alert('Error deleting project: ' + error.message);
            }
        }
    }

    async saveTask() {
        const taskData = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            project: document.getElementById('taskProject').value,
            assignee: document.getElementById('taskAssignee').value || null,
            status: document.getElementById('taskStatus').value,
            priority: document.getElementById('taskPriority').value,
            due_date: document.getElementById('taskDueDate').value || null
        };

        try {
            const response = await fetch(`${this.apiBase}/tasks/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            if (response.ok) {
                bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
                document.getElementById('taskForm').reset();
                this.loadTasks();
                this.showSection('tasks');
            } else {
                alert('Failed to create task');
            }
        } catch (error) {
            alert('Error creating task: ' + error.message);
        }
    }

    async editTask(id) {
        try {
            const response = await fetch(`${this.apiBase}/tasks/${id}/`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const task = await response.json();

            // Populate edit form
            document.getElementById('editTaskId').value = task.id;
            document.getElementById('editTaskTitle').value = task.title;
            document.getElementById('editTaskDescription').value = task.description || '';
            document.getElementById('editTaskProject').value = task.project;
            document.getElementById('editTaskAssignee').value = task.assignee || '';
            document.getElementById('editTaskStatus').value = task.status;
            document.getElementById('editTaskPriority').value = task.priority || 'Low';
            document.getElementById('editTaskDueDate').value = task.due_date || '';

            // Show edit modal
            new bootstrap.Modal(document.getElementById('editTaskModal')).show();
        } catch (error) {
            alert('Error loading task: ' + error.message);
        }
    }

    async updateTask() {
        const id = document.getElementById('editTaskId').value;
        const taskData = {
            title: document.getElementById('editTaskTitle').value,
            description: document.getElementById('editTaskDescription').value,
            project: document.getElementById('editTaskProject').value,
            assignee: document.getElementById('editTaskAssignee').value || null,
            status: document.getElementById('editTaskStatus').value,
            priority: document.getElementById('editTaskPriority').value,
            due_date: document.getElementById('editTaskDueDate').value || null
        };

        try {
            const response = await fetch(`${this.apiBase}/tasks/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            if (response.ok) {
                bootstrap.Modal.getInstance(document.getElementById('editTaskModal')).hide();
                this.loadTasks();
            } else {
                alert('Failed to update task');
            }
        } catch (error) {
            alert('Error updating task: ' + error.message);
        }
    }

    async deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await fetch(`${this.apiBase}/tasks/${id}/`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${this.token}` }
                });

                if (response.ok) {
                    this.loadTasks();
                } else {
                    alert('Failed to delete task');
                }
            } catch (error) {
                alert('Error deleting task: ' + error.message);
            }
        }
    }

    async saveUser() {
        const userData = {
            email: document.getElementById('userEmail').value,
            full_name: document.getElementById('userFullName').value,
            password: document.getElementById('userPassword').value,
            role: document.getElementById('userRole').value
        };

        try {
            const response = await fetch(`${this.apiBase}/users/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
                document.getElementById('userForm').reset();
                this.loadUsers();
                this.showSection('users');
            } else {
                alert('Failed to create user');
            }
        } catch (error) {
            alert('Error creating user: ' + error.message);
        }
    }

    async editUser(id) {
        try {
            const response = await fetch(`${this.apiBase}/users/${id}/`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const user = await response.json();

            // For now, just show an alert - you could create an edit user modal
            alert(`Edit user: ${user.full_name || user.email}`);
        } catch (error) {
            alert('Error loading user: ' + error.message);
        }
    }

    async deleteUser(id) {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`${this.apiBase}/users/${id}/`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${this.token}` }
                });

                if (response.ok) {
                    this.loadUsers();
                } else {
                    alert('Failed to delete user');
                }
            } catch (error) {
                alert('Error deleting user: ' + error.message);
            }
        }
    }

    // Load dropdown data for forms
    async loadFormData() {
        try {
            const [projectsResponse, usersResponse] = await Promise.all([
                fetch(`${this.apiBase}/projects/`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                }),
                fetch(`${this.apiBase}/users/`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                })
            ]);

            const projects = await projectsResponse.json();
            const users = await usersResponse.json();

            const projectsData = projects.results || projects;
            const usersData = users.results || users;

            // Update project dropdowns
            const projectSelects = ['taskProject', 'editTaskProject'];
            projectSelects.forEach(selectId => {
                const select = document.getElementById(selectId);
                if (select) {
                    const currentValue = select.value;
                    select.innerHTML = '<option value="">Select Project</option>' +
                        projectsData.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
                    select.value = currentValue;
                }
            });

            // Update user dropdowns
            const userSelects = ['taskAssignee', 'editTaskAssignee'];
            userSelects.forEach(selectId => {
                const select = document.getElementById(selectId);
                if (select) {
                    const currentValue = select.value;
                    select.innerHTML = '<option value="">Unassigned</option>' +
                        usersData.map(u => `<option value="${u.id}">${u.full_name || u.email}</option>`).join('');
                    select.value = currentValue;
                }
            });
        } catch (error) {
            console.error('Failed to load form data:', error);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ProjectManagerApp();
});
