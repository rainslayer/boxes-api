const Controller = require('../base/controller');
const GameService = require('./game.service');
const loggedInUserMiddleware = require('../middlewares/signedInUser');

class GameController extends Controller {
  static configureRoutes(router) {
    router.get("/game", loggedInUserMiddleware, GameController.getCurrentGame);
    router.post("/game/open-lootbox", loggedInUserMiddleware, GameController.openLootbox);      
  }

  static async openLootbox(req, res) {
    try {
      const { success, message, data } = await GameService.openLootbox(req.body.lootboxId, req.user.id);
      if (!success) {
        return res.status(400).json({ message });
      } 

      return res.status(200).json({ data });
    } catch (e) {
      return res.status(500).json({ message: "Something went wrong" })
    }
  }

  static async getCurrentGame(req, res) {
    try {
      const game = await GameService.getCurrentGame();

      return res.status(200).json({ game });
    } catch {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
}

module.exports = GameController;