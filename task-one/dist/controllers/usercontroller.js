"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model = require("../models/users");
const Viewable = require("../models/usersAccountInfo");
const Trans = require("../models/userTransactions");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { userSignUp, userLoginIn, userTransaction } = require("../utils");
const { v4: uuidv4 } = require("uuid");
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
    });
};
const generateAccountNum = async () => {
    const accountNumber = (Math.random() * 8 ** 8).toFixed(0);
    const existingAccountNumber = await Viewable.find({
        account_nr: `30${accountNumber}`,
    });
    while (existingAccountNumber.length > 0) {
        await generateAccountNum();
    }
    return accountNumber;
};
const getUserDetails = asyncHandler(async (req, res) => {
    const userId = req.cookies.Uid;
    const userAccountDetails = await Viewable.find({ userId: userId });
    const userInfo = await Model.find({ _id: userId });
    res.status(201).render("dashboard", {
        title: "Home",
        accountDetails: [...userAccountDetails],
        userDetails: [...userInfo],
        token: req.cookies.Token,
        uid: req.cookies.Uid,
        user: req.cookies.Username,
    });
});
const getTransactions = asyncHandler(async (req, res) => {
    const userId = req.cookies.Uid;
    const user = await Viewable.find({ userId: userId });
    const page = Number(req.params.page);
    const limit = Number(req.params.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    if (page > limit) {
        res.status(500);
        throw new Error("Bad request");
    }
    const allDebitTransaction = await Trans.find({
        senderAccount_nr: user[0].account_nr,
    });
    const allCreditTransaction = await Trans.find({
        receiverAccount_nr: user[0].account_nr,
    });
    const limitedDebitTransaction = allDebitTransaction.slice(startIndex, endIndex);
    const limitedCreditTransaction = allCreditTransaction.slice(startIndex, endIndex);
    res.status(201).render("transactions", {
        title: "Your History",
        orders: [...limitedCreditTransaction],
        debitorders: [...limitedDebitTransaction],
        token: req.cookies.Token,
        uid: req.cookies.Uid,
        user: req.cookies.Username,
    });
});
const getUserAccount = asyncHandler(async (req, res) => {
    const userId = req.cookies.Uid;
    const user = await Viewable.find({ userId: userId });
    res.status(201).render("verifyAccount", {
        title: "Verify Account",
        account_no: user[0].account_nr,
        token: req.cookies.Token,
        user: req.cookies.Username,
    });
});
const getReceiverAccount = asyncHandler(async (req, res) => {
    const userId = req.cookies.Uid;
    const user = await Viewable.find({ userId: userId });
    const receiveFromSender = await Viewable.find({
        account_nr: req.body.receiverAccount,
    });
    if (receiveFromSender.length > 0) {
        const receiver = await Model.find({
            _id: receiveFromSender[0].userId,
        });
        if (user[0].account_nr === receiveFromSender[0].account_nr) {
            res.status(404);
            throw new Error("Enter a different account number");
        }
        res.status(201).render("make-transfer", {
            title: "Transfer",
            name: `${receiver[0].firstname} ${receiver[0].lastname}`,
            account_no: user[0].account_nr,
            receiverAcct: receiveFromSender[0].account_nr,
            token: req.cookies.Token,
            user: req.cookies.Username,
        });
    }
    else {
        res.status(404);
        throw new Error("Account not found");
    }
});
const performTransactions = asyncHandler(async (req, res) => {
    const body = req.body;
    await userTransaction().validateAsync({
        senderAccount: body.senderAccount,
        receiverAccount: body.receiverAccount,
        amount: body.amount,
        description: body.description,
        password: body.password,
    });
    if (typeof Number(body.amount) !== "number" || Number(body.amount) < 100) {
        res.status(401);
        throw new Error("Invalid amount");
    }
    const user = await Model.find({ _id: req.cookies.Uid });
    if (user.length > 0 &&
        (await bcrypt.compare(body.password, user[0].password))) {
        // TODO: find sender account and check if balance is sufficient for transaction
        const senderAccount = await Viewable.find({
            account_nr: body.senderAccount,
        });
        // TODO: check for fraudulent moves
        const verifyUser = await Viewable.find({ userId: req.cookies.Uid });
        if (verifyUser[0].account_nr !== body.senderAccount) {
            res.status(500);
            throw new Error("You be thief!");
        }
        if (senderAccount[0].balance < body.amount) {
            res.status(401);
            throw new Error("Insufficient funds");
        }
        // TODO: find sender account and deduct amount from his balance
        const senderBalance = senderAccount[0].balance - Number(body.amount);
        await Viewable.updateOne({ account_nr: body.senderAccount }, {
            balance: senderBalance,
        });
        // TODO: find receiver account and add amount to his balance
        const receiverAccount = await Viewable.find({
            account_nr: body.receiverAccount,
        });
        const receiverBalance = receiverAccount[0].balance + Number(body.amount);
        await Viewable.updateOne({ account_nr: body.receiverAccount }, {
            balance: receiverBalance,
        });
        // TODO: generate receipt for both sender and receiver
        await Trans.create({
            reference: uuidv4(),
            senderAccount_nr: body.senderAccount,
            amount: body.amount,
            receiverAccount_nr: body.receiverAccount,
            transferDescription: body.description,
        });
        res.status(201).render("404", {
            title: "Successful",
            message: "Transaction successful",
            token: req.cookies.Token,
            user: req.cookies.Username,
        });
    }
    else {
        res.status(400);
        throw new Error("Invalid password");
    }
});
const registerUser = asyncHandler(async (req, res) => {
    const body = req.body;
    await userSignUp().validateAsync({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
        phone: body.phone,
        dob: body.dob,
    });
    if (body.password !== body.confirmPassword) {
        res.status(400);
        throw new Error("Passwords do not match");
    }
    const { firstName, lastName, email, password, phone, dob } = req.body;
    // Check if user exists
    const userExists = await Model.find({ email: email.toLowerCase() });
    if (userExists.length > 0) {
        res.status(400);
        throw new Error("User already exists");
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create user
    const user = await Model.create({
        firstname: firstName,
        lastname: lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        dob,
    });
    const yourAccountNumber = await generateAccountNum();
    const viewableInfo = await Viewable.create({
        userId: user._id,
        account_nr: `30${yourAccountNumber}`,
        balance: 5000,
    });
    if (user) {
        const mytoken = generateToken(user._id);
        res.cookie("Token", mytoken);
        res.cookie("Uid", user._id);
        res.cookie("Username", user.firstname);
        res.cookie("Balance", viewableInfo.balance);
        res.status(302).redirect("/home");
    }
});
const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const body = req.body;
    await userLoginIn().validateAsync({
        email: body.email,
        password: body.password,
    });
    const user = await Model.find({ email: email.toLowerCase() });
    if (user.length > 0 && (await bcrypt.compare(password, user[0].password))) {
        const userInfo = await Viewable.find({ userId: user[0]._id });
        const mytoken = generateToken(user[0]._id);
        res.cookie("Token", mytoken);
        res.cookie("Uid", user[0]._id);
        res.cookie("Username", user[0].firstname);
        res.cookie("Balance", userInfo[0].balance);
        res.status(302).redirect("/home");
    }
    else {
        res.status(400);
        throw new Error("Invalid username or password");
    }
});
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("Token", "");
    res.cookie("Uid", "");
    res.cookie("Username", "");
    res.status(302).redirect("/login");
});
module.exports = {
    registerUser,
    userLogin,
    logoutUser,
    getUserDetails,
    getTransactions,
    getUserAccount,
    performTransactions,
    getReceiverAccount,
};
