import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';

// 👇 1. Importamos la nueva pantalla del Perfil del Cliente
// (Nota: Si guardaste PerfilCliente en la carpeta 'views', cambia 'components' por 'views')
import PerfilCliente from './components/PerfilCliente'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Si entras a la ruta raíz (/), muestra el Login */}
        <Route path="/" element={<Login />} />
        
        {/* Si entras a /dashboard, muestra el Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 👇 2. Registramos la nueva ruta para que funcione al abrir la pestaña nueva */}
        <Route path="/perfil-cliente" element={<PerfilCliente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;