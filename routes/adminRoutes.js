const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect);
router.use(authMiddleware.admin);

router.get('/expert-applications', adminController.getExpertApplications);
router.post('/expert-approve', adminController.approveExpert);
router.post('/expert-reject', adminController.rejectExpert);
router.get('/stats', adminController.getDashboardStats);

module.exports = router;
