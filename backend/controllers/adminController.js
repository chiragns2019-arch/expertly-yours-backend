const pool = require('../config/db');
const { randomUUID: uuidv4 } = require('crypto');
const sendEmailNotification = require('../utils/mailer');

// @desc    Get all expert applications
// @route   GET /api/admin/expert-applications
// @access  Private/Admin
const getExpertApplications = async (req, res, next) => {
  try {
    const [applications] = await pool.query(`
      SELECT e.*, u.name as userName, u.email as userEmail, u.avatar as userAvatar
      FROM ExpertProfile e
      JOIN User u ON e.userId = u.id
      ORDER BY e.updatedAt DESC
    `);

    const result = applications.map(a => {
      const { userName, userEmail, userAvatar, ...e } = a;
      e.allowsDirectBooking = !!e.allowsDirectBooking;
      e.user = { name: userName, email: userEmail, avatar: userAvatar };
      return e;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve expert application
// @route   POST /api/admin/expert-approve
// @access  Private/Admin
const approveExpert = async (req, res, next) => {
  try {
    const { expertId } = req.body;
    const now = new Date();

    await pool.query('UPDATE ExpertProfile SET status = "APPROVED", updatedAt = ? WHERE id = ?', [now, expertId]);

    const [experts] = await pool.query(`
      SELECT e.*, u.id as uId, u.email as uEmail, u.name as uName
      FROM ExpertProfile e JOIN User u ON e.userId = u.id
      WHERE e.id = ?
    `, [expertId]);
    
    const expert = experts[0];

    if (expert) {
      await pool.query('UPDATE User SET role = "EXPERT" WHERE id = ?', [expert.uId]);

      // Create In-App Notification
      try {
        await pool.query(
          'INSERT INTO Notification (id, userId, title, message, type, isRead, createdAt) VALUES (?, ?, ?, ?, ?, 0, ?)',
          [uuidv4(), expert.uId, 'Expert Profile Approved', 'Your profile is now live. Set up your availability to start receiving bookings.', 'EXPERT_APPROVED', now]
        );
        
        // Send Email Notification
        await sendEmailNotification(
          expert.uEmail, 
          'Profile Approved - ExpertlyYours', 
          '<p>Congratulations! Your profile has been approved and you are now live on the platform!</p>'
        );
      } catch(err) {
        console.log('Could not send expert approval notification/email', err);
      }
      
      const { uId, uEmail, uName, ...rest } = expert;
      rest.allowsDirectBooking = !!rest.allowsDirectBooking;
      rest.user = { id: uId, email: uEmail, name: uName };
      return res.json(rest);
    }

    res.json({ message: "Approved but expert missing" });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject expert application
// @route   POST /api/admin/expert-reject
// @access  Private/Admin
const rejectExpert = async (req, res, next) => {
  try {
    const { expertId, reason } = req.body;
    const now = new Date();

    await pool.query('UPDATE ExpertProfile SET status = "REJECTED", updatedAt = ? WHERE id = ?', [now, expertId]);
    
    const [experts] = await pool.query('SELECT * FROM ExpertProfile WHERE id = ?', [expertId]);
    res.json(experts[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [[pendingCount]] = await pool.query('SELECT COUNT(*) as c FROM ExpertProfile WHERE status = "PENDING_APPROVAL"');
    const [[approvedCount]] = await pool.query('SELECT COUNT(*) as c FROM ExpertProfile WHERE status = "APPROVED"');
    const [[rejectedCount]] = await pool.query('SELECT COUNT(*) as c FROM ExpertProfile WHERE status = "REJECTED"');
    const [[usersCount]] = await pool.query('SELECT COUNT(*) as c FROM User');
    const [[reqsCount]] = await pool.query('SELECT COUNT(*) as c FROM Requirement');

    const pendingExperts = pendingCount.c;
    const approvedExperts = approvedCount.c;
    const rejectedExperts = rejectedCount.c;
    const totalUsers = usersCount.c;
    const totalRequirements = reqsCount.c;

    const [recentRequirementsRecords] = await pool.query(`
      SELECT r.*, u.name as seekerName FROM Requirement r LEFT JOIN User u ON r.seekerId = u.id ORDER BY r.createdAt DESC LIMIT 5
    `);
    recentRequirementsRecords.forEach(r => { r.isDraft = !!r.isDraft; r.seeker = { name: r.seekerName }; });

    const [recentUsersRecords] = await pool.query(`
      SELECT id, name, email, createdAt, role FROM User ORDER BY createdAt DESC LIMIT 5
    `);

    const [recentApplications] = await pool.query(`
      SELECT e.*, u.name as userName FROM ExpertProfile e LEFT JOIN User u ON e.userId = u.id ORDER BY e.updatedAt DESC LIMIT 5
    `);

    let activities = [];
    recentRequirementsRecords.forEach(r => activities.push({ id: `req-${r.id}`, type: 'REQUIREMENT', text: `New requirement: ${r.title} by ${r.seekerName || 'Unknown'}`, date: r.createdAt }));
    recentUsersRecords.forEach(u => activities.push({ id: `usr-${u.id}`, type: 'USER', text: `New user joined: ${u.name}`, date: u.createdAt }));
    recentApplications.forEach(a => activities.push({ id: `exp-${a.id}`, type: 'EXPERT', text: `Expert application ${a.status.toLowerCase()}: ${a.title || 'Profile'} for ${a.userName || 'Unknown'}`, date: a.updatedAt }));

    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    activities = activities.slice(0, 10);

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [dailyJoins] = await pool.query('SELECT COUNT(*) as c FROM User WHERE createdAt >= ?', [twentyFourHoursAgo]);

    res.json({
      pendingExperts: Number(pendingExperts),
      approvedExperts: Number(approvedExperts),
      rejectedExperts: Number(rejectedExperts),
      totalUsers: Number(totalUsers),
      totalRequirements: Number(totalRequirements),
      recentRequirements: recentRequirementsRecords,
      recentUsers: recentUsersRecords,
      activityFeed: activities,
      dailyJoins: Number(dailyJoins[0].c)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpertApplications,
  approveExpert,
  rejectExpert,
  getDashboardStats,
};
