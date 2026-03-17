const express = require('express');
const router = express.Router();
const { 
    suggestSlots, 
    bookSlot, 
    listBookings, 
    getAvailableSlots,
    createDirectBooking 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All booking routes protected
router.use(protect);

// Suggest slots
router.post('/slots', suggestSlots);

// Get available slots
router.get('/slots/:requirementId/:expertId', getAvailableSlots);

// Direct booking
router.post('/direct', createDirectBooking);

// Book slot
router.post('/', bookSlot);

// List bookings
router.get('/', listBookings);

module.exports = router;