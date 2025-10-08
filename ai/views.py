from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from projects.models import Project, UserStory
from django.shortcuts import get_object_or_404
import os, requests, json

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class GenerateUserStoriesAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        project_id = request.data.get("project_id")
        description = request.data.get("projectDescription")
        if not project_id or not description:
            return Response({"error":"project_id and projectDescription required"}, status=status.HTTP_400_BAD_REQUEST)
        project = get_object_or_404(Project, pk=project_id)

        prompt = (
            f"Generate up to 8 concise user stories from this project description. Return a JSON array of strings.\n\n{description}"
        )
        headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type":"application/json"}
        data = {"model":"gpt-4","messages":[{"role":"user","content":prompt}], "max_tokens":400}
        r = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data)
        if r.status_code != 200: return Response({"error":"AI service failed","details":r.text}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        resp = r.json()
        text = resp["choices"][0]["message"]["content"].strip()
        # try parse JSON
        try:
            stories = json.loads(text)
            if isinstance(stories, str): stories = [stories]
        except:
            lines = [line.strip().strip('"') for line in text.splitlines() if line.strip()]
            stories = [l for l in lines if l.lower().startswith("as a")]
        saved = []
        for s in stories:
            us = UserStory.objects.create(project=project, text=s, generated_by_ai=True)
            saved.append({"id":us.id,"text":us.text})
        return Response({"stories": saved}, status=status.HTTP_201_CREATED)
