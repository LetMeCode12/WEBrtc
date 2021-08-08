const { DataTypes, Model, Sequelize } = require("sequelize");


class Friends extends Model {

  static init(sequelize) {
    return super.init({
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
    }, { sequelize, modelName: "Friends" })
  } 

  static associate(models) {
    this.belongsTo(models.users);
  }
 }

module.exports = Friends;


