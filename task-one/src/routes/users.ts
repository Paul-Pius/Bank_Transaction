const express = require("express");
const router = express.Router();
const {
  userLogin,
  registerUser,
  logoutUser,
  getUserAccount,
  getReceiverAccount,
  performTransactions,
  getTransactions,
} = require("../controllers/usercontroller");
const { protect } = require("../middlewares/auth");

router.route("/login").post(userLogin);
router.route("/register").post(registerUser);
router.get("/logout", protect, logoutUser);
router.post("/make-transfer/verify", protect, getReceiverAccount);
router.get("/make/transfer", protect, getUserAccount);
router.post("/make-transfer/balance", protect, performTransactions);
router.get("/mytransactions/:page/:limit", protect, getTransactions);

module.exports = router;
