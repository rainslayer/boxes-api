const Controller = require("../base/controller");
const Env = require("../common/env");
const SseMessages = require("../common/sseMessages");
const signedInUserMiddleware = require("../middlewares/signedInUser");

class SseController extends Controller {
  #pingInterval = 5 * 1000;

  configureRoutes(router) {
    router.get("/sse", signedInUserMiddleware, this.sseEndpoint);
    router.get(
      "/sse/connected-users",
      signedInUserMiddleware,
      this.getConnectedUsers
    );
  }

  constructor() {
    super();
    this.clients = {};
    this.sseEndpoint = this.sseEndpoint.bind(this);
    this.sendEvent = this.sendEvent.bind(this);
    this.getConnectedUsers = this.getConnectedUsers.bind(this);
    this.pingMessage = this.sendPingMessage.bind(this);
    this.sendPingMessage();
  }

  async sseEndpoint(req, res) {
    if ("user" in req) {
      const { login } = req.user;

      this.clients[login] = res;
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", Env.FE_ORIGIN);

      this.sendEvent({ message: SseMessages.UserConnected, payload: login });


      req.on("close", () => {
        delete this.clients[login];
        this.sendEvent({
          message: SseMessages.UserDisconnected,
          payload: login,
        });
        res.end();
      });
    }
  }

  async sendEvent({ message, payload }) {
    Object.values(this.clients).forEach((client) =>
      client.write(`data: ${JSON.stringify({ message, payload })}\n\n`)
    );
  }

  async getConnectedUsers(req, res) {
    res.status(200).json({ users: Object.keys(this.clients) });
  }

  sendPingMessage() {
    setInterval(() => {
      this.sendEvent({ message: "PING", payload: { timestamp: Date.now() } });
    }, this.#pingInterval);
  }
}

module.exports = new SseController();
