'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Restaurants', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Foods', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Restaurants', 'imageUrl');
    await queryInterface.removeColumn('Foods', 'imageUrl');
  }
};
