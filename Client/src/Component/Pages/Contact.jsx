import React, { useState } from 'react'
import Swal from 'sweetalert2'
import '../css/Contact.css'

function Contact({ user, setShowLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    petName: '',
    service: '',
    message: ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos'
    }

    if (!formData.petName.trim()) {
      newErrors.petName = 'El nombre de la mascota es requerido'
    }

    if (!formData.service) {
      newErrors.service = 'Selecciona un servicio'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido'
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Verificar si el usuario está logueado
    if (!user) {
      Swal.fire({
        title: 'Inicia Sesión Requerido',
        text: 'Debes iniciar sesión para enviar mensajes de contacto',
        icon: 'warning',
        confirmButtonColor: '#4CAF50',
        confirmButtonText: 'Iniciar Sesión'
      }).then((result) => {
        if (result.isConfirmed) {
          setShowLogin(true)
        }
      })
      return
    }
    
    // Verificar que el email coincida con el usuario logueado
    if (formData.email !== user.email) {
      Swal.fire({
        title: 'Email Incorrecto',
        text: `Debes usar tu email registrado: ${user.email}`,
        icon: 'error',
        confirmButtonColor: '#e74c3c'
      })
      return
    }
    
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      // Simular envío del formulario
      Swal.fire({
        title: '¡Mensaje Enviado!',
        text: 'Gracias por contactarnos. Te responderemos pronto.',
        icon: 'success',
        confirmButtonColor: '#4CAF50'
      })
      
      // Resetear formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        petName: '',
        service: '',
        message: ''
      })
    } else {
      setErrors(newErrors)
      Swal.fire({
        title: 'Error',
        text: 'Por favor corrige los errores en el formulario',
        icon: 'error',
        confirmButtonColor: '#e74c3c'
      })
    }
  }

  return (
    <section className="contact">
      <div className="container">
        <div className="contact-header">
          <h1>Contáctanos</h1>
          <p>Estamos aquí para ayudarte y responder todas tus preguntas</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Información de Contacto</h2>
            
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-content">
                <h3>Dirección</h3>
                <p>Av. de Mayo 341</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📞</div>
              <div className="info-content">
                <h3>Teléfono</h3>
                <p>(555) 123-4567</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div className="info-content">
                <h3>Email</h3>
                <p>PetHealth@gmail.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">🕐</div>
              <div className="info-content">
                <h3>Horarios</h3>
                <p>Lun-Vie: 8:00-20:00 | Sáb: 9:00-18:00 | Dom: 10:00-16:00</p>
              </div>
            </div>

            <div className="emergency-info">
              <h3>🚨 Emergencias 24/7</h3>
              <p>Para emergencias fuera del horario normal, llama al:</p>
              <p className="emergency-phone">(555) 911-PETS</p>
            </div>
          </div>

          <div className="contact-form">
            <h2>Envíanos un Mensaje</h2>
            {!user && (
              <div className="login-required">
                <p>⚠️ Debes <span className="link-btn" onClick={() => setShowLogin(true)}>iniciar sesión</span> para enviar mensajes</p>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nombre Completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Teléfono *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="petName">Nombre de la Mascota *</label>
                  <input
                    type="text"
                    id="petName"
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    className={errors.petName ? 'error' : ''}
                  />
                  {errors.petName && <span className="error-message">{errors.petName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="service">Servicio de Interés *</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={errors.service ? 'error' : ''}
                >
                  <option value="">Selecciona un servicio</option>
                  <option value="consulta">Consulta General</option>
                  <option value="vacunacion">Vacunación</option>
                  <option value="cirugia">Cirugía</option>
                  <option value="laboratorio">Laboratorio</option>
                  <option value="emergencia">Emergencia</option>
                  <option value="peluqueria">Peluquería</option>
                </select>
                {errors.service && <span className="error-message">{errors.service}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensaje *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? 'error' : ''}
                  placeholder="Cuéntanos más detalles sobre lo que necesitas..."
                ></textarea>
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <button type="submit" className="submit-btn">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact