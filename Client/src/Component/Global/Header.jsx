import React, { useState } from 'react'
import '../css/Header.css'
import logo from '../../assets/perrito.pethealth.png'

function Header({ activeSection, setActiveSection, setShowRegistro, setShowLogin, user, handleLogout, cart, showCart, setShowCart }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleNavClick = (section) => {
        setActiveSection(section)
        setIsMenuOpen(false)
    }

    const handleRegistroClick = () => {
        setShowRegistro(true)
        setIsMenuOpen(false)
    }

    const handleLoginClick = () => {
        setShowLogin(true)
        setIsMenuOpen(false)
    }

    return (
        <header className="header">
            <div className="container-header">
                <div className="logo">
                    <img className='Logo' src={logo} alt="Logo" />
                </div>
                
                <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                    <ul>
                        <li>
                            <button 
                                className={activeSection === 'home' ? 'active' : ''}
                                onClick={() => handleNavClick('home')}
                            >
                                Inicio
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeSection === 'services' ? 'active' : ''}
                                onClick={() => handleNavClick('services')}
                            >
                                Servicios
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeSection === 'products' ? 'active' : ''}
                                onClick={() => handleNavClick('products')}
                            >
                                Productos
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeSection === 'about' ? 'active' : ''}
                                onClick={() => handleNavClick('about')}
                            >
                                Nosotros
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeSection === 'contact' ? 'active' : ''}
                                onClick={() => handleNavClick('contact')}
                            >
                                Contacto
                            </button>
                        </li>

                    </ul>
                </nav>

                {user ? (
                    <div className="user-menu">
                        <button 
                            className={`cart-btn-header ${cart.length === 0 ? 'disabled' : ''}`}
                            onClick={() => cart.length > 0 && setShowCart(!showCart)}
                            disabled={cart.length === 0}
                        >
                            🛒 ({cart.length})
                        </button>
                        <button className="user-name" onClick={handleLogout}>
                            {user.nombre} ▼
                        </button>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <button className="btn-login" onClick={handleLoginClick}>
                            Iniciar Sesión
                        </button>
                        <button className="btn-registro" onClick={handleRegistroClick}>
                            Registrarse
                        </button>
                    </div>
                )}

                <button className="menu-toggle" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    )
}

export default Header