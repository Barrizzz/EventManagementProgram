// Reports page specific JavaScript
let reportsData = null;

// Initialize reports page
function initializeReportsPage() {
    console.log('📊 Initializing reports page...');
    loadReportsData();
    setupReportsEventListeners();
}

// Load reports data from backend
async function loadReportsData() {
    try {
        const response = await fetch('/events/api/reports-data/');
        const data = await response.json();
        
        if (data.success) {
            reportsData = data;
            
            // Update summary cards
            updateSummaryCards(data.summary);
            
            // Initialize charts with data
            initializeReportsCharts(data);
        } else {
            console.error('Failed to load reports data:', data.error);
            showError('Failed to load reports data');
        }
    } catch (error) {
        console.error('Error loading reports data:', error);
        showError('Error loading reports data');
    }
}

// Update summary cards
function updateSummaryCards(summary) {
    const cards = document.querySelectorAll('.summary-card');
    if (cards.length >= 4) {
        // Total Events
        cards[0].querySelector('.summary-value').textContent = summary.total_events;
        
        // Total Attendees
        cards[1].querySelector('.summary-value').textContent = summary.total_attendees;
        
        // Average Event Size
        cards[2].querySelector('.summary-value').textContent = summary.avg_event_size;
        
        // Total Revenue
        cards[3].querySelector('.summary-value').textContent = `$${summary.total_revenue.toFixed(2)}`;
    }
}

// Initialize all charts with data
function initializeReportsCharts(data) {
    console.log('📊 Initializing reports charts...');

    // Debug chart containers first
    debugChartContainers();

    // Main charts
    createEventsAttendanceChart(data.monthly_timeline);
    createRevenueAnalysisChart(data.monthly_timeline);

    // Side charts - with delay to ensure DOM is ready
    setTimeout(() => {
        createEventDistributionChart(data.events_by_category);
        createAttendanceRateChart(data.all_events);
        createTopEventsChart(data.top_events);

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
function createEventsAttendanceChart(monthlyData) {
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
        const labels = monthlyData.map(d => d.month);
        const eventsData = monthlyData.map(d => d.events);
        const attendeesData = monthlyData.map(d => d.attendees);
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Events',
                        data: eventsData,
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
                        data: attendeesData,
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
function createRevenueAnalysisChart(monthlyData) {
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
        const labels = monthlyData.map(d => d.month);
        const revenueData = monthlyData.map(d => d.revenue);
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue ($)',
                    data: revenueData,
                    backgroundColor: '#8B5CF6',
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
function createEventDistributionChart(eventsByCategory) {
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
        const labels = Object.keys(eventsByCategory);
        const data = Object.values(eventsByCategory);
        const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#6B7280', '#3B82F6', '#EF4444'];
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
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
function createAttendanceRateChart(eventsData) {
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
        // Calculate overall attendance statistics
        const totalEvents = eventsData.length;
        const highAttendance = eventsData.filter(e => e.attendance_rate >= 70).length;
        const mediumAttendance = eventsData.filter(e => e.attendance_rate >= 40 && e.attendance_rate < 70).length;
        const lowAttendance = eventsData.filter(e => e.attendance_rate < 40).length;
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['High (70%+)', 'Medium (40-70%)', 'Low (<40%)'],
                datasets: [{
                    data: [highAttendance, mediumAttendance, lowAttendance],
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
function createTopEventsChart(topEvents) {
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
        const top5 = topEvents.slice(0, 5);
        const labels = top5.map(e => e.event_name.length > 15 ? e.event_name.substring(0, 15) + '...' : e.event_name);
        const attendances = top5.map(e => e.tickets_sold);
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Attendance',
                    data: attendances,
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
    loadReportsData(); // Reload data with new time period
}

// Update charts with filters
function updateChartsWithFilters() {
    loadReportsData(); // Reload data with filters applied
}

// Show error message
function showError(message) {
    console.error(message);
    // Could add a toast notification here
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the reports page
    if (document.querySelector('.summary-cards')) {
        initializeReportsPage();
    }
});

// Update charts with current filter values
function updateChartsWithFilters() {
    const eventType = document.querySelector('.filter-select')?.value || 'All';
    const eventStatus = document.querySelectorAll('.filter-select')[1]?.value || 'All';
    const ticketType = document.querySelectorAll('.filter-select')[2]?.value || 'All';
    const location = document.querySelectorAll('.filter-select')[3]?.value || 'All';

    console.log('Applying filters:', { eventType, eventStatus, ticketType, location });
    showNotification('Charts updated with filtered data', 'success');
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