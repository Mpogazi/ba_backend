const fs = require("fs");
const parentDir = process.env.PWD;

exports.logLevels = {
	NOTSET: 0,
	DEBUG: 1,
	INFO: 2,
	WARNING: 3,
	ERROR: 4,
	CRITICAL: 5,
};

exports.logIssue = (message, caller, loglevel, cb) => {
	let file_name =
		new Date().toString().split(" ").join("_") + "_" + caller + "_";

	switch (loglevel) {
		case this.logLevels.NOTSET:
			file_name += "NOTSET";
			break;
		case this.logLevels.DEBUG:
			file_name += "DEBUG";
			break;
		case this.logLevels.INFO:
			file_name += "INFO";
			break;
		case this.logLevels.WARNING:
			file_name += "WARNING";
			break;
		case this.logLevels.ERROR:
			file_name += "ERROR";
			break;
		case this.logLevels.CRITICAL:
			file_name += "CRITICAL";
			break;
		default:
			file_name += "NOTSET";
			break;
	}

	/**
	 * Currently this code assumes that the folder /reports/logs/
	 * exists. This is a tolerable assumption for version 1.0 of
	 * bowen_backend. However, it should be refactored to create
	 * the folder if it doesn't exist.
	 */
	const dir = parentDir + "/reports/logs/";
	const buffer = new Buffer(message);
	fs.open(dir + file_name + ".txt", "w", function (err, fd) {
		if (err) {
			cb(null, err + " error in open");
			console.error(err);
		}
		fs.write(fd, buffer, 0, buffer.length, null, function (err) {
			if (err) {
				cb(null, err + " error in write");
				console.error(err);
			}
			fs.close(fd, function () {
				cb("successfully saved the log", null);
			});
		});
	});
};
