/**
 * Yemen E-Commerce Platform - Main Server
 * A comprehensive e-commerce solution for Yemen with secure payment and vendor management
 * 
 * Features:
 * - User authentication and authorization
 * - Product management
 * - Shopping cart and checkout
 * - Order management
 * - Vendor dashboard
 * - Admin panel
 * - Payment gateway integration (MTN Yemen, Sabafon)
 * - Notifications system
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

// Enable CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
app.use('/assets', express.static(path.join(__dirname, '../../assets')));

// ==================== ROUTES ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Yemen E-Commerce Platform is running',
        timestamp: new Date().toISOString()
    });
});

// Authentication routes (placeholder)
app.post('/api/auth/register', (req, res) => {
    res.json({
        status: 'success',
        message: 'User registration endpoint',
        data: { userId: 1, email: req.body.email }
    });
});

app.post('/api/auth/login', (req, res) => {
    res.json({
        status: 'success',
        message: 'User login endpoint',
        token: 'jwt_token_here'
    });
});

// Products routes (placeholder)
app.get('/api/products', (req, res) => {
    res.json({
        status: 'success',
        message: 'Get all products',
        data: [
            {
                id: 1,
                name: 'Samsung Galaxy A12',
                category: 'phones',
                price: 150000,
                currency: 'YER',
                image: '/assets/images/phone1.jpg',
                rating: 4.5,
                reviews: 120
            },
            {
                id: 2,
                name: 'Wireless Headphones',
                category: 'electronics',
                price: 50000,
                currency: 'YER',
                image: '/assets/images/headphones1.jpg',
                rating: 4.2,
                reviews: 85
            }
        ]
    });
});

app.get('/api/products/:id', (req, res) => {
    res.json({
        status: 'success',
        message: 'Get product details',
        data: {
            id: req.params.id,
            name: 'Product Name',
            description: 'Product description here',
            price: 100000,
            category: 'electronics'
        }
    });
});

// Cart routes (placeholder)
app.post('/api/cart/add', (req, res) => {
    res.json({
        status: 'success',
        message: 'Item added to cart',
        cartTotal: 250000
    });
});

app.get('/api/cart', (req, res) => {
    res.json({
        status: 'success',
        message: 'Get cart items',
        data: []
    });
});

// Orders routes (placeholder)
app.post('/api/orders/create', (req, res) => {
    res.json({
        status: 'success',
        message: 'Order created successfully',
        orderId: 'ORD-' + Date.now(),
        paymentMethod: req.body.paymentMethod
    });
});

app.get('/api/orders', (req, res) => {
    res.json({
        status: 'success',
        message: 'Get user orders',
        data: []
    });
});

// Payment routes (placeholder)
app.post('/api/payment/process', (req, res) => {
    const { method, amount } = req.body;
    res.json({
        status: 'success',
        message: `Payment processed via ${method}`,
        amount: amount,
        transactionId: 'TXN-' + Date.now()
    });
});

// Vendor routes (placeholder)
app.post('/api/vendor/register', (req, res) => {
    res.json({
        status: 'success',
        message: 'Vendor registration successful',
        vendorId: 'VEND-' + Date.now()
    });
});

app.get('/api/vendor/dashboard', (req, res) => {
    res.json({
        status: 'success',
        message: 'Vendor dashboard data',
        data: {
            totalSales: 5000000,
            totalOrders: 150,
            totalProducts: 45,
            revenue: 2500000
        }
    });
});

// Admin routes (placeholder)
app.get('/api/admin/users', (req, res) => {
    res.json({
        status: 'success',
        message: 'Get all users',
        data: []
    });
});

app.get('/api/admin/vendors', (req, res) => {
    res.json({
        status: 'success',
        message: 'Get all vendors',
        data: []
    });
});

// ==================== ERROR HANDLING ====================

// 404 Not Found
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

// ==================== SERVER START ====================

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════════════════╗
    ║  Yemen E-Commerce Platform Server                      ║
    ║  Running on http://localhost:${PORT}                    ║
    ║  Environment: ${process.env.NODE_ENV || 'development'}                        ║
    ╚════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
