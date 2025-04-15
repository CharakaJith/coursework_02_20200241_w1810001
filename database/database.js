const { Sequelize } = require('sequelize');

// connect to the SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3', // database location
});

module.exports = sequelize;
