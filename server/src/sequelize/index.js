const Sequelize = require("sequelize");
const Friends = require("./Models/FriendsModel");
const User = require("./Models/UserModel");

const sequelize = new Sequelize(
  "postgres://postgres:admin@localhost:5432/WEBrtc"
);

const models = {
  users: User.init(sequelize),
  friends: Friends.init(sequelize)
}

Object.values(models).filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(models));

module.exports = sequelize;
