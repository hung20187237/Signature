const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const products = [
    {
        name: 'Japanese Gel Pen 0.5mm',
        description: 'Smooth writing gel pen with quick-drying ink. Perfect for everyday use.',
        price: 12.00,
        category: 'Pens',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80'],
        options: [{ name: 'Color', values: ['Black', 'Blue', 'Red'] }]
    },
    {
        name: 'Uni-ball One F',
        description: 'Fade resistant ink with a modern design. The weighted tip provides stability.',
        price: 5.50,
        category: 'Pens',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80'],
        options: [{ name: 'Color', values: ['Black', 'Blue-Black'] }]
    },
    {
        name: 'Premium Fountain Pen',
        description: 'Elegant fountain pen with a gold-plated nib. A classic choice for enthusiasts.',
        price: 45.00,
        category: 'Pens',
        stock: 20,
        images: ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80'],
        options: [{ name: 'Nib', values: ['F', 'M', 'B'] }]
    },
    {
        name: 'Mechanical Pencil 0.5mm',
        description: 'Precision mechanical pencil with auto-rotation mechanism to keep the lead sharp.',
        price: 8.00,
        category: 'Pencils',
        stock: 80,
        images: ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80'],
        options: [{ name: 'Color', values: ['Silver', 'Black'] }]
    },
];

const importData = async () => {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
