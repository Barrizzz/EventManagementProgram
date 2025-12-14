// Events page specific JavaScript
function initializeEventsPage() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const cardsView = document.getElementById('cardsView');
    const tableView = document.getElementById('tableView');

    if (viewButtons.length > 0 && cardsView && tableView) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                viewButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                if (view === 'cards') {
                    cardsView.style.display = 'block';
                    tableView.style.display = 'none';
                } else {
                    cardsView.style.display = 'none';
                    tableView.style.display = 'block';
                }

                showNotification(`Switched to ${view} view`, 'success');
            });
        });
    }

    const eventsSearchInput = document.querySelector('.filters-section .search-input');
    if (eventsSearchInput) {
        eventsSearchInput.addEventListener('input', function() {
            filterEvents(this.value.toLowerCase());
        });
    }

    const createEventBtn = document.querySelector('.btn-create-event');
    if (createEventBtn) {
        createEventBtn.addEventListener('click', function() {
            showEventModal();
        });
    }

    initializeEventCardActions();
}

function filterEvents(searchTerm) {
    const cards = document.querySelectorAll('.events-cards-view .event-card');
    const rows = document.querySelectorAll('.events-table tbody tr');

    cards.forEach(card => {
        const match = card.textContent.toLowerCase().includes(searchTerm);
        card.style.display = match ? 'flex' : 'none';
    });

    rows.forEach(row => {
        const match = row.textContent.toLowerCase().includes(searchTerm);
        row.style.display = match ? 'table-row' : 'none';
    });

    updateEventCounts();
}

function filterEventsByStatus(status) {
    const sections = document.querySelectorAll('.events-section');

    sections.forEach(section => {
        if (status === 'all') {
            section.style.display = 'block';
        } else {
            section.style.display = section.classList.contains(`${status}-events`) ? 'block' : 'none';
        }
    });

    const rows = document.querySelectorAll('.events-table tbody tr');
    rows.forEach(row => {
        row.style.display =
            status === 'all' || row.classList.contains(status)
            ? 'table-row'
            : 'none';
    });

    showNotification(`Showing ${status === 'all' ? 'all' : status} events`, 'info');
}

function updateEventCounts() {
    const sections = document.querySelectorAll('.events-section');
    sections.forEach(section => {
        const visibleCards = [...section.querySelectorAll('.event-card')]
            .filter(card => card.style.display !== 'none');
        const countElement = section.querySelector('.event-count');
        if (countElement) {
            const count = visibleCards.length;
            countElement.textContent = `${count} event${count !== 1 ? 's' : ''}`;
        }
    });
}

function initializeEventCardActions() {
    console.log('Initializing event card actions');

    // Handle view details buttons
    const viewDetails = document.querySelectorAll('.btn-action.primary');
    viewDetails.forEach(btn => {
        btn.addEventListener('click', function() {
            const title = this.closest('.event-card').querySelector('.event-title').textContent;
            showNotification(`Opening details for "${title}"`, 'info');
        });
    });

    // Handle edit buttons
    const editButtons = document.querySelectorAll('.edit-event-btn');
    console.log('Found edit buttons:', editButtons.length);
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Edit button clicked');
            const eventId = this.getAttribute('data-event-id');
            console.log('Event ID:', eventId);
            if (eventId) {
                // Fetch event data and show modal
                fetch(`/events/get/${eventId}/`, {
                    method: 'GET',
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                    },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showEventModal(data.event);
                    } else {
                        showNotification('Error loading event data: ' + data.error, 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showNotification('Error loading event data. Please try again.', 'error');
                });
            } else {
                showNotification('Error: Could not find event ID', 'error');
            }
        });
    });

    // Handle report buttons
    const reportButtons = document.querySelectorAll('.btn-action.secondary');
    reportButtons.forEach(button => {
        if (button.textContent.trim().includes('Report')) {
            button.addEventListener('click', function() {
                const title = this.closest('.event-card').querySelector('.event-title').textContent;
                showNotification(`Opening report for "${title}"`, 'info');
            });
        }
    });

    // Handle delete buttons
    const deleteButtons = document.querySelectorAll('.delete-event-btn');
    console.log('Found delete buttons:', deleteButtons.length);
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const eventId = this.getAttribute('data-event-id');
            const eventCard = this.closest('.event-card');
            const eventTitle = eventCard.querySelector('.event-title').textContent;
            if (eventId) {
                if (confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone!`)) {
                    deleteEvent(eventId, null);
                }
            } else {
                showNotification('Error: Could not find event ID', 'error');
            }
        });
    });
}

// Show create event form modal
function showCreateEventForm() {
    showEventModal();
}

// Show edit event form modal
function showEditEventForm(eventId) {
    console.log('showEditEventForm called with eventId:', eventId);
    // First fetch the event data
    fetch(`/events/get/${eventId}/`, {
        method: 'GET',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showEventModal(data.event);
        } else {
            showNotification('Error loading event data: ' + data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error loading event data. Please try again.', 'error');
    });
}

// Unified modal function for create and edit
function showEventModal(eventData = null) {
    const isEditMode = eventData !== null;
    const modalTitle = isEditMode ? 'Edit Event' : 'Create New Event';
    const submitButtonText = isEditMode ? 'Update Event' : 'Create Event';
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content event-modal">
            <div class="modal-header">
                <h2>${modalTitle}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <form class="event-form" id="eventForm" ${isEditMode ? `data-event-id="${eventData.id}"` : ''}>
                <!-- Basic Event Information -->
                <div class="form-section">
                    <h3 class="form-section-title">Basic Information</h3>
                    
                    <div class="form-group">
                        <label for="eventName">Event Name *</label>
                        <input type="text" id="eventName" name="name" 
                            value="${isEditMode ? eventData.name : ''}" 
                            placeholder="Enter event name" required>
                    </div>

                    <div class="form-group">
                        <label for="eventDescription">Description *</label>
                        <input type="text" id="eventDescription" name="description" 
                            placeholder="Describe the event" required value="${isEditMode ? eventData.description : ''}">
                    </div>

                    <div class="form-group">
                        <label for="eventRundown">Event Rundown *</label>
                        <input type="text" id="eventRundown" name="rundown" 
                            placeholder="Event schedule and activities (please enter a document link)" required value="${isEditMode ? eventData.rundown : ''}">
                    </div>

                    <div class="form-group">
                        <label for="eventMaterials">Materials Needed</label>
                        <input type="text" id="eventMaterials" name="materials" 
                            placeholder="The materials required for the event (please enter a folder link)" value="${isEditMode ? eventData.materials : ''}">
                    </div>
                </div>

                <!-- Event Category -->
                <div class="form-section">
                    <h3 class="form-section-title">Category & Type</h3>
                    
                    <div class="form-group">
                        <label for="eventCategory">Event Category *</label>
                        <input type="text" id="eventCategory" name="category" 
                            placeholder="Enter category name (e.g., Conference, Workshop)" 
                            list="categoryList" required>
                        <datalist id="categoryList">
                            <!-- Options will be populated from existing categories -->
                        </datalist>
                        <small class="form-help">Type to enter new category or select from existing ones</small>
                    </div>
                </div>

                <!-- Date & Time -->
                <div class="form-section">
                    <h3 class="form-section-title">Date & Time</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="eventDate">Date *</label>
                            <input type="date" id="eventDate" name="date" required>
                        </div>
                        <div class="form-group">
                            <label for="eventTime">Time *</label>
                            <input type="time" id="eventTime" name="time" required>
                        </div>
                    </div>
                </div>

                <!-- Organizer -->
                <div class="form-section">
                    <h3 class="form-section-title">Organizer</h3>
                    
                    <div class="form-group">
                        <label for="eventOrganizer">Event Organizer Name *</label>
                        <input type="text" id="eventOrganizer" name="organizer" 
                            placeholder="Enter organizer name" 
                            list="organizerList" required>
                        <datalist id="organizerList">
                            <!-- Options will be populated from existing organizers -->
                        </datalist>
                        <small class="form-help">Type to enter new organizer or select from existing ones</small>
                    </div>
                </div>

                <!-- Venue -->
                <div class="form-section">
                    <h3 class="form-section-title">Venue</h3>
                    
                    <div class="form-group">
                        <label for="eventVenue">Venue Name *</label>
                        <input type="text" id="eventVenue" name="venue" 
                            placeholder="Enter venue name" 
                            list="venueList" required>
                        <datalist id="venueList">
                            <!-- Options will be populated from existing venues -->
                        </datalist>
                        <small class="form-help">Type to enter new venue or select from existing ones</small>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancelBtn">Cancel</button>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-${isEditMode ? 'save' : 'plus'}"></i> ${submitButtonText}
                    </button>
                </div>
            </form>
        </div>
    `;

    // Add modal styles (only once)
    if (!document.getElementById('event-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'event-modal-styles';
        style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }

        .modal-content {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h2 {
            margin: 0;
            color: #1e293b;
            font-size: 24px;
            font-weight: 600;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            color: #64748b;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;
        }

        .modal-close:hover {
            background: #f1f5f9;
            color: #334155;
        }

        .create-event-form {
            padding: 24px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .form-group label {
            display: block;
            margin-bottom: 6px;
            color: #374151;
            font-weight: 500;
            font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #8b5cf6;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .form-group textarea {
            resize: vertical;
            min-height: 100px;
        }

        .form-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            align-items: center;
            margin-top: 24px;
            padding-top: 0;
        }

        .btn-primary, .btn-secondary, .btn-danger {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            font-size: 14px;
        }

        .btn-primary {
            background: #8b5cf6;
            color: white;
        }

        .btn-primary:hover {
            background: #7c3aed;
        }

        .btn-secondary {
            background: #f1f5f9;
            color: #475569;
        }

        .btn-secondary:hover {
            background: #e2e8f0;
        }

        .btn-danger {
            background: #dc3545;
            color: white;
        }

        .btn-danger:hover {
            background: #c82333;
        }

        .right-actions {
            display: flex;
            gap: 12px;
        }

        .event-form {
            padding: 24px;
        }

        .form-section {
            margin-bottom: 24px;
            padding-bottom: 24px;
            border-bottom: 1px solid #e2e8f0;
        }

        .form-section:last-of-type {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .form-section-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .form-help {
            display: block;
            margin-top: 6px;
            font-size: 12px;
            color: #64748b;
        }

        .form-help a {
            color: #8b5cf6;
            text-decoration: none;
        }

        .form-help a:hover {
            text-decoration: underline;
        }
    `;
        document.head.appendChild(style);
    }

    // Add modal to page
    document.body.appendChild(modal);

    // Populate dropdowns with data
    populateEventFormDropdowns(modal, eventData);

    // Event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('#cancelBtn');
    const deleteBtn = isEditMode ? modal.querySelector('#deleteBtn') : null;
    const form = modal.querySelector('#eventForm');

    // Close modal functions
    const closeModal = () => {
        modal.remove();
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Delete button (only in edit mode)
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm(`Are you sure you want to delete "${eventData.title}"? This action cannot be undone.`)) {
                deleteEvent(eventData.id, closeModal);
            }
        });
    }

    // TODO: REQUIRES BACKEND WORK
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect and structure the form data
        const submitData = collectEventFormData(form);
        
        const url = isEditMode ? `/events/update/${eventData.id}/` : '/events/create/';
        const successMessage = isEditMode ? 'Event updated successfully!' : 'Event created successfully!';

        console.log('Submitting event data:', submitData);
        console.log('To URL:', url);

        // Submit to backend
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify(submitData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(successMessage, 'success');
                closeModal();
                setTimeout(() => window.location.reload(), 1000);
            } else {
                showNotification(`Error: ${data.error}`, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again.', 'error');
        });
    });
}

function deleteEvent(eventId, closeModalCallback) {
    fetch(`/events/delete/${eventId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken(),
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(data.message, 'success');
            if (closeModalCallback) closeModalCallback();
            // Reload page to update the view
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showNotification('Error deleting event: ' + data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error deleting event. Please try again.', 'error');
    });
}

// Populate datalists with existing data for autocomplete
function populateEventFormDropdowns(modal, eventData = null) {
    const categoryList = modal.querySelector('#categoryList');
    const organizerList = modal.querySelector('#organizerList');
    const venueList = modal.querySelector('#venueList');
    
    const categoryInput = modal.querySelector('#eventCategory');
    const organizerInput = modal.querySelector('#eventOrganizer');
    const venueInput = modal.querySelector('#eventVenue');
    const dateInput = modal.querySelector('#eventDate');
    const timeInput = modal.querySelector('#eventTime');

    // If editing, populate form fields
    if (eventData) {
        categoryInput.value = eventData.category || '';
        organizerInput.value = eventData.organizer || '';
        venueInput.value = eventData.venue || '';
        dateInput.value = eventData.date || '';
        timeInput.value = eventData.time || '';
    }

    // TODO: BACKEND WORK NEEDED
    // Fetch categories for autocomplete suggestions
    fetch('/api/categories/', {
        headers: {
            'X-CSRFToken': getCSRFToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        const categories = data.categories || data || [];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            categoryList.appendChild(option);
        });
    })
    .catch(error => {
        console.log('Categories not loaded (empty or error):', error);
    });

    // Fetch organizers for autocomplete suggestions
    fetch('/api/organizers/', {
        headers: {
            'X-CSRFToken': getCSRFToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        const organizers = data.organizers || data || [];
        organizers.forEach(organizer => {
            const option = document.createElement('option');
            option.value = organizer.name;
            organizerList.appendChild(option);
        });
    })
    .catch(error => {
        console.log('Organizers not loaded (empty or error):', error);
    });

    // Fetch venues for autocomplete suggestions
    fetch('/api/venues/', {
        headers: {
            'X-CSRFToken': getCSRFToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        const venues = data.venues || data || [];
        venues.forEach(venue => {
            const option = document.createElement('option');
            option.value = venue.name;
            venueList.appendChild(option);
        });
    })
    .catch(error => {
        console.log('Venues not loaded (empty or error):', error);
    });
}

// Helper function to collect form data
function collectEventFormData(form) {
    const formData = new FormData(form);
    
    // Convert to object with proper structure
    const eventData = {
        // Main event fields
        name: formData.get('name'),
        description: formData.get('description'),
        rundown: formData.get('rundown'),
        materials: formData.get('materials') || null,
        
        // Related data (backend will handle creating/linking these)
        category: formData.get('category'),
        organizer: formData.get('organizer'),
        venue: formData.get('venue'),
        
        // Date and time fields
        date: formData.get('date'),
        time: formData.get('time')
    };
    
    console.log('Collected event data:', eventData);
    return eventData;
}

