from django.db import models
from django.utils import timezone
        
class EventCategory(models.Model):
    """
    Model representing the category of an event.
    Maps to the EventCategory entity.
    """
    categoryID = models.AutoField(primary_key=True)
    category = models.CharField(max_length=25)

    class Meta:
        verbose_name_plural = "Event Categories"
        ordering = ['category']
        db_table = 'eventCategory'

    def __str__(self):
        return self.category

class EventDateTime(models.Model):
    """
    Model representing the specific date and time an event is scheduled.
    Maps to the EventDateTime entity.
    """
    eventDateTimeID = models.AutoField(primary_key=True)
    date = models.DateField()
    startTime = models.TimeField()
    endTime = models.TimeField()

    class Meta:
        verbose_name_plural = "Event Date Times"
        ordering = ['date', 'startTime']
        # Ensures no duplicate entries for the exact same date/time slot
        unique_together = ('date', 'startTime', 'endTime')
        db_table = 'eventDateTime'

    def __str__(self):
        return f"{self.date} {self.startTime.strftime('%H:%M')} - {self.endTime.strftime('%H:%M')}"
        
class Venue(models.Model):
    """
    Model representing the location where an event takes place.
    Maps to the Venue entity.
    """
    venueID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=50)
    capacity = models.IntegerField()

    def __str__(self):
        return f"{self.name} ({self.city})"
    
    class Meta:
        db_table = 'venue'
        
class Organizer(models.Model):
    """
    Model representing the organizer or host of the event.
    Maps to the Organizer entity.
    """
    organizerID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=255)
    contactNum = models.CharField(max_length=20, unique=True)
    website = models.URLField(max_length=100, blank=True, null=True)
    
    class Meta:
        db_table = 'organizer'

    def __str__(self):
        return self.name
    
class TicketType(models.Model):
    """
    Model defining the different types of tickets available for events.
    Maps to the TicketType entity.
    """
    ticketTypeID = models.AutoField(primary_key=True)
    type = models.CharField(max_length=50)
    zone = models.CharField(max_length=1)
    price = models.DecimalField(max_digits=10, decimal_places=2) # Using DecimalField for currency
    
    class Meta:
        db_table = 'ticketType'

    def __str__(self):
        return f"{self.type} (Zone {self.zone})" 
    
class Customer(models.Model):
    """
    Model representing an application user/customer.
    Maps to the Customer entity.
    (Note: In a production app, consider extending Django's AbstractUser for authentication.)
    """
    customerID = models.AutoField(primary_key=True)
    fName = models.CharField(max_length=100)
    lName = models.CharField(max_length=100)
    email = models.EmailField(max_length=255)
    hashedPassword = models.CharField(max_length=255) # Stores the hashed password
    phoneNum = models.CharField(max_length=20, unique=True)
    
    class Meta:
        db_table = 'customer'

    def __str__(self):
        return f"{self.fName} {self.lName}"

class Event(models.Model):
    """
    Model representing the main event details.
    Maps to the Event entity.
    """
    eventID = models.AutoField(primary_key=True)
    
    # Relationships (Foreign Keys based on ERD)
    category = models.ForeignKey(
        EventCategory, 
        on_delete=models.SET_NULL, # Event Category FK
        null=True, 
        blank=True,
        related_name='events',
        verbose_name='Event Category'
    )
    datetime = models.ForeignKey(
        EventDateTime, 
        on_delete=models.PROTECT, # Event Date/Time FK
        related_name='events',
        verbose_name='Scheduled Time',
    )
    venue = models.ForeignKey(
        Venue, 
        on_delete=models.PROTECT, # Venue FK
        related_name='events',
        verbose_name='Venue'
    )
    organizer = models.ForeignKey(
        Organizer, 
        on_delete=models.PROTECT, # Organizer FK
        related_name='organized_events',
        verbose_name='Organizer'
    )

    name = models.CharField(max_length=100, )
    description = models.TextField(blank=True)
    rundown = models.TextField(blank=True)
    materials = models.TextField(blank=True)

    # Many-to-Many relationship with Customer (via EventCustomer)
    customers = models.ManyToManyField(Customer, through='EventCustomer', related_name='attended_events')
    
    class Meta:
        db_table = 'event'
    
    def __str__(self):
        return self.name

class Ticket(models.Model):
    """
    Model representing an individual ticket instance.
    Maps to the Ticket entity.
    """
    STATUS_CHOICES = (
        ('reserved', 'Reserved'),
        ('sold', 'Sold'),
        ('cancelled', 'Cancelled'),
        ('checked_in', 'Checked In'),
    )

    ticketID = models.AutoField(primary_key=True)
    
    # Relationship to TicketType
    ticket_type = models.ForeignKey(
        TicketType, 
        on_delete=models.PROTECT, 
        related_name='tickets'
    )
    
    rowNum = models.IntegerField()
    seatNum = models.IntegerField()
    purchaseDateTime = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='reserved')
    
    # Adding FK to Event, as a Ticket must belong to an Event (Implied by the system logic)
    # The ERD doesn't show this directly, but it's essential for ticket validity.
    # The EventCustomer table only tracks who owns the ticket, not what event it's for.
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='tickets'
    )

    class Meta:
        # Ensures no two tickets have the same seat in the same row for the same event
        unique_together = ('event', 'rowNum', 'seatNum')
        db_table = 'ticket'

    def __str__(self):
        return f"Ticket {self.ticketID} for {self.event.name}"

class EventCustomer(models.Model):
    """
    Junction table for the Many-to-Many relationship between Event and Customer, 
    AND links the specific Ticket instance involved.
    Maps to the EventCustomer entity.
    """
    # Composite PK: (eventID, customerID, ticketID) enforced by unique_together below
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    ticket = models.OneToOneField(
        Ticket, 
        on_delete=models.CASCADE, 
        unique=True, # Ensures a ticket is only associated with one purchase record
        related_name='purchase_record'
    )

    class Meta:
        # Enforces the composite primary key constraint from the ERD
        unique_together = ('event', 'customer', 'ticket')
        verbose_name_plural = "Event Customers"
        db_table = 'eventCustomer'

    def __str__(self):
        return f"Customer {self.customer.customerID} has Ticket {self.ticket.ticketID} for Event {self.event.eventID}"
    