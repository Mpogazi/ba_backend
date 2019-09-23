const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();

const stocksController = require('./controllers/ccass/stock.controller');
const holdingsController = require('./controllers/ccass/holdings.controller');
const summaryController = require('./controllers/ccass/summary.controller');

// configs for the app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


// Apis
app.get('/', (req, res) => { res.send('We are hitting the ground running');});
app.get('/holdings',holdingsController.getHoldings);
app.get('/stock', stocksController.getStock);
app.get('/summary', summaryController.getSummary);

const port = process.env.PORT || 3000;
app.listen(port, console.log(`App running on {$port}`));

/**
 * var sql = 'SELECT * FROM holdings WHERE name = ? OR address = ?
 * con.query(sql, [name, adr], function (err, result) {
 *  if (err) throw err;
 *  console.log(result);
 * });
 * 
 */