const Usuario = require('../modelos/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const enviarCorreo = require('../utilidades/correo');
const crypto = require('crypto');

exports.registrarUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const { nombre, correo, contrasena } = req.body;
    let usuario = await Usuario.findOne({ correo });
    if (usuario) {
      // Mensaje genérico para evitar enumeración de usuarios
      return res.status(400).json({ mensaje: 'No se pudo registrar el usuario.' });
    }
    // Validación extra para evitar inyección NoSQL (solo bloquea $ y . al inicio o final, permite . en correos)
    if (
      typeof nombre !== 'string' ||
      typeof correo !== 'string' ||
      /[$]/.test(nombre) ||
      nombre.trim().length < 2 ||
      nombre.trim().length > 50 ||
      correo.trim().length < 6 ||
      correo.trim().length > 100 ||
      /[$]/.test(correo) ||
      correo.trim().startsWith('.') || correo.trim().endsWith('.')
    ) {
      return res.status(400).json({ mensaje: 'Datos inválidos detectados.' });
    }
    const contrasenaEncriptada = await bcrypt.hash(contrasena, 12);
    usuario = new Usuario({ nombre, correo, contrasena: contrasenaEncriptada });
    await usuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};

exports.iniciarSesion = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const { correo, contrasena } = req.body;
    // Normalizar correo para evitar problemas de mayúsculas/minúsculas y espacios
    const correoNormalizado = typeof correo === 'string' ? correo.trim().toLowerCase() : '';
    const usuario = await Usuario.findOne({ correo: correoNormalizado });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
    }
    if (typeof correo !== 'string' || /[$]/.test(correo)) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
    }
    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
    }
    const token = jwt.sign({ id: usuario._id, correo: usuario.correo }, process.env.JWT_SECRETO, { expiresIn: '1h' });
    res.json({ token, usuario: { nombre: usuario.nombre, correo: usuario.correo } });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

exports.cerrarSesion = (req, res) => {
  // El frontend debe eliminar el token del almacenamiento local
  res.json({ mensaje: 'Sesión cerrada correctamente' });
};

exports.enviarRecuperacion = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const { correo } = req.body;
    const usuario = await Usuario.findOne({ correo });
    // Mensaje genérico para evitar enumeración de usuarios
    if (!usuario) {
      return res.status(200).json({ mensaje: 'Si el correo existe, se enviará un mensaje de recuperación.' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    usuario.tokenRecuperacion = token;
    usuario.tokenExpiracion = Date.now() + 3600000; // 1 hora
    await usuario.save();
    const enlace = `${process.env.CLIENTE_URL}/restablecer-contrasena/${token}`;
    await enviarCorreo(correo, 'Recuperación de contraseña', `Haz clic en el siguiente enlace para restablecer tu contraseña: ${enlace}`);
    res.json({ mensaje: 'Si el correo existe, se enviará un mensaje de recuperación.' });
  } catch (error) {
    console.error('Error al enviar correo de recuperación:', error);
    res.status(500).json({ mensaje: 'Error al enviar correo de recuperación' });
  }
};

exports.restablecerContrasena = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const { token, nuevaContrasena } = req.body;
    const usuario = await Usuario.findOne({ tokenRecuperacion: token, tokenExpiracion: { $gt: Date.now() } });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Token inválido o expirado' });
    }
    usuario.contrasena = await bcrypt.hash(nuevaContrasena, 12);
    usuario.tokenRecuperacion = undefined;
    usuario.tokenExpiracion = undefined;
    await usuario.save();
    res.json({ mensaje: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({ mensaje: 'Error al restablecer contraseña' });
  }
};
