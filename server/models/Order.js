const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow guest checkout
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    guestInfo: {
        type: DataTypes.JSON,
        defaultValue: {},
    },
    orderItems: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
    shippingAddress: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    billingAddress: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Financials
    itemsPrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
    },
    taxPrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
    },
    shippingPrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
    },
    // Statuses
    paymentStatus: {
        type: DataTypes.ENUM('Pending', 'Paid', 'Failed', 'Refunded', 'Partially Refunded'),
        defaultValue: 'Pending',
    },
    fulfillmentStatus: {
        type: DataTypes.ENUM('Unfulfilled', 'Partially Fulfilled', 'Fulfilled', 'Restocked'),
        defaultValue: 'Unfulfilled',
    },
    orderStatus: {
        type: DataTypes.ENUM('Draft', 'Pending Payment', 'Confirmed', 'Processing', 'Completed', 'Cancelled'),
        defaultValue: 'Pending Payment',
    },
    // Payment Details
    paymentResult: {
        type: DataTypes.JSON,
        defaultValue: {},
    },
    transactions: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    // Fulfillment Details
    shipments: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    // Refunds
    refunds: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    // Timeline & Notes
    timeline: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    notes: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    paidAt: {
        type: DataTypes.DATE,
    },
    deliveredAt: {
        type: DataTypes.DATE,
    },
}, {
    timestamps: true,
});

module.exports = Order;
