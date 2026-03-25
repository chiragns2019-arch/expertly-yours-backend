require('dotenv').config();
const { randomUUID: uuidv4 } = require('crypto');
const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Password for seeded users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create a Seeker User
    const seekerId = uuidv4();
    await pool.query(
      `INSERT INTO User (id, name, email, password, avatar, provider, role, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [seekerId, 'Alice Seeker', 'alice@example.com', hashedPassword, null, 'email', 'SEEKER', new Date()]
    );
    console.log("Seeded seeker user: alice@example.com / password123");

    // 2. Create an Expert User and Profile
    const expertUserId = uuidv4();
    await pool.query(
      `INSERT INTO User (id, name, email, password, avatar, provider, role, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [expertUserId, 'Dr. Bob Expert', 'bob@example.com', hashedPassword, null, 'email', 'EXPERT', new Date()]
    );
    
    const expertProfileId = uuidv4();
    await pool.query(
      `INSERT INTO ExpertProfile (id, userId, title, bio, expertise, yearsExperience, skills, company, status, hourlyRate, usefulnessScore, requirementsReceived, approvedDate, allowsDirectBooking, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        expertProfileId, expertUserId, 'Senior Software Architect', 'I build scalable systems.', 'Engineering', '10+', 
        JSON.stringify(['Node.js', 'React', 'System Design']), 'TechCorp', 'APPROVED', 150, 4, 12, new Date(), true, new Date(), new Date()
      ]
    );
    console.log("Seeded expert user: bob@example.com / password123");

    // 3. Create a Requirement (from Seeker)
    const reqId = uuidv4();
    await pool.query(
      `INSERT INTO Requirement (id, title, seekerId, companyName, companyStage, problemDescription, category, timeCommitment, offerType, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reqId, 'Need help scaling Node.js backend', seekerId, 'StartupX', 'Seed', 
        'Our database queries are too slow under load. We need advice on caching.', 
        'Engineering', '2 hours/week', 'Paid', 'open', new Date()
      ]
    );
    console.log("Seeded requirement.");

    // 4. Create a RequirementRecipient (suggesting the expert)
    const reqRecipId = uuidv4();
    await pool.query(
      `INSERT INTO RequirementRecipient (id, requirementId, expertId, status, createdAt)
       VALUES (?, ?, ?, ?, ?)`,
      [reqRecipId, reqId, expertProfileId, 'pending', new Date()]
    );

    // 5. Add some open slots for the expert
    const slotId1 = uuidv4();
    const slotId2 = uuidv4();
    
    // Calculate a date a few days from now
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 3);
    const dateStr = nextWeek.toISOString().split('T')[0];

    await pool.query(
      `INSERT INTO Slot (id, expertId, requirementId, date, time, timezone, isBooked, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slotId1, expertProfileId, null, dateStr, '10:00 AM', 'UTC', false, new Date(),
        slotId2, expertProfileId, null, dateStr, '02:00 PM', 'UTC', false, new Date()
      ]
    );
    console.log("Seeded available slots.");

    console.log("✅ Seeding completed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
