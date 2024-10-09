const Joi = require("joi");
const Controller = require("../base/controller");
const adminRoleMiddleware = require("../middlewares/adminRole");
const LootboxService = require("./lootbox.service");

class LootboxController extends Controller {
  static configureRoutes(router) {
    router.get(
      "/lootbox",
      adminRoleMiddleware,
      LootboxController.getAllLootboxes
    );
    router.post("/lootbox", [adminRoleMiddleware, LootboxController.requestBodyValidator], LootboxController.createNewLootbox);
  }

  static createNewLootboxBodyValidator = Joi.object({
    name: Joi.string().required(),
    content: Joi.array().items(Joi.string().hex().length(24)).required(),
  });

  static async requestBodyValidator(req, res, next) {
    try {
      await LootboxController.createNewLootboxBodyValidator.validateAsync(
        req.body
      );
      return next();
    } catch (e) {
      return res.status(400).send({ error: e.details[0].message });
    }
  }

  static async getAllLootboxes(req, res) {
    try {
      const lootboxes = await LootboxService.getAllOriginalLootboxes();

      return res.status(200).json({ lootboxes });
    } catch {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  static async createNewLootbox(req, res) {
    try {
      const lootbox = await LootboxService.createNewOriginalLootbox(req.body);

      return res.status(201).json({ lootbox });
    } catch {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}

module.exports = LootboxController;
