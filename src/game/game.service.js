const LootboxService = require("../lootbox/lootbox.service");
const GameModel = require("./game.model");

class GameService {
  static async getCurrentGame() {
    return GameModel.findOne()
      .sort({ round: -1 })
      .populate({
        path: "lootboxes",
        populate: { path: "originalLootbox" },
      })
      .populate({
        path: "lootboxes",
        populate: { path: "openedBy" },
      })
      .populate({
        path: "lootboxes",
        populate: { path: "reward", populate: "originalReward" },
      });
  }

  static async openLootbox(lootboxId, userId) {
    const game = await GameService.getCurrentGame();
    return LootboxService.tryOpenLootbox(lootboxId, userId, game);
  }

  static async startNewRound() {
    const newGame = await new GameModel().save();
    const newLootboxes = await LootboxService.createBatchForNewGameRound(
      newGame.id
    );
    const lootboxesIds = newLootboxes.map((l) => l.id);

    return GameModel.findOneAndUpdate(
      { _id: newGame.id },
      { lootboxes: lootboxesIds },
      { new: true, runValidators: true }
    )
      .populate({
        path: "lootboxes",
        populate: { path: "originalLootbox" },
      })
      .populate({
        path: "lootboxes",
        populate: { path: "openedBy" },
      })
      .populate({
        path: "lootboxes",
        populate: { path: "reward", populate: "originalReward" },
      });
  }
}

module.exports = GameService;
