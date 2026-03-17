const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createRequirement, 
  createDraft,
  viewSeekerRequirements, 
  getMyRequirements,
  viewExpertInbox, 
  respondToRequirement, 
  viewPublicRequirements,
  getRequirementById
} = require('../controllers/requirementController');

router.post('/', protect, createRequirement);
router.post('/draft', protect, createDraft);
router.get('/my', protect, getMyRequirements);
router.get('/seeker', protect, viewSeekerRequirements);
router.get('/inbox', protect, viewExpertInbox);
router.get('/public', protect, viewPublicRequirements);
router.get('/:id', protect, getRequirementById);
router.patch('/:id/respond', protect, respondToRequirement);

module.exports = router;
