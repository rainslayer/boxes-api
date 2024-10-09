const Joi = require("joi");
const Controller = require("../base/controller");
const adminRoleMiddleware = require("../middlewares/adminRole");
const RewardService = require("./reward.service");
const loggedInUserMiddleware = require('../middlewares/signedInUser');

class RewardController extends Controller {
  static configureRoutes(router) {
    router.get(
      "/reward/original",
      adminRoleMiddleware,
      RewardController.getAllOriginalRewards
    );
    router.get(
      "/reward/owned",
      loggedInUserMiddleware,
      RewardController.getOwnedRewards
    );
    router.post(
      "/reward",
      [adminRoleMiddleware, RewardController.requestBodyValidator],
      RewardController.createNewReward
    );
  }

  static createNewRewardValidationSchema = Joi.object({
    name: Joi.string().required(),
    rarity: Joi.string()
      .valid("common", "rare", "epic", "legendary")
      .required(),
  });

  static async requestBodyValidator(req, res, next) {
    try {
      await RewardController.createNewRewardValidationSchema.validateAsync(
        req.body
      );
      return next();
    } catch (e) {
      return res.status(400).send({ error: e.details[0].message });
    }
  }

  static async getAllOriginalRewards(req, res) {
    try {
      const rewards = await RewardService.getAllOriginalRewards();

      return res.status(200).json({ rewards });
    } catch {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  static async getOwnedRewards(req, res) {
    try {
      const rewards = await RewardService.getAllUserRewards(req.user.id);

      return res.status(200).json({ rewards });
    } catch {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  static async createNewReward(req, res) {
    try {
      const reward = await RewardService.createNewOriginalReward(req.body);

      return res.status(201).json({ reward });
    } catch {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}

module.exports = RewardController;
