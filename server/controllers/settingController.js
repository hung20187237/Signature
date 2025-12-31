const Setting = require('../models/Setting');
const { Op } = require('sequelize');

// Helper to parse value based on type
const parseValue = (value, type) => {
    if (value === null || value === undefined) return null;
    switch (type) {
        case 'boolean':
            return value === 'true' || value === true || value === '1';
        case 'int':
            return parseInt(value, 10);
        case 'json':
            try {
                return typeof value === 'string' ? JSON.parse(value) : value;
            } catch (e) {
                return value;
            }
        default:
            return String(value);
    }
};

// Helper to format string for storage
const stringifyValue = (value, type) => {
    if (value === null || value === undefined) return null;
    if (type === 'json' && typeof value === 'object') return JSON.stringify(value);
    return String(value);
};

// --- ADMIN APIs ---

// Get all settings (grouped)
exports.getAllSettings = async (req, res) => {
    try {
        const settings = await Setting.findAll();

        // Group by group_name
        const grouped = settings.reduce((acc, item) => {
            const group = item.group_name;
            if (!acc[group]) acc[group] = {};

            // Mask sensitive data if needed (logic can be extended here)
            // For now, return all to admin
            acc[group][item.key] = parseValue(item.value, item.value_type);
            return acc;
        }, {});

        res.json(grouped);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update settings by group
exports.updateSettings = async (req, res) => {
    const { group } = req.params;
    const updates = req.body; // { key: value, key2: value2 }

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'No data provided' });
    }

    try {
        const results = [];

        for (const [key, value] of Object.entries(updates)) {
            // Find existing setting to get type
            const setting = await Setting.findOne({ where: { key } });

            if (setting) {
                // Update
                setting.value = stringifyValue(value, setting.value_type);
                await setting.save();
                results.push(setting);
            } else {
                // Create new (dynamic settings if needed, or error if strict)
                // For now, we assume settings are seeded/pre-defined or we insert defaults
                // Let's allow creating string types by default if not exists
                const newSetting = await Setting.create({
                    key,
                    value: String(value),
                    group_name: group,
                    value_type: 'string', // Default fallback
                    is_public: false // Default private
                });
                results.push(newSetting);
            }
        }

        res.json({ message: 'Settings updated', count: results.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// --- PUBLIC APIs ---

// Get public settings
exports.getPublicSettings = async (req, res) => {
    try {
        const settings = await Setting.findAll({
            where: { is_public: true }
        });

        // Return flat object: { "general.store_name": "Val", ... }
        // OR grouped. Let's return flat for easy consumption by FE Context
        // Actually grouped is often cleaner for context slices. Let's do flat with keys.

        const config = {};
        settings.forEach(s => {
            // Use short keys if possible? No, unique keys are safer.
            // But usually frontend wants specific named props.
            // Let's map full keys.
            config[s.key] = parseValue(s.value, s.value_type);

            // Helpful aliases (optional)
            if (s.key === 'storefront.logo_url') config.logoUrl = config[s.key];
            if (s.key === 'general.store_name') config.storeName = config[s.key];
        });

        res.json(config);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
