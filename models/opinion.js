'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class opinion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  opinion.init({
    userId: DataTypes.INTEGER,
    ban: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    like: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'opinion',
  });
  return opinion;
};