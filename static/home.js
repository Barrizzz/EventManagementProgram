// Home page specific JavaScript
// Note: initializePageSpecificCharts is now handled in common.js// Home page charts
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