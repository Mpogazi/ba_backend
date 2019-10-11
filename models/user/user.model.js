const mongoose = require("mongoose"),
        Schema = mongoose.Schema;

let userSchema = new Schema({
    name: String,
    email: String,
    contactNo: String,
    creationDate: Date,
});

// Create a model using schema
let User = mongoose.model();

// Making the model available
module.exports = User;