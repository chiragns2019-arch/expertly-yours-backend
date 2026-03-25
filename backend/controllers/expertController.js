const pool = require('../config/db');
const { randomUUID: uuidv4 } = require('crypto');

// @desc    Discover experts
// @route   GET /api/experts/discover
// @access  Public
const discoverExperts = async (req, res, next) => {
  try {
    const { expertise } = req.query;

    let query = `
      SELECT e.*, u.name, u.avatar 
      FROM ExpertProfile e
      JOIN User u ON e.userId = u.id
      WHERE e.status = 'APPROVED'
    `;
    const params = [];

    if (expertise) {
      query += ` AND e.expertise LIKE ?`;
      params.push('%' + expertise + '%');
    }

    query += ` ORDER BY e.usefulnessScore DESC`;

    const [rows] = await pool.query(query, params);

    const experts = rows.map(row => {
      const { name, avatar, ...rest } = row;
      // Convert allowsDirectBooking back to boolean if it comes back as tinyint
      rest.allowsDirectBooking = !!rest.allowsDirectBooking;
      return {
        ...rest,
        user: { name, avatar }
      };
    });

    res.json(experts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get expert profile by ID
// @route   GET /api/experts/:id
// @access  Public
const getExpertProfile = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, u.name, u.avatar, u.email, u.createdAt AS userCreatedAt
      FROM ExpertProfile e
      JOIN User u ON e.userId = u.id
      WHERE e.id = ?
    `, [req.params.id]);

    const expertRaw = rows[0];

    if (expertRaw) {
      const { name, avatar, email, userCreatedAt, ...rest } = expertRaw;
      rest.allowsDirectBooking = !!rest.allowsDirectBooking;
      rest.user = {
        name,
        avatar,
        email,
        createdAt: userCreatedAt
      };
      res.json(rest);
    } else {
      res.status(404);
      throw new Error('Expert not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Submit expert profile for approval
// @route   POST /api/experts/submit
// @access  Private
const submitExpertProfile = async (req, res, next) => {
  try {
    const { 
      displayName, bio, primaryExpertise, yearsExperience, 
      linkedinUrl, websiteUrl, hourlyRate, allowsDirectBooking, company, skills 
    } = req.body;

    const [existing] = await pool.query('SELECT id FROM ExpertProfile WHERE userId = ?', [req.user.id]);

    const skillsJson = JSON.stringify(skills || []);
    const isDirect = allowsDirectBooking ? 1 : 0;
    const hr = parseInt(hourlyRate) || 0;
    const now = new Date();

    if (existing.length > 0) {
      // Update
      await pool.query(`
        UPDATE ExpertProfile SET 
          title = ?, bio = ?, expertise = ?, yearsExperience = ?, company = ?,
          skills = ?, linkedinUrl = ?, websiteUrl = ?, hourlyRate = ?,
          allowsDirectBooking = ?, status = 'PENDING_APPROVAL', updatedAt = ?
        WHERE userId = ?
      `, [
        displayName, bio, primaryExpertise, yearsExperience, company || '',
        skillsJson, linkedinUrl, websiteUrl, hr, isDirect, now, req.user.id
      ]);
    } else {
      // Create
      await pool.query(`
        INSERT INTO ExpertProfile (
          id, userId, title, bio, expertise, yearsExperience, company,
          skills, linkedinUrl, websiteUrl, hourlyRate, allowsDirectBooking, status, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_APPROVAL', ?, ?)
      `, [
        uuidv4(), req.user.id, displayName, bio, primaryExpertise, yearsExperience, company || '',
        skillsJson, linkedinUrl, websiteUrl, hr, isDirect, now, now
      ]);
    }

    const [updatedRows] = await pool.query('SELECT * FROM ExpertProfile WHERE userId = ?', [req.user.id]);
    
    if (updatedRows[0]) {
       updatedRows[0].allowsDirectBooking = !!updatedRows[0].allowsDirectBooking;
    }

    res.json(updatedRows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  discoverExperts,
  getExpertProfile,
  submitExpertProfile,
};
