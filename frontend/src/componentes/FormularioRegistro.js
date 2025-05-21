import React, { useState } from 'react';
import axios from 'axios';

const FormularioRegistro = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState([]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErrores([]);
    try {
      const respuesta = await axios.post(`${process.env.REACT_APP_API_URL}/api/usuarios/registro`, {
        nombre,
        correo,
        contrasena
      });
      setMensaje(respuesta.data.mensaje);
      setNombre('');
      setCorreo('');
      setContrasena('');
    } catch (error) {
      if (error.response?.data?.errores) {
        setErrores(error.response.data.errores.map(e => e.msg));
      } else {
        setMensaje(error.response?.data?.mensaje || 'Error al registrar');
      }
    }
  };

  return (
    <form onSubmit={manejarEnvio}>
      <h2>Registro de Usuario</h2>
      {mensaje && <p>{mensaje}</p>}
      {errores.length > 0 && (
        <ul>
          {errores.map((err) => <li key={err}>{err}</li>)}
        </ul>
      )}
      <div>
        <label htmlFor="campo-nombre">Nombre:</label>
        <input
          id="campo-nombre"
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
      </div>
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
          minLength={6}
        />
      </div>
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default FormularioRegistro;
