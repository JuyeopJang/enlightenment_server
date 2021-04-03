'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('opinions', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_userId',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })

    await queryInterface.addConstraint('opinions', {
      fields: ['candidateId'],
      type: 'foreign key',
      name: 'fk_candidateId',
      references: {
        table: 'candidates',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })

    await queryInterface.addConstraint('candidates', {
      fields: ['electionId'],
      type: 'foreign key',
      name: 'fk_electionId',
      references: {
        table: 'elections',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('opinions', 'fk_userId');
    await queryInterface.removeConstraint('opinions', 'fk_candidateId');
    await queryInterface.removeConstraint('candidates', 'fk_electionId');
  }
};
