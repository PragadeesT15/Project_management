from django.shortcuts import render

def home(request):
    """Serve the main application template"""
    return render(request, 'base.html')
