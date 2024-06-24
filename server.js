const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const config = require('./config/config.js')
const orderRoutes = require( './routers/orderRoutes.js');
const { app: metricsApp } = require('./utils/metrics');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./utils/swagger.yaml');

dotenv.config();

const app = express();
app.use('/api', orderRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(metricsApp);

mongoose.connect(config.mongoURI, { useUnifiedTopology: true })
.then(() => console.log('Connected to Order DB'))
.catch(err => console.log(err));


app.listen(process.env.PORT, () => {
  console.log('Server is running on port 3003');
});

module.exports = app;
