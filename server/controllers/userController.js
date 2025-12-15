const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const crypto = require('crypto');
const Address = require('../models/Address');
const Tag = require('../models/Tag');
const Note = require('../models/Note');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ where: { email } });

        if (user) {
            if (user.isGuest) {
                // Upgrade guest to registered
                user.name = name;
                user.password = password; // Hook will hash it
                user.isGuest = false;
                await user.save();

                res.status(201).json({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    role: user.role,
                    token: generateToken(user.id),
                });
                return;
            } else {
                res.status(400).json({ message: 'User already exists' });
                return;
            }
        }

        user = await User.create({
            name,
            email,
            password,
            isGuest: false
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (user) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                role: user.role,
                addresses: user.addresses
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = req.body.password;
            }
            // Addresses are managed via separate endpoints now

            await user.save();

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                role: user.role,
                token: generateToken(user.id),
                addresses: user.addresses
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const { keyword, pageNumber, isGuest, minSpent, maxSpent } = req.query;
        const pageSize = 20;
        const page = Number(pageNumber) || 1;

        const where = {};

        if (keyword) {
            where[Op.or] = [
                { name: { [Op.like]: `%${keyword}%` } },
                { email: { [Op.like]: `%${keyword}%` } },
                { id: { [Op.like]: `%${keyword}%` } }
            ];
        }

        if (isGuest !== undefined) {
            where.isGuest = isGuest === 'true';
        }

        if (minSpent || maxSpent) {
            where.totalSpent = {};
            if (minSpent) where.totalSpent[Op.gte] = minSpent;
            if (maxSpent) where.totalSpent[Op.lte] = maxSpent;
        }

        const count = await User.count({ where });
        const users = await User.findAll({
            where,
            limit: pageSize,
            offset: pageSize * (page - 1),
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] },
            include: [
                { model: Tag, as: 'tags', attributes: ['tag'] }
            ]
        });

        const usersWithTags = users.map(user => {
            const u = user.toJSON();
            u.tags = u.tags ? u.tags.map(t => t.tag) : [];
            return u;
        });

        res.json({ users: usersWithTags, page, pages: Math.ceil(count / pageSize), count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Address, as: 'addresses' },
                { model: Tag, as: 'tags' },
                { model: Note, as: 'notes' }
            ]
        });

        if (user) {
            const orders = await require('../models/Order').findAll({
                where: { userId: user.id },
                order: [['createdAt', 'DESC']]
            });

            const userData = user.toJSON();
            userData.tags = userData.tags ? userData.tags.map(t => t.tag) : [];
            userData.notes = userData.notes ? userData.notes.map(n => ({
                id: n.id,
                content: n.message,
                date: n.createdAt,
                author: n.adminId || 'Admin'
            })) : [];

            res.json({ ...userData, orders });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
            if (req.body.isGuest !== undefined) user.isGuest = req.body.isGuest;
            if (req.body.acceptsMarketing !== undefined) user.acceptsMarketing = req.body.acceptsMarketing;

            if (req.body.tags) {
                const newTags = req.body.tags;
                const currentTags = await Tag.findAll({ where: { customerId: user.id } });
                const currentTagNames = currentTags.map(t => t.tag);

                const tagsToAdd = newTags.filter(tag => !currentTagNames.includes(tag));
                const tagsToRemove = currentTagNames.filter(tag => !newTags.includes(tag));

                if (tagsToRemove.length > 0) {
                    await Tag.destroy({ where: { customerId: user.id, tag: tagsToRemove } });
                }
                if (tagsToAdd.length > 0) {
                    await Tag.bulkCreate(tagsToAdd.map(tag => ({ customerId: user.id, tag })));
                }
            }

            const updatedUser = await user.save();

            // Fetch updated tags to return
            const updatedTags = await Tag.findAll({ where: { customerId: user.id } });

            res.json({
                _id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                role: updatedUser.role,
                isGuest: updatedUser.isGuest,
                tags: updatedTags.map(t => t.tag)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.findAll({ where: { customerId: req.user.id } });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add user address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res) => {
    try {
        const { firstName, lastName, address1, address2, city, state, postalCode, country, phone, isDefaultShipping, isDefaultBilling } = req.body;

        if (isDefaultShipping) {
            await Address.update({ isDefaultShipping: false }, { where: { customerId: req.user.id } });
        }
        if (isDefaultBilling) {
            await Address.update({ isDefaultBilling: false }, { where: { customerId: req.user.id } });
        }

        const address = await Address.create({
            customerId: req.user.id,
            firstName, lastName, address1, address2, city, state, postalCode, country, phone,
            isDefaultShipping, isDefaultBilling
        });

        res.status(201).json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
    try {
        const address = await Address.findByPk(req.params.id);

        if (address) {
            if (address.customerId !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            if (req.body.isDefaultShipping) {
                await Address.update({ isDefaultShipping: false }, { where: { customerId: req.user.id } });
            }
            if (req.body.isDefaultBilling) {
                await Address.update({ isDefaultBilling: false }, { where: { customerId: req.user.id } });
            }

            const updatedAddress = await address.update(req.body);
            res.json(updatedAddress);
        } else {
            res.status(404).json({ message: 'Address not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findByPk(req.params.id);

        if (address) {
            if (address.customerId !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await address.destroy();
            res.json({ message: 'Address removed' });
        } else {
            res.status(404).json({ message: 'Address not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add tag to user (Admin)
// @route   POST /api/users/:id/tags
// @access  Private/Admin
const addTag = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            const { tag } = req.body;
            if (!tag) return res.status(400).json({ message: 'Tag is required' });

            const existingTag = await Tag.findOne({
                where: { customerId: user.id, tag }
            });

            if (!existingTag) {
                await Tag.create({ customerId: user.id, tag });
            }

            const tags = await Tag.findAll({ where: { customerId: user.id } });
            res.json(tags.map(t => t.tag));
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove tag from user (Admin)
// @route   DELETE /api/users/:id/tags/:tag
// @access  Private/Admin
const removeTag = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            const { tag } = req.params;
            await Tag.destroy({
                where: { customerId: user.id, tag }
            });

            const tags = await Tag.findAll({ where: { customerId: user.id } });
            res.json(tags.map(t => t.tag));
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add note to user (Admin)
// @route   POST /api/users/:id/notes
// @access  Private/Admin
const addNote = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            const { content } = req.body;
            if (!content) return res.status(400).json({ message: 'Content is required' });

            await Note.create({
                customerId: user.id,
                message: content,
                adminId: req.user.id // Assuming req.user is admin
            });

            const notes = await Note.findAll({ where: { customerId: user.id }, order: [['createdAt', 'DESC']] });
            res.json(notes.map(n => ({
                id: n.id,
                content: n.message,
                date: n.createdAt,
                author: n.adminId || 'Admin'
            })));
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Merge customers (Admin)
// @route   POST /api/users/merge
// @access  Private/Admin
const mergeCustomers = async (req, res) => {
    try {
        const { sourceId, targetId } = req.body;

        const sourceUser = await User.findByPk(sourceId);
        const targetUser = await User.findByPk(targetId);

        if (!sourceUser || !targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 1. Move Orders
        const Order = require('../models/Order');
        await Order.update({ userId: targetId }, { where: { userId: sourceId } });

        // 2. Merge Stats
        targetUser.totalOrders = (targetUser.totalOrders || 0) + (sourceUser.totalOrders || 0);
        targetUser.totalSpent = (parseFloat(targetUser.totalSpent || 0) + parseFloat(sourceUser.totalSpent || 0)).toFixed(2);

        // 3. Move Addresses
        await Address.update({ customerId: targetId }, { where: { customerId: sourceId } });

        // 4. Move Tags (Handle duplicates)
        const sourceTags = await Tag.findAll({ where: { customerId: sourceId } });
        for (const tag of sourceTags) {
            const exists = await Tag.findOne({ where: { customerId: targetId, tag: tag.tag } });
            if (!exists) {
                await Tag.update({ customerId: targetId }, { where: { customerId: sourceId, tag: tag.tag } });
            } else {
                // Delete duplicate source tag
                await tag.destroy();
            }
        }

        // 5. Move Notes
        await Note.update({ customerId: targetId }, { where: { customerId: sourceId } });

        await targetUser.save();

        // 6. Delete Source User
        await sourceUser.destroy();

        res.json({ message: 'Customers merged successfully', targetUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetpassword/${resetToken}`;

        // Mock Email Sending
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            // await sendEmail({ ... });
            console.log(message);
            res.status(200).json({ success: true, data: message });
        } catch (error) {
            user.resetPasswordToken = null;
            user.resetPasswordExpire = null;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            where: {
                resetPasswordToken,
                resetPasswordExpire: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();

        res.status(201).json({
            success: true,
            token: generateToken(user.id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    updateUser,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    deleteUser,
    addTag,
    removeTag,
    addNote,
    mergeCustomers,
    forgotPassword,
    resetPassword,
};
