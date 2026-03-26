import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardHome from './views/DashboardHome';
import StationMora from './views/StationMora';
import SubNavbar from './components/SubNavbar';
import './Dashboard.css'; 

export default function Dashboard() {
  const [seccionActual, setSeccionActual] = useState('Dashboard');
  const [temaActual, setTemaActual] = useState('theme-slate'); 

  const menuConfig = {
    'Dashboard': ["Dashboard"], 
    'Collection': [
      "Colección de Casos", "Reporte Diario", "Estadísticas de Cobranza", "Segmento de Cobranza", "Gestión de Aplicaciones"
    ],
    'Financial Accounting': [
      "Reporte Financiero", "Pagos Operativos", "Recolección Diaria"
    ],
    'Internal Audit': [
      "Usuarios en línea", "Diario del Sistema"
    ]
  };

  let opcionesSubMenu = ['Dashboard']; 
  Object.keys(menuConfig).forEach(carpeta => {
    if (carpeta === seccionActual || menuConfig[carpeta].includes(seccionActual)) {
      opcionesSubMenu = menuConfig[carpeta];
    }
  });

  const renderizarContenido = () => {
    if (seccionActual === 'Dashboard') return <DashboardHome />;
    if (seccionActual === 'Colección de Casos') return <StationMora />; 

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-muted)', minHeight: '400px' }}>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '5px' }}>{seccionActual} 🚧</h2>
        <p>Esta vista de {seccionActual} está en proceso de desarrollo.</p>
      </div>
    );
  };

  return (
    <div className={`dashboard-root ${temaActual}`} style={{ position: 'fixed', top: 0, left: 0, display: 'flex', height: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden' }}>
      <Sidebar cambiarSeccion={setSeccionActual} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Topbar seccion={seccionActual} tema={temaActual} setTema={setTemaActual} />
        <SubNavbar opciones={opcionesSubMenu} activo={seccionActual} setActivo={setSeccionActual} />
        <main className="dashboard-main-area" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {renderizarContenido()}
          </div>
        </main>
      </div>
    </div>
  );
}