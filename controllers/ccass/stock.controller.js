var mysql_db_confi = require('../../config/mysql_db');
var wrapper = require('../../utils/request-wrapper');

exports.getStock = (req, res) => {
    mysql_db_confi.pool.getConnection((err, conn) => {
        if (err)
            return res
                .status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE)
                .send(wrapper.wrapper_response("Error", ""));
        
        conn.query('SELECT * FROM ccass_stock_info LIMIT 10', (err, result) => {
            if (err) {
                return res
                        .status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE)
                        .send(wrapper.wrapper_response("Error", ""));
            } else {
                res
                    .status(wrapper.STATUS_CODES.OK)
                    .send(wrapper.wrapper_response("success", result));
            }
            conn.release();
        });
    });
}