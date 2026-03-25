const pool = require('../config/db');
const { randomUUID: uuidv4 } = require('crypto');

// Suggest slots (Expert)
const suggestSlots = async (req, res, next) => {
  try {
    const { requirementId, slots } = req.body;

    const [experts] = await pool.query('SELECT id FROM ExpertProfile WHERE userId = ?', [req.user.id]);
    const expert = experts[0];

    if (!expert) {
      res.status(403);
      throw new Error('Not an expert');
    }

    const now = new Date();
    for (let s of slots) {
      await pool.query(
        'INSERT INTO Slot (id, expertId, requirementId, date, time, timezone, isBooked, createdAt) VALUES (?, ?, ?, ?, ?, ?, 0, ?)',
        [uuidv4(), expert.id, requirementId, s.date, s.time, s.timezone, now]
      );
    }

    res.status(201).json({ message: 'Slots suggested successfully' });
  } catch (error) {
    next(error);
  }
};

// Get available slots
const getAvailableSlots = async (req, res, next) => {
  try {
    const { requirementId, expertId } = req.params;

    const [slots] = await pool.query(
      'SELECT * FROM Slot WHERE requirementId = ? AND expertId = ? AND isBooked = 0 ORDER BY date ASC',
      [requirementId, expertId]
    );

    slots.forEach(s => s.isBooked = !!s.isBooked);
    res.json(slots);
  } catch (error) {
    next(error);
  }
};

// Book slot
const bookSlot = async (req, res, next) => {
  try {
    const { slotId } = req.body;

    const [slots] = await pool.query('SELECT * FROM Slot WHERE id = ?', [slotId]);
    const slot = slots[0];

    if (!slot) {
      res.status(404);
      throw new Error('Slot not found');
    }

    if (slot.isBooked) {
      res.status(400);
      throw new Error('Slot already booked');
    }

    await pool.query('UPDATE Slot SET isBooked = 1 WHERE id = ?', [slotId]);

    const bookingId = uuidv4();
    await pool.query(
      'INSERT INTO Booking (id, slotId, seekerId, expertId, meetLink, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [bookingId, slotId, req.user.id, slot.expertId, 'https://meet.google.com/demo-link', 'confirmed', new Date()]
    );

    const [bookings] = await pool.query('SELECT * FROM Booking WHERE id = ?', [bookingId]);
    res.status(201).json(bookings[0]);
  } catch (error) {
    next(error);
  }
};

// Direct booking
const createDirectBooking = async (req, res, next) => {
  try {
    const { expertId } = req.body;
    const bookingId = uuidv4();

    await pool.query(
      'INSERT INTO Booking (id, slotId, seekerId, expertId, meetLink, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [bookingId, "direct-" + uuidv4(), req.user.id, expertId, 'https://meet.google.com/direct-demo', 'confirmed', new Date()]
    );

    const [bookings] = await pool.query('SELECT * FROM Booking WHERE id = ?', [bookingId]);
    res.status(201).json(bookings[0]);
  } catch (error) {
    next(error);
  }
};

// List bookings
const listBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [bookings] = await pool.query(`
      SELECT b.*, 
             s.id as slot_id, s.date as slot_date, s.time as slot_time, s.timezone as slot_timezone, s.isBooked as slot_isBooked,
             e.id as e_id, e.userId as e_userId, e.title as e_title
      FROM Booking b
      LEFT JOIN Slot s ON b.slotId = s.id
      JOIN ExpertProfile e ON b.expertId = e.id
      WHERE b.seekerId = ? OR e.userId = ?
      ORDER BY b.createdAt DESC
    `, [userId, userId]);

    const result = bookings.map(r => {
      const { slot_id, slot_date, slot_time, slot_timezone, slot_isBooked, e_id, e_userId, e_title, ...b } = r;
      b.slot = slot_id ? { id: slot_id, date: slot_date, time: slot_time, timezone: slot_timezone, isBooked: !!slot_isBooked } : null;
      b.expert = { id: e_id, userId: e_userId, title: e_title };
      return b;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  suggestSlots,
  bookSlot,
  listBookings,
  getAvailableSlots,
  createDirectBooking,
};