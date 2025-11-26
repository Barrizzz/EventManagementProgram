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
            showCreateEventForm();
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
            section.style.display = section.classList.contains(status) ? 'block' : 'none';
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
    const viewDetails = document.querySelectorAll('.btn-action.primary');
    viewDetails.forEach(btn => {
        btn.addEventListener('click', function() {
            const title = this.closest('.event-card').querySelector('.event-title').textContent;
            showNotification(`Opening details for "${title}"`, 'info');
        });
    });

    const editButtons = document.querySelectorAll('.btn-action.secondary');
    editButtons.forEach(button => {
        if (button.textContent.includes('Edit')) {
            button.addEventListener('click', function() {
                const title = this.closest('.event-card').querySelector('.event-title').textContent;
                showNotification(`Editing "${title}"`, 'info');
            });
        }
    });

    const reportButtons = document.querySelectorAll('.btn-action.secondary');
    reportButtons.forEach(button => {
        if (button.textContent.includes('Report')) {
            button.addEventListener('click', function() {
                const title = this.closest('.event-card').querySelector('.event-title').textContent;
                showNotification(`Opening report for "${title}"`, 'info');
            });
        }
    });
}

// Show create event form modal
function showCreateEventForm() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content create-event-modal">
            <div class="modal-header">
                <h2>Create New Event</h2>
                <button class="modal-close">&times;</button>
            </div>
            <form class="create-event-form" id="createEventForm">
                <div class="form-group">
                    <label for="eventTitle">Event Title *</label>
                    <input type="text" id="eventTitle" name="title" required>
                </div>

                <div class="form-group">
                    <label for="eventDescription">Description *</label>
                    <textarea id="eventDescription" name="description" rows="4" required></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="eventDate">Date *</label>
                        <input type="date" id="eventDate" name="date" required>
                    </div>
                    <div class="form-group">
                        <label for="eventLocation">Location *</label>
                        <input type="text" id="eventLocation" name="location" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="startTime">Start Time *</label>
                        <input type="time" id="startTime" name="start_time" required>
                    </div>
                    <div class="form-group">
                        <label for="endTime">End Time *</label>
                        <input type="time" id="endTime" name="end_time" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="maxAttendees">Max Attendees</label>
                        <input type="number" id="maxAttendees" name="max_attendees" min="1">
                    </div>
                    <div class="form-group">
                        <label for="eventStatus">Status</label>
                        <select id="eventStatus" name="status">
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="finished">Finished</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="eventImage">Image URL (optional)</label>
                    <input type="url" id="eventImage" name="image_url" placeholder="https://example.com/image.jpg">
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancelBtn">Cancel</button>
                    <button type="submit" class="btn-primary">Create Event</button>
                </div>
            </form>
        </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
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
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
        }

        .btn-primary, .btn-secondary {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
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
    `;
    document.head.appendChild(style);

    // Add modal to page
    document.body.appendChild(modal);

    // Event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('#cancelBtn');
    const form = modal.querySelector('#createEventForm');

    // Close modal functions
    const closeModal = () => {
        modal.remove();
        style.remove();
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const eventData = Object.fromEntries(formData.entries());

        // Send POST request to Django backend
        fetch('/events/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCSRFToken() // You'll need to implement this
            },
            body: new URLSearchParams(eventData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Event created successfully!', 'success');
                closeModal();
                // Reload the page to show the new event
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                showNotification('Error creating event: ' + data.error, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error creating event. Please try again.', 'error');
        });
    });
}