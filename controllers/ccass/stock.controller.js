var db_config = require('../../config/db');

exports.getStock = (req, res) => {
    db_config.pool.getConnection((err, conn) => {
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