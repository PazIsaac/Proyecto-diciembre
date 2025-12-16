import React, { useState, useEffect } from 'react';
import '../css/Products.css';

// Importar imágenes
import bozal from '../../assets/bozal.png';
import casita from '../../assets/casita perro.png';
import collar from '../../assets/collar1.jpg';
import cono from '../../assets/Cono de la verguenza.png';
import juguete from '../../assets/juguete y collar.jpg';
import manta from '../../assets/manta terimica.png';

const Products = ({ user, setShowLogin, setActiveSection, cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapeo de imágenes
  const imageMap = {
    'bozal.png': bozal,
    'casita perro.png': casita,
    'collar1.jpg': collar,
    'Cono de la verguenza.png': cono,
    'juguete y collar.jpg': juguete,
    'manta terimica.png': manta
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, cantidad: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, cantidad: newQuantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (!user) {
      setShowLogin(true);
      return;
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
      });

      if (response.ok) {
        alert('¡Pedido realizado exitosamente!');
        setCart([]);
        setShowCart(false);
      } else {
        alert('Error al procesar el pedido');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error de conexión');
    }
  };

  if (!user) {
    return (
      <section className="products-login-required">
        <div className="container">
          <h2>Inicia sesión para ver nuestros productos</h2>
          <p>Necesitas estar registrado para acceder a nuestra tienda</p>
          <button className="btn-primary" onClick={() => setShowLogin(true)}>
            Iniciar Sesión
          </button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="products">
        <div className="container">
          <div className="loading">Cargando productos...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="products">
      <div className="container">
        <div className="products-header">
          <h1>Productos para tu Mascota</h1>
        </div>



        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={imageMap[product.imagen]} 
                  alt={product.nombre}
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
              </div>
              <div className="product-info">
                <h3>{product.nombre}</h3>
                <p className="product-description">{product.descripcion}</p>
                <div className="product-category">{product.categoria}</div>
                <div className="product-price">${product.precio}</div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;