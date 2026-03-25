const pool = require('../config/db');
const { randomUUID: uuidv4 } = require('crypto');

// @desc    Create a new requirement (Seeker)
// @route   POST /api/requirements
// @access  Private
const createRequirement = async (req, res, next) => {
  try {
    const { 
      title, description, problemDescription, category, attachments, isDraft, isPublic,
      userId, expertIds, companyName, companyStage, timeCommitment, offerType, 
      offerDetails, additionalContext 
    } = req.body;

    const finalProblemDesc = description || problemDescription;

    if (!finalProblemDesc || !title) {
      res.status(400);
      throw new Error('Title and problem description are required');
    }

    const requirementId = uuidv4();
    const isPublicDb = isPublic !== undefined ? (isPublic ? 1 : 0) : 1;
    const now = new Date();

    await pool.query(
      `INSERT INTO Requirement (
        id, seekerId, title, companyName, companyStage, problemDescription, category,
        timeCommitment, offerType, offerDetails, additionalContext, attachments, 
        isDraft, isPublic, status, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?)`,
      [
        requirementId, req.user.id, title, companyName || null, companyStage || null, 
        finalProblemDesc, category || null, timeCommitment || null, offerType || null, 
        offerDetails || null, additionalContext || null, attachments || null, 
        0, isPublicDb, now
      ]
    );

    if (expertIds && Array.isArray(expertIds) && expertIds.length > 0) {
      try {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const validExpertIds = expertIds.filter(id => typeof id === 'string' && uuidRegex.test(id));

        if (validExpertIds.length > 0) {
          const placeholders = validExpertIds.map(() => '?').join(',');
          const [existingExperts] = await pool.query(`SELECT id FROM ExpertProfile WHERE id IN (${placeholders})`, validExpertIds);
          
          for (let expert of existingExperts) {
            await pool.query(
              `INSERT IGNORE INTO RequirementRecipient (id, requirementId, expertId, status, createdAt) VALUES (?, ?, ?, 'pending', ?)`,
              [uuidv4(), requirementId, expert.id, now]
            );
          }
        }
      } catch (recipientError) {
        console.error('Error creating requirement recipients:', recipientError);
      }
    }

    const [reqs] = await pool.query('SELECT * FROM Requirement WHERE id = ?', [requirementId]);
    reqs[0].isDraft = !!reqs[0].isDraft;
    reqs[0].isPublic = !!reqs[0].isPublic;
    res.status(201).json(reqs[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a draft requirement (Seeker)
// @route   POST /api/requirements/draft
// @access  Private
const createDraft = async (req, res, next) => {
  try {
    const { 
      title, description, problemDescription, category, attachments,
      userId, companyName, companyStage, timeCommitment, offerType, 
      offerDetails, additionalContext 
    } = req.body;

    const finalProblemDesc = description || problemDescription || '';
    const requirementId = uuidv4();
    const now = new Date();
    const finalTitle = title || 'Untitled Draft';

    await pool.query(
      `INSERT INTO Requirement (
        id, seekerId, title, companyName, companyStage, problemDescription, category,
        timeCommitment, offerType, offerDetails, additionalContext, attachments, 
        isDraft, isPublic, status, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?)`,
      [
        requirementId, req.user.id, finalTitle, companyName || null, companyStage || null, 
        finalProblemDesc, category || null, timeCommitment || null, offerType || null, 
        offerDetails || null, additionalContext || null, attachments || null, 
        1, 0, now
      ]
    );

    const [reqs] = await pool.query('SELECT * FROM Requirement WHERE id = ?', [requirementId]);
    reqs[0].isDraft = !!reqs[0].isDraft;
    reqs[0].isPublic = !!reqs[0].isPublic;
    res.status(201).json(reqs[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    View requirements posted by current user (Seeker)
// @route   GET /api/requirements/seeker
// @access  Private
const viewSeekerRequirements = async (req, res, next) => {
  try {
    const [requirements] = await pool.query('SELECT * FROM Requirement WHERE seekerId = ? ORDER BY createdAt DESC', [req.user.id]);
    
    for (let r of requirements) {
      r.isDraft = !!r.isDraft;
      r.isPublic = !!r.isPublic;
      const [recipients] = await pool.query(`
        SELECT rr.*, e.id as expert_id, u.name as expert_user_name, u.avatar as expert_user_avatar
        FROM RequirementRecipient rr
        JOIN ExpertProfile e ON rr.expertId = e.id
        JOIN User u ON e.userId = u.id
        WHERE rr.requirementId = ?
      `, [r.id]);

      r.recipients = recipients.map(rec => ({
        ...rec,
        expert: {
          id: rec.expert_id,
          user: { name: rec.expert_user_name, avatar: rec.expert_user_avatar }
        }
      }));
    }

    res.json(requirements);
  } catch (error) {
    next(error);
  }
};

// @desc    View all my requirements (Seeker)
// @route   GET /api/requirements/my
// @access  Private
const getMyRequirements = viewSeekerRequirements;

// @desc    View all public requirements
// @route   GET /api/requirements/public
// @access  Public or Private/Expert
const viewPublicRequirements = async (req, res, next) => {
  try {
    const [requirements] = await pool.query(`
      SELECT r.*, u.name as seekerName, u.avatar as seekerAvatar, u.email as seekerEmail
      FROM Requirement r
      JOIN User u ON r.seekerId = u.id
      WHERE r.status = 'open'
      ORDER BY r.createdAt DESC
    `);

    const formatted = requirements.map(r => {
      const { seekerName, seekerAvatar, seekerEmail, ...rest } = r;
      rest.isDraft = !!rest.isDraft;
      rest.isPublic = !!rest.isPublic;
      rest.seeker = { name: seekerName, avatar: seekerAvatar, email: seekerEmail };
      return rest;
    });

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// @desc    View requirements sent to current expert (Expert Inbox)
// @route   GET /api/requirements/inbox
// @access  Private/Expert
const viewExpertInbox = async (req, res, next) => {
  try {
    const [experts] = await pool.query('SELECT id FROM ExpertProfile WHERE userId = ?', [req.user.id]);
    const expert = experts[0];

    if (!expert) {
      res.status(403);
      throw new Error('Not an expert');
    }

    const [inbox] = await pool.query(`
      SELECT 
        r.id as id,
        rr.id as recipientId,
        u.name as userName,
        r.companyName,
        r.companyStage,
        r.problemDescription,
        r.timeCommitment,
        r.offerType,
        r.offerDetails,
        r.additionalContext,
        rr.status,
        rr.createdAt as submittedAt
      FROM RequirementRecipient rr
      JOIN Requirement r ON rr.requirementId = r.id
      JOIN User u ON r.seekerId = u.id
      WHERE rr.expertId = ?
      ORDER BY rr.createdAt DESC
    `, [expert.id]);

    res.json(inbox);
  } catch (error) {
    next(error);
  }
};

// @desc    Get requirement by ID
// @route   GET /api/requirements/:id
// @access  Private
const getRequirementById = async (req, res, next) => {
  try {
    const [reqs] = await pool.query(`
      SELECT r.*, u.name as seekerName, u.avatar as seekerAvatar, u.email as seekerEmail
      FROM Requirement r
      JOIN User u ON r.seekerId = u.id
      WHERE r.id = ?
    `, [req.params.id]);

    if (!reqs[0]) {
      res.status(404);
      throw new Error('Requirement not found');
    }

    const { seekerName, seekerAvatar, seekerEmail, ...rest } = reqs[0];
    rest.isDraft = !!rest.isDraft;
    rest.isPublic = !!rest.isPublic;
    rest.seeker = { name: seekerName, avatar: seekerAvatar, email: seekerEmail };

    res.json(rest);
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to requirement (Expert)
// @route   PATCH /api/requirements/:id/respond
// @access  Private/Expert
const respondToRequirement = async (req, res, next) => {
  try {
    const [experts] = await pool.query('SELECT id, userId FROM ExpertProfile WHERE userId = ?', [req.user.id]);
    const expert = experts[0];

    if (!expert) {
      res.status(403);
      throw new Error('Not an expert');
    }

    const { status, rejectionNote } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    const requirementId = req.params.id;

    // requirementId refers to the Requirement ID, not the recipient ID
    const [recipients] = await pool.query(
      'SELECT id FROM RequirementRecipient WHERE requirementId = ? AND expertId = ?',
      [requirementId, expert.id]
    );
    let recipientId = recipients.length > 0 ? recipients[0].id : null;

    if (!recipientId) {
      if (status === 'accepted') {
        recipientId = uuidv4();
        await pool.query(
          'INSERT INTO RequirementRecipient (id, requirementId, expertId, status, createdAt) VALUES (?, ?, ?, ?, ?)',
          [recipientId, requirementId, expert.id, 'pending', new Date()]
        );
      } else {
        res.status(404);
        throw new Error('Requirement not found in your inbox');
      }
    }

    await pool.query(
      'UPDATE RequirementRecipient SET status = ?, rejectionNote = ? WHERE id = ?',
      [status, status === 'rejected' ? rejectionNote || null : null, recipientId]
    );

    // Get updated recipient manually with include structure
    const [updatedRows] = await pool.query(`
      SELECT rr.*, r.title, r.seekerId, u.name as seekerName
      FROM RequirementRecipient rr
      JOIN Requirement r ON rr.requirementId = r.id
      JOIN User u ON r.seekerId = u.id
      WHERE rr.id = ?
    `, [recipientId]);
    
    const updated = updatedRows[0];
    let finalPayload = { ...updated };
    if (updated) {
      const { title, seekerId, seekerName, ...rest } = updated;
      finalPayload = {
        ...rest,
        requirement: {
          title,  // Included to send logic below
          seeker: { id: seekerId, name: seekerName }
        }
      };
    }

    // If accepted, instantiate a Conversation automatically
    if (status === 'accepted' && finalPayload) {
      const ids = [finalPayload.requirement.seeker.id, expert.userId].sort();
      const user1Id = ids[0];
      const user2Id = ids[1];

      const [convs] = await pool.query(
        'SELECT id FROM Conversation WHERE user1Id = ? AND user2Id = ?',
        [user1Id, user2Id]
      );
      
      if (convs.length === 0) {
        await pool.query(
          'INSERT INTO Conversation (id, user1Id, user2Id, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
          [uuidv4(), user1Id, user2Id, new Date(), new Date()]
        );
      }

      // Notify seeker that an expert accepted
      try {
        await pool.query(
          'INSERT INTO Notification (id, userId, title, message, type, isRead, createdAt) VALUES (?, ?, ?, ?, ?, 0, ?)',
          [
            uuidv4(), 
            finalPayload.requirement.seeker.id,
            'Requirement Accepted',
            `An expert has accepted your requirement "${finalPayload.requirement.title}". You can now schedule a meeting.`,
            'REQUIREMENT_ACCEPTED',
            new Date()
          ]
        );
      } catch (e) { console.log('Notification error:', e.message); }
    }

    res.json(finalPayload);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequirement,
  createDraft,
  viewSeekerRequirements,
  getMyRequirements,
  viewExpertInbox,
  respondToRequirement,
  viewPublicRequirements,
  getRequirementById,
};
