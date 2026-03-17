const prisma = require('../config/db');

// Suggest slots (Expert)
const suggestSlots = async (req, res, next) => {
  try {
    const { requirementId, slots } = req.body;

    const expert = await prisma.expertProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!expert) {
      res.status(403);
      throw new Error('Not an expert');
    }

    const slotPayloads = slots.map((s) => ({
      expertId: expert.id,
      requirementId,
      date: s.date,
      time: s.time,
      timezone: s.timezone,
    }));

    await prisma.slot.createMany({ data: slotPayloads });

    res.status(201).json({ message: 'Slots suggested successfully' });
  } catch (error) {
    next(error);
  }
};

// Get available slots
const getAvailableSlots = async (req, res, next) => {
  try {
    const { requirementId, expertId } = req.params;

    const slots = await prisma.slot.findMany({
      where: {
        requirementId,
        expertId,
        isBooked: false,
      },
      orderBy: { date: 'asc' },
    });

    res.json(slots);
  } catch (error) {
    next(error);
  }
};

// Book slot
const bookSlot = async (req, res, next) => {
  try {
    const { slotId } = req.body;

    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
      include: { expert: true },
    });

    if (!slot) {
      res.status(404);
      throw new Error('Slot not found');
    }

    if (slot.isBooked) {
      res.status(400);
      throw new Error('Slot already booked');
    }

    await prisma.slot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    const booking = await prisma.booking.create({
      data: {
        slotId,
        seekerId: req.user.id,
        expertId: slot.expert.id,
        meetLink: 'https://meet.google.com/demo-link',
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

// Direct booking
const createDirectBooking = async (req, res, next) => {
  try {
    const { expertId } = req.body;

    const booking = await prisma.booking.create({
      data: {
        seekerId: req.user.id,
        expertId,
        meetLink: 'https://meet.google.com/direct-demo',
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

// List bookings
const listBookings = async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { seekerId: req.user.id },
          { expert: { userId: req.user.id } }
        ]
      },
      include: {
        slot: true,
        expert: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
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