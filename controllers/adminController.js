const prisma = require('../config/db');

// @desc    Get all expert applications
// @route   GET /api/admin/expert-applications
// @access  Private/Admin
const getExpertApplications = async (req, res, next) => {
  try {
    const applications = await prisma.expertProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    res.json(applications);
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

    const expert = await prisma.expertProfile.update({
      where: { id: expertId },
      data: { status: 'APPROVED' },
    });

    // Also update user role to EXPERT if not already
    await prisma.user.update({
      where: { id: expert.userId },
      data: { role: 'EXPERT' },
    });

    res.json(expert);
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

    const expert = await prisma.expertProfile.update({
      where: { id: expertId },
      data: { 
        status: 'REJECTED'
      },
    });

    res.json(expert);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      pendingExperts,
      approvedExperts,
      rejectedExperts,
      totalUsers,
      totalRequirements
    ] = await Promise.all([
      prisma.expertProfile.count({ where: { status: 'PENDING_APPROVAL' } }),
      prisma.expertProfile.count({ where: { status: 'APPROVED' } }),
      prisma.expertProfile.count({ where: { status: 'REJECTED' } }),
      prisma.user.count(),
      prisma.requirement.count(),
    ]);

    res.json({
      pendingExperts,
      approvedExperts,
      rejectedExperts,
      totalUsers,
      totalRequirements,
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
