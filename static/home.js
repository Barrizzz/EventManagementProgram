// Home page specific JavaScript
// Note: initializePageSpecificCharts is now handled in common.js

// Initialize home page functionality
function initializeHomePage() {
    initializeHomeCharts();
    initializeRegisterButtons();
}

document.addEventListener('DOMContentLoaded', initializeHomePage);

// Initialize "Register Now" button listeners for upcoming events
function initializeRegisterButtons() {
    // Get all "Register Now" buttons on the page
    const registerButtons = document.querySelectorAll('.btn-register');
    
    registerButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the parent event card to extract event information
            const eventCard = this.closest('.event-card');
            
            if (eventCard) {
                // Extract event data from the card
                const eventId = eventCard.dataset.eventId || null;
                const eventName = eventCard.querySelector('h3')?.textContent || 'Event';
                
                // Show ticket selection modal
                showTicketRegistrationModal(eventId, eventName);
            }
        });
    });
}

/**
 * Show ticket registration modal for event registration
 * This modal will:
 * 1. Check if user already registered for this event (one ticket per person per event)
 * 2. Display available ticket types (from ticketType table)
 * 3. Allow user to select ticket type and seat
 * 4. Create ticket and eventCustomer record
 * 
 * @param {number} eventId - The event ID from the Event table
 * @param {string} eventName - The name of the event for display
 */
function showTicketRegistrationModal(eventId, eventName) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content ticket-registration-modal">
            <div class="modal-header">
                <h2>Register for ${eventName}</h2>
                <button class="modal-close">&times;</button>
            </div>
            
            <div class="modal-body" id="ticketModalBody">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading ticket information...</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close button handler
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.remove());
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Load ticket types and check if user already registered
    loadTicketRegistrationForm(eventId, eventName);
}

/**
 * Load ticket types and check user registration status
 * Backend will:
 * 1. Check EventCustomer table if current user already has a ticket for this event
 * 2. Fetch available TicketType records for display
 * 3. Return venue capacity to calculate available seats
 */

function loadTicketRegistrationForm(eventId, eventName) {
    const modalBody = document.getElementById('ticketModalBody');
    
    // TODO: Call backend endpoint to check registration and get ticket types
    // Expected endpoint: GET /events/<eventId>/registration-info/
    // Expected response: {
    //   already_registered: boolean,
    //   ticket_types: [{ticketTypeID, type, zone, price}, ...],
    //   venue_capacity: number,
    //   available_seats: number
    // }
    
    fetch(`/events/${eventId}/register/`, {
        headers: {
            'X-CSRFToken': getCSRFToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.registered) {
            // User already has a ticket - show their ticket info
            displayAlreadyRegistered(modalBody, data.registration_info);
        } else {
            // Show ticket selection form
            displayTicketSelectionForm(modalBody, eventId, eventName, data.ticket_types, data.available_seats);
        }
    })
    .catch(error => {
        console.error('Error loading ticket info:', error);
        modalBody.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Unable to load ticket information. Please try again later.</p>
            </div>
        `;
    });
}

/**
 * Display message when user already registered for the event
 * Shows their existing ticket details from the Ticket table
 */
function displayAlreadyRegistered(container, ticketInfo) {
    container.innerHTML = `
        <div class="already-registered-message">
            <i class="fas fa-check-circle"></i>
            <h3>You're Already Registered!</h3>
            <p>You already have a ticket for this event.</p>
            
            <div class="ticket-details">
                <h4>Your Ticket Details:</h4>
                <div class="ticket-info-grid">
                    <div class="ticket-info-item">
                        <span class="label">Ticket Type:</span>
                        <span class="value">${ticketInfo.ticket_type}</span>
                    </div>
                    <div class="ticket-info-item">
                        <span class="label">Zone:</span>
                        <span class="value">${ticketInfo.zone}</span>
                    </div>
                    <div class="ticket-info-item">
                        <span class="label">Seat:</span>
                        <span class="value">Row ${ticketInfo.row}, Seat ${ticketInfo.seat}</span>
                    </div>
                    <div class="ticket-info-item">
                        <span class="label">Price:</span>
                        <span class="value">$${ticketInfo.price}</span>
                    </div>
                    <div class="ticket-info-item">
                        <span class="label">Purchase Date:</span>
                        <span class="value">${new Date(ticketInfo.purchase_date).toLocaleString()}</span>
                    </div>
                    <div class="ticket-info-item">
                        <span class="label">Status:</span>
                        <span class="value status-${ticketInfo.status}">${ticketInfo.status}</span>
                    </div>
                </div>
            </div>
            
            <p class="note">Note: Each person can only register once per event.</p>
        </div>
    `;
}

/**
 * Display ticket type selection form
 * Shows available ticket types from TicketType table
 * Allows user to select seat (rowNum, seatNum)
 */
function displayTicketSelectionForm(container, eventId, eventName, ticketTypes, availableSeats) {
    container.innerHTML = `
        <div class="ticket-selection-form">
            <p class="available-info">
                <i class="fas fa-info-circle"></i>
                ${availableSeats} seats available
            </p>
            
            <form id="ticketRegistrationForm">
                <!-- Ticket Type Selection -->
                <div class="form-section">
                    <h3>Select Ticket Type</h3>
                    <div class="ticket-types-grid" id="ticketTypesGrid">
                        ${ticketTypes.map(type => `
                            <div class="ticket-type-card" data-ticket-type-id="${type.ticketTypeID}">
                                <input type="radio" 
                                    name="ticketType" 
                                    id="ticket_${type.ticketTypeID}" 
                                    value="${type.ticketTypeID}" 
                                    required>
                                <label for="ticket_${type.ticketTypeID}">
                                    <div class="ticket-type-header">
                                        <span class="ticket-type-name">${type.ticket_type}</span>
                                        <span class="ticket-zone">Zone ${type.zone}</span>
                                    </div>
                                    <div class="ticket-price">$${parseFloat(type.price).toFixed(2)}</div>
                                </label>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Registration Summary -->
                <div class="registration-summary" id="registrationSummary">
                    <h4>Registration Summary</h4>
                    <div class="summary-content">
                        <p><strong>Event:</strong> ${eventName}</p>
                        <p><strong>Ticket Type:</strong> <span id="summaryTicketType">-</span></p>
                        <p><strong>Total:</strong> <span id="summaryTotal">$0.00</span></p>
                    </div>
                    <p class="auto-assign-note">
                        <i class="fas fa-info-circle"></i>
                        Your seat will be automatically assigned upon confirmation.
                    </p>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancelRegistration">Cancel</button>
                    <button type="submit" class="btn-primary" id="confirmRegistration">
                        <i class="fas fa-ticket-alt"></i> Confirm Registration
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Setup form event listeners
    setupTicketRegistrationFormListeners(eventId, ticketTypes);
}

/**
 * Setup event listeners for ticket registration form
 * Handles form updates and submission
 */
function setupTicketRegistrationFormListeners(eventId, ticketTypes) {
    const form = document.getElementById('ticketRegistrationForm');
    const ticketTypeCards = document.querySelectorAll('.ticket-type-card');
    const summary = document.getElementById('registrationSummary');
    const cancelBtn = document.getElementById('cancelRegistration');
    
    // Update summary when selections change
    const updateSummary = () => {
        const selectedTicketType = document.querySelector('input[name="ticketType"]:checked');
        
        if (selectedTicketType) {
            const ticketTypeId = selectedTicketType.value;
            const ticketType = ticketTypes.find(t => t.ticketTypeID == ticketTypeId);
            
            document.getElementById('summaryTicketType').textContent = 
                `${ticketType.ticket_type} (Zone ${ticketType.zone})`;
            document.getElementById('summaryTotal').textContent = 
                `$${parseFloat(ticketType.price).toFixed(2)}`;
            
            summary.style.display = 'block';
        } else {
            summary.style.display = 'none';
        }
    };
    
    // Add visual selection feedback for ticket types
    ticketTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            ticketTypeCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input[type="radio"]').checked = true;
            updateSummary();
        });
    });
    
    // Update summary on input changes
    form.addEventListener('input', updateSummary);
    
    // Cancel button
    cancelBtn.addEventListener('click', () => {
        document.querySelector('.modal-overlay').remove();
    });
    
    // Form submission - handles ticket purchase
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleTicketRegistration(eventId, ticketTypes);
    });
}

/**
 * Handle ticket registration submission
 * Creates records in:
 * 1. Ticket table (ticketID, rowNum, seatNum, status='sold', event_id, ticket_type_id)
 * 2. EventCustomer table (event_id, customer_id, ticket_id) - links customer to event via ticket
 */
function handleTicketRegistration(eventId, ticketTypes) {
    const form = document.getElementById('ticketRegistrationForm');
    const submitBtn = document.getElementById('confirmRegistration');
    
    // Disable submit button to prevent double submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Collect form data
    const formData = new FormData(form);
    const ticketTypeId = formData.get('ticketType');
    
    // Prepare data for backend
    // Backend will:
    // 1. Check if seat is already taken (Ticket table unique_together constraint)
    // 2. Check if user already registered (EventCustomer table - one ticket per person per event)
    // 3. Create Ticket record with status='sold'
    // 4. Create EventCustomer record linking customer to ticket
    const registrationData = {
        event_id: eventId,
        ticket_type_id: ticketTypeId,
    };
    
    // TODO: Call backend endpoint to create ticket and eventCustomer record
    // Expected endpoint: POST /events/<eventId>/register/
    // Backend should return: {success: true, ticket_id: X, message: "..."}
    
    fetch(`/events/${eventId}/register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify(registrationData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Registration successful! Your ticket has been confirmed.', 'success');
            document.querySelector('.modal-overlay').remove();
            
            // Reload page to update UI (could be optimized to update specific elements)
            setTimeout(() => window.location.reload(), 1500);
        } else {
            // Handle errors (seat taken, already registered, etc.)
            showNotification(`Registration failed: ${data.error}`, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-ticket-alt"></i> Confirm Registration';
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        showNotification('An error occurred during registration. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-ticket-alt"></i> Confirm Registration';
    });
}

// Home page charts
function initializeHomeCharts() {
    initializeRevenueChart();
    initializeBookingChart();
    initializeBreakdownChart();
}

// Revenue Trends Chart
function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    // TODO: Fetch real data from database API
    // Example: fetch('/api/revenue-data/').then(res => res.json()).then(data => { ... })
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue (USD)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Will be populated from database
                borderColor: '#8B5CF6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#8B5CF6',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#E2E8F0', drawBorder: false },
                    ticks: {
                        color: '#64748B',
                        font: { family: 'Inter', size: 12 },
                        callback: value => '$' + (value / 1000) + 'K'
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748B', font: { family: 'Inter', size: 12 } }
                }
            }
        }
    });
}

// Booking Chart
function initializeBookingChart() {
    const ctx = document.getElementById('bookingChart');
    if (!ctx) return;

    // TODO: Fetch real booking data from database API
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['6AM','8AM','10AM','12PM','2PM','4PM','6PM','8PM','10PM'],
            datasets: [{
                label: 'Bookings',
                data: [0,0,0,0,0,0,0,0,0], // Will be populated from database
                backgroundColor: '#8B5CF6',
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true },
                x: { grid: { display: false } }
            }
        }
    });

    window.bookingChart = chart;
}

// Update booking chart
function updateBookingChart(selectedTab) {
    if (!window.bookingChart) return;

    // TODO: Fetch filtered data from database based on selectedTab
    // Example: fetch(`/api/bookings/?period=${selectedTab}`).then(res => res.json()).then(data => { ... })

    let newData, newLabels;

    switch(selectedTab) {
        case 'Today':
            newLabels = ['6AM','8AM','10AM','12PM','2PM','4PM','6PM','8PM','10PM'];
            newData = [0,0,0,0,0,0,0,0,0]; // Populate from database
            break;
        case 'This Week':
            newLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
            newData = [0,0,0,0,0,0,0]; // Populate from database
            break;
        case 'This Month':
            newLabels = ['Week 1','Week 2','Week 3','Week 4'];
            newData = [0,0,0,0]; // Populate from database
            break;
        default:
            return;
    }

    window.bookingChart.data.labels = newLabels;
    window.bookingChart.data.datasets[0].data = newData;
    window.bookingChart.update();
}

// Breakdown Chart
function initializeBreakdownChart() {
    const ctx = document.getElementById('breakdownChart');
    if (!ctx) return;

    // TODO: Fetch attendance breakdown data from database
    // Example: fetch('/api/attendance-breakdown/').then(res => res.json()).then(data => { ... })

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Active Attendance', 'Inactive/Missed'],
            datasets: [{
                data: [0, 0], // Will be populated from database
                backgroundColor: ['#10B981', '#EF4444'],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
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