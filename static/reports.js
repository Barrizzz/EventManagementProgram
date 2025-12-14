// Reports page specific JavaScript
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
        // TODO: Fetch events and attendance data from database API
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Events',
                        data: [0, 0, 0, 0, 0, 0, 0], // Will be populated from database
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
                        data: [0, 0, 0, 0, 0, 0, 0], // Will be populated from database
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
                    data: [0, 0, 0, 0, 0], // Will be populated from database
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
                    data: [0, 0, 0, 0], // Will be populated from database
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
                    data: [0, 0, 0], // Will be populated from database
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
                    data: [0, 0, 0, 0, 0], // Will be populated from database
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