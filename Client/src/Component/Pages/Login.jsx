import React, { useState } from 'react';
import '../css/Login.css';
import slide3 from '../../assets/slide3-1.jpg';

const Login = ({ setShowLogin, setShowRegistro, setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones básicas
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Enviando login request...');
      
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          contraseña: formData.password
        }),
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (response.ok) {
        console.log('✅ Login exitoso');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        
        const Swal = (await import('sweetalert2')).default;
        Swal.fire({
          title: '¡Bienvenido!',
          text: `Hola ${data.user.nombre}, has iniciado sesión exitosamente.`,
          icon: 'success',
          confirmButtonColor: '#4CAF50',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          setShowLogin(false);
        });
      } else {
        console.log('❌ Login falló:', data.error);
        setError(data.error || data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      setError('Error de conexión. Verifica que el servidor esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src={slide3} alt="Fondo veterinaria" className="login-bg" />
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p>
          ¿No tienes cuenta? <button 
            type="button" 
            className="link-button"
            onClick={() => {
              setShowLogin(false);
              setShowRegistro(true);
            }}
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;