const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ 
                    error: 'Authentication required.' 
                });
            }

            if (!allowedRoles.includes(req.user.rol)) {
                return res.status(403).json({ 
                    error: `Access denied. Required roles: ${allowedRoles.join(', ')}. Your role: ${req.user.rol}` 
                });
            }

            next();
        } catch (error) {
            console.error('Role middleware error:', error);
            res.status(500).json({ error: 'Server error during authorization.' });
        }
    };
};

module.exports = roleMiddleware;