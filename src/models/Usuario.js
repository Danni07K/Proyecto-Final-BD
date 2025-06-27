import mongoose from 'mongoose'

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // Para login con correo
  password: { type: String }, // Hashed
  rol: { type: String, enum: ['profesor', 'estudiante'], default: 'estudiante' },
  clase: { type: mongoose.Schema.Types.ObjectId, ref: 'Clase' },
  nivel: { type: Number, default: 1 },
  experiencia: { type: Number, default: 0 },
  personaje: {
    nombre: String,
    avatar: String
  },
  accesoriosComprados: [String],
  misionesCompletadas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mision' }],
  // Sistema de calificaciones
  puntosPositivos: { type: Number, default: 0 },
  puntosNegativos: { type: Number, default: 0 },
  puntosGold: { type: Number, default: 0 },
  // Sistema de monedas para comprar accesorios
  monedas: { type: Number, default: 100 },
  // Historial de calificaciones
  historialCalificaciones: [{
    tipo: { type: String, enum: ['positivo', 'negativo', 'gold'] },
    cantidad: Number,
    motivo: String,
    fecha: { type: Date, default: Date.now },
    profesorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
  }]
})

export default mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema)
