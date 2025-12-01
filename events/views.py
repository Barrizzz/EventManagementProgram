from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

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
            
    return render(request, 'events.html', context)

@require_POST
def delete_event(request, event_id):
    try:
        event = get_object_or_404(Event, id=event_id)
        event.delete()
        return JsonResponse({'success': True, 'message': f'Event "{event.title}" deleted successfully'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

def get_event(request, event_id):
    """Get event data for editing"""
    try:
        event = get_object_or_404(Event, id=event_id)
        return JsonResponse({
            'success': True,
            'event': {
                'id': event.id,
                'title': event.title,
                'description': event.description,
                'location': event.location,
                'date': event.date.strftime('%Y-%m-%d'),
                'start_time': event.start_time.strftime('%H:%M'),
                'end_time': event.end_time.strftime('%H:%M'),
                'status': event.status,
                'max_attendees': event.max_attendees,
                'image_url': event.image_url or ''
            }
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@require_POST
def update_event(request, event_id):
    """Update an existing event"""
    try:
        event = get_object_or_404(Event, id=event_id)
        
        # Update event fields
        event.title = request.POST.get('title')
        event.description = request.POST.get('description')
        event.location = request.POST.get('location')
        event.date = request.POST.get('date')
        event.start_time = request.POST.get('start_time')
        event.end_time = request.POST.get('end_time')
        event.status = request.POST.get('status', 'upcoming')
        event.max_attendees = request.POST.get('max_attendees', 0)
        event.image_url = request.POST.get('image_url') if request.POST.get('image_url') else None
        
        event.save()
        return JsonResponse({'success': True, 'message': f'Event "{event.title}" updated successfully'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})