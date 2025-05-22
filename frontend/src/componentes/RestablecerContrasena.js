import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RestablecerContrasena = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const respuesta = await axios.post(`${process.env.REACT_APP_API_URL}/usuarios/restablecer-contrasena/${token}`, { contrasena });
      setMensaje(respuesta.data.mensaje);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'Error al restablecer la contraseña');
    }
    setCargando(false);
  };

  return (
    <div className="formulario-contenedor">
      <form className="formulario" onSubmit={manejarEnvio}>
        <h2 className="formulario-titulo">Restablecer Contraseña</h2>
        <input
          className="formulario-input"
          type="password"
          placeholder="Nueva contraseña"
          value={contrasena}
          onChange={e => setContrasena(e.target.value)}
          minLength={8}
          required
        />
        <button className="formulario-boton" type="submit" disabled={cargando}>
          {cargando ? 'Restableciendo...' : 'Restablecer'}
        </button>
        {mensaje && <p className="formulario-mensaje">{mensaje}</p>}
      </form>
    </div>
  );
};

export default RestablecerContrasena;