'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // single post belongs to a single user
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
      });

      // single post has many likes
      Post.hasMany(models.Like, {
        foreignKey: 'postId',
      });

      // single post can have many comments
      Post.hasMany(models.Comment, {
        foreignKey: 'postId',
      });

      // single post belongs to a single country
      Post.belongsTo(models.Country, {
        foreignKey: 'countryId',
      });
    }
  }

  Post.init(
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
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      countryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      visitDate: {
        type: DataTypes.DATE,
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
      modelName: 'Post',
      tableName: 'Posts',
      underscored: true,
    }
  );

  return Post;
};
