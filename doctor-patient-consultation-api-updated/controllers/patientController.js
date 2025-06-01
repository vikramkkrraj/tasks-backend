import Patient from '../models/Patient.js';
import Consultation from '../models/Consultation.js';

export const createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, { isActive: false });
    await Consultation.updateMany({ patientId: req.params.id }, { isActive: false });
    res.status(200).json({ message: 'Patient and related consultations marked inactive' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPatientDoctors = async (req, res) => {
  try {
    const consultations = await Consultation.find({ patientId: req.params.id, isActive: true })
      .populate('doctorId', 'name specialization');
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getActiveMalePatients = async (req, res) => {
  try {
    const patients = await Patient.find({ gender: "Male", isActive: true });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
