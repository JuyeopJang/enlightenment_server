'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'photo', Sequelize.STRING);
    await queryInterface.addColumn('users', 'email', Sequelize.STRING);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'photo');
    await queryInterface.removeColumn('users', 'email');
  }
};
