const express      = require('express');
const bodyParser   = require('body-parser');
const path         = require('path');
const cookieParser = require('cookie-parser');
const csrf         = require('csurf');
const session      = require('express-session');
const crypto       = require('crypto');
const app          = express();

var { redisStore } = require('./config/redis');

/**
 *
 *
 */
var config = require('./config/config').get(process.env.NODE_ENV);
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect(config.mongo.uri, { useUnifiedTopology: true, useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDb Connection error'));

/**
 *
 *
 */
app.use(session({
    secret: crypto.createHash('sha256').update('bowen_users').digest('hex'),
    name: '_bowenUserSpace',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: redisStore
}));

/**
 *
 *
 */
const stocksController = require('./controllers/ccass/stock.controller');
const holdingsController = require('./controllers/ccass/holdings.controller');
const summaryController = require('./controllers/ccass/summary.controller');
const userController = require('./controllers/user/user.controller');
const errorHandlerController = require('./controllers/reporting/error.controller');

/**
 * 
 * 
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


/**
 * 
 *  
 */
var requireLogin = (req, res, next) => {
    if(!req.session.key) {
        res.send('You need to login');
    } else {
        next();
    }
}

var requireCsrf = csrf();

app.get('/', requireCsrf, (req, res) => { 
    res.cookie('-XSRF-TOKEN', req.csrfToken());
    res.send('Hello');
});
app.get('/holdings', requireLogin ,holdingsController.getHoldings);
app.get('/stock', requireLogin, stocksController.getStock);
app.get('/summary', requireLogin, summaryController.getSummary);

app.post('/signup', requireCsrf, userController.signupUser);
app.post('/signin', requireCsrf, userController.signinUser);
app.get('/logout', requireLogin, userController.logout);

app.post('/error-report', errorHandlerController.logError);

const port = process.env.PORT || 1400;
app.listen(port, console.log('App running on ', port));
