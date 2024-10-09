const mongoose = require("mongoose");

const originalRewardSchema = mongoose.Schema({
  name: { type: String, required: true },
  rarity: {
    type: String,
    enum: ["common", "rare", "epic", "legendary"],
    required: true,
  },
});

const OriginalRewardModel = mongoose.model("OriginalReward", originalRewardSchema);

module.exports = OriginalRewardModel;
