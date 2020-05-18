const express      = require('express');
const bodyParser   = require('body-parser');
const path         = require('path');
const cookieParser = require('cookie-parser');
const csrf         = require('csurf');
const session      = require('express-session');
const crypto       = require('crypto');
const currency     = require('./utils/currency');
const app          = express();

var { redisStore } = require('./config/redis');
var { 
        time_hk, 
        get_yf_end_date 
    } = require('./utils/time');
var mongo_uri      = 'mongodb://127.0.0.1:27017/';

/**
 *
 *
 */
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect(mongo_uri, 
                { useUnifiedTopology: true, useNewUrlParser: true})
        .then(() => console.log ('MongoDb Connected ...'))
        .catch((error) => {
            throw error;
        });
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

// Allowing CORS for Testing
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

/**
 * 
 *  
 */
var requireLogin = (req, res, next) => { 
    console.log(req);
    next();
    // if(!req.session.key) {
    //     next();
    //     // res.send('You need to login');
    // } else {
    //     next();
    // }
}

app.get('/', (req, res) => { 
    // res.cookie('-XSRF-TOKEN', req.csrfToken());
    res.send(get_yf_end_date());
});

app.get('/holdings_between_dates/:start_date/:end_date/:code', requireLogin, holdingsController.getHoldingsWithDate);
app.get('/all_ccass_dates', requireLogin, holdingsController.getAllDates);
app.get('/holdings/', requireLogin ,holdingsController.getHoldings);
app.get('/stock', requireLogin, stocksController.getStock);
app.get('/static_stock_info', requireLogin, stocksController.getStatic);
app.get('/historical_stock_info/:start_date/:end_date/:yf_code', requireLogin, stocksController.getHistorical);

// Not necessary apparently
// app.get('/stock/:date', requireLogin, stocksController.getStockOnDate);




app.get('/summary', requireLogin, summaryController.getSummary);

app.post('/signup', userController.signupUser);
app.post('/signin', userController.signinUser);
app.get('/logout', requireLogin, userController.logout);

app.post('/error-report', errorHandlerController.logError);

const port = process.env.PORT || 1400;
app.listen(port, console.log('App running on ', port));
