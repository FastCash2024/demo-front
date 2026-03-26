import React, { useState, useEffect, useRef } from 'react';
import { Menu, LayoutDashboard, FolderOpen, Briefcase, ShieldCheck, ChevronDown, ChevronRight } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ cambiarSeccion }) {
  const [isExpanded, setIsExpanded] = useState(false); 
  const [menuAbierto, setMenuAbierto] = useState('Collection');
  
  // Estado para saber qué sub-producto o sección principal está pintada
  const [itemActivo, setItemActivo] = useState('Dashboard'); 
  
  const sidebarRef = useRef(null);

  // DETECTOR DE CLICS FUERA DE LA BARRA
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsExpanded(false); 
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menu) => {
    setIsExpanded(true); 
    setMenuAbierto(menuAbierto === menu ? '' : menu);
  };

  // Función para elementos principales (como Dashboard)
  const handleItemClick = (seccion) => {
    setItemActivo(seccion); 
    cambiarSeccion(seccion);
  };

  // Función específica para sub-productos
  const handleSubItemClick = (e, item) => {
    e.stopPropagation();
    setItemActivo(item); 
    cambiarSeccion(item); 
  };

  return (
    <aside 
      ref={sidebarRef}
      className={`sidebar-root ${isExpanded ? 'expanded' : 'collapsed'}`}
      onClick={() => { if (!isExpanded) setIsExpanded(true); }} 
    >
      
      {/* 🟢 CABECERA VERDE LOGO */}
      <div className="sidebar-header">
        <div className="sidebar-logo-text">
          {isExpanded && <span>DINERO PRESTA</span>}
        </div>
        <button 
          className="btn-hamburger" 
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
        >
          <Menu size={20} color="#172647" />
        </button>
      </div>

      {/* 👤 PERFIL DE USUARIO */}
      <div className="sidebar-profile">
        <div className="avatar-wrapper">
          <img 
            src="https://i.pravatar.cc/150?img=33" 
            alt="User" 
            className="profile-avatar"
          />
          <div className="status-dot">N</div>
        </div>
        {isExpanded && (
          <div className="profile-info">
            <span className="profile-name">Brandon Morales</span>
            <span className="profile-role">SUPER MANAGE DEV</span>
          </div>
        )}
      </div>

      {/* 🗂️ NAVEGACIÓN */}
      <nav className="sidebar-nav">
        
        {/* 1. Dashboard */}
        <div 
          className={`nav-item-simple ${itemActivo === 'Dashboard' ? 'item-pintado' : ''}`} 
          onClick={() => handleItemClick('Dashboard')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LayoutDashboard size={18} className="nav-icon" />
            {isExpanded && <span className="nav-label">Dashboard</span>}
          </div>
        </div>

        {/* 2. Collection */}
        <div className="nav-folder">
          <div className={`nav-folder-header ${menuAbierto === 'Collection' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleMenu('Collection'); }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FolderOpen size={18} className="nav-icon" />
              {isExpanded && <span className="nav-label">Collection</span>}
            </div>
            {isExpanded && (
              menuAbierto === 'Collection' ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            )}
          </div>
          
          <div className={`submenu-animado ${isExpanded && menuAbierto === 'Collection' ? 'abierto' : ''}`}>
            <div className="submenu-interno">
              {['Colección de Casos', 'Reporte Diario', 'Estadísticas de Cobranza', 'Segmento de Cobranza', 'Gestión de Aplicaciones'].map(item => (
                <div 
                  key={item} 
                  className={`nav-sub-item ${itemActivo === item ? 'subitem-pintado' : ''}`} 
                  onClick={(e) => handleSubItemClick(e, item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Financial Accounting */}
        <div className="nav-folder">
          <div className={`nav-folder-header ${menuAbierto === 'Financial' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleMenu('Financial'); }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Briefcase size={18} className="nav-icon" />
              {isExpanded && <span className="nav-label">Financial Accounting</span>}
            </div>
            {isExpanded && (
              menuAbierto === 'Financial' ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            )}
          </div>
          
          <div className={`submenu-animado ${isExpanded && menuAbierto === 'Financial' ? 'abierto' : ''}`}>
            <div className="submenu-interno">
              {['Reporte Financiero', 'Pagos Operativos', 'Recolección Diaria'].map(item => (
                <div 
                  key={item} 
                  className={`nav-sub-item ${itemActivo === item ? 'subitem-pintado' : ''}`} 
                  onClick={(e) => handleSubItemClick(e, item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Internal Audit */}
        <div className="nav-folder">
          <div 
            className={`nav-folder-header ${menuAbierto === 'Audit' ? 'highlight-green active' : ''}`} 
            onClick={(e) => { e.stopPropagation(); toggleMenu('Audit'); }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Aquí está arreglado el ícono: tomará el color del texto automáticamente si no está activo */}
              <ShieldCheck 
                size={18} 
                className="nav-icon" 
                color={menuAbierto === 'Audit' ? "#172647" : "currentColor"} 
              />
              {isExpanded && (
                <span 
                  className="nav-label" 
                  style={{ 
                    color: menuAbierto === 'Audit' ? '#172647' : '', 
                    fontWeight: menuAbierto === 'Audit' ? 700 : 500 
                  }}
                >
                  Internal Audit
                </span>
              )}
            </div>
            {isExpanded && (
              menuAbierto === 'Audit' ? <ChevronDown size={14} color="#172647" /> : <ChevronRight size={14} />
            )}
          </div>
          
          <div className={`submenu-animado ${isExpanded && menuAbierto === 'Audit' ? 'abierto' : ''}`}>
            <div className="submenu-interno">
              {['Usuarios en línea', 'Diario del Sistema'].map(item => (
                <div 
                  key={item} 
                  className={`nav-sub-item ${itemActivo === item ? 'subitem-pintado' : ''}`} 
                  onClick={(e) => handleSubItemClick(e, item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

      </nav>
    </aside>
  );
}