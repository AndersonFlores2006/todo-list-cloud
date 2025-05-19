import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/todoService';
import './Auth.css';
import { GoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Credenciales incorrectas', text: 'Verifica tu correo y contraseña', confirmButtonColor: '#e11d48' });
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        <div style={{ margin: '1rem 0', textAlign: 'center' }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await fetch('http://localhost:5000/api/auth/google', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: credentialResponse.credential })
                });
                const data = await res.json();
                if (data.token) {
                  localStorage.setItem('token', data.token);
                  navigate('/home');
                } else {
                  setError(data.message || 'Error autenticando con Google');
                }
              } catch (err) {
                setError('Error autenticando con Google');
              }
            }}
            onError={() => setError('Error con Google Login')}
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <div className="auth-switch">
          <span>¿No tienes cuenta?</span>
          <button type="button" className="auth-link" onClick={() => navigate('/register')}>Regístrate</button>
        </div>
      </form>
    </div>
  );
}

export default Login; 