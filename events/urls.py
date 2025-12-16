from django.urls import path
from . import views

app_name = "events"
urlpatterns = [
    path("", views.events_page, name="events"),
    path("create/", views.create_event, name="create_event"),
    path("get/<int:event_id>/", views.get_event, name="get_event"),
    path("update/<int:event_id>/", views.update_event, name="update_event"),
    path("delete/<int:event_id>/", views.delete_event, name="delete_event"),
    # API endpoints for autocomplete
    path("api/categories/", views.get_categories, name="get_categories"),
    path("api/organizers/", views.get_organizers, name="get_organizers"),
    path("api/venues/", views.get_venues, name="get_venues"),
    
    # Attendees endpoints
    path("attendees/", views.attendees_page, name="attendees"),
    # Reports endpoints
    path("reports/", views.reports_page, name="reports"),
    # Ticketing endpoints
    path("<int:event_id>/register/", views.register_event, name="tickets"),
    path("api/tickettypes/", views.create_ticket_type, name="create_ticket_type"),
]
