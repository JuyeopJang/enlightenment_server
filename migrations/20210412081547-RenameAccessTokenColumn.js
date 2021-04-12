'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'accessToken', 'googleId')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'googleId', 'accessToken')
  }
};
