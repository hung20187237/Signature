const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const blogController = require('../controllers/blogController');

// Public Routes
router.get('/posts', blogController.getPosts);
router.get('/posts/:slug', blogController.getPostBySlug);
router.get('/categories', blogController.getCategories);
router.get('/tags', blogController.getTags);

// Admin Routes
router.get('/admin/posts', protect, admin, blogController.getAdminPosts);
router.get('/admin/posts/:id', protect, admin, blogController.getPostById);
router.post('/admin/posts', protect, admin, blogController.createPost);
router.put('/admin/posts/:id', protect, admin, blogController.updatePost);
router.delete('/admin/posts/:id', protect, admin, blogController.deletePost);

router.post('/admin/categories', protect, admin, blogController.createCategory);
router.post('/admin/tags', protect, admin, blogController.createTag);

module.exports = router;
