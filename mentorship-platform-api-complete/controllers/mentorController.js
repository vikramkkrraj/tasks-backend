import Mentor from '../models/mentor.js';
import Session from '../models/session.js';

export const createMentor = async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).json(mentor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndUpdate(req.params.id, { isActive: false });
    await Session.updateMany({ mentorId: req.params.id }, { status: 'cancelled' });
    res.status(200).json({ message: 'Mentor soft-deleted and sessions updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};