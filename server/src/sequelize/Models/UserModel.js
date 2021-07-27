const { DataTypes, Model, Sequelize } = require("sequelize");


class User extends Model {
  static init(sequelize) {
    return super.init({
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
    }, { sequelize, modelName: "Users" })
  }

  static associate(models) {
    this.hasMany(models.friends, { onDelete: "cascade", hooks: true });
  }

}

module.exports = User

