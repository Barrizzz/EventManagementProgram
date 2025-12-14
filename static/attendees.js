// Attendees page specific JavaScript
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
        // TODO: Fetch subscription data from database API
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Subscribed', 'Non-Subscribed'],
                datasets: [{
                    data: [0, 0], // Will be populated from database
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
        // TODO: Fetch top attendees data from database API
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [], // Will be populated from database
                datasets: [{
                    label: 'Events Attended',
                    data: [], // Will be populated from database
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
        // TODO: Fetch new attendees trend data from database API
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Attendees',
                    data: [0, 0, 0, 0, 0, 0], // Will be populated from database
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