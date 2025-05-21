import React from 'react';
import PropTypes from 'prop-types';


const PanelDashboard = ({ usuario, onCerrarSesion }) => {
  return (
    <div className="panel-usuario">
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
