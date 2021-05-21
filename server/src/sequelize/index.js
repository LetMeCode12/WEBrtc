const Sequelize = require("sequelize");
const FriendsModel = require("./Models/FriendsModel");
const UserModel = require("./Models/UserModel");

const sequelize = new Sequelize(
  "postgres://postgres:admin@localhost:5432/WEBrtc"
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = UserModel(sequelize);
db.friends = FriendsModel(sequelize);

db.users.hasMany(db.friends, { onDelete: "cascade", hooks: true });
db.friends.belongsTo(db.users);

module.exports = {
  db,
};
