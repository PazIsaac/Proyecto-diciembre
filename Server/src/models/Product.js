const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 150]
        }
    },
    categoria: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['medicamentos', 'alimentos', 'accesorios', 'juguetes', 'higiene', 'otros']]
        }
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
            isDecimal: true
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            isInt: true
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    stockMinimo: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        allowNull: false,
        validate: {
            min: 0,
            isInt: true
        }
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'productos',
    timestamps: true,
    hooks: {
        afterUpdate: async (product) => {
            // Verificar stock bajo después de actualizar
            if (product.stock <= product.stockMinimo && product.activo) {
                const emailService = require('../services/emailService');
                await emailService.sendLowStockAlert(product);
            }
        }
    }
});

// Método para verificar stock bajo
Product.prototype.isLowStock = function() {
    return this.stock <= this.stockMinimo;
};

// Método para reducir stock
Product.prototype.reduceStock = async function(quantity) {
    if (this.stock < quantity) {
        throw new Error('Stock insuficiente');
    }
    this.stock -= quantity;
    await this.save();
    return this;
};

// Método para aumentar stock
Product.prototype.increaseStock = async function(quantity) {
    this.stock += quantity;
    await this.save();
    return this;
};

module.exports = Product;