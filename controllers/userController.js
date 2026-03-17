const prisma = require('../config/db');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        expertProfile: true,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (user) {
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          name: req.body.name || user.name,
          email: req.body.email || user.email,
          avatar: req.body.avatar !== undefined ? req.body.avatar : user.avatar,
        },
      });

      // Update expert profile if exists and is provided
      if (user.role === 'EXPERT' && req.body.expertProfile) {
        await prisma.expertProfile.update({
          where: { userId: user.id },
          data: {
            title: req.body.expertProfile.title,
            expertise: req.body.expertProfile.expertise,
            hourlyRate: req.body.expertProfile.hourlyRate,
            linkedinUrl: req.body.expertProfile.linkedinUrl,
            behanceUrl: req.body.expertProfile.behanceUrl,
            websiteUrl: req.body.expertProfile.websiteUrl,
            allowsDirectBooking: req.body.expertProfile.allowsDirectBooking,
          },
        });
      }

      const freshUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { expertProfile: true },
      });

      res.json(freshUser);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
