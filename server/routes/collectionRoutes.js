const express = require('express');
const router = express.Router();
const {
    getCollections,
    createCollection,
    getCollectionById,
    updateCollection,
    deleteCollection,
    getCollectionByHandle,
    getCollectionProducts,
    addProductsToCollection,
    removeProductFromCollection,
    reorderCollectionProducts,
    updateCollectionRules
} = require('../controllers/collectionController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/shop/:handle', getCollectionByHandle);
router.get('/:id/products', getCollectionProducts); // Used by both shop (public) and admin (preview)

// Admin routes
router.route('/')
    .get(protect, admin, getCollections)
    .post(protect, admin, createCollection);

router.route('/:id')
    .get(protect, admin, getCollectionById)
    .put(protect, admin, updateCollection)
    .delete(protect, admin, deleteCollection);

router.route('/:id/products')
    .post(protect, admin, addProductsToCollection);

router.route('/:id/products/order')
    .patch(protect, admin, reorderCollectionProducts);

router.route('/:id/products/:productId')
    .delete(protect, admin, removeProductFromCollection);

router.route('/:id/rules')
    .patch(protect, admin, updateCollectionRules);

module.exports = router;
