import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, Users, LogOut, Wifi, Clock } from 'lucide-react';
import './Topbar.css';

export default function Topbar({ seccion, tema, setTema }) {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  
  // 🧠 ESTADOS PARA LA TELEMETRÍA (Reloj y Ping)
  const [timeCDMX, setTimeCDMX] = useState('');
  const [ping, setPing] = useState(18);

  // ⚙️ EFECTO EN TIEMPO REAL: Se ejecuta cuando la barra carga
  useEffect(() => {
    // 1. Función para calcular la hora exacta de CDMX
    const updateTime = () => {
      const options = { 
        timeZone: 'America/Mexico_City', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      };
      setTimeCDMX(new Intl.DateTimeFormat('es-MX', options).format(new Date()));
    };
    
    updateTime(); // Calculamos la hora de inmediato
    const timeInterval = setInterval(updateTime, 1000); // Y la actualizamos cada 1 segundo (1000ms)

    // 2. Simulador de fluctuación de red (Ping)
    const pingInterval = setInterval(() => {
      // Genera un número aleatorio realista entre 12ms y 35ms
      setPing(Math.floor(Math.random() * (35 - 12 + 1) + 12)); 
    }, 3500); // Se actualiza cada 3.5 segundos para parecer una conexión real

    // Limpieza al desmontar el componente
    return () => { 
      clearInterval(timeInterval); 
      clearInterval(pingInterval); 
    };
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="topbar-container">
      
      {/* --- 1. LADO IZQUIERDO: SECCIÓN --- */}
      <div className="topbar-left">
        <span className="seccion-label">Sección:</span>
        <span className="seccion-title">{seccion}</span>
      </div>

      {/* --- 2. CENTRO: TELEMETRÍA (INTERNET Y HORA CDMX) --- */}
      <div className="topbar-telemetry">
        <div className="telemetry-item" title="Latencia del Servidor">
          <Wifi size={14} className="telemetry-icon-green" />
          <span>{ping} ms</span>
        </div>
        <div className="telemetry-divider"></div>
        <div className="telemetry-item" title="Hora Centro de México">
          <Clock size={14} className="telemetry-icon-blue" />
          <span>{timeCDMX} CDMX</span>
        </div>
      </div>

      {/* --- 3. LADO DERECHO: ÍCONOS Y AJUSTES --- */}
      <div className="topbar-right">
        
        {/* Menú de Ajustes / Temas */}
        <div className="icon-btn-wrapper">
          <button className="icon-btn" onClick={() => setShowSettings(!showSettings)} title="Ajustes de Tema">
            <Settings size={16} />
          </button>
          
          {showSettings && (
            <div className="settings-menu">
              <span className="settings-header">APARIENCIA</span>
              <button className={`theme-option ${tema === 'theme-light' ? 'active-theme' : ''}`} onClick={() => {setTema('theme-light'); setShowSettings(false);}}>Blanco Puro</button>
              <button className={`theme-option ${tema === 'theme-slate' ? 'active-theme' : ''}`} onClick={() => {setTema('theme-slate'); setShowSettings(false);}}>Gris Pizarra</button>
              <button className={`theme-option ${tema === 'theme-dark' ? 'active-theme' : ''}`} onClick={() => {setTema('theme-dark'); setShowSettings(false);}}>Modo Nocturno</button>
            </div>
          )}
        </div>
        
        {/* Notificaciones */}
        <button className="icon-btn notification-btn" title="Notificaciones">
          <Bell size={16} />
          <span className="notification-dot"></span>
        </button>

        {/* Usuarios */}
        <button className="icon-btn" title="Usuarios">
          <Users size={16} />
        </button>

        <div className="topbar-divider"></div>

        {/* Botón Salir */}
        <button className="logout-btn" onClick={handleLogout} title="Cerrar Sesión">
          <LogOut size={14} /> Salir
        </button>
      </div>
    </header>
  );
}