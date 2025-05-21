import React, { useState } from 'react';
import axios from 'axios';

const FormularioRecuperarContrasena = () => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState([]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErrores([]);
    try {
      const respuesta = await axios.post(`${process.env.REACT_APP_API_URL}/api/usuarios/recuperar-contrasena`, {
        correo
      });
      setMensaje(respuesta.data.mensaje);
    } catch (error) {
      if (error.response?.data?.errores) {
        setErrores(error.response.data.errores.map(e => e.msg));
      } else {
        setMensaje(error.response?.data?.mensaje || 'Error al enviar correo');
      }
    }
  };

  return (
    <form onSubmit={manejarEnvio}>
      <h2>Recuperar Contraseña</h2>
      {mensaje && <p>{mensaje}</p>}
      {errores.length > 0 && (
        <ul>
          {errores.map((err) => <li key={err}>{err}</li>)}
        </ul>
      )}
      <div>
        <label htmlFor="campo-correo">Correo:</label>
        <input
          id="campo-correo"
          type="email"
          value={correo}
          onChange={e => setCorreo(e.target.value)}
          required
        />
      </div>
      <button type="submit">Enviar correo de recuperación</button>
    </form>
  );
};

export default FormularioRecuperarContrasena;
