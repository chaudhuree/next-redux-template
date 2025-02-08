const Product = require('../models/Product');

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        if (!name || !description || !price || !category) {
            res.status(400);
            throw new Error('Please provide all required fields');
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            createdBy: req.user._id
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Private
const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { category: new RegExp(search, 'i') }
            ];
        }

        if (status) {
            query.status = status;
        }

        const products = await Product.find(query)
            .populate('createdBy', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Private
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // Check if user is admin or product creator
        if (req.user.role !== 'admin' && product.createdBy.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this product');
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('createdBy', 'name email');

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // Check if user is admin or product creator
        if (req.user.role !== 'admin' && product.createdBy.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this product');
        }

        await product.deleteOne();

        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update product status
// @route   PUT /api/v1/products/:id/status
// @access  Private/Admin
const updateProductStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        product.status = status;
        await product.save();

        res.json({ message: 'Product status updated' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus
};
