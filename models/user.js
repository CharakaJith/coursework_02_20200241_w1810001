'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // single user has many posts
      User.hasMany(models.Post, {
        foreignKey: 'userId',
      });

      // single user can have many likes
      User.hasMany(models.Like, {
        foreignKey: 'userId',
      });

      // single user can have many comments
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
      });

      // who follows user
      User.belongsToMany(models.User, {
        as: 'Followers',
        through: models.Follow,
        foreignKey: 'followingId',
        otherKey: 'followerId',
      });

      // who user follow
      User.belongsToMany(models.User, {
        as: 'Following',
        through: models.Follow,
        foreignKey: 'followerId',
        otherKey: 'followingId',
      });
    }
  }

  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
      modelName: 'User',
      tableName: 'Users',
      underscored: true,
    }
  );

  return User;
};
