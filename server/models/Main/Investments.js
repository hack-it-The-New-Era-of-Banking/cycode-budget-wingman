const mongoose = require("mongoose");

// unfinished
const investmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    jobTitle: {
      type: String,
    },
    earnedIncome: {
      type: mongoose.Types.Decimal128,
    },
    additionalCompensation: {
      type: mongoose.Types.Decimal128,
    },
    category: {
      type: String,
      enum: ["Passive", "Monthly"],
    },
    dateReceived: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Investment", investmentSchema);
