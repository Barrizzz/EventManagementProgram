// Attendees page - Modal functionality only
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Attendees page loaded');
    
    // Get all view details buttons
    const viewButtons = document.querySelectorAll('.view-details-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const attendeeId = this.getAttribute('data-attendee-id');
            const row = this.closest('tr');
            
            // Extract attendee information from the table row
            const nameElement = row.querySelector('td:first-child div > div:last-child > div:first-child');
            const emailElement = row.querySelector('td:first-child div > div:last-child > div:last-child');
            const eventsAttended = row.querySelector('td:nth-child(3)').textContent;
            const phone = row.querySelector('td:nth-child(5)').textContent;
            
            // Create modal
            showAttendeeModal(
                nameElement.textContent,
                emailElement.textContent,
                eventsAttended,
                phone
            );
        });
    });
});

function showAttendeeModal(name, email, eventsAttended, phone) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #1E293B;">Attendee Details</h2>
                <button class="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #64748B;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 10px 0; color: #1E293B;">${name}</h3>
                    <p style="margin: 5px 0; color: #64748B;"><i class="fas fa-envelope"></i> ${email}</p>
                    <p style="margin: 5px 0; color: #64748B;"><i class="fas fa-phone"></i> ${phone}</p>
                </div>
                <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
                    <div style="background: #F8FAFC; padding: 15px; border-radius: 8px;">
                        <div style="font-size: 0.875rem; color: #64748B;">Events Attended</div>
                        <div style="font-size: 1.5rem; font-weight: 600; color: #1E293B;">${eventsAttended}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(modal);
    
    // Close modal when clicking X or outside
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.remove();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}
