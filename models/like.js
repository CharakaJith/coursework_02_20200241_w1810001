'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      // single like belongs to a single user
      Like.belongsTo(models.User, {
        foreignKey: 'userId',
      });

      // single like belongs to a single post
      Like.belongsTo(models.Post, {
        foreignKey: 'postId',
      });
    }
  }

  Like.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isLike: {
        type: DataTypes.BOOLEAN,
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
      modelName: 'Like',
      tableName: 'Likes',
      underscored: true,
    }
  );

  return Like;
};
