import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, MessageCircle, Send } from 'lucide-react';
import axios from 'axios'; 
import BotonesOperar from '../components/BotonesOperar';

export default function StationMora() {
  // ==========================================
  // 1. DATOS REALES DESDE EL BACKEND
  // ==========================================
  const [casos, setCasos] = useState([]); 
  const [cargando, setCargando] = useState(true); 
  const [errorSistema, setErrorSistema] = useState(null); 

  const obtenerCasos = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('crmToken');

      const respuesta = await axios.get('http://localhost:3000/api/prestamos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Guardamos la información que viene del backend
      setCasos(respuesta.data.prestamos);
      setErrorSistema(null);
    } catch (error) {
      console.error("Error al cargar casos:", error);
      setErrorSistema("No se pudo conectar con la base de datos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerCasos();
  }, []);

  // ==========================================
  // 2. LÓGICA DE PAGINACIÓN 
  // ==========================================
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10); 

  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
  const casosActuales = casos.slice(indicePrimerRegistro, indiceUltimoRegistro);
  
  const totalPaginas = Math.ceil(casos.length / registrosPorPagina);

  const irPaginaAnterior = () => { if (paginaActual > 1) setPaginaActual(paginaActual - 1); };
  const irPaginaSiguiente = () => { if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1); };
  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  const manejarCambioRegistros = (e) => {
    setRegistrosPorPagina(Number(e.target.value));
    setPaginaActual(1);
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* PANEL DE FILTROS SUPERIOR */}
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px 30px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-main)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ width: '150px', textAlign: 'right', paddingRight: '15px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500 }}>Productos del proyecto:</label>
            <select style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}><option>Todos</option></select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ width: '150px', textAlign: 'right', paddingRight: '15px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500 }}>Número de teléfono:</label>
            <input type="text" placeholder="Ej. +52..." style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ width: '150px', textAlign: 'right', paddingRight: '15px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500 }}>Nombre del cliente:</label>
            <input type="text" style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px', marginTop: '5px', paddingLeft: '165px' }}>
          <button onClick={obtenerCasos} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 5px rgba(37,99,235,0.3)' }}> 
            Consultar 
          </button>
          <button style={{ backgroundColor: '#06b6d4', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 5px rgba(6,182,212,0.3)' }}> 
            Restablecer 
          </button>
        </div>
      </div>

      {/* TABLA EJECUTIVA */}
      <div style={{ flex: 1, minHeight: '0', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px var(--shadow-color)' }}>
        
        {errorSistema && (
          <div style={{ padding: '15px', backgroundColor: '#fee2e2', color: '#b91c1c', textAlign: 'center' }}>{errorSistema}</div>
        )}

        <div className="table-scroll-wrapper">
          <table className="tabla-dark-excel">
            <thead>
              <tr>
                <th>CONTACTOS</th>
                <th>CLIENTE</th>
                <th>TELÉFONO</th>
                <th>VALOR ADEUDADO (MXN)</th>
                <th>FECHA LÍMITE</th>
                <th>DÍAS MORA</th>
                <th>ESTADO</th>
                <th>OPERAR</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>⏳ Cargando base de datos...</td></tr>
              ) : casosActuales.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>No se encontraron préstamos registrados.</td></tr>
              ) : (
                casosActuales.map((caso, index) => {
                  // Pequeña lógica para calcular los días de mora de forma segura
                  let diasMora = 0;
                  if (caso?.cicloDeVida?.fechas?.fechaDeCobro) {
                    const fechaCobro = new Date(caso.cicloDeVida.fechas.fechaDeCobro);
                    const hoy = new Date();
                    if (hoy > fechaCobro) {
                      diasMora = Math.floor((hoy - fechaCobro) / (1000 * 60 * 60 * 24));
                    }
                  }

                  return (
                    <tr key={caso._id || index}>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <MessageCircle size={16} color="#22c55e" style={{ cursor: 'pointer' }} />
                          <Send size={16} color="#0ea5e9" style={{ cursor: 'pointer' }} />
                        </div>
                      </td>
                      
                      {/* 1. Cliente */}
                      <td style={{ fontWeight: 500 }}>
                        {caso?.solicitud?.cliente?.nombreDelCliente || 'Desconocido'}
                      </td>
                      
                      {/* 2. Teléfono */}
                      <td style={{ color: '#3b82f6', cursor: 'pointer' }}>
                        {caso?.solicitud?.cliente?.numeroDeTelefonoMovil || 'Sin teléfono'}
                      </td>
                      
                      {/* 3. Valor Adeudado (Convertimos de centavos a pesos) */}
                      <td style={{ fontWeight: 700, color: '#ef4444' }}>
                        ${((caso?.solicitud?.montos?.valorAdeudadoCentavos || 0) / 100).toFixed(2)}
                      </td>
                      
                      {/* 4. Fecha Límite */}
                      <td className="texto-mutado">
                        {caso?.cicloDeVida?.fechas?.fechaDeCobro 
                          ? new Date(caso.cicloDeVida.fechas.fechaDeCobro).toLocaleDateString() 
                          : 'Sin fecha'}
                      </td>
                      
                      {/* 5. Días Mora Calculados */}
                      <td style={{ fontWeight: 800 }}>
                        {diasMora}
                      </td>
                      
                      {/* 6. Estado del Crédito */}
                      <td style={{ color: caso?.cicloDeVida?.estadoDeCredito === 'Mora' ? '#ef4444' : '#22c55e', fontWeight: 600, textTransform: 'capitalize' }}>
                        {caso?.cicloDeVida?.estadoDeCredito || 'Desconocido'}
                      </td>
                      
                      <td>
                        <BotonesOperar caso={caso} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginador Inferior */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <span>Mostrar</span>
            <select value={registrosPorPagina} onChange={manejarCambioRegistros} className="select-paginador">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>registros</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500 }}>
            Mostrando {casos.length === 0 ? 0 : indicePrimerRegistro + 1} al {Math.min(indiceUltimoRegistro, casos.length)} de {casos.length} resultados
          </div>
          <div style={{ display: 'flex', gap: '6px', fontSize: '13px' }}>
            <button onClick={irPaginaAnterior} disabled={paginaActual === 1} style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', background: paginaActual === 1 ? 'rgba(0,0,0,0.05)' : 'transparent', color: paginaActual === 1 ? 'var(--text-muted)' : 'var(--text-main)', cursor: paginaActual === 1 ? 'not-allowed' : 'pointer' }}>Anterior</button>
            <button onClick={irPaginaSiguiente} disabled={paginaActual === totalPaginas || totalPaginas === 0} style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', background: paginaActual === totalPaginas ? 'rgba(0,0,0,0.05)' : 'transparent', color: paginaActual === totalPaginas ? 'var(--text-muted)' : 'var(--text-main)', cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer' }}>Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}