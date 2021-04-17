'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('opinions', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_userId',
      references: { //Required field
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('opinions', 'fk_userId');
  }
};
