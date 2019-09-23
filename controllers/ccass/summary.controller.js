var db_config = require('../../config/db');

exports.getSummary = (req, res) => {
    db_config.pool.getConnection((err, conn) => {
        if (err)
            return res.status(400).send(err);
        conn.query('SELECT * FROM ccass_summary_info LIMIT 10', (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            
            res.send(result);
            conn.release();
        });
    });
}
