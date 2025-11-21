from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from .models import Person

# Create your views here.
@csrf_exempt
def add_person(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        
        person = Person(first_name=first_name, last_name=last_name, email=email)
        person.save()
        
        return HttpResponse("Person added successfully!")
    elif request.method == 'GET':
        persons = Person.objects.values()
        return render(request, 'index.html', {'persons': persons})