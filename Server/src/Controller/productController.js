const { Product } = require('../models');
const { Op } = require('sequelize');
const emailService = require('../services/emailService');

class ProductController {
    // Crear producto (admin y vendedor)
    async createProduct(req, res) {
        try {
            const { nombre, categoria, precio, stock, descripcion, stockMinimo } = req.body;

            const product = await Product.create({
                nombre,
                categoria,
                precio,
                stock,
                descripcion,
                stockMinimo: stockMinimo || 5
            });

            res.status(201).json({
                message: 'Producto creado exitosamente',
                product
            });

        } catch (error) {
            console.error('Create product error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Obtener todos los productos
    async getAllProducts(req, res) {
        try {
            const { 
                page = 1, 
                limit = 10, 
                search = '', 
                categoria = '', 
                lowStock = false,
                sortBy = 'createdAt',
                sortOrder = 'DESC'
            } = req.query;

            const offset = (page - 1) * limit;

            // Construir filtros
            const whereClause = { activo: true };
            
            if (search) {
                whereClause[Op.or] = [
                    { nombre: { [Op.like]: `%${search}%` } },
                    { descripcion: { [Op.like]: `%${search}%` } }
                ];
            }

            if (categoria) {
                whereClause.categoria = categoria;
            }

            if (lowStock === 'true') {
                whereClause[Op.and] = [
                    require('sequelize').where(
                        require('sequelize').col('stock'),
                        Op.lte,
                        require('sequelize').col('stockMinimo')
                    )
                ];
            }

            const { count, rows: products } = await Product.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [[sortBy, sortOrder.toUpperCase()]]
            });

            res.json({
                products,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalProducts: count,
                    hasNext: offset + products.length < count,
                    hasPrev: page > 1
                }
            });

        } catch (error) {
            console.error('Get all products error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Obtener producto por ID
    async getProductById(req, res) {
        try {
            const { id } = req.params;

            const product = await Product.findOne({
                where: { id, activo: true }
            });

            if (!product) {
                return res.status(404).json({
                    error: 'Producto no encontrado'
                });
            }

            res.json({ product });

        } catch (error) {
            console.error('Get product by ID error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Actualizar producto (admin y vendedor)
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { nombre, categoria, precio, stock, descripcion, stockMinimo, activo } = req.body;

            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({
                    error: 'Producto no encontrado'
                });
            }

            // Actualizar campos
            const updateData = {};
            if (nombre !== undefined) updateData.nombre = nombre;
            if (categoria !== undefined) updateData.categoria = categoria;
            if (precio !== undefined) updateData.precio = precio;
            if (stock !== undefined) updateData.stock = stock;
            if (descripcion !== undefined) updateData.descripcion = descripcion;
            if (stockMinimo !== undefined) updateData.stockMinimo = stockMinimo;
            if (activo !== undefined) updateData.activo = activo;

            await product.update(updateData);

            // Verificar stock bajo después de actualizar
            if (stock !== undefined && product.stock <= product.stockMinimo && product.activo) {
                try {
                    await emailService.sendLowStockAlert(product);
                } catch (emailError) {
                    console.error('Error sending low stock alert:', emailError);
                }
            }

            res.json({
                message: 'Producto actualizado exitosamente',
                product
            });

        } catch (error) {
            console.error('Update product error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Eliminar producto (admin y vendedor)
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;

            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({
                    error: 'Producto no encontrado'
                });
            }

            // Soft delete - marcar como inactivo
            await product.update({ activo: false });

            res.json({
                message: 'Producto eliminado exitosamente'
            });

        } catch (error) {
            console.error('Delete product error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Obtener productos con stock bajo (admin y vendedor)
    async getLowStockProducts(req, res) {
        try {
            const products = await Product.findAll({
                where: {
                    activo: true,
                    [Op.and]: [
                        require('sequelize').where(
                            require('sequelize').col('stock'),
                            Op.lte,
                            require('sequelize').col('stockMinimo')
                        )
                    ]
                },
                order: [['stock', 'ASC']]
            });

            res.json({
                products,
                count: products.length
            });

        } catch (error) {
            console.error('Get low stock products error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Obtener estadísticas de productos (admin y vendedor)
    async getProductStats(req, res) {
        try {
            const totalProducts = await Product.count({ where: { activo: true } });
            const inactiveProducts = await Product.count({ where: { activo: false } });
            
            const productsByCategory = await Product.findAll({
                where: { activo: true },
                attributes: [
                    'categoria',
                    [require('sequelize').fn('COUNT', require('sequelize').col('categoria')), 'count'],
                    [require('sequelize').fn('SUM', require('sequelize').col('stock')), 'totalStock']
                ],
                group: ['categoria']
            });

            const lowStockCount = await Product.count({
                where: {
                    activo: true,
                    [Op.and]: [
                        require('sequelize').where(
                            require('sequelize').col('stock'),
                            Op.lte,
                            require('sequelize').col('stockMinimo')
                        )
                    ]
                }
            });

            const totalInventoryValue = await Product.sum('precio', {
                where: { activo: true }
            });

            res.json({
                stats: {
                    total: totalProducts,
                    inactive: inactiveProducts,
                    lowStock: lowStockCount,
                    totalValue: totalInventoryValue || 0,
                    byCategory: productsByCategory.map(item => ({
                        categoria: item.categoria,
                        count: parseInt(item.dataValues.count),
                        totalStock: parseInt(item.dataValues.totalStock) || 0
                    }))
                }
            });

        } catch (error) {
            console.error('Get product stats error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Actualizar stock de producto (admin y vendedor)
    async updateStock(req, res) {
        try {
            const { id } = req.params;
            const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

            if (!quantity || !operation || !['add', 'subtract'].includes(operation)) {
                return res.status(400).json({
                    error: 'Cantidad y operación (add/subtract) son requeridas'
                });
            }

            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({
                    error: 'Producto no encontrado'
                });
            }

            try {
                if (operation === 'add') {
                    await product.increaseStock(quantity);
                } else {
                    await product.reduceStock(quantity);
                }

                res.json({
                    message: `Stock ${operation === 'add' ? 'aumentado' : 'reducido'} exitosamente`,
                    product: {
                        id: product.id,
                        nombre: product.nombre,
                        stock: product.stock,
                        stockMinimo: product.stockMinimo
                    }
                });

            } catch (stockError) {
                return res.status(400).json({
                    error: stockError.message
                });
            }

        } catch (error) {
            console.error('Update stock error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
}

module.exports = new ProductController();