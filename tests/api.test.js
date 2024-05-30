const app = require('../server.js')
const request = require('supertest')
const sinon = require('sinon');
const Customer = require( '../models/Customer.js');
const CustomerController = require ('../controllers/customerController.js')

let server;

beforeAll((done) => {
    server = app.listen(5000, () => {
        console.log('Test server running on port 5000');
        done();
    });
});

afterAll((done) => {
    server.close(() => {
        console.log('Test server closed');
        done();
    });
});

describe('API Tests', () => {
    it('GET /customers - should return all customers', async () => {
        const response = await request(server).get('/customers');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('POST /customers - should create a new customers', async () => {
        const req = {
            body:{
                _id: '664e46374248b620aba521c7',
                name: 'John',
                lastname: 'DOE',
                email: 'john@example.com',
                phone: 1234567890,
                address: {
                    postalCode: 1234,
                    city: 'New York',
                    street: '5th Avenue',
                  },
                company: true,
                
            }
           
        };


    const saveStub = sinon.stub(Customer.prototype, 'save').resolves(req.body);

      // Mock de l'objet de réponse
      const res = { 
        status: jest.fn(() => res), 
        json: jest.fn(data => data)
      };

      // Appel de la méthode createCustomer
      await CustomerController.createCustomer(req, res);

      console.log(res.json)
      console.log("------------fi json--------------")
      console.log(req.body)

      // Assertions
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: 'John',
        lastname: 'DOE',
        email: 'john@example.com',
        phone: 1234567890,
        // Ajoutez d'autres propriétés si nécessaire
      }));

      // Restauration du stub
      saveStub.restore();





        
        // const response = await request(server).post('/customers').send(newCustomer);
        // expect(response.statusCode).toBe(201);
        // expect(response.body).toMatchObject(newCustomer);
    });
});
