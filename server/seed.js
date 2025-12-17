const { sequelize } = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Address = require('./models/Address');
const Tag = require('./models/Tag');
const Note = require('./models/Note');
const Collection = require('./models/Collection');
const CollectionProduct = require('./models/CollectionProduct');
const CollectionRule = require('./models/CollectionRule');
const Banner = require('./models/Banner');
const BlogPost = require('./models/BlogPost');
const BlogCategory = require('./models/BlogCategory');
const BlogTag = require('./models/BlogTag');

// Define Associations for Seeding
User.hasMany(Address, { foreignKey: 'customerId', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'customerId' });

BlogPost.belongsTo(BlogCategory, { foreignKey: 'categoryId', as: 'category' });
BlogCategory.hasMany(BlogPost, { foreignKey: 'categoryId', as: 'posts' });
BlogPost.belongsToMany(BlogTag, { through: 'BlogPostTags', as: 'tags' });
BlogTag.belongsToMany(BlogPost, { through: 'BlogPostTags', as: 'posts' });

const seedData = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await sequelize.sync({ force: true });
        console.log('✅ Database cleared');

        // Create Banners
        await Banner.create({
            title: 'Free Shipping on orders over $50',
            placement: 'home_promo',
            status: 'active',
            priority: 10
        });

        await Banner.create({
            title: 'Shop Our Collections',
            subtitle: 'Curated for your creativity',
            placement: 'collection_hero',
            layout: 'centered_card',
            imageUrl: 'https://bungu.store/cdn/shop/files/collection-hero.jpg',
            status: 'active',
            priority: 10
        });

        console.log('✅ Banners created');

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
                firstName: 'John',
                lastName: 'Doe',
                address1: '1-2-3 Shibuya',
                city: 'Tokyo',
                state: 'Tokyo',
                postalCode: '150-0002',
                country: 'Japan',
                phone: '+81-3-1234-5678',
                isDefaultShipping: true,
                isDefaultBilling: true
            }]
        }, {
            include: [{ model: Address, as: 'addresses' }]
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

        // Create Collections
        // 1. Manual Collection: Staff Picks
        const manualCollection = await Collection.create({
            title: 'Staff Picks',
            handle: 'staff-picks',
            description: 'Our team\'s favorite stationery items.',
            image: 'https://bungu.store/cdn/shop/collections/staff-picks.jpg',
            type: 'manual',
            status: 'active',
            publishedAt: new Date()
        });

        // Add products to Manual Collection
        await CollectionProduct.create({ collectionId: manualCollection.id, productId: products[0].id, position: 1 });
        await CollectionProduct.create({ collectionId: manualCollection.id, productId: products[4].id, position: 2 });
        await CollectionProduct.create({ collectionId: manualCollection.id, productId: products[5].id, position: 3 });

        // 2. Automatic Collection: Under ¥500
        const autoCollection = await Collection.create({
            title: 'Under ¥500',
            handle: 'under-500',
            description: 'Affordable stationery for everyday use.',
            type: 'automatic',
            status: 'active',
            matchPolicy: 'all',
            publishedAt: new Date()
        });

        await CollectionRule.create({
            collectionId: autoCollection.id,
            field: 'price',
            operator: 'lt',
            value: '500'
        });

        // 3. Automatic Collection: Deals (Sale)
        const dealsCollection = await Collection.create({
            title: 'Deals & Offers',
            handle: 'deals',
            description: 'Best prices on premium items.',
            type: 'automatic',
            status: 'active',
            matchPolicy: 'any',
            publishedAt: new Date()
        });

        await CollectionRule.create({
            collectionId: dealsCollection.id,
            field: 'tag',
            operator: 'equals',
            value: 'sale'
        });

        console.log('✅ Collections created');

        // Create Blogs
        const guideCategory = await BlogCategory.create({ name: 'Guides', slug: 'guides', description: 'Helpful user guides.' });
        const newsCategory = await BlogCategory.create({ name: 'News', slug: 'news', description: 'Latest updates.' });

        const fountainPenTag = await BlogTag.create({ name: 'Fountain Pens', slug: 'fountain-pens' });
        const paperTag = await BlogTag.create({ name: 'Paper', slug: 'paper' });

        const post1 = await BlogPost.create({
            title: 'How to Choose Your First Fountain Pen',
            slug: 'how-to-choose-first-fountain-pen',
            excerpt: 'A comprehensive guide for beginners looking to enter the world of fountain pens.',
            content: '<h2>Why Fountain Pens?</h2><p>They are amazing...</p><h3>Nib Sizes</h3><p>Choose Fine for daily writing...</p>',
            status: 'published',
            publishedAt: new Date(),
            categoryId: guideCategory.id,
            thumbnailUrl: 'https://bungu.store/cdn/shop/articles/fountain_pen_guide.jpg',
            authorName: 'Bungu Editor'
        });
        await post1.addTag(fountainPenTag);

        const post2 = await BlogPost.create({
            title: 'Top 5 Notebooks for 2025',
            slug: 'top-5-notebooks-2025',
            excerpt: 'Our curated list of the best paper for every need.',
            content: '<p>Here are our top picks...</p>',
            status: 'published',
            publishedAt: new Date(),
            categoryId: guideCategory.id,
            authorName: 'Paper Expert'
        });
        await post2.addTag(paperTag);

        console.log('✅ Blog data created');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
