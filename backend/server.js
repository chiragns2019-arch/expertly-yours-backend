const { execSync } = require("child_process");

try {
  // execSync("npx prisma generate"); // Prisma is being removed
} catch (e) {
  console.log("Prisma skipped");
}
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { errorHandler } = require('./middleware/errorMiddleware');
const passport = require('passport');
require('./config/passport'); // Initialize passport config

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: false,
}));
app.use(express.json());
app.use(passport.initialize());

// Serve the built frontend files
app.use(express.static(path.join(__dirname, "dist")));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/experts', require('./routes/expertRoutes'));
app.use('/api/bookmarks', require('./routes/bookmarkRoutes'));
app.use('/api/requirements', require('./routes/requirementRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/conversation', require('./routes/conversationRoutes'));
app.use('/api/conversations', require('./routes/conversationsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));

// Catch-all route to serve the frontend index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Test DB Connection Before App Starts
const pool = require('./config/db');

async function startServer() {
  try {
    await pool.getConnection(); // Tests pool connection
    console.log("Database connected successfully 🟢");

    // Ensure Admin User Exists
    const adminEmail = "admin@expertlyyours.com";
    const [admins] = await pool.query('SELECT * FROM User WHERE email = ?', [adminEmail]);
    const existingAdmin = admins[0];

    if (!existingAdmin) {
      console.log("Initializing default Admin account...");
      const bcrypt = require('bcrypt');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      const { randomUUID: uuidv4 } = require('crypto');
      
      await pool.query(
        'INSERT INTO User (id, name, email, password, role, provider, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), "System Admin", adminEmail, hashedPassword, "ADMIN", "email", new Date()]
      );
      console.log("Default Admin created: admin@expertlyyours.com / admin123");
    } else if (existingAdmin.role !== "ADMIN") {
      // Force role if somehow degraded
      await pool.query('UPDATE User SET role = ? WHERE email = ?', ["ADMIN", adminEmail]);
      console.log("Forced admin@expertlyyours.com role to ADMIN");
    }
  } catch (err) {
    console.error("CRITICAL ERROR: Database connection failed 🔴");
    console.error(err.message);
    console.error("Please ensure MySQL is running and credentials are correct in .env");
    // process.exit(1); 
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
