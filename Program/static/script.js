// Event Management System JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Event Management System...');
    
    // Initialize all components
    initializePageSpecificCharts();
    initializeNavigation();
    initializeSearch();
    initializeTabs();
    initializeSidebarToggle();
    initializeEventsPage();
    updateDateTime();
    
    // Update time every minute
    setInterval(updateDateTime, 60000);
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', handleWindowResize);
    
    console.log('✅ System initialization complete');
});

// Initialize charts based on current page
function initializePageSpecificCharts() {
    const currentPage = getCurrentPage();
    console.log(`📄 Current page: ${currentPage}`);
    
    switch(currentPage) {
        case 'reports':
            initializeReportsCharts();
            setupReportsEventListeners();
            break;
        case 'attendees':
            initializeAttendeeCharts();
            setupAttendeeEventListeners();
            setupTableInteractions();
            break;
        case 'events':
            // Events page doesn't have charts
            break;
        default:
            // Home page
            initializeHomeCharts();
            break;
    }
}

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

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        if (!item.hasAttribute('href')) {
            item.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                const itemText = this.querySelector('span').textContent;
                showNotification(`${itemText} feature coming soon!`, 'info');
            });
        } else {
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
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['6AM','8AM','10AM','12PM','2PM','4PM','6PM','8PM','10PM'],
            datasets: [{
                label: 'Bookings',
                data: [5,12,18,25,35,28,20,15,8],
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
    
    let newData, newLabels;
    
    switch(selectedTab) {
        case 'Today':
            newLabels = ['6AM','8AM','10AM','12PM','2PM','4PM','6PM','8PM','10PM'];
            newData = [5,12,18,25,35,28,20,15,8];
            break;
        case 'This Week':
            newLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
            newData = [45,52,38,65,58,42,35];
            break;
        case 'This Month':
            newLabels = ['Week 1','Week 2','Week 3','Week 4'];
            newData = [180,220,195,240];
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

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Active Attendance', 'Inactive/Missed'],
            datasets: [{
                data: [87, 13],
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

// Event actions (live, register, etc.)
document.addEventListener('click', function(e) {
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
});

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

// EVENTS PAGE LOGIC
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
            showNotification('Opening event creation form...', 'info');
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

// REPORTS PAGE LOGIC
function initializeReportsCharts() {
    console.log('📊 Initializing reports charts...');
    
    // Debug chart containers first
    debugChartContainers();
    
    // Main charts
    createEventsAttendanceChart();
    createRevenueAnalysisChart();
    
    // Side charts - with delay to ensure DOM is ready
    setTimeout(() => {
        createEventDistributionChart();
        createAttendanceRateChart();
        createTopEventsChart();
        
        // Force resize after charts are created
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }, 200);
}

// Debug function to check chart containers
function debugChartContainers() {
    console.log('🔍 Checking chart containers...');
    
    const containers = [
        'eventDistributionChart',
        'attendanceRateChart', 
        'topEventsChart',
        'eventsAttendanceChart',
        'revenueChart'
    ];
    
    containers.forEach(id => {
        const canvas = document.getElementById(id);
        const container = canvas ? canvas.closest('.chart-content, .chart-content-small') : null;
        
        console.log(`${id}:`, {
            canvasExists: !!canvas,
            containerExists: !!container,
            containerHeight: container ? container.offsetHeight : 0,
            containerWidth: container ? container.offsetWidth : 0
        });
    });
}

// Set up event listeners for reports page
function setupReportsEventListeners() {
    console.log('🔧 Setting up reports event listeners...');
    
    // Time period selector
    const timePeriodButtons = document.querySelectorAll('.time-period-btn');
    timePeriodButtons.forEach(button => {
        button.addEventListener('click', function() {
            timePeriodButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateChartsForTimePeriod(this.textContent);
        });
    });

    // Chart action buttons
    const chartActionButtons = document.querySelectorAll('.chart-action-btn');
    chartActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parent = this.parentElement;
            const buttons = parent.querySelectorAll('.chart-action-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Report tabs
    const reportTabs = document.querySelectorAll('.report-tab');
    reportTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            reportTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Filter actions
    const applyFilterBtn = document.querySelector('.btn-filter.apply');
    const resetFilterBtn = document.querySelector('.btn-filter.reset');
    
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            showNotification('Filters applied! Charts updated with filtered data.', 'success');
            updateChartsWithFilters();
        });
    }
    
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function() {
            const filterSelects = document.querySelectorAll('.filter-select');
            filterSelects.forEach(select => {
                select.selectedIndex = 0;
            });
            showNotification('Filters reset!', 'info');
            initializeReportsCharts();
        });
    }

    // Export button
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            showNotification('Report exported successfully!', 'success');
        });
    }
}

// Create Events & Attendance Over Time chart
function createEventsAttendanceChart() {
    const canvas = document.getElementById('eventsAttendanceChart');
    if (!canvas) {
        console.error('❌ eventsAttendanceChart canvas not found');
        return null;
    }
    
    console.log('🔄 Creating events attendance chart...');
    
    try {
        // Clear any existing chart
        if (canvas.chartInstance) {
            canvas.chartInstance.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Events',
                        data: [18, 22, 25, 30, 28, 35, 32],
                        borderColor: '#8B5CF6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#8B5CF6',
                        pointBorderColor: '#FFFFFF',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    },
                    {
                        label: 'Attendance',
                        data: [320, 380, 420, 510, 480, 590, 550],
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#10B981',
                        pointBorderColor: '#FFFFFF',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                family: 'Inter'
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748B',
                            font: {
                                family: 'Inter'
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
                                family: 'Inter'
                            }
                        }
                    }
                }
            }
        });
        
        // Store reference
        canvas.chartInstance = chart;
        console.log('✅ Events attendance chart created successfully');
        return chart;
        
    } catch (error) {
        console.error('❌ Error creating events attendance chart:', error);
        return null;
    }
}

// Create Revenue Analysis chart
function createRevenueAnalysisChart() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) {
        console.error('❌ revenueChart canvas not found');
        return null;
    }
    
    console.log('🔄 Creating revenue analysis chart...');
    
    try {
        // Clear any existing chart
        if (canvas.chartInstance) {
            canvas.chartInstance.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Conference', 'Workshop', 'Networking', 'Webinar', 'Other'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [12500, 4200, 1800, 3100, 1200],
                    backgroundColor: [
                        '#8B5CF6',
                        '#10B981',
                        '#F59E0B',
                        '#EC4899',
                        '#6B7280'
                    ],
                    borderWidth: 0,
                    borderRadius: 6
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
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748B',
                            font: {
                                family: 'Inter'
                            },
                            callback: function(value) {
                                return '$' + value.toLocaleString();
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
                                family: 'Inter'
                            }
                        }
                    }
                }
            }
        });
        
        // Store reference
        canvas.chartInstance = chart;
        console.log('✅ Revenue analysis chart created successfully');
        return chart;
        
    } catch (error) {
        console.error('❌ Error creating revenue analysis chart:', error);
        return null;
    }
}

// Create Event Distribution chart
function createEventDistributionChart() {
    const canvas = document.getElementById('eventDistributionChart');
    if (!canvas) {
        console.error('❌ eventDistributionChart canvas not found');
        return null;
    }
    
    console.log('🔄 Creating event distribution chart...');
    
    try {
        // Clear any existing chart
        if (canvas.chartInstance) {
            canvas.chartInstance.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Conference', 'Workshop', 'Networking', 'Webinar'],
                datasets: [{
                    data: [35, 25, 20, 20],
                    backgroundColor: [
                        '#8B5CF6',
                        '#10B981',
                        '#F59E0B',
                        '#EC4899'
                    ],
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 11,
                                family: 'Inter'
                            },
                            color: '#64748B'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10
                    }
                }
            }
        });
        
        // Store reference
        canvas.chartInstance = chart;
        console.log('✅ Event distribution chart created successfully');
        return chart;
        
    } catch (error) {
        console.error('❌ Error creating event distribution chart:', error);
        return null;
    }
}

// Create Attendance Rate chart
function createAttendanceRateChart() {
    const canvas = document.getElementById('attendanceRateChart');
    if (!canvas) {
        console.error('❌ attendanceRateChart canvas not found');
        return null;
    }
    
    console.log('🔄 Creating attendance rate chart...');
    
    try {
        // Clear any existing chart
        if (canvas.chartInstance) {
            canvas.chartInstance.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Attended', 'Registered', 'No Show'],
                datasets: [{
                    data: [84, 12, 4],
                    backgroundColor: [
                        '#10B981',
                        '#F59E0B',
                        '#EF4444'
                    ],
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 11,
                                family: 'Inter'
                            },
                            color: '#64748B'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10
                    }
                }
            }
        });
        
        // Store reference
        canvas.chartInstance = chart;
        console.log('✅ Attendance rate chart created successfully');
        return chart;
        
    } catch (error) {
        console.error('❌ Error creating attendance rate chart:', error);
        return null;
    }
}

// Create Top Events chart
function createTopEventsChart() {
    const canvas = document.getElementById('topEventsChart');
    if (!canvas) {
        console.error('❌ topEventsChart canvas not found');
        return null;
    }
    
    console.log('🔄 Creating top events chart...');
    
    try {
        // Clear any existing chart
        if (canvas.chartInstance) {
            canvas.chartInstance.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Tech Summit', 'Marketing Workshop', 'Leadership Conf', 'AI Expo', 'Startup Night'],
                datasets: [{
                    label: 'Attendance',
                    data: [245, 180, 312, 430, 120],
                    backgroundColor: '#8B5CF6',
                    borderWidth: 0,
                    borderRadius: 8,
                    borderSkipped: false,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Attendance: ${context.parsed.x} people`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748B',
                            font: {
                                size: 11,
                                family: 'Inter'
                            },
                            callback: function(value) {
                                return value;
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748B',
                            font: {
                                size: 11,
                                family: 'Inter'
                            }
                        }
                    }
                },
                layout: {
                    padding: {
                        left: 5,
                        right: 15,
                        top: 10,
                        bottom: 10
                    }
                }
            }
        });
        
        // Store reference
        canvas.chartInstance = chart;
        console.log('✅ Top events chart created successfully');
        return chart;
        
    } catch (error) {
        console.error('❌ Error creating top events chart:', error);
        return null;
    }
}

// Update charts based on time period
function updateChartsForTimePeriod(period) {
    showNotification(`Loading data for ${period}...`, 'info');
    
    // Simulate API call delay
    setTimeout(() => {
        initializeReportsCharts();
        showNotification(`Charts updated for ${period}`, 'success');
    }, 1000);
}

// Update charts with current filter values
function updateChartsWithFilters() {
    const eventType = document.querySelector('.filter-select')?.value || 'All';
    const eventStatus = document.querySelectorAll('.filter-select')[1]?.value || 'All';
    const ticketType = document.querySelectorAll('.filter-select')[2]?.value || 'All';
    const location = document.querySelectorAll('.filter-select')[3]?.value || 'All';
    
    console.log('Applying filters:', { eventType, eventStatus, ticketType, location });
    showNotification('Charts updated with filtered data', 'success');
}

// ATTENDEES PAGE LOGIC
function initializeAttendeeCharts() {
    console.log('📊 Initializing attendee charts...');
    createSubscriptionChart();
    createTopAttendeesChart();
    createTrendChart();
}

// Set up event listeners for attendees page
function setupAttendeeEventListeners() {
    console.log('🔧 Setting up attendee event listeners...');
    
    // Search functionality
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            filterTableBySearch(this.value);
        });
    }

    // Filter functionality
    const filterBox = document.querySelector('.filter-box');
    if (filterBox) {
        filterBox.addEventListener('change', function() {
            filterTableByStatus(this.value);
        });
    }

    // Sort functionality
    const sortBox = document.querySelector('.sort-box');
    if (sortBox) {
        sortBox.addEventListener('change', function() {
            sortTable(this.value);
        });
    }

    // Add attendee button
    const addBtn = document.querySelector('.add-attendee-btn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            openAddAttendeeModal();
        });
    }

    // Edit attendee button
    const editBtn = document.querySelector('.edit-attendee-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            toggleEditMode();
        });
    }

    // Export button
    const exportBtn = document.querySelector('.header-actions .btn-primary');
    if (exportBtn && exportBtn.textContent.includes('Export')) {
        exportBtn.addEventListener('click', function() {
            exportAttendeeList();
        });
    }

    // Refresh button
    const refreshBtn = document.querySelectorAll('.header-actions .btn-primary')[1];
    if (refreshBtn && refreshBtn.textContent.includes('Refresh')) {
        refreshBtn.addEventListener('click', function() {
            refreshData();
        });
    }

    // Table action buttons
    const tableFilterBtn = document.querySelectorAll('.table-action-btn')[0];
    if (tableFilterBtn) {
        tableFilterBtn.addEventListener('click', function() {
            toggleAdvancedFilters();
        });
    }

    const tableColumnsBtn = document.querySelectorAll('.table-action-btn')[1];
    if (tableColumnsBtn) {
        tableColumnsBtn.addEventListener('click', function() {
            toggleColumnVisibility();
        });
    }

    // Pagination buttons
    setupPagination();
}

// Create Subscription Chart for attendees page
function createSubscriptionChart() {
    const canvas = document.getElementById('subChart');
    if (!canvas) {
        console.error('❌ subChart canvas not found');
        return null;
    }
    
    console.log('🔄 Creating subscription chart...');
    
    try {
        // Clear any existing chart
        if (canvas.chartInstance) {
            canvas.chartInstance.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Subscribed', 'Non-Subscribed'],
                datasets: [{
                    data: [245, 520],
                    backgroundColor: ['#8B5CF6', '#F59E0B'],
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 11,
                                family: 'Inter'
                            },
                            color: '#64748B'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed} people`;
                            }
                        }
                    }
                }
            }
        });
        
        // Store reference
        canvas.chartInstance = chart;
        console.log('✅ Subscription chart created successfully');
        return chart;
        
    } catch (error) {
        console.error('❌ Error creating subscription chart:', error);
        return null;
    }
}

// Create Top Attendees Chart
function createTopAttendeesChart() {
    const canvas = document.getElementById('topChart');
    if (!canvas) {
        console.error('❌ topChart canvas not found');
        return null;
    }
    
    console.log('🔄 Creating top attendees chart...');
    
    try {
        // Clear any existing chart
        if (canvas.chartInstance) {
            canvas.chartInstance.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Hassan I.', 'Abdulrahman N.', 'Layla K.', 'Khalid F.', 'Sadia A.'],
                datasets: [{
                    label: 'Events Attended',
                    data: [21, 22, 19, 18, 17],
                    backgroundColor: '#8B5CF6',
                    borderWidth: 0,
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
        // Store reference
        canvas.chartInstance = chart;
        console.log('✅ Top attendees chart created successfully');
        return chart;
        
    } catch (error) {
        console.error('❌ Error creating top attendees chart:', error);
        return null;
    }
}

// Create Trend Chart
function createTrendChart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas) {
        console.error('❌ trendChart canvas not found');
        return null;
    }
    
    console.log('🔄 Creating trend chart...');
    
    try {
        // Clear any existing chart
        if (canvas.chartInstance) {
            canvas.chartInstance.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Attendees',
                    data: [28, 32, 45, 38, 52, 48],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#10B981',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
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
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
        // Store reference
        canvas.chartInstance = chart;
        console.log('✅ Trend chart created successfully');
        return chart;
        
    } catch (error) {
        console.error('❌ Error creating trend chart:', error);
        return null;
    }
}

// Set up table row interactions
function setupTableInteractions() {
    const tableRows = document.querySelectorAll('.attendee-table tbody tr');
    
    tableRows.forEach(row => {
        // Add click event for row selection
        row.addEventListener('click', function(e) {
            if (!e.target.closest('.action-cell')) {
                toggleRowSelection(this);
            }
        });

        // Edit button in action cell
        const editBtn = row.querySelector('.action-btn.edit');
        if (editBtn) {
            editBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                editAttendee(row);
            });
        }

        // Delete button in action cell
        const deleteBtn = row.querySelector('.action-btn.delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                deleteAttendee(row);
            });
        }
    });
}

// Filter table by search input
function filterTableBySearch(searchTerm) {
    const tableRows = document.querySelectorAll('.attendee-table tbody tr');
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    tableRows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const status = row.cells[1].textContent.toLowerCase();
        
        if (name.includes(lowerSearchTerm) || status.includes(lowerSearchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    updatePaginationInfo();
}

// Filter table by status
function filterTableByStatus(status) {
    const tableRows = document.querySelectorAll('.attendee-table tbody tr');
    
    tableRows.forEach(row => {
        const rowStatus = row.cells[1].textContent.toLowerCase().replace('-', '');
        
        if (!status || rowStatus === status) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    updatePaginationInfo();
}

// Sort table based on selected option
function sortTable(sortBy) {
    const table = document.querySelector('.attendee-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        switch(sortBy) {
            case 'name-asc':
                return a.cells[0].textContent.localeCompare(b.cells[0].textContent);
            case 'name-desc':
                return b.cells[0].textContent.localeCompare(a.cells[0].textContent);
            case 'recent':
                return compareDates(a.cells[3].textContent, b.cells[3].textContent);
            case 'top':
                return parseInt(b.cells[2].textContent) - parseInt(a.cells[2].textContent);
            default:
                return 0;
        }
    });
    
    // Remove existing rows
    rows.forEach(row => tbody.removeChild(row));
    
    // Add sorted rows
    rows.forEach(row => tbody.appendChild(row));
}

// Helper function to compare dates for sorting
function compareDates(dateA, dateB) {
    // Simplified comparison - in real app, use proper date parsing
    return dateA.localeCompare(dateB);
}

// Toggle row selection
function toggleRowSelection(row) {
    row.classList.toggle('selected');
    
    // Update UI to show selection state
    const selectedRows = document.querySelectorAll('.attendee-table tbody tr.selected');
    console.log(`${selectedRows.length} row(s) selected`);
}

// Edit attendee
function editAttendee(row) {
    const name = row.cells[0].textContent;
    const status = row.cells[1].textContent;
    const events = row.cells[2].textContent;
    
    // In a real app, this would open an edit modal
    alert(`Editing attendee: ${name}\nStatus: ${status}\nEvents: ${events}`);
}

// Delete attendee
function deleteAttendee(row) {
    const name = row.cells[0].textContent;
    
    if (confirm(`Are you sure you want to delete ${name}?`)) {
        row.remove();
        updatePaginationInfo();
    }
}

// Open add attendee modal
function openAddAttendeeModal() {
    alert('Add Attendee form would open here');
}

// Toggle edit mode
function toggleEditMode() {
    const table = document.querySelector('.attendee-table');
    table.classList.toggle('edit-mode');
    
    const editBtn = document.querySelector('.edit-attendee-btn');
    if (table.classList.contains('edit-mode')) {
        editBtn.innerHTML = '<i class="fas fa-times"></i> Cancel Edit';
        editBtn.style.background = 'var(--error-red)';
    } else {
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Attendee';
        editBtn.style.background = 'var(--background-gray)';
    }
}

// Export attendee list
function exportAttendeeList() {
    alert('Exporting attendee list...');
}

// Refresh data
function refreshData() {
    alert('Refreshing data from server...');
    
    // Show loading state
    const refreshBtn = document.querySelectorAll('.header-actions .btn-primary')[1];
    if (refreshBtn) {
        const originalHtml = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            refreshBtn.innerHTML = originalHtml;
            refreshBtn.disabled = false;
            alert('Data refreshed successfully!');
        }, 1500);
    }
}

// Toggle advanced filters
function toggleAdvancedFilters() {
    alert('Advanced filters panel would toggle here');
}

// Toggle column visibility
function toggleColumnVisibility() {
    alert('Column visibility selector would appear here');
}

// Set up pagination functionality
function setupPagination() {
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                // Remove active class from all buttons
                paginationBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button (if it's a number)
                if (!isNaN(parseInt(this.textContent)) || this.textContent === '...') {
                    this.classList.add('active');
                }
                
                // Handle pagination
                handlePagination(this);
            }
        });
    });
}

// Handle pagination
function handlePagination(button) {
    const pageText = button.textContent;
    
    if (pageText === '...') return;
    
    if (button.querySelector('.fa-chevron-left')) {
        // Previous page
        const currentActive = document.querySelector('.pagination-btn.active');
        const currentPage = parseInt(currentActive.textContent);
        if (currentPage > 1) {
            navigateToPage(currentPage - 1);
        }
    } else if (button.querySelector('.fa-chevron-right')) {
        // Next page
        const currentActive = document.querySelector('.pagination-btn.active');
        const currentPage = parseInt(currentActive.textContent);
        navigateToPage(currentPage + 1);
    } else {
        // Specific page
        const pageNum = parseInt(pageText);
        navigateToPage(pageNum);
    }
}

// Navigate to specific page
function navigateToPage(pageNum) {
    console.log(`Navigating to page ${pageNum}`);
    
    // Update pagination UI
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === pageNum.toString()) {
            btn.classList.add('active');
        }
    });
    
    updatePaginationInfo();
}

// Update pagination information
function updatePaginationInfo() {
    const visibleRows = document.querySelectorAll('.attendee-table tbody tr[style=""]');
    const totalRows = document.querySelectorAll('.attendee-table tbody tr').length;
    const paginationInfo = document.querySelector('.pagination-info');
    
    if (paginationInfo) {
        paginationInfo.textContent = `Showing 1-${visibleRows.length} of ${totalRows} attendees`;
    }
}

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    // Adjust layout if needed
    if (window.innerWidth < 768) {
        const attendeeMain = document.querySelector('.attendee-main');
        if (attendeeMain) {
            attendeeMain.style.gridTemplateColumns = '1fr';
        }
    } else {
        const attendeeMain = document.querySelector('.attendee-main');
        if (attendeeMain) {
            attendeeMain.style.gridTemplateColumns = '2fr 1fr';
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchBox = document.querySelector('.search-box');
        if (searchBox) searchBox.focus();
    }
    
    // Ctrl/Cmd + N to add new attendee
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openAddAttendeeModal();
    }
});

// Manual chart refresh function
function refreshCharts() {
    console.log('🔄 Manually refreshing all charts...');
    initializePageSpecificCharts();
}

// Test function - call this in browser console if charts still don't show
function testCharts() {
    console.log('🧪 Testing charts...');
    initializePageSpecificCharts();
}

// Make functions globally available
window.refreshCharts = refreshCharts;
window.testCharts = testCharts;
window.EventManagementSystem = {
    showNotification,
    updateDateTime,
    refreshCharts,
    testCharts
};



// Settings Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsPage();
    initializeSidebarToggle();
});

// Initialize settings page functionality
function initializeSettingsPage() {
    initializeMenuNavigation();
    initializeFormHandling();
    initializeSaveFunctionality();
    initializePasswordStrength();
}

// Menu navigation
function initializeMenuNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const settingsSections = document.querySelectorAll('.settings-section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active menu item
            menuItems.forEach(menuItem => menuItem.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            settingsSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
            
            // Show notification
            showNotification(`Switched to ${this.textContent.trim()} settings`, 'info');
        });
    });
}

// Form handling
function initializeFormHandling() {
    // File upload preview
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const avatarPreview = document.querySelector('.avatar-preview');
                    if (avatarPreview) {
                        avatarPreview.style.backgroundImage = `url(${e.target.result})`;
                        avatarPreview.style.backgroundSize = 'cover';
                        avatarPreview.style.backgroundPosition = 'center';
                        avatarPreview.innerHTML = ''; // Remove initial letter
                    }
                };
                reader.readAsDataURL(e.target.files[0]);
                showNotification('Avatar updated successfully!', 'success');
            }
        });
    }
    
    // Theme change handler
    const themeSelect = document.querySelector('#system select');
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            showNotification(`Theme changed to ${this.value}`, 'info');
        });
    }
}

// Save functionality
function initializeSaveFunctionality() {
    const saveButton = document.querySelector('.btn-primary');
    const resetButton = document.querySelectorAll('.btn-primary')[1];
    
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // Simulate save operation
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-save"></i> Save Changes';
                this.disabled = false;
                showNotification('Settings saved successfully!', 'success');
            }, 1500);
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all settings to default?')) {
                // Reset form logic would go here
                showNotification('Settings reset to default values', 'info');
            }
        });
    }
}

// Password strength indicator
function initializePasswordStrength() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                const strength = calculatePasswordStrength(this.value);
                let strengthElement = this.parentNode.querySelector('.password-strength');
                
                if (!strengthElement) {
                    strengthElement = document.createElement('div');
                    strengthElement.className = 'password-strength';
                    this.parentNode.appendChild(strengthElement);
                }
                
                strengthElement.textContent = `Strength: ${strength.level}`;
                strengthElement.className = `password-strength ${strength.class}`;
            } else {
                const strengthElement = this.parentNode.querySelector('.password-strength');
                if (strengthElement) {
                    strengthElement.remove();
                }
            }
        });
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Complexity checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    if (score <= 2) return { level: 'Weak', class: 'weak' };
    if (score <= 4) return { level: 'Medium', class: 'medium' };
    return { level: 'Strong', class: 'strong' };
}

// Sidebar toggle functionality (reuse from main system)
function initializeSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const pageContainer = document.querySelector('.page-container');
    
    if (sidebarToggle && sidebar && pageContainer) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            pageContainer.classList.toggle('sidebar-collapsed');
            
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

// Notification system (reuse from main system)
function showNotification(message, type = 'info') {
    // Use your existing notification system
    if (window.EventManagementSystem && window.EventManagementSystem.showNotification) {
        window.EventManagementSystem.showNotification(message, type);
        return;
    }
    
    // Fallback notification
    console.log(`${type}: ${message}`);
    alert(message);
}

// Logout functionality
function initializeLogout() {
    const logoutButton = document.querySelector('.nav-item.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to log out?')) {
                // Simulate logout
                showNotification('Logging out...', 'info');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }
        });
    }
}

// Initialize logout when DOM is ready
document.addEventListener('DOMContentLoaded', initializeLogout);

// Export functions for global access
window.SettingsManager = {
    initializeSettingsPage,
    showNotification,
    calculatePasswordStrength
};



console.log('🎉 Event Management System loaded successfully!');