var db_config = require('../../config/db');

exports.getHoldings = (req, res) => {
    db_config.pool.getConnection((err, conn) => {
        if (err)
            return res.status(400).send(err);
        
        conn.query('SELECT * FROM ccass_holdings_info LIMIT 100', (err, result) => {
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