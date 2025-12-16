const express = require('express');
const router = express.Router();
const productController = require('../Controller/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { validateProduct } = require('../middlewares/validationMiddleware');

// Rutas públicas (solo lectura)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas (admin y vendedor)
router.use(authMiddleware);

// Crear producto (admin y vendedor)
router.post('/', roleMiddleware('admin', 'vendedor'), validateProduct, productController.createProduct);

// Actualizar producto (admin y vendedor)
router.put('/:id', roleMiddleware('admin', 'vendedor'), validateProduct, productController.updateProduct);

// Eliminar producto (admin y vendedor)
router.delete('/:id', roleMiddleware('admin', 'vendedor'), productController.deleteProduct);

// Gestión de stock (admin y vendedor)
router.patch('/:id/stock', roleMiddleware('admin', 'vendedor'), productController.updateStock);

// Estadísticas y reportes (admin y vendedor)
router.get('/reports/stats', roleMiddleware('admin', 'vendedor'), productController.getProductStats);
router.get('/reports/low-stock', roleMiddleware('admin', 'vendedor'), productController.getLowStockProducts);

module.exports = router;