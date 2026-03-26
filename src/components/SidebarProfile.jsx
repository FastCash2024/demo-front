import React from 'react';

export default function SidebarProfile({ isCollapsed }) {
  return (
    <div className="sidebar-profile-centered">
      <div className="avatar-wrapper">
        <div className="avatar-circle">
          <img 
            src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=300&auto=format&fit=crop" 
            alt="Avatar de Jennifer" 
            className="avatar-image" 
          />
        </div>
        <div className="avatar-badge">N</div>
      </div>
      
      {/* Si el menú no está colapsado, mostramos los nombres */}
      {!isCollapsed && (
        <div className="user-info-centered">
          <span className="user-name">Brandon Morales</span>
          <span className="user-role">Super Manage Dev</span>
        </div>
      )}
    </div>
  );
}