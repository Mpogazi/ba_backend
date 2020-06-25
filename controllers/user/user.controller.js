const userModel = require("../../models/user/user.model");
const reasons = require("../../models/user/user.model").FailReason;
const wrapper = require("../../utils/request-wrapper");
const crypto = require("crypto");

exports.signupUser = (req, res) => {
	let newUser = new userModel.User({
		name: req.body.firstName + " " + req.body.lastName,
		email: req.body.email,
		contactNo: req.body.contact || "Empty",
		creationDate: new Date(),
		password: req.body.password,
		permissions: "User",
	}).save(function (err, response) {
		if (err) {
			if (err.code == 11000) {
				res.status(wrapper.STATUS_CODES.NOT_FOUND).send(
					wrapper.wrapper_response("error", "User Already exists")
				);
			} else {
				res.status(wrapper.STATUS_CODES.NOT_FOUND).send(
					wrapper.wrapper_response("error", "Error Loggin In")
				);
			}
		} else {
			req.session.user = { email: req.body.email, role: "User" };
			res.status(wrapper.STATUS_CODES.OK).send(
				wrapper.wrapper_response(
					"SUCCESS",
					removeInfo("password", response)
				)
			);
		}
	});
};

exports.addWatchlistParticipant = (req, res) => {
	var email = req.body.email;
	var participant = req.body.participant;
	userModel.User.addParticipant(email, participant, function (
		err,
		user,
		failReason
	) {
		if (user) {
			res.status(wrapper.STATUS_CODES.OK).send(
				wrapper.wrapper_response(
					"SUCCESS",
					removeInfo("password", user)
				)
			);
		}
	});
};

exports.addWatchlistStock = (req, res) => {};

exports.signinUser = (req, res) => {
	var email = req.body.email;
	var password = req.body.password;
	userModel.User.getAuthenticated(email, password, function (
		error,
		user,
		failReason
	) {
		if (user) {
			req.session.user = { email: email, role: user.permissions };
			res.status(wrapper.STATUS_CODES.OK).send(
				wrapper.wrapper_response(
					"SUCCESS",
					removeInfo("password", user)
				)
			);
		} else {
			var message;
			switch (failReason) {
				case reasons.NOT_FOUND:
					message = "User not Found";
					break;
				case reasons.PASSWORD_INCORRECT:
					message = "Incorrect Password";
					break;
				case reasons.MAX_ATTEMPTS:
					message = "Maximum number of attempts reached";
					break;
				default:
					message = "unknow error";
					break;
			}
			res.status(wrapper.STATUS_CODES.NOT_FOUND).send(
				wrapper.wrapper_response("error", message)
			);
		}
	});
};

exports.logout = (req, res) => {
	req.session.destroy(function (error) {
		if (error) {
			res.status(wrapper.STATUS_CODES.SERVER_ERROR).send(
				wrapper.wrapper_response("error", "Logged Out with Error")
			);
		} else {
			res.status(wrapper.STATUS_CODES.OK).send(
				wrapper.wrapper_response("SUCCESS", "Logged Out")
			);
		}
	});
};

function removeInfo(key, Obj) {
	Obj[key] = `¯\\_( ͡❛ ͜ʖ ͡❛)_/¯`;
	return Obj;
}
