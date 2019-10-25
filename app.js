const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();

// Setting up Mongodb
var config = require('./config/config').get(process.env.NODE_ENV);
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect(config.mongo.uri, { useUnifiedTopology: true, useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDb Connection error'));

const stocksController = require('./controllers/ccass/stock.controller');
const holdingsController = require('./controllers/ccass/holdings.controller');
const summaryController = require('./controllers/ccass/summary.controller');
const userController = require('./controllers/user/user.controller');

// configs for the app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


// Apis
app.get('/', (req, res) => { res.send('We are hitting the ground running');});
app.get('/holdings',holdingsController.getHoldings);
app.get('/stock', stocksController.getStock);
app.get('/summary', summaryController.getSummary);

app.post('/signmeup', userController.signupUser);
app.post('/signup', function(req, res) {
    res.send('post request received');
});

const port = process.env.PORT || 3000;
app.listen(port, console.log('App running on ', port));
