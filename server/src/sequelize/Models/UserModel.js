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
      },
      password: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
    });
}