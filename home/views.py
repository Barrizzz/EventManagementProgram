from django.shortcuts import render, redirect
from django.contrib import messages
from events.models import Event
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout

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
    all_events = Event.objects.select_related('category', 'datetime', 'venue', 'organizer').all()
    for event in all_events:
        status = event.status
        if status == 'upcoming':
            context['upcoming_events'].append(event)
        elif status == 'ongoing':
            context['ongoing_events'].append(event)
        elif status == 'finished':
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
