from .models import Venue, Organizer, EventDateTime, EventCategory
from django.core.exceptions import PermissionDenied


def create_venue(name, address, capacity, city):
    """Helper function to create a Venue instance"""
    venue = Venue.objects.create(
        name=name, address=address, capacity=capacity, city=city
    )
    return venue


def create_organizer(name, email, contactNum, website=None):
    """Helper function to create an Organizer instance"""
    organizer = Organizer.objects.create(
        name=name, email=email, contactNum=contactNum, website=website
    )
    return organizer


def create_event_datetime(date, start_time, end_time):
    """Helper function to create an EventDateTime instance"""
    # Check if an EventDateTime with the same date, start_time, and end_time already exists
    existing_event_datetime = EventDateTime.objects.filter(
        date=date, startTime=start_time, endTime=end_time
    ).first()

    if existing_event_datetime:
        return existing_event_datetime

    event_datetime = EventDateTime.objects.create(
        date=date, startTime=start_time, endTime=end_time
    )
    return event_datetime


def create_event_category(category_name):
    """Helper function to create an EventCategory instance"""
    # Check if an existing event category already exists
    existing_category = EventCategory.objects.filter(category=category_name).first()
    if existing_category:
        return existing_category

    event_category = EventCategory.objects.create(category=category_name)

    return event_category


def is_staff_check(user):
    if user.is_staff and user.is_authenticated:
        return True
    raise PermissionDenied
