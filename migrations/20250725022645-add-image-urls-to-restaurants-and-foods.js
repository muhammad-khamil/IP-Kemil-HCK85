'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Check if imageUrl column exists in Restaurants table
    const restaurantTableInfo = await queryInterface.describeTable('Restaurants');
    if (!restaurantTableInfo.imageUrl) {
      await queryInterface.addColumn('Restaurants', 'imageUrl', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    // Check if imageUrl column exists in Foods table
    const foodTableInfo = await queryInterface.describeTable('Foods');
    if (!foodTableInfo.imageUrl) {
      await queryInterface.addColumn('Foods', 'imageUrl', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  async down (queryInterface, Sequelize) {
    // Check if imageUrl column exists before removing
    const restaurantTableInfo = await queryInterface.describeTable('Restaurants');
    if (restaurantTableInfo.imageUrl) {
      await queryInterface.removeColumn('Restaurants', 'imageUrl');
    }

    const foodTableInfo = await queryInterface.describeTable('Foods');
    if (foodTableInfo.imageUrl) {
      await queryInterface.removeColumn('Foods', 'imageUrl');
    }
  }
};
