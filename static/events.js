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

    const statusSelect = document.querySelector('.status-select');
    if (statusSelect) {
        statusSelect.addEventListener('change', function() {
            filterEventsByStatus(this.value);
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
                <div class="form-group">
                    <label for="eventTitle">Event Title *</label>
                    <input type="text" id="eventTitle" name="title" value="${isEditMode ? eventData.title : ''}" required>
                </div>

                <div class="form-group">
                    <label for="eventDescription">Description *</label>
                    <textarea id="eventDescription" name="description" rows="4" required>${isEditMode ? eventData.description : ''}</textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="eventDate">Date *</label>
                        <input type="date" id="eventDate" name="date" value="${isEditMode ? eventData.date : ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="eventLocation">Location *</label>
                        <input type="text" id="eventLocation" name="location" value="${isEditMode ? eventData.location : ''}" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="startTime">Start Time *</label>
                        <input type="time" id="startTime" name="start_time" value="${isEditMode ? eventData.start_time : ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="endTime">End Time *</label>
                        <input type="time" id="endTime" name="end_time" value="${isEditMode ? eventData.end_time : ''}" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="maxAttendees">Max Attendees</label>
                        <input type="number" id="maxAttendees" name="max_attendees" value="${isEditMode ? eventData.max_attendees : ''}" min="1">
                    </div>
                    <div class="form-group">
                        <label for="eventStatus">Status</label>
                        <select id="eventStatus" name="status">
                            <option value="upcoming" ${isEditMode && eventData.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
                            <option value="ongoing" ${isEditMode && eventData.status === 'ongoing' ? 'selected' : ''}>Ongoing</option>
                            <option value="finished" ${isEditMode && eventData.status === 'finished' ? 'selected' : ''}>Finished</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="eventImage">Image URL (optional)</label>
                    <input type="url" id="eventImage" name="image_url" value="${isEditMode ? eventData.image_url : ''}" placeholder="https://example.com/image.jpg">
                </div>

                <div class="form-actions">
                    ${isEditMode ? '<button type="button" class="btn-danger" id="deleteBtn"><i class="fas fa-trash"></i> Delete Event</button>' : '<div></div>'}
                    <div class="right-actions">
                        <button type="button" class="btn-secondary" id="cancelBtn">Cancel</button>
                        <button type="submit" class="btn-primary">${submitButtonText}</button>
                    </div>
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
            justify-content: space-between;
            align-items: center;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
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
    `;
        document.head.appendChild(style);
    }

    // Add modal to page
    document.body.appendChild(modal);

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

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const submitData = Object.fromEntries(formData.entries());

        const url = isEditMode ? `/events/update/${eventData.id}/` : '/events/';
        const successMessage = isEditMode ? 'Event updated successfully!' : 'Event created successfully!';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCSRFToken()
            },
            body: new URLSearchParams(submitData)
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