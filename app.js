const express = require('express');
const mongoose = require('mongoose');
const authroutes = require('./routes/authroutes');
const cookieparser = require('cookie-parser');
const { requireAuth } = require('./middleware/authmiddleware');


const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieparser());
app.use(authroutes);
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://alishahzil123:light299792458@cluster0.kyivr.mongodb.net/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));


