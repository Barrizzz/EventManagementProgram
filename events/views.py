from django.shortcuts import render
from django.http import JsonResponse, Http404
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.db import connection, transaction
from django.db.models import Count, Sum, Avg, Q, F
import json
from datetime import datetime, timedelta
import traceback
from django.utils import timezone

from .models import Event, EventCategory, EventDateTime, Venue, Organizer, Ticket, EventCustomer
from accounts.models import Customer

# Create your views here.
@login_required
def events_page(request):
    # GET request - display events
    user = request.user
    context = {
        'user': user,
        'upcoming_events': [],
        'ongoing_events': [],
        'finished_events': [],
    }
    
    # Use select_related to efficiently load foreign key relationships
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                e.eventID,
                e.name AS event_name,
                e.description,
                e.rundown,
                e.materials,

                c.CategoryID,
                c.category,

                d.eventDateTimeID,
                d.date,
                d.startTime,
                d.endTime,

                v.venueID,
                v.name AS venue_name,
                v.address,
                v.city,
                v.capacity,

                o.organizerID,
                o.name AS organizer_name,
                o.email,
                o.contactNum,
                o.website

            FROM Event e
            JOIN EventCategory c
                ON e.category_id = c.categoryID
            JOIN EventDateTime d
                ON e.datetime_id = d.eventDateTimeID
            JOIN Venue v
                ON e.venue_id = v.venueID
            JOIN Organizer o
                ON e.organizer_id = o.organizerID
        """)

        columns = [col[0] for col in cursor.description]
        print(columns)
        rows = cursor.fetchall()

    now = datetime.now()

    for row in rows:
        event = dict(zip(columns, row))

        start_dt = datetime.combine(event['date'], event['startTime'])
        end_dt = datetime.combine(event['date'], event['endTime'])

        if now < start_dt:
            context['upcoming_events'].append(event)
        elif start_dt <= now <= end_dt:
            context['ongoing_events'].append(event)
        else:
            context['finished_events'].append(event)
    
    return render(request, 'events.html', context)

@require_POST
@login_required
def create_event(request):
    """
    Create a new event with all related data using raw SQL execution (MySQL syntax).
    """
    try:
        # Decode request body and parse JSON data
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid JSON in request body.'}, status=400)

    try:
        # Use a transaction block to ensure atomicity (ACID properties)
        with transaction.atomic():
            with connection.cursor() as cursor:
                # --- 1. Get or Create Category ---
                category_id = None
                category_name = data.get('category')
                
                if category_name:
                    # 1a. Try to select the existing category
                    cursor.execute(
                        "SELECT `categoryID` FROM `eventcategory` WHERE `category` = %s",
                        [category_name]
                    )
                    row = cursor.fetchone()

                    if row:
                        category_id = row[0]
                    else:
                        # 1b. Insert new category and get its ID (using LAST_INSERT_ID() for MySQL)
                        cursor.execute(
                            "INSERT INTO `eventcategory` (`category`) VALUES (%s)",
                            [category_name]
                        )
                        cursor.execute("SELECT LAST_INSERT_ID()")
                        category_id = cursor.fetchone()[0]

                # --- 2. Get or Create Organizer ---
                organizer_data = data.get('organizer', {})
                organizer_name = organizer_data.get('name')
                organizer_id = None

                if organizer_name:
                    email = organizer_data.get('email')
                    contact_num = organizer_data.get('contactNum')
                    website = organizer_data.get('website', '')
                    
                    # 2a. Try to select the existing organizer
                    cursor.execute(
                        "SELECT `organizerID` FROM `organizer` WHERE `name` = %s",
                        [organizer_name]
                    )
                    row = cursor.fetchone()
                    
                    if row:
                        # Organizer exists: Update its information
                        organizer_id = row[0]
                        cursor.execute(
                            """
                            UPDATE `organizer` 
                            SET `email` = %s, `contactNum` = %s, `website` = %s 
                            WHERE `organizerID` = %s
                            """,
                            [email, contact_num, website, organizer_id]
                        )
                    else:
                        # 2b. Insert new organizer and get its ID
                        cursor.execute(
                            """
                            INSERT INTO `organizer` (`name`, `email`, `contactNum`, `website`) 
                            VALUES (%s, %s, %s, %s)
                            """,
                            [organizer_name, email, contact_num, website]
                        )
                        cursor.execute("SELECT LAST_INSERT_ID()")
                        organizer_id = cursor.fetchone()[0]


                # --- 3. Get or Create Venue ---
                venue_data = data.get('venue', {})
                venue_name = venue_data.get('name')
                venue_id = None
                
                if venue_name:
                    address = venue_data.get('address')
                    city = venue_data.get('city')
                    # Ensure capacity is an integer, defaulting to 100
                    try:
                        capacity = int(venue_data.get('capacity', 100))
                    except ValueError:
                        capacity = 100
                    
                    # 3a. Try to select the existing venue
                    cursor.execute(
                        "SELECT `venueID` FROM `venue` WHERE `name` = %s",
                        [venue_name]
                    )
                    row = cursor.fetchone()
                    
                    if row:
                        # Venue exists: Update its information
                        venue_id = row[0]
                        cursor.execute(
                            """
                            UPDATE `venue` 
                            SET `address` = %s, `city` = %s, `capacity` = %s 
                            WHERE `venueID` = %s
                            """,
                            [address, city, capacity, venue_id]
                        )
                    else:
                        # 3b. Insert new venue and get its ID
                        cursor.execute(
                            """
                            INSERT INTO `venue` (`name`, `address`, `city`, `capacity`) 
                            VALUES (%s, %s, %s, %s)
                            """,
                            [venue_name, address, city, capacity]
                        )
                        cursor.execute("SELECT LAST_INSERT_ID()")
                        venue_id = cursor.fetchone()[0]
                        
                # --- 4. Get or Create Datetime ---
                datetime_data = data.get('datetime', {})
                date_str = datetime_data.get('date')
                start_time_str = datetime_data.get('startTime')
                end_time_str = datetime_data.get('endTime')

                if not (date_str and start_time_str and end_time_str):
                    return JsonResponse({'success': False, 'error': 'Date and time information is incomplete.'}, status=400)

                # Convert time strings to time objects for insertion (or just ensure %H:%M format)
                # MySQL often prefers 'HH:MM:SS' string format for TIME fields.
                start_time_obj = datetime.strptime(start_time_str, '%H:%M').time()
                end_time_obj = datetime.strptime(end_time_str, '%H:%M').time()
                
                event_datetime_id = None
                
                # 4a. Try to select the existing datetime
                cursor.execute(
                    """
                    SELECT `eventdatetimeID` FROM `eventdatetime` 
                    WHERE `date` = %s AND `startTime` = %s AND `endTime` = %s
                    """,
                    [date_str, start_time_obj, end_time_obj]
                )
                row = cursor.fetchone()
                
                if row:
                    event_datetime_id = row[0]
                else:
                    # 4b. Insert new datetime and get its ID
                    cursor.execute(
                        """
                        INSERT INTO `eventdatetime` (`date`, `startTime`, `endTime`) 
                        VALUES (%s, %s, %s)
                        """,
                        [date_str, start_time_obj, end_time_obj]
                    )
                    cursor.execute("SELECT LAST_INSERT_ID()")
                    event_datetime_id = cursor.fetchone()[0]
                
                # --- 5. Create the main Event record ---
                event_name = data.get('name')
                description = data.get('description', '')
                rundown = data.get('rundown', '')
                materials = data.get('materials', '')
                
                if not event_name:
                    # Explicitly raise an error if the event name is missing
                    raise ValueError("Event name is required.")

                # Insert the new Event and retrieve its ID
                cursor.execute(
                    """
                    INSERT INTO `event` 
                    (`name`, `description`, `rundown`, `materials`, `category_id`, `datetime_id`, `organizer_id`, `venue_id`) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    [
                        event_name, description, rundown, materials, 
                        category_id, event_datetime_id, organizer_id, venue_id
                    ]
                )
                cursor.execute("SELECT LAST_INSERT_ID()")
                event_id = cursor.fetchone()[0]
                
        # Commit happens automatically if the 'with transaction.atomic()' block succeeds

        return JsonResponse({
            'success': True,
            'message': f'Event "{event_name}" created successfully!',
            'event_id': event_id
        })

    except Exception as e:
        # Rollback happens automatically if an exception is raised inside the 'with transaction.atomic()' block
        import traceback
        return JsonResponse({
            'success': False, 
            'error': str(e),
            'traceback': traceback.format_exc()
        }, status=500)

@require_POST
@login_required
def delete_event(request, event_id):

    """
    -- 1. Check existing constraints on the table (for MySQL)
    SHOW CREATE TABLE ems_db.eventcustomer;

    -- 2. Drop the old restrictive foreign key constraint (replace the name with the one from your error message, e.g., `eventCustomer_event_id_da5248b6_fk_event_eventID`)
    ALTER TABLE ems_db.eventcustomer
        DROP FOREIGN KEY eventCustomer_event_id_da5248b6_fk_event_eventID;

    -- 3. Re-add the foreign key with the CASCADE rule
    ALTER TABLE ems_db.eventcustomer
        ADD CONSTRAINT eventCustomer_event_id_da5248b6_fk_event_eventID
        FOREIGN KEY (event_id)
        REFERENCES event (eventID)
        ON DELETE CASCADE;

    -- 4.
    ALTER TABLE `ems_db`.`ticket`
    DROP FOREIGN KEY `ticket_event_id_50ca8740_fk_event_eventID`;

    ALTER TABLE `ems_db`.`ticket`
    ADD CONSTRAINT `ticket_event_id_50ca8740_fk_event_eventID`
    FOREIGN KEY (`event_id`)
    REFERENCES `event` (`eventID`)
    ON DELETE CASCADE;
    """
    try:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM `event` WHERE `eventID` = %s", [event_id])
        return JsonResponse({'success': True, 'message': f'Event ID {event_id} deleted successfully'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

def get_event(request, event_id):
    """Get event data for editing"""
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    e.eventID,
                    e.name,
                    e.description,
                    e.rundown,
                    e.materials,

                    c.category,

                    d.date,
                    d.startTime,
                    d.endTime,

                    v.name AS venue_name,

                    o.name AS organizer_name

                FROM Event e
                LEFT JOIN EventCategory c
                    ON e.category_id = c.categoryID
                LEFT JOIN EventDateTime d
                    ON e.datetime_id = d.eventDateTimeID
                LEFT JOIN Venue v
                    ON e.venue_id = v.venueID
                LEFT JOIN Organizer o
                    ON e.organizer_id = o.organizerID
                WHERE e.eventID = %s
            """, [event_id])

            columns = [col[0] for col in cursor.description]
            row = cursor.fetchone()

            event = dict(zip(columns, row))
            print(event)

            return JsonResponse({
                'success': True,
                'event': {
                    'id': event['eventID'],
                    'name': event['name'],
                    'description': event['description'],
                    'rundown': event['rundown'],
                    'materials': event['materials'],
                    'category': event['category'] if event['category'] else '',
                    'organizer': event['organizer_name'],
                    'venue': event['venue_name'],
                    'date': event['date'].strftime('%Y-%m-%d'),
                    'startTime': event['startTime'].strftime('%H:%M'),
                    'endTime': event['endTime'].strftime('%H:%M'),
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
    with connection.cursor() as cursor:
        cursor.execute("SELECT category FROM eventcategory")
        categories = [row[0] for row in cursor.fetchall()]
    return JsonResponse({'categories': categories})

@login_required
def get_organizers(request):
    """Get all organizers for autocomplete"""
    with connection.cursor() as cursor:
        cursor.execute("SELECT name, email, contactNum, website FROM organizer")
        organizers = [
            {
                'name': row[0],
                'email': row[1],
                'contactNum': row[2],
                'website': row[3]
            } for row in cursor.fetchall()
        ]
    return JsonResponse({'organizers': organizers})

@login_required
def get_venues(request):
    """Get all venues for autocomplete"""
    with connection.cursor() as cursor:
        cursor.execute("SELECT name, address, city, capacity FROM venue")
        venues = [
            {
                'name': row[0],
                'address': row[1],
                'city': row[2],
                'capacity': row[3]
            } for row in cursor.fetchall()
        ]
    return JsonResponse({'venues': venues})

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

@login_required
# TODO - Implement event registration
def register_event(request, event_id):
    if request.method == 'GET':
        # Check if user has registered for an event
        user = request.user
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    ec.eventCustomerID,
                    ec.customer_id,
                    ec.event_id,
                    ec.ticket_id,
                    t.ticketType_id,
                    tt.typeName,
                    tt.price
                FROM eventcustomer ec
                JOIN ticket t ON ec.ticket_id = t.ticketID
                JOIN tickettype tt ON t.ticketType_id = tt.ticketTypeID
                WHERE ec.event_id = %s AND ec.customer_id = %s
            """, [event_id, user.id])
            row = cursor.fetchone()
            if row:
                columns = [col[0] for col in cursor.description]
                registration_info = dict(zip(columns, row))
                return JsonResponse({
                    'registered': True,
                    'registration_info': registration_info
                })
            else:
                return JsonResponse({'registered': False})
