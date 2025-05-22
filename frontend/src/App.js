import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FormularioRegistro from './componentes/FormularioRegistro';
import FormularioInicioSesion from './componentes/FormularioInicioSesion';
import FormularioRecuperarContrasena from './componentes/FormularioRecuperarContrasena';
import PanelDashboard from './componentes/PanelDashboard';
import RestablecerContrasena from './componentes/RestablecerContrasena';


function App() {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const manejarLogin = (nuevoToken, datosUsuario) => {
    setToken(nuevoToken);
    setUsuario(datosUsuario);
    localStorage.setItem('token', nuevoToken);
  };

  const manejarCerrarSesion = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormularioInicioSesion onLogin={manejarLogin} />} />
        <Route path="/registro" element={<FormularioRegistro />} />
        <Route path="/recuperar-contrasena" element={<FormularioRecuperarContrasena />} />
        <Route path="/dashboard" element={token ? <PanelDashboard usuario={usuario} onCerrarSesion={manejarCerrarSesion} /> : <Navigate to="/" />} />
        <Route path="/restablecer-contrasena/:token" element={<RestablecerContrasena />} />
      </Routes>
    </Router>
  );
}

export default App;
