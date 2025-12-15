const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.route('/').post(registerUser);
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Address Routes
router.route('/addresses').get(protect, getAddresses).post(protect, addAddress);
router.route('/addresses/:id').put(protect, updateAddress).delete(protect, deleteAddress);

// Admin Routes
router.route('/').get(protect, admin, getUsers);
router.route('/merge').post(protect, admin, mergeCustomers); // Merge route
router
    .route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

router.route('/:id/tags').post(protect, admin, addTag);
router.route('/:id/tags/:tag').delete(protect, admin, removeTag);
router.route('/:id/notes').post(protect, admin, addNote);

module.exports = router;
