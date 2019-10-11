var mysql_db_config = require('../../config/mysql_db');

exports.getHoldings = (req, res) => {
    mysql_db_config.pool.getConnection((err, conn) => {
        if (err)
            return res.status(400).send(err);
        
        conn.query('SELECT * FROM ccass_holdings_info LIMIT 10000', (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            
            res.send(result);
            // closing the connection
            // Always avoiding connection leaks
            conn.release();
        });
    });   
}