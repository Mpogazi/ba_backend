const User = require('../../models/user/user.model');
const mongoose = require('mongoose');

exports.signupUser = (req, res) => {
    let newUser = new User.User({
        name: req.body.name,
        email: req.body.email,
        contactNo: req.body.contact,
        creationDate: new Date(),
        password: req.body.password,
        permissions: 'new Idiot'        
    }).save(function (err, resp) {
        console.log(err);
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(resp);
        }
    });
};

exports.signinUser = (req, res) => {

};

exports.destroySession = (req, res) => {

};

exports.startSession = (req, res) => {

};