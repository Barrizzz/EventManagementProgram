from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Event

# Create your views here.
def events_page(request):
    if request.method == 'POST':
        # Handle event creation
        title = request.POST.get('title')
        description = request.POST.get('description')
        location = request.POST.get('location')
        date = request.POST.get('date')
        start_time = request.POST.get('start_time')
        end_time = request.POST.get('end_time')
        status = request.POST.get('status', 'upcoming')
        max_attendees = request.POST.get('max_attendees', 0)
        image_url = request.POST.get('image_url')

        try:
            event = Event.objects.create(
                title=title,
                description=description,
                location=location,
                date=date,
                start_time=start_time,
                end_time=end_time,
                status=status,
                max_attendees=max_attendees if max_attendees else 0,
                image_url=image_url if image_url else None
            )
            return JsonResponse({'success': True, 'event_id': event.id})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    # GET request - display events
    all_events = Event.objects.all()
    ongoing_events = all_events.filter(status='ongoing')
    upcoming_events = all_events.filter(status='upcoming')
    finished_events = all_events.filter(status='finished')
    
    context = {
        'ongoing_events': ongoing_events,
        'upcoming_events': upcoming_events,
        'finished_events': finished_events,
        'all_events': all_events
    }
    return render(request, 'events.html', context)