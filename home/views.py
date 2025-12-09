from django.shortcuts import render
from events.models import Event
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def index(request):
    context = {
        'upcoming_events': [],
        'ongoing_events': [],
        'finished_events': [],
    }
    
    all_events = Event.objects.all()
    for event in all_events:
        status = event.status
        if status == 'upcoming':
            context['upcoming_events'].append(event)
        elif status == 'ongoing':
            context['ongoing_events'].append(event)
        elif status == 'finished':
            context['finished_events'].append(event)
    
    return render(request, 'index.html', context)
