const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    getUsers,
    updateUserStatus,
    deleteUser,
    updateUserRole
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Auth routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);

// User routes (protected)
router.get('/users/me', protect, getMe);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/status', protect, admin, updateUserStatus);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
