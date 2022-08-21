"use strict";
const Joi = require("joi");
function userTransaction() {
    return Joi.object({
        senderAccount: Joi.string().required(),
        receiverAccount: Joi.string().required(),
        amount: Joi.number().required(),
        description: Joi.string().required(),
        password: Joi.string().required(),
    });
}
function userSignUp() {
    return Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        dob: Joi.string().required(),
        password: Joi.string().min(8).required(),
        confirmPassword: Joi.string().min(8).required(),
        phone: Joi.string().min(8).required(),
    });
}
function userLoginIn() {
    return Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    });
}
module.exports = {
    userSignUp,
    userLoginIn,
    userTransaction,
};
