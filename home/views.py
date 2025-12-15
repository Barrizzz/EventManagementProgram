from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from datetime import datetime
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.db import connection

# Create your views here.
@login_required
def index(request):
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
    
    return render(request, 'index.html', context)

@login_required
def settings(request):
    return render(request, 'settings.html', {'user': request.user})

@login_required
def update_profile(request):
    if request.method == 'POST':
        user = request.user
        
        # Update user fields
        user.fName = request.POST.get('first_name', '').strip()
        user.lName = request.POST.get('last_name', '').strip()
        user.phoneNum = request.POST.get('phone_num', '').strip()
        
        try:
            user.save()
            messages.success(request, 'Profile updated successfully!')
        except Exception as e:
            messages.error(request, f'Error updating profile: {str(e)}')
    
    return redirect('home:settings')

@login_required
def delete_account(request):
    if request.method == 'POST':
        user = request.user
        try:
            user.delete()
            logout(request)
            return redirect('customers:login')
        except Exception as e:
            messages.error(request, f'Error deleting account: {str(e)}')
            return redirect('home:settings')
    
    return redirect('home:settings')
