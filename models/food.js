'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Food.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' });
      Food.hasMany(models.Favorite, { foreignKey: 'foodId' });
    }
  }
  Food.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' },
        notNull: { msg: 'Name is required' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Description is required' },
        notNull: { msg: 'Description is required' }
      }
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'ImageUrl is required' },
        notNull: { msg: 'ImageUrl is required' },
        isUrl: { msg: 'ImageUrl must be a valid URL' }
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Category is required' },
        notNull: { msg: 'Category is required' }
      }
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'RestaurantId is required' },
        notNull: { msg: 'RestaurantId is required' }
      }
    }
  }, {
    sequelize,
    modelName: 'Food',
    tableName: 'Foods'
  });
  return Food;
};