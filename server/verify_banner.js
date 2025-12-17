const { Sequelize, DataTypes, Op } = require('sequelize');
const path = require('path');

// Connect to SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
});

const BlogPost = sequelize.define('BlogPost', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('draft', 'published', 'archived'), defaultValue: 'draft' },
    publishedAt: { type: DataTypes.DATE },
}, { timestamps: true });

async function verify() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Create TEST PUBLISHED post with NULL date
        const test = await BlogPost.create({
            title: "TEST PUBLISHED BLOG",
            status: "published",
            publishedAt: null
        });
        console.log('Created test post:', test.id);

        console.log('\n--- Testing Blog Filter Logic ---');
        const posts = await BlogPost.findAll({
            where: {
                status: 'published',
                [Op.or]: [
                    { publishedAt: null },
                    { publishedAt: { [Op.lte]: new Date() } }
                ]
            }
        });

        console.log(`Found ${posts.length} matching posts.`);
        posts.forEach(p => console.log(`MATCH: ${p.title} | Status: ${p.status} | Date: ${p.publishedAt}`));

        // Cleanup
        await test.destroy();

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

verify();
