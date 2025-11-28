from django.contrib import admin
from .models import Event

# Register your models here.
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location', 'status', 'max_attendees')
    list_filter = ('status', 'date')
    search_fields = ('title', 'location', 'description')
    ordering = ('-date',)
