import React from 'react'
import '../css/Home.css'
import dog from '../../assets/Big.dog.jpg'
import logo2 from '../../assets/logo2.png'

function Home({ setActiveSection, setShowRegistro }) {
  return (
    <section className="home">
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Cuidamos a tu mejor amigo</h1>
            <p>En PetHealth brindamos atención médica integral para tu mascota con más de 15 años de experiencia y el mejor equipo profesional.</p>
            <div className="hero-buttons">
              <button 
                className="btn-primary"
                onClick={() => setActiveSection('contact')}
              >
                Agendar Cita
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setActiveSection('about')}
              >
                Conocer Más
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="placeholder-image">
              <img src={logo2} alt="Segundo logo" />
            </div>
          </div>
        </div>
      </div>

      <div className="features">
        <img src={dog} alt="fondo" className="features-bg" />
        <div className="container-home">
          <h2>¿Por qué elegir PetHealth?</h2>
          <div className="features-grid">
              <div className="feature">
                <div className="feature-icon"></div>
                <h3>Instalaciones Modernas</h3>
                <p>Equipos de última tecnología para el mejor diagnóstico</p>
              </div>
              <div className="feature">
                <div className="feature-icon"></div>
                <h3>Profesionales Expertos</h3>
                <p>Veterinarios certificados con años de experiencia</p>
              </div>
              <div className="feature">
                <div className="feature-icon"></div>
                <h3>Atención 24/7</h3>
                <p>Emergencias atendidas las 24 horas del día</p>
              </div>
              <div className="feature">
                <div className="feature-icon"></div>
                <h3>Amor por los Animales</h3>
                <p>Tratamos a cada mascota como si fuera nuestra</p>
              </div>
            </div>
          </div>
        </div>

      <div className="cta-section">
        <div className="container">
          <h2>¿Listo para cuidar a tu mascota?</h2>
          <p>Únete a nuestra comunidad y mantén a tu mejor amigo siempre saludable</p>
          <button 
            className="btn-primary"
            onClick={() => setActiveSection('contact')}
          >
            Contactar Ahora
          </button>
        </div>
      </div>
    </section>
  )
}

export default Home