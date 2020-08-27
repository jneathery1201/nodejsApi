const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const app = express();

//Import routes
const authRoute = require('./routes/auth');

dotenv.config();

//connect to db
mongoose.connect(
    process.env.DB_CONNECT, 
    { useUnifiedTopology: true,
      useNewUrlParser: true },
    () => console.log('connected to db')
);

//Middleware
app.use(express.json());
//route middleware
app.use('/api/user', authRoute);



app.listen(3000, () => console.log('server running'));