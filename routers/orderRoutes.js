const express = require('express')
const router = express.Router();
const OrderController = require ('../controllers/orderController.js')
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/order', authenticateToken, authorizeRole(['developper', 'customers', 'sales']), OrderController.createOrder);
router.get('/orders', authenticateToken, authorizeRole(['developper', 'customers', 'sales', 'marketing', 'management']), OrderController.getAllOrders);
router.get('/order/:id', authenticateToken, authorizeRole(['developper', 'customers', 'sales', 'marketing', 'management']), OrderController.getOrderById);
router.put('/order/:id', authenticateToken, authorizeRole(['management']), OrderController.updateOrder);
router.delete('/order/:id', authenticateToken, authorizeRole(['management']), OrderController.deleteOrder);

module.exports = router;