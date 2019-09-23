var mysql = require('mysql');

const pool = mysql.createPool({
    host: process.env.BOWEN_HOSTNAME || 'ba-db.clt2cjuppshj.ap-southeast-1.rds.amazonaws.com',
    user: process.env.BOWEN_USERNAME || 'ba_dev',
    password: process.env.BOWEN_DB_PASSWORD || 'dev',
    database: 'ba-db'
});


exports.pool = pool;