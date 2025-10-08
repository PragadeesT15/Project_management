from django.urls import path
from .views import GenerateUserStoriesAPIView
urlpatterns = [ path("generate-user-stories/", GenerateUserStoriesAPIView.as_view(), name="generate_user_stories")]