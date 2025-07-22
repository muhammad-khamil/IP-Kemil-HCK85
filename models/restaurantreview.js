'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RestaurantReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RestaurantReview.belongsTo(models.User, { foreignKey: 'userId' });
      RestaurantReview.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' });
    }
  }
  RestaurantReview.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'UserId is required' },
        notNull: { msg: 'UserId is required' }
      }
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'RestaurantId is required' },
        notNull: { msg: 'RestaurantId is required' }
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: 1, msg: 'Rating must be at least 1' },
        max: { args: 5, msg: 'Rating must be at most 5' },
        notNull: { msg: 'Rating is required' }
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Comment is required' },
        notNull: { msg: 'Comment is required' }
      }
    }
  }, {
    sequelize,
    modelName: 'RestaurantReview',
  });
  return RestaurantReview;
};