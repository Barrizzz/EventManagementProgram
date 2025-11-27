from django.shortcuts import render
from events.models import Event

# Create your views here.
def index(request):
    # Get ongoing and upcoming events from database
    ongoing_events = Event.objects.filter(status='ongoing')[:3]  # Limit to 3
    upcoming_events = Event.objects.filter(status='upcoming')[:3]  # Limit to 3
    
    context = {
        'ongoing_events': ongoing_events,
        'upcoming_events': upcoming_events,
    }
    return render(request, 'index.html', context)
