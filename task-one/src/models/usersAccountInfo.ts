const usersBasicData = require("mongoose");

const usersSchema = usersBasicData.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true],
    },
    account_nr: {
      type: String,
      required: [true],
    },
    balance: {
      type: Number,
      required: [true],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = usersBasicData.model("UserAccountInformation", usersSchema);
