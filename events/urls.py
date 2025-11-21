from django.urls import path
from . import views

urlpatterns = [
    path("add_person/", views.add_person, name="add_person"),
    path("events/", views.events_page, name="events_page"),
    path("", views.index, name="index"),
]