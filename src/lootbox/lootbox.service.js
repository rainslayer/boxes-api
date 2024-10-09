const Env = require("../common/env");
const SseMessages = require('../common/sseMessages');
const RewardService = require("../reward/reward.service");
const sseController = require("../sse/sse.controller");
const OriginalLootboxModel = require("./lootbox-original.model");
const LootboxModel = require("./lootbox.model");

class LootboxService {
  static async getAllOriginalLootboxes() {
    return OriginalLootboxModel.find().populate("content");
  }

  static async getById(id) {
    return LootboxModel.findById(id).populate({
      path: "originalLootbox",
      populate: {
        path: "content",
      },
    });
  }

  static async createNewOriginalLootbox({ name, content }) {
    return new OriginalLootboxModel({ name, content }).save();
  }

  static async createBatchForNewGameRound(gameId) {
    const originalLootboxes = await LootboxService.getAllOriginalLootboxes();
    const newLootboxes = originalLootboxes.flatMap((lootbox) =>
      Array.from(
        { length: Env.PER_LOOTBOX_NUMBER },
        () => new LootboxModel({ game: gameId, originalLootbox: lootbox.id })
      )
    );

    return LootboxModel.insertMany(newLootboxes);
  }

  static async tryOpenLootbox(lootboxId, userId, game) {
    const lootbox = await LootboxService.getById(lootboxId);

    if (!lootbox || !game.id === lootbox.game) {
      return { success: false, message: "Lootbox not found", data: lootbox };
    }

    const version = lootbox.__v;

    if (version > 0 || lootbox.openedBy) {
      return {
        success: false,
        message: "Lootbox was opened by another user",
        data: lootbox,
      };
    }

    const reward = await RewardService.getRandomReward(lootbox, userId);
    const updatedLootbox = await LootboxModel.findOneAndUpdate(
      { _id: lootbox.id, openedBy: null, __v: version },
      {
        openedBy: userId,
        reward: reward.id,
        __v: version + 1,
      },
      { new: true, runValidators: true }
    )
      .populate("originalLootbox")
      .populate("openedBy")
      .populate({
        path: "reward",
        populate: { path: "originalReward" },
      });

    if (!updatedLootbox) {
      await RewardService.removeReward(reward.id);

      return {
        success: false,
        message: "Lootbox was opened by another user",
        data: null,
      };
    }

    sseController.sendEvent({
      message: SseMessages.LootboxOpened,
      payload: updatedLootbox,
    });

    return {
      success: true,
      message: "",
      data: reward,
    };
  }
}

module.exports = LootboxService;
