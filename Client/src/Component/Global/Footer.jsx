import React from 'react'
import '../css/Footer.css'
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="social-links">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="WhatsApp"><FaWhatsapp /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Servicios</h4>
            <ul>
              <li><a href="#">Consultas Generales</a></li>
              <li><a href="#">Vacunación</a></li>
              <li><a href="#">Cirugías</a></li>
              <li><a href="#">Laboratorio</a></li>
              <li><a href="#">Emergencias 24/7</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contacto</h4>
            <div className="contact-item">
              <p>Av. de Mayo 341<br /></p>
            </div>
            <div className="contact-item">
              <p>Tel:(555) 123-4567</p>
            </div>
            <div className="contact-item">
              <p>pethealth112@gmail.com</p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Horarios</h4>
            <div className="schedule">
              <p><strong>Lunes - Viernes:</strong><br />8:00 AM - 8:00 PM</p>
              <p><strong>Sábados:</strong><br />9:00 AM - 6:00 PM</p>
              <p><strong>Domingos:</strong><br />10:00 AM - 4:00 PM</p>
            </div>
          </div>
          <div className="footer-section">
            <div className="emergency-footer">
              <p><strong>Emergencias 24/7:</strong><br />(555) 911-PETS</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <p>&copy; 2024 PetHealth. Todos los derechos reservados.</p>
            <div className="footer-links">
              <a href="#">Política de Privacidad</a>
              <a href="#">Términos de Servicio</a>
              <a href="#">Aviso Legal</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

