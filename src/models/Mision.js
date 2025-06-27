import mongoose from 'mongoose';

const MisionSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  experiencia: Number,
  dificultad: { type: String, enum: ['facil', 'medio', 'dificil'], default: 'facil' },
  estado: { type: String, enum: ['pendiente', 'completada'], default: 'pendiente' }
}, {
  collection: 'misiones'
});

export default mongoose.models.Mision || mongoose.model('Mision', MisionSchema);