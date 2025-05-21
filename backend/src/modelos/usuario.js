const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Correo inválido']
  },
  contrasena: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 64
  },
  tokenRecuperacion: String,
  tokenExpiracion: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', esquemaUsuario);
