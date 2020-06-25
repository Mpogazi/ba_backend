var mysql = require('mysql');

const pool = mysql.createPool({
	host: 'bowenanalytics-db.c6ax3bdwxsjr.us-east-1.rds.amazonaws.com',
	user: 'ba_read_only',
	password: 'ba_read_only',
	database: 'ba_db',
});

// For accessing the Yahoo Finance db
const pool2 = mysql.createPool({
	host: 'bowenanalytics-db.c6ax3bdwxsjr.us-east-1.rds.amazonaws.com',
	user: 'ba_read_only',
	password: 'ba_read_only',
	database: 'yf_db',
});

exports.pool = pool;
exports.pool2 = pool2;
