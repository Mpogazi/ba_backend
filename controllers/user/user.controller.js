const User = require('../../models/user/user.model');
const mongoose = require('mongoose');

exports.signupUser = (req, res) => {
    let today = new Date();
    const user = new User.User({
        name: req.body.name,
        email: req.body.email,
        contactNo: req.body.contact,
        creationDate: today
    }).save((err, response) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(response)
        }
    });
};

exports.signinUser = (req, res) => {

};

exports.destroySession = (req, res) => {

};

exports.startSession = (req, res) => {

};