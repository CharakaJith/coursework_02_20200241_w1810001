'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    static associate(models) {
      // single country has a single currency
      Country.belongsTo(models.Currency, {
        foreignKey: 'currencyId',
        onDelete: 'CASCADE',
      });

      // single country can have many posts
      Country.hasMany(models.Post, {
        foreignKey: 'countryId',
      });
    }
  }

  Country.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      officialName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      commonName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capital: {
        type: DataTypes.STRING,
      },
      currencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      languages: {
        type: DataTypes.JSON,
      },
      flagUrl: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Country',
      tableName: 'Countries',
      underscored: true,
    }
  );

  return Country;
};
