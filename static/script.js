// Event Management System JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeCharts();
    initializeNavigation();
    initializeSearch();
    initializeTabs();
    initializeSidebarToggle();
    initializeEventsPage(); // Add events page functionality
    updateDateTime();
    
    // Update time every minute
    setInterval(updateDateTime, 60000);
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', handleWindowResize);
});

// Sidebar toggle functionality
function initializeSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle && sidebar && mainContent) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('sidebar-collapsed');
            
            // Update toggle button icon
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.className = 'fas fa-chevron-right';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }
}

// Handle window resize for responsive behavior
function handleWindowResize() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (window.innerWidth <= 1024) {
        // On smaller screens, hide sidebar by default
        sidebar.classList.remove('collapsed');
        sidebar.classList.add('open');
        mainContent.classList.remove('sidebar-collapsed');
        if (sidebarToggle) sidebarToggle.style.display = 'block';
    } else {
        // On larger screens, show sidebar normally
        sidebar.classList.remove('open');
        if (sidebarToggle) sidebarToggle.style.display = 'none';
    }
}

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        // Only add click handlers to non-link nav items (Settings, Log out, etc.)
        if (!item.hasAttribute('href')) {
            item.addEventListener('click', function() {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Show notification for non-implemented features
                const itemText = this.querySelector('span').textContent;
                showNotification(`${itemText} feature coming soon!`, 'info');
            });
        } else {
            // For links, just add the click animation
            item.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        }
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const eventCards = document.querySelectorAll('.event-card');
        const attendeeRows = document.querySelectorAll('.attendees-table tbody tr');
        
        // Search in event cards
        eventCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(searchTerm)) {
                card.style.display = 'flex';
                card.style.animation = 'fadeIn 0.3s ease-out';
            } else {
                card.style.display = searchTerm ? 'none' : 'flex';
            }
        });
        
        // Search in attendee table
        attendeeRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes(searchTerm)) {
                row.style.display = 'table-row';
                row.style.animation = 'fadeIn 0.3s ease-out';
            } else {
                row.style.display = searchTerm ? 'none' : 'table-row';
            }
        });
    });
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(tab => tab.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update chart based on selected tab
            updateBookingChart(this.textContent);
        });
    });
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    
    const dateTimeString = now.toLocaleDateString('en-US', options).replace(',', ' |');
    const datetimeElement = document.querySelector('.datetime');
    
    if (datetimeElement) {
        datetimeElement.textContent = dateTimeString;
    }
}

// Initialize all charts
function initializeCharts() {
    initializeRevenueChart();
    initializeBookingChart();
    initializeBreakdownChart();
}

// Revenue Trends Chart
function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue (USD)',
                data: [12000, 15000, 18000, 22000, 25000, 28000, 32000, 35000, 30000, 26000, 20000, 18000],
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
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#E2E8F0',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748B',
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        callback: function(value) {
                            return '$' + (value / 1000) + 'K';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748B',
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                }
            },
            elements: {
                point: {
                    hoverBackgroundColor: '#8B5CF6'
                }
            }
        }
    });
}

// Booking Distribution Chart
function initializeBookingChart() {
    const ctx = document.getElementById('bookingChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
            datasets: [{
                label: 'Bookings',
                data: [5, 12, 18, 25, 35, 28, 20, 15, 8],
                backgroundColor: '#8B5CF6',
                borderColor: '#8B5CF6',
                borderWidth: 0,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#E2E8F0',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748B',
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748B',
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                }
            }
        }
    });
    
    // Store chart reference for updates
    window.bookingChart = chart;
}

// Update booking chart based on selected tab
function updateBookingChart(selectedTab) {
    if (!window.bookingChart) return;
    
    let newData;
    let newLabels;
    
    switch(selectedTab) {
        case 'Today':
            newLabels = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
            newData = [5, 12, 18, 25, 35, 28, 20, 15, 8];
            break;
        case 'This Week':
            newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            newData = [45, 52, 38, 65, 58, 42, 35];
            break;
        case 'This Month':
            newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            newData = [180, 220, 195, 240];
            break;
        default:
            return;
    }
    
    window.bookingChart.data.labels = newLabels;
    window.bookingChart.data.datasets[0].data = newData;
    window.bookingChart.update();
}

// Breakdown Chart (Donut Chart)
function initializeBreakdownChart() {
    const ctx = document.getElementById('breakdownChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Active Attendance', 'Inactive/Missed'],
            datasets: [{
                data: [87, 13],
                backgroundColor: ['#10B981', '#EF4444'],
                borderColor: ['#10B981', '#EF4444'],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            elements: {
                arc: {
                    borderWidth: 0
                }
            }
        }
    });
}

// Event card interactions
document.addEventListener('click', function(e) {
    // Handle event card button clicks
    if (e.target.classList.contains('btn-live')) {
        e.target.textContent = 'Live Now ✓';
        e.target.style.backgroundColor = '#10B981';
        showNotification('Successfully joined live event!', 'success');
    }
    
    if (e.target.classList.contains('btn-register')) {
        e.target.textContent = 'Registered ✓';
        e.target.style.backgroundColor = '#10B981';
        showNotification('Successfully registered for event!', 'success');
    }
    
    if (e.target.classList.contains('btn-book')) {
        e.target.textContent = 'Booked ✓';
        e.target.style.backgroundColor = '#10B981';
        showNotification('Event booking confirmed!', 'success');
    }
    
    if (e.target.classList.contains('btn-reminder')) {
        e.target.textContent = 'Reminder Set ✓';
        e.target.style.backgroundColor = '#10B981';
        showNotification('Reminder set for event!', 'success');
    }
    
    // Handle notification icon click
    if (e.target.closest('.notification-icon')) {
        showNotification('No new notifications', 'info');
    }
    
    // Handle view details links
    if (e.target.classList.contains('action-link')) {
        e.preventDefault();
        showNotification('Opening attendee details...', 'info');
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
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

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .notification-content i {
        font-size: 16px;
    }
`;
document.head.appendChild(style);

// Mobile menu toggle (for responsive design)
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// Initialize mobile menu behavior
function initializeMobileMenu() {
    if (window.innerWidth <= 1024) {
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', toggleMobileMenu);
        }
    }
}

// Smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for better UX
function addLoadingState(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
}

function removeLoadingState(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Export functions for potential external use
window.EventManagementSystem = {
    showNotification,
    updateDateTime,
    toggleMobileMenu
};

// Events Page Functionality
function initializeEventsPage() {
    // View toggle functionality
    const viewButtons = document.querySelectorAll('.view-btn');
    const cardsView = document.getElementById('cardsView');
    const tableView = document.getElementById('tableView');
    
    if (viewButtons.length > 0 && cardsView && tableView) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                
                // Update active state
                viewButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Toggle views
                if (view === 'cards') {
                    cardsView.style.display = 'block';
                    tableView.style.display = 'none';
                } else if (view === 'table') {
                    cardsView.style.display = 'none';
                    tableView.style.display = 'block';
                }
                
                // Show notification
                showNotification(`Switched to ${view} view`, 'success');
            });
        });
    }
    
    // Events page search functionality
    const eventsSearchInput = document.querySelector('.filters-section .search-input');
    if (eventsSearchInput) {
        eventsSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterEvents(searchTerm);
        });
    }
    
    // Status filter functionality
    const statusSelect = document.querySelector('.status-select');
    if (statusSelect) {
        statusSelect.addEventListener('change', function() {
            const selectedStatus = this.value;
            filterEventsByStatus(selectedStatus);
        });
    }
    
    // Create event button
    const createEventBtn = document.querySelector('.btn-create-event');
    if (createEventBtn) {
        createEventBtn.addEventListener('click', function() {
            showNotification('Opening event creation form...', 'info');
            // Add your event creation logic here
        });
    }
    
    // Event card action buttons
    initializeEventCardActions();
}

// Filter events based on search term
function filterEvents(searchTerm) {
    const eventCards = document.querySelectorAll('.events-cards-view .event-card');
    const tableRows = document.querySelectorAll('.events-table tbody tr');
    
    let visibleCount = 0;
    
    // Filter cards view
    eventCards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        if (cardText.includes(searchTerm)) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Filter table view
    tableRows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        if (rowText.includes(searchTerm)) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update event counts in section headers
    updateEventCounts();
}

// Filter events by status
function filterEventsByStatus(status) {
    const eventSections = document.querySelectorAll('.events-section');
    
    eventSections.forEach(section => {
        if (status === 'all') {
            section.style.display = 'block';
        } else {
            const sectionClass = section.className;
            if (sectionClass.includes(status)) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        }
    });
    
    // Table view filtering
    const tableRows = document.querySelectorAll('.events-table tbody tr');
    tableRows.forEach(row => {
        if (status === 'all') {
            row.style.display = 'table-row';
        } else {
            if (row.classList.contains(status)) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        }
    });
    
    showNotification(`Showing ${status === 'all' ? 'all' : status} events`, 'info');
}

// Update event counts
function updateEventCounts() {
    const sections = document.querySelectorAll('.events-section');
    sections.forEach(section => {
        const visibleCards = section.querySelectorAll('.event-card[style*="display: flex"], .event-card:not([style*="display: none"])');
        const countElement = section.querySelector('.event-count');
        if (countElement) {
            const count = visibleCards.length;
            countElement.textContent = `${count} event${count !== 1 ? 's' : ''}`;
        }
    });
}

// Initialize event card actions
function initializeEventCardActions() {
    // View Details buttons
    const viewDetailsButtons = document.querySelectorAll('.btn-action.primary');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventCard = this.closest('.event-card');
            const eventTitle = eventCard.querySelector('.event-title').textContent;
            showNotification(`Opening details for "${eventTitle}"`, 'info');
        });
    });
    
    // Edit Event buttons
    const editButtons = document.querySelectorAll('.btn-action.secondary');
    editButtons.forEach(button => {
        if (button.textContent.includes('Edit')) {
            button.addEventListener('click', function() {
                const eventCard = this.closest('.event-card');
                const eventTitle = eventCard.querySelector('.event-title').textContent;
                showNotification(`Editing "${eventTitle}"`, 'info');
            });
        }
    });
    
    // View Report buttons (for finished events)
    const reportButtons = document.querySelectorAll('.btn-action.secondary');
    reportButtons.forEach(button => {
        if (button.textContent.includes('Report')) {
            button.addEventListener('click', function() {
                const eventCard = this.closest('.event-card');
                const eventTitle = eventCard.querySelector('.event-title').textContent;
                showNotification(`Loading report for "${eventTitle}"`, 'info');
            });
        }
    });
}

