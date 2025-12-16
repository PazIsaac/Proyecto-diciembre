import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../BackEnd/api';
import '../css/AgendarCita.css';

const AgendarCita = ({ user, setActiveSection }) => {
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    motivo: ''
  });
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [misTurnos, setMisTurnos] = useState([]);

  // Si no hay usuario autenticado, mostrar mensaje
  if (!user) {
    return (
      <div className="agendar-cita-container">
        <div className="auth-required">
          <h2>Iniciar Sesión Requerido</h2>
          <p>Para agendar una cita, necesitas estar registrado e iniciar sesión.</p>
          <div className="auth-buttons">
            <button 
              className="btn-login"
              onClick={() => setActiveSection('login')}
            >
              Iniciar Sesión
            </button>
            <button 
              className="btn-register"
              onClick={() => setActiveSection('registro')}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    cargarMisTurnos();
  }, []);

  const cargarMisTurnos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/turnos/mios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMisTurnos(response.data.turnos);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    }
  };

  const cargarHorariosDisponibles = async (fecha) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/turnos/horarios/${fecha}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHorariosDisponibles(response.data.horariosDisponibles);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      setHorariosDisponibles([]);
    }
  };

  const handleFechaChange = (e) => {
    const fecha = e.target.value;
    setFormData({ ...formData, fecha, hora: '' });
    if (fecha) {
      cargarHorariosDisponibles(fecha);
    } else {
      setHorariosDisponibles([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await api.post('/turnos', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        title: '¡Cita Agendada!',
        text: 'Tu cita ha sido agendada exitosamente.',
        icon: 'success',
        confirmButtonColor: '#4a90e2'
      });

      setFormData({ fecha: '', hora: '', motivo: '' });
      setHorariosDisponibles([]);
      cargarMisTurnos();
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.error || 'Error al agendar la cita',
        icon: 'error',
        confirmButtonColor: '#e74c3c'
      });
    } finally {
      setLoading(false);
    }
  };

  const eliminarTurno = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/turnos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        Swal.fire('Eliminado', 'La cita ha sido eliminada', 'success');
        cargarMisTurnos();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la cita', 'error');
      }
    }
  };

  const fechaMinima = new Date().toISOString().split('T')[0];

  return (
    <div className="agendar-cita-container">
      <div className="container">
        <div className="agendar-header">
          <h1>Agendar Cita</h1>
          <p>Bienvenido/a {user.nombre}, agenda tu cita veterinaria</p>
        </div>

        <div className="agendar-content">
          <div className="form-section">
            <h2>Nueva Cita</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fecha">Fecha *</label>
                <input
                  type="date"
                  id="fecha"
                  value={formData.fecha}
                  onChange={handleFechaChange}
                  min={fechaMinima}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="hora">Hora *</label>
                <select
                  id="hora"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  required
                  disabled={!formData.fecha}
                >
                  <option value="">Selecciona una hora</option>
                  {horariosDisponibles.map(hora => (
                    <option key={hora} value={hora}>{hora}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="motivo">Motivo de la consulta *</label>
                <textarea
                  id="motivo"
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  placeholder="Describe brevemente el motivo de la consulta..."
                  rows="4"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-agendar">
                {loading ? 'Agendando...' : 'Agendar Cita'}
              </button>
            </form>
          </div>

          <div className="turnos-section">
            <h2>Mis Citas</h2>
            {misTurnos.length === 0 ? (
              <p className="no-turnos">No tienes citas agendadas</p>
            ) : (
              <div className="turnos-list">
                {misTurnos.map(turno => (
                  <div key={turno.id} className="turno-card">
                    <div className="turno-info">
                      <h3>{new Date(turno.fecha).toLocaleDateString()}</h3>
                      <p><strong>Hora:</strong> {turno.hora}</p>
                      <p><strong>Motivo:</strong> {turno.motivo}</p>
                      <p><strong>Estado:</strong> 
                        <span className={`estado ${turno.estado}`}>
                          {turno.estado}
                        </span>
                      </p>
                    </div>
                    <button 
                      className="btn-eliminar"
                      onClick={() => eliminarTurno(turno.id)}
                    >
                      Cancelar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendarCita;