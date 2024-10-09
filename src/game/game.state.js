const SseMessages = require("../common/sseMessages");
const sseController = require("../sse/sse.controller");
const GameService = require("./game.service");

class GameState {
  intervalBetweenRounds = 2 * 60 * 1000;

  constructor() {
    this.interval = setInterval(this.startNewRound, this.intervalBetweenRounds);
  }

  async startNewRound() {
    const newRound = await GameService.startNewRound();
    sseController.sendEvent({
      message: SseMessages.NewRound,
      payload: newRound,
    });
  }
}

module.exports = GameState;
