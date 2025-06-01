import Doctor from '../models/Doctor.js';
import Consultation from '../models/Consultation.js';

export const createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isActive: false });
    await Consultation.updateMany({ doctorId: req.params.id }, { isActive: false });
    res.status(200).json({ message: 'Doctor and related consultations marked inactive' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDoctorPatients = async (req, res) => {
  try {
    const consultations = await Consultation.find({ doctorId: req.params.id, isActive: true })
      .populate('patientId', 'name age gender')
      .sort({ consultedAt: -1 });
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDoctorConsultationCount = async (req, res) => {
  try {
    const count = await Consultation.countDocuments({ doctorId: req.params.id });
    res.json({ totalConsultations: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
