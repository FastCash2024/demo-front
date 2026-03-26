import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react'; 
import './Login.css'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  // 👇 Aquí está el cerebro del Login con tu nombre guardándose 👇
  const handleLogin = async (e) => {
    e.preventDefault(); 
    
    try {
      const respuesta = await axios.post('https://ms4.fastcash-mx.com/api/users/login', {
        email: email,
        password: password
      });

      // 1. Guardamos el Token kilométrico
      const elToken = respuesta.data.token;
      localStorage.setItem('crmToken', elToken);

      // 2. Guardamos el usuario/correo que se acaba de loguear
      localStorage.setItem('crmUser', email); 

      // 3. Guardamos el rol (Opcional)
      if (respuesta.data.usuario && respuesta.data.usuario.role) {
        localStorage.setItem('crmRole', respuesta.data.usuario.role);
      }

      setMensaje('');
      
      // 4. Viajamos al dashboard
      navigate('/dashboard');
      
    } catch (error) {
      setMensaje("❌ " + (error.response?.data?.error || "Error de conexión al servidor. Verifique que el backend esté corriendo."));
    }
  };

  // 👇 Y aquí está tu diseño visual intacto 👇
  return (
    <div className="login-page-root">
      <div className="login-overlay"></div>

      <div className="right-aligned-login-area">
        <div className="slim-glass-login-card">
          
          <div className="logo-section">
            <ShieldCheck size={24} className="logo-icon" />
            <span className="logo-text">Clean Cash CRM</span>
          </div>
          
          <h1 className="welcome-header">Welcome Back</h1>
          
          <p className="subtitle">
            Manage your customer relationships and optimize your cash flow from a single dashboard. 
            Clean Cash CRM provides the tools you need to boost sales and take full control of your business.
          </p>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email Address / Usuario</label>
              <input 
                type="text" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin-DataBase-Dev" 
                required 
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                required 
              />
            </div>
            
            <button type="submit" className="submit-btn">Sign in now</button>
          </form>
          
          <div className="form-links">
            <a href="#" className="link-muted">Lost your password?</a>
            <div className="footer-links">
              <a href="#" className="link-muted">Terms of Service</a>
              <a href="#" className="link-muted">Privacy Policy</a>
            </div>
          </div>

          {mensaje && (
            <div className={`error-box ${mensaje.includes('❌') ? 'error' : 'success'}`}>
              <span>{mensaje}</span>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default Login;