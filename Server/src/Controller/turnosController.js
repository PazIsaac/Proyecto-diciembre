const { pool } = require('../config/database');

class TurnosController {
    // Crear turno
    async createTurno(req, res) {
        try {
            const { fecha, hora, motivo } = req.body;
            const usuario_id = req.user.id;

            // Verificar si ya existe un turno en esa fecha y hora
            const [existingTurno] = await pool.execute(
                'SELECT id FROM turnos WHERE fecha = ? AND hora = ?',
                [fecha, hora]
            );

            if (existingTurno.length > 0) {
                return res.status(400).json({
                    error: 'Ya existe un turno en esa fecha y hora'
                });
            }

            // Crear turno
            const [result] = await pool.execute(
                'INSERT INTO turnos (usuario_id, fecha, hora, motivo, estado) VALUES (?, ?, ?, ?, ?)',
                [usuario_id, fecha, hora, motivo, 'pendiente']
            );

            res.status(201).json({
                message: 'Turno creado exitosamente',
                turno: {
                    id: result.insertId,
                    usuario_id,
                    fecha,
                    hora,
                    motivo,
                    estado: 'pendiente'
                }
            });

        } catch (error) {
            console.error('Create turno error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Obtener todos los turnos (solo admin)
    async getAllTurnos(req, res) {
        try {
            const [turnos] = await pool.execute(`
                SELECT t.*, u.nombre as usuario_nombre, u.email as usuario_email 
                FROM turnos t 
                JOIN usuarios u ON t.usuario_id = u.id 
                ORDER BY t.fecha DESC, t.hora DESC
            `);

            res.json({ turnos });

        } catch (error) {
            console.error('Get all turnos error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Obtener turnos del usuario logueado
    async getMisTurnos(req, res) {
        try {
            const usuario_id = req.user.id;

            const [turnos] = await pool.execute(
                'SELECT * FROM turnos WHERE usuario_id = ? ORDER BY fecha DESC, hora DESC',
                [usuario_id]
            );

            res.json({ turnos });

        } catch (error) {
            console.error('Get mis turnos error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Actualizar turno (admin)
    async updateTurno(req, res) {
        try {
            const { id } = req.params;
            const { fecha, hora, motivo, estado, notas } = req.body;

            // Verificar si el turno existe
            const [existingTurno] = await pool.execute(
                'SELECT id FROM turnos WHERE id = ?',
                [id]
            );

            if (existingTurno.length === 0) {
                return res.status(404).json({
                    error: 'Turno no encontrado'
                });
            }

            // Si se cambia fecha/hora, verificar disponibilidad
            if (fecha && hora) {
                const [conflictTurno] = await pool.execute(
                    'SELECT id FROM turnos WHERE fecha = ? AND hora = ? AND id != ?',
                    [fecha, hora, id]
                );

                if (conflictTurno.length > 0) {
                    return res.status(400).json({
                        error: 'Ya existe un turno en esa fecha y hora'
                    });
                }
            }

            // Construir query de actualización
            const updates = [];
            const values = [];

            if (fecha) {
                updates.push('fecha = ?');
                values.push(fecha);
            }
            if (hora) {
                updates.push('hora = ?');
                values.push(hora);
            }
            if (motivo) {
                updates.push('motivo = ?');
                values.push(motivo);
            }
            if (estado) {
                updates.push('estado = ?');
                values.push(estado);
            }
            if (notas !== undefined) {
                updates.push('notas = ?');
                values.push(notas);
            }

            if (updates.length === 0) {
                return res.status(400).json({
                    error: 'No hay campos para actualizar'
                });
            }

            values.push(id);

            await pool.execute(
                `UPDATE turnos SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            res.json({
                message: 'Turno actualizado exitosamente'
            });

        } catch (error) {
            console.error('Update turno error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Eliminar turno
    async deleteTurno(req, res) {
        try {
            const { id } = req.params;
            const usuario_id = req.user.id;
            const isAdmin = req.user.rol === 'admin';

            // Verificar si el turno existe y pertenece al usuario (o es admin)
            let query = 'SELECT id, usuario_id FROM turnos WHERE id = ?';
            let params = [id];

            if (!isAdmin) {
                query += ' AND usuario_id = ?';
                params.push(usuario_id);
            }

            const [turno] = await pool.execute(query, params);

            if (turno.length === 0) {
                return res.status(404).json({
                    error: 'Turno no encontrado'
                });
            }

            // Eliminar turno
            await pool.execute('DELETE FROM turnos WHERE id = ?', [id]);

            res.json({
                message: 'Turno eliminado exitosamente'
            });

        } catch (error) {
            console.error('Delete turno error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Obtener horarios disponibles para una fecha
    async getHorariosDisponibles(req, res) {
        try {
            const { fecha } = req.params;

            // Horarios de trabajo (9:00 a 18:00, cada hora)
            const horariosBase = [
                '09:00', '10:00', '11:00', '12:00', 
                '14:00', '15:00', '16:00', '17:00', '18:00'
            ];

            // Obtener turnos ocupados para esa fecha
            const [turnosOcupados] = await pool.execute(
                'SELECT hora FROM turnos WHERE fecha = ?',
                [fecha]
            );

            const horasOcupadas = turnosOcupados.map(t => t.hora);
            const horariosDisponibles = horariosBase.filter(hora => 
                !horasOcupadas.includes(hora)
            );

            res.json({
                fecha,
                horariosDisponibles
            });

        } catch (error) {
            console.error('Get horarios disponibles error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
}

module.exports = new TurnosController();