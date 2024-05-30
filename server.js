const express = require('express')
const mongoose = require('mongoose')
// import bodyParser from 'body-parser';
// import axios from 'axios';

const orderRoutes = require( './routers/orderRoutes.js');

const app = express();
app.use('/api', orderRoutes);
const url = 'mongodb+srv://papa:passer123@cluster0.1qaei.mongodb.net/customers?retryWrites=true&w=majority&appName=Cluster0';
function connect(){
  try{
      mongoose.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true
      });
      console.log('Connected to the database');
  }
  catch(err){
      console.log(err);
  }
}
connect();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;
