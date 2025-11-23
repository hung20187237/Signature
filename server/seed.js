const { sequelize } = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const seedData = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await sequelize.sync({ force: true });
        console.log('✅ Database cleared');

        // Create Admin User
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@bungu.store',
            password: 'admin123',
            isAdmin: true,
            role: 'admin',
        });
        console.log('✅ Admin user created (email: admin@bungu.store, password: admin123)');

        // Create Regular User
        const regularUser = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            addresses: [{
                name: 'John Doe',
                address1: '1-2-3 Shibuya',
                city: 'Tokyo',
                province: 'Tokyo',
                zip: '150-0002',
                country: 'Japan',
                phone: '+81-3-1234-5678',
                isDefault: true
            }]
        });
        console.log('✅ Regular user created (email: john@example.com, password: password123)');

        // Create Sample Products
        const products = await Product.bulkCreate([
            {
                name: 'Uni Jetstream 4&1 Metal Edition',
                handle: 'uni-jetstream-4-1-metal-edition',
                description: 'Premium multi-function pen with 4 colors and mechanical pencil. Features smooth Jetstream ink technology and durable metal body.',
                brand: 'Uni',
                category: 'Pens',
                specificType: 'Multi-function Pen',
                price: 2200,
                stock: 50,
                images: ['https://bungu.store/cdn/shop/files/uni-jetstream-4-1-metal-edition-2200-yen-668.jpg'],
                status: 'Active',
                isNewArrival: true,
                isBestSeller: true,
                tags: ['premium', 'multi-function', 'metal'],
                seo: {
                    title: 'Uni Jetstream 4&1 Metal Edition - Premium Multi-function Pen',
                    description: 'High-quality multi-function pen with smooth Jetstream ink'
                }
            },
            {
                name: 'Zebra Mildliner Double-Sided Highlighter - 5 Color Set',
                handle: 'zebra-mildliner-5-color-set',
                description: 'Soft color highlighters perfect for note-taking and journaling. Features both broad and fine tips.',
                brand: 'Zebra',
                category: 'Highlighters',
                price: 550,
                stock: 100,
                images: ['https://bungu.store/cdn/shop/products/zebra-mildliner-double-sided-highlighter-5-color-set-550-yen.jpg'],
                status: 'Active',
                isBestSeller: true,
                tags: ['highlighter', 'pastel', 'set'],
                variants: [
                    { sku: 'MILD-SET-A', color: 'Mild Color Set A', price: 550, inventory: 50 },
                    { sku: 'MILD-SET-B', color: 'Mild Color Set B', price: 550, inventory: 50 }
                ]
            },
            {
                name: 'Kokuyo Campus Notebook B5',
                handle: 'kokuyo-campus-notebook-b5',
                description: 'Classic Japanese notebook with smooth paper perfect for writing. Dotted lines for neat notes.',
                brand: 'Kokuyo',
                category: 'Notebooks',
                price: 180,
                stock: 200,
                images: [],
                status: 'Active',
                tags: ['notebook', 'student', 'classic']
            },
            {
                name: 'Pilot FriXion Ball Erasable Pen - Black',
                handle: 'pilot-frixion-ball-black',
                description: 'Revolutionary erasable gel pen. Write, erase, and rewrite without damaging paper.',
                brand: 'Pilot',
                category: 'Pens',
                specificType: 'Gel Pen',
                price: 120,
                salePrice: 99,
                stock: 150,
                onSale: true,
                images: [],
                status: 'Active',
                tags: ['erasable', 'gel', 'innovative']
            },
            {
                name: 'Tombow Mono Graph Mechanical Pencil',
                handle: 'tombow-mono-graph-mechanical-pencil',
                description: 'Shake mechanism mechanical pencil with rotating eraser. Perfect for students and professionals.',
                brand: 'Tombow',
                category: 'Pencils',
                specificType: 'Mechanical Pencil',
                price: 450,
                stock: 80,
                images: [],
                status: 'Active',
                isNewArrival: true,
                tags: ['mechanical', 'shake', 'professional']
            },
            {
                name: 'Midori MD Notebook - A5 Grid',
                handle: 'midori-md-notebook-a5-grid',
                description: 'Premium notebook with high-quality MD paper. Ideal for fountain pens and smooth writing experience.',
                brand: 'Midori',
                category: 'Notebooks',
                price: 1800,
                stock: 30,
                images: [],
                status: 'Active',
                tags: ['premium', 'fountain-pen-friendly', 'grid']
            }
        ]);
        console.log(`✅ Created ${products.length} sample products`);

        // Create Sample Orders
        const order1 = await Order.create({
            userId: regularUser.id,
            orderItems: [
                {
                    name: products[0].name,
                    qty: 1,
                    image: products[0].images[0] || '',
                    price: products[0].price,
                    product: products[0].id
                },
                {
                    name: products[1].name,
                    qty: 2,
                    image: products[1].images[0] || '',
                    price: products[1].price,
                    product: products[1].id
                }
            ],
            shippingAddress: regularUser.addresses[0],
            billingAddress: regularUser.addresses[0],
            paymentMethod: 'Credit Card',
            itemsPrice: 3300,
            taxPrice: 330,
            shippingPrice: 500,
            totalPrice: 4130,
            paymentStatus: 'Paid',
            fulfillmentStatus: 'Unfulfilled',
            orderStatus: 'Confirmed',
            paidAt: new Date()
        });

        const order2 = await Order.create({
            userId: regularUser.id,
            orderItems: [
                {
                    name: products[2].name,
                    qty: 3,
                    image: '',
                    price: products[2].price,
                    product: products[2].id
                }
            ],
            shippingAddress: regularUser.addresses[0],
            billingAddress: regularUser.addresses[0],
            paymentMethod: 'Bank Transfer',
            itemsPrice: 540,
            taxPrice: 54,
            shippingPrice: 500,
            totalPrice: 1094,
            paymentStatus: 'Pending',
            fulfillmentStatus: 'Unfulfilled',
            orderStatus: 'Pending Payment'
        });

        console.log(`✅ Created 2 sample orders`);

        console.log('\n🎉 Database seeding completed successfully!\n');
        console.log('📝 Login credentials:');
        console.log('   Admin: admin@bungu.store / admin123');
        console.log('   User:  john@example.com / password123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
