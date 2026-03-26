import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Smartphone, User, Camera, CheckCircle, MapPin, 
  Briefcase, GraduationCap, ShieldCheck, Map, 
  FileText, Send, MessageSquare, CreditCard, 
  ChevronRight, ArrowLeft, Lock, Sun, Moon,
  Landmark, Calendar, CalendarCheck, Settings, Search
} from 'lucide-react';

// Función para mapear datos del Prestamo completo al formato que PerfilCliente espera
const mapearDatosDelPrestamo = (prestamo) => {
  if (!prestamo) return {};
  
  return {
    _id: prestamo._id,
    cliente: prestamo.solicitud?.cliente?.nombreDelCliente || 'Sin nombre',
    idSebFactura: prestamo.numeroDePrestamo || 'N/A',
    adeudado: (prestamo.solicitud?.montos?.valorAdeudadoCentavos || 0) / 100, // Convertir centavos a pesos
    telefono: prestamo.solicitud?.cliente?.numeroDeTelefonoMovil || 'N/A',
    email: prestamo.solicitud?.cliente?.email || 'N/A',
    curp: prestamo.solicitud?.cliente?.curp || 'N/A',
    rfc: prestamo.solicitud?.cliente?.rfc || 'N/A',
    urlCurpFrontal: prestamo.solicitud?.cliente?.urlCurpFrontal || null,
    urlCurpReverso: prestamo.solicitud?.cliente?.urlCurpReverso || null,
    urlSelfie: prestamo.solicitud?.cliente?.urlSelfie || null,
    dispositivo: prestamo.solicitud?.dispositivo || {},
    montos: prestamo.solicitud?.montos || {},
    fechas: prestamo.cicloDeVida?.fechas || {},
    acotaciones: prestamo.operacion?.acotaciones || [],
    estadoDeCredito: prestamo.cicloDeVida?.estadoDeCredito || 'N/A',
    estadoDeComunicacion: prestamo.operacion?.cobranza?.estadoDeComunicacion || 'N/A',
    prestamoCompleto: prestamo // Guardar el objeto completo para acceso posterior
  };
};

export default function PerfilCliente() {
  const { id } = useParams();
  const [caso, setCaso] = useState(null);
  const [pestañaActiva, setPestañaActiva] = useState('informacion');
  
  // Estados para los buscadores
  const [busquedaContactos, setBusquedaContactos] = useState('');
  const [busquedaSms, setBusquedaSms] = useState('');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('perfilTheme') !== 'light';
  });

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('perfilTheme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datosGuardados = localStorage.getItem('clienteEnDetalle');
        if (datosGuardados) {
          const prestamoLocal = JSON.parse(datosGuardados);
          // Mapear datos del Prestamo al formato esperado por PerfilCliente
          const casoMapeado = mapearDatosDelPrestamo(prestamoLocal);
          setCaso(casoMapeado);
          return;
        }

        // Si no hay cliente en localStorage, usar id en route param o query string
        let loanId = id || null;
        if (!loanId) {
          const params = new URLSearchParams(window.location.search);
          loanId = params.get('id');
        }

        if (!loanId) {
          setCaso({ error: 'No se encontró cliente en localStorage ni id en la URL. Abre perfil desde la tabla de préstamos.' });
          return;
        }

        // Obtener token del localStorage
        const token = localStorage.getItem('authToken');
        
        // Nueva URL: Consumir endpoint backend local para datos completos del Prestamo
        const response = await fetch(`http://localhost:3000/api/prestamos/detalle/${loanId}`, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

        const prestamoCompleto = await response.json();
        // Mapear estructura del Prestamo al formato que PerfilCliente espera
        const casoMapeado = mapearDatosDelPrestamo(prestamoCompleto);
        setCaso(casoMapeado);
      } catch (error) {
        console.error('Error cargando cliente en PerfilCliente:', error);
        setCaso({ error: error.message || 'Error inesperado al cargar perfil' });
      }
    };

    cargarDatos();
  }, []);

  // TEMA INDEPENDIENTE
  const theme = isDarkMode ? {
    bgMain: '#0f172a',
    bgCard: '#1e293b',
    bgDarker: '#0b1120',
    border: '#334155',
    textMain: '#f8fafc',
    textMuted: '#94a3b8',
    accentGreen: '#10b981',
    accentPurple: '#8b5cf6',
    accentBlue: '#3b82f6',
    shadow: 'rgba(0, 0, 0, 0.4)'
  } : {
    bgMain: '#f1f5f9',
    bgCard: '#ffffff',
    bgDarker: '#f8fafc',
    border: '#e2e8f0',
    textMain: '#0f172a',
    textMuted: '#64748b',
    accentGreen: '#059669',
    accentPurple: '#7c3aed',
    accentBlue: '#2563eb',
    shadow: 'rgba(0, 0, 0, 0.05)'
  };

  const cardStyle = {
    backgroundColor: theme.bgCard,
    border: `1px solid ${theme.border}`,
    borderRadius: '10px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: `0 4px 6px -1px ${theme.shadow}`,
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    height: '100%'
  };

  const badgeVerificado = (
    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#d1fae5', color: theme.accentGreen, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
      <CheckCircle size={14} /> Estado Verificado
    </span>
  );

  const renderBadge = (text, type) => {
    let style = { padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    if (type === 'success') { style.backgroundColor = '#a3e635'; style.color = '#000'; } 
    else if (type === 'warning') { style.backgroundColor = '#f59e0b'; style.color = '#fff'; } 
    else if (type === 'danger') { style.backgroundColor = '#ef4444'; style.color = '#fff'; } 
    return <span style={style}>{text}</span>;
  };

  // DATOS SIMULADOS PARA CONTACTOS Y SMS
  const mockContactos = [
    { nombre: 'Mamá', telefono: '+52 555 123 4567' },
    { nombre: 'Juan Pérez (Trabajo)', telefono: '+52 555 987 6543' },
    { nombre: 'Hermano', telefono: '+52 555 456 7890' },
    { nombre: 'Emergencia', telefono: '+52 555 000 0000' },
    { nombre: 'Tía María', telefono: '+52 555 333 2222' },
    { nombre: 'Oficina RH', telefono: '+52 555 888 7777' },
  ];

  const mockSms = [
    { telefono: '+52 555 999 8888', mensaje: 'Hola, te confirmo que el depósito ya fue realizado a la cuenta terminación 1234. Saludos.' },
    { telefono: 'Banco Azteca', mensaje: 'Tu código de verificación es 8473. No lo compartas con nadie por motivos de seguridad.' },
    { telefono: '+52 555 111 2222', mensaje: '¿A qué hora pasas por los niños a la escuela?' },
    { telefono: 'Dineropresta', mensaje: 'Recordatorio: Tu pago de $150 MXN vence el día de mañana. Evita cargos moratorios.' },
    { telefono: '+52 555 444 5555', mensaje: 'Ok, nos vemos en el restaurante a las 8pm.' },
  ];

  // FILTROS
  const contactosFiltrados = mockContactos.filter(c => 
    c.nombre.toLowerCase().includes(busquedaContactos.toLowerCase()) || 
    c.telefono.includes(busquedaContactos)
  );

  const smsFiltrados = mockSms.filter(s => 
    s.telefono.toLowerCase().includes(busquedaSms.toLowerCase()) || 
    s.mensaje.toLowerCase().includes(busquedaSms.toLowerCase())
  );

  if (!caso) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: theme.bgMain, color: theme.textMain, margin: 0 }}>
        <h2>Cargando Comando Central...</h2>
      </div>
    );
  }

  if (caso.error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: theme.bgMain, color: theme.textMain, margin: 0, padding: '24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px' }}>
          <h2>Hubo un problema al cargar el perfil</h2>
          <p style={{ color: theme.textMuted, margin: '12px 0' }}>{caso.error}</p>
          <p style={{ color: theme.textMuted, fontSize: '14px' }}>Asegúrate de ir desde la tabla con la selección correcta o añade <code>?id=&lt;loanId&gt;</code> a la URL.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: theme.bgMain, color: theme.textMain, 
      fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>

      {/* TOPBAR Y SUB-NAVBAR SUPERIOR */}
      <div style={{ 
        position: 'sticky', top: 0, zIndex: 100, 
        backgroundColor: theme.bgCard, borderBottom: `1px solid ${theme.border}`, 
        padding: '0 30px', boxShadow: `0 4px 15px ${theme.shadow}`, flexShrink: 0,
        transition: 'background-color 0.3s ease'
      }}>
        
        {/* TOPBAR */}
        <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              onClick={() => window.close()} 
              style={{ background: 'transparent', border: 'none', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 'bold', padding: 0 }}
            >
              <ArrowLeft size={20} /> Volver a Tabla
            </button>
            <div style={{ height: '26px', width: '1px', backgroundColor: theme.border, margin: '0 5px' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', color: theme.textMain }}>
              <ChevronRight size={16} color={theme.textMuted} /> 
              <span style={{ fontWeight: 'bold' }}>{caso.cliente}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={toggleTheme} title="Cambiar Tema" style={{ background: 'transparent', border: 'none', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '5px' }}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <span style={{ backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#dbeafe', color: theme.accentBlue, padding: '6px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>
              Factura: {caso.idSebFactura}
            </span>
          </div>
        </div>

        {/* SUBNAVBAR */}
        <div style={{ display: 'flex', gap: '35px', fontSize: '14px', fontWeight: '600', marginTop: '5px' }}>
          <button onClick={() => setPestañaActiva('informacion')} style={{ background: 'transparent', border: 'none', borderBottom: pestañaActiva === 'informacion' ? `2px solid ${theme.accentPurple}` : '2px solid transparent', color: pestañaActiva === 'informacion' ? theme.textMain : theme.textMuted, padding: '0 0 14px 0', cursor: 'pointer', marginBottom: '-1px', fontWeight: 'bold', transition: 'all 0.2s' }}>
            Información General {pestañaActiva === 'informacion' && '[Activo]'}
          </button>
          <button onClick={() => setPestañaActiva('contactos')} style={{ background: 'transparent', border: 'none', borderBottom: pestañaActiva === 'contactos' ? `2px solid ${theme.accentPurple}` : '2px solid transparent', color: pestañaActiva === 'contactos' ? theme.textMain : theme.textMuted, padding: '0 0 14px 0', cursor: 'pointer', marginBottom: '-1px', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 'bold', transition: 'all 0.2s' }}>
            Contactos <span style={{color: theme.accentPurple, fontSize: '10px'}}>●</span>
          </button>
          <button onClick={() => setPestañaActiva('sms')} style={{ background: 'transparent', border: 'none', borderBottom: pestañaActiva === 'sms' ? `2px solid ${theme.accentPurple}` : '2px solid transparent', color: pestañaActiva === 'sms' ? theme.textMain : theme.textMuted, padding: '0 0 14px 0', cursor: 'pointer', marginBottom: '-1px', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 'bold', transition: 'all 0.2s' }}>
            SMS <span style={{color: '#ec4899', fontSize: '10px'}}>●</span>
          </button>
        </div>
      </div>

      {/* ÁREA DE CONTENIDO (CON SCROLL Y CONTENEDOR FLEXIBLE) */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        
        {/* ==========================================
            PESTAÑA 1: INFORMACIÓN GENERAL
            ========================================== */}
        {pestañaActiva === 'informacion' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* GRID 2x2 SUPERIOR */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', minHeight: 'calc(100vh - 140px)' }}>
              {/* CUADRANTE 1 */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexShrink: 0 }}>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>1. Dispositivo del Cliente</h3>
                  {badgeVerificado}
                </div>
                <div style={{ display: 'flex', gap: '25px', flex: 1 }}>
                  <div style={{ flex: 1.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignContent: 'start' }}>
                    <div style={{ display: 'flex', gap: '10px' }}><Smartphone size={18} color={theme.accentPurple} style={{marginTop:'2px', flexShrink:0}}/><div><span style={{ color: theme.textMuted, fontSize: '12px', display: 'block' }}>Marca</span><strong style={{ fontSize: '14px' }}>{caso.dispositivo?.marca || 'N/A'}</strong></div></div>
                    <div><span style={{ color: theme.textMuted, fontSize: '12px', display: 'block' }}>Modelo</span><strong style={{ fontSize: '14px' }}>{caso.dispositivo?.modelo || 'N/A'}</strong></div>
                    <div style={{ display: 'flex', gap: '10px', gridColumn: 'span 2' }}>
                      <ShieldCheck size={18} color={theme.textMuted} style={{marginTop:'2px', flexShrink:0}}/>
                      <div><span style={{ color: theme.textMuted, fontSize: '12px', display: 'block' }}>Dispositivo Real Check <CheckCircle size={12} color={theme.accentGreen} style={{display:'inline'}}/></span><span style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginTop: '2px' }}>Firma de hardware única verificada.</span></div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}><Lock size={18} color={theme.textMuted} style={{marginTop:'2px', flexShrink:0}}/><div><span style={{ color: theme.textMuted, fontSize: '12px', display: 'block' }}>Status</span><strong style={{ fontSize: '14px' }}>Verificado</strong></div></div>
                    <div><span style={{ color: theme.textMuted, fontSize: '12px', display: 'block' }}>¿Emulador?</span><strong style={{ fontSize: '14px', color: caso.dispositivo?.esEmulador ? '#ef4444' : theme.accentGreen, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14}/> {caso.dispositivo?.esEmulador ? 'Sí (Riesgo)' : 'No (Limpio)'}</strong></div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: theme.bgDarker, borderRadius: '8px', border: `1px dashed ${theme.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                    <Map size={36} color={theme.accentGreen} style={{ marginBottom: '15px' }} />
                    <span style={{ fontSize: '12px', color: theme.textMuted }}>ID: {caso.dispositivo?.dispositivoId?.slice(0, 12) || 'N/A'}...</span>
                    <span style={{ fontSize: '12px', color: theme.textMuted, marginTop: '10px' }}>App: {caso.dispositivo?.idApp?.slice(0, 15) || 'N/A'}...</span>
                    <strong style={{ fontSize: '13px', color: theme.accentGreen, marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} /> Conexión Segura</strong>
                  </div>
                </div>
              </div>

              {/* CUADRANTE 2 */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexShrink: 0 }}>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>2. Información del Cliente</h3>
                  {badgeVerificado}
                </div>
                <div style={{ display: 'flex', gap: '25px', flex: 1 }}>
                  <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
                    <div><span style={{ color: theme.textMuted, fontSize: '12px', display: 'block', marginBottom: '4px' }}>Nombres Completos</span><strong style={{ fontSize: '18px' }}>{caso.cliente}</strong></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor: theme.bgDarker, padding: '15px', borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                      <div><span style={{ color: theme.textMuted, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}><CreditCard size={14}/> CURP</span><strong style={{ fontSize: '14px' }}>{caso.curp || 'N/A'}</strong></div>
                      <div style={{ display: 'flex', alignItems: 'center' }}><span style={{ color: theme.accentGreen, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14}/> Validado</span></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div><span style={{ color: theme.textMuted, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}><GraduationCap size={14}/> RFC</span><strong style={{ fontSize: '14px' }}>{caso.rfc || 'N/A'}</strong></div>
                      <div><span style={{ color: theme.textMuted, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}><MessageSquare size={14}/> Email</span><strong style={{ fontSize: '14px', wordBreak: 'break-all' }}>{caso.email || 'N/A'}</strong></div>
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: theme.textMain, fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>Documentos Verificados</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1 }}>
                      <div style={{ backgroundColor: theme.bgDarker, borderRadius: '8px', border: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        {caso.urlCurpFrontal ? <CheckCircle size={24} color={theme.accentGreen}/> : <FileText size={24} color={theme.textMuted}/>}
                        {caso.urlCurpFrontal && <CheckCircle size={16} color={theme.accentGreen} style={{ position: 'absolute', bottom: '8px', right: '8px', background: theme.bgCard, borderRadius: '50%' }}/>}
                      </div>
                      <div style={{ backgroundColor: theme.bgDarker, borderRadius: '8px', border: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        {caso.urlCurpReverso ? <CheckCircle size={24} color={theme.accentGreen}/> : <Camera size={24} color={theme.textMuted}/>}
                        {caso.urlCurpReverso && <CheckCircle size={16} color={theme.accentGreen} style={{ position: 'absolute', bottom: '8px', right: '8px', background: theme.bgCard, borderRadius: '50%' }}/>}
                      </div>
                      <div style={{ backgroundColor: theme.bgDarker, borderRadius: '8px', border: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <FileText size={24} color={theme.textMuted}/>
                      </div>
                      <div style={{ backgroundColor: theme.bgDarker, borderRadius: '8px', border: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        {caso.urlSelfie ? <CheckCircle size={24} color={theme.accentGreen}/> : <User size={24} color={theme.textMuted}/>}
                        {caso.urlSelfie && <CheckCircle size={16} color={theme.accentGreen} style={{ position: 'absolute', bottom: '8px', right: '8px', background: theme.bgCard, borderRadius: '50%' }}/>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CUADRANTE 3 */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexShrink: 0 }}>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>3. Fotografías</h3>
                  <button style={{ backgroundColor: 'transparent', color: theme.textMain, border: `1px solid ${theme.border}`, padding: '8px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}>Generar Link Seguro</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', flex: 1 }}>
                  {[ 
                    {title: 'CURP Frontal', url: caso.urlCurpFrontal, icon: <User size={48} color={theme.textMuted} />}, 
                    {title: 'CURP Reverso', url: caso.urlCurpReverso, icon: <FileText size={48} color={theme.textMuted} />}, 
                    {title: 'Selfie', url: caso.urlSelfie, icon: <Camera size={48} color={theme.textMuted} />} 
                  ].map((foto, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ flex: 1, backgroundColor: theme.bgDarker, borderRadius: '8px', border: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: '140px', overflow: 'hidden' }}>
                        {foto.url ? (
                          <img 
                            src={foto.url} 
                            alt={foto.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          foto.icon
                        )}
                        {foto.url && (
                          <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', backgroundColor: theme.accentGreen, color: 'white', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: `3px solid ${theme.bgCard}`, fontSize: '14px' }}>✓</div>
                        )}
                      </div>
                      <span style={{ fontSize: '14px', display: 'block', marginTop: '15px', fontWeight: 'bold', textAlign: 'center' }}>{foto.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CUADRANTE 4 */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexShrink: 0 }}>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Log de Comunicación</h3>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button style={{ background: 'transparent', border: 'none', color: theme.accentPurple, cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px', fontWeight: 'bold' }}><MessageSquare size={16}/> SMS</button>
                    <button style={{ background: 'transparent', border: 'none', color: '#f59e0b', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px', fontWeight: 'bold' }}><Send size={16}/> Correo</button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '30px', flex: 1 }}>
                  <div style={{ flex: 1, borderRight: `1px solid ${theme.border}`, paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: '250px' }}>
                    {caso.acotaciones && caso.acotaciones.length > 0 ? (
                      caso.acotaciones.slice(0, 5).map((acotacion, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: acotacion.tipo === 'verificacion' ? '#f59e0b' : acotacion.tipo === 'cobranza' ? theme.accentPurple : theme.accentGreen, marginTop: '5px', flexShrink: 0 }}></div>
                          <div>
                            <span style={{ fontSize: '14px', display: 'block', fontWeight: 'bold', marginBottom:'2px', textTransform: 'capitalize' }}>{acotacion.tipo}</span>
                            <span style={{ fontSize: '12px', color: theme.textMuted }}>Por: {acotacion.asesor || 'Sistema'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: theme.accentGreen, marginTop: '5px', flexShrink: 0 }}></div>
                        <div><span style={{ fontSize: '14px', display: 'block', fontWeight: 'bold', marginBottom:'2px' }}>Sistema Automatizado</span><span style={{ fontSize: '12px', color: theme.textMuted }}>Sin acotaciones registradas</span></div>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: `1px solid ${theme.border}`, paddingBottom: '10px' }}>
                      <strong style={{ color: theme.textMain }}>{caso.cliente}</strong><span style={{ color: theme.textMuted }}>Factura: <strong style={{color: theme.textMain}}>{caso.idSebFactura}</strong></span>
                    </div>
                    <select style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: theme.bgDarker, border: `1px solid ${theme.border}`, color: theme.textMain, fontSize: '14px', outline: 'none' }}>
                      <option>Seleccione Resultado...</option><option>Promesa de Pago</option><option>Ilocalizable</option>
                    </select>
                    <textarea placeholder="Detalles de la gestión..." style={{ width: '100%', flex: 1, padding: '12px', borderRadius: '6px', backgroundColor: theme.bgDarker, border: `1px solid ${theme.border}`, color: theme.textMain, fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}></textarea>
                    <button style={{ backgroundColor: theme.accentPurple, color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>Guardar Registro</button>
                  </div>
                </div>
              </div>

            </div>

            {/* TABLAS INFERIORES */}
            <div style={{...cardStyle, height: 'auto'}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Gestión Operativa Completa</h3>
                <button style={{ backgroundColor: theme.bgDarker, color: theme.textMain, border: `1px solid ${theme.border}`, padding: '8px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}>Soporte Ticket</button>
              </div>

              {/* TABLA 1: REGISTRO DE PAGOS */}
              <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', color: theme.textMain }}>Registro de Pagos</h4>
              <div style={{ overflowX: 'auto', marginBottom: '35px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.bgMain }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                  <thead style={{ backgroundColor: theme.bgDarker, borderBottom: `1px solid ${theme.border}` }}>
                    <tr>
                      <th style={{ padding: '14px', color: theme.textMain, fontWeight: 'bold' }}>Préstamo</th>
                      <th style={{ padding: '14px', color: theme.textMain, fontWeight: 'bold' }}>Cuenta Aprobadora</th>
                      <th style={{ padding: '14px', color: theme.textMain, fontWeight: 'bold' }}>Dispersado</th>
                      <th style={{ padding: '14px', color: theme.textMain, fontWeight: 'bold' }}>Adeudado</th>
                      <th style={{ padding: '14px', color: theme.textMain, fontWeight: 'bold' }}>Estado</th>
                      <th style={{ padding: '14px', color: theme.textMain, fontWeight: 'bold' }}>Operativa</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '12px', color: theme.textMuted }}>{caso.idSebFactura}</td>
                      <td style={{ padding: '12px' }}>{renderBadge('Dineropresta_SPEI', 'success')}</td>
                      <td style={{ padding: '12px', color: theme.textMain }}>${(caso.montos?.valorDispersadoCentavos || 0) / 100}</td>
                      <td style={{ padding: '12px', color: theme.textMain }}>${caso.adeudado?.toFixed(2) || '0.00'}</td>
                      <td style={{ padding: '12px' }}>{renderBadge(caso.estadoDeCredito || 'Activo', 'success')}</td>
                      <td style={{ padding: '12px', color: theme.textMain }}>Dineropresta</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* TABLA 2: CUENTA BANCARIA */}
              <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', color: theme.textMain }}>Cuenta Bancaria</h4>
              <div style={{ overflowX: 'auto', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.bgMain }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                  <thead style={{ backgroundColor: theme.bgDarker, borderBottom: `1px solid ${theme.border}` }}>
                    <tr>
                      <th style={{ padding: '14px', color: theme.textMain, fontWeight: 'normal' }}>Tipo de Cuenta</th>
                      <th style={{ padding: '14px', color: theme.textMain, fontWeight: 'normal' }}>Número de Cuenta</th>
                      <th style={{ padding: '14px', color: theme.textMain, fontWeight: 'normal' }}>Estado</th>
                      <th style={{ padding: '14px', color: theme.textMain, fontWeight: 'normal' }}>Entidad Bancaria</th>
                      <th style={{ padding: '14px', color: theme.textMain, fontWeight: 'normal' }}>Fecha de Solicitud</th>
                      <th style={{ padding: '14px', color: theme.textMain, fontWeight: 'normal' }}>Fecha de Desembolso</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '16px', color: theme.textMain }}>{caso.prestamoCompleto?.solicitud?.cuentaBancariaSnapshot?.tipoCuenta || 'Cuenta de Cheques'}</td>
                      <td style={{ padding: '16px', color: theme.textMain, letterSpacing: '1px' }}>**** **** **** {caso.prestamoCompleto?.solicitud?.cuentaBancariaSnapshot?.numeroDeCuenta?.slice(-4) || '****'}</td>
                      <td style={{ padding: '16px', color: theme.textMain }}>{caso.prestamoCompleto?.solicitud?.cuentaBancariaSnapshot?.estadoDeCuenta || 'Activo'}</td>
                      <td style={{ padding: '16px', color: theme.textMain }}>{caso.prestamoCompleto?.solicitud?.cuentaBancariaSnapshot?.nombreBanco || 'Banco'}</td>
                      <td style={{ padding: '16px', color: theme.textMain }}>{caso.fechas?.fechaDeDispersion ? new Date(caso.fechas.fechaDeDispersion).toLocaleDateString() : 'N/A'}</td>
                      <td style={{ padding: '16px', color: theme.textMain }}>{caso.fechas?.fechaDeReembolso ? new Date(caso.fechas.fechaDeReembolso).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            PESTAÑA 2: CONTACTOS
            ========================================== */}
        {pestañaActiva === 'contactos' && (
          <div style={{ ...cardStyle, height: 'auto', minHeight: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: theme.textMain }}>Directorio Telefónico Exportado</h3>
                <span style={{ fontSize: '13px', color: theme.textMuted }}>Contactos extraídos del dispositivo de {caso.cliente}</span>
              </div>
              
              {/* BUSCADOR */}
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: theme.bgDarker, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '8px 15px', width: '300px' }}>
                <Search size={16} color={theme.textMuted} />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre o número..." 
                  value={busquedaContactos}
                  onChange={(e) => setBusquedaContactos(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: theme.textMain, outline: 'none', marginLeft: '10px', width: '100%', fontSize: '13px' }} 
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.bgMain, flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                <thead style={{ backgroundColor: theme.bgDarker, borderBottom: `1px solid ${theme.border}` }}>
                  <tr>
                    <th style={{ padding: '16px 20px', color: theme.textMain, fontWeight: 'bold', width: '50%' }}>Nombres</th>
                    <th style={{ padding: '16px 20px', color: theme.textMain, fontWeight: 'bold', width: '50%' }}>Teléfonos</th>
                  </tr>
                </thead>
                <tbody>
                  {contactosFiltrados.length > 0 ? (
                    contactosFiltrados.map((contacto, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${theme.border}`, transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = isDarkMode ? '#1e293b' : '#f1f5f9'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '16px 20px', color: theme.textMain }}>{contacto.nombre}</td>
                        <td style={{ padding: '16px 20px', color: theme.accentBlue, fontWeight: '600' }}>{contacto.telefono}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" style={{ padding: '40px', textAlign: 'center', color: theme.textMuted }}>No se encontraron contactos que coincidan con la búsqueda.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            PESTAÑA 3: SMS
            ========================================== */}
        {pestañaActiva === 'sms' && (
          <div style={{ ...cardStyle, height: 'auto', minHeight: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: theme.textMain }}>Bandeja de SMS Exportados</h3>
                <span style={{ fontSize: '13px', color: theme.textMuted }}>Mensajes de texto extraídos del dispositivo de {caso.cliente}</span>
              </div>
              
              {/* BUSCADOR */}
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: theme.bgDarker, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '8px 15px', width: '300px' }}>
                <Search size={16} color={theme.textMuted} />
                <input 
                  type="text" 
                  placeholder="Buscar en mensajes o remitentes..." 
                  value={busquedaSms}
                  onChange={(e) => setBusquedaSms(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: theme.textMain, outline: 'none', marginLeft: '10px', width: '100%', fontSize: '13px' }} 
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.bgMain, flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                <thead style={{ backgroundColor: theme.bgDarker, borderBottom: `1px solid ${theme.border}` }}>
                  <tr>
                    <th style={{ padding: '16px 20px', color: theme.textMain, fontWeight: 'bold', width: '25%' }}>Teléfono / Remitente</th>
                    <th style={{ padding: '16px 20px', color: theme.textMain, fontWeight: 'bold', width: '75%' }}>Mensaje Completo</th>
                  </tr>
                </thead>
                <tbody>
                  {smsFiltrados.length > 0 ? (
                    smsFiltrados.map((sms, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${theme.border}`, transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = isDarkMode ? '#1e293b' : '#f1f5f9'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '16px 20px', color: theme.accentBlue, fontWeight: '600', verticalAlign: 'top' }}>{sms.telefono}</td>
                        <td style={{ padding: '16px 20px', color: theme.textMain, lineHeight: '1.5' }}>{sms.mensaje}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" style={{ padding: '40px', textAlign: 'center', color: theme.textMuted }}>No se encontraron mensajes que coincidan con la búsqueda.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}