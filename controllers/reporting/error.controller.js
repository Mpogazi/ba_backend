const logger = require("../../utils/logger");
const wrapper = require("../../utils/request-wrapper");

exports.logError = (req, res) => {
	const obj = req.body;
	let message = obj.data.message || "Undefined error message";
	let caller = obj.data.caller || "Unknown Caller";
	let loglevel = obj.data.loglevel || 5;
	logger.logIssue(message, caller, loglevel, function (success, error) {
		if (error) {
			res.status(wrapper.STATUS_CODES.SERVER_ERROR).send(
				wrapper.wrapper_response(
					"Fail",
					"server could not log the error"
				)
			);
		} else {
			res.status(wrapper.STATUS_CODES.OK).send(
				wrapper.wrapper_response("Success", success)
			);
		}
	});
};
