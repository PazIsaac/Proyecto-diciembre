const { User } = require('../models');
const { Op } = require('sequelize');

class UserController {
    // Obtener todos los usuarios (solo admin)
    async getAllUsers(req, res) {
        try {
            const { page = 1, limit = 10, search = '', rol = '' } = req.query;
            const offset = (page - 1) * limit;

            // Construir filtros
            const whereClause = {};
            
            if (search) {
                whereClause[Op.or] = [
                    { nombre: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } }
                ];
            }

            if (rol) {
                whereClause.rol = rol;
            }

            const { count, rows: users } = await User.findAndCountAll({
                where: whereClause,
                attributes: { exclude: ['contraseña', 'tokenEmail', 'resetPasswordToken'] },
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']]
            });

            res.json({
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalUsers: count,
                    hasNext: offset + users.length < count,
                    hasPrev: page > 1
                }
            });

        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Obtener usuario por ID (solo admin)
    async getUserById(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id, {
                attributes: { exclude: ['contraseña', 'tokenEmail', 'resetPasswordToken'] }
            });

            if (!user) {
                return res.status(404).json({
                    error: 'Usuario no encontrado'
                });
            }

            res.json({ user });

        } catch (error) {
            console.error('Get user by ID error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Actualizar usuario (solo admin)
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { nombre, email, rol, verificado } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    error: 'Usuario no encontrado'
                });
            }

            // Verificar si el email ya existe (si se está cambiando)
            if (email && email !== user.email) {
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(400).json({
                        error: 'El email ya está en uso'
                    });
                }
            }

            // Actualizar campos
            const updateData = {};
            if (nombre !== undefined) updateData.nombre = nombre;
            if (email !== undefined) updateData.email = email;
            if (rol !== undefined) updateData.rol = rol;
            if (verificado !== undefined) updateData.verificado = verificado;

            await user.update(updateData);

            res.json({
                message: 'Usuario actualizado exitosamente',
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol,
                    verificado: user.verificado,
                    updatedAt: user.updatedAt
                }
            });

        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Eliminar usuario (solo admin)
    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            // No permitir que el admin se elimine a sí mismo
            if (parseInt(id) === req.user.id) {
                return res.status(400).json({
                    error: 'No puedes eliminar tu propia cuenta'
                });
            }

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    error: 'Usuario no encontrado'
                });
            }

            await user.destroy();

            res.json({
                message: 'Usuario eliminado exitosamente'
            });

        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Obtener estadísticas de usuarios (solo admin)
    async getUserStats(req, res) {
        try {
            const totalUsers = await User.count();
            const verifiedUsers = await User.count({ where: { verificado: true } });
            const unverifiedUsers = await User.count({ where: { verificado: false } });
            
            const usersByRole = await User.findAll({
                attributes: [
                    'rol',
                    [require('sequelize').fn('COUNT', require('sequelize').col('rol')), 'count']
                ],
                group: ['rol']
            });

            // Usuarios registrados en los últimos 30 días
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const recentUsers = await User.count({
                where: {
                    createdAt: {
                        [Op.gte]: thirtyDaysAgo
                    }
                }
            });

            res.json({
                stats: {
                    total: totalUsers,
                    verified: verifiedUsers,
                    unverified: unverifiedUsers,
                    recent: recentUsers,
                    byRole: usersByRole.reduce((acc, item) => {
                        acc[item.rol] = parseInt(item.dataValues.count);
                        return acc;
                    }, {})
                }
            });

        } catch (error) {
            console.error('Get user stats error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
}

module.exports = new UserController();