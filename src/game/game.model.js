const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const gameSchema = mongoose.Schema({    
  round: { type: Number, default: 1 },
  lootboxes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lootbox" }],
}, { timestamps: true });

gameSchema.plugin(AutoIncrement, { inc_field: "round" });

const GameModel = mongoose.model("Game", gameSchema);

module.exports = GameModel;           