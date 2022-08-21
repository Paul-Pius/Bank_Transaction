"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode).render("404", {
        title: "Error",
        message: err.message,
        token: req.cookies.Token,
        user: req.cookies.Username,
    });
};
module.exports = {
    errorHandler,
};
