import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// 👇 RECIBIMOS cambiarSeccion
export default function SidebarItem({ item, isCollapsed, activeItem, setActiveItem, cambiarSeccion }) {
  const [isOpen, setIsOpen] = useState(false);

  const IconComponent = item.icon;
  const isDropdown = !!item.subItems;
  const isActive = activeItem === item.id;

  const handleMainClick = () => {
    if (isDropdown) {
      setIsOpen(!isOpen);
    } else {
      // Si es un botón sin submenú (como Dashboard), cambiamos el título de arriba
      cambiarSeccion(item.label);
    }
    setActiveItem(item.id);
  };

  // 👇 Esta función se ejecuta al tocar un sub-producto
  const handleSubItemClick = (e, subId, subLabel) => {
    e.stopPropagation();
    setActiveItem(subId);
    cambiarSeccion(subLabel); // 👈 ACTUALIZA EL TEXTO DE LA TOPBAR
  };

  return (
    <>
      <li 
        className={`${isDropdown ? 'menu-item-dropdown' : 'menu-item'} ${isActive ? 'active' : ''}`}
        onClick={handleMainClick}
        title={item.label}
      >
        <div className="menu-item-content">
          <IconComponent size={20} className="menu-icon" /> 
          {!isCollapsed && <span>{item.label}</span>}
        </div>
        {isDropdown && !isCollapsed && (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
      </li>
      
      {isDropdown && !isCollapsed && isOpen && (
        <ul className="submenu-list">
          {item.subItems.map((sub) => (
            <li 
              key={sub.id}
              className={`menu-subitem ${activeItem === sub.id ? 'active-subitem' : ''}`} 
              onClick={(e) => handleSubItemClick(e, sub.id, sub.label)} // 👈 PASAMOS EL ID Y LA ETIQUETA
            >
              {sub.label}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}