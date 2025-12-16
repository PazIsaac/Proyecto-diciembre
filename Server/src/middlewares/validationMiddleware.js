const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

// Validaciones para registro de usuario
const validateUserRegistration = [
    body('nombre')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('contraseña')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    handleValidationErrors
];

// Validaciones para login
const validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('contraseña')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

// Validaciones para productos
const validateProduct = [
    body('nombre')
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage('Product name must be between 2 and 150 characters'),
    
    body('categoria')
        .isIn(['medicamentos', 'alimentos', 'accesorios', 'juguetes', 'higiene', 'otros'])
        .withMessage('Invalid category'),
    
    body('precio')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    
    body('stock')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    
    body('descripcion')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
    
    body('stockMinimo')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Minimum stock must be a non-negative integer'),
    
    handleValidationErrors
];

// Validaciones para reset de contraseña
const validatePasswordReset = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    handleValidationErrors
];

const validateNewPassword = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required'),
    
    body('contraseña')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    handleValidationErrors
];

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateProduct,
    validatePasswordReset,
    validateNewPassword,
    handleValidationErrors
};