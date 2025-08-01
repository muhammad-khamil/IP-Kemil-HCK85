'use strict';
const {
  Model
} = require('sequelize');
const { hashpassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Favorite, { foreignKey: 'userId' });
      User.hasMany(models.RestaurantReview, { foreignKey: 'userId' });
    }
  }
  User.init({
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Fullname is required' },
        notNull: { msg: 'Fullname is required' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { args: true, msg: 'Email format is invalid' },
        notEmpty: { msg: 'Email is required' },
        notNull: { msg: 'Email is required' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is required' },
        len: { args: [6, 100], msg: 'Password length must be between 6 and 100 characters' },
        notNull: { msg: 'Password is required' }
      }
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Role is required' },
        notNull: { msg: 'Role is required' }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user) => {
    user.password = hashpassword(user.password);
  })
  return User;
};