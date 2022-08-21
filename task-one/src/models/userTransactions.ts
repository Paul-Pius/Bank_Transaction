const mongoModel = require("mongoose");

const dbSchema = new mongoModel.Schema(
  {
    reference: {
      type: String,
      required: [true],
    },
    senderAccount_nr: {
      type: String,
      required: [true],
    },
    amount: {
      type: Number,
      required: [true],
    },
    receiverAccount_nr: {
      type: String,
      required: [true],
    },
    transferDescription: {
      type: String,
      required: [true],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoModel.model("Transaction", dbSchema);
