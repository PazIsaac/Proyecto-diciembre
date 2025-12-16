const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    validateUserRegistration, 
    validateUserLogin, 
    validatePasswordReset, 
    validateNewPassword 
} = require('../middlewares/validationMiddleware');

// Rutas públicas
router.post('/register', validateUserRegistration, authController.register);
router.post('/login', validateUserLogin, authController.login);
router.post('/verify', authController.verifyEmail);
router.post('/forgot-password', validatePasswordReset, authController.forgotPassword);
router.post('/reset-password', validateNewPassword, authController.resetPassword);

// Rutas protegidas
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;