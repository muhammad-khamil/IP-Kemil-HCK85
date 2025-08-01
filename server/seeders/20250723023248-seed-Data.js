'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Use queryInterface instead of models to avoid potential URL parsing issues
      const users = require('../data/users.json').map((el) => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      });

      const restaurants = require('../data/restaurants.json').map((el) => {
        delete el.id;
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      });

      const foods = require('../data/foods.json').map((el) => {
        delete el.id;
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      });

      const restaurantReviews = require('../data/restaurantreviews.json').map((el) => {
        delete el.id;
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      });

      const favorites = require('../data/favorites.json').map((el) => {
        delete el.id;
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      });

      // Hash passwords for users using bcrypt
      const bcrypt = require('bcryptjs');
      for (let user of users) {
        user.password = bcrypt.hashSync(user.password, 10);
      }

      await queryInterface.bulkInsert('Users', users);
      await queryInterface.bulkInsert('Restaurants', restaurants);
      await queryInterface.bulkInsert('Foods', foods);
      await queryInterface.bulkInsert('RestaurantReviews', restaurantReviews);
      await queryInterface.bulkInsert('Favorites', favorites);
    } catch (error) {
      console.error('Error during seeding:', error);
      throw error;
    }
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

