const RandomService = require("../random/random.service");
const OriginalRewardModel = require("./reward-original.model");
const RewardModel = require("./reward.model");

class RewardService {
  static async getAllOriginalRewards() {
    return OriginalRewardModel.find();
  }

  static async getAllUserRewards(userId) {
    return RewardModel.find({ owner: userId }).populate("originalReward").sort({_id: -1});
  }

  static async createNewOriginalReward({ name, rarity }) {
    return new OriginalRewardModel({ name, rarity }).save();
  }

  static async createNewReward({ originalReward, owner }) {
    return new RewardModel({ originalReward, owner }).save();
  }

  static async removeReward(rewardId) {
    return RewardModel.findOneAndRemove(rewardId);
  }

  static async getRandomReward(lootbox, userId) {
    const { originalLootbox } = lootbox;
    const { content } = originalLootbox;
    const rewardValue = RandomService.generateRandomRewardValue();
    const rewardsPool = content.filter((c) => c.rarity === rewardValue);
    const originalReward = RandomService.getRandomArrayElement(rewardsPool);
    const newReward = await RewardService.createNewReward({
      originalReward,
      owner: userId,
    });

    return newReward;
  }
}

module.exports = RewardService;
