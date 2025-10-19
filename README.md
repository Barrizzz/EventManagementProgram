# Visionary Events - Event Management System

A modern, responsive event management system dashboard built to match the exact Figma design specifications. This application provides a comprehensive interface for managing events, attendees, and analytics.

## Features

### 🎯 Core Functionality
- **Dashboard Overview**: Complete event management dashboard with real-time data
- **Event Management**: View ongoing and upcoming events with detailed information
- **Attendee Management**: Comprehensive attendee table with registration details
- **Analytics Dashboard**: Revenue trends, booking distribution, and attendance breakdown
- **Search Functionality**: Real-time search across events and attendees
- **Responsive Design**: Fully responsive layout that works on all devices

### 🎨 Design Features
- **Exact Figma Match**: Pixel-perfect implementation of the original design
- **Modern UI**: Clean, professional interface with smooth animations
- **Color System**: Consistent color palette with CSS variables
- **Typography**: Inter font family for optimal readability
- **Interactive Elements**: Hover effects, button states, and smooth transitions

### 📊 Analytics & Charts
- **Revenue Trends**: Interactive line chart showing monthly revenue
- **Booking Distribution**: Bar chart with time-based filtering (Today/Week/Month)
- **Attendance Breakdown**: Donut chart showing active vs inactive attendees
- **Real-time Stats**: Live statistics cards with key metrics

## File Structure

```
EventManagementProgram/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS styling with variables
├── script.js           # JavaScript functionality and interactions
└── README.md           # This documentation file
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required (uses CDN for external libraries)

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. The application will load with all functionality ready

### External Dependencies
The application uses these CDN resources:
- **Font Awesome**: For icons (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`)
- **Google Fonts**: Inter font family (`https://fonts.googleapis.com/css2?family=Inter`)
- **Chart.js**: For interactive charts (`https://cdn.jsdelivr.net/npm/chart.js`)

## Usage

### Navigation
- **Sidebar Navigation**: Click on menu items (Home, Events, Attendees, Reports, Settings, Log out)
- **Active States**: Current page is highlighted in purple
- **Mobile Menu**: Hamburger menu appears on mobile devices

### Search
- **Global Search**: Use the search bar to find events or attendees
- **Real-time Results**: Search results update as you type
- **Cross-section Search**: Searches across events, attendees, and other content

### Event Management
- **Ongoing Events**: View currently active events with "Live Now" status
- **Upcoming Events**: Browse future events with registration options
- **Event Actions**: 
  - Click "Live Now" to join active events
  - Click "Register Now" to register for events
  - Click "Book Now" to book event tickets
  - Click "Set Reminder" to set event reminders

### Attendee Management
- **Attendee Table**: View all registered attendees with detailed information
- **Status Tracking**: See registration status, ticket types, and check-in status
- **Actions**: Click "View Details" to see individual attendee information

### Analytics
- **Revenue Trends**: Monthly revenue chart with interactive hover details
- **Booking Distribution**: Time-based booking analysis with tab filtering
- **Attendance Breakdown**: Visual representation of active vs inactive attendees

## Customization

### CSS Variables
The application uses CSS custom properties for easy customization:

```css
:root {
    --primary-purple: #8B5CF6;
    --primary-pink: #EC4899;
    --primary-orange: #F97316;
    --background-white: #FFFFFF;
    --background-gray: #F8FAFC;
    /* ... more variables */
}
```

### Color Scheme
- **Primary Purple**: `#8B5CF6` - Main brand color
- **Primary Pink**: `#EC4899` - Accent color
- **Primary Orange**: `#F97316` - Highlight color
- **Success Green**: `#10B981` - Success states
- **Warning Orange**: `#F59E0B` - Warning states
- **Error Red**: `#EF4444` - Error states

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Font Sizes**: Responsive scale from 12px to 36px

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Performance Features

- **Optimized Loading**: Minimal external dependencies
- **Smooth Animations**: CSS transitions and transforms
- **Responsive Images**: Optimized for different screen sizes
- **Efficient Charts**: Chart.js for performant data visualization

## Interactive Features

### Notifications
- Success notifications for completed actions
- Real-time feedback for user interactions
- Auto-dismissing notifications with smooth animations

### Chart Interactions
- Hover effects on chart elements
- Tab-based filtering for booking distribution
- Responsive chart resizing

### Mobile Experience
- Touch-friendly interface
- Collapsible sidebar navigation
- Optimized table scrolling

## Development Notes

### Figma Integration
- All design elements match the original Figma specifications
- Node IDs preserved as data attributes for reference
- Exact color values, spacing, and typography implemented
- Responsive breakpoints match design requirements

### Code Organization
- **HTML**: Semantic structure with accessibility considerations
- **CSS**: Modular styling with CSS custom properties
- **JavaScript**: Event-driven architecture with clean separation of concerns

### Future Enhancements
- Backend integration for real data
- User authentication system
- Event creation and editing capabilities
- Advanced filtering and sorting options
- Export functionality for reports

## Support

For questions or issues with the application, please refer to the code comments or contact the development team.

---

**Built with ❤️ to match your Figma design exactly**
