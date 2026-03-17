const prisma = require('../config/db');

// @desc    Create a new requirement (Seeker)
// @route   POST /api/requirements
// @access  Private
const createRequirement = async (req, res, next) => {
  try {
    const { 
      title,
      description,
      problemDescription,
      category,
      attachments,
      isDraft,
      isPublic,
      userId,
      expertIds, 
      companyName, 
      companyStage, 
      timeCommitment, 
      offerType, 
      offerDetails, 
      additionalContext 
    } = req.body;

    const finalProblemDesc = description || problemDescription;

    if (!finalProblemDesc || !title) {
      res.status(400);
      throw new Error('Title and problem description are required');
    }

    const requirement = await prisma.requirement.create({
      data: {
        title,
        seekerId: req.user.id,
        companyName,
        companyStage,
        problemDescription: finalProblemDesc,
        category,
        timeCommitment,
        offerType,
        offerDetails,
        additionalContext,
        attachments,
        isDraft: false,
        isPublic: isPublic !== undefined ? isPublic : true,
      },
    });

    if (expertIds && Array.isArray(expertIds) && expertIds.length > 0) {
      try {
        // Simple regex to check for UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const validExpertIds = expertIds.filter(id => typeof id === 'string' && uuidRegex.test(id));

        if (validExpertIds.length > 0) {
          // Verify they exist in DB
          const existingExperts = await prisma.expertProfile.findMany({
            where: { id: { in: validExpertIds } },
            select: { id: true }
          });
          
          const foundIds = existingExperts.map(e => e.id);

          if (foundIds.length > 0) {
            const recipients = foundIds.map((expertId) => ({
              requirementId: requirement.id,
              expertId: expertId,
              status: 'pending',
            }));

            await prisma.requirementRecipient.createMany({
              data: recipients,
              skipDuplicates: true,
            });
          }
        }
      } catch (recipientError) {
        console.error('Error creating requirement recipients:', recipientError);
        // We don't fail the whole request if recipients fail, we want the requirement to be saved
      }
    }

    res.status(201).json(requirement);
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
      title,
      description,
      problemDescription,
      category,
      attachments,
      userId,
      companyName, 
      companyStage, 
      timeCommitment, 
      offerType, 
      offerDetails, 
      additionalContext 
    } = req.body;

    const finalProblemDesc = description || problemDescription || '';

    const requirement = await prisma.requirement.create({
      data: {
        title: title || 'Untitled Draft',
        seekerId: req.user.id,
        companyName,
        companyStage,
        problemDescription: finalProblemDesc,
        category,
        timeCommitment,
        offerType,
        offerDetails,
        additionalContext,
        attachments,
        isDraft: true,
        isPublic: false,
      },
    });

    res.status(201).json(requirement);
  } catch (error) {
    next(error);
  }
};

// @desc    View requirements posted by current user (Seeker)
// @route   GET /api/requirements/seeker
// @access  Private
const viewSeekerRequirements = async (req, res, next) => {
  try {
    const requirements = await prisma.requirement.findMany({
      where: { seekerId: req.user.id },
      include: {
        recipients: {
          include: {
            expert: {
              include: { user: { select: { name: true, avatar: true } } }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(requirements);
  } catch (error) {
    next(error);
  }
};

// @desc    View all my requirements (Seeker)
// @route   GET /api/requirements/my
// @access  Private
const getMyRequirements = async (req, res, next) => {
  try {
    const requirements = await prisma.requirement.findMany({
      where: { seekerId: req.user.id },
      include: {
        recipients: {
          include: {
            expert: {
              include: { user: { select: { name: true, avatar: true } } }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(requirements);
  } catch (error) {
    next(error);
  }
};

// @desc    View all public requirements
// @route   GET /api/requirements/public
// @access  Public or Private/Expert
const viewPublicRequirements = async (req, res, next) => {
  try {
    const requirements = await prisma.requirement.findMany({
      where: { status: 'open' },
      include: {
        seeker: { select: { name: true, avatar: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(requirements);
  } catch (error) {
    next(error);
  }
};

// @desc    View requirements sent to current expert (Expert Inbox)
// @route   GET /api/requirements/inbox
// @access  Private/Expert
const viewExpertInbox = async (req, res, next) => {
  try {
    const expert = await prisma.expertProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!expert) {
      res.status(403);
      throw new Error('Not an expert');
    }

    const inbox = await prisma.requirementRecipient.findMany({
      where: { expertId: expert.id },
      include: {
        requirement: {
          include: {
            seeker: { select: { name: true, email: true, avatar: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const parsedInbox = inbox.map(item => ({
      id: item.requirement.id,
      recipientId: item.id,
      userName: item.requirement.seeker.name,
      companyName: item.requirement.companyName,
      companyStage: item.requirement.companyStage,
      problemDescription: item.requirement.problemDescription,
      timeCommitment: item.requirement.timeCommitment,
      offerType: item.requirement.offerType,
      offerDetails: item.requirement.offerDetails,
      additionalContext: item.requirement.additionalContext,
      status: item.status,
      submittedAt: item.createdAt,
    }));

    res.json(parsedInbox);
  } catch (error) {
    next(error);
  }
};

// @desc    Get requirement by ID
// @route   GET /api/requirements/:id
// @access  Private
const getRequirementById = async (req, res, next) => {
  try {
    const requirement = await prisma.requirement.findUnique({
      where: { id: req.params.id },
      include: {
        seeker: { select: { name: true, avatar: true, email: true } },
      },
    });

    if (!requirement) {
      res.status(404);
      throw new Error('Requirement not found');
    }
    res.json(requirement);
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to requirement (Expert)
// @route   PATCH /api/requirements/:id/respond
// @access  Private/Expert
const respondToRequirement = async (req, res, next) => {
  try {
    const expert = await prisma.expertProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!expert) {
      res.status(403);
      throw new Error('Not an expert');
    }

    const { status, rejectionNote } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    // requirementId refers to the Requirement ID, not the recipient ID. 
    // We update the recipient record for this exact expert and requirement.
    let recipient = await prisma.requirementRecipient.findFirst({
      where: {
        requirementId: req.params.id,
        expertId: expert.id,
      },
    });

    if (!recipient) {
      if (status === 'accepted') {
        // Expert applying to public requirement
        recipient = await prisma.requirementRecipient.create({
          data: {
            requirementId: req.params.id,
            expertId: expert.id,
            status: 'pending' // Initially pending the seeker's review 
          }
        });
        // We set status to accepted just for tracking that they want it
        // Or we just leave the DB status as 'accepted' so it shows up in their inbox 
      } else {
        res.status(404);
        throw new Error('Requirement not found in your inbox');
      }
    }

    const updated = await prisma.requirementRecipient.update({
      where: { id: recipient.id },
      data: {
        status,
        rejectionNote: status === 'rejected' ? rejectionNote : null,
      },
      include: {
        requirement: {
          include: {
            seeker: { select: { id: true, name: true } }
          }
        }
      }
    });

    // If accepted, instantiate a Conversation automatically
    if (status === 'accepted') {
      let conv = await prisma.conversation.findFirst({
        where: {
          seekerId: updated.requirement.seeker.id,
          expertId: expert.id,
          relatedRequirementId: req.params.id,
        }
      });
      
      if (!conv) {
        await prisma.conversation.create({
          data: {
            seekerId: updated.requirement.seeker.id,
            expertId: expert.id,
            relatedRequirementId: req.params.id,
          }
        });
      }
    }

    res.json(updated);
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
