const express = require('express');
const router = express.Router();
const productController = require('../Controller/productControllerSQLite');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas
router.post('/orders', authMiddleware, productController.createOrder);
router.get('/orders/user', authMiddleware, productController.getUserOrders);

module.exports = router;