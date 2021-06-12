const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Friends", {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      primaryKey: true,
    },
    friend: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    confirm: {
      type: DataTypes.BOOLEAN
    }
  });
};
