var mysql_db_config = require('../../config/mysql_db');
var wrapper = require('../../utils/request-wrapper');

exports.getHoldings = (req, res) => {
	mysql_db_config.pool.getConnection((err, conn) => {
		if (err) return res.status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE).send(wrapper.wrapper_response('Error', ''));

		conn.query('SELECT * FROM ccass_holdings_info LIMIT 10000', (err, result) => {
			if (err) {
				return res.status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE).send(wrapper.wrapper_response('Error', ''));
			}
			res.status(wrapper.STATUS_CODES.OK).send(wrapper.wrapper_response('success', result));
			conn.release();
		});
	});
};

exports.getHoldingsWithDate = (req, res) => {
	mysql_db_config.pool.getConnection((err, conn) => {
		if (err) return res.status(wrapper.STATUS_CODES.SERVER_ERROR).send(wrapper.wrapper_response('Error', ''));
		conn.query(
			'SELECT * FROM ccass_holdings_info WHERE (date BETWEEN ? AND ?) AND code = ?',
			[req.params.start_date, req.params.end_date, req.params.code],
			(err, result) => {
				if (err) {
					return res.status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE).send(wrapper.wrapper_response('Error', ''));
				}
				res.status(wrapper.STATUS_CODES.OK).send(wrapper.wrapper_response('success', result));
				conn.release();
			}
		);
	});
};

exports.getAllDates = (req, res) => {
	mysql_db_config.pool.getConnection((err, conn) => {
		if (err) return res.status(wrapper.STATUS_CODES.SERVER_ERROR).send(wrapper.wrapper_response('Error', ''));
		conn.query('SELECT DISTINCT date FROM ccass_holdings_info', [], (err, result) => {
			if (err) {
				return res.status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE).send(wrapper.wrapper_response('Error', ''));
			}
			res.status(wrapper.STATUS_CODES.OK).send(wrapper.wrapper_response('success', result));
			conn.release();
		});
	});
};
