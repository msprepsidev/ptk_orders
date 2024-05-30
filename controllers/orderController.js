const axios = require('axios');
const Order = require('../models/Order'); 

const CUSTOMER_API_URL = 'http://127.0.0.1:3000/customers';
const PRODUCT_API_URL = 'http://127.0.0.1:3000/products';

const OrderController = {
    async createOrder(req, res) {
        try {
            const newOrderData = req.body;
            const { customer, products } = newOrderData;

            // Vérifier si le client existe
            const customerResponse = await axios.get(`${CUSTOMER_API_URL}/${customer}`);
            if (!customerResponse.data) {
                return res.status(404).json({ message: 'Client non trouvé.' });
            }

            // Vérifier si les produits existent
            for (const productId of products) {
                const productResponse = await axios.get(`${PRODUCT_API_URL}/${productId}`);
                if (!productResponse.data) {
                    return res.status(404).json({ message: `Produit avec l'ID ${productId} non trouvé.` });
                }
            }

            const newOrder = new Order(newOrderData);
            await newOrder.save();
            res.status(201).json(newOrder);
        } catch (error) {
            console.error(`Erreur lors de la création de la commande: ${error}`);
            res.status(500).json({ message: 'Erreur lors de la création de la commande.' });
        }
    },

    async getOrderById(req, res) {
        try {
            const orderId = req.params.id;
            console.log(`Recherche de la commande avec l'ID : ${orderId}`);
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ message: 'Commande non trouvée.' });
            }

            // Fetch customer and products details from their respective APIs
            const customerResponse = await axios.get(`${CUSTOMER_API_URL}/${order.customer}`);
            const customerData = customerResponse.data;

            const productsData = await Promise.all(order.products.map(async (productId) => {
                const productResponse = await axios.get(`${PRODUCT_API_URL}/${productId}`);
                return productResponse.data;
            }));

            res.status(200).json({ ...order.toObject(), customer: customerData, products: productsData });
        } catch (error) {
            console.error(`Erreur lors de la recherche de la commande: ${error}`);
            res.status(500).json({ message: 'Erreur lors de la recherche de la commande.' });
        }
    },

    async getAllOrders(req, res) {
        try {
            const orders = await Order.find();
            const ordersWithDetails = await Promise.all(orders.map(async (order) => {
                const customerResponse = await axios.get(`${CUSTOMER_API_URL}/${order.customer}`);
                const customerData = customerResponse.data;

                const productsData = await Promise.all(order.products.map(async (productId) => {
                    const productResponse = await axios.get(`${PRODUCT_API_URL}/${productId}`);
                    return productResponse.data;
                }));

                return { ...order.toObject(), customer: customerData, products: productsData };
            }));

            res.status(200).json(ordersWithDetails);
        } catch (error) {
            console.error(`Erreur lors de la récupération des commandes: ${error}`);
            res.status(500).json({ message: 'Erreur lors de la récupération des commandes.' });
        }
    },

    async updateOrder(req, res) {
        try {
            const orderId = req.params.id;
            const updatedOrderData = req.body;

            // Vérifier si la commande existe
            const orderExists = await Order.findById(orderId);
            if (!orderExists) {
                return res.status(404).json({ message: 'Commande non trouvée.' });
            }

            // Vérifier si le client et les produits existent si ils sont mis à jour
            if (updatedOrderData.customer) {
                const customerResponse = await axios.get(`${CUSTOMER_API_URL}/${updatedOrderData.customer}`);
                if (!customerResponse.data) {
                    return res.status(404).json({ message: 'Client non trouvé.' });
                }
            }

            if (updatedOrderData.products) {
                for (const productId of updatedOrderData.products) {
                    const productResponse = await axios.get(`${PRODUCT_API_URL}/${productId}`);
                    if (!productResponse.data) {
                        return res.status(404).json({ message: `Produit avec l'ID ${productId} non trouvé.` });
                    }
                }
            }

            const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedOrderData, { new: true, runValidators: true });
            res.status(200).json(updatedOrder);
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de la commande: ${error}`);
            res.status(500).json({ message: 'Erreur lors de la mise à jour de la commande.' });
        }
    },

    async deleteOrder(req, res) {
        try {
            const orderId = req.params.id;
            const deletedOrder = await Order.findByIdAndDelete(orderId);

            if (!deletedOrder) {
                return res.status(404).json({ message: 'Commande non trouvée.' });
            }

            res.status(200).json({ message: 'Commande supprimée avec succès.' });
        } catch (error) {
            console.error(`Erreur lors de la suppression de la commande: ${error}`);
            res.status(500).json({ message: 'Erreur lors de la suppression de la commande.' });
        }
    }
}

module.exports = OrderController;
