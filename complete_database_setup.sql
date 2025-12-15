-- =====================================================
-- COMPLETE EVENT MANAGEMENT DATABASE SETUP
-- This script creates and populates the entire database
-- Run this in MySQL Workbench
-- =====================================================
USE ems_db;

-- =====================================================
-- DATA INSERTION
-- =====================================================

-- 1. Insert Event Categories
INSERT INTO eventCategory (categoryID, category) VALUES
(1, 'Conference'),
(2, 'Workshop'),
(3, 'Seminar'),
(4, 'Networking'),
(5, 'Training');

-- 2. Insert Organizers
INSERT INTO organizer (organizerID, name, email, contactNum, website) VALUES
(1, 'John Smith', 'john.smith@example.com', '+1-555-0101', 'www.johnsmith.com'),
(2, 'Sarah Johnson', 'sarah.johnson@example.com', '+1-555-0102', 'www.sarahjohnson.com'),
(3, 'Tech Events Inc', 'info@techevents.com', '+1-555-0103', 'www.techevents.com'),
(4, 'Global Learning', 'contact@globallearning.com', '+1-555-0104', 'www.globallearning.com');

-- 3. Insert Venues
INSERT INTO venue (venueID, name, address, city, capacity) VALUES
(1, 'Main Conference Hall', '123 Business St, Suite 100', 'New York', 500),
(2, 'Training Room A', '123 Business St, Room 201', 'New York', 50),
(3, 'Grand Ballroom', '456 Event Plaza', 'Los Angeles', 1000),
(4, 'Innovation Center', '789 Tech Drive', 'San Francisco', 200);

-- 4. Insert Event DateTimes
INSERT INTO eventDateTime (eventDateTimeID, date, startTime, endTime) VALUES
(1, '2025-01-15', '09:00:00', '17:00:00'),
(2, '2025-01-20', '14:00:00', '18:00:00'),
(3, '2025-02-05', '10:00:00', '16:00:00'),
(4, '2025-03-10', '09:00:00', '15:00:00'),
(5, '2025-04-15', '13:00:00', '17:00:00'),
(6, '2026-1-20', '13:00:00', '17:00:00');

-- 5. Insert Events
INSERT INTO event (eventID, name, description, rundown, materials, category_id, datetime_id, organizer_id, venue_id) VALUES
(1, 'Tech Summit 2025', 
    'Annual technology conference featuring industry leaders and innovative solutions', 
    '09:00 - Registration and Networking\n10:00 - Keynote Speech\n12:00 - Lunch Break\n13:00 - Panel Discussions\n16:00 - Closing Remarks', 
    'Laptop, Notebook, Pen, Conference Badge', 
    1, 1, 1, 1),
    
(2, 'Python Workshop', 
    'Hands-on workshop covering Python programming basics and advanced concepts', 
    '14:00 - Introduction to Python\n15:00 - Data Structures\n16:00 - Functions and Modules\n17:00 - Q&A Session', 
    'Laptop with Python installed, USB drive', 
    2, 2, 2, 2),
    
(3, 'Business Leadership Seminar',
    'Learn essential leadership skills for modern business environment',
    '10:00 - Opening and Introductions\n11:00 - Leadership Fundamentals\n13:00 - Case Studies\n15:00 - Interactive Workshop',
    'Notepad, Pen, Business cards',
    3, 3, 3, 3),
    
(4, 'AI & Machine Learning Conference',
    'Explore the latest developments in artificial intelligence and machine learning',
    '09:00 - Registration\n10:00 - AI Overview\n12:00 - Lunch\n13:00 - ML Workshops\n14:30 - Panel Discussion',
    'Laptop, Conference materials provided',
    1, 4, 4, 4),
    
(5, 'Game Dev Conference',
	'Explore game development',
     '09:00 - Registration\n10:00 - Game Dev Overview\n12:00 - Lunch\n13:00 - Game Dev Workshops\n14:30 - Panel Discussion',
     '',
     2, 6, 4, 4); 

-- 6. Insert Ticket Types
INSERT INTO ticketType (ticketTypeID, type, zone, price) VALUES
(1, 'VIP', 'A', 150.00),
(2, 'Premium', 'B', 100.00),
(3, 'General Admission', 'C', 50.00),
(4, 'Student', 'C', 25.00),
(5, 'Early Bird', 'B', 75.00);

-- 7. Insert Customers (10 sample customers)
-- Note: Passwords are hashed using Django's default hasher (not plain text)
INSERT INTO customer (customerID, password, last_login, fName, lName, email, phoneNum, is_staff) VALUES
(1, 'pbkdf2_sha256$600000$sample1$hash', '2025-01-10 10:00:00', 'Alice', 'Anderson', 'alice.anderson@email.com', '+1-555-1001', 0),
(2, 'pbkdf2_sha256$600000$sample2$hash', '2025-01-11 14:30:00', 'Bob', 'Brown', 'bob.brown@email.com', '+1-555-1002', 0),
(3, 'pbkdf2_sha256$600000$sample3$hash', '2025-01-12 09:15:00', 'Carol', 'Clark', 'carol.clark@email.com', '+1-555-1003', 0),
(4, 'pbkdf2_sha256$600000$sample4$hash', '2025-01-12 16:45:00', 'David', 'Davis', 'david.davis@email.com', '+1-555-1004', 0),
(5, 'pbkdf2_sha256$600000$sample5$hash', '2025-01-13 11:20:00', 'Emma', 'Evans', 'emma.evans@email.com', '+1-555-1005', 0),
(6, 'pbkdf2_sha256$600000$sample6$hash', '2025-01-13 13:50:00', 'Frank', 'Foster', 'frank.foster@email.com', '+1-555-1006', 0),
(7, 'pbkdf2_sha256$600000$sample7$hash', '2025-01-14 08:30:00', 'Grace', 'Garcia', 'grace.garcia@email.com', '+1-555-1007', 0),
(8, 'pbkdf2_sha256$600000$sample8$hash', '2025-01-14 15:10:00', 'Henry', 'Harris', 'henry.harris@email.com', '+1-555-1008', 0),
(9, 'pbkdf2_sha256$600000$sample9$hash', '2025-01-15 10:40:00', 'Isabel', 'Ivanov', 'isabel.ivanov@email.com', '+1-555-1009', 0),
(10, 'pbkdf2_sha256$600000$sample10$hash', '2025-01-15 12:25:00', 'Jack', 'Jackson', 'jack.jackson@email.com', '+1-555-1010', 0),
(11, 'pbkdf2_sha256$600000$admin$hash', '2025-01-16 09:00:00', 'Admin', 'User', 'admin@ems.com', '+1-555-9999', 1);

-- 8. Insert Tickets for Event 1 (Tech Summit 2025)
INSERT INTO ticket (ticketID, rowNum, seatNum, purchaseDateTime, status, event_id, ticket_type_id) VALUES
-- VIP tickets
(1, 1, 5, '2025-01-10 14:30:00', 'sold', 1, 1),
(2, 1, 6, '2025-01-10 14:35:00', 'sold', 1, 1),
(3, 2, 3, '2025-01-11 09:15:00', 'sold', 1, 1),
-- Premium tickets
(4, 3, 8, '2025-01-11 10:20:00', 'sold', 1, 2),
(5, 3, 9, '2025-01-11 10:22:00', 'sold', 1, 2),
(6, 4, 12, '2025-01-12 16:45:00', 'sold', 1, 2),
-- General Admission tickets
(7, 10, 5, '2025-01-12 11:30:00', 'sold', 1, 3),
(8, 10, 6, '2025-01-12 11:35:00', 'sold', 1, 3),
(9, 11, 8, '2025-01-13 08:20:00', 'sold', 1, 3),
(10, 12, 10, '2025-01-13 14:50:00', 'reserved', 1, 3);

-- 9. Insert Tickets for Event 2 (Python Workshop)
INSERT INTO ticket (ticketID, rowNum, seatNum, purchaseDateTime, status, event_id, ticket_type_id) VALUES
-- Premium tickets
(11, 1, 1, '2025-01-15 10:00:00', 'sold', 2, 2),
(12, 1, 2, '2025-01-15 10:05:00', 'sold', 2, 2),
-- Student tickets
(13, 3, 5, '2025-01-16 09:30:00', 'sold', 2, 4),
(14, 3, 6, '2025-01-16 09:32:00', 'sold', 2, 4),
(15, 4, 8, '2025-01-17 13:15:00', 'sold', 2, 4),
-- General Admission
(16, 5, 10, '2025-01-17 15:20:00', 'sold', 2, 3),
(17, 5, 11, '2025-01-17 15:25:00', 'reserved', 2, 3);

-- 10. Insert Tickets for Event 3 (Business Leadership Seminar)
INSERT INTO ticket (ticketID, rowNum, seatNum, purchaseDateTime, status, event_id, ticket_type_id) VALUES
(18, 1, 1, '2025-02-01 10:00:00', 'sold', 3, 1),
(19, 1, 2, '2025-02-01 10:15:00', 'sold', 3, 2),
(20, 2, 5, '2025-02-02 14:30:00', 'sold', 3, 3);

-- 11. Insert EventCustomer records (links customers to events via tickets)
INSERT INTO eventCustomer (event_id, customer_id, ticket_id) VALUES
-- Event 1 (Tech Summit 2025)
(1, 1, 1),   -- Alice bought VIP ticket
(1, 2, 2),   -- Bob bought VIP ticket
(1, 3, 3),   -- Carol bought VIP ticket
(1, 4, 4),   -- David bought Premium ticket
(1, 5, 5),   -- Emma bought Premium ticket
(1, 6, 6),   -- Frank bought Premium ticket
(1, 7, 7),   -- Grace bought General Admission
(1, 8, 8),   -- Henry bought General Admission
(1, 9, 9),   -- Isabel bought General Admission
(1, 10, 10), -- Jack reserved General Admission

-- Event 2 (Python Workshop)
(2, 1, 11),  -- Alice bought Premium ticket
(2, 2, 12),  -- Bob bought Premium ticket
(2, 3, 13),  -- Carol bought Student ticket
(2, 4, 14),  -- David bought Student ticket
(2, 5, 15),  -- Emma bought Student ticket
(2, 6, 16),  -- Frank bought General Admission
(2, 7, 17),  -- Grace reserved General Admission

-- Event 3 (Business Leadership Seminar)
(3, 1, 18),  -- Alice bought VIP ticket
(3, 2, 19),  -- Bob bought Premium ticket
(3, 3, 20);  -- Carol bought General Admission

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- 1. Check all tables have data
SELECT 'eventCategory' AS table_name, COUNT(*) AS row_count FROM eventCategory
UNION ALL
SELECT 'eventDateTime', COUNT(*) FROM eventDateTime
UNION ALL
SELECT 'venue', COUNT(*) FROM venue
UNION ALL
SELECT 'organizer', COUNT(*) FROM organizer
UNION ALL
SELECT 'ticketType', COUNT(*) FROM ticketType
UNION ALL
SELECT 'customer', COUNT(*) FROM customer
UNION ALL
SELECT 'event', COUNT(*) FROM event
UNION ALL
SELECT 'ticket', COUNT(*) FROM ticket
UNION ALL
SELECT 'eventCustomer', COUNT(*) FROM eventCustomer;

-- 2. View all events with complete information
SELECT 
    e.eventID,
    e.name AS event_name,
    e.description,
    ec.category AS category,
    edt.date AS event_date,
    edt.startTime,
    edt.endTime,
    v.name AS venue_name,
    v.city AS venue_city,
    v.capacity AS venue_capacity,
    o.name AS organizer_name,
    o.email AS organizer_email
FROM event e
LEFT JOIN eventCategory ec ON e.category_id = ec.categoryID
JOIN eventDateTime edt ON e.datetime_id = edt.eventDateTimeID
JOIN venue v ON e.venue_id = v.venueID
JOIN organizer o ON e.organizer_id = o.organizerID
ORDER BY edt.date, edt.startTime;

-- 3. Check venue capacity vs tickets sold
SELECT 
    e.eventID,
    e.name AS event_name,
    v.name AS venue_name,
    v.capacity AS venue_capacity,
    COUNT(t.ticketID) AS tickets_issued,
    (v.capacity - COUNT(t.ticketID)) AS remaining_capacity,
    CONCAT(ROUND((COUNT(t.ticketID) / v.capacity * 100), 2), '%') AS capacity_filled
FROM event e
JOIN venue v ON e.venue_id = v.venueID
LEFT JOIN ticket t ON e.eventID = t.event_id AND t.status != 'cancelled'
GROUP BY e.eventID, e.name, v.name, v.capacity
ORDER BY e.eventID;

-- 4. View customer registrations
SELECT 
    c.customerID,
    CONCAT(c.fName, ' ', c.lName) AS customer_name,
    c.email,
    e.name AS event_name,
    tt.type AS ticket_type,
    tt.zone,
    tt.price,
    t.rowNum,
    t.seatNum,
    t.status AS ticket_status,
    t.purchaseDateTime
FROM eventCustomer ec
JOIN customer c ON ec.customer_id = c.customerID
JOIN event e ON ec.event_id = e.eventID
JOIN ticket t ON ec.ticket_id = t.ticketID
JOIN ticketType tt ON t.ticket_type_id = tt.ticketTypeID
ORDER BY c.customerID, e.eventID;

-- 5. Calculate revenue per event
SELECT 
    e.eventID,
    e.name AS event_name,
    COUNT(CASE WHEN t.status = 'sold' THEN 1 END) AS tickets_sold,
    COUNT(CASE WHEN t.status = 'reserved' THEN 1 END) AS tickets_reserved,
    SUM(CASE WHEN t.status = 'sold' THEN tt.price ELSE 0 END) AS total_revenue
FROM event e
LEFT JOIN ticket t ON e.eventID = t.event_id
LEFT JOIN ticketType tt ON t.ticket_type_id = tt.ticketTypeID
GROUP BY e.eventID, e.name
ORDER BY total_revenue DESC;

-- 6. Show ticket distribution by type
SELECT 
    e.name AS event_name,
    tt.type AS ticket_type,
    tt.zone,
    tt.price,
    COUNT(t.ticketID) AS tickets_issued
FROM event e
LEFT JOIN ticket t ON e.eventID = t.event_id
LEFT JOIN ticketType tt ON t.ticket_type_id = tt.ticketTypeID
GROUP BY e.name, tt.type, tt.zone, tt.price
ORDER BY e.name, tt.price DESC;

-- =====================================================
-- DATABASE SETUP COMPLETE
-- =====================================================

SELECT '✅ Database setup complete!' AS status,
       'ems_db' AS database_name,
       'All tables created and populated with sample data' AS message;
