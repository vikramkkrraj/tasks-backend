import Session from '../models/session.js';

export const createSession = async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getRecentSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ isArchived: false }).sort({ time: -1 }).limit(5);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};