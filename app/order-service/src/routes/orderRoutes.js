const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes protégées par authentification
router.use(authMiddleware);

// Routes pour les commandes
router.post('/', orderController.createOrder);
router.get('/user', orderController.getUserOrders);
router.get('/:id', orderController.getOrder);
router.patch('/:id/status', orderController.updateOrderStatus);
router.delete('/:id', orderController.cancelOrder);

module.exports = router; 