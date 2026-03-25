const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  scheduleMeeting,
  getUpcomingMeetings,
  getEngagements,
  cancelMeeting,
  rescheduleMeeting,
  getMeetingContext,
} = require('../controllers/meetingController');

router.use(protect);

router.post('/', scheduleMeeting);
router.get('/upcoming', getUpcomingMeetings);
router.get('/engagements', getEngagements);
router.get('/context/:requirementId', getMeetingContext);
router.patch('/:id/cancel', cancelMeeting);
router.patch('/:id/reschedule', rescheduleMeeting);

module.exports = router;
