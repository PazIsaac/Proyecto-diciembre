import React from 'react'
import '../css/Services.css'
import slideA from '../../assets/slideA.jpg'

function Services({ setActiveSection, user, setShowLogin }) {
  const services = [
    {
      id: 1,
      title: "Consultas Generales",
      description: "Revisiones médicas completas para mantener la salud de tu mascota",
      price: "Desde $25"
    },
    {
      id: 2,
      title: "Vacunación",
      description: "Plan completo de vacunas para prevenir enfermedades",
      price: "Desde $15"
    },
    {
      id: 3,
      title: "Cirugías",
      description: "Procedimientos quirúrgicos con tecnología de vanguardia",
      price: "Consultar"
    },
    {
      id: 4,
      title: "Laboratorio",
      description: "Análisis clínicos y estudios diagnósticos",
      price: "Desde $30"
    },
    {
      id: 5,
      title: "Emergencias",
      description: "Atención de urgencias las 24 horas del día",
      price: "Según caso"
    },
    {
      id: 6,
      title: "Peluquería",
      description: "Servicios de estética y cuidado personal",
      price: "Desde $20"
    }
  ]

  return (
    <section className="services">
      <img src={slideA} alt="fondo" className="services-bg" />
      <div className="container">
        <div className="services-header">
          <h1>Nuestros Servicios</h1>
          <p>Ofrecemos atención integral para el bienestar de tu mascota</p>
        </div>

        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="service-price">{service.price}</div>
            </div>
          ))}
        </div>

        <div className="services-cta">
          <h2>¿Necesitas agendar una cita?</h2>
          <p>{user ? 'Agenda tu cita de forma rápida y sencilla' : 'Inicia sesión para agendar tu cita veterinaria'}</p>
          <button 
            className="btn-primary"
            onClick={() => setActiveSection('contact')}
          >
            Agendar Cita
          </button>
        </div>
      </div>
    </section>
  )
}

export default Services