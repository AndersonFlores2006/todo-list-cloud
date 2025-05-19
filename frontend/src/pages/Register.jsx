import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/todoService';
import './Auth.css';
import Swal from 'sweetalert2';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');
    try {
      await register(email, password);
      Swal.fire({ icon: 'success', title: '¡Registro exitoso!', text: 'Ahora puedes iniciar sesión.', confirmButtonColor: '#4f8cff' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error en el registro', text: '¿Ya existe el usuario?', confirmButtonColor: '#e11d48' });
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Registro</h2>
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
        <button type="submit">Registrarse</button>
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}
        <div className="auth-switch">
          <span>¿Ya tienes cuenta?</span>
          <button type="button" className="auth-link" onClick={() => navigate('/login')}>Inicia sesión</button>
        </div>
      </form>
    </div>
  );
}

export default Register; 