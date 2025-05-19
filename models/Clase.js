import mongoose from 'mongoose';

const ClaseSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  habilidades: [String]
});

export default mongoose.models.Clase || mongoose.model('Clase', ClaseSchema);