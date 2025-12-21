// Load modal styles once
function loadModalStyles() {
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
            font-size: 28px;
            color: #94a3b8;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.2s;
        }

        .modal-close:hover {
            background: #f1f5f9;
            color: #475569;
        }

        .event-form {
            padding: 24px;
        }

        .form-section {
            margin-bottom: 24px;
        }

        .form-section-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid #8b5cf6;
        }

        .form-help {
            display: block;
            margin-top: 4px;
            font-size: 12px;
            color: #64748b;
        }

        .event-form .form-section:last-of-type {
            margin-bottom: 0;
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

        .form-group input:disabled,
        .form-group input[readonly] {
            background-color: #f1f5f9;
            color: #64748b;
            cursor: not-allowed;
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
            display: inline-flex;
            align-items: center;
            gap: 8px;
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

        .ticket-type-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
        }

        .ticket-type-header {
            margin-bottom: 12px;
        }

        .ticket-type-header h4 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: #475569;
        }

        .ticket-type-fields {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 12px;
        }

        .auto-fill-badge {
            background: linear-gradient(135deg, #8b5cf6, #a78bfa);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 8px;
        }
        `;
        document.head.appendChild(style);
    }
}

// Events page specific JavaScript
function initializeEventsPage() {
    loadModalStyles(); // Load styles on page init
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
            const eventCard = this.closest('.event-card');
            showEventDetails(eventCard);
        });
    });

    // Handle edit events
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

    // Handle view tickets buttons
    const viewTicketsButtons = document.querySelectorAll('.view-tickets-btn');
    console.log('Found view tickets buttons:', viewTicketsButtons.length);
    viewTicketsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const eventId = this.getAttribute('data-event-id');
            console.log('View tickets button clicked for event ID:', eventId);
            if (eventId) {
                showViewTicketTypesModal(eventId);
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

// Show modal for editing ticket types only
function showViewTicketTypesModal(eventId) {
    // Fetch event data first
    fetch(`/events/get/${eventId}/`, {
        method: 'GET',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const eventData = data.event;
            
            // Create modal overlay
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content event-modal">
                    <div class="modal-header">
                        <h2>View Ticket Types & Pricing - ${eventData.name}</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="event-form" id="ticketTypesForm" data-event-id="${eventId}">
                        <!-- Venue Capacity (readonly for reference) -->
                        <div class="form-section">
                            <h3 class="form-section-title">Venue Information</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Venue</label>
                                    <input type="text" value="${eventData.venue}" readonly>
                                </div>
                                <div class="form-group">
                                    <label>Total Capacity</label>
                                    <input type="number" id="venueCapacity" value="${eventData.venueCapacity}" readonly>
                                </div>
                            </div>
                        </div>

                        <!-- Ticket Types -->
                        <div class="form-section">
                            <h3 class="form-section-title">Ticket Types & Pricing</h3>
                            
                            <div class="form-group">
                                <label for="numTicketTypes">Number of Ticket Types</label>
                                <input type="number" id="numTicketTypes" name="numTicketTypes" 
                                    min="1" max="10" value="1" readonly disabled>
                            </div>
                            
                            <div id="ticketTypesContainer">
                                <!-- Ticket type fields will be dynamically added here -->
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn-secondary" id="closeBtn">Close</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Initialize ticket types functionality in view mode
            initializeTicketTypesViewMode(modal);

            // Event listeners
            const closeBtn = modal.querySelector('.modal-close');
            const closeActionBtn = modal.querySelector('#closeBtn');

            const closeModal = () => modal.remove();

            closeBtn.addEventListener('click', closeModal);
            closeActionBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
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
                            <label for="eventDate">Event Date *</label>
                            <input type="date" id="eventDate" name="date" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="eventStartTime">Start Time *</label>
                            <input type="time" id="eventStartTime" name="startTime" required>
                        </div>
                        <div class="form-group">
                            <label for="eventEndTime">End Time *</label>
                            <input type="time" id="eventEndTime" name="endTime" required>
                        </div>
                    </div>
                </div>

                <!-- Organizer -->
                <div class="form-section">
                    <h3 class="form-section-title">Organizer Information</h3>
                    
                    <div class="form-group">
                        <label for="eventOrganizer">Organizer Name *</label>
                        <input type="text" id="eventOrganizer" name="organizerName" 
                            placeholder="Enter organizer name" 
                            list="organizerList" required>
                        <datalist id="organizerList">
                            <!-- Options will be populated from existing organizers -->
                        </datalist>
                        <small class="form-help">Type to select existing or enter new organizer</small>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="organizerEmail">Organizer Email *</label>
                            <input type="email" id="organizerEmail" name="organizerEmail" 
                                placeholder="organizer@example.com" 
                                value="${isEditMode ? eventData.organizerEmail || '' : ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="organizerContact">Contact Number *</label>
                            <input type="tel" id="organizerContact" name="organizerContact" 
                                placeholder="+1-555-0100" 
                                value="${isEditMode ? eventData.organizerContact || '' : ''}" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="organizerWebsite">Website (Optional)</label>
                        <input type="url" id="organizerWebsite" name="organizerWebsite" 
                            placeholder="www.organizer.com" 
                            value="${isEditMode ? eventData.organizerWebsite || '' : ''}">
                    </div>
                </div>

                <!-- Venue -->
                <div class="form-section">
                    <h3 class="form-section-title">Venue Information</h3>
                    
                    <div class="form-group">
                        <label for="eventVenue">Venue Name *</label>
                        <input type="text" id="eventVenue" name="venueName" 
                            placeholder="Enter venue name" 
                            list="venueList" required
                            ${isEditMode ? 'disabled' : ''}>
                        <datalist id="venueList">
                            <!-- Options will be populated from existing venues -->
                        </datalist>
                        <small class="form-help">Type to select existing or enter new venue</small>
                    </div>

                    <div class="form-group">
                        <label for="venueAddress">Venue Address *</label>
                        <input type="text" id="venueAddress" name="venueAddress" 
                            placeholder="123 Main St, Suite 100" 
                            value="${isEditMode ? eventData.venueAddress || '' : ''}" required
                            ${isEditMode ? 'disabled' : ''}>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="venueCity">City *</label>
                            <input type="text" id="venueCity" name="venueCity" 
                                placeholder="City name" 
                                value="${isEditMode ? eventData.venueCity || '' : ''}" required
                                ${isEditMode ? 'disabled' : ''}>
                        </div>
                        <div class="form-group">
                            <label for="venueCapacity">Capacity *</label>
                            <input type="number" id="venueCapacity" name="venueCapacity" 
                                placeholder="100" min="1" 
                                value="${isEditMode ? eventData.venueCapacity || '' : ''}" required
                                ${isEditMode ? 'disabled' : ''}>
                        </div>
                    </div>
                </div>

                ${!isEditMode ? `
                <!-- Ticket Types -->
                <div class="form-section" id="ticketTypesSection">
                    <h3 class="form-section-title">Ticket Types & Pricing (maximum 10)</h3>
                    
                    <div class="form-group">
                        <label for="numTicketTypes">Number of Ticket Types *</label>
                        <input type="number" id="numTicketTypes" name="numTicketTypes" 
                            placeholder="Enter number of ticket types (e.g., 2, 3)" 
                            min="1" max="10" value="1" required>
                        <small class="form-help">Specify how many different ticket types you want to offer</small>
                    </div>
                    
                    <div id="ticketTypesContainer">
                        <!-- Ticket type fields will be dynamically added here -->
                    </div>
                </div>
                ` : ''}

                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancelBtn">Cancel</button>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-${isEditMode ? 'save' : 'plus'}"></i> ${submitButtonText}
                    </button>
                </div>
            </form>
        </div>
    `;

    // Add modal to page
    document.body.appendChild(modal);

    // Populate dropdowns with data
    populateEventFormDropdowns(modal, eventData);

    // Initialize the ticket types section (only in create mode)
    if (!isEditMode) {
        initializeTicketTypes(modal);
    }

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

        // Validate ticket allocations before submission (only in create mode)
        if (!isEditMode && !validateTicketAllocations(form)) {
            return;
        }

        // Collect and structure the form data
        const submitData = isEditMode ? collectEditEventFormData(form) : collectEventFormData(form);
        
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
    
    const startTimeInput = modal.querySelector('#eventStartTime');
    const endTimeInput = modal.querySelector('#eventEndTime');

    // If editing, populate form fields
    if (eventData) {
        categoryInput.value = eventData.category || '';
        organizerInput.value = eventData.organizer || '';
        venueInput.value = eventData.venue || '';
        dateInput.value = eventData.date || '';
        
        startTimeInput.value = eventData.startTime || '';
        endTimeInput.value = eventData.endTime || '';
        
        // Populate organizer additional fields if available
        if (eventData.organizerEmail) {
            modal.querySelector('#organizerEmail').value = eventData.organizerEmail;
        }
        if (eventData.organizerContact) {
            modal.querySelector('#organizerContact').value = eventData.organizerContact;
        }
        if (eventData.organizerWebsite) {
            modal.querySelector('#organizerWebsite').value = eventData.organizerWebsite;
        }
        
        // Populate venue additional fields if available
        if (eventData.venueAddress) {
            modal.querySelector('#venueAddress').value = eventData.venueAddress;
        }
        if (eventData.venueCity) {
            modal.querySelector('#venueCity').value = eventData.venueCity;
        }
        if (eventData.venueCapacity) {
            modal.querySelector('#venueCapacity').value = eventData.venueCapacity;
        }
    }

    // TODO: BACKEND WORK NEEDED
    // Fetch categories for autocomplete suggestions
    fetch('/events/api/categories/', {
        headers: {
            'X-CSRFToken': getCSRFToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        const categories = data.categories || data || [];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            categoryList.appendChild(option);
        });
    })
    .catch(error => {
        console.log('Categories not loaded (empty or error):', error);
    });

    // Fetch organizers for autocomplete suggestions
    fetch('/events/api/organizers/', {
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

        // Auto-fill organizer details when filling an existing organizer
        // Listen for input changes in the organizer input field
        organizerInput.addEventListener('input', function() {
            const selectedName = this.value;
            const organizer = organizers.find(o => o.name === selectedName);
            if (organizer) {
                // Fill in the details of the selected organizer
                modal.querySelector('#organizerEmail').value = organizer.email || '';
                modal.querySelector('#organizerContact').value = organizer.contactNum || '';
                modal.querySelector('#organizerWebsite').value = organizer.website || '';
            }
        });
    })
    .catch(error => {
        console.log('Organizers not loaded (empty or error):', error);
    });

    // Fetch venues for autocomplete suggestions
    fetch('/events/api/venues/', {
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

        // Auto-fill venue details when filling an existing venue
        venueInput.addEventListener('input', function() {
            const selectedName = this.value;
            const venue = venues.find(v => v.name === selectedName);
            if (venue) {
                // Fill in the details of the selected venue
                modal.querySelector('#venueAddress').value = venue.address || '';
                modal.querySelector('#venueCity').value = venue.city || '';
                modal.querySelector('#venueCapacity').value = venue.capacity || '';
                
                // Trigger auto-fill for ticket types
                const venueCapacityInput = modal.querySelector('#venueCapacity');
                const ticketTypesContainer = modal.querySelector('#ticketTypesContainer');
                const numTicketTypesInput = modal.querySelector('#numTicketTypes');
                const numTypes = parseInt(numTicketTypesInput.value) || 1;
                
                if (ticketTypesContainer && venueCapacityInput) {
                    if (numTypes === 1) {
                        autoFillSingleTicketType(ticketTypesContainer, venueCapacityInput);
                    } else {
                        autoFillLastTicketType(ticketTypesContainer, venueCapacityInput);
                    }
                }
            }
        });
    })
    .catch(error => {
        console.log('Venues not loaded (empty or error):', error);
    });
}

// Show details function, this will show the event details such as description, organizer, venue, date & time, etc.
function showEventDetails(eventCard) {
    // Extract event information from the card
    const eventTitle = eventCard.querySelector('.event-title').textContent;
    const eventDescription = eventCard.querySelector('.event-description').textContent;
    const eventDate = eventCard.querySelector('.event-date span').textContent;
    const eventAttendees = eventCard.querySelector('.event-attendees span').textContent;
    const eventStatus = eventCard.querySelector('.event-status-badge').textContent;
    const eventImage = eventCard.querySelector('.event-image img').src;

    // TODO: Further details, fetch from data attributes or backend as needed
    const category = eventCard.getAttribute('data-category') || 'N/A';
    const rundown = eventCard.getAttribute('data-rundown') || 'Not provided';
    const materials = eventCard.getAttribute('data-materials') || 'Not provided';
    
    const organizer = eventCard.getAttribute('data-organizer') || 'N/A';
    const organizerEmail = eventCard.getAttribute('data-organizer-email') || 'N/A';
    const organizerContact = eventCard.getAttribute('data-organizer-contact') || 'N/A';
    const organizerWebsite = eventCard.getAttribute('data-organizer-website') || '';

    const venue = eventCard.getAttribute('data-venue') || 'N/A';
    const venueAddress = eventCard.getAttribute('data-venue-address') || 'N/A';
    const venueCity = eventCard.getAttribute('data-venue-city') || 'N/A';
    const venueCapacity = eventCard.getAttribute('data-venue-capacity') || 'N/A';

    
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content details-modal">
            <div class="modal-header">
                <h2>Event Details</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="event-details-container">
                    <img src="${eventImage}" alt="${eventTitle}" class="details-image">
                    
                    <div class="details-badge ${eventStatus.toLowerCase().replace(' ', '-')}">
                        ${eventStatus}
                    </div>
                    
                    <h3 class="details-title">${eventTitle}</h3>
                    
                    <div class="details-section">
                        <div class="details-item">
                            <i class="fas fa-tag"></i>
                            <strong>Category:</strong>
                            <span>${category}</span>
                        </div>
                        
                        <div class="details-item">
                            <i class="fas fa-calendar"></i>
                            <strong>Date & Time:</strong>
                            <span>${eventDate}</span>
                        </div>
                        
                        <div class="details-item">
                            <i class="fas fa-users"></i>
                            <strong>Capacity:</strong>
                            <span>${eventAttendees}</span>
                        </div>
                    </div>
                    
                    <div class="details-section">
                        <h4><i class="fas fa-info-circle"></i> Description</h4>
                        <p>${eventDescription}</p>
                    </div>
                    
                    <div class="details-section">
                        <h4><i class="fas fa-file-alt"></i> Event Rundown</h4>
                        <p>${rundown.startsWith('http') ? `<a href="${rundown}" target="_blank" class="details-link"><i class="fas fa-external-link-alt"></i> View Rundown Document</a>` : rundown}</p>
                    </div>
                    
                    <div class="details-section">
                        <h4><i class="fas fa-box"></i> Materials Needed</h4>
                        <p>${materials.startsWith('http') ? `<a href="${materials}" target="_blank" class="details-link"><i class="fas fa-external-link-alt"></i> View Materials Folder</a>` : materials}</p>
                    </div>
                    
                    <div class="details-section">
                        <h4><i class="fas fa-building"></i> Venue Information</h4>
                        <div class="details-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <strong>Venue:</strong>
                            <span>${venue}</span>
                        </div>
                        <div class="details-item">
                            <i class="fas fa-home"></i>
                            <strong>Address:</strong>
                            <span>${venueAddress}, ${venueCity}</span>
                        </div>
                        <div class="details-item">
                            <i class="fas fa-door-open"></i>
                            <strong>Venue Capacity:</strong>
                            <span>${venueCapacity} people</span>
                        </div>
                    </div>
                    
                    <div class="details-section">
                        <h4><i class="fas fa-user-tie"></i> Organizer Information</h4>
                        <div class="details-item">
                            <i class="fas fa-user"></i>
                            <strong>Name:</strong>
                            <span>${organizer}</span>
                        </div>
                        <div class="details-item">
                            <i class="fas fa-envelope"></i>
                            <strong>Email:</strong>
                            <span><a href="mailto:${organizerEmail}" class="details-link">${organizerEmail}</a></span>
                        </div>
                        <div class="details-item">
                            <i class="fas fa-phone"></i>
                            <strong>Contact:</strong>
                            <span><a href="tel:${organizerContact}" class="details-link">${organizerContact}</a></span>
                        </div>
                        ${organizerWebsite ? `
                        <div class="details-item">
                            <i class="fas fa-globe"></i>
                            <strong>Website:</strong>
                            <span><a href="${organizerWebsite.startsWith('http') ? organizerWebsite : 'https://' + organizerWebsite}" target="_blank" class="details-link">${organizerWebsite}</a></span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary close-modal">Close</button>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Add event listeners for closing
    const closeBtn = modal.querySelector('.modal-close');
    const closeModalBtn = modal.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    closeModalBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Helper function to collect form data
// Validate ticket allocations
function validateTicketAllocations(form) {
    const venueCapacityInput = form.querySelector('#venueCapacity');
    const totalCapacity = parseInt(venueCapacityInput.value) || 0;
    
    if (totalCapacity === 0) {
        showNotification('Please enter a valid venue capacity', 'error');
        venueCapacityInput.focus();
        return false;
    }
    
    const ticketTypeItems = form.querySelectorAll('.ticket-type-item');
    let allocatedSeats = 0;
    const ticketTypes = [];
    
    // Check each ticket type
    for (let i = 0; i < ticketTypeItems.length; i++) {
        const typeInput = ticketTypeItems[i].querySelector(`input[name=\"ticketTypeName_${i}\"]`);
        const priceInput = ticketTypeItems[i].querySelector(`input[name=\"ticketTypePrice_${i}\"]`);
        const seatsInput = ticketTypeItems[i].querySelector(`input[name=\"ticketTypeSeats_${i}\"]`);
        
        const typeName = typeInput.value.trim();
        const price = parseFloat(priceInput.value);
        const seats = parseInt(seatsInput.value);
        
        // Validate fields are filled
        if (!typeName) {
            showNotification(`Please enter a name for Ticket Type ${i + 1}`, 'error');
            typeInput.focus();
            return false;
        }
        
        if (isNaN(price) || price < 0) {
            showNotification(`Please enter a valid price for Ticket Type ${i + 1}`, 'error');
            priceInput.focus();
            return false;
        }
        
        if (isNaN(seats) || seats < 0) {
            showNotification(`Please enter a valid number of seats for Ticket Type ${i + 1}`, 'error');
            seatsInput.focus();
            return false;
        }
        
        // Check for duplicate ticket type names
        if (ticketTypes.includes(typeName.toLowerCase())) {
            showNotification(`Duplicate ticket type name: "${typeName}". Please use unique names.`, 'error');
            typeInput.focus();
            return false;
        }
        
        ticketTypes.push(typeName.toLowerCase());
        allocatedSeats += seats;
    }
    
    // Check if total allocated seats matches venue capacity
    if (allocatedSeats > totalCapacity) {
        showNotification(`Total allocated seats (${allocatedSeats}) exceeds venue capacity (${totalCapacity})`, 'error');
        return false;
    }
    
    if (allocatedSeats < totalCapacity) {
        const confirmed = confirm(
            `You have allocated ${allocatedSeats} seats out of ${totalCapacity} total capacity. ` +
            `${totalCapacity - allocatedSeats} seats will remain unallocated. Continue?`
        );
        if (!confirmed) return false;
    }
    
    return true;
}

// Initialize ticket types functionality
function initializeTicketTypes(modal) {
    const numTicketTypesInput = modal.querySelector('#numTicketTypes');
    const ticketTypesContainer = modal.querySelector('#ticketTypesContainer');
    const venueCapacityInput = modal.querySelector('#venueCapacity');
    
    // Generate initial ticket type fields
    generateTicketTypeFields(1, ticketTypesContainer, venueCapacityInput);
    
    // Listen for changes in number of ticket types
    numTicketTypesInput.addEventListener('change', function() {
        const numTypes = parseInt(this.value) || 1;
        if (numTypes < 1) {
            this.value = 1;
            return;
        }
        // IMPORTANT: Limit to maximum 10 ticket types if too much are created nanti rusak
        if (numTypes > 10) {
            this.value = 10;
            showNotification('Maximum 10 ticket types allowed', 'warning');
            return;
        }
        generateTicketTypeFields(numTypes, ticketTypesContainer, venueCapacityInput);
    });
    
    // Listen for venue capacity changes to auto-fill
    venueCapacityInput.addEventListener('input', function() {
        const numTypes = parseInt(numTicketTypesInput.value) || 1;
        if (numTypes === 1) {
            autoFillSingleTicketType(ticketTypesContainer, venueCapacityInput);
        } else {
            autoFillLastTicketType(ticketTypesContainer, venueCapacityInput);
        }
    });
}

// Initialize ticket types in view-only mode (readonly)
function initializeTicketTypesViewMode(modal) {
    const numTicketTypesInput = modal.querySelector('#numTicketTypes');
    const ticketTypesContainer = modal.querySelector('#ticketTypesContainer');
    const venueCapacityInput = modal.querySelector('#venueCapacity');
    
    // Fetch ticket types from backend
    const eventId = modal.querySelector('#ticketTypesForm').getAttribute('data-event-id');
    
    fetch(`/events/api/fetchttypes/${eventId}/`, {
        method: 'GET',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.ticket_types && data.ticket_types.length > 0) {
            const ticketTypes = data.ticket_types;
            numTicketTypesInput.value = ticketTypes.length;
            
            // Generate readonly ticket type fields
            generateTicketTypeFieldsViewMode(ticketTypes, ticketTypesContainer);
        } else {
            ticketTypesContainer.innerHTML = '<p style="color: #666; padding: 1rem; text-align: center;">No ticket types configured for this event.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching ticket types:', error);
        ticketTypesContainer.innerHTML = '<p style="color: #e74c3c; padding: 1rem; text-align: center;">Error loading ticket types.</p>';
    });
}

// Generate readonly ticket type fields for viewing
function generateTicketTypeFieldsViewMode(ticketTypes, container) {
    container.innerHTML = '';
    
    ticketTypes.forEach((ticketType, i) => {
        const ticketTypeItem = document.createElement('div');
        ticketTypeItem.className = 'ticket-type-item';
        ticketTypeItem.innerHTML = `
            <div class="ticket-type-header">
                <h4>Ticket Type ${i + 1}</h4>
            </div>
            <div class="ticket-type-fields">
                <div class="form-group" style="margin-bottom: 0;">
                    <label>Type Name</label>
                    <input type="text" value="${ticketType.type || ticketType.ticket_type || ''}" readonly>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label>Price ($)</label>
                    <input type="number" value="${ticketType.price || '0.00'}" readonly>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label>Seats</label>
                    <input type="number" value="${ticketType.seats || '0'}" readonly>
                </div>
            </div>
        `;
        
        container.appendChild(ticketTypeItem);
    });
}

// Generate ticket type input fields dynamically
function generateTicketTypeFields(numTypes, container, venueCapacityInput) {
    container.innerHTML = '';
    
    for (let i = 0; i < numTypes; i++) {
        const isLastType = i === numTypes - 1;
        
        const ticketTypeItem = document.createElement('div');
        ticketTypeItem.className = 'ticket-type-item';
        ticketTypeItem.innerHTML = `
            <div class=\"ticket-type-header\">
                <h4>Ticket Type ${i + 1}${isLastType ? ' <span class=\"auto-fill-badge\">AUTO-FILL</span>' : ''}</h4>
            </div>
            <div class=\"ticket-type-fields\">
                <div class=\"form-group\" style=\"margin-bottom: 0;\">
                    <label for=\"ticketTypeName_${i}\">Type Name *</label>
                    <input type=\"text\" id=\"ticketTypeName_${i}\" name=\"ticketTypeName_${i}\" 
                        placeholder=\"e.g., VIP, Regular, Student...\" required>
                </div>
                <div class=\"form-group\" style=\"margin-bottom: 0;\">
                    <label for=\"ticketTypePrice_${i}\">Price ($) *</label>
                    <input type=\"number\" id=\"ticketTypePrice_${i}\" name=\"ticketTypePrice_${i}\" 
                        placeholder=\"0.00\" min=\"0\" step=\"0.01\" required>
                </div>
                <div class=\"form-group\" style=\"margin-bottom: 0;\">
                    <label for=\"ticketTypeSeats_${i}\">Seats *</label>
                    <input type=\"number\" id=\"ticketTypeSeats_${i}\" name=\"ticketTypeSeats_${i}\" 
                        placeholder=\"0\" min=\"${isLastType ? '0' : '1'}\" 
                        ${isLastType && numTypes > 1 ? 'readonly' : ''} required>
                </div>
            </div>
        `;
        
        container.appendChild(ticketTypeItem);
        
        // Add input listeners for auto-fill
        const seatsInput = ticketTypeItem.querySelector(`input[name=\"ticketTypeSeats_${i}\"]`);
        if (!isLastType || numTypes === 1) {
            seatsInput.addEventListener('input', function() {
                if (numTypes > 1) {
                    autoFillLastTicketType(container, venueCapacityInput);
                }
            });
        }
    }
    
    // Auto-fill if venue capacity is set
    if (venueCapacityInput.value) {
        if (numTypes === 1) {
            autoFillSingleTicketType(container, venueCapacityInput);
        } else {
            autoFillLastTicketType(container, venueCapacityInput);
        }
    }
}

// Auto-fill single ticket type with total capacity
function autoFillSingleTicketType(container, venueCapacityInput) {
    const totalCapacity = parseInt(venueCapacityInput.value) || 0;
    const seatsInput = container.querySelector('input[name="ticketTypeSeats_0"]');
    if (seatsInput) {
        seatsInput.value = totalCapacity;
    }
}

// Auto-fill the last ticket type with remaining capacity
function autoFillLastTicketType(container, venueCapacityInput) {
    const ticketTypeItems = container.querySelectorAll('.ticket-type-item');
    if (ticketTypeItems.length <= 1) return;
    
    const totalCapacity = parseInt(venueCapacityInput.value) || 0;
    if (totalCapacity === 0) return;
    
    let allocatedSeats = 0;
    
    // Calculate seats allocated to all ticket types except the last one
    for (let i = 0; i < ticketTypeItems.length - 1; i++) {
        const seatsInput = ticketTypeItems[i].querySelector(`input[name=\"ticketTypeSeats_${i}\"]`);
        allocatedSeats += parseInt(seatsInput.value) || 0;
    }
    
    // Set remaining seats to the last ticket type
    const lastSeatsInput = ticketTypeItems[ticketTypeItems.length - 1].querySelector(`input[name=\"ticketTypeSeats_${ticketTypeItems.length - 1}\"]`);
    const remainingSeats = Math.max(0, totalCapacity - allocatedSeats);
    lastSeatsInput.value = remainingSeats;
}

function collectEventFormData(form) {
    const formData = new FormData(form);
    
    // Collect ticket types (this part has to be a bit different since we have to take into consideration of the dynamic fields)
    // So if the user changes the capacity by typing it, it has to be auto-filled, and if the user uses the data from the database to fill the capacity, it has to be auto-filled as well
    const ticketTypes = [];
    const ticketTypeItems = form.querySelectorAll('.ticket-type-item');
    
    ticketTypeItems.forEach((item, index) => {
        const typeInput = item.querySelector(`input[name="ticketTypeName_${index}"]`);
        const priceInput = item.querySelector(`input[name="ticketTypePrice_${index}"]`);
        const seatsInput = item.querySelector(`input[name="ticketTypeSeats_${index}"]`);
        
        if (typeInput && priceInput && seatsInput) {
            ticketTypes.push({
                type: typeInput.value,
                price: parseFloat(priceInput.value),
                seats: parseInt(seatsInput.value)
            });
        }
    });
    
    // Send the collected data from the form to the backend
    const eventData = {
        // Main event fields
        name: formData.get('name'),
        description: formData.get('description'),
        rundown: formData.get('rundown'),
        materials: formData.get('materials') || '',
        
        // Category data
        category: formData.get('category'),
        
        // Organizer data (all fields needed to create organizer table entry)
        organizer: {
            name: formData.get('organizerName'),
            email: formData.get('organizerEmail'),
            contactNum: formData.get('organizerContact'),
            website: formData.get('organizerWebsite') || ''
        },
        
        // Venue data (all fields needed to create venue table entry)
        venue: {
            name: formData.get('venueName'),
            address: formData.get('venueAddress'),
            city: formData.get('venueCity'),
            capacity: parseInt(formData.get('venueCapacity'))
        },
        
        // DateTime data (all fields needed to create eventDateTime table entry)
        datetime: {
            date: formData.get('date'),
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime')
        },
        
        // Ticket types data
        ticketTypes: ticketTypes
    };
    
    console.log('Collected event data:', eventData);
    return eventData;
}

function collectEditEventFormData(form) {
    const formData = new FormData(form);
    
    // For edit mode, don't include ticket types or venue data
    const eventData = {
        // Main event fields
        name: formData.get('name'),
        description: formData.get('description'),
        rundown: formData.get('rundown'),
        materials: formData.get('materials') || '',
        
        // Category data
        category: formData.get('category'),
        
        // Organizer data
        organizer: {
            name: formData.get('organizerName'),
            email: formData.get('organizerEmail'),
            contactNum: formData.get('organizerContact'),
            website: formData.get('organizerWebsite') || ''
        },
        
        // DateTime data
        datetime: {
            date: formData.get('date'),
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime')
        }
    };
    
    console.log('Collected edit event data:', eventData);
    return eventData;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#10B981';
        case 'error': return '#EF4444';
        case 'warning': return '#F59E0B';
        default: return '#3B82F6';
    }
}

// Add CSS animation for notifications
if (!document.getElementById('notification-styles')) {
    const notificationStyle = document.createElement('style');
    notificationStyle.id = 'notification-styles';
    notificationStyle.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    `;
    document.head.appendChild(notificationStyle);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeEventsPage();
});