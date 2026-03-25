-- Seed SQL Script for expertlyyours database
-- This inserts a Seeker, an Expert, an Expert Profile, a Requirement, and some Meeting Slots.
-- The password for both users is: password123

-- 1. Insert a Seeker
INSERT INTO User (id, name, email, password, provider, role, createdAt)
VALUES (
    '31ff6f2c-7748-4946-8a6a-219bfec30eca', 
    'Alice Seeker', 
    'alice@example.com', 
    '$2a$10$epx/gWkF7L4S0G22I95SDeX6r92rBYr.7.0q/4Z3oG7OqYh1O07dK', -- Hash for 'password123'
    'email', 
    'SEEKER', 
    NOW()
);

-- 2. Insert an Expert
INSERT INTO User (id, name, email, password, provider, role, createdAt)
VALUES (
    '42ff6f2c-7748-4946-8a6a-219bfec30ecb', 
    'Dr. Bob Expert', 
    'bob@example.com', 
    '$2a$10$epx/gWkF7L4S0G22I95SDeX6r92rBYr.7.0q/4Z3oG7OqYh1O07dK', -- Hash for 'password123'
    'email', 
    'EXPERT', 
    NOW()
);

-- 3. Insert an Expert Profile for Dr. Bob
INSERT INTO ExpertProfile (
    id, userId, title, bio, expertise, yearsExperience, skills, 
    company, status, hourlyRate, usefulnessScore, requirementsReceived, 
    approvedDate, allowsDirectBooking, createdAt, updatedAt
) VALUES (
    '53ff6f2c-7748-4946-8a6a-219bfec30ecc',
    '42ff6f2c-7748-4946-8a6a-219bfec30ecb',
    'Senior Software Architect',
    'I build scalable systems and specialize in high-traffic applications.',
    'Engineering',
    '10+',
    '["Node.js", "React", "System Design", "AWS"]',
    'TechCorp',
    'APPROVED',
    150,
    4.0,
    12,
    NOW(),
    TRUE,
    NOW(),
    NOW()
);

-- 4. Insert a Requirement from Alice
INSERT INTO Requirement (
    id, title, seekerId, companyName, companyStage, problemDescription, 
    category, timeCommitment, offerType, status, createdAt
) VALUES (
    '64ff6f2c-7748-4946-8a6a-219bfec30ecd',
    'Need help scaling Node.js backend',
    '31ff6f2c-7748-4946-8a6a-219bfec30eca',
    'StartupX',
    'Seed',
    'Our database queries are too slow under load. We need advice on caching strategy.',
    'Engineering',
    '2 hours/week',
    'Paid',
    'open',
    NOW()
);

-- 5. Suggest the Expert for the Requirement
INSERT INTO RequirementRecipient (id, requirementId, expertId, status, createdAt)
VALUES (
    '75ff6f2c-7748-4946-8a6a-219bfec30ece',
    '64ff6f2c-7748-4946-8a6a-219bfec30ecd',
    '53ff6f2c-7748-4946-8a6a-219bfec30ecc',
    'pending',
    NOW()
);

-- 6. Insert open calendar slots for the Expert
INSERT INTO Slot (id, expertId, date, time, timezone, isBooked, createdAt)
VALUES 
    ('86ff6f2c-7748-4946-8a6a-219bfec30ecf', '53ff6f2c-7748-4946-8a6a-219bfec30ecc', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00 AM', 'UTC', FALSE, NOW()),
    ('97ff6f2c-7748-4946-8a6a-219bfec30ed0', '53ff6f2c-7748-4946-8a6a-219bfec30ecc', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '02:00 PM', 'UTC', FALSE, NOW()),
    ('a8ff6f2c-7748-4946-8a6a-219bfec30ed1', '53ff6f2c-7748-4946-8a6a-219bfec30ecc', DATE_ADD(CURDATE(), INTERVAL 4 DAY), '11:00 AM', 'UTC', FALSE, NOW());
