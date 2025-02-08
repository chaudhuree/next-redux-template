const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts); // Anyone can view products list
router.get('/:id', getProduct); // Anyone can view product details

// Protected routes
router.post('/', protect, admin, createProduct); // Only admin can create
router.put('/:id', protect, admin, updateProduct); // Only admin can update
router.delete('/:id', protect, admin, deleteProduct); // Only admin can delete

router.put('/:id/status', protect, admin, updateProductStatus); // Only admin can update status

module.exports = router;
