const { db } = require('../config/database');

class ProductController {
    // Obtener todos los productos
    async getAllProducts(req, res) {
        try {
            const products = await new Promise((resolve, reject) => {
                db.all('SELECT * FROM productos WHERE activo = 1 ORDER BY created_at DESC', (error, rows) => {
                    if (error) reject(error);
                    else resolve(rows);
                });
            });

            res.json({ products });
        } catch (error) {
            console.error('Get products error:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Obtener producto por ID
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            
            const product = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM productos WHERE id = ? AND activo = 1', [id], (error, row) => {
                    if (error) reject(error);
                    else resolve(row);
                });
            });

            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            res.json({ product });
        } catch (error) {
            console.error('Get product error:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Crear pedido
    async createOrder(req, res) {
        try {
            const { productos, total } = req.body;
            const userId = req.user.id;

            // Crear pedido
            const result = await new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO pedidos (usuario_id, total, estado) VALUES (?, ?, ?)',
                    [userId, total, 'pendiente'],
                    function(error) {
                        if (error) reject(error);
                        else resolve({ insertId: this.lastID });
                    }
                );
            });

            const pedidoId = result.insertId;

            // Insertar items del pedido
            for (const item of productos) {
                await new Promise((resolve, reject) => {
                    db.run(
                        'INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                        [pedidoId, item.id, item.cantidad, item.precio],
                        function(error) {
                            if (error) reject(error);
                            else resolve();
                        }
                    );
                });
            }

            res.status(201).json({
                message: 'Pedido creado exitosamente',
                pedidoId
            });

        } catch (error) {
            console.error('Create order error:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Obtener pedidos del usuario
    async getUserOrders(req, res) {
        try {
            const userId = req.user.id;

            const orders = await new Promise((resolve, reject) => {
                db.all(`
                    SELECT p.*, 
                           GROUP_CONCAT(pr.nombre || ' (x' || pi.cantidad || ')') as productos
                    FROM pedidos p
                    LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
                    LEFT JOIN productos pr ON pi.producto_id = pr.id
                    WHERE p.usuario_id = ?
                    GROUP BY p.id
                    ORDER BY p.created_at DESC
                `, [userId], (error, rows) => {
                    if (error) reject(error);
                    else resolve(rows);
                });
            });

            res.json({ orders });
        } catch (error) {
            console.error('Get user orders error:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

module.exports = new ProductController();