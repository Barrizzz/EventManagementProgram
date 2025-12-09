# Assuming this is in your 'app_name/views.py'

from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from .forms import CustomerRegistrationForm, CustomerLoginForm

# --- 1. Registration View ---
def register_view(request):
    if request.method == 'POST':
        form = CustomerRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Automatically log the new user in
            login(request, user) 
            return redirect('home:home_page')  # Redirect to a protected page (e.g., 'dashboard')
    else:
        form = CustomerRegistrationForm()
    
    return render(request, 'register.html', {'form': form})

# --- 2. Login View ---
def login_view(request):
    if request.method == 'POST':
        form = CustomerLoginForm(request, data=request.POST)
        if form.is_valid():
            # authenticate() is called internally by the form for custom models
            user = form.get_user()
            login(request, user)
            return redirect('home:home_page')  # Redirect to a protected page
    else:
        form = CustomerLoginForm()
    
    return render(request, 'login.html', {'form': form})

# --- 3. Logout View ---
def logout_view(request):
    logout(request)
    return redirect('customers:login') # Redirect to the homepage after logout