const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');
const Collection = require('./models/Collection');
const CollectionProduct = require('./models/CollectionProduct');
const CollectionRule = require('./models/CollectionRule');
const collectionRoutes = require('./routes/collectionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Define model associations
// Define model associations
Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

const Address = require('./models/Address');
const Tag = require('./models/Tag');
const Note = require('./models/Note');

User.hasMany(Address, { foreignKey: 'customerId', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'customerId' });

User.hasMany(Tag, { foreignKey: 'customerId', as: 'tags' });
Tag.belongsTo(User, { foreignKey: 'customerId' });

User.hasMany(Note, { foreignKey: 'customerId', as: 'notes' });
Note.belongsTo(User, { foreignKey: 'customerId' });

// Collection Associations
Collection.belongsToMany(Product, { through: CollectionProduct, foreignKey: 'collectionId', as: 'products' });
Product.belongsToMany(Collection, { through: CollectionProduct, foreignKey: 'productId', as: 'collections' });

Collection.hasMany(CollectionProduct, { foreignKey: 'collectionId', as: 'productRelations' });
CollectionProduct.belongsTo(Collection, { foreignKey: 'collectionId' });

Collection.hasMany(CollectionRule, { foreignKey: 'collectionId', as: 'rules' });
CollectionRule.belongsTo(Collection, { foreignKey: 'collectionId' });

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/collections', collectionRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Connect to Database and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
