import mongoose from 'mongoose';

const MisionSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  experiencia: Number,
  estado: { type: String, enum: ['pendiente', 'completada'], default: 'pendiente' }
});

export default mongoose.models.Mision || mongoose.model('Mision', MisionSchema);
