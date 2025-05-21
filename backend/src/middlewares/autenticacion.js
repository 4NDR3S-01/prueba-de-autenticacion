const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Solo acepta tokens tipo Bearer
  const cabecera = req.headers['authorization'] || '';
  if (!cabecera.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'No autorizado' });
  }
  const token = cabecera.split(' ')[1];
  if (!token) {
    return res.status(401).json({ mensaje: 'No autorizado' });
  }
  try {
    const datos = jwt.verify(token, process.env.JWT_SECRETO);
    req.usuario = datos;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(401).json({ mensaje: 'No autorizado' });
  }
};
