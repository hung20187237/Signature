const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            billingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            email // Optional, or from shippingAddress
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        }

        let userId = null;
        let user = null;

        // 1. Determine User (Logged in or Guest)
        if (req.user) {
            userId = req.user.id;
            user = req.user;
        } else {
            // Guest Checkout
            const customerEmail = email || shippingAddress?.email;

            if (!customerEmail) {
                res.status(400).json({ message: 'Email is required for guest checkout' });
                return;
            }

            user = await User.findOne({ where: { email: customerEmail } });

            if (user) {
                userId = user.id;
            } else {
                // Create new guest user
                user = await User.create({
                    name: shippingAddress?.name || 'Guest',
                    email: customerEmail,
                    password: null,
                    isGuest: true,
                    addresses: shippingAddress ? [shippingAddress] : []
                });
                userId = user.id;
            }
        }

        const order = await Order.create({
            userId: userId,
            orderItems,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        // 2. Update User Stats
        if (user) {
            user.totalOrders = (user.totalOrders || 0) + 1;
            user.totalSpent = (parseFloat(user.totalSpent || 0) + parseFloat(totalPrice)).toFixed(2);
            user.lastOrderAt = new Date();
            await user.save();
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['name', 'email']
            }]
        });

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (order) {
            order.paymentStatus = 'Paid';
            order.paidAt = new Date();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer?.email_address,
            };

            await order.save();
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (order) {
            order.fulfillmentStatus = 'Fulfilled';
            order.deliveredAt = new Date();

            await order.save();
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
};
