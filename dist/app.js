"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const app = express_1.default();
const port = 3000;
const conn = new db_1.db();
app.get('/', (req, res) => {
    res.send('We are hitting the ground running');
});
app.get('/holdings', (req, res) => {
    conn
        .getConn()
        .query('SELECT * FROM ccass_holdings_info LIMIT 10', (err, result) => {
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
//# sourceMappingURL=app.js.map