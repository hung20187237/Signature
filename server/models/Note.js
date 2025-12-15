const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Note = sequelize.define('Note', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    adminId: {
        type: DataTypes.STRING, // ID of admin who created note
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'customer_notes',
    timestamps: true,
    updatedAt: false, // Spec only has created_at
});

module.exports = Note;
