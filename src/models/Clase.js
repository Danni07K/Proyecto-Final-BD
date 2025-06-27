import mongoose from 'mongoose';

const ClaseSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  habilidades: [String],
  codigoUnico: { type: String, unique: true },
  profesorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  estudiantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
  fechaCreacion: { type: Date, default: Date.now }
});

export default mongoose.models.Clase || mongoose.model('Clase', ClaseSchema);