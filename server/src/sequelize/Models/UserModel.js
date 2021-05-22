const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("User", {
      id: {
        allowNull: false,
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      surrname: {
        type: DataTypes.STRING,
      },
      login: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
    });
}