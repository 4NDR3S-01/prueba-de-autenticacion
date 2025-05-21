import React from 'react';
import PropTypes from 'prop-types';

const PanelDashboard = ({ usuario, onCerrarSesion }) => {
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', background: '#fff', padding: '2rem', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
      <h2>Panel de Usuario</h2>
      <p>¡Sesión iniciada correctamente!</p>
      <p>Bienvenido, <b>{usuario?.nombre}</b></p>
      <button onClick={onCerrarSesion}>Cerrar sesión</button>
    </div>
  );
};

// Validación de propiedades
PanelDashboard.propTypes = {
  usuario: PropTypes.shape({
    nombre: PropTypes.string.isRequired
  }).isRequired,
  onCerrarSesion: PropTypes.func.isRequired
};

export default PanelDashboard;
