from rest_framework import serializers
from .models import Project, ProjectMember, Task, Comment, UserStory
from users.serializers import UserSerializer
from users.models import User

class ProjectSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    class Meta: model = Project; fields = "__all__"

class ProjectMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta: model = ProjectMember; fields = "__all__"

class TaskSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    assignee_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True, source="assignee")
    class Meta:
        model = Task
        fields = ["id","project","title","description","assignee","assignee_id","status","priority","due_date","created_by","created_at","updated_at"]
        read_only_fields = ("created_by","created_at","updated_at")
class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    class Meta: model = Comment; fields = "__all__"
class UserStorySerializer(serializers.ModelSerializer):
    class Meta: model = UserStory; fields = "__all__"
