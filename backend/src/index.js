require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const rutasUsuarios = require('./rutas/usuarios');

const app = express();

// Seguridad y middlewares

// Seguridad HTTP
app.use(helmet());
// Limpieza de datos para evitar XSS
app.use(xss());
// CORS seguro
app.use(cors({
  origin: process.env.CLIENTE_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Límite de peticiones para evitar fuerza bruta
const limitePeticiones = rateLimit({
  windowMs: 15 * 1000, // 15 segundos
  max: 20, // máximo 20 peticiones por IP en 15 segundos
  message: { mensaje: 'Demasiadas peticiones, intenta más tarde.' }
});
app.use(limitePeticiones);
// Parseo de JSON
app.use(express.json());


// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch((error) => {
  console.error('Error al conectar a MongoDB:', error);
});

// Rutas
app.use('/api/usuarios', rutasUsuarios);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

const PUERTO = process.env.PUERTO || 4000;
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
