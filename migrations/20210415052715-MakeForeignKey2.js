'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('magazines', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_userId2',
      references: { //Required field
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    queryInterface.addConstraint('images', {
      fields: ['magazineId'],
      type: 'foreign key',
      name: 'fk_magazineId',
      references: { //Required field
        table: 'magazines',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('magazines', 'fk_userId2');
    queryInterface.removeConstraint('images', 'fk_magazineId');
  }
};
