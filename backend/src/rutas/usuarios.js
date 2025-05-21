const express = require('express');
const { body } = require('express-validator');
const controladorUsuarios = require('../controladores/usuarios');
const autenticar = require('../middlewares/autenticacion');
const router = express.Router();

// Registro
router.post('/registro', [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),
  body('correo')
    .isEmail().withMessage('Correo inválido')
    .normalizeEmail(),
  body('contrasena')
    .isLength({ min: 8, max: 64 }).withMessage('La contraseña debe tener entre 8 y 64 caracteres')
    .matches(/[A-Z]/).withMessage('La contraseña debe tener al menos una mayúscula')
    .matches(/[a-z]/).withMessage('La contraseña debe tener al menos una minúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe tener al menos un número')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/).withMessage('La contraseña debe tener al menos un símbolo')
], controladorUsuarios.registrarUsuario);

// Inicio de sesión (rate limit más estricto)
const rateLimit = require('express-rate-limit');
const limiteLogin = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 10, // máximo 10 intentos por IP
  message: { mensaje: 'Demasiados intentos de inicio de sesión, espera unos minutos.' }
});
router.post('/iniciar-sesion', limiteLogin, [
  body('correo').isEmail().withMessage('Correo inválido').normalizeEmail(),
  body('contrasena').notEmpty().withMessage('La contraseña es obligatoria')
], controladorUsuarios.iniciarSesion);

// Cierre de sesión
router.post('/cerrar-sesion', autenticar, controladorUsuarios.cerrarSesion);

// Recuperar contraseña
router.post('/recuperar-contrasena', [
  body('correo').isEmail().withMessage('Correo inválido').normalizeEmail()
], controladorUsuarios.enviarRecuperacion);

// Restablecer contraseña
router.post('/restablecer-contrasena', [
  body('token').notEmpty(),
  body('nuevaContrasena').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
], controladorUsuarios.restablecerContrasena);

// Ruta protegida de ejemplo
router.get('/protegida', autenticar, (req, res) => {
  res.json({ mensaje: 'Acceso concedido a la ruta protegida', usuario: req.usuario });
});

module.exports = router;
