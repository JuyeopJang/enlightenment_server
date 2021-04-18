'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('opinions', 'like', Sequelize.INTEGER)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('opinions', 'like')
  }
};
