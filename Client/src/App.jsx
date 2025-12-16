import React, { useState } from 'react'
import './Component/css/index.css'
import Header from './Component/Global/Header'
import Home from './Component/Pages/Home'
import Services from './Component/Pages/Services'
import About from './Component/Pages/About'
import Contact from './Component/Pages/Contact'
import Products from './Component/Pages/Products'
import RegistroUsuario from './Component/Pages/RegistroUsuario'
import Login from './Component/Pages/Login'

import Footer from './Component/Global/Footer'
import logo from './assets/perrito.pethealth.png'

// Importar imágenes para el carrito
import bozal from './assets/bozal.png'
import casita from './assets/casita perro.png'
import collar from './assets/collar1.jpg'
import cono from './assets/Cono de la verguenza.png'
import juguete from './assets/juguete y collar.jpg'
import manta from './assets/manta terimica.png'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [showRegistro, setShowRegistro] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)

  // Mapeo de imágenes para el carrito
  const imageMap = {
    'bozal.png': bozal,
    'casita perro.png': casita,
    'collar1.jpg': collar,
    'Cono de la verguenza.png': cono,
    'juguete y collar.jpg': juguete,
    'manta terimica.png': manta
  }

  // Verificar si hay usuario logueado al cargar
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCart([])
    setShowCart(false)
  }

  // Funciones del carrito
  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId)
    setCart(newCart)
    if (newCart.length === 0) {
      setShowCart(false)
    }
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    const newCart = cart.map(item => 
      item.id === productId 
        ? { ...item, cantidad: newQuantity }
        : item
    )
    setCart(newCart)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2)
  }

  const handleCheckout = async () => {
    if (!user) {
      setShowLogin(true)
      return
    }

    try {
      const response = await fetch('http://localhost:3001/api/products/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productos: cart,
          total: getTotalPrice()
        })
      })

      if (response.ok) {
        const Swal = (await import('sweetalert2')).default
        Swal.fire({
          title: '¡Pedido Realizado!',
          text: 'Tu pedido ha sido procesado exitosamente. Recibirás una confirmación por email.',
          icon: 'success',
          confirmButtonColor: '#4CAF50'
        })
        setCart([])
        setShowCart(false)
      } else {
        const Swal = (await import('sweetalert2')).default
        Swal.fire({
          title: 'Error',
          text: 'Error al procesar el pedido. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonColor: '#e74c3c'
        })
      }
    } catch (error) {
      console.error('Error creating order:', error)
      const Swal = (await import('sweetalert2')).default
      Swal.fire({
        title: 'Error de Conexión',
        text: 'No se pudo conectar con el servidor. Verifica tu conexión.',
        icon: 'error',
        confirmButtonColor: '#e74c3c'
      })
    }
  }

  // Si está en modo login, mostrar solo el formulario
  if (showLogin) {
    return (
      <div className="App">
        <div className="registro-header-simple">
          <div className="container">
            <img className='Logo' src={logo} alt="Logo" />
            <button 
              className="btn-back"
              onClick={() => setShowLogin(false)}
            >
              ← Volver al sitio
            </button>
          </div>
        </div>
        <main>
          <Login setShowLogin={setShowLogin} setShowRegistro={setShowRegistro} setUser={setUser} />
        </main>
      </div>
    )
  }

  // Si está en modo registro, mostrar solo el formulario
  if (showRegistro) {
    return (
      <div className="App">
        <div className="registro-header-simple">
          <div className="container">
            <img className='Logo' src={logo} alt="Logo" />
            <button 
              className="btn-back"
              onClick={() => setShowRegistro(false)}
            >
              ← Volver al sitio
            </button>
          </div>
        </div>
        <main>
          <RegistroUsuario setShowRegistro={setShowRegistro} />
        </main>
      </div>
    )
  }

  const renderSection = () => {
    switch(activeSection) {
      case 'home':
        return <Home setActiveSection={setActiveSection} setShowRegistro={setShowRegistro} />
      case 'services':
        return <Services setActiveSection={setActiveSection} user={user} setShowLogin={setShowLogin} />
      case 'about':
        return <About />
      case 'contact':
        return <Contact user={user} setShowLogin={setShowLogin} />
      case 'products':
        return <Products user={user} setShowLogin={setShowLogin} setActiveSection={setActiveSection} cart={cart} setCart={setCart} />

      default:
        return <Home setActiveSection={setActiveSection} setShowRegistro={setShowRegistro} />
    }
  }

  return (
    <div className="App">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} setShowRegistro={setShowRegistro} setShowLogin={setShowLogin} user={user} handleLogout={handleLogout} cart={cart} showCart={showCart} setShowCart={setShowCart} />
      <main>
        {renderSection()}
      </main>
      
      {/* Modal del carrito */}
      {showCart && user && (
        <div className="cart-modal">
          <div className="cart-content">
            <div className="cart-header">
              <h3>Tu Carrito</h3>
              <button onClick={() => setShowCart(false)}>✕</button>
            </div>
            
            {cart.length === 0 ? (
              <p>Tu carrito está vacío</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={imageMap[item.imagen]} alt={item.nombre} />
                      <div className="item-details">
                        <h4>{item.nombre}</h4>
                        <p>${item.precio}</p>
                      </div>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.cantidad - 1)}>-</button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => updateQuantity(item.id, item.cantidad + 1)}>+</button>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="cart-footer">
                  <div className="total">
                    <strong>Total: ${getTotalPrice()}</strong>
                  </div>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Realizar Pedido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}

export default App