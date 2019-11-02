const userModel = require('../../models/user/user.model');
const reasons   = require('../../models/user/user.model').FailReason;
const mongoose = require('mongoose');

exports.signupUser = (req, res) => {
    let newUser = new userModel.User({
        name: req.body.name,
        email: req.body.email,
        contactNo: req.body.contact,
        creationDate: new Date(),
        password: req.body.password,
        permissions: 'new Idiot'        
    }).save(function (err, resp) {
        if (err) {
            if (err.code == 11000) {
                res.status(400).send('User Already exists');
            } else {
                res.status(400).send('Unknown Error occured');
            }
        } else {
            res.status(200).send(resp);
        }
    });
};

exports.signinUser = (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    userModel.User.getAuthenticated(email, password, function(error, user, failReason) {
        if (user) {
            res.status(200).send('Success');
        } else {
            switch (failReason) {
                case reasons.NOT_FOUND:
                    res.status(400).send('User not Found');
                    break;
                case reasons.PASSWORD_INCORRECT:
                    res.status(400).send('Incorrect Password');
                    break;
                case reasons.MAX_ATTEMPTS:
                    res.status(400).send('Maximum number of attempts reached');
                    break;
                default:
                    res.status(400).send('unknow error');
                    break;
            }
        }
    });
};

exports.destroySession = (req, res) => {

};

exports.startSession = (req, res) => {

};