'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Countries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      official_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      common_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      capital: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      currency_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      languages: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      flag_url: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Countries');
  },
};
