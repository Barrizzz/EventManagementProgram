from django.urls import path
from . import views

app_name = "events"
urlpatterns = [
    path("", views.events_page, name="events"),
    path("get/<int:event_id>/", views.get_event, name="get_event"),
    path("update/<int:event_id>/", views.update_event, name="update_event"),
    path("delete/<int:event_id>/", views.delete_event, name="delete_event"),
]