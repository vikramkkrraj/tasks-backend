import Learner from '../models/learner.js';
import Session from '../models/session.js';

export const createLearner = async (req, res) => {
  try {
    const learner = new Learner(req.body);
    await learner.save();
    res.status(201).json(learner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteLearner = async (req, res) => {
  try {
    await Learner.findByIdAndUpdate(req.params.id, { isActive: false });
    await Session.updateMany({ attendees: req.params.id }, { $pull: { attendees: req.params.id } });
    res.status(200).json({ message: 'Learner soft-deleted and removed from sessions' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};