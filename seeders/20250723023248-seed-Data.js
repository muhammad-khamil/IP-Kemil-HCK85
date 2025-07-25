'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { User, Restaurant, Food, RestaurantReview, Favorite } = require('../models');

    const user = require('../data/users.json').map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    })

    const restaurant = require('../data/restaurants.json').map((el) => {
      delete el.id;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    })

    const food = require('../data/foods.json').map((el) => {
      delete el.id;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    })

    const restaurantReview = require('../data/restaurantreviews.json').map((el) => {
      delete el.id;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    })

    const favorite = require('../data/favorites.json').map((el) => {
      delete el.id;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    })

    await User.bulkCreate(user, { individualHooks: true });
    await queryInterface.bulkInsert('Restaurants', restaurant);
    await queryInterface.bulkInsert('Foods', food);
    await queryInterface.bulkInsert('RestaurantReviews', restaurantReview);
    await queryInterface.bulkInsert('Favorites', favorite);
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Users', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });

    await queryInterface.bulkDelete('Restaurants', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });
    await queryInterface.bulkDelete('Foods', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });
    await queryInterface.bulkDelete('RestaurantReviews', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });
    await queryInterface.bulkDelete('Favorites', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });
  }
}

