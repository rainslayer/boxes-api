const mongoose = require("mongoose");

const originalLootboxSchema = mongoose.Schema({
  name: { type: String, required: true },
  content: [{ type: mongoose.Schema.Types.ObjectId, ref: "OriginalReward" }], 
});

const OriginalLootboxModel = mongoose.model("OriginalLootbox", originalLootboxSchema);

module.exports = OriginalLootboxModel;   