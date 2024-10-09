const assert = require("assert");
require('dotenv').config();

assert(process.env.MONGODB_URL);
assert(process.env.JWT_SECRET);
assert(process.env.PER_LOOTBOX_NUMBER);
assert(process.env.FE_ORIGIN);

class Env {
  static MONGODB_URL = process.env.MONGODB_URL;
  static JWT_SECRET = process.env.JWT_SECRET;
  static PER_LOOTBOX_NUMBER = process.env.PER_LOOTBOX_NUMBER;
  static FE_ORIGIN = process.env.FE_ORIGIN;
}

module.exports = Env; 