var mysql = require('mysql');
var config= require('./config').get(process.env.NODE_ENV);

const pool = mysql.createPool({
    host: config.mysql.hostname,
    user: config.mysql.username,
    password: config.mysql.password,
    database: config.mysql.dbname
});


exports.pool = pool;