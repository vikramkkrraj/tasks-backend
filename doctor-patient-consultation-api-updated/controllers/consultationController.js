import Consultation from '../models/Consultation.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

export const createConsultation = async (req, res) => {
  const { doctorId, patientId } = req.body;
  try {
    const doctor = await Doctor.findOne({ _id: doctorId, isActive: true });
    const patient = await Patient.findOne({ _id: patientId, isActive: true });

    if (!doctor || !patient) {
      return res.status(400).json({ message: "Doctor or Patient is not active or does not exist" });
    }

    const consultation = new Consultation(req.body);
    await consultation.save();
    res.status(201).json(consultation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRecentConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ isActive: true })
      .sort({ consultedAt: -1 })
      .limit(5);
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
