const models = require('../../models');
const CustomError = require('../../util/customError');
const { DAO } = require('../../common/messages');
const { STATUS_CODE } = require('../../constants/app.constants');
const { ENTITY } = require('../../constants/entity.constants');

const reactDao = {
  insert: async (react) => {
    try {
      return await models.Like.create(react);
    } catch (error) {
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.LIKE, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  update: async (react) => {
    try {
      return await models.Like.update(
        {
          userId: react.userId,
          postId: react.postId,
          isLike: react.isLike,
        },
        {
          where: {
            id: react.id,
          },
        }
      );
    } catch (error) {
      throw new CustomError(DAO.FAILED.UPDATE(ENTITY.LIKE, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getByPost: async (postId, userId) => {
    try {
      return await models.Like.findAll({
        where: {
          userId: userId,
          postId: postId,
        },
      });
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.BY_USER(ENTITY.LIKE, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = reactDao;
