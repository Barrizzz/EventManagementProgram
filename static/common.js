// Common JavaScript functions shared across all pages
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Event Management System...');

    // Initialize all components
    setActiveNavItem();
    initializePageSpecificCharts();
    initializeNavigation();
    initializeSearch();
    initializeTabs();
    initializeSidebarToggle();
    updateDateTime();

    // Update time every minute
    setInterval(updateDateTime, 60000);

    // Handle window resize for responsive behavior
    window.addEventListener('resize', handleWindowResize);

    console.log('✅ System initialization complete');
});

// Get current page name from URL or body class
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('reports.html') || document.querySelector('.reports-header')) {
        return 'reports';
    } else if (path.includes('attendees.html') || document.querySelector('.attendee-stats')) {
        return 'attendees';
    } else if (path.includes('events.html') || document.querySelector('.events-content')) {
        return 'events';
    } else {
        return 'home';
    }
}

// Initialize charts based on current page
function initializePageSpecificCharts() {
    const currentPage = getCurrentPage();
    console.log(`📄 Current page: ${currentPage}`);
    
    switch(currentPage) {
        case 'reports':
            // Will be loaded from reports.js
            if (typeof initializeReportsCharts === 'function') {
                initializeReportsCharts();
                setupReportsEventListeners();
            }
            break;
        case 'attendees':
            // Will be loaded from attendees.js
            if (typeof initializeAttendeeCharts === 'function') {
                initializeAttendeeCharts();
                setupAttendeeEventListeners();
                setupTableInteractions();
            }
            break;
        case 'events':
            // Will be loaded from events.js
            if (typeof initializeEventsPage === 'function') {
                initializeEventsPage();
            }
            break;
        default:
            // Home page - will be loaded from home.js
            if (typeof initializeHomeCharts === 'function') {
                initializeHomeCharts();
            }
            break;
    }
}

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
        sidebar.classList.remove('collapsed');
        sidebar.classList.add('open');
        mainContent.classList.remove('sidebar-collapsed');
        if (sidebarToggle) sidebarToggle.style.display = 'block';
    } else {
        sidebar.classList.remove('open');
        if (sidebarToggle) sidebarToggle.style.display = 'none';
    }
}

// Set active navigation item based on current page
function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    console.log('Current path:', currentPath);
    
    // Remove all active classes first
    navItems.forEach(item => item.classList.remove('active'));
    
    // Find matching nav item
    let matched = false;
    navItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        const dataPage = item.getAttribute('data-page');
        
        if (itemHref && !matched) {
            // Check for exact match first
            if (currentPath === itemHref) {
                item.classList.add('active');
                matched = true;
                console.log('Exact match for:', itemHref);
            }
            // Check if current path contains the data-page value
            else if (dataPage && currentPath.includes(dataPage)) {
                item.classList.add('active');
                matched = true;
                console.log('Data-page match for:', dataPage);
            }
            // Check if path starts with href (but not for root)
            else if (itemHref !== '/' && currentPath.startsWith(itemHref)) {
                item.classList.add('active');
                matched = true;
                console.log('Starts with match for:', itemHref);
            }
        }
    });
    
    // If no match found and we're at root, activate home
    if (!matched && currentPath === '/') {
        navItems.forEach(item => {
            const itemHref = item.getAttribute('href');
            if (itemHref === '/' || item.getAttribute('data-page') === 'home') {
                item.classList.add('active');
                console.log('Home page activated');
            }
        });
    }
}

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Handle logout confirmation
            if (this.classList.contains('logout')) {
                e.preventDefault();
                
                const confirmed = confirm('Are you sure you want to log out?');
                
                if (confirmed) {
                    window.location.href = this.getAttribute('href');
                }
                return;
            }
            
            // Add click animation for other nav items
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const eventCards = document.querySelectorAll('.event-card');
            const attendeeRows = document.querySelectorAll('.attendees-table tbody tr');

            eventCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                if (cardText.includes(searchTerm)) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.3s ease-out';
                } else {
                    card.style.display = searchTerm ? 'none' : 'flex';
                }
            });

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
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
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

// Notification system
function showNotification(message, type = 'info') {
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
const style = document.createElement('style');
style.textContent = `
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
document.head.appendChild(style);

// Get CSRF token from cookies for Django POST requests
function getCSRFToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
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

    if (e.target.closest('.notification-icon')) {
        showNotification('No new notifications', 'info');
    }

    if (e.target.classList.contains('action-link')) {
        e.preventDefault();
        showNotification('Opening attendee details...', 'info');
    }