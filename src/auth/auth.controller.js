const Joi = require("joi");
const AuthService = require("./auth.service");
const { TokenExpiredError } = require("jsonwebtoken");
const Controller = require('../base/controller');

class AuthController extends Controller {
  static configureRoutes(router) {
    router.get("/auth", AuthController.getAuthenticatedUser);
    router.post("/auth/signup", AuthController.requestBodyValidator, AuthController.signUp);
    router.post("/auth/signin", AuthController.requestBodyValidator, AuthController.signIn);
  }

  static requestBodyValidationSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required(),
  });

  static async requestBodyValidator(req, res, next) {
    try {
      await AuthController.requestBodyValidationSchema.validateAsync(req.body);
      return next();
    } catch (e) {
      return res.status(400).send({ error: e.details[0].message });
    }
  }

  static async signUp(req, res) {
    try {
      const { success, message, data } = await AuthService.signUp(req.body);

      if (!success) {
        return res.status(409).json({ message });
      }

      AuthController.#sendHeadersWithNewTokensPair(data.id, res);
      return res.status(201).end();
    } catch {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  static async signIn(req, res) {
    try {
      const { success, message, data } = await AuthService.signIn(req.body);

      if (!success) {
        return res.status(401).json({ message });
      }

      AuthController.#sendHeadersWithNewTokensPair(data.id, res);
      return res.status(200).end();
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  static async getAuthenticatedUser(req, res) {
    try {
      const { success, message, data } = await AuthService.getAuthenticatedUser(
        req.headers.accessToken,
        req.headers.refreshToken
      );
        
      if (success) {
        AuthController.#sendHeadersWithNewTokensPair(data.id, res);
        data.password = null;
        res.status(200).json({ user: data });
      } else {
        res.status(400).json({ message });
      }
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return res.status(401).json({ message: "Access token expired" });
      }

      res.status(500).json({ message: "Something went wrong" });
    }
  }

  static #sendHeadersWithNewTokensPair(userId, res) {
    const { accessToken, refreshToken } =
      AuthService.generateTokensPair(userId);

    res.setHeader("Authorization", accessToken);
    res.setHeader("x-refresh-token", refreshToken);
  }
}

module.exports = AuthController;
