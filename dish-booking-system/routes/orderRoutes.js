const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Users can create and view their own orders
router.post('/', authMiddleware, roleMiddleware(['user']), orderController.createOrder);
router.get('/my-orders', authMiddleware, roleMiddleware(['user']), orderController.getUserOrders);

// Admin can view all orders
router.get('/', authMiddleware, roleMiddleware(['admin']), orderController.getAllOrders);

// Chef can update order status for their assigned orders
router.patch('/:id/status', authMiddleware, roleMiddleware(['chef']), orderController.updateOrderStatus);

module.exports = router;
