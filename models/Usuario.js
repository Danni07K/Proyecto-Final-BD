import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  clase: { type: mongoose.Schema.Types.ObjectId, ref: 'Clase' },
  nivel: { type: Number, default: 1 },
  experiencia: { type: Number, default: 0 },
  misionesCompletadas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mision' }]
});

export default mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);