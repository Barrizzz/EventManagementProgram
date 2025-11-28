from django.urls import path
from . import views

app_name = "events"

urlpatterns = [
    path("add_person/", views.add_person, name="add_person"),
    path("home/", views.events_page, name="home_page"),
]