const prisma = require('../config/db');

// @desc    Discover experts
// @route   GET /api/experts/discover
// @access  Public
const discoverExperts = async (req, res, next) => {
  try {
    const { expertise, minRate, maxRate } = req.query;

    let filter = {
      status: 'APPROVED',
    };

    if (expertise) {
      filter.expertise = { contains: expertise, mode: 'insensitive' };
    }
    
    // Add rate filtering logic if needed later
    
    const experts = await prisma.expertProfile.findMany({
      where: filter,
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        usefulnessScore: 'desc',
      },
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
    const expert = await prisma.expertProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (expert) {
      res.json(expert);
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
      linkedinUrl, websiteUrl, hourlyRate, allowsDirectBooking 
    } = req.body;

    const expertProfile = await prisma.expertProfile.upsert({
      where: { userId: req.user.id },
      update: {
        title: displayName,
        bio,
        expertise: primaryExpertise,
        yearsExperience,
        company: req.body.company || '',
        skills: req.body.skills || [],
        linkedinUrl,
        websiteUrl,
        hourlyRate: parseInt(hourlyRate) || 0,
        allowsDirectBooking: !!allowsDirectBooking,
        status: 'PENDING_APPROVAL',
      },
      create: {
        userId: req.user.id,
        title: displayName,
        bio,
        expertise: primaryExpertise,
        yearsExperience,
        company: req.body.company || '',
        skills: req.body.skills || [],
        linkedinUrl,
        websiteUrl,
        hourlyRate: parseInt(hourlyRate) || 0,
        allowsDirectBooking: !!allowsDirectBooking,
        status: 'PENDING_APPROVAL',
      },
    });

    res.json(expertProfile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  discoverExperts,
  getExpertProfile,
  submitExpertProfile,
};
