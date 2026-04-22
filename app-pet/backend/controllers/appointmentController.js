const Appointment = require('../models/Appointment');

exports.listAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar agendamentos.' });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamento.' });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar agendamento.', details: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar agendamento.', details: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    res.json({ message: 'Agendamento removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir agendamento.' });
  }
};
