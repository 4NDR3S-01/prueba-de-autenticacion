import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const FormularioInicioSesion = ({ onLogin }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState([]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErrores([]);
    try {
      const respuesta = await axios.post(`${process.env.REACT_APP_API_URL}/api/usuarios/iniciar-sesion`, {
        correo,
        contrasena
      });
      setMensaje('Inicio de sesión exitoso');
      onLogin(respuesta.data.token, respuesta.data.usuario);
      window.location.href = '/dashboard';
    } catch (error) {
      if (error.response?.data?.errores) {
        setErrores(error.response.data.errores.map(e => e.msg));
      } else {
        setMensaje(error.response?.data?.mensaje || 'Error al iniciar sesión');
      }
    }
  };

  return (
    <form onSubmit={manejarEnvio}>
      <h2>Iniciar Sesión</h2>
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
      <div>
        <label htmlFor="campo-contrasena">Contraseña:</label>
        <input
          id="campo-contrasena"
          type="password"
          value={contrasena}
          onChange={e => setContrasena(e.target.value)}
          required
        />
      </div>
      <button type="submit">Entrar</button>
    </form>
  );
};
FormularioInicioSesion.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default FormularioInicioSesion;

