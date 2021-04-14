'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('opinions', 'electionName', Sequelize.STRING)
    queryInterface.addColumn('opinions', 'candidateName', Sequelize.STRING)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('opinions', 'candidateName')
    await queryInterface.removeColumn('opinions', 'electionName')
  }
};
