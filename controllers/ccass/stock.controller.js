var mysql_db_confi = require('../../config/mysql_db');

exports.getStock = (req, res) => {
    mysql_db_confi.pool.getConnection((err, conn) => {
        if (err)
            return res.status(400).send(err);
        
        conn.query('SELECT * FROM ccass_stock_info LIMIT 10', (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            
            res.status(200).send(result);
            // Closing the connectioon
            conn.release();
        });
    });
}