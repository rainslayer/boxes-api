const mongoose = require("mongoose");

const rewardSchema = mongoose.Schema({
  originalReward: { type: mongoose.Schema.Types.ObjectId, ref: "OriginalReward" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}); 

const RewardModel = mongoose.model("Reward", rewardSchema);

module.exports = RewardModel;
