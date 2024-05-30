const express = require('express')
const router = express.Router();
const OrderController = require ('../controllers/orderController.js')

router.post('/order', OrderController.createOrder);
router.get('/orders', OrderController.getAllOrders);
router.get('/order/:id', OrderController.getOrderById);
router.put('/order/:id', OrderController.updateOrder);
router.delete('/order/:id', OrderController.deleteOrder);

module.exports = router;