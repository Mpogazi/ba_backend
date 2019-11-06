var mysql_db_confi = require('../../config/mysql_db');
var wrapper = require('../../utils/request-wrapper');

exports.getSummary = (req, res) => {
    mysql_db_confi.pool.getConnection((err, conn) => {
        if (err)
            return res
                    .status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE)
                    .send(wrapper.wrapper_response("Error", ""));
        conn.query('SELECT * FROM ccass_summary_info LIMIT 10000', (err, result) => {
            if (err) {
                return res
                        .status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE)
                        .send(wrapper.wrapper_response("Error", ""));
            }
            res
                .status(wrapper.STATUS_CODES.OK)
                .send(wrapper.wrapper_response("success", result));
            conn.release();
        });
    });
}
