const express = require('express');
const AuthController = require('../auth/auth.controller');
const RewardController = require('../reward/reward.controller');
const LootboxController = require('../lootbox/lootbox.controller');
const GameController = require('../game/game.controller');
const SseController = require('../sse/sse.controller');

const controllers = [AuthController, RewardController, LootboxController, GameController, SseController];

const router = express.Router();
controllers.forEach((controller) => controller.configureRoutes(router));

module.exports = router;