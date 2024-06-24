const request = require('supertest');
const express = require('express');
const sinon = require('sinon');
const mongoose = require('mongoose');
const MockAdapter = require('axios-mock-adapter');
const axios = require('axios');

const OrderController = require('../controllers/orderController');
const Order = require('../models/Order');

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Routes pour OrderController
app.post('/orders', OrderController.createOrder);
app.get('/orders/:id', OrderController.getOrderById);
app.get('/orders', OrderController.getAllOrders);
app.put('/orders/:id', OrderController.updateOrder);
app.delete('/orders/:id', OrderController.deleteOrder);

describe('Order Controller', () => {
    let orderId;

    // Avant tous les tests, connectez-vous à la base de données MongoDB
    beforeAll(async () => {
        const url = 'mongodb://localhost:27017/orders_test'; // URL de test pour MongoDB
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    // Après tous les tests, nettoyez la base de données et déconnectez-vous
    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    describe('createOrder', () => {
        it('devrait créer une nouvelle commande', async () => {
            const newOrderData = {
                customer: '60d21b4667d0d8992e610c85',
                products: ['60d21b4767d0d8992e610c86'],
                totalAmount: 100
            };

            // Mock des réponses API pour le client et le produit
            const mock = new MockAdapter(axios);
            mock.onGet(`http://127.0.0.2/api/customers/${newOrderData.customer}`).reply(200, { id: newOrderData.customer });
            mock.onGet(`http://127.0.0.1/api/products/${newOrderData.products[0]}`).reply(200, { id: newOrderData.products[0] });

            // Stub pour simuler l'enregistrement de la commande
            const orderStub = sinon.stub(Order.prototype, 'save').resolves({ ...newOrderData, _id: '60d21b5467d0d8992e610c87' });

            const response = await request(app)
                .post('/orders')
                .send(newOrderData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('customer', newOrderData.customer);
            expect(response.body).toHaveProperty('products');
            expect(response.body.products).toContain(newOrderData.products[0]);

            orderId = response.body._id; // Sauvegarde l'ID de la commande pour les tests ultérieurs

            orderStub.restore();
        });
    });

    describe('getOrderById', () => {
        it('devrait récupérer une commande par ID', async () => {
            const response = await request(app)
                .get(`/orders/${orderId}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('customer');
            expect(response.body).toHaveProperty('products');
        });
    });

    describe('getAllOrders', () => {
        it('devrait récupérer toutes les commandes', async () => {
            const response = await request(app)
                .get('/orders');

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe('updateOrder', () => {
        it('devrait mettre à jour une commande', async () => {
            const updatedOrderData = {
                customer: '60d21b4667d0d8992e610c85',
                products: ['60d21b4767d0d8992e610c86'],
                totalAmount: 150
            };

            const response = await request(app)
                .put(`/orders/${orderId}`)
                .send(updatedOrderData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('customer', updatedOrderData.customer);
            expect(response.body).toHaveProperty('products');
            expect(response.body.products).toContain(updatedOrderData.products[0]);
        });
    });

    describe('deleteOrder', () => {
        it('devrait supprimer une commande', async () => {
            const response = await request(app)
                .delete(`/orders/${orderId}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Commande supprimée avec succès.');
        });
    });
});
