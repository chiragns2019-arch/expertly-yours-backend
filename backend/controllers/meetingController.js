const pool = require('../config/db');
const sendEmailNotification = require('../utils/mailer');
const { randomUUID: uuidv4 } = require('crypto');

// @desc    Schedule a meeting
// @route   POST /api/meetings
// @access  Private
const scheduleMeeting = async (req, res, next) => {
  try {
    const { requirementId, expertId, date, startTime, endTime, meetLink, notes } = req.body;
    const seekerId = req.user.id;

    if (!requirementId || !expertId || !date || !startTime || !endTime) {
      res.status(400);
      throw new Error('requirementId, expertId, date, startTime, endTime are required');
    }

    const finalMeetLink = meetLink || `https://meet.google.com/${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const meetingId = uuidv4();
    const now = new Date();

    await pool.query(
      `INSERT INTO Meeting (id, requirementId, seekerId, expertId, date, startTime, endTime, meetLink, notes, status, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', ?, ?)`,
      [meetingId, requirementId, seekerId, expertId, date, startTime, endTime, finalMeetLink, notes || '', now, now]
    );

    // Fetch related details to notify
    const [details] = await pool.query(`
      SELECT r.title, s.name as seekerName, s.email as seekerEmail, 
             e.userId as expertUserId, eu.name as expertName, eu.email as expertEmail
      FROM Requirement r
      JOIN User s ON r.seekerId = s.id
      JOIN ExpertProfile e ON ? = e.id
      JOIN User eu ON e.userId = eu.id
      WHERE r.id = ? AND s.id = ?
    `, [expertId, requirementId, seekerId]);

    const det = details[0];

    if (det) {
      try {
        await pool.query(
          `INSERT INTO Notification (id, userId, title, message, type, isRead, createdAt) VALUES (?, ?, ?, ?, ?, 0, ?), (?, ?, ?, ?, ?, 0, ?)`,
          [
            uuidv4(), seekerId, 'Meeting Scheduled', `Meeting scheduled for "${det.title}" on ${date} at ${startTime}`, 'MEETING_SCHEDULED', now,
            uuidv4(), det.expertUserId, 'New Meeting Scheduled', `${det.seekerName} scheduled a meeting for "${det.title}" on ${date} at ${startTime}`, 'MEETING_SCHEDULED', now
          ]
        );

        await sendEmailNotification(
          det.expertEmail,
          'New Meeting Scheduled - ExpertlyYours',
          `<p>A meeting has been scheduled by ${det.seekerName} for <strong>${det.title}</strong>.</p>
           <p>Date: ${date}<br>Time: ${startTime} - ${endTime}</p>
           <p>Join: <a href="${finalMeetLink}">${finalMeetLink}</a></p>`
        );
      } catch (notifErr) {
        console.log('Notification/email error (non-blocking):', notifErr.message);
      }
    }

    const [created] = await pool.query('SELECT * FROM Meeting WHERE id = ?', [meetingId]);
    res.status(201).json(created[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Get my upcoming meetings
// @route   GET /api/meetings/upcoming
// @access  Private
const getUpcomingMeetings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(`
      SELECT m.*, 
        r.id as reqId, r.title as reqTitle, 
        s.name as seekerName, s.avatar as seekerAvatar, s.email as seekerEmail,
        e.id as expertProfileId, eu.name as expertName, eu.avatar as expertAvatar, eu.email as expertEmail
      FROM Meeting m
      JOIN Requirement r ON m.requirementId = r.id
      JOIN User s ON m.seekerId = s.id
      JOIN ExpertProfile e ON m.expertId = e.id
      JOIN User eu ON e.userId = eu.id
      WHERE (m.seekerId = ? OR e.userId = ?) AND m.status = 'scheduled'
      ORDER BY m.date ASC
    `, [userId, userId]);

    const meetings = rows.map(r => {
      const { reqId, reqTitle, seekerName, seekerAvatar, seekerEmail, expertProfileId, expertName, expertAvatar, expertEmail, ...mProps } = r;
      return {
        ...mProps,
        requirement: { id: reqId, title: reqTitle },
        seeker: { name: seekerName, avatar: seekerAvatar, email: seekerEmail },
        expert: { user: { name: expertName, avatar: expertAvatar, email: expertEmail } }
      };
    });

    res.json(meetings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get my ongoing engagements (accepted requirements)
// @route   GET /api/meetings/engagements
// @access  Private
const getEngagements = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // As Seeker
    const [seekerRows] = await pool.query(`
      SELECT r.*, 
        rr.id as rrId, rr.status as rrStatus,
        e.id as expertId, eu.name as expertName, eu.avatar as expertAvatar
      FROM Requirement r
      JOIN RequirementRecipient rr ON r.id = rr.requirementId
      JOIN ExpertProfile e ON rr.expertId = e.id
      JOIN User eu ON e.userId = eu.id
      WHERE r.seekerId = ? AND rr.status = 'accepted'
    `, [userId]);

    let reqsMap = {};
    for (let r of seekerRows) {
      if (!reqsMap[r.id]) {
        const { rrId, rrStatus, expertId, expertName, expertAvatar, ...reqData } = r;
        reqData.isDraft = !!reqData.isDraft;
        reqData.isPublic = !!reqData.isPublic;
        reqData.recipients = [];
        reqsMap[r.id] = reqData;
      }
      reqsMap[r.id].recipients.push({
        status: r.rrStatus,
        expert: { user: { name: r.expertName, avatar: r.expertAvatar } }
      });
    }
    const asSeeker = Object.values(reqsMap).sort((a,b) => b.createdAt - a.createdAt);

    // As Expert
    const [experts] = await pool.query('SELECT id FROM ExpertProfile WHERE userId = ?', [userId]);
    const expertId = experts.length > 0 ? experts[0].id : null;
    let asExpert = [];

    if (expertId) {
      const [expertRows] = await pool.query(`
        SELECT r.*, u.name as seekerName, u.avatar as seekerAvatar
        FROM RequirementRecipient rr
        JOIN Requirement r ON rr.requirementId = r.id
        JOIN User u ON r.seekerId = u.id
        WHERE rr.expertId = ? AND rr.status = 'accepted'
        ORDER BY rr.createdAt DESC
      `, [expertId]);

      asExpert = expertRows.map(r => {
        const { seekerName, seekerAvatar, ...reqData } = r;
        reqData.isDraft = !!reqData.isDraft;
        reqData.isPublic = !!reqData.isPublic;
        reqData.expertName = req.user.name || 'You';
        reqData.seekerName = seekerName;
        reqData.seekerAvatar = seekerAvatar;
        return reqData;
      });
    }

    res.json({ asSeeker, asExpert });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a meeting
// @route   PATCH /api/meetings/:id/cancel
// @access  Private
const cancelMeeting = async (req, res, next) => {
  try {
    const meetingId = req.params.id;
    await pool.query('UPDATE Meeting SET status = ?, updatedAt = ? WHERE id = ?', ['cancelled', new Date(), meetingId]);

    const [details] = await pool.query(`
      SELECT m.*, r.title, s.id as seekerId, s.name as seekerName,
             e.userId as expertUserId, eu.name as expertName
      FROM Meeting m
      JOIN Requirement r ON m.requirementId = r.id
      JOIN User s ON m.seekerId = s.id
      JOIN ExpertProfile e ON m.expertId = e.id
      JOIN User eu ON e.userId = eu.id
      WHERE m.id = ?
    `, [meetingId]);

    const m = details[0];
    if (m) {
      const now = new Date();
      await pool.query(
        `INSERT INTO Notification (id, userId, title, message, type, isRead, createdAt) VALUES (?, ?, ?, ?, ?, 0, ?), (?, ?, ?, ?, ?, 0, ?)`,
        [
          uuidv4(), m.seekerId, 'Meeting Cancelled', `Meeting for "${m.title}" has been cancelled.`, 'MEETING_CANCELLED', now,
          uuidv4(), m.expertUserId, 'Meeting Cancelled', `Meeting for "${m.title}" with ${m.seekerName} has been cancelled.`, 'MEETING_CANCELLED', now
        ]
      );
      
      const { title, seekerName, expertName, expertUserId, ...mProps } = m;
      mProps.requirement = { title };
      mProps.seeker = { name: seekerName };
      mProps.expert = { user: { name: expertName } };
      return res.json(mProps);
    }
    
    res.json({ id: meetingId, status: 'cancelled' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reschedule a meeting
// @route   PATCH /api/meetings/:id/reschedule
// @access  Private
const rescheduleMeeting = async (req, res, next) => {
  try {
    const { date, startTime, endTime, notes } = req.body;
    const meetingId = req.params.id;

    await pool.query(
      'UPDATE Meeting SET date = ?, startTime = ?, endTime = ?, notes = ?, status = ?, updatedAt = ? WHERE id = ?',
      [date, startTime, endTime, notes, 'scheduled', new Date(), meetingId]
    );

    const [details] = await pool.query(`
      SELECT m.*, r.title, s.id as seekerId, s.name as seekerName,
             e.userId as expertUserId, eu.name as expertName
      FROM Meeting m
      JOIN Requirement r ON m.requirementId = r.id
      JOIN User s ON m.seekerId = s.id
      JOIN ExpertProfile e ON m.expertId = e.id
      JOIN User eu ON e.userId = eu.id
      WHERE m.id = ?
    `, [meetingId]);

    const m = details[0];
    if (m) {
      const now = new Date();
      await pool.query(
        `INSERT INTO Notification (id, userId, title, message, type, isRead, createdAt) VALUES (?, ?, ?, ?, ?, 0, ?), (?, ?, ?, ?, ?, 0, ?)`,
        [
          uuidv4(), m.seekerId, 'Meeting Rescheduled', `Meeting for "${m.title}" rescheduled to ${date} at ${startTime}`, 'MEETING_RESCHEDULED', now,
          uuidv4(), m.expertUserId, 'Meeting Rescheduled', `${m.seekerName} rescheduled meeting for "${m.title}" to ${date} at ${startTime}`, 'MEETING_RESCHEDULED', now
        ]
      );

      const { title, seekerName, expertName, expertUserId, ...mProps } = m;
      mProps.requirement = { title };
      mProps.seeker = { name: seekerName };
      mProps.expert = { user: { name: expertName } };
      return res.json(mProps);
    }

    res.json({ id: meetingId, status: 'scheduled' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get meeting details for scheduling page
// @route   GET /api/meetings/context/:requirementId
// @access  Private
const getMeetingContext = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, s.id as seekerId, s.name as seekerName, s.email as seekerEmail, s.avatar as seekerAvatar,
             rr.id as rrId, e.id as expertId, eu.id as expertUserId, eu.name as expertName, eu.email as expertEmail, eu.avatar as expertAvatar
      FROM Requirement r
      JOIN User s ON r.seekerId = s.id
      LEFT JOIN RequirementRecipient rr ON r.id = rr.requirementId
      LEFT JOIN ExpertProfile e ON rr.expertId = e.id
      LEFT JOIN User eu ON e.userId = eu.id
      WHERE r.id = ?
    `, [req.params.requirementId]);

    if (rows.length === 0) {
      res.status(404);
      throw new Error('Requirement not found');
    }

    const { seekerId, seekerName, seekerEmail, seekerAvatar, rrId, expertId, expertUserId, expertName, expertEmail, expertAvatar, ...r } = rows[0];
    r.isDraft = !!r.isDraft;
    r.isPublic = !!r.isPublic;
    r.seeker = { id: seekerId, name: seekerName, email: seekerEmail, avatar: seekerAvatar };
    r.recipients = [];

    for (let row of rows) {
      if (row.rrId) {
        r.recipients.push({
          expert: {
            user: { id: row.expertUserId, name: row.expertName, email: row.expertEmail, avatar: row.expertAvatar }
          }
        });
      }
    }

    res.json(r);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scheduleMeeting,
  getUpcomingMeetings,
  getEngagements,
  cancelMeeting,
  rescheduleMeeting,
  getMeetingContext,
};
