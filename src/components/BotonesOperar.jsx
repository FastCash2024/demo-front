import React, { useState } from 'react';
import { createPortal } from 'react-dom'; 
import { FileText, MessageSquare, User, Link, X, Send } from 'lucide-react';

export default function BotonesOperar({ caso }) {
  const [modalRegistroAbierto, setModalRegistroAbierto] = useState(false);
  const [modalSmsAbierto, setModalSmsAbierto] = useState(false);

  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState('recordatorio');
  const [textoMensaje, setTextoMensaje] = useState(
    `Hola ${caso.cliente}, Dineropresta te recuerda que tu factura ${caso.idSebFactura} presenta un saldo de $${caso.adeudado} MXN. Por favor regulariza tu pago pronto.`
  );

  const abrirRegistro = () => setModalRegistroAbierto(true);
  const cerrarRegistro = () => setModalRegistroAbierto(false);
  const abrirSms = () => setModalSmsAbierto(true);
  const cerrarSms = () => setModalSmsAbierto(false);

  // ==========================================
  // SOLO GUARDAMOS EL CLIENTE Y ABRIMOS LA PESTAÑA
  // ==========================================
  const verCliente = () => {
    localStorage.setItem('clienteEnDetalle', JSON.stringify(caso));
    window.open('/perfil-cliente', '_blank');
  };
  
  const generarLiga = async () => {
    try {
      // Usar subdominio/origen actual para poder funcionar en el mismo ambiente
      const origen = window.location.origin; 
      const identificadorPago = caso._id || caso.numeroDePrestamo || caso.idSebFactura || 'sin-id';
      const linkCobro = `${origen}/pago/${identificadorPago}`;

      const formatoPago = `${linkCobro}`;
      await navigator.clipboard.writeText(formatoPago);
      alert(`✅ ¡Liga copiada para ${caso.cliente}!\n${linkCobro}`);
    } catch (err) {
      alert('❌ Error al copiar la liga.');
    }
  };

  const guardarRegistro = () => {
    alert(`✅ Registro guardado con éxito para ${caso.cliente}`);
    cerrarRegistro();
  };

  const enviarMensajeSMS = () => {
    alert(`✅ SMS enviado exitosamente al número ${caso.telefono}`);
    cerrarSms();
  };

  const cambiarPlantilla = (e) => {
    const opcion = e.target.value;
    setPlantillaSeleccionada(opcion);
    if (opcion === 'recordatorio') setTextoMensaje(`Hola ${caso.cliente}, Dineropresta te recuerda que tu factura ${caso.idSebFactura} presenta un saldo de $${caso.adeudado} MXN. Por favor regulariza tu pago pronto.`);
    else if (opcion === 'promesa_rota') setTextoMensaje(`Estimado(a) ${caso.cliente}, registramos un incumplimiento en su promesa de pago. Le invitamos a liquidar su saldo de $${caso.adeudado} MXN hoy mismo para evitar recargos.`);
    else if (opcion === 'aviso_legal') setTextoMensaje(`[AVISO URGENTE] ${caso.cliente}, su cuenta asociada a la factura ${caso.idSebFactura} pasará a revisión extrajudicial si no recibimos el pago en 24 hrs.`);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button title="Generar Registro" onClick={abrirRegistro} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#a855f7' }}><FileText size={16} /></button>
        <button title="Enviar SMS" onClick={abrirSms} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#10b981' }}><MessageSquare size={16} /></button>
        <button title="Ver Info del Cliente" onClick={verCliente} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><User size={16} /></button>
        <button title="Copiar Liga de Pago" onClick={generarLiga} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#f59e0b' }}><Link size={16} /></button>
      </div>

      {modalRegistroAbierto && createPortal(
        <div className="modal-overlay" onClick={cerrarRegistro}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h3>Nuevo Registro de Gestión</h3><button className="btn-cerrar" onClick={cerrarRegistro}><X size={18} /></button></div>
            <div className="modal-body">
              <div className="campo-formulario"><label>Resultado</label><select><option>Promesa de Pago</option><option>Ilocalizable / Buzón</option></select></div>
              <div className="campo-formulario"><label>Comentarios</label><textarea rows="4"></textarea></div>
            </div>
            <div className="modal-footer"><button onClick={cerrarRegistro} style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button><button onClick={guardarRegistro} style={{ background: '#a855f7', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Guardar</button></div>
          </div>
        </div>, document.body
      )}

      {modalSmsAbierto && createPortal(
        <div className="modal-overlay" onClick={cerrarSms}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h3>Enviar SMS</h3><button className="btn-cerrar" onClick={cerrarSms}><X size={18} /></button></div>
            <div className="modal-body">
              <div className="campo-formulario"><label>Plantilla</label><select value={plantillaSeleccionada} onChange={cambiarPlantilla}><option value="recordatorio">Recordatorio</option><option value="promesa_rota">Promesa Rota</option></select></div>
              <div className="campo-formulario"><label>Mensaje</label><textarea rows="5" value={textoMensaje} onChange={(e) => setTextoMensaje(e.target.value)}></textarea></div>
            </div>
            <div className="modal-footer"><button onClick={cerrarSms} style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button><button onClick={enviarMensajeSMS} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', gap:'6px' }}><Send size={14}/> Enviar</button></div>
          </div>
        </div>, document.body
      )}
    </>
  );
}