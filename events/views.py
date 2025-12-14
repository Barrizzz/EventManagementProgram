from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count, Sum, Avg, Q, F
import json
from datetime import datetime, timedelta
from django.utils import timezone

from .models import Event, EventCategory, EventDateTime, Venue, Organizer, Ticket, EventCustomer, TicketType
from accounts.models import Customer

# Create your views here.
@login_required
def events_page(request):
    # GET request - display events
    context = {
        'upcoming_events': [],
        'ongoing_events': [],
        'finished_events': [],
    }
    
    all_events = Event.objects.select_related('category', 'datetime', 'venue', 'organizer').all()
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
@login_required
def create_event(request):
    """Create a new event with all related data from complete form"""
    try:
        # Parse JSON data
        data = json.loads(request.body)
        
        # Get or create category
        category_name = data.get('category')
        category = None
        if category_name:
            category, created = EventCategory.objects.get_or_create(category=category_name)
        
        # Get or create organizer with complete data from form
        organizer_data = data.get('organizer', {})
        organizer, created = Organizer.objects.get_or_create(
            name=organizer_data.get('name'),
            defaults={
                'email': organizer_data.get('email'),
                'contactNum': organizer_data.get('contactNum'),
                'website': organizer_data.get('website', '')
            }
        )
        # If organizer exists, update their information
        if not created:
            organizer.email = organizer_data.get('email')
            organizer.contactNum = organizer_data.get('contactNum')
            organizer.website = organizer_data.get('website', '')
            organizer.save()
        
        # Get or create venue with complete data from form
        venue_data = data.get('venue', {})
        venue, created = Venue.objects.get_or_create(
            name=venue_data.get('name'),
            defaults={
                'address': venue_data.get('address'),
                'city': venue_data.get('city'),
                'capacity': venue_data.get('capacity', 100)
            }
        )
        # If venue exists, update its information
        if not created:
            venue.address = venue_data.get('address')
            venue.city = venue_data.get('city')
            venue.capacity = venue_data.get('capacity', 100)
            venue.save()
        
        # Get or create datetime with complete data from form
        datetime_data = data.get('datetime', {})
        date = datetime_data.get('date')
        start_time = datetime.strptime(datetime_data.get('startTime'), '%H:%M').time()
        end_time = datetime.strptime(datetime_data.get('endTime'), '%H:%M').time()
        
        event_datetime, created = EventDateTime.objects.get_or_create(
            date=date,
            startTime=start_time,
            endTime=end_time
        )
        
        # Create the event
        event = Event.objects.create(
            name=data.get('name'),
            description=data.get('description', ''),
            rundown=data.get('rundown', ''),
            materials=data.get('materials', ''),
            category=category,
            datetime=event_datetime,
            organizer=organizer,
            venue=venue
        )
        
        return JsonResponse({
            'success': True,
            'message': f'Event "{event.name}" created successfully!',
            'event_id': event.eventID
        })
    except Exception as e:
        import traceback
        return JsonResponse({
            'success': False, 
            'error': str(e),
            'traceback': traceback.format_exc()
        })

@require_POST
@login_required
def delete_event(request, event_id):
    try:
        event = get_object_or_404(Event, eventID=event_id)
        event_name = event.name
        event.delete()
        return JsonResponse({'success': True, 'message': f'Event "{event_name}" deleted successfully'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

def get_event(request, event_id):
    """Get event data for editing"""
    try:
        event = get_object_or_404(Event, eventID=event_id)
        return JsonResponse({
            'success': True,
            'event': {
                'id': event.eventID,
                'name': event.name,
                'description': event.description,
                'rundown': event.rundown,
                'materials': event.materials,
                'category': event.category.category if event.category else '',
                'organizer': event.organizer.name,
                'venue': event.venue.name,
                'date': event.datetime.date.strftime('%Y-%m-%d'),
                'time': event.datetime.startTime.strftime('%H:%M'),
            }
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@require_POST
@login_required
def update_event(request, event_id):
    """Update an existing event"""
    try:
        event = get_object_or_404(Event, eventID=event_id)
        
        # Parse JSON data from request body
        data = json.loads(request.body)
        
        # Update basic event fields
        event.name = data.get('name')
        event.description = data.get('description')
        event.rundown = data.get('rundown')
        event.materials = data.get('materials')
        
        # Update or create category
        category_name = data.get('category')
        if category_name:
            category, created = EventCategory.objects.get_or_create(category=category_name)
            event.category = category
        
        # Update or create organizer
        organizer_name = data.get('organizer')
        if organizer_name:
            organizer, created = Organizer.objects.get_or_create(
                name=organizer_name,
                defaults={'email': f'{organizer_name.replace(" ", "").lower()}@example.com', 'contactNum': '000-000-0000'}
            )
            event.organizer = organizer
        
        # Update or create venue
        venue_name = data.get('venue')
        if venue_name:
            venue, created = Venue.objects.get_or_create(
                name=venue_name,
                defaults={'address': 'TBD', 'city': 'TBD', 'capacity': 100}
            )
            event.venue = venue
        
        # Update datetime
        date = data.get('date')
        time = data.get('time')
        if date and time:
            from datetime import datetime, time as dt_time
            start_time = datetime.strptime(time, '%H:%M').time()
            end_time = datetime.strptime('18:00', '%H:%M').time()  # Default 6 PM end
            
            event_datetime, created = EventDateTime.objects.get_or_create(
                date=date,
                startTime=start_time,
                defaults={'endTime': end_time}
            )
            event.datetime = event_datetime
        
        event.save()
        return JsonResponse({'success': True, 'message': f'Event "{event.name}" updated successfully'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

# API Endpoints for autocomplete
@login_required
def get_categories(request):
    """Get all event categories for autocomplete"""
    categories = EventCategory.objects.all().values_list('category', flat=True)
    return JsonResponse({'categories': list(categories)})

@login_required
def get_organizers(request):
    """Get all organizers for autocomplete"""
    organizers = Organizer.objects.all().values('name', 'email', 'contactNum', 'website')
    return JsonResponse({'organizers': list(organizers)})

@login_required
def get_venues(request):
    """Get all venues for autocomplete"""
    venues = Venue.objects.all().values('name', 'address', 'city', 'capacity')
    return JsonResponse({'venues': list(venues)})

# Attendees Page Views
@login_required
def attendees_page(request):
    """Render the attendees page with all data"""
    # Get all customers who have attended events
    event_customers = EventCustomer.objects.select_related(
        'customer', 'event', 'ticket', 'ticket__ticket_type'
    ).all()
    
    # Group by customer
    customer_events = {}
    for ec in event_customers:
        customer_id = ec.customer.customerID
        if customer_id not in customer_events:
            customer_events[customer_id] = {
                'customer': ec.customer,
                'events': [],
                'total_spent': 0,
            }
        
        customer_events[customer_id]['events'].append({
            'event': ec.event,
            'ticket': ec.ticket,
            'ticket_type': ec.ticket.ticket_type,
        })
        customer_events[customer_id]['total_spent'] += float(ec.ticket.ticket_type.price)
    
    # Format attendees data
    attendees_list = []
    for customer_id, data in customer_events.items():
        customer = data['customer']
        attendees_list.append({
            'customer': customer,
            'events_attended': len(data['events']),
            'total_spent': data['total_spent'],
            'event_details': data['events'],
            'latest_event_date': data['events'][0]['event'].datetime.date if data['events'] else None
        })
    
    # Sort by events attended (descending)
    attendees_list.sort(key=lambda x: x['events_attended'], reverse=True)
    
    # Calculate statistics
    total_customers = Customer.objects.count()
    customers_with_tickets = len(customer_events)
    customers_without_tickets = total_customers - customers_with_tickets
    
    # Get new customers this month
    one_month_ago = timezone.now() - timedelta(days=30)
    new_this_month = EventCustomer.objects.filter(
        ticket__purchaseDateTime__gte=one_month_ago
    ).values('customer').distinct().count()
    
    context = {
        'attendees': attendees_list,
        'total_customers': total_customers,
        'subscribed_members': customers_with_tickets,
        'non_subscribed': customers_without_tickets,
        'new_this_month': new_this_month,
        'top_attendees': attendees_list[:5],
    }
    
    return render(request, 'attendees.html', context)

# Reports Page Views
@login_required
def reports_page(request):
    """Render the reports page with analytics data"""
    # Get all events with related data
    events = Event.objects.select_related(
        'category', 'datetime', 'venue', 'organizer'
    ).prefetch_related('tickets', 'tickets__ticket_type').all()
    
    # Calculate overall statistics
    total_events = events.count()
    total_tickets_sold = Ticket.objects.filter(status__in=['sold', 'checked_in']).count()
    
    # Calculate total revenue
    total_revenue = Ticket.objects.filter(
        status__in=['sold', 'checked_in']
    ).aggregate(
        revenue=Sum('ticket_type__price')
    )['revenue'] or 0
    
    # Calculate average event size
    avg_event_size = total_tickets_sold / total_events if total_events > 0 else 0
    
    # Events by category
    events_by_category = {}
    for event in events:
        category = event.category.category if event.category else 'Uncategorized'
        if category not in events_by_category:
            events_by_category[category] = 0
        events_by_category[category] += 1
    
    # Revenue and attendance by event
    events_data = []
    for event in events:
        event_tickets = event.tickets.filter(status__in=['sold', 'checked_in'])
        event_revenue = sum(ticket.ticket_type.price for ticket in event_tickets)
        attendees_count = event_tickets.count()
        
        events_data.append({
            'event': event,
            'tickets_sold': attendees_count,
            'revenue': event_revenue,
            'attendance_rate': (attendees_count / event.venue.capacity * 100) if event.venue.capacity > 0 else 0
        })
    
    # Sort by revenue for top events
    top_events = sorted(events_data, key=lambda x: x['revenue'], reverse=True)[:10]
    
    context = {
        'total_events': total_events,
        'total_attendees': total_tickets_sold,
        'avg_event_size': round(avg_event_size, 1),
        'total_revenue': total_revenue,
        'events_by_category': events_by_category,
        'top_events': top_events,
        'all_events': events_data,
    }
    
    return render(request, 'reports.html', context)

