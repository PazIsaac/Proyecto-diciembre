const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    contraseña: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [6, 255]
        }
    },
    rol: {
        type: DataTypes.ENUM('admin', 'vendedor', 'cliente'),
        defaultValue: 'cliente',
        allowNull: false
    },
    verificado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    tokenEmail: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resetPasswordToken: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'usuarios',
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.contraseña) {
                user.contraseña = await bcrypt.hash(user.contraseña, 12);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('contraseña')) {
                user.contraseña = await bcrypt.hash(user.contraseña, 12);
            }
        }
    }
});

// Método para comparar contraseñas
User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.contraseña);
};

// Método para generar hash de contraseña
User.hashPassword = async function(password) {
    return await bcrypt.hash(password, 12);
};

module.exports = User;