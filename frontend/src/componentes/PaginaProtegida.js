import React from 'react';
import PropTypes from 'prop-types';

const PaginaProtegida = ({ usuario, onCerrarSesion }) => {
  return (
    <div>
      <h2>Bienvenido, {usuario?.nombre}</h2>
      <p>Esta es una página protegida. Solo puedes verla si has iniciado sesión.</p>
      <button onClick={onCerrarSesion}>Cerrar sesión</button>
    </div>
  );
};

PaginaProtegida.propTypes = {
  usuario: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
  }).isRequired,
  onCerrarSesion: PropTypes.func.isRequired,
};

export default PaginaProtegida;
