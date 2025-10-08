from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Project, ProjectMember, Task
from .serializers import ProjectSerializer, ProjectMemberSerializer, TaskSerializer
from users.models import User
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by("-created_at")
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer): serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"], url_path="add-member")
    def add_member(self, request, pk=None):
        proj = self.get_object()
        user_id = request.data.get("user_id")
        role_in_project = request.data.get("role_in_project","Member")
        user = get_object_or_404(User, pk=user_id)
        pm, created = ProjectMember.objects.get_or_create(project=proj, user=user, defaults={"role_in_project": role_in_project})
        return Response(ProjectMemberSerializer(pm).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="summary")
    def summary(self, request, pk=None):
        proj = self.get_object()
        tasks = proj.tasks.all()
        total = tasks.count()
        by_status = {
            "TODO": tasks.filter(status="TODO").count(),
            "IN_PROGRESS": tasks.filter(status="IN_PROGRESS").count(),
            "DONE": tasks.filter(status="DONE").count(),
        }
        overdue = tasks.filter(due_date__lt=timezone.localdate()).count()
        return Response({"total": total, "by_status": by_status, "overdue": overdue})

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by("-created_at")
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer): serializer.save(created_by=self.request.user)
