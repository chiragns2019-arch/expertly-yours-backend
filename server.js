const { execSync } = require("child_process");

try {
  execSync("npx prisma generate");
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
app.use(cors());
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

// Catch-all route to serve the frontend index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
