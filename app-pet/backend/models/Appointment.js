const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    petName: { type: String, required: true, trim: true },
    serviceType: { type: String, required: true, trim: true },
    appointmentDate: { type: Date, required: true },
    notes: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['agendado', 'concluido', 'cancelado'],
      default: 'agendado'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
