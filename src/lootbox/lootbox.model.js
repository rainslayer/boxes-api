const mongoose = require("mongoose");

const lootboxSchema = mongoose.Schema({
  originalLootbox: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OriginalLootbox",
  },
  openedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  reward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reward",
    default: null,
  },
  game: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
});

const LootboxModel = mongoose.model("Lootbox", lootboxSchema);

module.exports = LootboxModel;
