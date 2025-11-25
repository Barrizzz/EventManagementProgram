from django.shortcuts import render

# Create your views here. 
def events_page(request):
    return render(request, 'events.html')