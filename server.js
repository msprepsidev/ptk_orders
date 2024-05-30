const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const connectDB = require('./db/connection');

const orderRoutes = require( './routers/orderRoutes.js');

dotenv.config();

const app = express();
app.use('/api', orderRoutes);
connectDB();

app.listen(process.env.PORT, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;
