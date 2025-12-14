// Settings Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsPage();
    initializeSidebarToggle();
    initializeDeleteAccount();
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

// Save functionality - Removed to allow form natural submission
function initializeSaveFunctionality() {
    // Profile form submits naturally via POST to backend
    // No need to intercept the submission
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

// Delete account functionality
function initializeDeleteAccount() {
    const deleteBtn = document.getElementById('deleteAccountBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            const confirmDelete = confirm(
                'Are you absolutely sure you want to delete your account?\n\n' +
                'This action cannot be undone. All your data will be permanently deleted.'
            );
            
            if (confirmDelete) {
                const doubleConfirm = confirm(
                    'This is your last chance!\n\n' +
                    'Click OK to permanently delete your account, or Cancel to keep it.'
                );
                
                if (doubleConfirm) {
                    // Submit delete form
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = 'delete-account/';
                    
                    // Add CSRF token
                    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
                    const csrfInput = document.createElement('input');
                    csrfInput.type = 'hidden';
                    csrfInput.name = 'csrfmiddlewaretoken';
                    csrfInput.value = csrfToken;
                    form.appendChild(csrfInput);
                    
                    document.body.appendChild(form);
                    form.submit();
                }
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

console.log('🎉 Settings page loaded successfully!');