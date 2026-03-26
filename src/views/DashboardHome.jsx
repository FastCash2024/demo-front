import React, { useState, useEffect } from 'react';

export default function DashboardHome() {
  // 1. Creamos la variable de estado para tu nombre
  const [nombreUsuario, setNombreUsuario] = useState('Cargando...');

  // 2. Apenas cargue esta vista, buscamos tu nombre en la bóveda
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('crmUser');
    
    if (usuarioGuardado) {
      // Cortamos lo que está después del "@" (o usamos el nombre completo si es "Admin-DataBase-Dev")
      const nombreCorto = usuarioGuardado.split('@')[0];
      setNombreUsuario(nombreCorto);
    } else {
      setNombreUsuario('Asesor');
    }
  }, []);

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* SECCIÓN DEL SALUDO DINÁMICO */}
      <div className="dashboard-header">
        {/* 👇 Aquí inyectamos tu nombre 👇 */}
        <h2 style={{ color: 'var(--text-main)', fontSize: '28px', margin: '0 0 10px 0' }}>
          Hola, {nombreUsuario} 👋
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          Aquí tienes el resumen de tu gestión financiera del día.
        </p>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 0 10px 0' }}>CARTERA TOTAL</h4>
          <h2 style={{ color: 'var(--text-main)', fontSize: '24px', margin: '0 0 5px 0' }}>$1,245,000</h2>
          <span style={{ color: '#2ecc71', fontSize: '12px' }}>+2.4% vs mes pasado</span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 0 10px 0' }}>RECAUDACIÓN HOY</h4>
          <h2 style={{ color: 'var(--text-main)', fontSize: '24px', margin: '0 0 5px 0' }}>$45,300</h2>
          <span style={{ color: '#2ecc71', fontSize: '12px' }}>+12.5% vs ayer</span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 0 10px 0' }}>CASOS EN MORA</h4>
          <h2 style={{ color: 'var(--text-main)', fontSize: '24px', margin: '0 0 5px 0' }}>142</h2>
          <span style={{ color: '#e74c3c', fontSize: '12px' }}>-5 casos cerrados hoy</span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 0 10px 0' }}>TASA EFECTIVIDAD</h4>
          <h2 style={{ color: 'var(--text-main)', fontSize: '24px', margin: '0 0 5px 0' }}>87.4%</h2>
          <span style={{ color: '#2ecc71', fontSize: '12px' }}>+1.2% vs sem pasada</span>
        </div>

      </div>

      {/* ESPACIO PARA EL GRÁFICO */}
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Gráfico de Tendencia de Cobranza (Próximamente)</p>
      </div>

    </div>
  );
}