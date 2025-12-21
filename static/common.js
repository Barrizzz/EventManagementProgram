// Common JavaScript functions shared across all pages
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavItem();
    initializeLogout();
    initializeSidebarToggle();
    updateDateTime();
    setInterval(updateDateTime, 60000);
});

// Logout functionality with confirmation
function initializeLogout() {
    const logoutLink = document.querySelector('.nav-item.logout');
    if (!logoutLink) return;
    
    // Prevent duplicate initialization
    if (logoutLink.dataset.logoutInitialized === 'true') return;
    logoutLink.dataset.logoutInitialized = 'true';
    
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (confirm('Are you sure you want to log out?')) {
            window.location.href = this.href;
        }
    });
}

// Sidebar toggle functionality
function initializeSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
}

// Set active navigation item based on current page
function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => item.classList.remove('active'));
    
    let bestMatch = null;
    let bestMatchLength = 0;
    
    navItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        const dataPage = item.getAttribute('data-page');
        
        // Exact match
        if (currentPath === itemHref && itemHref.length > bestMatchLength) {
            bestMatch = item;
            bestMatchLength = itemHref.length;
        }
        // Data-page match (e.g., data-page="attendees" matches /events/attendees/)
        else if (dataPage && currentPath.includes(dataPage) && dataPage.length > bestMatchLength) {
            bestMatch = item;
            bestMatchLength = dataPage.length;
        }
        // Starts with match
        else if (itemHref !== '/' && currentPath.startsWith(itemHref) && itemHref.length > bestMatchLength) {
            bestMatch = item;
            bestMatchLength = itemHref.length;
        }
    });
    
    if (bestMatch) {
        bestMatch.classList.add('active');
    }
}

// Update date and time
function updateDateTime() {
    const datetimeElement = document.querySelector('.datetime');
    if (!datetimeElement) return;
    
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).replace(',', ' |');
    
    datetimeElement.textContent = formatted;
}

// Get CSRF token from cookies for Django POST requests
function getCSRFToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}
