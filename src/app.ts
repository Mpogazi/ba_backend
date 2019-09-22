import express from 'express';
import { db } from './config/db';

const app = express();
const port = 3000;
const conn = new db();

app.get('/', (req, res) => {
    res.send('We are hitting the ground running');
});

app.get('/holdings', (req, res) => {
    conn
    .getConn()
    .query(
        'SELECT * FROM ccass_holdings_info LIMIT 10', (err: any, result: any) => {
            if (err) {
                console.log(err);
                return;
            }
            res.send(result);
    });
});

app.get('/stock', (req, res) => {

});

app.get('/summary', (req, res) => {

});

app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});

/**
 * var sql = 'SELECT * FROM holdings WHERE name = ? OR address = ?
 * con.query(sql, [name, adr], function (err, result) {
 *  if (err) throw err;
 *  console.log(result);
 * });
 * 
 */