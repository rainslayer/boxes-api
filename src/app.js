const express = require("express");
const router = require("./common/router");
const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Env = require('./common/env');
const GameState = require('./game/game.state');
const cors = require('cors'); 

const app = express();  

app.use(cors({
  origin: Env.FE_ORIGIN,
  exposedHeaders: ["Authorization", "x-refresh-token", "Content-Type", "Cache-Control", "Connection", "Access-Control-Allow-Origin"]
}));
app.use(express.json());
app.use("/api", router);
 
mongoose.connect(Env.MONGODB_URL);
new GameState();

app.listen(process.env.PORT || 5000, () => {
  console.log("Server started");
});

module.exports = AutoIncrement;
