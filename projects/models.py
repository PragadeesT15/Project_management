from django.db import models
from django.conf import settings

class Project(models.Model):
    STATUS_CHOICES = (("Active","Active"),("Completed","Completed"),("On Hold","On Hold"))
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="created_projects")
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, through="ProjectMember", related_name="projects")
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.name

class ProjectMember(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role_in_project = models.CharField(max_length=100, blank=True)
    class Meta: unique_together = ("project","user")

class Task(models.Model):
    STATUS = (("TODO","To Do"),("IN_PROGRESS","In Progress"),("DONE","Done"))
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="assigned_tasks")
    status = models.CharField(max_length=20, choices=STATUS, default="TODO")
    priority = models.CharField(max_length=50, blank=True)
    due_date = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="created_tasks")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def is_overdue(self):
        from django.utils import timezone
        return self.due_date and self.due_date < timezone.localdate()

class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class UserStory(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="user_stories")
    text = models.TextField()
    generated_by_ai = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
