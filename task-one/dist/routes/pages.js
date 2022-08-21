"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const { getUserDetails } = require("../controllers/usercontroller");
const { protect } = require("../middlewares/auth");
router.get("/", protect, getUserDetails);
router.get("/home", protect, getUserDetails);
router.get("/register", (req, res) => {
    res.status(201).render("register", {
        title: "Register",
        token: req.cookies.Token,
        user: req.cookies.Username,
    });
});
router.get("/login", (req, res) => {
    res.status(201).render("login", {
        title: "Login",
        token: req.cookies.Token,
        user: req.cookies.Username,
    });
});
module.exports = router;
