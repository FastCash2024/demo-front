import React from 'react';

export default function SubNavbar({ opciones, activo, setActivo }) {
  return (
    <div style={{ 
      backgroundColor: 'var(--bg-topbar)', 
      display: 'flex', 
      alignItems: 'center', 
      padding: '0 20px', 
      overflowX: 'auto', 
      borderBottom: '1px solid var(--border-color)', 
      flexShrink: 0,
      minHeight: '32px' // 👈 1. Lo bajamos de 40px a 32px (Súper delgado)
    }}>
      {opciones.map((opcion) => {
        const isActivo = activo === opcion;
        return (
          <div 
            key={opcion} 
            onClick={() => setActivo(opcion)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '8px 14px', // 👈 2. Menos espacio arriba y abajo para que no estire la barra
              cursor: 'pointer', 
              color: isActivo ? '#00ff9d' : 'var(--text-muted)', 
              fontSize: '11px', // 👈 3. Letra un poco más pequeña, ideal para barras secundarias
              fontWeight: isActivo ? 600 : 500,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              borderBottom: isActivo ? '2px solid #00ff9d' : '2px solid transparent',
              marginBottom: '-1px', // Mantiene la línea verde pegada al borde
              textTransform: 'uppercase', // Opcional: le da un look más ordenado
              letterSpacing: '0.5px'
            }}
          >
            {/* Puntito indicador más pequeñito */}
            <div style={{ 
              width: '4px', 
              height: '4px', 
              borderRadius: '50%', 
              backgroundColor: isActivo ? '#00ff9d' : 'var(--text-muted)',
              boxShadow: isActivo ? '0 0 4px #00ff9d' : 'none',
              transition: 'all 0.2s'
            }} />
            {opcion}
          </div>
        );
      })}
    </div>
  );
}