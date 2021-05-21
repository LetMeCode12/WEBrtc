const { DataTypes } = require("sequelize");
const UserModel = require("./UserModel");

module.exports = (sequelize) => {
  return sequelize.define("Friends", {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      primaryKey: true,
    },
    friend: {
      type: DataTypes.UUID,
    },
  });
};
