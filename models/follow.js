'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    static associate(models) {
      // user can be a follower
      User.belongsToMany(models.User, {
        as: 'follower',
        through: models.Follow,
        foreignKey: 'id',
      });

      // user can be following
      User.belongsToMany(models.User, {
        as: 'following',
        through: models.Follow,
        foreignKey: 'id',
      });
    }
  }

  Follow.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      modelName: 'Follow',
      tableName: 'Follows',
      underscored: true,
    }
  );

  return Follow;
};
