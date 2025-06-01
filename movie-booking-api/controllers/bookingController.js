import Booking from '../models/booking.js';
export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(200).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
