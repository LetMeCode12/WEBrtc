const Sequelize = require("sequelize");
const UserModel = require("./Models/UserModel");

const sequelize = new Sequelize(
  "postgres://postgres:admin@localhost:5432/WEBrtc"
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = UserModel(sequelize);

module.exports = {
  db,
};
