const express = require('express');
const router = express.Router();
const turnosController = require('../Controller/turnosController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas para usuarios autenticados
router.post('/', turnosController.createTurno);
router.get('/mios', turnosController.getMisTurnos);
router.delete('/:id', turnosController.deleteTurno);
router.get('/horarios/:fecha', turnosController.getHorariosDisponibles);

// Rutas solo para admin
router.get('/', roleMiddleware('admin'), turnosController.getAllTurnos);
router.put('/:id', roleMiddleware('admin'), turnosController.updateTurno);

module.exports = router;