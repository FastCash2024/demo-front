import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Pago() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarLoan = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://ms4.fastcash-mx.com/api/loans/${id}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || `Error ${response.status}`);
        }
        const data = await response.json();

        setLoan(data.loan || null);
      } catch (err) {
        setError(err.message || 'No se pudo obtener el préstamo');
      } finally {
        setLoading(false);
      }
    };

    cargarLoan();
  }, [id]);

  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Cargando datos de pago...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 16px' }}>
        <div>
          <h2>Error al cargar la orden de pago</h2>
          <p style={{ color: '#6b7280' }}>{error}</p>
          <button onClick={() => navigate('/dashboard')} style={{ marginTop: '16px', padding: '10px 18px', border: 'none', borderRadius: '8px', background: '#3b82f6', color: '#fff', cursor: 'pointer' }}>
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>No se encontró información del préstamo</h2>
      </div>
    );
  }

  const suministroPago = loan.cuentaClabeParaCobro || loan.pagos?.cuentaClabeParaCobro || 'No disponible';

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#e2e8f0', color: '#0f172a', fontFamily: "'Inter', sans-serif" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '12px', padding: '10px 14px', border: 'none', borderRadius: '8px', background: '#3b82f6', color: '#fff', cursor: 'pointer' }}>
        ← Volver
      </button>

      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 20px rgba(0,0,0,0.08)' }}>
        <h1 style={{ margin: 0 }}>Orden de pago</h1>
        <p style={{ color: '#64748b', marginTop: '8px' }}>ID de préstamo: <strong>{loan.id}</strong></p>

        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px' }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
            <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>Cliente</div>
            <div style={{ fontWeight: '600', fontSize: '16px' }}>{loan.cliente || 'Desconocido'}</div>
            <div style={{ color: '#6b7280', fontSize: '13px' }}>{loan.telefono || '-'}</div>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
            <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>Factura / ID</div>
            <div style={{ fontWeight: '600', fontSize: '16px' }}>{loan.idDeSubFactura || loan.numeroDePrestamo || 'No definido'}</div>
            <div style={{ color: '#6b7280', fontSize: '13px' }}>{loan.estadoDeCredito || 'Estado no disponible'}</div>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
            <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>Total adeudado</div>
            <div style={{ fontWeight: '600', fontSize: '18px', color: '#dc2626' }}>${loan.valorAdeudado?.toFixed?.(2) ?? loan.valorAdeudado ?? 0} MXN</div>
            <div style={{ color: '#6b7280', fontSize: '13px' }}>Interés: {loan.interesPorcentaje || '0'}%</div>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
            <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>Cuenta CLABE para cobro</div>
            <div style={{ fontWeight: '600', fontSize: '16px', wordBreak: 'break-all' }}>{suministroPago}</div>
          </div>
        </div>

        {/* <div style={{ marginTop: '22px', display: 'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', alignItems:'center' }}>
          <div>
            <p style={{ margin: 0, color:'#64748b' }}>URL de pago pública</p>
            <a href={`#`} style={{ color: '#2563eb', fontWeight:'600', textDecoration:'underline' }}>{loan?.pagos?.cuentaClabeParaCobro}</a>
          </div>
          <div style={{ textAlign:'right' }}>
            <button style={{ border:'none', background:'#10b981', color:'#fff', borderRadius:'8px', padding:'10px 18px', cursor:'pointer' }} onClick={() => navigator.clipboard.writeText(loan?.pagos?.cuentaClabeParaCobro)}>
              Copiar  cuenta Clabe
            </button>
          </div>
        </div> */}

        <div style={{ marginTop:'24px', padding:'18px', border:'1px solid #e2e8f0', borderRadius:'12px', background:'#f8fafc' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Instrucciones</h3>
          <ul style={{ margin:0, paddingLeft:'20px', color: '#475569' }}>
            <li>Transfiere el monto en pesos a la CLABE indicada.</li>
            <li>Envía comprobante a través de la app.
</li>
            <li>Consulta seguimiento de cobranza en el dashboard.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
