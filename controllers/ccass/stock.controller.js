var mysql_db_confi = require("../../config/mysql_db");
var wrapper = require("../../utils/request-wrapper");

exports.getStock = (req, res) => {
	mysql_db_confi.pool.getConnection((err, conn) => {
		if (err)
			return res
				.status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE)
				.send(wrapper.wrapper_response("Error", ""));

		conn.query("SELECT * FROM ccass_stock_info LIMIT 10", (err, result) => {
			if (err) {
				return res
					.status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE)
					.send(wrapper.wrapper_response("Error", ""));
			} else {
				res.status(wrapper.STATUS_CODES.OK).send(
					wrapper.wrapper_response("success", result)
				);
			}
			conn.release();
		});
	});
};

// Might not be necessary.
exports.getStockOnDate = (req, res) => {
	mysql_db_confi.pool.getConnection((err, conn) => {
		if (err)
			return res
				.status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE)
				.send(wrapper.wrapper_response("Error", ""));

		conn.query(
			"SELECT code, ashare FROM ccass_stock_info WHERE ?",
			[req.params.date],
			(err, result) => {
				if (err) {
					return res
						.status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE)
						.send(wrapper.wrapper_response("Error", ""));
				} else {
					res.status(wrapper.STATUS_CODES.OK).send(
						wrapper.wrapper_response("success", result)
					);
				}
				conn.release();
			}
		);
	});
};

exports.getStatic = (req, res) => {
	mysql_db_confi.pool2.getConnection((err, conn) => {
		if (err)
			return res
				.status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE)
				.send(wrapper.wrapper_response("Error", "DB is down smh"));

		conn.query("SELECT * FROM static_stock_info", [], (err, result) => {
			if (err) {
				return res
					.status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE)
					.send(wrapper.wrapper_response("Error", ""));
			} else {
				res.status(wrapper.STATUS_CODES.OK).send(
					wrapper.wrapper_response("success", result)
				);
			}
			conn.release();
		});
	});
};

exports.getHistorical = (req, res) => {
	mysql_db_confi.pool2.getConnection((err, conn) => {
		if (err)
			return res
				.status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE)
				.send(wrapper.wrapper_response("Error", "DB is down smh"));

		// Always getting all the historical stock info
		// Because it'll allow to cache some of the data
		conn.query(
			"SELECT * FROM historical_stock_info WHERE yf_code = ?",
			[req.params.start_date, req.params.end_date, req.params.yf_code],
			(err, result) => {
				if (err) {
					return res
						.status(wrapper.STATUS_CODES.SERVICE_UNAVAILABLE)
						.send(wrapper.wrapper_response("Error", ""));
				} else {
					res.status(wrapper.STATUS_CODES.OK).send(
						wrapper.wrapper_response("success", result)
					);
				}
				conn.release();
			}
		);
	});
};
