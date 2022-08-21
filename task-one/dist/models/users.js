"use strict";
const user = require("mongoose");
const userSchema = user.Schema({
    firstname: {
        type: String,
        required: [true, "Please add firstname"],
    },
    lastname: {
        type: String,
        required: [true, "Please add last name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
    },
    phone: {
        type: String,
        required: [true, "Please add your phone number"],
    },
    dob: {
        type: String,
        required: [true],
    },
});
module.exports = user.model("Users", userSchema);
