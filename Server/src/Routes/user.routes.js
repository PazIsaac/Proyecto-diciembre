const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Todas las rutas requieren autenticación y rol de admin
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// CRUD de usuarios (solo admin)
router.get('/', userController.getAllUsers);
router.get('/stats', userController.getUserStats);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;