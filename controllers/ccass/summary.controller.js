var mysql_db_confi = require('../../config/mysql_db');

exports.getSummary = (req, res) => {
    mysql_db_confi.pool.getConnection((err, conn) => {
        if (err)
            return res.status(400).send(err);
        conn.query('SELECT * FROM ccass_summary_info LIMIT 10000', (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            
            res.send(result);
            conn.release();
        });
    });
}
